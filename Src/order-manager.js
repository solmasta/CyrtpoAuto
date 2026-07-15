// src/order-manager-FIXED.js
// Manage automated trading orders and positions
// ✅ FIXED: Position size uses stop loss distance (not /10)
// ✅ FIXED: Coin quantity = USDT / entryPrice
// ✅ FIXED: Profit calculation correct for SELL orders
// ✅ FIXED: Signal deduplication to prevent duplicate trades

import crypto from 'crypto';

export class OrderManager {
  constructor(env, exchange) {
    this.env = env;
    this.exchange = exchange;
  }

  // Execute automated trade based on signal
  async executeSignalTrade(userId, signal, botSettings) {
    try {
      // ✅ FIXED: Check for duplicate signals
      const signalHash = await this.getSignalHash(signal);
      const alreadyExecuted = await this.env.STATE.get(`signal_executed:${signalHash}`);
      
      if (alreadyExecuted) {
        return {
          success: false,
          reason: 'Signal already executed (duplicate)',
          signalHash: signalHash
        };
      }

      // 1. Calculate position size using stop loss distance
      const positionSizeUSDT = await this.calculatePositionSize(
        userId,
        signal.entryPrice,
        signal.stopLoss,
        botSettings.riskPerTrade,
        botSettings.maxPositionSize
      );

      if (positionSizeUSDT <= 0) {
        return {
          success: false,
          reason: 'Position size too small or account balance insufficient'
        };
      }

      // ✅ FIXED: Convert USDT to coin quantity
      const coinQuantity = positionSizeUSDT / signal.entryPrice;
      if (coinQuantity <= 0) {
        return {
          success: false,
          reason: 'Invalid coin quantity'
        };
      }

      // 2. Validate against daily loss limit
      const dailyLoss = await this.getDailyLoss(userId);
      if (dailyLoss > botSettings.maxDailyLoss) {
        return {
          success: false,
          reason: 'Daily loss limit exceeded',
          currentLoss: dailyLoss,
          limit: botSettings.maxDailyLoss
        };
      }

      // ✅ FIXED: Calculate profit correctly for both BUY and SELL
      let expectedProfit, expectedLoss;
      if (signal.signal === 'BUY') {
        expectedProfit = (signal.targetPrice - signal.entryPrice) * coinQuantity;
        expectedLoss = (signal.entryPrice - signal.stopLoss) * coinQuantity;
      } else { // SELL
        expectedProfit = (signal.entryPrice - signal.targetPrice) * coinQuantity;
        expectedLoss = (signal.stopLoss - signal.entryPrice) * coinQuantity;
      }

      // 3. Create order
      const order = {
        userId: userId,
        asset: signal.asset,
        signal: signal.signal,
        entryPrice: signal.entryPrice,
        targetPrice: signal.targetPrice,
        stopLoss: signal.stopLoss,
        positionSizeUSDT: parseFloat(positionSizeUSDT.toFixed(2)),
        coinQuantity: parseFloat(coinQuantity.toFixed(8)),
        riskReward: signal.riskReward,
        expectedProfit: parseFloat(expectedProfit.toFixed(8)),
        expectedLoss: parseFloat(expectedLoss.toFixed(8)),
        status: 'PENDING_EXECUTION',
        createdAt: new Date().toISOString()
      };

      // Store order
      const orderId = `order_${userId}_${Date.now()}`;
      await this.env.STATE.put(`order:${orderId}`, JSON.stringify(order));

      // 4. Execute on exchange (if paper trading is off)
      if (!botSettings.paperTrading) {
        try {
          const executionResult = await this.exchange.executeMarketOrder(
            signal.asset,
            signal.signal === 'BUY' ? 'BUY' : 'SELL',
            coinQuantity
          );

          order.status = 'EXECUTED';
          order.exchangeOrderId = executionResult.orderId;
          order.executedPrice = executionResult.price;
          order.executedAt = executionResult.timestamp;
          order.exchange = executionResult.exchange;

          // Set stop loss and take profit
          if (!botSettings.disableAutoStopTakeProfit) {
            await this.exchange.setStopLossAndTakeProfit(
              signal.asset,
              executionResult.orderId,
              signal.stopLoss,
              signal.targetPrice
            );
          }
        } catch (error) {
          order.status = 'EXECUTION_FAILED';
          order.executionError = error.message;
        }
      } else {
        order.status = 'PAPER_EXECUTED';
        order.paperTrading = true;
      }

      // Update order
      await this.env.STATE.put(`order:${orderId}`, JSON.stringify(order));

      // Mark signal as executed
      await this.env.STATE.put(`signal_executed:${signalHash}`, JSON.stringify({
        executed: true,
        timestamp: new Date().toISOString(),
        orderId: orderId
      }));

      // Store in active positions
      await this.addActivePosition(userId, orderId, order);

      // Log to history
      await this.logOrderHistory(userId, orderId, order);

      return {
        success: true,
        orderId: orderId,
        order: order
      };
    } catch (error) {
      console.error('Trade execution error:', error);
      return {
        success: false,
        reason: error.message
      };
    }
  }

