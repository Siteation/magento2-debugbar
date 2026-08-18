<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Model\Config\Source;

use Magento\Framework\Data\OptionSourceInterface;
use Siteation\DebugBar\Model\Redactor;

class ValuePolicy implements OptionSourceInterface
{
    /**
     * @return array<int, array{value: string, label: string}>
     */
    public function toOptionArray(): array
    {
        return [
            [
                'value' => Redactor::POLICY_FULL,
                'label' => __('Full: keep captured values')->render(),
            ],
            [
                'value' => Redactor::POLICY_MASKED,
                'label' => __('Masked: keep the shape, drop the text')->render(),
            ],
            [
                'value' => Redactor::POLICY_NONE,
                'label' => __('None: store no values')->render(),
            ],
        ];
    }
}
