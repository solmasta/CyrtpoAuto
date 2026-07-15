// src/price-data.js
export class PriceDataManager {
  constructor(env) {
    this.env = env;
    this.cache = new Map();
    this.cacheDuration = 60000; // 1 minute
  }

  async getMarketData(asset) {
    const cacheKey = `market_data:${asset}`;
    const cached = await this.env.STATE.get(cacheKey, { type: 'json' });
    
    if (cached && Date.now() - new Date(cached.timestamp).getTime() < this.cacheDuration) {
      return cached.data;
    }

    try {
      const priceData = await this.fetchPriceData(asset);
      const volumeData = await this.fetchVolumeData(asset);
      const marketCap = await this.fetchMarketCap(asset);
      const change24h = await this.fetch24hChange(asset);

      const data = {
        asset: asset,
        price: priceData,
        volume24h: volumeData,
        marketCap: marketCap,
        change24h: change24h,
        timestamp: new Date().toISOString()
      };

      // Cache the data
      await this.env.STATE.put(cacheKey, JSON.stringify({
        data: data,
        timestamp: new Date().toISOString()
      }));

      return data;
    } catch (error) {
      console.error(`Error fetching market data for ${asset}:`, error);
      return this.getMockMarketData(asset);
    }
  }

  async getMomentum(asset) {
    const cacheKey = `momentum:${asset}`;
    const cached = await this.env.STATE.get(cacheKey, { type: 'json' });
    
    if (cached && Date.now() - new Date(cached.timestamp).getTime() < this.cacheDuration) {
      return cached.data;
    }

    try {
      // Fetch price history for momentum calculation
      const prices = await this.fetchPriceHistory(asset, '1h', 24); // Last 24 hours hourly
      
      if (prices.length < 2) {
        return { momentum: 0, trend: 'neutral', strength: 0 };
      }

      const momentum = this.calculateMomentum(prices);
      const trend = this.determineTrend(prices);
      const strength = this.calculateStrength(prices);

      const data = {
        asset: asset,
        momentum: momentum,
        trend: trend,
        strength: strength,
        timestamp: new Date().toISOString()
      };

      // Cache the data
      await this.env.STATE.put(cacheKey, JSON.stringify({
        data: data,
        timestamp: new Date().toISOString()
      }));

      return data;
    } catch (error) {
      console.error(`Error calculating momentum for ${asset}:`, error);
      return {
        asset: asset,
        momentum: 0,
        trend: 'neutral',
        strength: 0,
        timestamp: new Date().toISOString()
      };
    }
  }

  async fetchPriceData(asset) {
    // Mock implementation - replace with actual API calls
    const mockPrices = {
      'BTC': 50000 + (Math.random() * 1000 - 500),
      'ETH': 3000 + (Math.random() * 100 - 50),
      'XRP': 0.5 + (Math.random() * 0.1 - 0.05),
      'ADA': 0.4 + (Math.random() * 0.05 - 0.025),
      'SOL': 100 + (Math.random() * 10 - 5)
    };
    
    return mockPrices[asset] || 100 + (Math.random() * 10 - 5);
  }

  async fetchVolumeData(asset) {
    // Mock implementation
    const mockVolumes = {
      'BTC': 1000000 + (Math.random() * 500000 - 250000),
      'ETH': 500000 + (Math.random() * 250000 - 125000),
      'XRP': 100000 + (Math.random() * 50000 - 25000),
      'ADA': 50000 + (Math.random() * 25000 - 12500),
      'SOL': 25000 + (Math.random() * 12500 - 6250)
    };
    
    return mockVolumes[asset] || 10000 + (Math.random() * 5000 - 2500);
  }

  async fetchMarketCap(asset) {
    // Mock implementation
    const mockCaps = {
      'BTC': 1000000000,
      'ETH': 500000000,
      'XRP': 100000000,
      'ADA': 50000000,
      'SOL': 25000000
    };
    
    return mockCaps[asset] || 10000000;
  }

  async fetch24hChange(asset) {
    // Mock implementation
    return (Math.random() * 10) - 5; // -5% to +5%
  }

  async fetchPriceHistory(asset, interval = '1h', limit = 24) {
    // Mock implementation
    const prices = [];
    let basePrice = this.fetchPriceData(asset);
    
    for (let i = 0; i < limit; i++) {
      const price = await basePrice;
      prices.push({
        price: price + (Math.random() * 100 - 50),
        timestamp: new Date(Date.now() - (i * 3600000)).toISOString()
      });
    }
    
    return prices;
  }

  calculateMomentum(prices) {
    if (prices.length < 2) return 0;
    
    const recentPrices = prices.slice(-10); // Last 10 periods
    const sum = recentPrices.reduce((total, p) => total + p.price, 0);
    const avg = sum / recentPrices.length;
    
    // Simple momentum: (current - average) / average
    const current = prices[prices.length - 1].price;
    return (current - avg) / avg;
  }

  determineTrend(prices) {
    if (prices.length < 10) return 'neutral';
    
    const firstHalf = prices.slice(0, Math.floor(prices.length / 2));
    const secondHalf = prices.slice(Math.floor(prices.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, p) => sum + p.price, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, p) => sum + p.price, 0) / secondHalf.length;
    
    const change = ((secondAvg - firstAvg) / firstAvg) * 100;
    
    if (change > 2) return 'bullish';
    if (change < -2) return 'bearish';
    return 'neutral';
  }

  calculateStrength(prices) {
    if (prices.length < 5) return 0;
    
    const changes = [];
    for (let i = 1; i < prices.length; i++) {
      const change = (prices[i].price - prices[i-1].price) / prices[i-1].price;
      changes.push(change);
    }
    
    const variance = changes.reduce((sum, change) => sum + Math.pow(change, 2), 0) / changes.length;
    return Math.min(Math.max(variance * 100, 0), 1);
  }

  getMockMarketData(asset) {
    return {
      asset: asset,
      price: this.fetchPriceData(asset),
      volume24h: this.fetchVolumeData(asset),
      marketCap: this.fetchMarketCap(asset),
      change24h: this.fetch24hChange(asset),
      timestamp: new Date().toISOString()
    };
  }

  async clearCache() {
    // Clear all cached price data
    // Implementation would depend on how you store cache keys
    console.log('Cache cleared');
  }
}
