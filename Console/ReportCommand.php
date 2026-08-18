<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Console;

use Magento\Framework\App\Area;
use Magento\Framework\App\State;
use Siteation\DebugBar\Model\ProfileStore;
use Siteation\DebugBar\Presentation\ProfileReport;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Throwable;

/**
 * Prints a stored profile as markdown.
 *
 * The MCP server is the better path for an agent that has one configured. This is for the
 * ones that do not: every coding agent can run a shell command, and no agent can use a
 * server nobody wired up. It is also how a person gets the request into an assistant that
 * only takes pasted text.
 */
class ReportCommand extends Command
{
    private const OPTION_ID = 'id';
    private const OPTION_BASELINE = 'baseline';

    public function __construct(
        private readonly ProfileStore $store,
        private readonly ProfileReport $report,
        private readonly State $appState,
        ?string $name = null
    ) {
        parent::__construct($name);
    }

    protected function configure(): void
    {
        $this->setName('siteation:debugbar:report')
            ->setDescription('Print a stored debug profile as markdown, for pasting into an assistant.')
            ->addOption(
                self::OPTION_ID,
                null,
                InputOption::VALUE_REQUIRED,
                'Profile id, from the X-Siteation-DebugBar-Profile header. Defaults to the newest.'
            )
            ->addOption(
                self::OPTION_BASELINE,
                null,
                InputOption::VALUE_REQUIRED,
                'An earlier profile id to measure against, for what a change cost.'
            );

        parent::configure();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        try {
            $this->appState->setAreaCode(Area::AREA_GLOBAL);
        } catch (Throwable) {
            // Already set, which is fine.
        }

        $id = (string) ($input->getOption(self::OPTION_ID) ?? '');
        $profile = $id === '' ? ($this->store->recent(1)[0] ?? null) : $this->find($id, $output);

        if ($profile === null) {
            if ($id === '') {
                $output->writeln('<error>No profiles stored. Load a page with the bar enabled first.</error>');
            }

            return Command::FAILURE;
        }

        $baselineId = (string) ($input->getOption(self::OPTION_BASELINE) ?? '');
        $baseline = $baselineId === '' ? null : $this->find($baselineId, $output);

        if ($baselineId !== '' && $baseline === null) {
            return Command::FAILURE;
        }

        // Written raw: markdown is the output, and the formatter would eat its own markup.
        $output->write($this->report->render($profile, $baseline), false, OutputInterface::OUTPUT_RAW);

        return Command::SUCCESS;
    }

    /**
     * @return array<string, mixed>|null
     */
    private function find(string $id, OutputInterface $output): ?array
    {
        if (!ProfileStore::validId($id)) {
            $output->writeln(sprintf('<error>%s is not a profile id.</error>', $id));

            return null;
        }

        $profile = $this->store->get($id);

        if ($profile === null) {
            $output->writeln(sprintf('<error>No profile %s. It may have been pruned.</error>', $id));
        }

        return $profile;
    }
}
