<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Collector;

use Magento\Framework\App\Request\Http as HttpRequest;
use Magento\Framework\App\Response\HttpInterface as HttpResponse;
use Magento\Framework\App\ResponseInterface;
use Magento\Framework\App\State;
use Siteation\DebugBar\Model\Redactor;
use Throwable;

/**
 * What was asked for and what came back.
 *
 * Holds one record rather than a list, so the item cap in the parent never applies here.
 */
class RequestCollector extends AbstractCollector
{
    /** @var array<string, mixed> */
    private array $request = [];

    /** @var array<string, mixed> */
    private array $response = [];

    public function __construct(
        Redactor $redactor,
        private readonly HttpRequest $httpRequest,
        private readonly State $appState,
        int $maxItems = 1
    ) {
        parent::__construct($redactor, $maxItems);
    }

    public function key(): string
    {
        return 'request';
    }

    public function label(): string
    {
        return 'Request';
    }

    public function reset(): void
    {
        parent::reset();
        $this->request = [];
        $this->response = [];
    }

    public function capture(ResponseInterface $response): void
    {
        $this->request = [
            'method' => (string) $this->httpRequest->getMethod(),
            'path' => '/' . ltrim((string) $this->httpRequest->getPathInfo(), '/'),
            'route' => (string) $this->httpRequest->getRouteName(),
            'action' => (string) $this->httpRequest->getFullActionName(),
            'area' => $this->areaCode(),
            'is_ajax' => $this->httpRequest->isAjax(),
            'is_secure' => $this->httpRequest->isSecure(),
        ];

        $this->response = [
            'status' => $response instanceof HttpResponse
                ? (int) $response->getHttpResponseCode()
                : 200,
            'content_type' => $this->contentType($response),
        ];
    }

    public function summary(): array
    {
        return [
            ...parent::summary(),
            ...$this->request,
            ...$this->response,
        ];
    }

    public function payload(): array
    {
        return [
            'items' => [],
            'query_params' => $this->redactor->clean($this->httpRequest->getQueryValue() ?? []),
        ];
    }

    private function areaCode(): string
    {
        try {
            return (string) $this->appState->getAreaCode();
        } catch (Throwable) {
            return 'unknown';
        }
    }

    private function contentType(ResponseInterface $response): string
    {
        if (!$response instanceof HttpResponse) {
            return '';
        }

        $header = $response->getHeader('Content-Type');

        return $header === false ? '' : (string) $header->getFieldValue();
    }
}
