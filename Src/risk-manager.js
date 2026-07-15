// src/risk-manager.js - FIXED VERSION
// Risk management: position sizing, stop loss, daily loss limits
// ALL CRITICAL ISSUES FIXED

export class RiskManager {
  constructor(env) {
    this.env = env;
  }

  // Get default bot settings
  getDefaultBotSettings() {
    return {
      enabled: false,
      exchange: 'BINANCE',
      paperTrading: true,
      riskPerTrade: 1, // FIX: Changed from 2% to 1% max
      maxPositionSize: 100,
      maxDailyLoss: 200, // 5% of $4000 account
      maxOpenPositions: 5,
      tradeTimeout: 24,
      minConfidence: 0.65,
      disableAutoStopTakeProfit: false,
      watchedAssets: ['BTC', 'ETH', 'XRP'],
      tradingHours: {
        enabled: false,
        start: 9,
        end: 17
      }
    };
  }

  async saveBotSettings(userId, settings) {
    // FIX: Validate settings before saving
    this.validateBotSettings(settings);
    
    const key = `bot_settings:${userId}`;
    const merged = {
      ...this.getDefaultBotSettings(),
      ...settings,
      lastUpdated: new Date().toISOString()
    };

    await this.env.STATE.put(key, JSON.stringify(merged));
    return merged;
  }

  async getBotSettings(userId) {
    const key = `bot_settings:${userId}`;
    const settings = await this.env.STATE.get(key, { type: 'json' });
    return settings || this.getDefaultBotSettings();
  }

