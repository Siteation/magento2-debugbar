<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Model;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use ReflectionClass;
use SimpleXMLElement;
use Siteation\DebugBar\Model\CollectionState;

/**
 * Plugins are built on every request, wherever the thing they wrap is built. Anything heavy
 * they hold must therefore sit behind a proxy in di.xml, or the bar costs a request its whole
 * collector set while it is off.
 */
class LazyPluginsTest extends TestCase
{
    private const PLUGINS = [
        'Plugin\\Db\\LoggerPlugin',
        'Plugin\\Event\\ManagerPlugin',
        'Plugin\\Event\\InvokerPlugin',
        'Plugin\\View\\BlockPlugin',
        'Plugin\\View\\LayoutPlugin',
        'Plugin\\App\\PageCacheKernelPlugin',
        'Plugin\\App\\CachePlugin',
    ];

    #[Test]
    public function everyHeavyArgumentOfAPluginIsAProxy(): void
    {
        $proxied = $this->proxied();

        foreach (self::PLUGINS as $plugin) {
            $class = 'Siteation\\DebugBar\\' . $plugin;
            $this->assertArrayHasKey($class, $proxied, $plugin . ' has no arguments in di.xml');

            foreach ((new ReflectionClass($class))->getConstructor()?->getParameters() ?? [] as $parameter) {
                $type = $parameter->getType()?->getName();

                if ($type === CollectionState::class) {
                    $this->assertArrayNotHasKey($parameter->getName(), $proxied[$class]);

                    continue;
                }

                $this->assertSame(
                    $type . '\\Proxy',
                    $proxied[$class][$parameter->getName()] ?? null,
                    sprintf('%s::$%s must be a proxy', $plugin, $parameter->getName())
                );
            }
        }
    }

    #[Test]
    public function everyPluginAsksTheStateRatherThanTheManager(): void
    {
        foreach (self::PLUGINS as $plugin) {
            $source = (string) file_get_contents(dirname(__DIR__, 3) . '/' . str_replace('\\', '/', $plugin) . '.php');

            $this->assertStringNotContainsString('manager->isCollecting()', $source, $plugin);
            $this->assertStringContainsString('state->isCollecting()', $source, $plugin);
        }
    }

    /**
     * @return array<string, array<string, string>>
     */
    private function proxied(): array
    {
        $xml = new SimpleXMLElement((string) file_get_contents(dirname(__DIR__, 3) . '/etc/di.xml'));
        $found = [];

        foreach ($xml->type as $type) {
            foreach ($type->arguments->argument ?? [] as $argument) {
                $found[(string) $type['name']][(string) $argument['name']] = trim((string) $argument);
            }
        }

        return $found;
    }
}
