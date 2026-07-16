/**
 * CryptoAuto - Complete Worker with Pricing & Stripe
 */

const PRICING_PAGE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pricing - CryptoAuto</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; min-height: 100vh; }
    .container { max-width: 1200px; margin: 0 auto; padding: 60px 20px; }
    nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 60px; padding: 20px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .logo { font-size: 24px; font-weight: 700; }
    nav a { color: rgba(255,255,255,0.7); text-decoration: none; margin-left: 30px; transition: color 0.3s; }
    nav a:hover { color: #10b981; }
    .hero { text-align: center; margin-bottom: 60px; }
    h1 { font-size: 48px; margin-bottom: 15px; }
    .subtitle { font-size: 18px; color: rgba(255,255,255,0.8); margin-bottom: 50px; }
    .pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin-bottom: 60px; }
    .pricing-card { background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 12px; padding: 40px; text-align: center; transition: all 0.3s; }
    .pricing-card:hover { border-color: #10b981; transform: translateY(-5px); }
    .pricing-card.popular { border-color: #10b981; background: rgba(16, 185, 129, 0.05); }
    .pricing-card .badge { display: inline-block; background: #10b981; color: #0f172a; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 20px; }
    .plan-name { font-size: 24px; font-weight: 700; margin-bottom: 15px; }
    .price { font-size: 48px; font-weight: 700; margin-bottom: 10px; }
    .price-period { font-size: 14px; color: rgba(255,255,255,0.6); margin-bottom: 30px; }
    .btn { display: inline-block; width: 100%; padding: 14px; background: #10b981; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s; font-size: 16px; margin-bottom: 30px; }
    .btn:hover { background: #059669; }
    .btn-secondary { background: transparent; border: 2px solid #10b981; color: #10b981; }
    .btn-secondary:hover { background: rgba(16, 185, 129, 0.1); }
    .features { list-style: none; text-align: left; margin-bottom: 30px; }
    .features li { padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.8); }
    .features li:before { content: "✓ "; color: #10b981; font-weight: 600; margin-right: 8px; }
    .features li.disabled { color: rgba(255,255,255,0.4); }
    .features li.disabled:before { content: "✗ "; color: rgba(255,255,255,0.4); }
    .comparison { margin-top: 60px; }
    .comparison h2 { text-align: center; margin-bottom: 40px; }
    .comparison-table { width: 100%; border-collapse: collapse; }
    .comparison-table th { background: rgba(16, 185, 129, 0.1); padding: 15px; text-align: left; font-weight: 600; }
    .comparison-table td { padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .comparison-table tr:last-child td { border-bottom: none; }
    .check { color: #10b981; }
    .cross { color: rgba(255,255,255,0.4); }
    .faq { margin-top: 60px; }
    .faq h2 { text-align: center; margin-bottom: 40px; }
    .faq-item { background: rgba(30, 41, 59, 0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 20px; margin-bottom: 15px; }
    .faq-item h4 { margin-bottom: 10px; color: #10b981; cursor: pointer; }
    .faq-item p { color: rgba(255,255,255,0.7); font-size: 14px; display: none; }
  </style>
</head>
<body>
  <div class="container">
    <nav>
      <div class="logo">🚀 CryptoAuto</div>
      <div>
        <a href="/">Home</a>
        <a href="/admin">Admin</a>
      </div>
    </nav>

    <div class="hero">
      <h1>Simple, Transparent Pricing</h1>
      <p class="subtitle">Start free. Upgrade anytime. Cancel anytime.</p>
    </div>

    <div class="pricing-grid">
      <!-- Free Plan -->
      <div class="pricing-card">
        <div class="plan-name">Free Trial</div>
        <div class="price">$0</div>
        <div class="price-period">7 days</div>
        <button class="btn btn-secondary" onclick="window.location.href='/'">Get Started</button>
        <ul class="features">
          <li>Full access for 7 days</li>
          <li>1 active trading bot</li>
          <li>Binance integration</li>
          <li>Basic analytics</li>
          <li class="disabled">Advanced signals</li>
          <li class="disabled">24/7 priority support</li>
        </ul>
      </div>

      <!-- Pro Plan -->
      <div class="pricing-card popular">
        <div class="badge">MOST POPULAR</div>
        <div class="plan-name">Pro</div>
        <div class="price">$29</div>
        <div class="price-period">per month</div>
        <button class="btn" onclick="checkout('price_1TtWCFLOZXS86s51skj0JXNA')">Start Pro</button>
        <ul class="features">
          <li>Unlimited trading bots</li>
          <li>All 4 exchanges</li>
          <li>Advanced AI signals</li>
          <li>Real-time notifications</li>
          <li>Performance analytics</li>
          <li class="disabled">Dedicated support</li>
        </ul>
      </div>

      <!-- Enterprise Plan -->
      <div class="pricing-card">
        <div class="plan-name">Enterprise</div>
        <div class="price">$299</div>
        <div class="price-period">per month</div>
        <button class="btn btn-secondary" onclick="checkout('price_1TtWF1LOZXS86s51BJWXy9Pq')">Contact Sales</button>
        <ul class="features">
          <li>Everything in Pro</li>
          <li>Custom trading strategies</li>
          <li>API access</li>
          <li>White label options</li>
          <li>Dedicated support</li>
          <li>SLA guarantee</li>
        </ul>
      </div>
    </div>

    <div class="comparison">
      <h2>Feature Comparison</h2>
      <table class="comparison-table">
        <thead>
          <tr>
            <th>Feature</th>
            <th>Free Trial</th>
            <th>Pro</th>
            <th>Enterprise</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Trading Bots</td>
            <td><span class="check">1</span></td>
            <td><span class="check">Unlimited</span></td>
            <td><span class="check">Unlimited</span></td>
          </tr>
          <tr>
            <td>Exchanges</td>
            <td><span class="check">Binance</span></td>
            <td><span class="check">4 (Binance, Coinbase, Kraken, Bybit)</span></td>
            <td><span class="check">4 + Custom</span></td>
          </tr>
          <tr>
            <td>AI Signals</td>
            <td><span class="check">Basic</span></td>
            <td><span class="check">Advanced</span></td>
            <td><span class="check">Advanced + Custom</span></td>
          </tr>
          <tr>
            <td>Real-time Alerts</td>
            <td><span class="cross">✗</span></td>
            <td><span class="check">✓</span></td>
            <td><span class="check">✓</span></td>
          </tr>
          <tr>
            <td>API Access</td>
            <td><span class="cross">✗</span></td>
            <td><span class="cross">✗</span></td>
            <td><span class="check">✓</span></td>
          </tr>
          <tr>
            <td>Support</td>
            <td><span class="cross">Community</span></td>
            <td><span class="check">Email</span></td>
            <td><span class="check">24/7 Priority</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="faq">
      <h2>Frequently Asked Questions</h2>
      <div class="faq-item">
        <h4 onclick="toggleFaq(this)">Can I cancel anytime?</h4>
        <p>Yes! Cancel your subscription anytime from your account settings. No questions asked.</p>
      </div>
      <div class="faq-item">
        <h4 onclick="toggleFaq(this)">What payment methods do you accept?</h4>
        <p>We accept all major credit cards via Stripe. We also support ACH transfers for Enterprise customers.</p>
      </div>
      <div class="faq-item">
        <h4 onclick="toggleFaq(this)">Is the free trial really free?</h4>
        <p>Yes, completely free. No credit card required. After 7 days, you can upgrade or the trial ends.</p>
      </div>
      <div class="faq-item">
        <h4 onclick="toggleFaq(this)">Do you charge trading fees?</h4>
        <p>No! You only pay our monthly subscription. Exchange fees are paid directly to the exchange.</p>
      </div>
    </div>
  </div>

  <script>
    function checkout(priceId) {
      alert('Stripe checkout for: ' + priceId + '\\n\\nFull integration coming soon!');
      // Will redirect to Stripe checkout in production
    }

    function toggleFaq(element) {
      const p = element.nextElementSibling;
      if (p.style.display === 'block') {
        p.style.display = 'none';
      } else {
        p.style.display = 'block';
      }
    }
  </script>
</body>
</html>`;

const ADMIN_DASHBOARD_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CryptoAuto Admin</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: white; }
    .login-page { display: none; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); }
    .login-page.active { display: flex !important; }
    .login-card { background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 12px; padding: 40px; width: 100%; max-width: 400px; }
    .login-card h1 { margin-bottom: 30px; font-size: 28px; text-align: center; }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; margin-bottom: 8px; font-size: 14px; font-weight: 600; }
    .form-group input { width: 100%; padding: 12px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; color: white; font-size: 14px; }
    .btn { width: 100%; padding: 12px; background: #10b981; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s; }
    .btn:hover { background: #059669; }
    .dashboard { display: none; min-height: 100vh; }
    .dashboard.active { display: block !important; }
    .sidebar { width: 250px; background: #1e293b; border-right: 1px solid rgba(255, 255, 255, 0.1); min-height: 100vh; position: fixed; left: 0; top: 0; padding: 20px; }
    .logo { font-size: 24px; font-weight: 700; margin-bottom: 40px; }
    .nav-item { padding: 12px 16px; margin-bottom: 8px; border-radius: 8px; cursor: pointer; transition: all 0.3s; font-size: 14px; }
    .nav-item:hover { background: rgba(16, 185, 129, 0.1); }
    .nav-item.active { background: #10b981; }
    .main-content { margin-left: 250px; padding: 30px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
    .section { display: none; }
    .section.active { display: block !important; }
    .card { background: rgba(30, 41, 59, 0.5); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 20px; margin-bottom: 20px; }
    .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
    .stat-card { background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 20px; text-align: center; }
    .stat-card .value { font-size: 32px; font-weight: 700; margin-bottom: 8px; }
    .stat-card .label { font-size: 14px; color: rgba(255, 255, 255, 0.7); }
  </style>
</head>
<body>

<div class="login-page active" id="loginPage">
  <div class="login-card">
    <h1>🤖 CryptoAuto</h1>
    <form onsubmit="handleLogin(event)">
      <div class="form-group">
        <label>Email</label>
        <input type="email" id="email" value="admin@example.com">
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" id="password" value="password">
      </div>
      <button type="submit" class="btn">Login</button>
    </form>
  </div>
</div>

<div class="dashboard" id="dashboard">
  <div class="sidebar">
    <div class="logo">🚀 CryptoAuto</div>
    <div class="nav-item active" onclick="switchTab('portfolio')">📊 Portfolio</div>
    <div class="nav-item" onclick="switchTab('trades')">💹 Trades</div>
    <div class="nav-item" onclick="switchTab('settings')">⚙️ Settings</div>
    <div class="nav-item" onclick="switchTab('users')">👥 Users</div>
    <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 20px 0;">
    <div class="nav-item" onclick="handleLogout()" style="color: #fca5a5;">🚪 Logout</div>
  </div>

  <div class="main-content">
    <div class="header">
      <h2>Dashboard</h2>
      <button class="btn" style="width: auto;" onclick="handleLogout()">Logout</button>
    </div>

    <div class="section active" id="portfolio">
      <h3 style="margin-bottom: 20px;">📊 Portfolio Overview</h3>
      <div class="stat-grid">
        <div class="stat-card">
          <div class="value">$12,450</div>
          <div class="label">Total Value</div>
        </div>
        <div class="stat-card">
          <div class="value">65%</div>
          <div class="label">Win Rate</div>
        </div>
        <div class="stat-card">
          <div class="value">+3.2%</div>
          <div class="label">Month Profit</div>
        </div>
        <div class="stat-card">
          <div class="value">24</div>
          <div class="label">Active Trades</div>
        </div>
      </div>
    </div>

    <div class="section" id="trades">
      <h3>💹 Trade History</h3>
      <div class="card">Demo trade data here</div>
    </div>

    <div class="section" id="settings">
      <h3>⚙️ Settings</h3>
      <div class="card">Admin settings here</div>
    </div>

    <div class="section" id="users">
      <h3>👥 Users</h3>
      <div class="card">User management here</div>
    </div>
  </div>
</div>

<script>
  function handleLogin(e) {
    e.preventDefault();
    if (document.getElementById('email').value === 'admin@example.com' && 
        document.getElementById('password').value === 'password') {
      document.getElementById('loginPage').classList.remove('active');
      document.getElementById('dashboard').classList.add('active');
    }
  }

  function switchTab(tabName) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
  }

  function handleLogout() {
    document.getElementById('loginPage').classList.add('active');
    document.getElementById('dashboard').classList.remove('active');
  }
</script>

</body>
</html>`;

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const pathname = url.pathname;
      const method = request.method;

      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      };

      if (method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: corsHeaders });
      }

      // Landing page
      if (pathname === '/' && method === 'GET') {
        return new Response(getLandingPage(), {
          status: 200,
          headers: { 'Content-Type': 'text/html; charset=utf-8', ...corsHeaders },
        });
      }

      // Pricing page
      if (pathname === '/pricing' && method === 'GET') {
        return new Response(PRICING_PAGE_HTML, {
          status: 200,
          headers: { 'Content-Type': 'text/html; charset=utf-8', ...corsHeaders },
        });
      }

      // Admin dashboard
      if (pathname === '/admin' && method === 'GET') {
        return new Response(ADMIN_DASHBOARD_HTML, {
          status: 200,
          headers: { 'Content-Type': 'text/html; charset=utf-8', ...corsHeaders },
        });
      }

      // Admin login
      if (pathname === '/admin/login' && method === 'POST') {
        try {
          const body = await request.json();
          const { email, password } = body;

          if (email === 'admin@example.com' && password === 'password') {
            return new Response(
              JSON.stringify({ success: true, token: 'demo-token-' + Date.now() }),
              { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
            );
          }
          return new Response(
            JSON.stringify({ error: 'Invalid credentials' }),
            { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
          );
        } catch (error) {
          return new Response(
            JSON.stringify({ error: 'Login failed' }),
            { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
          );
        }
      }

      // Portfolio API
      if (pathname === '/api/portfolio' && method === 'GET') {
        return new Response(
          JSON.stringify({ portfolio: { total_value: 12450, win_rate: 0.65, monthly_profit: 3.2 } }),
          { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }

      // Health check
      if (pathname === '/health' && method === 'GET') {
        return new Response(
          JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }),
          { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );

    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
};

function getLandingPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CryptoAuto</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; min-height: 100vh; }
    .container { max-width: 1200px; margin: 0 auto; padding: 60px 20px; }
    nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 80px; padding: 20px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .logo { font-size: 24px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
    nav a { color: rgba(255,255,255,0.7); text-decoration: none; margin-left: 30px; transition: color 0.3s; }
    nav a:hover { color: #10b981; }
    .hero { text-align: center; margin-bottom: 60px; }
    h1 { font-size: 56px; margin-bottom: 20px; line-height: 1.2; }
    .subtitle { font-size: 20px; color: rgba(255,255,255,0.8); margin-bottom: 40px; }
    .cta { display: inline-block; background: #10b981; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; cursor: pointer; border: none; font-size: 16px; tr
