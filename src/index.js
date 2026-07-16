export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    if (pathname === '/' || pathname === '/index.html' || pathname === '/dashboard' || pathname === '/admin' || pathname === '/signup') {
      return new Response(getHTML(pathname), { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }

    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  }
};

function getHTML(pathname) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>CryptoAuto - AI-Powered Crypto Trading</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=IBM+Plex+Mono:wght@500;600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    :root {
      --bg: #0a0d14;
      --panel: #12161f;
      --panel-2: #171c28;
      --line: rgba(201, 169, 97, 0.14);
      --gold: #c9a961;
      --gold-bright: #e0c17d;
      --teal: #2dd4bf;
      --red: #ef5350;
      --ink: #e8e6df;
      --ink-dim: #8b8f9c;
    }
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: var(--bg); color: var(--ink); }
    .serif { font-family: 'Fraunces', Georgia, serif; }
    .mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
    
    .version { position: fixed; top: 20px; right: 160px; background: var(--gold); color: #0a0d14; padding: 6px 10px; border-radius: 2px; font-size: 11px; font-weight: 700; z-index: 98; font-family: 'IBM Plex Mono', monospace; }
    
    .ticker { background: var(--panel-2); border-bottom: 1px solid var(--line); overflow: hidden; white-space: nowrap; padding: 10px 0; position: sticky; top: 0; z-index: 99; }
    .ticker-track { display: inline-block; animation: ticker-scroll 28s linear infinite; }
    .ticker-item { display: inline-block; font-family: 'IBM Plex Mono', monospace; font-size: 13px; margin: 0 28px; color: var(--ink-dim); }
    .ticker-item .sym { color: var(--ink); font-weight: 600; }
    .ticker-item .up { color: var(--teal); }
    .ticker-item .down { color: var(--red); }
    @keyframes ticker-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
    
    .navbar { background: var(--bg); border-bottom: 1px solid var(--line); padding: 18px 32px; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 100; flex-wrap: wrap; row-gap: 12px; }
    .navbar-brand { font-family: 'Fraunces', Georgia, serif; font-size: 21px; font-weight: 600; cursor: pointer; color: var(--ink); letter-spacing: 0.3px; margin-right: 24px; }
    .navbar-links { display: flex; gap: 26px; align-items: center; flex-wrap: wrap; }
    .navbar-links a { color: var(--ink-dim); font-size: 14px; text-decoration: none; cursor: pointer; letter-spacing: 0.2px; }
    .navbar-links a:hover { color: var(--gold-bright); }
    
    .page { display: none; }
    .page.active { display: block; }
    
    .landing { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 40px; text-align: center; background: linear-gradient(135deg, var(--bg) 0%, #0d1220 100%); padding-bottom: 120px; }
    .hero { max-width: 900px; margin-bottom: 80px; }
    .hero h1 { font-family: 'Fraunces', Georgia, serif; font-size: 50px; line-height: 1.15; margin-bottom: 28px; font-weight: 600; letter-spacing: -0.5px; }
    .hero p { font-size: 18px; color: var(--ink-dim); margin-bottom: 40px; line-height: 1.6; }
    
    .btn-large { padding: 16px 40px; background: var(--gold); color: var(--bg); border: none; border-radius: 3px; cursor: pointer; font-weight: 600; font-size: 16px; }
    .btn-large:hover { background: var(--gold-bright); }
    .btn-secondary { padding: 12px 30px; background: transparent; color: var(--gold); border: 2px solid var(--gold); border-radius: 3px; cursor: pointer; font-weight: 600; margin-left: 10px; }
    .btn-secondary:hover { background: rgba(201, 169, 97, 0.12); }
    
    .features { max-width: 1000px; margin-bottom: 100px; }
    .features h2 { font-family: 'Fraunces', Georgia, serif; font-size: 32px; margin-bottom: 46px; font-weight: 600; }
    .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px; }
    .feature { background: var(--panel); border: 1px solid rgba(201, 169, 97, 0.15); border-radius: 3px; padding: 30px; text-align: left; }
    .feature h3 { margin-bottom: 15px; font-size: 18px; color: var(--gold); }
    .feature p { font-size: 14px; color: var(--ink-dim); line-height: 1.6; }
    
    .testimonials { max-width: 1200px; margin: 100px 0; }
    .testimonials h2 { font-family: 'Fraunces', Georgia, serif; font-size: 32px; margin-bottom: 46px; text-align: center; font-weight: 600; }
    .testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; }
    .testimonial-card { background: var(--panel); border: 1px solid rgba(201, 169, 97, 0.25); border-radius: 3px; padding: 30px; position: relative; }
    .testimonial-text { font-size: 15px; line-height: 1.7; color: rgba(255, 255, 255, 0.8); margin-bottom: 20px; }
    .testimonial-author { display: flex; align-items: center; gap: 12px; }
    .author-avatar { width: 40px; height: 40px; background: linear-gradient(135deg, var(--gold) 0%, var(--gold-bright) 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 18px; }
    .author-info { text-align: left; }
    .author-name { font-weight: 600; font-size: 14px; }
    .author-title { font-size: 12px; color: var(--ink-dim); }
    
    .pricing-page { padding: 60px 40px; min-height: 100vh; padding-bottom: 120px; }
    .pricing-page h1 { font-family: 'Fraunces', Georgia, serif; text-align: center; margin-bottom: 60px; font-size: 36px; font-weight: 600; }
    .pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; max-width: 1100px; margin: 0 auto; }
    .price-card { background: var(--panel); border: 1px solid rgba(201, 169, 97, 0.25); border-radius: 3px; padding: 40px 30px; text-align: center; }
    .price-card.featured { border: 2px solid var(--gold); }
    .price-card h3 { font-family: 'Fraunces', Georgia, serif; font-size: 22px; margin-bottom: 15px; font-weight: 600; }
    .price { font-family: 'IBM Plex Mono', monospace; font-size: 38px; font-weight: 600; color: var(--gold-bright); margin: 20px 0; }
    .price-desc { font-size: 14px; color: var(--ink-dim); margin-bottom: 30px; }
    .price-card ul { list-style: none; margin: 30px 0; text-align: left; }
    .price-card li { padding: 10px 0; font-size: 14px; border-bottom: 1px solid var(--line); }
    .price-card li:before { content: "+ "; color: var(--gold); font-weight: 600; margin-right: 8px; }
    .price-card .btn { width: 100%; padding: 12px; margin-top: 20px; border: none; border-radius: 2px; cursor: pointer; font-weight: 600; background: var(--gold); color: var(--bg); }
    .price-card .btn:hover { background: var(--gold-bright); }
    
    .footer { background: var(--panel); border-top: 1px solid rgba(201, 169, 97, 0.12); padding: 40px; text-align: center; color: var(--ink-dim); font-size: 14px; }
    .footer-links { margin-bottom: 20px; }
    .footer-links a { color: var(--gold); text-decoration: none; margin: 0 15px; cursor: pointer; }
    .footer-links a:hover { text-decoration: underline; }
    .footer-bottom { border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 20px; margin-top: 20px; }
    
    .login-modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, var(--bg) 0%, var(--panel-2) 100%); align-items: center; justify-content: center; z-index: 1000; }
    .login-modal.active { display: flex; }
    .modal-card { background: var(--panel-2); border: 1px solid rgba(201, 169, 97, 0.25); border-radius: 3px; padding: 50px; width: 100%; max-width: 420px; }
    .modal-card h1 { font-family: 'Fraunces', Georgia, serif; text-align: center; margin-bottom: 35px; font-size: 28px; font-weight: 600; }
    .modal-card input { width: 100%; padding: 14px; background: rgba(255, 255, 255, 0.04); border: 1px solid var(--line); border-radius: 3px; color: var(--bg); margin-bottom: 15px; font-size: 16px; }
    .modal-card input::placeholder { color: var(--ink-dim); }
    .modal-card .btn { width: 100%; padding: 14px; background: var(--gold); color: var(--bg); border: none; border-radius: 3px; font-size: 16px; font-weight: 600; cursor: pointer; }
    .modal-card .btn:hover { background: var(--gold-bright); }
    .error-msg { background: rgba(239, 68, 68, 0.15); color: #fca5a5; padding: 12px; border-radius: 2px; margin-bottom: 15px; }
    .success-msg { background: rgba(201, 169, 97, 0.25); color: #86efac; padding: 12px; border-radius: 2px; margin-bottom: 15px; }
    
    .dashboard-container { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; flex-direction: column; z-index: 999; }
    .dashboard-container.active { display: flex; }
    
    .dash-header { background: var(--panel-2); border-bottom: 1px solid rgba(201, 169, 97, 0.25); padding: 20px 40px; display: flex; justify-content: space-between; align-items: center; }
    .dash-logo { font-size: 20px; font-weight: 700; }
    .dash-user { display: flex; align-items: center; gap: 15px; }
    .logout-btn { background: #ef4444; color: var(--bg); border: none; padding: 10px 20px; border-radius: 2px; font-weight: 600; cursor: pointer; }
    
    .dash-layout { display: flex; flex: 1; overflow: hidden; }
    .dash-sidebar { width: 250px; background: var(--panel); border-right: 1px solid rgba(201, 169, 97, 0.12); overflow-y: auto; padding: 20px 0; }
    .sidebar-item { padding: 15px 20px; color: var(--ink-dim); cursor: pointer; border-left: 3px solid transparent; }
    .sidebar-item:hover { color: var(--gold); background: rgba(201, 169, 97, 0.06); }
    .sidebar-item.active { color: var(--gold); border-left-color: var(--gold); background: rgba(201, 169, 97, 0.12); }
    
    .dash-content { flex: 1; overflow-y: auto; padding: 30px 40px; }
    .section { display: none; }
    .section.show { display: block; }
    .section h2 { font-family: 'Fraunces', Georgia, serif; margin-bottom: 25px; font-size: 26px; font-weight: 600; }
    
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
    .stat-card { background: rgba(201, 169, 97, 0.12); border: 1px solid rgba(201, 169, 97, 0.3); border-radius: 3px; padding: 25px; text-align: center; }
    .stat-value { font-family: 'IBM Plex Mono', monospace; font-size: 30px; font-weight: 600; color: var(--gold-bright); }
    .stat-label { font-size: 13px; color: var(--ink-dim); margin-top: 8px; }
    
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; margin-bottom: 8px; font-weight: 600; }
    .form-group input, .form-group select { width: 100%; padding: 12px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(201, 169, 97, 0.4); border-radius: 2px; color: var(--bg); font-size: 16px; }
    .form-group input::placeholder { color: var(--ink-dim); }
    
    .btn-submit { width: 100%; background: var(--gold); color: var(--bg); padding: 12px; border: none; border-radius: 2px; cursor: pointer; font-weight: 600; }
    .btn-submit:hover { background: var(--gold-bright); }
    
    .card { background: var(--panel); border: 1px solid var(--line); border-radius: 3px; padding: 25px; margin-bottom: 20px; }
    .card h3 { margin-bottom: 15px; }
    
    .table { width: 100%; border-collapse: collapse; }
    .table th { background: rgba(201, 169, 97, 0.12); padding: 12px; text-align: left; font-weight: 600; border-bottom: 1px solid rgba(201, 169, 97, 0.3); }
    .table td { padding: 12px; border-bottom: 1px solid var(--line); }
    .table tr:hover { background: rgba(201, 169, 97, 0.06); }
    
    .live-indicator { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 8px; z-index: 50; }
    .live-dot { width: 10px; height: 10px; background: var(--gold); border-radius: 50%; animation: pulse 2s infinite; }
    .live-text { font-size: 14px; font-weight: 600; color: var(--gold); text-shadow: 0 0 10px rgba(201, 169, 97, 0.6); letter-spacing: 2px; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
  </style>
</head>
<body>
  <div class="version">v3.0</div>

  <div class="login-modal" id="loginModal">
    <div class="modal-card">
      <h1>CryptoAuto</h1>
      <div id="loginErr"></div>
      <input type="email" id="loginEmail" placeholder="Email">
      <input type="password" id="loginPassword" placeholder="Password">
      <button class="btn" onclick="doLogin()">Login</button>
      <p style="text-align: center; margin-top: 15px; font-size: 14px; color: rgba(255, 255, 255, 0.6);">
        No account? <a href="#" onclick="goToSignup()" style="color: #10b981; text-decoration: none;">Sign up</a>
      </p>
    </div>
  </div>

  <div id="mainApp">
    <nav class="navbar">
      <div class="navbar-brand" onclick="goHome()">CryptoAuto</div>
      <div class="navbar-links">
        <a onclick="showPage('landing')">Home</a>
        <a onclick="showPage('pricing')">Pricing</a>
        <button class="btn-secondary" onclick="showLogin()">Login</button>
      </div>
    </nav>
    <div class="ticker">
      <div class="ticker-track" id="tickerTrack">
        <span class="ticker-item"><span class="sym">BTC/USDT</span> Loading... </span>
        <span class="ticker-item"><span class="sym">ETH/USDT</span> Loading... </span>
        <span class="ticker-item"><span class="sym">XRP/USDT</span> Loading... </span>
        <span class="ticker-item"><span class="sym">SOL/USDT</span> Loading... </span>
        <span class="ticker-item"><span class="sym">BNB/USDT</span> Loading... </span>
      </div>
    </div>

    <div class="page active" id="landing">
      <div class="landing">
        <div class="hero">
          <h1>Your Savings Earn 0%. Let AI Make You 2 to 5 percent Monthly.</h1>
          <p>Passive income from automated crypto trading powered by AI.</p>
          <button class="btn-large" onclick="goToSignup()">Start Free Trial</button>
        </div>
        <div class="features">
          <h2>Why CryptoAuto?</h2>
          <div class="features-grid">
            <div class="feature"><h3>Smart Trading</h3><p>Intelligent algorithms optimize your trades 24/7 across 4 major exchanges.</p></div>
            <div class="feature"><h3>Real Results</h3><p>Average 65 percent win rate with consistent monthly returns.</p></div>
            <div class="feature"><h3>Secure</h3><p>API-only access, keys stored encrypted. We never touch your funds.</p></div>
            <div class="feature"><h3>Instant Setup</h3><p>Connect your exchange in 2 minutes. Start trading instantly.</p></div>
            <div class="feature"><h3>Low Cost</h3><p>Starting at just 29 dollars per month. Cancel anytime. No hidden fees.</p></div>
            <div class="feature"><h3>Multi-Exchange</h3><p>Binance, Coinbase, Kraken, Bybit. Trade everywhere at once.</p></div>
          </div>
        </div>

        <div class="testimonials">
          <h2>Trusted by Traders</h2>
          <div class="testimonials-grid">
            <div class="testimonial-card">
              <div class="testimonial-text">Made 3,450 dollars in my first month. The AI bots are insane. Best crypto investment I have made.</div>
              <div class="testimonial-author">
                <div class="author-avatar">JM</div>
                <div class="author-info">
                  <div class="author-name">James Martinez</div>
                  <div class="author-title">Crypto Trader</div>
                </div>
              </div>
            </div>
            <div class="testimonial-card">
              <div class="testimonial-text">Finally a tool that actually works. Passive income while I sleep. Can not ask for more.</div>
              <div class="testimonial-author">
                <div class="author-avatar">SK</div>
                <div class="author-info">
                  <div class="author-name">Sarah Kim</div>
                  <div class="author-title">Investor</div>
                </div>
              </div>
            </div>
            <div class="testimonial-card">
              <div class="testimonial-text">Setup took 2 minutes. Been running for 3 months. Averaging 68 percent win rate. Absolutely worth it.</div>
              <div class="testimonial-author">
                <div class="author-avatar">RP</div>
                <div class="author-info">
                  <div class="author-name">Robert Park</div>
                  <div class="author-title">Tech Entrepreneur</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="footer-links">
          <a onclick="alert('Contact us at support@cryptoauto.com')">Help</a>
          <a onclick="alert('Contact us at support@cryptoauto.com')">Contact Support</a>
          <a onclick="alert('Terms of Service coming soon')">Terms</a>
          <a onclick="alert('Privacy Policy coming soon')">Privacy</a>
        </div>
        <div class="footer-bottom">
          <p>Copyright 2026 CryptoAuto. All rights reserved.<br>support@cryptoauto.com | 1-800-CRYPTO-1</p>
        </div>
      </div>
    </div>

    <div class="page" id="pricing">
      <div class="pricing-page">
        <h1>Simple, Transparent Pricing</h1>
        <div class="pricing-grid">
          <div class="price-card"><h3>Free</h3><div class="price">0 dollars</div><div class="price-desc">7-day trial</div><ul><li>1 exchange connection</li><li>Basic grid bot</li><li>Email support</li><li>Manual trades only</li></ul><button class="btn" onclick="goToSignup()">Get Started</button></div>
          <div class="price-card featured"><h3>Pro</h3><div class="price">29 dollars</div><div class="price-desc">per month</div><ul><li>4 exchange connections</li><li>Advanced grid bots</li><li>24/7 AI automation</li><li>Priority support</li><li>Performance analytics</li></ul><button class="btn" onclick="goToSignup()">Subscribe</button></div>
          <div class="price-card"><h3>Enterprise</h3><div class="price">299 dollars</div><div class="price-desc">per month</div><ul><li>Unlimited exchanges</li><li>Custom bot strategies</li><li>Dedicated account manager</li><li>API access</li><li>White-label option</li></ul><button class="btn" onclick="goToSignup()">Contact Sales</button></div>
        </div>
      </div>
      <div class="footer">
        <div class="footer-links">
          <a onclick="showPage('landing')">Home</a>
          <a onclick="alert('Contact us at support@cryptoauto.com')">Help</a>
          <a onclick="alert('Contact us at support@cryptoauto.com')">Contact Support</a>
          <a onclick="alert('Terms of Service coming soon')">Terms</a>
          <a onclick="alert('Privacy Policy coming soon')">Privacy</a>
        </div>
        <div class="footer-bottom">
          <p>Copyright 2026 CryptoAuto. All rights reserved.<br>support@cryptoauto.com | 1-800-CRYPTO-1</p>
        </div>
      </div>
    </div>

    <div class="page" id="signup">
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 40px;">
        <div class="modal-card">
          <h1 style="margin-bottom: 30px;">Create Account</h1>
          <div id="signupErr"></div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" id="signupEmail" placeholder="your@email.com">
          </div>
          <div class="form-group">
            <label>Password (min 8 chars, uppercase, number, symbol)</label>
            <input type="password" id="signupPassword" placeholder="Strong password">
          </div>
          <div class="form-group">
            <label>Confirm Password</label>
            <input type="password" id="signupPasswordConfirm" placeholder="Confirm password">
          </div>
          <button class="btn-submit" onclick="doSignup()">Create Account</button>
          <p style="text-align: center; margin-top: 15px; font-size: 14px; color: rgba(255, 255, 255, 0.6);">
            Already have account? <a href="#" onclick="showLogin()" style="color: #10b981; text-decoration: none;">Login</a>
          </p>
        </div>
      </div>
    </div>
  </div>

  <div class="dashboard-container" id="dashContainer">
    <div class="dash-header">
      <div class="dash-logo" onclick="goHome()">CryptoAuto Dashboard</div>
      <div class="dash-user">
        <span id="userEmail"></span>
        <button class="logout-btn" onclick="doLogout()">Logout</button>
      </div>
    </div>
    
    <div class="dash-layout">
      <div class="dash-sidebar">
        <div class="sidebar-item active" onclick="switchSection('portfolio')">Portfolio</div>
        <div class="sidebar-item" onclick="switchSection('bots')">Trading Bots</div>
        <div class="sidebar-item" onclick="switchSection('exchanges')">Exchanges</div>
        <div class="sidebar-item" onclick="switchSection('profile')">Profile</div>
        <div class="sidebar-item" onclick="switchSection('account')">Account</div>
        <div class="sidebar-item" onclick="switchSection('billing')">Billing</div>
        <div id="adminLink" class="sidebar-item" onclick="switchSection('admin')" style="display:none; color: #f59e0b; border-left-color: #f59e0b;">Admin Panel</div>
      </div>

      <div class="dash-content">
        <div class="section show" id="portfolio">
          <h2>Portfolio</h2>
          <div class="stats-grid">
            <div class="stat-card"><div class="stat-value">12,450 dollars</div><div class="stat-label">Total Balance</div></div>
            <div class="stat-card"><div class="stat-value">3,250 dollars</div><div class="stat-label">Profit (this month)</div></div>
            <div class="stat-card"><div class="stat-value">65 percent</div><div class="stat-label">Win Rate</div></div>
            <div class="stat-card"><div class="stat-value">4</div><div class="stat-label">Active Bots</div></div>
          </div>
          <div class="card">
            <h3>Recent Trades</h3>
            <table class="table">
              <tr><th>Bot</th><th>Pair</th><th>Type</th><th>Profit</th><th>Time</th></tr>
              <tr><td>Bot 1</td><td>BTC/USDT</td><td>Buy</td><td>+250 dollars</td><td>2 hours ago</td></tr>
              <tr><td>Bot 2</td><td>ETH/USDT</td><td>Sell</td><td>+185 dollars</td><td>4 hours ago</td></tr>
              <tr><td>Bot 3</td><td>XRP/USDT</td><td>Buy</td><td>+120 dollars</td><td>6 hours ago</td></tr>
            </table>
          </div>
        </div>

        <div class="section" id="bots">
          <h2>Trading Bots</h2>
          <button class="btn-submit" style="width: auto; margin-bottom: 20px;" onclick="alert('Create bot coming soon')">Create New Bot</button>
          <div class="card">
            <h3>Bot 1 - BTC Grid</h3>
            <p style="margin-bottom: 15px; color: rgba(255, 255, 255, 0.7);">Status: Active | Exchange: Binance | Pair: BTC/USDT</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div><strong>Grid Range:</strong> 40,000 - 50,000 USDT</div>
              <div><strong>Grid Levels:</strong> 10</div>
              <div><strong>Current Profit:</strong> 1,250 dollars</div>
              <div><strong>Win Rate:</strong> 68%</div>
            </div>
            <button class="btn-submit" style="width: auto; margin-top: 15px;" onclick="alert('Coming soon')">Edit</button>
          </div>
        </div>

        <div class="section" id="exchanges">
          <h2>Exchange Connections</h2>
          <button class="btn-submit" style="width: auto; margin-bottom: 20px;" onclick="alert('Add exchange coming soon')">Add Exchange</button>
          <div class="card">
            <h3>Binance</h3>
            <div class="form-group" style="margin-bottom: 15px;">
              <label>API Key (masked)</label>
              <input type="text" value="****...a7f2" disabled>
            </div>
            <div class="form-group" style="margin-bottom: 15px;">
              <label>Status</label>
              <input type="text" value="Connected - Active" disabled>
            </div>
            <button class="btn-submit" style="width: auto; background: #ef4444; margin-top: 10px;" onclick="alert('Disconnect coming soon')">Disconnect</button>
          </div>
        </div>

        <div class="section" id="profile">
          <h2>Profile</h2>
          <div class="card">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" id="profileName" placeholder="John Doe">
            </div>
            <div class="form-group">
              <label>Company</label>
              <input type="text" id="profileCompany" placeholder="Your Company">
            </div>
            <div class="form-group">
              <label>Phone</label>
              <input type="tel" id="profilePhone" placeholder="+1 (555) 000-0000">
            </div>
            <button class="btn-submit" onclick="saveProfile()">Save Profile</button>
          </div>
        </div>

        <div class="section" id="account">
          <h2>Account Settings</h2>
          <div class="card">
            <h3>Change Password</h3>
            <div id="pwdMsg"></div>
            <div class="form-group">
              <label>Current Password</label>
              <input class="form-group" type="password" id="currentPassword">
            </div>
            <div class="form-group">
              <label>New Password (min 8 chars, uppercase, number, symbol)</label>
              <input class="form-group" type="password" id="newPassword">
            </div>
            <div class="form-group">
              <label>Confirm Password</label>
              <input class="form-group" type="password" id="confirmPassword">
            </div>
            <button class="btn-submit" onclick="changePassword()">Update Password</button>
          </div>
          <div class="card">
            <h3>Email Address</h3>
            <div class="form-group">
              <label>Current Email</label>
              <input type="email" id="currentEmail" disabled>
            </div>
            <div class="form-group">
              <label>New Email</label>
              <input type="email" id="newEmail">
            </div>
            <button class="btn-submit" onclick="updateEmail()">Update Email</button>
          </div>
          <div class="card">
            <h3>Two-Factor Authentication</h3>
            <p style="margin-bottom: 15px; color: rgba(255, 255, 255, 0.7);">Enable 2FA for enhanced security</p>
            <button class="btn-submit" onclick="alert('2FA coming soon')">Enable 2FA</button>
          </div>
          <div class="card">
            <h3>Login Activity</h3>
            <table class="table">
              <tr><th>Date</th><th>Time</th><th>IP Address</th><th>Device</th></tr>
              <tr><td>Today</td><td>12:34 PM</td><td>192.168.1.1</td><td>Chrome on Mac</td></tr>
              <tr><td>Yesterday</td><td>8:45 AM</td><td>192.168.1.2</td><td>Safari on iPhone</td></tr>
            </table>
          </div>
        </div>

        <div class="section" id="billing">
          <h2>Billing & Subscription</h2>
          <div class="card">
            <h3>Current Plan</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
              <div><strong>Plan:</strong> Pro</div>
              <div><strong>Price:</strong> 29 dollars per month</div>
              <div><strong>Status:</strong> Active</div>
              <div><strong>Renewal:</strong> August 16, 2026</div>
            </div>
            <button class="btn-submit" style="width: auto; margin-right: 10px;" onclick="alert('Upgrade coming soon')">Upgrade Plan</button>
            <button class="btn-submit" style="width: auto; background: transparent; color: #10b981; border: 1px solid #10b981;" onclick="alert('Downgrade coming soon')">Downgrade Plan</button>
          </div>
          <div class="card">
            <h3>Payment Method</h3>
            <div class="form-group">
              <label>Card on File</label>
              <input type="text" value="Visa ending in 4242" disabled>
            </div>
            <button class="btn-submit" style="width: auto;" onclick="alert('Update payment coming soon')">Update Payment Method</button>
          </div>
          <div class="card">
            <h3>Invoice History</h3>
            <table class="table">
              <tr><th>Date</th><th>Amount</th><th>Status</th><th>Action</th></tr>
              <tr><td>July 16, 2026</td><td>29 dollars</td><td>Paid</td><td><a href="#" style="color: #10b981;">Download</a></td></tr>
              <tr><td>June 16, 2026</td><td>29 dollars</td><td>Paid</td><td><a href="#" style="color: #10b981;">Download</a></td></tr>
              <tr><td>May 16, 2026</td><td>0 dollars</td><td>Free Trial</td><td>N/A</td></tr>
            </table>
          </div>
        </div>

        <div class="section" id="admin">
          <h2>Admin Panel</h2>
          <div class="card">
            <h3>Users</h3>
            <table class="table">
              <tr><th>Email</th><th>Plan</th><th>Joined</th><th>Status</th><th>Action</th></tr>
              <tr><td>user1@example.com</td><td>Pro</td><td>June 1</td><td>Active</td><td><button onclick="alert('Message coming soon')" style="background: #10b981; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Message</button></td></tr>
              <tr><td>user2@example.com</td><td>Free</td><td>July 5</td><td>Active</td><td><button onclick="alert('Message coming soon')" style="background: #10b981; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Message</button></td></tr>
            </table>
          </div>
          <div class="card">
            <h3>Send Notification</h3>
            <div class="form-group">
              <label>Select User</label>
              <select>
                <option>All Users</option>
                <option>user1@example.com</option>
                <option>user2@example.com</option>
              </select>
            </div>
            <div class="form-group">
              <label>Message</label>
              <input type="text" placeholder="Your message...">
            </div>
            <button class="btn-submit" onclick="alert('Notification sent coming soon')">Send Notification</button>
          </div>
          <div class="card">
            <h3>Revenue</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div><div style="font-size: 28px; color: #10b981; font-weight: 700;">1,234 dollars</div><div style="color: rgba(255, 255, 255, 0.6);">This Month</div></div>
              <div><div style="font-size: 28px; color: #10b981; font-weight: 700;">12</div><div style="color: rgba(255, 255, 255, 0.6);">Active Users</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="live-indicator">
    <div class="live-dot"></div>
    <div class="live-text">LIVE</div>
  </div>

  <script>
    const users = {
      'admin@example.com': { password: 'Admin123!', isAdmin: true, name: 'Admin', email: 'admin@example.com', plan: 'Enterprise' },
      'user@example.com': { password: 'User123!', isAdmin: false, name: 'John Doe', email: 'user@example.com', plan: 'Pro' }
    };

    function showPage(page) {
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      document.getElementById(page).classList.add('active');
    }

    function goHome() { location.href = '/'; }
    function goToSignup() { showPage('signup'); document.getElementById('mainApp').style.display = 'block'; document.getElementById('dashContainer').style.display = 'none'; }
    function showLogin() { document.getElementById('loginModal').classList.add('active'); }

    function doLogin() {
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      
      if (users[email] && users[email].password === password) {
        localStorage.setItem('authToken', btoa(email + ':' + Date.now()));
        localStorage.setItem('userEmail', email);
        document.getElementById('loginModal').classList.remove('active');
        document.getElementById('mainApp').style.display = 'none';
        document.getElementById('dashContainer').classList.add('active');
        document.getElementById('userEmail').textContent = email;
        document.getElementById('currentEmail').value = email;
        
        if (users[email].isAdmin) {
          document.getElementById('adminLink').style.display = 'block';
        }
      } else {
        document.getElementById('loginErr').innerHTML = '<div class="error-msg">Invalid credentials</div>';
      }
      return false;
    }

    function doSignup() {
      const email = document.getElementById('signupEmail').value;
      const pwd = document.getElementById('signupPassword').value;
      const pwdConfirm = document.getElementById('signupPasswordConfirm').value;
      const err = document.getElementById('signupErr');

      if (!email || !pwd || !pwdConfirm) {
        err.innerHTML = '<div class="error-msg">All fields required</div>';
        return false;
      }
      if (pwd.length < 8 || !/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd) || !/[!@#\$%\^&\*]/.test(pwd)) {
        err.innerHTML = '<div class="error-msg">Password must have 8+ chars, uppercase, number, symbol</div>';
        return false;
      }
      if (pwd !== pwdConfirm) {
        err.innerHTML = '<div class="error-msg">Passwords do not match</div>';
        return false;
      }
      if (users[email]) {
        err.innerHTML = '<div class="error-msg">Email already exists</div>';
        return false;
      }

      users[email] = { password: pwd, isAdmin: false, name: '', email: email, plan: 'Free' };
      err.innerHTML = '<div class="success-msg">Account created! Login with your credentials.</div>';
      setTimeout(() => { showLogin(); document.getElementById('loginEmail').value = email; document.getElementById('signupEmail').value = ''; document.getElementById('signupPassword').value = ''; document.getElementById('signupPasswordConfirm').value = ''; }, 1500);
      return false;
    }

    function doLogout() {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');
      document.getElementById('dashContainer').classList.remove('active');
      document.getElementById('mainApp').style.display = 'block';
      showPage('landing');
    }

    function switchSection(section) {
      document.querySelectorAll('.section').forEach(s => s.classList.remove('show'));
      document.querySelectorAll('.sidebar-item').forEach(s => s.classList.remove('active'));
      document.getElementById(section).classList.add('show');
      event.target.classList.add('active');
    }

    function changePassword() {
      const cur = document.getElementById('currentPassword').value;
      const newP = document.getElementById('newPassword').value;
      const con = document.getElementById('confirmPassword').value;
      const msg = document.getElementById('pwdMsg');
      const email = localStorage.getItem('userEmail');

      if (!cur || !newP || !con) { msg.innerHTML = '<div class="error-msg">All fields required</div>'; return false; }
      if (users[email].password !== cur) { msg.innerHTML = '<div class="error-msg">Current password incorrect</div>'; return false; }
      if (newP.length < 8 || !/[A-Z]/.test(newP) || !/[0-9]/.test(newP) || !/[!@#\$%\^&\*]/.test(newP)) {
        msg.innerHTML = '<div class="error-msg">New password must have 8+ chars, uppercase, number, symbol</div>';
        return false;
      }
      if (newP !== con) { msg.innerHTML = '<div class="error-msg">Passwords do not match</div>'; return false; }

      users[email].password = newP;
      msg.innerHTML = '<div class="success-msg">Password updated!</div>';
      document.getElementById('currentPassword').value = '';
      document.getElementById('newPassword').value = '';
      document.getElementById('confirmPassword').value = '';
      return false;
    }

    function updateEmail() {
      const newEmail = document.getElementById('newEmail').value;
      const email = localStorage.getItem('userEmail');
      if (!newEmail) { alert('Enter new email'); return; }
      users[newEmail] = users[email];
      users[newEmail].email = newEmail;
      delete users[email];
      localStorage.setItem('userEmail', newEmail);
      document.getElementById('userEmail').textContent = newEmail;
      document.getElementById('currentEmail').value = newEmail;
      document.getElementById('newEmail').value = '';
      alert('Email updated!');
    }

    function saveProfile() {
      const email = localStorage.getItem('userEmail');
      users[email].name = document.getElementById('profileName').value;
      users[email].company = document.getElementById('profileCompany').value;
      alert('Profile saved!');
    }

    async function fetchLiveTicker() {
      const coins = [
        { id: 'bitcoin', sym: 'BTC/USDT' },
        { id: 'ethereum', sym: 'ETH/USDT' },
        { id: 'ripple', sym: 'XRP/USDT' },
        { id: 'solana', sym: 'SOL/USDT' },
        { id: 'binancecoin', sym: 'BNB/USDT' }
      ];
      const ids = coins.map(c => c.id).join(',');
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=' + ids + '&vs_currencies=usd&include_24hr_change=true');
        const data = await res.json();
        const items = coins.map(c => {
          const d = data[c.id];
          if (!d) return '';
          const price = d.usd >= 1 ? d.usd.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : d.usd.toFixed(4);
          const change = d.usd_24h_change || 0;
          const dir = change >= 0 ? 'up' : 'down';
          const sign = change >= 0 ? '+' : '';
          return '<span class="ticker-item"><span class="sym">' + c.sym + '</span> ' + price + ' <span class="' + dir + '">' + sign + change.toFixed(2) + '%</span></span>';
        }).join('');
        const track = document.getElementById('tickerTrack');
        if (track && items) {
          track.innerHTML = items + items;
        }
      } catch (e) {
        console.log('Ticker fetch failed, keeping last known values');
      }
    }

    window.addEventListener('load', () => {
      fetchLiveTicker();
      setInterval(fetchLiveTicker, 60000);
      if (localStorage.getItem('authToken')) {
        const email = localStorage.getItem('userEmail');
        document.getElementById('mainApp').style.display = 'none';
        document.getElementById('dashContainer').classList.add('active');
        document.getElementById('userEmail').textContent = email;
        document.getElementById('currentEmail').value = email;
        if (users[email] && users[email].isAdmin) {
          document.getElementById('adminLink').style.display = 'block';
        }
      }
    });
  </script>
</body>
</html>`;
}
