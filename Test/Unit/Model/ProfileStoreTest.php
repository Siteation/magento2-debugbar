<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Model;

use InvalidArgumentException;
use Magento\Framework\App\Filesystem\DirectoryList;
use Magento\Framework\Exception\FileSystemException;
use Magento\Framework\Filesystem;
use Magento\Framework\Filesystem\Directory\WriteInterface;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use RuntimeException;
use Siteation\DebugBar\Model\Config;
use Siteation\DebugBar\Model\ProfileStore;

/**
 * The store is what every reader goes through, so its two promises are worth pinning: an id
 * is validated before it reaches the filesystem, and a profile survives whatever bytes the
 * request happened to carry.
 */
class ProfileStoreTest extends TestCase
{
    private const DIRECTORY = 'siteation_debugbar';

    /** @var array<string, string> */
    private array $written = [];

    /** @var array<string, int> file name to mtime, as if already on disk */
    private array $existing = [];

    /** @var list<string> */
    private array $deleted = [];

    /** @var list<string> paths another request removed between the search and the stat */
    private array $unstattable = [];

    #[Test]
    public function aProfileSurvivesBytesThatAreNotUtf8(): void
    {
        // Two independent sources: a query string of raw bytes, and a latin-1 statement from
        // a module that never asked. Without the substitute flag either one throws and takes
        // the profile, which is to say the bar, with it.
        $id = ProfileStore::generateId();

        $store = $this->store();
        $store->put([
            'id' => $id,
            'sections' => [
                'request' => ['payload' => ['query_params' => ['q' => "\xff\xfe"]]],
                'queries' => ['payload' => ['items' => [['sql' => "SELECT '\xe9'"]]]],
            ],
        ]);

        $json = $this->written['siteation_debugbar/' . $id . '.json'] ?? null;

        $this->assertIsString($json);
        $this->assertTrue(mb_check_encoding($json, 'UTF-8'));
        $this->assertSame($id, json_decode($json, true, 512, JSON_THROW_ON_ERROR)['id']);
    }

    #[Test]
    public function anIdMadeHereIsAnIdItAccepts(): void
    {
        for ($i = 0; $i < 20; $i++) {
            $this->assertTrue(ProfileStore::validId(ProfileStore::generateId()));
        }
    }

    #[Test]
    public function anIdThatIsNotOneIsRefusedBeforeItReachesTheFilesystem(): void
    {
        // The ids come from HTTP requests and MCP calls, so this is the check that makes it
        // safe to build a path out of one.
        foreach (['../../../app/etc/env', 'nope', '', str_repeat('a', 36)] as $id) {
            $store = $this->store();

            try {
                $store->get($id);
                $this->fail('accepted ' . var_export($id, true));
            } catch (InvalidArgumentException) {
                $this->assertSame([], $this->written);
            }
        }
    }

    #[Test]
    public function whatWentInIsWhatComesBackOut(): void
    {
        $id = ProfileStore::generateId();
        $store = $this->store();

        $store->put(['id' => $id, 'sections' => ['queries' => ['summary' => ['count' => 3]]]]);

        $profile = $store->get($id);

        $this->assertSame($id, $profile['id'] ?? null);
        $this->assertSame(3, $profile['sections']['queries']['summary']['count'] ?? null);
    }

    #[Test]
    public function aFileThatIsNotJsonIsNothing(): void
    {
        // A half written file is a lost profile, not a broken endpoint.
        $id = ProfileStore::generateId();
        $store = $this->store();

        $this->written['siteation_debugbar/' . $id . '.json'] = '{"id": "' . $id;

        $this->assertNull($store->get($id));
    }

    #[Test]
    public function theCountBoundKeepsTheNewestAndDropsTheRest(): void
    {
        // The only thing standing between a var/ directory and every query, binding and
        // request path of a browsing session, kept forever.
        $store = $this->store(maxProfiles: 3);

        $now = time();
        $this->existing = [
            'a.json' => $now - 10,
            'b.json' => $now - 20,
            'c.json' => $now - 30,
            'd.json' => $now - 40,
            'e.json' => $now - 50,
        ];

        $store->tidy();

        $this->assertSame(['d.json', 'e.json'], $this->deleted);
    }

    #[Test]
    public function theAgeBoundDropsWhatIsOlderThanItEvenWhenThereIsRoom(): void
    {
        $store = $this->store(maxProfiles: 20, maxAgeMinutes: 60);

        $this->existing = [
            'fresh.json' => time() - 60,
            'stale.json' => time() - 7200,
        ];

        $store->tidy();

        $this->assertSame(['stale.json'], $this->deleted);
    }

