<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Controller\Profile;

use Magento\Framework\App\Action\HttpGetActionInterface;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\Controller\Result\Json;
use Magento\Framework\Controller\Result\JsonFactory;
use Magento\Framework\Controller\Result\RawFactory;
use Magento\Framework\Controller\ResultInterface;
use Siteation\DebugBar\Model\ProfileStore;
use Siteation\DebugBar\Model\RequestEligibility;
use Siteation\DebugBar\Presentation\ProfileReport;

/**
 * Serves one stored profile so the bar can load section payloads on demand.
 *
 * Only summaries travel in the page. A busy uncached page produces a profile of several
 * hundred kilobytes, which is not something to add to every response while developing.
 *
 * `format/markdown` returns the same profile written for a reader instead of a parser,
 * which is what the bar's copy button and anyone pasting into an assistant needs. One
 * renderer, in ProfileReport, shared with the console command.
 *
 * Gated on the same switch as the bar itself, so it is unreachable in production mode.
 */
class View implements HttpGetActionInterface
{
    public function __construct(
        private readonly RequestInterface $request,
        private readonly JsonFactory $resultFactory,
        private readonly RawFactory $rawFactory,
        private readonly ProfileStore $store,
        private readonly RequestEligibility $eligibility,
        private readonly ProfileReport $report
    ) {
    }

    public function execute(): ResultInterface
    {
        $result = $this->resultFactory->create();

        // The same gate as the bar. Without the address check this endpoint would be a
        // way around the allowlist rather than covered by it.
        // One gate, shared with the collector. An endpoint that answers someone the bar
        // would not have collected for is a way around it rather than a thing behind it.
        if (!$this->eligibility->allowsRead()) {
            return $this->fail($result, 404, 'Debug bar is disabled.');
        }

        $id = (string) $this->request->getParam('id', '');

        if (!ProfileStore::validId($id)) {
            return $this->fail($result, 400, 'Invalid profile id.');
        }

        $profile = $this->store->get($id);

        if ($profile === null) {
            return $this->fail($result, 404, 'Profile not found or expired.');
        }

        if ($this->request->getParam('format') === 'markdown') {
            return $this->rawFactory->create()
                ->setHeader('Content-Type', 'text/markdown; charset=utf-8')
                ->setContents($this->report->render($profile));
        }

        return $result->setData($profile);
    }

    private function fail(Json $result, int $status, string $message): ResultInterface
    {
        return $result->setHttpResponseCode($status)->setData(['error' => $message]);
    }
}
