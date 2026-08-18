<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Presentation;

use Magento\Framework\App\State;
use Magento\Framework\Component\ComponentRegistrar;
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
 *
 * URLs carry the built file's modification time. Magento's static version only changes on
 * a deploy, so without this a rebuilt bar keeps being served from the browser cache and
 * appears not to have changed at all.
 */
class AssetUrl
{
    private const MODULE_NAME = 'Siteation_DebugBar';
    private const MODULE = self::MODULE_NAME . '::';

    /** @var array<string, string> */
    private array $urls = [];

    public function __construct(
        private readonly AssetRepository $assetRepository,
        private readonly DesignInterface $design,
        private readonly State $appState,
        private readonly ComponentRegistrar $registrar
    ) {
    }

    public function for(string $file): string
    {
        return $this->urls[$file] ??= $this->build($file);
    }

    private function build(string $file): string
    {
        try {
            $url = $this->assetRepository->getUrlWithParams(self::MODULE . $file, $this->params());
        } catch (Throwable) {
            $url = $this->assetRepository->getUrl(self::MODULE . $file);
        }

        $version = $this->version($file);

        if ($version === null) {
            return $url;
        }

        return $url . (str_contains($url, '?') ? '&' : '?') . 'v=' . $version;
    }

    private function version(string $file): ?string
    {
        $root = $this->registrar->getPath(ComponentRegistrar::MODULE, self::MODULE_NAME);

        if ($root === null) {
            return null;
        }

        $path = $root . '/view/base/web/' . $file;

        if (!is_file($path)) {
            return null;
        }

        $modified = filemtime($path);

        return $modified === false ? null : dechex($modified);
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
