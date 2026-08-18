<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Controller\Profile;

use Magento\Framework\App\Action\HttpGetActionInterface;
use Magento\Framework\Controller\Result\Json;
use Magento\Framework\Controller\Result\JsonFactory;
use Magento\Framework\Controller\ResultInterface;
use Siteation\DebugBar\Model\Config;
use Siteation\DebugBar\Model\ProfileStore;
use Siteation\DebugBar\Model\RequestEligibility;
use Siteation\DebugBar\Presentation\ProfileSummary;

/**
 * Lists the profiles still on disk, newest first, for the bar's history section.
 *
 * Summaries only: the store keeps twenty profiles and a busy one is several hundred
 * kilobytes, so a list that carried whole profiles would be worse than the problem it
 * solves. The bar fetches the one it is asked for through View.
 *
 * Gated exactly as View is. An endpoint that hands out profile ids has to be behind the
 * same address check as the one that hands out profiles, or it is a way around it.
 */
class History implements HttpGetActionInterface
{
    public function __construct(
        private readonly JsonFactory $resultFactory,
        private readonly ProfileStore $store,
        private readonly ProfileSummary $summary,
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

        $profiles = [];

        foreach ($this->store->recent() as $profile) {
            $profiles[] = $this->summary->for($profile);
        }

        return $result->setData(['profiles' => $profiles, 'count' => count($profiles)]);
    }

    private function fail(Json $result, int $status, string $message): ResultInterface
    {
        return $result->setHttpResponseCode($status)->setData(['error' => $message]);
    }
}
