<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Model\Config\Backend;

use Magento\Framework\App\Cache\TypeListInterface;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\Event\ManagerInterface;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\Model\Context;
use Magento\Framework\Registry;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Siteation\DebugBar\Model\Config;
use Siteation\DebugBar\Model\Config\Backend\AccessKey;

/**
 * The floor has to be visible where it is crossed.
 *
 * Config refuses to resolve a key below it, which is the control, but a bar that silently
 * does nothing is a bug report rather than a message. This is the half that says so.
 */
class AccessKeyTest extends TestCase
{
    #[Test]
    public function aKeyBelowTheFloorIsRefusedWithSomethingToDoAboutIt(): void
    {
        $this->expectException(LocalizedException::class);
        $this->expectExceptionMessageMatches('/at least 32 characters.*openssl rand -hex 32/s');

        $this->field(str_repeat('a', Config::MIN_ACCESS_KEY_LENGTH - 1))->beforeSave();
    }

    #[Test]
    public function emptyStaysValidBecauseItMeansTheDeveloperMachine(): void
    {
        $field = $this->field('   ');

        $field->beforeSave();

        $this->assertSame('', $field->getValue(), 'and the whitespace does not become a key');
    }

    #[Test]
    public function aKeyAtOrPastTheFloorIsSavedTrimmed(): void
    {
        $key = str_repeat('a', Config::MIN_ACCESS_KEY_LENGTH);
        $field = $this->field(' ' . $key . ' ');

        $field->beforeSave();

        $this->assertSame($key, $field->getValue());
    }

    /**
     * Stubbed down to what AbstractModel::beforeSave() actually touches, which is the event
     * manager and nothing else.
     */
    private function field(string $value): AccessKey
    {
        $context = $this->createStub(Context::class);
        $context->method('getEventDispatcher')->willReturn($this->createStub(ManagerInterface::class));

        $field = new AccessKey(
            $context,
            $this->createStub(Registry::class),
            $this->createStub(ScopeConfigInterface::class),
            $this->createStub(TypeListInterface::class)
        );
        $field->setData('value', $value);

        return $field;
    }
}
