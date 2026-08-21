<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Model;

use InvalidArgumentException;
use JsonException;
use Magento\Framework\App\Filesystem\DirectoryList;
use Magento\Framework\Filesystem;
use Magento\Framework\Filesystem\Directory\WriteInterface;
use RuntimeException;
use Throwable;

/**
 * Stores short lived request profiles as private JSON files under var/.
 *
 * Profiles are written to a random temporary name and renamed into place, so a reader
 * never sees a half written document. Ids are validated on every read and write, which is
 * what makes it safe to take an id straight from an HTTP request or an MCP call.
 */
class ProfileStore
{
    public const ID_PATTERN =
        '[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}';

    public const ID_REGEX = '/\A' . self::ID_PATTERN . '\z/';

    private const DIRECTORY = 'siteation_debugbar';

    public function __construct(
        private readonly Filesystem $filesystem,
        private readonly Config $config
    ) {
    }

    public static function validId(string $id): bool
    {
        return preg_match(self::ID_REGEX, $id) === 1;
    }

    public static function generateId(): string
    {
        $bytes = random_bytes(16);
        $bytes[6] = chr((ord($bytes[6]) & 0x0f) | 0x40);
        $bytes[8] = chr((ord($bytes[8]) & 0x3f) | 0x80);

        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($bytes), 4));
    }

    /**
     * @param array<string, mixed> $profile
     */
    public function put(array $profile): string
    {
        $id = (string) ($profile['id'] ?? '');
        $this->assertValidId($id);

        try {
            // A profile holds whatever the request held, and nothing on the record path can
            // promise valid UTF-8: a query string of raw bytes, a binary column in a bind,
            // a latin-1 statement from a third party module. Without the substitute flag one
            // such byte throws and costs the whole profile, which is to say the bar, on
            // exactly the request being investigated.
            $json = json_encode(
                $profile,
                JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE
                    | JSON_THROW_ON_ERROR
            );
        } catch (JsonException $exception) {
            throw new RuntimeException('The debug profile could not be encoded.', 0, $exception);
        }

        $directory = $this->directory();
        $directory->create(self::DIRECTORY);
        $this->restrictPermissions($directory, self::DIRECTORY, 0700);

        $destination = $this->filename($id);
        $temporary = $destination . '.' . bin2hex(random_bytes(6)) . '.tmp';

        try {
            $directory->writeFile($temporary, $json);
            $directory->renameFile($temporary, $destination);
        } catch (Throwable $exception) {
            // The temporary name ends in .tmp, so the bounds below would never reach it. A
            // half written profile holds the same request data a finished one does, and a
            // disk that is full is exactly where it would sit forever.
            $this->discardTemporary($directory, $temporary);

            throw $exception;
        }

        $this->restrictPermissions($directory, $destination, 0600);

        // The profile is stored and its id is about to be handed back for injection.
        // Tidying that throws here would cost the bar on a request whose profile is already
        // on disk and readable.
        $this->tidy();

        return $id;
    }

    private function discardTemporary(WriteInterface $directory, string $temporary): void
    {
        try {
            $directory->delete($temporary);
        } catch (Throwable) {
            // Nothing more to do about it here than there was about the write.
        }
    }

    /**
     * @return array<string, mixed>|null
     */
    public function get(string $id): ?array
    {
        $this->assertValidId($id);

        $directory = $this->directory();
        $filename = $this->filename($id);

        if (!$directory->isExist($filename) || $this->hasExpired($directory, $filename)) {
            return null;
        }

        try {
            $profile = json_decode(
                $directory->readFile($filename),
                true,
                512,
                JSON_THROW_ON_ERROR
            );
        } catch (Throwable) {
            return null;
        }

        return is_array($profile) ? $profile : null;
    }

    /**
     * Whether a profile is past the age bound, whatever the sweep has managed so far.
     *
     * The bound was enforced by deletion alone, so a profile stayed readable by id for as
     * long as nothing happened to trigger a sweep: on a quiet instance, indefinitely. The
     * retention the module promises has to hold on the read as well, because that is where
     * it is observable.
     *
     * Refused rather than deleted. This is the read path, and the MCP tools that come
     * through here are advertised as read only; tidy() is what removes things.
     *
     * A stat that fails means the age cannot be established, which is answered by refusing.
     * The file existed a line ago, so the usual cause is another request pruning it.
     */
    private function hasExpired(WriteInterface $directory, string $filename): bool
    {
        try {
            $stat = $directory->stat($filename);
        } catch (Throwable) {
            return true;
        }

        return (int) ($stat['mtime'] ?? 0) < time() - ($this->config->maxAgeMinutes() * 60);
    }

    /**
     * Newest first.
     *
     * @return list<array<string, mixed>>
     */
    public function recent(?int $limit = null): array
    {
        $limit = max(1, min($limit ?? $this->config->maxProfiles(), $this->config->maxProfiles()));
        $profiles = [];

        foreach ($this->sortedFiles($this->directory()) as $file) {
            $id = basename($file['path'], '.json');

            if (!self::validId($id)) {
                continue;
            }

            $profile = $this->get($id);

            if ($profile !== null) {
                $profiles[] = $profile;
            }

            if (count($profiles) >= $limit) {
                break;
            }
        }

        return $profiles;
    }

    /**
     * Enforces the age and count bounds without reading anything.
     *
     * Pruning on write alone means the bound holds exactly until you stop browsing, which is
     * the moment it starts to matter. It is not done inside recent(): the MCP list tool
     * reads through there and is advertised as read only, and a tool that deletes while
     * promising not to is worse than a profile that lingers.
     */
    public function tidy(): void
    {
        try {
            $this->prune($this->directory());
        } catch (Throwable) {
            // Housekeeping that fails is not worth a failed request.
        }
    }

    /**
     * Newest first, and only the files that still existed by the time they were stat'd.
     *
     * A page fires several requests at once and each of them prunes, so a path that came
     * back from the search is routinely gone a moment later. Magento's driver throws on a
     * stat that fails, and this list is read on the way to injecting a bar and on the way
     * to answering the history XHR, neither of which may fail over housekeeping.
     *
     * @return list<array{path: string, mtime: int}>
     */
    private function sortedFiles(WriteInterface $directory, string $pattern = '*.json'): array
    {
        if (!$directory->isExist(self::DIRECTORY)) {
            return [];
        }

        $files = [];

        try {
            $paths = $directory->search($pattern, self::DIRECTORY);
        } catch (Throwable) {
            return [];
        }

        foreach ($paths as $path) {
            try {
                $stat = $directory->stat($path);
            } catch (Throwable) {
                continue;
            }

            $files[] = ['path' => $path, 'mtime' => (int) ($stat['mtime'] ?? 0)];
        }

        usort($files, static fn (array $left, array $right): int => $right['mtime'] <=> $left['mtime']);

        return $files;
    }

    private function prune(WriteInterface $directory): void
    {
        $expiresAt = time() - ($this->config->maxAgeMinutes() * 60);
        $maxProfiles = $this->config->maxProfiles();

        foreach ($this->sortedFiles($directory) as $index => $file) {
            if ($index >= $maxProfiles || $file['mtime'] < $expiresAt) {
                $directory->delete($file['path']);
            }
        }

        // Leftovers from a write that failed. They are bounded by age alone: the count bound
        // exists to keep the profiles you might still want, and nobody wants these.
        foreach ($this->sortedFiles($directory, '*.tmp') as $file) {
            if ($file['mtime'] < $expiresAt) {
                $directory->delete($file['path']);
            }
        }
    }

    private function directory(): WriteInterface
    {
        return $this->filesystem->getDirectoryWrite(DirectoryList::VAR_DIR);
    }

    private function filename(string $id): string
    {
        return self::DIRECTORY . '/' . $id . '.json';
    }

    /**
     * Magento writes view and var files world readable. A profile holds SQL, bindings and
     * request data, so it is narrowed after it is in place: the rename does not carry the
     * temporary file's mode across every filesystem driver.
     */
    private function restrictPermissions(WriteInterface $directory, string $path, int $mode): void
    {
        // A profile that cannot be narrowed is still better than a request that fails.
        // phpcs:ignore Magento2.Functions.DiscouragedFunction,Generic.PHP.NoSilencedErrors
        @chmod($directory->getAbsolutePath($path), $mode);
    }

    private function assertValidId(string $id): void
    {
        if (!self::validId($id)) {
            throw new InvalidArgumentException('Invalid debug profile id.');
        }
    }
}
