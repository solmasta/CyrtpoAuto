// src/pricing.js
export class PricingManager {
  constructor(env) {
    this.env = env;
    this.tiers = {
      free: {
        name: 'Free Trial',
        price: 0,
        features: [
          'Demo trading (paper account)',
          'See AI signals live',
          'Full dashboard access',
          '7-day trial',
          'No credit card required'
        ],
        limits: {
          maxTradesPerDay: 3,
          maxSignalsPerDay: 10,
          support: 'Community'
        }
      },
      basic: {
        name: 'Basic',
        price: 9.99,
        features: [
          'Real AI trading',
          'All advanced features',
          'Phone alerts',
          'Daily dashboard',
          'Priority support',
          'Cancel anytime'
        ],
        limits: {
          maxTradesPerDay: 10,
          maxSignalsPerDay: 50,
          support: 'Email & Chat'
        }
      },
      premium: {
        name: 'Premium',
        price: 29.99,
        features: [
          'Everything in Basic',
          'Advanced AI strategies',
          'Telegram alerts',
          'Email alerts',
          'Weekly updates',
          '24/7 priority support'
        ],
        limits: {
          maxTradesPerDay: 50,
          maxSignalsPerDay: 'Unlimited',
          support: '24/7 Phone'
        }
      }
    };
  }

  async getUserTier(userId) {
    const userData = await this.env.STATE.get(`user:${userId}`, { type: 'json' });
    return userData?.tier || 'free';
  }

  async setUserTier(userId, tier) {
    if (!this.tiers[tier]) {
      throw new Error(`Invalid tier: ${tier}`);
    }

    const userData = await this.env.STATE.get(`user:${userId}`, { type: 'json' }) || {};
    userData.tier = tier;
    userData.tierUpdatedAt = new Date().toISOString();
    
    await this.env.STATE.put(`user:${userId}`, JSON.stringify(userData));
    
    // Log tier change
    await this.logAudit('TIER_UPDATED', userId, { tier: tier });
    
    return { success: true, tier: tier };
  }

  async createCheckoutSession(userId, tier, successUrl, cancelUrl) {
    const stripeSecret = this.env.STRIPE_SECRET_KEY;
    
    if (!stripeSecret) {
      throw new Error('Stripe not configured');
    }

    const sessionData = {
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `CryptoAuto ${this.tiers[tier].name}`,
            description: this.tiers[tier].features.join(', ')
          },
          unit_amount: Math.round(this.tiers[tier].price * 100),
        },
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: userId,
      metadata: {
        userId: userId,
        tier: tier
      }
    };

    // Store session data
    const sessionId = `stripe_session_${Date.now()}`;
    await this.env.STATE.put(`session:${sessionId}`, JSON.stringify({
      userId: userId,
      tier: tier,
      createdAt: new Date().toISOString(),
      status: 'pending'
    }));

    return {
      sessionId: sessionId,
      tier: tier,
      price: this.tiers[tier].price
    };
  }

  async getAllTiers() {
    return this.tiers;
  }

  async logAudit(action, userId, details) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      action: action,
      userId: userId,
      details: details
    };
    
    await this.env.STATE.put(`audit:pricing:${action}:${Date.now()}`, JSON.stringify(logEntry), {
      expirationTtl: 7776000 // 90 days
    });
  }
}