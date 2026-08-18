<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Controller\Profile;

use Magento\Framework\App\Action\HttpGetActionInterface;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\Controller\Result\Json;
use Magento\Framework\Controller\Result\JsonFactory;
use Magento\Framework\Controller\ResultInterface;
use Siteation\DebugBar\Analysis\ProfileComparer;
use Siteation\DebugBar\Model\Config;
use Siteation\DebugBar\Model\ProfileStore;
use Siteation\DebugBar\Model\RequestEligibility;

/**
 * Diffs two stored profiles.
 *
 * The comparison runs here rather than in the bar because it fingerprints query shapes,
 * and that logic already exists in QueryAnalyzer. Porting it to JavaScript would have
 * meant two definitions of "the same query" drifting apart. It also means the answer
 * crosses the wire instead of two whole profiles.
 *
 * Gated exactly as View and History are.
 */
class Compare implements HttpGetActionInterface
{
    public function __construct(
        private readonly RequestInterface $request,
        private readonly JsonFactory $resultFactory,
        private readonly ProfileStore $store,
        private readonly ProfileComparer $comparer,
        private readonly Config $config,
        private readonly RequestEligibility $eligibility
    ) {
    }

    public function execute(): ResultInterface
    {
        $result = $this->resultFactory->create();

        if (!$this->config->isEnabled() || !$this->config->allowsIp($this->eligibility->clientIp())) {
            return $this->fail($result, 404, 'Debug bar is disabled.');
        }

        $baselineId = (string) $this->request->getParam('baseline', '');
        $subjectId = (string) $this->request->getParam('subject', '');

        if (!ProfileStore::validId($baselineId) || !ProfileStore::validId($subjectId)) {
            return $this->fail($result, 400, 'Invalid profile id.');
        }

        if ($baselineId === $subjectId) {
            return $this->fail($result, 400, 'A profile cannot be compared with itself.');
        }

        $baseline = $this->store->get($baselineId);
        $subject = $this->store->get($subjectId);

        if ($baseline === null || $subject === null) {
            return $this->fail($result, 404, 'Profile not found or expired.');
        }

        return $result->setData($this->comparer->compare($baseline, $subject));
    }

    private function fail(Json $result, int $status, string $message): ResultInterface
    {
        return $result->setHttpResponseCode($status)->setData(['error' => $message]);
    }
}
