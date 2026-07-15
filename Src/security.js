// src/security.js - Security Utilities & Middleware

export class SecurityManager {
  constructor(env) {
    this.env = env;
  }

  // Add security headers to response
  addSecurityHeaders(response, origin = 'https://app.cryptoauto.com') {
    const headers = new Headers(response.headers);
    
    // CORS headers - be specific about allowed origins
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    headers.set('Access-Control-Allow-Credentials', 'true');
    headers.set('Access-Control-Max-Age', '86400');
    
    // Security headers
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-Frame-Options', 'DENY');
    headers.set('X-XSS-Protection', '1; mode=block');
    headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    headers.set('Content-Security-Policy', "default-src 'self'");
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: headers
    });
  }

  // Validate request origin
  isValidOrigin(origin) {
    const allowedOrigins = [
      'https://app.cryptoauto.com',
      'https://cryptoauto.com',
      'https://insight-engine.lukedorsett.workers.dev'
    ];
    
    // In development, allow localhost
    if (process.env.NODE_ENV === 'development') {
      allowedOrigins.push('http://localhost:3000');
      allowedOrigins.push('http://localhost:8787');
    }
    
    return allowedOrigins.includes(origin);
  }

  // Extract client IP from request
  getClientIp(request) {
    return request.headers.get('cf-connecting-ip') || 
           request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
           'unknown';
  }

  // Extract API key from Authorization header
  extractApiKey(request) {
    const auth = request.headers.get('Authorization');
    if (!auth) return null;
    
    const [type, key] = auth.split(' ');
    if (type !== 'Bearer') return null;
    
    return key;
  }

  // Extract Bearer token
  extractBearerToken(request) {
    const auth = request.headers.get('Authorization');
    if (!auth) return null;
    
    const [type, token] = auth.split(' ');
    if (type !== 'Bearer') return null;
    
    return token;
  }

  // Sanitize user input
  sanitizeString(input) {
    if (!input) return '';
    
    return String(input)
      .trim()
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript:
      .substring(0, 1000); // Limit length
  }

  // Validate email format
  isValidEmail(email) {
    if (!email) return false;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length < 254;
  }

  // Validate password strength
  isStrongPassword(password) {
    if (!password || password.length < 12) return false;
    
    // Must contain: uppercase, lowercase, number, special char
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);
    
    return hasUpper && hasLower && hasNumber && hasSpecial;
  }

  // Log security event
  async logSecurityEvent(action, userId, details, clientIp) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      action: action,
      userId: userId,
      clientIp: clientIp,
      details: details
    };
    
    const key = `audit:security:${action}:${Date.now()}`;
    await this.env.STATE.put(key, JSON.stringify(logEntry), {
      expirationTtl: 7776000 // 90 days
    });
  }

  // Create error response
  createErrorResponse(message, status = 400, details = {}) {
    return new Response(
      JSON.stringify({
        error: message,
        status: status,
        timestamp: new Date().toISOString(),
        ...details
      }),
      {
        status: status,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }

  // Create success response
  createSuccessResponse(data, status = 200) {
    return new Response(
      JSON.stringify({
        success: true,
        data: data,
        timestamp: new Date().toISOString()
      }),
      {
        status: status,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }

  // Hash string using SHA-256
  async hashString(input) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Timing-safe string comparison
  timingSafeEqual(a, b) {
    if (!a || !b) return false;
    if (a.length !== b.length) return false;
    
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
  }

  // Generate random token
  generateToken(length = 32) {
    const randomBytes = crypto.getRandomValues(new Uint8Array(length));
    return Array.from(randomBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
}

// Export validator classes for input validation
export class InputValidator {
  static validateBotSettings(settings) {
    const errors = [];
    
    if (typeof settings !== 'object' || !settings) {
      throw new Error('Settings must be an object');
    }
    
    // Validate riskPerTrade
    if (settings.riskPerTrade !== undefined) {
      if (typeof settings.riskPerTrade !== 'number') {
        errors.push('riskPerTrade must be a number');
      } else if (settings.riskPerTrade < 0.1 || settings.riskPerTrade > 5) {
        errors.push('riskPerTrade must be between 0.1 and 5');
      }
    }
    
    // Validate maxDailyLoss
    if (settings.maxDailyLoss !== undefined) {
      if (typeof settings.maxDailyLoss !== 'number') {
        errors.push('maxDailyLoss must be a number');
      } else if (settings.maxDailyLoss <= 0) {
        errors.push('maxDailyLoss must be positive');
      }
    }
    
    // Validate maxOpenPositions
    if (settings.maxOpenPositions !== undefined) {
      if (typeof settings.maxOpenPositions !== 'number') {
        errors.push('maxOpenPositions must be a number');
      } else if (settings.maxOpenPositions < 1 || settings.maxOpenPositions > 100) {
        errors.push('maxOpenPositions must be between 1 and 100');
      }
    }
    
    // Validate watchedAssets
    if (settings.watchedAssets !== undefined) {
      if (!Array.isArray(settings.watchedAssets)) {
        errors.push('watchedAssets must be an array');
      } else if (settings.watchedAssets.length === 0) {
        errors.push('watchedAssets cannot be empty');
      } else {
        const VALID_ASSETS = ['BTC', 'ETH', 'XRP', 'ADA', 'SOL', 'DOGE', 'MATIC', 'ATOM'];
        for (const asset of settings.watchedAssets) {
          if (!VALID_ASSETS.includes(asset)) {
            errors.push(`${asset} is not a valid asset`);
          }
        }
      }
    }
    
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join('; ')}`);
    }
    
    return settings;
  }

  static validateSignal(signal) {
    const errors = [];
    
    if (typeof signal.entryPrice !== 'number' || signal.entryPrice <= 0) {
      errors.push('entryPrice must be positive number');
    }
    
    if (typeof signal.stopLoss !== 'number' || signal.stopLoss <= 0) {
      errors.push('stopLoss must be positive number');
    }
    
    if (typeof signal.targetPrice !== 'number' || signal.targetPrice <= 0) {
      errors.push('targetPrice must be positive number');
    }
    
    if (signal.entryPrice === signal.stopLoss) {
      errors.push('stopLoss cannot equal entryPrice');
    }
    
    if (!['BUY', 'SELL'].includes(signal.signal)) {
      errors.push('signal must be BUY or SELL');
    }
    
    if (errors.length > 0) {
      throw new Error(`Signal validation failed: ${errors.join('; ')}`);
    }
    
    return signal;
  }
}
