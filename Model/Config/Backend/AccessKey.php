<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Model\Config\Backend;

use Magento\Framework\App\Config\Value;
use Magento\Framework\Exception\LocalizedException;
use Siteation\DebugBar\Model\Config;

/**
 * Refuses a key too short to be worth having.
 *
 * A one character key was accepted, and outside developer mode a key is the whole reason the
 * bar is allowed to run at all: "on for whoever holds the key" means nothing when the key is
 * "x". Config refuses to resolve one that short as well, so a value written straight into the
 * database or env.php is no way around this. Saying so here is what makes it visible, because
 * a bar that silently does nothing is a bug report rather than a message.
 *
 * Empty stays valid. That is the developer machine, where there is nobody to keep out, and
 * Config already refuses to enable in any other mode without one.
 */
class AccessKey extends Value
{
    /**
     * @return $this
     * @throws LocalizedException
     */
    public function beforeSave()
    {
        $value = trim((string) $this->getValue());

        if ($value !== '' && strlen($value) < Config::MIN_ACCESS_KEY_LENGTH) {
            throw new LocalizedException(__(
                'The Developer Access Key must be at least %1 characters, or empty. '
                . 'Generate one with: openssl rand -hex 32',
                Config::MIN_ACCESS_KEY_LENGTH
            ));
        }

        $this->setValue($value);

        return parent::beforeSave();
    }
}
