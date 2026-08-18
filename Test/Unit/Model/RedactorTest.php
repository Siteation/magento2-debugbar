<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Model;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Siteation\DebugBar\Model\Redactor;

class RedactorTest extends TestCase
{
    private Redactor $redactor;

    protected function setUp(): void
    {
        $this->redactor = new Redactor(maxDepth: 3, maxStringLength: 20, maxItemsPerArray: 3);
    }

    #[Test]
    #[DataProvider('sensitiveKeys')]
    public function itRedactsSensitiveKeys(string $key): void
    {
        $clean = $this->redactor->clean([$key => 'secret-value']);

        $this->assertSame(Redactor::REDACTED, $clean[$key]);
    }

    /**
     * @return array<string, array{string}>
     */
    public static function sensitiveKeys(): array
    {
        return [
            'password' => ['password'],
            'api key' => ['api_key'],
            'token' => ['access_token'],
            'authorization' => ['Authorization'],
            'cookie' => ['cookie'],
            'session' => ['session_id'],
            'form key' => ['form_key'],
            'card number' => ['cc_number'],
            'cvv' => ['cvv'],
            'iban' => ['iban'],
        ];
    }

    #[Test]
    public function itKeepsOrdinaryKeys(): void
    {
        $clean = $this->redactor->clean(['sku' => 'ABC-1', 'qty' => 2]);

        $this->assertSame(['sku' => 'ABC-1', 'qty' => 2], $clean);
    }

    #[Test]
    public function itStripsStringLiteralsFromSql(): void
    {
        // Its own instance: the shared fixture bounds strings hard enough to hide the point.
        $redactor = new Redactor();

        $sql = $redactor->cleanSql(
            "SELECT * FROM customer WHERE email = 'alice@example.com' AND status = 'active'"
        );

        $this->assertStringNotContainsString('alice@example.com', $sql);
        $this->assertStringNotContainsString('active', $sql);
        $this->assertStringContainsString('SELECT * FROM customer WHERE email =', $sql);
    }

    #[Test]
    public function itStillBoundsTheLengthOfHugeSql(): void
    {
        $sql = $this->redactor->cleanSql('SELECT ' . str_repeat('col, ', 200));

        $this->assertLessThanOrEqual(23, strlen($sql));
    }

    #[Test]
    public function itBoundsDepth(): void
    {
        $deep = ['a' => ['b' => ['c' => ['d' => ['e' => 'too far']]]]];

        $this->assertStringContainsString(
            'maximum depth',
            json_encode($this->redactor->clean($deep)) ?: ''
        );
    }

    #[Test]
    public function itBoundsStringLength(): void
    {
        $clean = $this->redactor->clean(str_repeat('x', 100));

        $this->assertSame(23, strlen((string) $clean), 'Twenty characters plus an ellipsis.');
    }

    #[Test]
    public function itBoundsArraySizeAndSaysSo(): void
    {
        $clean = $this->redactor->clean(['a', 'b', 'c', 'd', 'e']);

        $this->assertArrayHasKey('__truncated__', $clean);
        $this->assertSame(2, $clean['__truncated__']);
    }

    #[Test]
    public function fullPolicyKeepsPositionalBindings(): void
    {
        $clean = $this->redactor->cleanBindings(['alice@example.com', 7], Redactor::POLICY_FULL);

        $this->assertSame(['alice@example.com', 7], $clean);
    }

    #[Test]
    public function maskedPolicyDropsTextButKeepsShape(): void
    {
        $clean = $this->redactor->cleanBindings(['alice@example.com', 7], Redactor::POLICY_MASKED);

        $this->assertSame([Redactor::MASKED, 7], $clean, 'Numbers carry little alone and make SQL readable.');
    }

    #[Test]
    public function nonePolicyStoresNothing(): void
    {
        $this->assertSame([], $this->redactor->cleanBindings(['secret'], Redactor::POLICY_NONE));
    }

    #[Test]
    public function namedBindingsAreStillRedactedUnderFullPolicy(): void
    {
        $clean = $this->redactor->cleanBindings([':password' => 'hunter2'], Redactor::POLICY_FULL);

        $this->assertSame(Redactor::REDACTED, $clean[':password']);
    }

    #[Test]
    public function objectsBecomeTheirClassName(): void
    {
        $this->assertSame(self::class, $this->redactor->clean($this));
    }
}
