<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Plugin\App;

use Closure;
use Magento\Framework\App\Http as AppHttp;
use Magento\Framework\App\ResponseInterface;
use Psr\Log\LoggerInterface;
use Siteation\DebugBar\Model\Config;
use Siteation\DebugBar\Model\ProfileManager;
use Siteation\DebugBar\Model\ProfileStore;
use Siteation\DebugBar\Presentation\BarInjector;
use Throwable;

/**
 * The single entry hook.
 *
 * pub/index.php always creates App\Http, so bracketing launch() covers frontend,
 * adminhtml, GraphQL and REST at once, and still leaves the response modifiable because
 * Bootstrap::run() calls launch() before sendResponse().
 *
 * This has to be an around plugin, not before plus after. launch() switches the object
 * manager to the request's area, which makes PluginList reload its scoped data, and the
 * lazily inherited entry for App\Http does not survive that reload. An after listener
 * therefore dies in PluginList::getPlugin() with an undefined array key. An around plugin
 * is resolved before the switch, which is why Ignition takes the same route.
 *
 * Nothing here may break the page being debugged, so every failure discards the profile
 * and hands back the untouched response.
 */
class HttpPlugin
{
    public function __construct(
        private readonly Config $config,
        private readonly ProfileManager $manager,
        private readonly ProfileStore $store,
        private readonly BarInjector $injector,
        private readonly LoggerInterface $logger
    ) {
    }

    public function aroundLaunch(AppHttp $subject, Closure $proceed): ResponseInterface
    {
        if (!$this->config->isEnabled()) {
            return $proceed();
        }

        try {
            $this->manager->begin();
        } catch (Throwable $exception) {
            $this->manager->discard();
            $this->log('could not start', $exception);

            return $proceed();
        }

        $response = $proceed();

        try {
            $profile = $this->manager->finalize($response);
            $this->store->put($profile);
            $this->injector->inject($response, $profile);
        } catch (Throwable $exception) {
            $this->log('could not finish', $exception);
        } finally {
            $this->manager->discard();
        }

        return $response;
    }

    private function log(string $what, Throwable $exception): void
    {
        $this->logger->warning(
            sprintf('Siteation_DebugBar %s: %s', $what, $exception->getMessage()),
            ['exception' => $exception]
        );
    }
}
