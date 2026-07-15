// src/notifications.js
export class NotificationManager {
  constructor(env) {
    this.env = env;
  }

  async sendTradeNotification(userId, tradeData) {
    const user = await this.env.STATE.get(`user:${userId}`, { type: 'json' });
    if (!user || !user.notifications?.trade) {
      return false;
    }

    const message = this.formatTradeMessage(tradeData);
    
    // Send via preferred method
    if (user.notifications.email) {
      await this.sendEmail(user.email, 'Trade Executed', message);
    }
    
    if (user.notifications.telegram) {
      await this.sendTelegram(user.telegramChatId, message);
    }
    
    if (user.notifications.webhook) {
      await this.sendWebhook(user.webhookUrl, message);
    }

    return true;
  }

  async sendAlert(userId, alertData) {
    const user = await this.env.STATE.get(`user:${userId}`, { type: 'json' });
    if (!user || !user.notifications?.alerts) {
      return false;
    }

    const message = this.formatAlertMessage(alertData);
    
    // Send via preferred method
    if (user.notifications.email) {
      await this.sendEmail(user.email, 'System Alert', message);
    }
    
    if (user.notifications.telegram) {
      await this.sendTelegram(user.telegramChatId, message);
    }

    await this.logNotification('ALERT', userId, alertData);
    return true;
  }

  async sendProfitNotification(userId, profitData) {
    const user = await this.env.STATE.get(`user:${userId}`, { type: 'json' });
    if (!user || !user.notifications?.profit) {
      return false;
    }

    const message = this.formatProfitMessage(profitData);
    
    if (user.notifications.email) {
      await this.sendEmail(user.email, 'Profit Alert', message);
    }
    
    if (user.notifications.telegram) {
      await this.sendTelegram(user.telegramChatId, message);
    }

    await this.logNotification('PROFIT', userId, profitData);
    return true;
  }

  async sendEmail(to, subject, body) {
    // Implementation for sending email
    // Could use SendGrid, Mailgun, etc.
    console.log(`Email to ${to}: ${subject} - ${body}`);
    return true;
  }

  async sendTelegram(chatId, message) {
    // Implementation for sending Telegram message
    // Use Telegram Bot API
    console.log(`Telegram to ${chatId}: ${message}`);
    return true;
  }

  async sendWebhook(url, data) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      return response.ok;
    } catch (error) {
      console.error('Webhook error:', error);
      return false;
    }
  }

  formatTradeMessage(tradeData) {
    return `💰 Trade ${tradeData.signal}: ${tradeData.asset}
Entry: $${tradeData.entryPrice}
Target: $${tradeData.targetPrice}
Stop Loss: $${tradeData.stopLoss}
Risk/Reward: ${tradeData.riskReward}:1
Time: ${new Date().toLocaleString()}`;
  }

  formatAlertMessage(alertData) {
    return `⚠️ Alert: ${alertData.type}
${alertData.message}
Time: ${new Date().toLocaleString()}`;
  }

  formatProfitMessage(profitData) {
    return `🎉 Profit: $${profitData.amount.toFixed(2)}
Trade: ${profitData.tradeId}
Asset: ${profitData.asset}
Time: ${new Date().toLocaleString()}`;
  }

  async logNotification(type, userId, data) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: type,
      userId: userId,
      data: data
    };
    
    await this.env.STATE.put(`notification:${type}:${Date.now()}`, JSON.stringify(logEntry), {
      expirationTtl: 7776000 // 90 days
    });
  }
}
