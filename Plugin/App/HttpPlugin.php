<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Plugin\App;

use Closure;
use Magento\Framework\App\Http as AppHttp;
use Magento\Framework\App\ResponseInterface;
use Siteation\DebugBar\Collector\RequestCollector;
use Siteation\DebugBar\Model\AccessKey;
use Psr\Log\LoggerInterface;
use Siteation\DebugBar\Model\ProfileManager;
use Siteation\DebugBar\Model\ProfileStore;
use Siteation\DebugBar\Model\RequestEligibility;
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
 *
 * A request that throws is the one worth keeping. Before, an uncaught exception left
 * launch() before finalize ran, so the crash was the one request with no profile at all.
 * It is caught, recorded, stored and rethrown, and Magento renders its error page exactly
 * as it would have.
 */
class HttpPlugin
{
    public function __construct(
        private readonly RequestEligibility $eligibility,
        private readonly AccessKey $accessKey,
        private readonly ProfileManager $manager,
        private readonly ProfileStore $store,
        private readonly BarInjector $injector,
        private readonly ResponseInterface $response,
        private readonly LoggerInterface $logger
    ) {
    }

    public function aroundLaunch(AppHttp $subject, Closure $proceed): ResponseInterface
    {
        // The gate is the one call that runs before anything is guarded, and it reads config,
        // the area code and the client address. Nothing this module does may cost the page,
        // and that has to include deciding whether to do anything at all.
        try {
            $allowed = $this->eligibility->allows();
        } catch (Throwable $exception) {
            $this->log('could not decide whether to collect', $exception);

            return $proceed();
        }

        if (!$allowed) {
            return $proceed();
        }

        try {
            $this->manager->begin();
        } catch (Throwable $exception) {
            $this->manager->discard();
            $this->log('could not start', $exception);

            return $proceed();
        }

        try {
            $response = $proceed();
        } catch (Throwable $thrown) {
            $this->keepFailure($thrown);

            throw $thrown;
        }

        // The key arrived in the URL, so trade it for a cookie and let the address bar go
        // back to being an address bar. After proceed(), never before: the cookie manager
        // resolves its domain through the store, and at the top of launch() there is none.
        // The response it rides on is never shared, because the injector marks everything
        // it touches no-store.
        try {
            if ($this->accessKey->wasPresentedInUrl() && !$this->accessKey->issueCookie()) {
                $this->logger->warning('Siteation_DebugBar could not set the access key cookie.');
            }
        } catch (Throwable $exception) {
            $this->log('could not trade the access key for a cookie', $exception);
        }

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

    /**
     * Store what was collected before the throw, then get out of the way. The response was
     * never produced, so there is nothing to inject a bar into and no header to set: the
     * profile is found through the history, the report or MCP.
     */
    private function keepFailure(Throwable $thrown): void
    {
        try {
            $collector = $this->manager->collector('request');

            if ($collector instanceof RequestCollector) {
                $collector->captureException($thrown);
            }

            $this->store->put($this->manager->finalize($this->response));
        } catch (Throwable $exception) {
            $this->log('could not record a failed request', $exception);
        } finally {
            $this->manager->discard();
        }
    }

    private function log(string $what, Throwable $exception): void
    {
        $this->logger->warning(
            sprintf('Siteation_DebugBar %s: %s', $what, $exception->getMessage()),
            ['exception' => $exception]
        );
    }
}