    #[Test]
    public function aWriteThatFailedLeavesNothingBehindToOutliveTheBounds(): void
    {
        // The temporary name ends in .tmp, so the count bound would never reach it: a full
        // disk used to leave a file holding a whole profile's data there permanently.
        $store = $this->store(failWrite: true);

        try {
            $store->put(['id' => ProfileStore::generateId(), 'sections' => []]);
            $this->fail('the write was supposed to fail');
        } catch (RuntimeException) {
            $this->assertSame([], $this->written, 'the temporary file was not cleaned up');
        }
    }

    #[Test]
    public function aStaleTemporaryFileIsSweptWithTheProfiles(): void
    {
        $store = $this->store();

        $this->existing = ['gone.json.abc123.tmp' => time() - 7200];

        $store->tidy();

        $this->assertSame(['gone.json.abc123.tmp'], $this->deleted);
    }

    #[Test]
    public function aFileDeletedByAnotherRequestMidScanIsSkippedRatherThanFatal(): void
    {
        // A page fires several requests at once and each of them prunes, so a path that came
        // back from the search is routinely gone by the time it is stat'd. Magento's driver
        // throws there, and this list is read on the way to injecting a bar.
        $store = $this->store();
        $id = ProfileStore::generateId();

        $store->put(['id' => $id, 'sections' => []]);

        $this->existing = [$id . '.json' => time(), 'vanished.json' => time()];
        $this->unstattable = [self::DIRECTORY . '/vanished.json'];

        $store->tidy();

        $this->assertSame([], $this->deleted, 'nothing expired, and nothing threw');
        $this->assertCount(1, $store->recent(), 'the file that is still there is still read');
    }

    private function store(
        int $maxProfiles = 20,
        int $maxAgeMinutes = 60,
        bool $failWrite = false
    ): ProfileStore {
        $this->written = [];
        $this->deleted = [];
        $this->existing = [];
        $this->unstattable = [];

        $directory = $this->createStub(WriteInterface::class);
        $directory->method('isExist')->willReturnCallback(
            fn (string $path): bool => $path === self::DIRECTORY || isset($this->written[$path])
        );
        $directory->method('getAbsolutePath')->willReturnArgument(0);
        $directory->method('readFile')->willReturnCallback(
            fn (string $path): string => $this->written[$path] ?? ''
        );
        $directory->method('search')->willReturnCallback(
            function (string $pattern): array {
                $suffix = ltrim($pattern, '*');

                return array_map(
                    static fn (string $name): string => self::DIRECTORY . '/' . $name,
                    array_values(array_filter(
                        array_keys($this->existing),
                        static fn (string $name): bool => str_ends_with($name, $suffix)
                    ))
                );
            }
        );
        $directory->method('stat')->willReturnCallback(
            function (string $path): array {
                if (in_array($path, $this->unstattable, true)) {
                    throw new FileSystemException(__('Cannot stat %1', $path));
                }

                return ['mtime' => $this->existing[basename($path)] ?? 0];
            }
        );
        $directory->method('delete')->willReturnCallback(
            function (string $path): bool {
                $this->deleted[] = basename($path);
                unset($this->existing[basename($path)], $this->written[$path]);

                return true;
            }
        );
        $directory->method('writeFile')->willReturnCallback(
            function (string $path, string $contents) use ($failWrite): int {
                $this->written[$path] = $contents;

                if ($failWrite) {
                    throw new RuntimeException('disk full');
                }

                return strlen($contents);
            }
        );
        $directory->method('renameFile')->willReturnCallback(
            function (string $from, string $to): bool {
                $this->written[$to] = $this->written[$from] ?? '';
                unset($this->written[$from]);

                return true;
            }
        );

        $filesystem = $this->createStub(Filesystem::class);
        $filesystem->method('getDirectoryWrite')->willReturnCallback(
            function (string $code) use ($directory): WriteInterface {
                $this->assertSame(DirectoryList::VAR_DIR, $code);

                return $directory;
            }
        );

        $config = $this->createStub(Config::class);
        $config->method('maxProfiles')->willReturn($maxProfiles);
        $config->method('maxAgeMinutes')->willReturn($maxAgeMinutes);

        return new ProfileStore($filesystem, $config);
    }
}
