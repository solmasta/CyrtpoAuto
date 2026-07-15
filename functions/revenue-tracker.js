
// src/revenue-tracker.js
export class RevenueTracker {
  constructor(env) {
    this.env = env;
  }

  async recordRevenue(amount, source, userId = null, metadata = {}) {
    if (isNaN(amount) || amount <= 0) {
      throw new Error('Invalid revenue amount');
    }

    const timestamp = new Date().toISOString();
    const date = timestamp.split('T')[0];
    const month = timestamp.slice(0, 7); // YYYY-MM

    // Record transaction
    const transactionId = `revenue_${Date.now()}`;
    const transaction = {
      id: transactionId,
      amount: parseFloat(amount.toFixed(2)),
      currency: 'USD',
      source: source,
      userId: userId,
      metadata: metadata,
      timestamp: timestamp
    };

    await this.env.REVENUE_DATA.put(`transaction:${transactionId}`, JSON.stringify(transaction));

    // Update daily total
    const dailyKey = `daily:${date}`;
    const dailyData = await this.env.REVENUE_DATA.get(dailyKey, { type: 'json' }) || {
      total: 0,
      transactionCount: 0,
      sources: {}
    };
    
    dailyData.total += amount;
    dailyData.transactionCount++;
    dailyData.sources[source] = (dailyData.sources[source] || 0) + amount;
    dailyData.lastUpdated = timestamp;
    
    await this.env.REVENUE_DATA.put(dailyKey, JSON.stringify(dailyData));

    // Update monthly total
    const monthlyKey = `monthly:${month}`;
    const monthlyData = await this.env.REVENUE_DATA.get(monthlyKey, { type: 'json' }) || {
      total: 0,
      transactionCount: 0,
      days: {}
    };
    
    monthlyData.total += amount;
    monthlyData.transactionCount++;
    monthlyData.days[date] = (monthlyData.days[date] || 0) + amount;
    monthlyData.lastUpdated = timestamp;
    
    await this.env.REVENUE_DATA.put(monthlyKey, JSON.stringify(monthlyData));

    // Update all-time total
    const allTimeKey = 'all_time';
    const allTimeData = await this.env.REVENUE_DATA.get(allTimeKey, { type: 'json' }) || {
      total: 0,
      transactionCount: 0,
      firstTransaction: timestamp,
      lastTransaction: timestamp
    };
    
    allTimeData.total += amount;
    allTimeData.transactionCount++;
    allTimeData.lastTransaction = timestamp;
    
    await this.env.REVENUE_DATA.put(allTimeKey, JSON.stringify(allTimeData));

    // Log revenue event
    await this.logRevenueEvent(transaction);

    return transaction;
  }

  async getDailyRevenue(date = null) {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const dailyKey = `daily:${targetDate}`;
    
    const data = await this.env.REVENUE_DATA.get(dailyKey, { type: 'json' }) || {
      total: 0,
      transactionCount: 0,
      sources: {}
    };
    
    return {
      date: targetDate,
      ...data
    };
  }

  async getMonthlyRevenue(month = null) {
    const targetMonth = month || new Date().toISOString().slice(0, 7);
    const monthlyKey = `monthly:${targetMonth}`;
    
    const data = await this.env.REVENUE_DATA.get(monthlyKey, { type: 'json' }) || {
      total: 0,
      transactionCount: 0,
      days: {}
    };
    
    return {
      month: targetMonth,
      ...data
    };
  }

  async getAllTimeRevenue() {
    const allTimeKey = 'all_time';
    const data = await this.env.REVENUE_DATA.get(allTimeKey, { type: 'json' }) || {
      total: 0,
      transactionCount: 0,
      firstTransaction: null,
      lastTransaction: null
    };
    
    return data;
  }

  async getRevenueTrend(days = 30) {
    const trends = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dailyData = await this.getDailyRevenue(dateStr);
      trends.push({
        date: dateStr,
        revenue: dailyData.total,
        transactions: dailyData.transactionCount
      });
    }
    
    return trends;
  }

  async calculateMRR() {
    const monthlyData = await this.getMonthlyRevenue();
    
    // Get all users with paid subscriptions
    // This would query your user database
    // For now, return monthly revenue
    return {
      mrr: monthlyData.total,
      trend: 'up', // Calculate based on previous month
      subscribers: 0 // Placeholder
    };
  }

  async logRevenueEvent(transaction) {
    const logKey = `revenue_log:${transaction.timestamp}`;
    await this.env.REVENUE_DATA.put(logKey, JSON.stringify(transaction), {
      expirationTtl: 2592000 // 30 days
    });
  }
}
