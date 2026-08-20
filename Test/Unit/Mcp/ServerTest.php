<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Mcp;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use RuntimeException;
use Siteation\DebugBar\Api\McpToolInterface;
use Siteation\DebugBar\Mcp\Server;

/**
 * handleLine() is a string in, string or null out, and it is the whole agent-facing half of
 * the product.
 *
 * Its failures do not look like wrong answers. They look like a client that disconnects or
 * one that waits forever for a line that never comes, found by an agent mid-task rather than
 * by anybody reading output. Every hardening decision in here was made once and asserted
 * nowhere.
 */
class ServerTest extends TestCase
{
    #[Test]
    public function aLineThatIsNotJsonIsAnswered(): void
    {
        // Answered, not ignored: a client that gets nothing back waits forever.
        $response = $this->send('{not json');

        $this->assertSame(-32700, $response['error']['code']);
        $this->assertNull($response['id']);
    }

    #[Test]
    public function aBatchIsRefusedRatherThanDroppedOnTheFloor(): void
    {
        $response = $this->send('[{"jsonrpc":"2.0","id":1,"method":"ping"}]');

        $this->assertSame(-32600, $response['error']['code']);
    }

    #[Test]
    public function aMethodThatIsNotAStringIsRefusedBeforeItIsUsed(): void
    {
        // Casting would turn an array into "Array" and a fatal into a dead session.
        $response = $this->send('{"jsonrpc":"2.0","id":1,"method":[]}');

        $this->assertSame(-32600, $response['error']['code']);
        $this->assertSame(1, $response['id']);
    }

    #[Test]
    public function anEmptyLineIsNotAnAnswer(): void
    {
        $this->assertNull($this->server()->handleLine(''));
        $this->assertNull($this->server()->handleLine("   \n"));
    }

    #[Test]
    public function aNotificationIsNeverAnswered(): void
    {
        // Answering one is a protocol violation, and clients that check disconnect over it.
        $this->assertNull($this->server()->handleLine('{"jsonrpc":"2.0","method":"notifications/initialized"}'));
    }

    #[Test]
    public function anUnknownMethodIsAnErrorAndNotAnException(): void
    {
        $response = $this->send('{"jsonrpc":"2.0","id":7,"method":"tools/delete"}');

        $this->assertSame(-32601, $response['error']['code']);
        $this->assertStringContainsString('tools/delete', $response['error']['message']);
    }

    #[Test]
    public function aProtocolVersionWeKnowIsEchoedBack(): void
    {
        // Clients disconnect on an unexpected version rather than negotiating.
        $response = $this->send('{"jsonrpc":"2.0","id":1,"method":"initialize",'
            . '"params":{"protocolVersion":"2024-11-05"}}');

        $this->assertSame('2024-11-05', $response['result']['protocolVersion']);
    }

    #[Test]
    public function aProtocolVersionWeDoNotKnowGetsTheNewestWeSpeak(): void
    {
        $response = $this->send('{"jsonrpc":"2.0","id":1,"method":"initialize",'
            . '"params":{"protocolVersion":"1999-01-01"}}');

        $this->assertSame('2025-06-18', $response['result']['protocolVersion']);
        $this->assertSame(Server::NAME, $response['result']['serverInfo']['name']);
    }

    #[Test]
    public function everyToolIsAdvertisedAsReadOnly(): void
    {
        $response = $this->send('{"jsonrpc":"2.0","id":1,"method":"tools/list"}');

        $tools = $response['result']['tools'];

        $this->assertCount(1, $tools);
        $this->assertSame('a_tool', $tools[0]['name']);
        $this->assertTrue($tools[0]['annotations']['readOnlyHint']);
        $this->assertFalse($tools[0]['annotations']['destructiveHint']);
        $this->assertArrayHasKey('inputSchema', $tools[0]);
    }

    #[Test]
    public function callingATheServerDoesNotHaveIsAToolErrorNotAProtocolError(): void
    {
        // The agent asked for something reasonable and got it wrong; that is a result it can
        // read and recover from, not a transport failure.
        $response = $this->send('{"jsonrpc":"2.0","id":1,"method":"tools/call",'
            . '"params":{"name":"no_such_tool"}}');

        $this->assertArrayNotHasKey('error', $response);
        $this->assertTrue($response['result']['isError']);
        $this->assertStringContainsString('no_such_tool', $response['result']['content'][0]['text']);
    }

    #[Test]
    public function aToolThatThrowsCostsItsOwnCallAndNotTheSession(): void
    {
        $server = new Server([$this->throwingTool()]);

        $response = $this->decode($server->handleLine(
            '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"a_tool"}}'
        ));

        $this->assertTrue($response['result']['isError']);
        $this->assertStringContainsString('the store went away', $response['result']['content'][0]['text']);

        // And the next line is still served.
        $this->assertSame([], $this->decode($server->handleLine(
            '{"jsonrpc":"2.0","id":2,"method":"ping"}'
        ))['result']);
    }

    #[Test]
    public function aToolResultTravelsAsTextAnAgentCanRead(): void
    {
        $response = $this->send('{"jsonrpc":"2.0","id":1,"method":"tools/call",'
            . '"params":{"name":"a_tool","arguments":{"limit":5}}}');

        $this->assertFalse($response['result']['isError']);
        $this->assertSame('text', $response['result']['content'][0]['type']);
        $this->assertStringContainsString('"limit": 5', $response['result']['content'][0]['text']);
    }

    #[Test]
    public function aToolThatReportsAnErrorStatusIsAnError(): void
    {
        $server = new Server([$this->tool(['status' => 'error', 'error' => 'no such profile'])]);

        $response = $this->decode($server->handleLine(
            '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"a_tool"}}'
        ));

        $this->assertTrue($response['result']['isError']);
    }

    #[Test]
    public function everyAnswerIsOneLineOfJsonRpc(): void
    {
        // The transport is newline delimited, so an embedded newline would split one message
        // into two and desynchronise the session for good.
        $line = $this->server()->handleLine('{"jsonrpc":"2.0","id":1,"method":"initialize"}');

        $this->assertIsString($line);
        $this->assertStringNotContainsString("\n", $line);
        $this->assertSame('2.0', $this->decode($line)['jsonrpc']);
    }

    /**
     * @return array<string, mixed>
     */
    private function send(string $line): array
    {
        return $this->decode($this->server()->handleLine($line));
    }

    /**
     * @return array<string, mixed>
     */
    private function decode(?string $line): array
    {
        $this->assertIsString($line, 'the server answered nothing');

        return json_decode($line, true, 32, JSON_THROW_ON_ERROR);
    }

    private function server(): Server
    {
        return new Server([$this->tool()]);
    }

    /**
     * @param array<string, mixed>|null $result
     */
    private function tool(?array $result = null): McpToolInterface
    {
        $tool = $this->createStub(McpToolInterface::class);
        $tool->method('name')->willReturn('a_tool');
        $tool->method('description')->willReturn('Reads something.');
        $tool->method('inputSchema')->willReturn(['type' => 'object', 'properties' => []]);
        $tool->method('call')->willReturnCallback(
            static fn (array $arguments): array => $result ?? ['status' => 'ok', ...$arguments]
        );

        return $tool;
    }

    private function throwingTool(): McpToolInterface
    {
        $tool = $this->createStub(McpToolInterface::class);
        $tool->method('name')->willReturn('a_tool');
        $tool->method('description')->willReturn('Reads something.');
        $tool->method('inputSchema')->willReturn(['type' => 'object']);
        $tool->method('call')->willThrowException(new RuntimeException('the store went away'));

        return $tool;
    }
}
