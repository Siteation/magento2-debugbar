<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Model;

use Magento\Framework\App\Request\Http as HttpRequest;

/**
 * The address a request actually came from.
 *
 * Deliberately ignores X-Forwarded-For. An allowlist that trusts a client supplied header
 * is not an allowlist, and neither is a lockout that a guesser can step out of by changing
 * one header.
 *
 * One definition because two readers depend on it meaning the same thing: the allowlist
 * decides who may be answered, and the attempt counter decides who has stopped being
 * answered. A difference between them would be a way around one of the two.
 *
 * Behind a load balancer this is the balancer, so every client shares one bucket. That is
 * why the key's length floor is the defence and the counter is only depth: a shared bucket
 * can be filled deliberately, and the cost of that is the developer waiting out a window,
 * not a store that stops working.
 */
class ClientAddress
{
    public function __construct(private readonly HttpRequest $request)
    {
    }

    public function get(): ?string
    {
        $ip = $this->request->getServer('REMOTE_ADDR');

        return is_string($ip) && $ip !== '' ? $ip : null;
    }
}
