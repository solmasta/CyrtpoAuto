// src/performance-tracker.js
export class PerformanceTracker {
  constructor(env) {
    this.env = env;
  }

  async trackTradePerformance(userId, tradeData) {
    const performanceKey = `performance:${userId}:${tradeData.tradeId}`;
    
    const performance = {
      tradeId: tradeData.tradeId,
      userId: userId,
      asset: tradeData.asset,
      entryPrice: tradeData.entryPrice,
      exitPrice: tradeData.exitPrice,
      quantity: tradeData.quantity,
      profit: tradeData.profit,
      profitPercentage: tradeData.profitPercentage,
      duration: tradeData.duration,
      signalStrength: tradeData.signalStrength,
      riskReward: tradeData.riskReward,
      timestamp: new Date().toISOString()
    };

    await this.env.STATE.put(performanceKey, JSON.stringify(performance));
    
    // Update user stats
    await this.updateUserStats(userId, performance);
    
    // Update global stats
    await this.updateGlobalStats(performance);
    
    return performance;
  }

  async updateUserStats(userId, performance) {
    const userKey = `user_stats:${userId}`;
    const stats = await this.env.STATE.get(userKey, { type: 'json' }) || {
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      totalProfit: 0,
      totalLoss: 0,
      avgProfitPerTrade: 0,
      winRate: 0,
      bestTrade: { profit: 0 },
      worstTrade: { profit: 0 },
      lastUpdated: new Date().toISOString()
    };

    stats.totalTrades++;
    
    if (performance.profit > 0) {
      stats.winningTrades++;
      stats.totalProfit += performance.profit;
    } else {
      stats.losingTrades++;
      stats.totalLoss += Math.abs(performance.profit);
    }

    // Update best/worst trade
    if (performance.profit > stats.bestTrade.profit) {
      stats.bestTrade = {
        tradeId: performance.tradeId,
        asset: performance.asset,
        profit: performance.profit,
        timestamp: performance.timestamp
      };
    }
    
    if (performance.profit < stats.worstTrade.profit) {
      stats.worstTrade = {
        tradeId: performance.tradeId,
        asset: performance.asset,
        profit: performance.profit,
        timestamp: performance.timestamp
      };
    }

    // Calculate averages
    const totalTrades = stats.winningTrades + stats.losingTrades;
    stats.avgProfitPerTrade = totalTrades > 0 
      ? (stats.totalProfit - stats.totalLoss) / totalTrades 
      : 0;
    
    stats.winRate = totalTrades > 0 
      ? (stats.winningTrades / totalTrades) * 100 
      : 0;
    
    stats.lastUpdated = new Date().toISOString();

    await this.env.STATE.put(userKey, JSON.stringify(stats));
    
    return stats;
  }

  async updateGlobalStats(performance) {
    const globalKey = 'global_stats';
    const stats = await this.env.STATE.get(globalKey, { type: 'json' }) || {
      totalTrades: 0,
      totalProfit: 0,
      activeUsers: 0,
      avgProfitPerTrade: 0,
      lastUpdated: new Date().toISOString()
    };

    stats.totalTrades++;
    stats.totalProfit += performance.profit;
    stats.avgProfitPerTrade = stats.totalProfit / stats.totalTrades;
    stats.lastUpdated = new Date().toISOString();

    await this.env.STATE.put(globalKey, JSON.stringify(stats));
    
    return stats;
  }

  async getUserPerformance(userId, period = 'all') {
    const userKey = `user_stats:${userId}`;
    const stats = await this.env.STATE.get(userKey, { type: 'json' }) || {
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      totalProfit: 0,
      totalLoss: 0,
      avgProfitPerTrade: 0,
      winRate: 0,
      bestTrade: { profit: 0 },
      worstTrade: { profit: 0 },
      lastUpdated: new Date().toISOString()
    };

    // Get recent trades for the period
    const trades = await this.getRecentTrades(userId, period);
    
    return {
      summary: stats,
      recentTrades: trades,
      period: period,
      timestamp: new Date().toISOString()
    };
  }

  async getRecentTrades(userId, period = '30d') {
    const now = Date.now();
    let cutoffTime;
    
    switch(period) {
      case '7d':
        cutoffTime = now - (7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        cutoffTime = now - (30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        cutoffTime = now - (90 * 24 * 60 * 60 * 1000);
        break;
      default:
        cutoffTime = 0; // All time
    }

    // This would query your trade database
    // For now, return mock data
    return [
      {
        tradeId: 'trade_1',
        asset: 'BTC',
        profit: 150.25,
        profitPercentage: 3.2,
        timestamp: new Date(now - 86400000).toISOString() // 1 day ago
      },
      {
        tradeId: 'trade_2',
        asset: 'ETH',
        profit: -45.50,
        profitPercentage: -1.8,
        timestamp: new Date(now - 172800000).toISOString() // 2 days ago
      }
    ];
  }

  async getLeaderboard(limit = 10) {
    // This would query all users and sort by performance
    // For now, return mock data
    return {
      period: 'all_time',
      timestamp: new Date().toISOString(),
      topPerformers: [
        { userId: 'user1', totalProfit: 1250.75, winRate: 68.5 },
        { userId: 'user2', totalProfit: 980.25, winRate: 62.3 },
        { userId: 'user3', totalProfit: 750.50, winRate: 59.8 }
      ]
    };
  }

  async calculateMetrics(userId) {
    const stats = await this.getUserPerformance(userId);
    
    return {
      sharpeRatio: this.calculateSharpeRatio(stats.recentTrades),
      maxDrawdown: this.calculateMaxDrawdown(stats.recentTrades),
      profitFactor: this.calculateProfitFactor(stats.summary),
      recoveryFactor: this.calculateRecoveryFactor(stats.recentTrades),
      winRate: stats.summary.winRate,
      avgWin: this.calculateAverageWin(stats.recentTrades),
      avgLoss: this.calculateAverageLoss(stats.recentTrades)
    };
  }

  calculateSharpeRatio(trades) {
    if (trades.length === 0) return 0;
    
    const profits = trades.map(t => t.profit);
    const mean = profits.reduce((a, b) => a + b, 0) / profits.length;
    const stdDev = Math.sqrt(
      profits.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / profits.length
    );
    
    return stdDev > 0 ? mean / stdDev : 0;
  }

  calculateMaxDrawdown(trades) {
    let maxDrawdown = 0;
    let peak = 0;
    let runningTotal = 0;
    
    trades.forEach(trade => {
      runningTotal += trade.profit;
      peak = Math.max(peak, runningTotal);
      const drawdown = peak - runningTotal;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    });
    
    return maxDrawdown;
  }

  calculateProfitFactor(stats) {
    return stats.totalLoss > 0 ? stats.totalProfit / stats.totalLoss : Infinity;
  }

  calculateRecoveryFactor(trades) {
    const maxDrawdown = this.calculateMaxDrawdown(trades);
    const totalProfit = trades.reduce((sum, t) => sum + Math.max(t.profit, 0), 0);
    
    return maxDrawdown > 0 ? totalProfit / maxDrawdown : 0;
  }

  calculateAverageWin(trades) {
    const winningTrades = trades.filter(t => t.profit > 0);
    return winningTrades.length > 0 
      ? winningTrades.reduce((sum, t) => sum + t.profit, 0) / winningTrades.length 
      : 0;
  }

  calculateAverageLoss(trades) {
    const losingTrades = trades.filter(t => t.profit < 0);
    return losingTrades.length > 0 
      ? losingTrades.reduce((sum, t) => sum + Math.abs(t.profit), 0) / losingTrades.length 
      : 0;
  }
}
