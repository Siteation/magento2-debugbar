<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Model\Config\Source;

use Magento\Framework\App\Area;
use Magento\Framework\Data\OptionSourceInterface;

class Areas implements OptionSourceInterface
{
    /**
     * @return array<int, array{value: string, label: string}>
     */
    public function toOptionArray(): array
    {
        return [
            ['value' => Area::AREA_FRONTEND, 'label' => __('Storefront')->render()],
            ['value' => Area::AREA_ADMINHTML, 'label' => __('Admin')->render()],
            ['value' => Area::AREA_GRAPHQL, 'label' => __('GraphQL')->render()],
            ['value' => Area::AREA_WEBAPI_REST, 'label' => __('REST API')->render()],
        ];
    }
}
