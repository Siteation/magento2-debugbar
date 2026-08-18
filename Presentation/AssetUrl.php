<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Presentation;

use Magento\Framework\App\State;
use Magento\Framework\View\Asset\Repository as AssetRepository;
use Magento\Framework\View\DesignInterface;
use Throwable;

/**
 * Static URLs for the bar's own files.
 *
 * The theme is passed explicitly rather than left to the asset repository. On a full page
 * cache hit nothing ever initialises the design, so the repository falls back to an empty
 * theme path and builds a "frontend/_view/..." URL that no static handler will serve.
 * Asking for the configured theme id makes the repository resolve it through the cached
 * theme provider instead, which does not need a rendered page.
 */
class AssetUrl
{
    private const MODULE = 'Siteation_DebugBar::';

    public function __construct(
        private readonly AssetRepository $assetRepository,
        private readonly DesignInterface $design,
        private readonly State $appState
    ) {
    }

    public function for(string $file): string
    {
        try {
            return $this->assetRepository->getUrlWithParams(self::MODULE . $file, $this->params());
        } catch (Throwable) {
            return $this->assetRepository->getUrl(self::MODULE . $file);
        }
    }

    /**
     * @return array<string, mixed>
     */
    private function params(): array
    {
        $area = $this->appState->getAreaCode();
        $params = ['area' => $area];
        $themeId = $this->design->getConfigurationDesignTheme($area);

        if ($themeId) {
            $params['themeId'] = $themeId;
        }

        return $params;
    }
}