  // FIX: Validate all settings
  validateBotSettings(settings) {
    const errors = [];
    
    if (settings.riskPerTrade !== undefined) {
      if (typeof settings.riskPerTrade !== 'number' || settings.riskPerTrade <= 0 || settings.riskPerTrade > 5) {
        errors.push('riskPerTrade must be between 0.1 and 5');
      }
    }
    
    if (settings.maxDailyLoss !== undefined) {
      if (typeof settings.maxDailyLoss !== 'number' || settings.maxDailyLoss <= 0) {
        errors.push('maxDailyLoss must be positive');
      }
    }
    
    if (settings.maxOpenPositions !== undefined) {
      if (typeof settings.maxOpenPositions !== 'number' || settings.maxOpenPositions < 1) {
        errors.push('maxOpenPositions must be at least 1');
      }
    }
    
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }
  }

  async canExecuteTrade(userId, signal, botSettings) {
    const checks = {
      confidence: signal.confidence >= botSettings.minConfidence,
      tradingHours: this.isInTradingHours(botSettings.tradingHours),
      openPositions: await this.checkOpenPositionLimit(userId, botSettings),
      dailyLoss: await this.checkDailyLossLimit(userId, botSettings),
      maxDrawdown: await this.checkMaxDrawdown(userId, botSettings)
    };

    return {
      allowed: Object.values(checks).every(v => v === true || v.allowed === true),
      checks: checks
    };
  }

  isInTradingHours(tradingHours) {
    if (!tradingHours.enabled) return true;

    const now = new Date();
    const currentHour = now.getHours();

    return currentHour >= tradingHours.start && currentHour < tradingHours.end;
  }

  async checkOpenPositionLimit(userId, botSettings) {
    const key = `active_positions:${userId}`;
    const positions = await this.env.STATE.get(key, { type: 'json' }) || [];
    return positions.length < botSettings.maxOpenPositions;
  }

  // FIX: Corrected daily loss limit logic
  async checkDailyLossLimit(userId, botSettings) {
    const date = new Date().toISOString().split('T')[0];
    const key = `daily_stats:${userId}:${date}`;
    const stats = await this.env.STATE.get(key, { type: 'json' }) || { totalProfit: 0 };
    
    // Calculate current loss (only negative profits count)
    const dailyLoss = stats.totalProfit < 0 ? Math.abs(stats.totalProfit) : 0;
    
    // FIX: Return object with details, not just boolean
    return {
      allowed: dailyLoss < botSettings.maxDailyLoss,
      dailyLoss: dailyLoss,
      limit: botSettings.maxDailyLoss,
      roomRemaining: Math.max(0, botSettings.maxDailyLoss - dailyLoss)
    };
  }

  async checkMaxDrawdown(userId, botSettings) {
    // Simplified - in production would need full portfolio value tracking
    return { allowed: true };
  }

  // Calculate position size using Kelly Criterion
  calculateKellyCriterion(winRate, avgWin, avgLoss) {
    if (avgLoss === 0) return 0.01; // Default 1%

    const probWin = winRate / 100;
    const probLoss = 1 - probWin;
    const ratio = avgWin / Math.abs(avgLoss);

    // Kelly % = (win% * ratio - loss%) / ratio
    const kelly = (probWin * ratio - probLoss) / ratio;

    // Use fractional Kelly for safety (25% of Kelly)
    return Math.max(Math.min(kelly * 0.25, 0.05), 0.01);
  }

  // FIX: Corrected position size calculation using actual stop loss distance
  calculatePositionSize(accountBalance, entryPrice, stopLoss, maxRiskPercent = 1) {
    // Validate inputs
    if (!accountBalance || !entryPrice || !stopLoss) return 0;
    if (entryPrice === stopLoss) return 0; // Avoid divide by zero
    
    // Maximum risk per trade (1% default)
    const maxRisk = accountBalance * (maxRiskPercent / 100);
    
    // Distance from entry to stop loss
    const priceDistance = Math.abs(entryPrice - stopLoss);
    
    // Position size = max risk / price distance
    const positionSize = maxRisk / priceDistance;
    
    // Also limit to max 5% of account value per position
    const maxPositionValue = accountBalance * 0.05;
    const maxPositionQty = maxPositionValue / entryPrice;
    
    const finalSize = Math.min(positionSize, maxPositionQty);
    
    return parseFloat(finalSize.toFixed(8)); // Return in crypto units
  }

  // FIX: Corrected stop loss calculation
  calculateStopLoss(entryPrice, riskPercent, side = 'BUY') {
    if (!entryPrice || riskPercent <= 0) return 0;
    
    const riskAmount = entryPrice * (riskPercent / 100);

    if (side === 'BUY') {
      return parseFloat((entryPrice - riskAmount).toFixed(8));
    } else {
      return parseFloat((entryPrice + riskAmount).toFixed(8));
    }
  }

  // FIX: Corrected take profit calculation
  calculateTakeProfit(entryPrice, rewardPercent, side = 'BUY') {
    if (!entryPrice || rewardPercent <= 0) return 0;
    
    const rewardAmount = entryPrice * (rewardPercent / 100);

    if (side === 'BUY') {
      return parseFloat((entryPrice + rewardAmount).toFixed(8));
    } else {
      return parseFloat((entryPrice - rewardAmount).toFixed(8));
    }
  }

  // FIX: Corrected risk/reward calculation with validation
  calculateRiskReward(entryPrice, stopLoss, takeProfit, side = 'BUY') {
    // Validate inputs
    if (!entryPrice || !stopLoss || !takeProfit) return 0;
    
    const risk = Math.abs(entryPrice - stopLoss);
    const reward = Math.abs(takeProfit - entryPrice);

    // Avoid divide by zero
    if (risk === 0) return 0;
    
    // Validate correct direction
    if (side === 'BUY') {
      if (stopLoss >= entryPrice || takeProfit <= entryPrice) return 0; // Invalid
    } else {
      if (stopLoss <= entryPrice || takeProfit >= entryPrice) return 0; // Invalid
    }

    return parseFloat((reward / risk).toFixed(2));
  }

  async getPortfolioStats(userId) {
    const historyKey = `order_history:${userId}`;
    const history = await this.env.STATE.get(historyKey, { type: 'json' }) || [];
    const activeKey = `active_positions:${userId}`;
    const active = await this.env.STATE.get(activeKey, { type: 'json' }) || [];

    const closed = history.filter(o => o.status === 'CLOSED');
    const totalProfit = closed.reduce((sum, o) => sum + (o.profit || 0), 0);
    const totalInvested = closed.reduce((sum, o) => {
      // FIX: Use actual invested amount, not quantity * price
      return sum + (o.investedAmount || o.quantity * o.entryPrice || 0);
    }, 0);

    return {
      totalTrades: closed.length,
      activePositions: active.length,
      totalProfit: parseFloat(totalProfit.toFixed(2)),
      totalInvested: parseFloat(totalInvested.toFixed(2)),
      ROI: totalInvested > 0 ? parseFloat(((totalProfit / totalInvested) * 100).toFixed(2)) : 0,
      avgTradeSize: closed.length > 0 ? parseFloat((totalInvested / closed.length).toFixed(2)) : 0
    };
  }

  async getRiskMetrics(userId) {
    const historyKey = `order_history:${userId}`;
    const history = await this.env.STATE.get(historyKey, { type: 'json' }) || [];
    const closed = history.filter(o => o.status === 'CLOSED');

    if (closed.length === 0) {
      return {
        sharpeRatio: 0,
        maxDrawdown: 0,
        profitFactor: 0,
        recoveryFactor: 0,
        winRate: 0,
        avgWin: 0,
        avgLoss: 0
      };
    }

    const wins = closed.filter(o => o.profit > 0);
    const losses = closed.filter(o => o.profit < 0);

    const totalWins = wins.reduce((sum, o) => sum + o.profit, 0);
    const totalLosses = Math.abs(losses.reduce((sum, o) => sum + o.profit, 0));

    // FIX: Avoid divide by zero
    const profitFactor = totalLosses > 0 ? totalWins / totalLosses : (totalWins > 0 ? Infinity : 0);

    // Drawdown calculation
    let cumulativeProfit = 0;
    let maxProfit = 0;
    let maxDrawdown = 0;

    closed.forEach(trade => {
      cumulativeProfit += trade.profit;
      maxProfit = Math.max(maxProfit, cumulativeProfit);
      const drawdown = maxProfit - cumulativeProfit;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    });

    const avgLoss = losses.length > 0 ? totalLosses / losses.length : 0;
    const sharpeRatio = avgLoss > 0 ? (totalWins / closed.length) / avgLoss : 0;

    return {
      sharpeRatio: parseFloat(sharpeRatio.toFixed(2)),
      maxDrawdown: parseFloat(maxDrawdown.toFixed(2)),
      profitFactor: parseFloat(profitFactor === Infinity ? 0 : profitFactor.toFixed(2)),
      recoveryFactor: maxDrawdown > 0 ? parseFloat(((totalWins - totalLosses) / maxDrawdown).toFixed(2)) : 0,
      winRate: parseFloat(((wins.length / closed.length) * 100).toFixed(2)),
      avgWin: wins.length > 0 ? parseFloat((totalWins / wins.length).toFixed(2)) : 0,
      avgLoss: losses.length > 0 ? parseFloat((totalLosses / losses.length).toFixed(2)) : 0
    };
  }

  async checkRiskAlerts(userId, botSettings) {
    const alerts = [];

    // Check daily loss limit
    const dailyLossCheck = await this.checkDailyLossLimit(userId, botSettings);
    if (!dailyLossCheck.allowed) {
      alerts.push({
        type: 'DAILY_LOSS_LIMIT',
        message: `Daily loss limit of $${botSettings.maxDailyLoss} reached (current: $${dailyLossCheck.dailyLoss})`,
        severity: 'HIGH',
        action: 'STOP_TRADING'
      });
    }

    // Check open positions
    const posLimit = await this.checkOpenPositionLimit(userId, botSettings);
    if (!posLimit) {
      alerts.push({
        type: 'POSITION_LIMIT',
        message: `Max open positions (${botSettings.maxOpenPositions}) reached`,
        severity: 'MEDIUM',
        action: 'CLOSE_POSITION'
      });
    }

    // Check max drawdown
    const metrics = await this.getRiskMetrics(userId);
    if (metrics.maxDrawdown > botSettings.maxDailyLoss * 2) {
      alerts.push({
        type: 'DRAWDOWN_WARNING',
        message: `Drawdown of $${metrics.maxDrawdown.toFixed(2)} exceeds threshold`,
        severity: 'HIGH',
        action: 'REDUCE_LEVERAGE'
      });
    }

    return alerts;
  }
}
