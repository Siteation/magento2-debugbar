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
            $json = json_encode(
                $profile,
                JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR
            );
        } catch (JsonException $exception) {
            throw new RuntimeException('The debug profile could not be encoded.', 0, $exception);
        }

        $directory = $this->directory();
        $directory->create(self::DIRECTORY);
        $this->restrictPermissions($directory, self::DIRECTORY, 0700);

        $destination = $this->filename($id);
        $temporary = $destination . '.' . bin2hex(random_bytes(6)) . '.tmp';

        $directory->writeFile($temporary, $json);
        $directory->renameFile($temporary, $destination);
        $this->restrictPermissions($directory, $destination, 0600);

        $this->prune($directory);

        return $id;
    }

    /**
     * @return array<string, mixed>|null
     */
    public function get(string $id): ?array
    {
        $this->assertValidId($id);

        $directory = $this->directory();
        $filename = $this->filename($id);

        if (!$directory->isExist($filename)) {
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
     * @return list<array{path: string, mtime: int}>
     */
    private function sortedFiles(WriteInterface $directory): array
    {
        if (!$directory->isExist(self::DIRECTORY)) {
            return [];
        }

        $files = [];

        foreach ($directory->search('*.json', self::DIRECTORY) as $path) {
            $stat = $directory->stat($path);
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
