<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Model\Config\Source;

use Magento\Framework\Data\OptionSourceInterface;

/**
 * The sections a developer can turn off.
 *
 * Findings and the overview are absent deliberately. The overview is how a stored profile is
 * identified by the history, the report and the MCP tools, and the findings are the answer
 * the rest of the bar is evidence for; neither is clutter anyone wants rid of.
 *
 * The ids match the ones the bar names its panels by, because the same setting decides what
 * is collected and what is drawn.
 */
class Sections implements OptionSourceInterface
{
    /**
     * @return array<int, array{value: string, label: string}>
     */
    public function toOptionArray(): array
    {
        return [
            ['value' => 'timeline', 'label' => __('Timeline')->render()],
            ['value' => 'queries', 'label' => __('Queries')->render()],
            ['value' => 'blocks', 'label' => __('Blocks')->render()],
            ['value' => 'observers', 'label' => __('Observers')->render()],
            ['value' => 'events', 'label' => __('Events')->render()],
            ['value' => 'cache', 'label' => __('Cache')->render()],
            ['value' => 'plugins', 'label' => __('Plugins')->render()],
            ['value' => 'alpine', 'label' => __('Alpine')->render()],
            ['value' => 'magewire', 'label' => __('Magewire')->render()],
            ['value' => 'history', 'label' => __('History')->render()],
        ];
    }
}
