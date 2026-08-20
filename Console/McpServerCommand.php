<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Console;

use Magento\Framework\App\Area;
use Magento\Framework\App\State;
use Siteation\DebugBar\Mcp\Server;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Throwable;

/**
 * Runs the MCP server on stdin and stdout.
 *
 * Nothing but protocol may reach stdout, or the client drops the connection. Magento is
 * happy to echo deprecation notices and the odd stray print, so ordinary output is
 * buffered and discarded, and protocol lines are written straight to the stream.
 */
class McpServerCommand extends Command
{
    /** Generous for a JSON-RPC request, and finite, which is the point. */
    private const MAX_LINE_BYTES = 1048576;

    public function __construct(
        private readonly Server $server,
        private readonly State $appState,
        ?string $name = null
    ) {
        parent::__construct($name);
    }

    protected function configure(): void
    {
        $this->setName('siteation:debugbar:mcp')
            ->setDescription('Serve stored debug profiles to a coding agent over MCP (stdio).');

        parent::configure();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        try {
            $this->appState->setAreaCode(Area::AREA_GLOBAL);
        } catch (Throwable) {
            // Already set, which is fine.
        }

        // Swallow anything that is not protocol. fwrite to STDOUT bypasses this buffer.
        ob_start();

        $stdin = fopen('php://stdin', 'rb');

        if ($stdin === false) {
            ob_end_clean();

            return Command::FAILURE;
        }

        // Bounded, so one enormous line cannot be read into memory in full, and cleared
        // each time round, so anything the request printed does not accumulate for the
        // length of the session.
        while (($line = fgets($stdin, self::MAX_LINE_BYTES)) !== false) {
            $response = $this->server->handleLine($line);

            if ($response !== null) {
                fwrite(STDOUT, $response . "\n");
                fflush(STDOUT);
            }

            if (ob_get_length() !== false) {
                ob_clean();
            }
        }

        fclose($stdin);
        ob_end_clean();

        return Command::SUCCESS;
    }
}
