<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Plugin\App;

use Magento\Framework\App\PageCache\Kernel;
use Magento\Framework\App\Response\Http as HttpResponse;
use Siteation\DebugBar\Collector\PageCacheCollector;
use Siteation\DebugBar\Model\CollectionState;
use Siteation\DebugBar\Model\ProfileManager;

/**
 * The two moments the built-in full page cache decides anything.
 *
 * load() answering means the page came from storage and nothing else ran. process() is
 * handed the response before it rewrites the headers, which is the only point at which
 * the Cache-Control the application chose can still be read.
 *
 * Varnish never calls either, which the collector accounts for.
 */
class PageCacheKernelPlugin
{
    public function __construct(
        private readonly CollectionState $state,
        private readonly ProfileManager $manager,
        private readonly PageCacheCollector $pageCache
    ) {
    }

    /**
     * @param Kernel $subject
     * @param HttpResponse|false $result
     * @return HttpResponse|false
     */
    public function afterLoad(Kernel $subject, $result)
    {
        if ($result !== false && $this->state->isCollecting()) {
            $this->manager->quietly('pagecache', fn () => $this->pageCache->servedFromCache());
        }

        return $result;
    }

    /**
     * @return null
     */
    public function beforeProcess(Kernel $subject, HttpResponse $response)
    {
        if ($this->state->isCollecting()) {
            $this->manager->quietly('pagecache', fn () => $this->pageCache->offered($response, $this->sentCookies()));
        }

        return null;
    }

    /**
     * Magento's cookie manager calls setcookie() rather than adding headers to the response,
     * so the cookies a page sets are only visible in the list PHP is about to send. Names
     * only: a cookie's value can be a credential.
     *
     * @return list<string>
     */
    private function sentCookies(): array
    {
        $names = [];

        // phpcs:ignore Magento2.Functions.DiscouragedFunction
        foreach (headers_list() as $line) {
            if (preg_match('/^Set-Cookie:\s*([^=;\s]+)=/i', $line, $match)) {
                $names[] = substr($match[1], 0, 100);
            }
        }

        return $names;
    }
}