  // ✅ FIXED: Position size based on stop loss distance
  async calculatePositionSize(userId, entryPrice, stopLoss, riskPercentage, maxPositionSize) {
    try {
      // Get account balance
      const balance = await this.exchange.getBalance();
      const usdtBalance = balance.USDT?.free || 0;

      if (usdtBalance === 0) return 0;

      // Calculate max risk amount
      const riskAmount = usdtBalance * (riskPercentage / 100);

      // ✅ FIXED: Use actual stop loss distance
      const priceDistance = Math.abs(entryPrice - stopLoss);
      if (priceDistance === 0) return 0;

      // Position size = riskAmount / priceDistance
      let positionSize = riskAmount / priceDistance;

      // Apply max position size limit
      if (maxPositionSize && maxPositionSize > 0) {
        positionSize = Math.min(positionSize, maxPositionSize);
      }

      // Ensure minimum position
      positionSize = Math.max(positionSize, 0.1);

      return parseFloat(positionSize.toFixed(2));
    } catch (error) {
      console.error('Position size calculation error:', error);
      return 0;
    }
  }

  // Get signal hash for deduplication
  async getSignalHash(signal) {
    const signalString = JSON.stringify({
      asset: signal.asset,
      signal: signal.signal,
      entryPrice: signal.entryPrice,
      targetPrice: signal.targetPrice,
      stopLoss: signal.stopLoss,
      timestamp: signal.timestamp
    });

    // Simple hash (in production, use crypto.subtle.digest)
    let hash = 0;
    for (let i = 0; i < signalString.length; i++) {
      const char = signalString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `signal_${hash}`;
  }

  // Get daily loss
  async getDailyLoss(userId) {
    const key = `daily_stats:${userId}:${new Date().toISOString().split('T')[0]}`;
    const stats = await this.env.STATE.get(key, { type: 'json' }) || { totalProfit: 0 };
    const dailyLoss = Math.abs(Math.min(stats.totalProfit, 0));
    return dailyLoss;
  }

  // Add position to active list
  async addActivePosition(userId, orderId, order) {
    const key = `active_positions:${userId}`;
    const positions = await this.env.STATE.get(key, { type: 'json' }) || [];

    positions.push({
      orderId: orderId,
      asset: order.asset,
      coinQuantity: order.coinQuantity,
      positionSizeUSDT: order.positionSizeUSDT,
      entryPrice: order.entryPrice,
      targetPrice: order.targetPrice,
      stopLoss: order.stopLoss,
      status: order.status,
      createdAt: order.createdAt
    });

    await this.env.STATE.put(key, JSON.stringify(positions));
  }

  // Log to order history
  async logOrderHistory(userId, orderId, order) {
    const key = `order_history:${userId}`;
    const history = await this.env.STATE.get(key, { type: 'json' }) || [];

    history.push({
      orderId: orderId,
      ...order
    });

    await this.env.STATE.put(key, JSON.stringify(history));
  }
}
