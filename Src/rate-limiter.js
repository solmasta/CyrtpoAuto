// src/rate-limiter.js - Rate Limiting & API Protection

export class RateLimiter {
  constructor(env) {
    this.env = env;
  }

  // Check if request is allowed under rate limit
  async checkLimit(key, limit, windowSeconds) {
    if (!key) {
      throw new Error('Rate limit key required');
    }

    const now = Date.now();
    const window = Math.floor(now / (windowSeconds * 1000));
    const limiterKey = `ratelimit:${key}:${window}`;
    
    try {
      const count = parseInt(await this.env.STATE.get(limiterKey) || '0');
      
      if (count >= limit) {
        // Limit exceeded
        const resetTime = new Date((window + 1) * windowSeconds * 1000);
        const retryAfter = Math.ceil(((window + 1) * windowSeconds * 1000 - now) / 1000);
        
        return {
          allowed: false,
          remaining: 0,
          limit: limit,
          resetAt: resetTime,
          retryAfterSeconds: retryAfter
        };
      }

      // Increment counter
      await this.env.STATE.put(limiterKey, (count + 1).toString(), {
        expirationTtl: windowSeconds + 60 // Expire slightly after window ends
      });

      return {
        allowed: true,
        remaining: limit - (count + 1),
        limit: limit,
        resetAt: new Date((window + 1) * windowSeconds * 1000)
      };
    } catch (error) {
      console.error('Rate limiter error:', error);
      // On error, allow request (fail open)
      return {
        allowed: true,
        remaining: limit
      };
    }
  }

  // Convenience: Check limit for API endpoint (10 per minute per IP)
  async checkApiLimit(clientIp) {
    return this.checkLimit(`api:${clientIp}`, 10, 60);
  }

  // Convenience: Check limit for auth endpoint (5 attempts per 15 minutes per IP)
  async checkAuthLimit(clientIp) {
    return this.checkLimit(`auth:${clientIp}`, 5, 900);
  }

  // Convenience: Check limit for webhook endpoint (1000 per hour per source)
  async checkWebhookLimit(source) {
    return this.checkLimit(`webhook:${source}`, 1000, 3600);
  }

  // Convenience: Check limit for signal generation (30 per hour per user)
  async checkSignalLimit(userId) {
    return this.checkLimit(`signal:${userId}`, 30, 3600);
  }

  // Convenience: Check limit for trade execution (50 per day per user)
  async checkTradeLimit(userId) {
    const dayStart = Math.floor(Date.now() / (86400 * 1000)) * 86400;
    return this.checkLimit(`trade:${userId}:${dayStart}`, 50, 86400);
  }

  // Get current rate limit status for monitoring
  async getStatus(key, windowSeconds) {
    if (!key) return null;

    const now = Date.now();
    const window = Math.floor(now / (windowSeconds * 1000));
    const limiterKey = `ratelimit:${key}:${window}`;
    
    const count = parseInt(await this.env.STATE.get(limiterKey) || '0');
    
    return {
      key: key,
      currentCount: count,
      window: window,
      windowStartTime: new Date(window * windowSeconds * 1000),
      windowEndTime: new Date((window + 1) * windowSeconds * 1000)
    };
  }

  // Reset limit for a specific key (admin function)
  async reset(key) {
    if (!key) {
      throw new Error('Key required');
    }

    // Find all windows for this key
    const pattern = `ratelimit:${key}:*`;
    
    // Note: KV doesn't support wildcard deletion, so we'd need to track windows
    // For now, just return success (limits will expire naturally)
    
    return {
      status: 'reset_requested',
      message: 'Rate limits will reset at window end'
    };
  }

  // Check if IP is in blocklist (for repeat offenders)
  async isBlocked(clientIp) {
    if (!clientIp) return false;

    const blocked = await this.env.STATE.get(`blocked:${clientIp}`);
    return blocked === 'true';
  }

  // Block IP (admin function)
  async blockIp(clientIp, reason = 'Suspected abuse', durationSeconds = 86400) {
    if (!clientIp) {
      throw new Error('clientIp required');
    }

    await this.env.STATE.put(`blocked:${clientIp}`, 'true', {
      expirationTtl: durationSeconds
    });

    // Log blocking
    const logEntry = {
      timestamp: new Date().toISOString(),
      action: 'IP_BLOCKED',
      clientIp: clientIp,
      reason: reason,
      durationSeconds: durationSeconds
    };

    await this.env.STATE.put(
      `audit:ratelimit:IP_BLOCKED:${Date.now()}`,
      JSON.stringify(logEntry),
      { expirationTtl: 7776000 }
    );

    return { status: 'ip_blocked', clientIp, reason };
  }

  // Unblock IP (admin function)
  async unblockIp(clientIp) {
    if (!clientIp) {
      throw new Error('clientIp required');
    }

    await this.env.STATE.delete(`blocked:${clientIp}`);

    // Log unblocking
    const logEntry = {
      timestamp: new Date().toISOString(),
      action: 'IP_UNBLOCKED',
      clientIp: clientIp
    };

    await this.env.STATE.put(
      `audit:ratelimit:IP_UNBLOCKED:${Date.now()}`,
      JSON.stringify(logEntry),
      { expirationTtl: 7776000 }
    );

    return { status: 'ip_unblocked', clientIp };
  }
}
