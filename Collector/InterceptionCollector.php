<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Collector;

use Magento\Framework\App\ResponseInterface;
use Magento\Framework\Interception\PluginListInterface;
use ReflectionClass;
use ReflectionMethod;
use Siteation\DebugBar\Model\Clock;
use Siteation\DebugBar\Model\Redactor;
use Throwable;

/**
 * Which plugins were actually instantiated for this request, and on what.
 *
 * Nothing else in Magento surfaces this, and it is the fastest way to answer "why is this
 * method behaving oddly". There is no public API for it, so it reads two protected
 * properties off the plugin list and gives up quietly if a future release moves them.
 * A missing panel is an acceptable failure; a broken page is not.
 */
class InterceptionCollector extends AbstractCollector
{
    private const PROPERTY_INSTANCES = '_pluginInstances';
    private const PROPERTY_INHERITED = '_inherited';

    /**
     * The bar plugs into blocks, events and the cache, so without this it would mostly
     * report on itself and bury the application's own interception.
     */
    private const OWN_NAMESPACE = 'Siteation\\DebugBar\\';

    private bool $available = true;

    public function __construct(
        Redactor $redactor,
        Clock $clock,
        private readonly PluginListInterface $pluginList,
        int $maxItems = 500
    ) {
        parent::__construct($redactor, $clock, $maxItems);
    }

    public function label(): string
    {
        return 'Plugins';
    }

    /**
     * Read here rather than during the request: the plugin list only fills in as
     * interceptors are hit, so asking early would undercount. The response is nothing to
     * do with it and is ignored.
     */
    public function finalize(ResponseInterface $response): void
    {
        try {
            $this->collect();
        } catch (Throwable) {
            $this->available = false;
            $this->items = [];
        }
    }

    public function summary(): array
    {
        $plugins = 0;

        foreach ($this->items as $item) {
            $plugins += (int) $item['plugin_count'];
        }

        return [
            ...parent::summary(),
            'available' => $this->available,
            'intercepted_type_count' => count($this->items),
            'plugin_count' => $plugins,
        ];
    }

    public function payload(): array
    {
        $items = $this->items;

        usort($items, static fn (array $left, array $right): int
            => $right['plugin_count'] <=> $left['plugin_count']
            ?: strcmp((string) $left['type'], (string) $right['type']));

        return ['items' => $items];
    }

    private function collect(): void
    {
        $reflection = new ReflectionClass($this->pluginList);

        if (!$reflection->hasProperty(self::PROPERTY_INSTANCES)
            || !$reflection->hasProperty(self::PROPERTY_INHERITED)
        ) {
            $this->available = false;

            return;
        }

        $instances = $reflection->getProperty(self::PROPERTY_INSTANCES)->getValue($this->pluginList);
        $inherited = $reflection->getProperty(self::PROPERTY_INHERITED)->getValue($this->pluginList);

        if (!is_array($instances)) {
            $this->available = false;

            return;
        }

        ksort($instances);

        foreach ($instances as $type => $plugins) {
            if (!is_array($plugins)) {
                continue;
            }

            $entries = [];

            foreach (array_keys($plugins) as $code) {
                $definition = $inherited[$type][$code] ?? [];
                $class = (string) ($definition['instance'] ?? get_class($plugins[$code]));

                if (str_starts_with($class, self::OWN_NAMESPACE)) {
                    continue;
                }

                $entries[] = [
                    'code' => (string) $code,
                    'class' => $class,
                    'sort_order' => $definition['sortOrder'] ?? null,
                    'methods' => $this->methods($class),
                ];
            }

            if ($entries === []) {
                continue;
            }

            $this->record([
                'type' => (string) $type,
                'plugin_count' => count($entries),
                'plugins' => $entries,
            ]);
        }
    }

    /**
     * Read off the plugin class itself. Magento keeps the method list in a separate
     * definitions object whose shape is not part of any contract, while the before, around
     * and after naming convention is.
     *
     * @return array<string, string>
     */
    private function methods(string $class): array
    {
        if ($class === '' || !class_exists($class)) {
            return [];
        }

        $methods = [];

        foreach ((new ReflectionClass($class))->getMethods(ReflectionMethod::IS_PUBLIC) as $method) {
            $name = $method->getName();

            foreach (['before', 'around', 'after'] as $kind) {
                if (str_starts_with($name, $kind) && strlen($name) > strlen($kind)) {
                    $methods[lcfirst(substr($name, strlen($kind)))] = $kind;
                    break;
                }
            }
        }

        ksort($methods);

        return $methods;
    }
}
