<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Analysis\Rule;

use Siteation\DebugBar\Analysis\Finding;
use Siteation\DebugBar\Api\RuleInterface;

/**
 * Why a request failed, and where.
 *
 * A status alone sends the reader to the log, which is where they were before they opened
 * this. When the exception was caught it is named here instead, with the frame it stopped
 * at, which the bar turns into a link into the editor.
 */
class RequestErrorRule implements RuleInterface
{
    public function apply(array $profile): array
    {
        $request = $profile['sections']['request']['summary'] ?? [];
        $status = (int) ($request['status'] ?? 0);
        $exception = is_array($request['exception'] ?? null) ? $request['exception'] : null;

        if ($exception !== null) {
            return [$this->thrown($exception, $status)];
        }

        if ($status < 400) {
            return [];
        }

        return [
            new Finding(
                'request.error',
                $status >= 500 ? Finding::SEVERITY_ERROR : Finding::SEVERITY_WARNING,
                'overview',
                sprintf('The request returned HTTP %d.', $status),
                $status >= 500
                    ? 'The application could not complete the request.'
                    : 'The application refused the request or could not find what it asked for.',
                'Check the controller, the route, and the log for the exception behind it.',
                ['status' => $status, 'action' => $request['action'] ?? null],
                ['label' => 'Inspect request', 'section' => 'overview']
            ),
        ];
    }

    /**
     * @param array<string, mixed> $exception
     */
    private function thrown(array $exception, int $status): Finding
    {
        $where = sprintf('%s:%d', $exception['file'] ?? '?', $exception['line'] ?? 0);

        return new Finding(
            'request.exception',
            Finding::SEVERITY_ERROR,
            'overview',
            sprintf('The request threw %s.', $this->shortClass((string) ($exception['class'] ?? ''))),
            (string) ($exception['message'] ?? 'No message.'),
            'Everything below is what ran before it stopped. The frame is where it stopped, '
                . 'not necessarily where it went wrong.',
            [
                'class' => $exception['class'] ?? null,
                'status' => $status,
                'frames' => $exception['frames'] ?? [],
            ],
            ['label' => 'Inspect request', 'section' => 'overview'],
            $where
        );
    }

    /**
     * The last part of a namespaced class. The whole name is in the evidence; a message is
     * for reading.
     */
    private function shortClass(string $class): string
    {
        $parts = explode('\\', $class);

        return end($parts) ?: $class;
    }
}
