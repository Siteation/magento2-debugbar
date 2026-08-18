<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Model\Config\Source;

use Magento\Framework\Data\OptionSourceInterface;

/**
 * The editors worth naming, and the URL each one answers to.
 *
 * There are as many editors as there are developers, which is exactly why this is a
 * template rather than a list of integrations: `%f` is the file, `%l` is the line. The
 * named ones are a convenience over typing the template, not a limit on which editors
 * work. Anything with a URL scheme does.
 *
 * `%f` is absolute and therefore already starts with a slash, so a path style template
 * writes `://file%f` and not `://file/%f`. Zed answers the first and ignores the second
 * in silence, which is the worst way for a link to be wrong.
 */
class Editor implements OptionSourceInterface
{
    public const CUSTOM = 'custom';

    /** @var array<string, array{label: string, template: string}> */
    public const EDITORS = [
        'phpstorm' => ['label' => 'PhpStorm', 'template' => 'phpstorm://open?file=%f&line=%l'],
        'vscode' => ['label' => 'Visual Studio Code', 'template' => 'vscode://file%f:%l'],
        'vscode_insiders' => [
            'label' => 'Visual Studio Code Insiders',
            'template' => 'vscode-insiders://file%f:%l',
        ],
        'cursor' => ['label' => 'Cursor', 'template' => 'cursor://file%f:%l'],
        'windsurf' => ['label' => 'Windsurf', 'template' => 'windsurf://file%f:%l'],
        'zed' => ['label' => 'Zed', 'template' => 'zed://file%f:%l'],
        'sublime' => ['label' => 'Sublime Text', 'template' => 'subl://open?url=file://%f&line=%l'],
        'textmate' => ['label' => 'TextMate', 'template' => 'txmt://open?url=file://%f&line=%l'],
    ];

    /**
     * @return array<int, array{value: string, label: string}>
     */
    public function toOptionArray(): array
    {
        $options = [['value' => '', 'label' => __('Off: show the file and line as text')->render()]];

        foreach (self::EDITORS as $value => $editor) {
            $options[] = ['value' => $value, 'label' => $editor['label']];
        }

        $options[] = ['value' => self::CUSTOM, 'label' => __('Custom URL template')->render()];

        return $options;
    }
}
