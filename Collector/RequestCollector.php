<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Collector;

use Magento\Framework\App\Request\Http as HttpRequest;
use Magento\Framework\App\Response\HttpInterface as HttpResponse;
use Magento\Framework\App\ResponseInterface;
use Magento\Framework\App\State;
use Magento\Framework\HTTP\PhpEnvironment\Response as ReadableResponse;
use Siteation\DebugBar\Model\AccessKey;
use Siteation\DebugBar\Model\CallSiteResolver;
use Siteation\DebugBar\Model\Config;
use Siteation\DebugBar\Model\Clock;
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

    /** @var array<string, mixed>|null */
    private ?array $exception = null;

    public function __construct(
        Redactor $redactor,
        Clock $clock,
        private readonly HttpRequest $httpRequest,
        private readonly State $appState,
        private readonly Config $config,
        private readonly CallSiteResolver $callSites,
        int $maxItems = 1
    ) {
        parent::__construct($redactor, $clock, $maxItems);
    }

    public function label(): string
    {
        return 'Request';
    }

    public function reset(): void
    {
        parent::reset();
        $this->exception = null;
        $this->request = [];
        $this->response = [];
    }

    /**
     * What threw, when something did.
     *
     * A finding that says a request failed and not what failed sends the reader to the
     * log, which is where they were before they opened this. The message is redacted like
     * any other captured string: an exception is as likely to quote an email address as a
     * query is.
     */
    public function captureFailure(Throwable $exception): void
    {
        $this->exception = [
            'class' => $exception::class,
            'message' => $this->message($exception->getMessage()),
            'file' => $this->callSites->relativePath($exception->getFile()),
            'line' => $exception->getLine(),
            'frames' => $this->callSites->fromTrace($exception->getTrace()),
        ];
    }

    /**
     * The path, with the admin URL secret removed and a length it cannot exceed.
     *
     * Magento carries a per route CSRF token as a path segment, /key/<hash>/, so an
     * adminhtml profile would otherwise store it verbatim: the one part of a URL that is a
     * credential rather than a location. The path itself is kept whatever the value policy
     * says, because a profile you cannot identify is a profile you cannot use, and it is
     * bounded because nothing a visitor controls should reach a stored file unbounded.
     */
    private function path(): string
    {
        $path = '/' . ltrim((string) $this->httpRequest->getPathInfo(), '/');
        // Not `?? $path`: the segment being replaced is a credential, so a PCRE failure
        // must not fall back to the raw path. An unidentifiable request is a smaller loss
        // than a stored admin key, and the cast this replaces stored an empty path anyway.
        $path = preg_replace_callback(
            '#/key/[^/]+#i',
            static fn (): string => '/key/' . Redactor::REDACTED,
            $path
        ) ?? Redactor::REDACTED;

        return (string) $this->redactor->clean($path);
    }

    /**
     * An exception message follows the value policy like anything else captured.
     *
     * Magento interpolates without quoting, so "No such entity with email = jane@example.com"
     * survives cleanSql untouched: stripping quoted literals is the wrong tool here. Under
     * masked and none the class name is what is left, which still says what went wrong
     * without saying who it happened to.
     */
    private function message(string $message): string
    {
        $policy = $this->config->valuePolicy();

        if ($policy === Redactor::POLICY_NONE) {
            return '';
        }

        if ($policy === Redactor::POLICY_MASKED) {
            return Redactor::MASKED;
        }

        return $this->redactor->cleanSql($message);
    }

    public function finalize(ResponseInterface $response): void
    {
        $this->request = [
            'method' => (string) $this->httpRequest->getMethod(),
            'path' => $this->path(),
            'route' => (string) $this->httpRequest->getRouteName(),
            'action' => (string) $this->httpRequest->getFullActionName(),
            'area' => $this->areaCode(),
            'is_ajax' => $this->httpRequest->isAjax(),
            'is_secure' => $this->httpRequest->isSecure(),
        ];

        $this->response = [
            // Null, not 200, when the request threw. The response was never produced, and
            // Magento's own handler decides what the client gets after this runs. Guessing
            // 500 would be right most of the time and wrong in the history list the rest.
            'completed' => $this->exception === null,
            'status' => $this->exception !== null
                ? null
                : ($response instanceof HttpResponse ? (int) $response->getHttpResponseCode() : 200),
            'content_type' => $this->contentType($response),
            // Measured before the bar is injected, so it reports the application's
            // response rather than the application plus the bar.
            'response_bytes' => $this->responseBytes($response),
            'mode' => $this->mode(),
        ];
    }

    public function summary(): array
    {
        return [
            ...parent::summary(),
            ...$this->request,
            ...$this->response,
            // Only when there was one. A null on every profile would say a request threw
            // nothing, which is not the same as a request that was never asked.
            ...($this->exception === null ? [] : ['exception' => $this->exception]),
        ];
    }

    public function payload(): array
    {
        $query = (array) ($this->httpRequest->getQueryValue() ?? []);

        // The bootstrap request carries the access key in its URL, and that request is the
        // first thing profiled. Left here it would write the credential that gates the whole
        // module into the file it unlocks, in cleartext, under the default policy. The key
        // pattern would not catch it: this is a name only this module knows.
        unset($query[AccessKey::PARAM]);

        return [
            'items' => [],
            'query_params' => $this->redactor->cleanValues($query, $this->config->valuePolicy()),
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

    private function responseBytes(ResponseInterface $response): int
    {
        return $response instanceof ReadableResponse ? strlen((string) $response->getContent()) : 0;
    }

    private function mode(): string
    {
        try {
            return $this->appState->getMode();
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
