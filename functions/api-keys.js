// src/api-keys.js - API Key Management
// Secure generation, hashing, and validation

export class ApiKeyManager {
  constructor(env) {
    this.env = env;
  }

  // Generate new API key for user
  async generateKey(userId, name = 'Default Key') {
    if (!userId) {
      throw new Error('userId required');
    }

    // Generate cryptographically secure random key
    const randomBytes = crypto.getRandomValues(new Uint8Array(32));
    const keyBuffer = Array.from(randomBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    const key = `sk_live_${keyBuffer.slice(0, 32)}`;
    
    // Hash the key before storing
    const keyHash = await this.hashKey(key);
    
    // Store key metadata (not the actual key)
    const keyData = {
      userId: userId,
      name: name,
      keyHash: keyHash,
      createdAt: new Date().toISOString(),
      lastUsedAt: null,
      requestCount: 0,
      status: 'active'
    };
    
    await this.env.STATE.put(`api_key:${keyHash}`, JSON.stringify(keyData));
    
    // Also store in user's key list
    const userKeysKey = `user_keys:${userId}`;
    const userKeys = await this.env.STATE.get(userKeysKey, { type: 'json' }) || [];
    userKeys.push({
      keyHash: keyHash,
      name: name,
      createdAt: keyData.createdAt,
      status: 'active'
    });
    await this.env.STATE.put(userKeysKey, JSON.stringify(userKeys));
    
    // Log key generation
    await this.logAudit('API_KEY_GENERATED', userId, { keyName: name });
    
    // Return unhashed key (only shown once)
    return {
      key: key,
      name: name,
      createdAt: keyData.createdAt,
      warning: 'Save this key somewhere safe. You won\'t be able to see it again.'
    };
  }

  // Validate API key and return userId
  async validateKey(key) {
    if (!key || !key.startsWith('sk_live_')) {
      return null;
    }
    
    try {
      const keyHash = await this.hashKey(key);
      const keyData = await this.env.STATE.get(`api_key:${keyHash}`, { type: 'json' });
      
      if (!keyData || keyData.status !== 'active') {
        return null;
      }
      
      // Update usage statistics
      keyData.lastUsedAt = new Date().toISOString();
      keyData.requestCount++;
      
      // Store updated key data
      await this.env.STATE.put(`api_key:${keyHash}`, JSON.stringify(keyData));
      
      return keyData.userId;
    } catch (error) {
      return null;
    }
  }

  // Hash key using SHA-256
  async hashKey(key) {
    if (!key) throw new Error('Key required');
    
    const encoder = new TextEncoder();
    const data = encoder.encode(key);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Get all keys for user (without revealing full keys)
  async getUserKeys(userId) {
    if (!userId) {
      throw new Error('userId required');
    }
    
    const userKeysKey = `user_keys:${userId}`;
    const userKeys = await this.env.STATE.get(userKeysKey, { type: 'json' }) || [];
    
    return userKeys.map(key => ({
      ...key,
      keyHash: key.keyHash.slice(0, 8) + '...' // Only show first 8 chars
    }));
  }

  // Revoke API key
  async revokeKey(userId, keyHash) {
    if (!userId || !keyHash) {
      throw new Error('userId and keyHash required');
    }
    
    // Verify user owns this key
    const userKeysKey = `user_keys:${userId}`;
    const userKeys = await this.env.STATE.get(userKeysKey, { type: 'json' }) || [];
    
    const keyExists = userKeys.some(k => k.keyHash === keyHash);
    if (!keyExists) {
      throw new Error('Key not found');
    }
    
    // Mark key as revoked
    const keyData = await this.env.STATE.get(`api_key:${keyHash}`, { type: 'json' });
    if (keyData) {
      keyData.status = 'revoked';
      keyData.revokedAt = new Date().toISOString();
      await this.env.STATE.put(`api_key:${keyHash}`, JSON.stringify(keyData));
    }
    
    // Remove from user's key list
    const updatedKeys = userKeys.filter(k => k.keyHash !== keyHash);
    await this.env.STATE.put(userKeysKey, JSON.stringify(updatedKeys));
    
    // Log revocation
    await this.logAudit('API_KEY_REVOKED', userId, { keyHash: keyHash });
    
    return { status: 'revoked' };
  }

  // Rotate API key (revoke old, create new)
  async rotateKey(userId, oldKeyHash, name = 'Rotated Key') {
    if (!userId || !oldKeyHash) {
      throw new Error('userId and oldKeyHash required');
    }
    
    // Revoke old key
    await this.revokeKey(userId, oldKeyHash);
    
    // Generate new key
    const newKey = await this.generateKey(userId, name);
    
    // Log rotation
    await this.logAudit('API_KEY_ROTATED', userId, { oldKeyHash });
    
    return newKey;
  }

  // Get key usage statistics
  async getKeyStats(userId, keyHash) {
    if (!userId || !keyHash) {
      throw new Error('userId and keyHash required');
    }
    
    // Verify user owns this key
    const userKeysKey = `user_keys:${userId}`;
    const userKeys = await this.env.STATE.get(userKeysKey, { type: 'json' }) || [];
    
    const keyExists = userKeys.some(k => k.keyHash === keyHash);
    if (!keyExists) {
      throw new Error('Key not found');
    }
    
    const keyData = await this.env.STATE.get(`api_key:${keyHash}`, { type: 'json' });
    if (!keyData) {
      throw new Error('Key data not found');
    }
    
    return {
      name: keyData.name,
      status: keyData.status,
      createdAt: keyData.createdAt,
      lastUsedAt: keyData.lastUsedAt,
      requestCount: keyData.requestCount
    };
  }

  // Revoke all keys for user (security measure)
  async revokeAllKeys(userId) {
    if (!userId) {
      throw new Error('userId required');
    }
    
    const userKeysKey = `user_keys:${userId}`;
    const userKeys = await this.env.STATE.get(userKeysKey, { type: 'json' }) || [];
    
    for (const key of userKeys) {
      if (key.status === 'active') {
        const keyData = await this.env.STATE.get(`api_key:${key.keyHash}`, { type: 'json' });
        if (keyData) {
          keyData.status = 'revoked';
          keyData.revokedAt = new Date().toISOString();
          await this.env.STATE.put(`api_key:${key.keyHash}`, JSON.stringify(keyData));
        }
      }
    }
    
    // Clear user's key list
    await this.env.STATE.put(userKeysKey, JSON.stringify([]));
    
    // Log mass revocation
    await this.logAudit('ALL_API_KEYS_REVOKED', userId, {});
    
    return { status: 'all_keys_revoked' };
  }

  // Audit logging
  async logAudit(action, userId, details) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      action: action,
      userId: userId,
      details: details
    };
    
    const key = `audit:api_keys:${action}:${Date.now()}`;
    await this.env.STATE.put(key, JSON.stringify(logEntry), {
      expirationTtl: 7776000 // 90 days
    });
  }
}
