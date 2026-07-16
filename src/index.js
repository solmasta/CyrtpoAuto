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
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: white; }
    
    .version { position: fixed; top: 20px; right: 160px; background: #10b981; color: white; padding: 6px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; z-index: 98; }
    
    .navbar { background: #0f172a; border-bottom: 1px solid rgba(16, 185, 129, 0.1); padding: 20px 40px; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 100; }
    .navbar-brand { font-size: 20px; font-weight: 700; cursor: pointer; }
    .navbar-links { display: flex; gap: 30px; align-items: center; }
    .navbar-links a { color: rgba(255, 255, 255, 0.7); font-size: 15px; text-decoration: none; cursor: pointer; }
    .navbar-links a:hover { color: #10b981; }
    
    .page { display: none; }
    .page.active { display: block; }
    
    .landing { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 40px; text-align: center; background: linear-gradient(135deg, #0f172a 0%, #1a1f3a 100%); padding-bottom: 120px; }
    .hero { max-width: 900px; margin-bottom: 80px; }
    .hero h1 { font-size: 56px; line-height: 1.2; margin-bottom: 30px; font-weight: 700; }
    .hero p { font-size: 18px; color: rgba(255, 255, 255, 0.6); margin-bottom: 40px; line-height: 1.6; }
    
    .btn-large { padding: 16px 40px; background: #10b981; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 16px; }
    .btn-large:hover { background: #059669; }
    .btn-secondary { padding: 12px 30px; background: transparent; color: #10b981; border: 2px solid #10b981; border-radius: 8px; cursor: pointer; font-weight: 600; margin-left: 10px; }
    .btn-secondary:hover { background: rgba(16, 185, 129, 0.1); }
    
    .features { max-width: 1000px; margin-bottom: 100px; }
    .features h2 { font-size: 36px; margin-bottom: 50px; }
    .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px; }
    .feature { background: rgba(30, 41, 59, 0.4); border: 1px solid rgba(16, 185, 129, 0.15); border-radius: 12px; padding: 30px; text-align: left; }
    .feature h3 { margin-bottom: 15px; font-size: 18px; color: #10b981; }
    .feature p { font-size: 14px; color: rgba(255, 255, 255, 0.6); line-height: 1.6; }
    
    .testimonials { max-width: 1200px; margin: 100px 0; }
    .testimonials h2 { font-size: 36px; margin-bottom: 50px; text-align: center; }
    .testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; }
    .testimonial-card { background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 12px; padding: 30px; position: relative; }
    .testimonial-text { font-size: 15px; line-height: 1.7; color: rgba(255, 255, 255, 0.8); margin-bottom: 20px; }
    .testimonial-author { display: flex; align-items: center; gap: 12px; }
    .author-avatar { width: 40px; height: 40px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 18px; }
    .author-info { text-align: left; }
    .author-name { font-weight: 600; font-size: 14px; }
    .author-title { font-size: 12px; color: rgba(255, 255, 255, 0.5); }
    
    .pricing-page { padding: 60px 40px; min-height: 100vh; padding-bottom: 120px; }
    .pricing-page h1 { text-align: center; margin-bottom: 60px; font-size: 40px; }
    .pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; max-width: 1100px; margin: 0 auto; }
    .price-card { background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 12px; padding: 40px 30px; text-align: center; }
    .price-card.featured { border: 2px solid #10b981; }
    .price-card h3 { font-size: 24px; margin-bottom: 15px; }
    .price { font-size: 40px; font-weight: 700; color: #10b981; margin: 20px 0; }
    .price-desc { font-size: 14px; color: rgba(255, 255, 255, 0.6); margin-bottom: 30px; }
    .price-card ul { list-style: none; margin: 30px 0; text-align: left; }
    .price-card li { padding: 10px 0; font-size: 14px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
    .price-card li:before { content: "+ "; color: #10b981; font-weight: 600; margin-right: 8px; }
    .price-card .btn { width: 100%; padding: 12px; margin-top: 20px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; background: #10b981; color: white; }
    .price-card .btn:hover { background: #059669; }
    
    .footer { background: #1a2332; border-top: 1px solid rgba(16, 185, 129, 0.1); padding: 40px; text-align: center; color: rgba(255, 255, 255, 0.6); font-size: 14px; margin-top: 60px; }
    .footer-links { margin-bottom: 20px; }
    .footer-links a { color: #10b981; text-decoration: none; margin: 0 15px; }
    .footer-links a:hover { text-decoration: underline; }
    .footer-bottom { border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 20px; margin-top: 20px; }
    
    .login-modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); align-items: center; justify-content: center; z-index: 1000; }
    .login-modal.active { display: flex; }
    .modal-card { background: rgba(30, 41, 59, 0.95); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 12px; padding: 50px; width: 100%; max-width: 420px; }
    .modal-card h1 { text-align: center; margin-bottom: 35px; font-size: 32px; }
    .modal-card input { width: 100%; padding: 14px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; color: white; margin-bottom: 15px; font-size: 16px; }
    .modal-card input::placeholder { color: rgba(255, 255, 255, 0.5); }
    .modal-card .btn { width: 100%; padding: 14px; background: #10b981; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; }
    .modal-card .btn:hover { background: #059669; }
    .error-msg { background: rgba(239, 68, 68, 0.15); color: #fca5a5; padding: 12px; border-radius: 6px; margin-bottom: 15px; }
    .success-msg { background: rgba(16, 185, 129, 0.2); color: #86efac; padding: 12px; border-radius: 6px; margin-bottom: 15px; }
    
    .dashboard-container { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; flex-direction: column; z-index: 999; }
    .dashboard-container.active { display: flex; }
    
    .dash-header { background: #1e293b; border-bottom: 1px solid rgba(16, 185, 129, 0.2); padding: 20px 40px; display: flex; justify-content: space-between; align-items: center; }
    .dash-logo { font-size: 20px; font-weight: 700; cursor: pointer; }
    .dash-user { display: flex; align-items: center; gap: 15px; }
    .logout-btn { background: #ef4444; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; cursor: pointer; }
    
    .dash-layout { display: flex; flex: 1; overflow: hidden; }
    .dash-sidebar { width: 250px; background: #1a2332; border-right: 1px solid rgba(16, 185, 129, 0.1); overflow-y: auto; padding: 20px 0; }
    .sidebar-item { padding: 15px 20px; color: rgba(255, 255, 255, 0.7); cursor: pointer; border-left: 3px solid transparent; }
    .sidebar-item:hover { color: #10b981; background: rgba(16, 185, 129, 0.05); }
    .sidebar-item.active { color: #10b981; border-left-color: #10b981; background: rgba(16, 185, 129, 0.1); }
    
    .dash-content { flex: 1; overflow-y: auto; padding: 30px 40px; }
    .section { display: none; }
    .section.show { display: block; }
    .section h2 { margin-bottom: 25px; font-size: 28px; }
    
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
    .stat-card { background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 10px; padding: 25px; text-align: center; }
    .stat-value { font-size: 32px; font-weight: 700; color: #10b981; }
    .stat-label { font-size: 13px; color: rgba(255, 255, 255, 0.6); margin-top: 8px; }
    
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; margin-bottom: 8px; font-weight: 600; }
    .form-group input, .form-group select { width: 100%; padding: 12px; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 6px; color: white; font-size: 16px; }
    .form-group input::placeholder { color: rgba(255, 255, 255, 0.5); }
    
    .btn-submit { width: 100%; background: #10b981; color: white; padding: 12px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; }
    .btn-submit:hover { background: #059669; }
    
    .card { background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 10px; padding: 25px; margin-bottom: 20px; }
    .card h3 { margin-bottom: 15px; }
    
    .table { width: 100%; border-collapse: collapse; }
    .table th { background: rgba(16, 185, 129, 0.1); padding: 12px; text-align: left; font-weight: 600; border-bottom: 1px solid rgba(16, 185, 129, 0.3); }
    .table td { padding: 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
    .table tr:hover { background: rgba(16, 185, 129, 0.05); }
    
    .live-indicator { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 8px; z-index: 50; }
    .live-dot { width: 10px; height: 10px; background: #10b981; border-radius: 50%; animation: pulse 2s infinite; }
    .live-text { font-size: 14px; font-weight: 600; color: #10b981; text-shadow: 0 0 10px rgba(16, 185, 129, 0.8); letter-spacing: 2px; }
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
        <a onclick="showPage('landing'); return false;">Home</a>
        <a onclick="showPage('pricing'); return false;">Pricing</a>
        <button class="btn-secondary" onclick="showLogin(); return false;">Login</button>
      </div>
    </nav>

    <div class="page active" id="landing">
      <div class="landing">
        <div class="hero">
          <h1>Your Savings Earn 0%. Let AI Make You 2 to 5 percent Monthly.</h1>
          <p>Passive income from automated crypto trading powered by AI.</p>
          <button class="btn-large" onclick="goToSignup(); return false;">Start Free Trial</button>
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
          <a href="#" onclick="alert('Help center coming soon'); return false;">Help</a>
          <a href="#" onclick="alert('Contact: support@cryptoauto.com'); return false;">Contact Support</a>
          <a href="#" onclick="alert('Coming soon'); return false;">Terms</a>
          <a href="#" onclick="alert('Coming soon'); return false;">Privacy</a>
        </div>
        <div class="footer-bottom">
          <p>Copyright 2026 CryptoAuto. All rights reserved. | support@cryptoauto.com | 1-800-CRYPTO-1</p>
        </div>
      </div>
    </div>

    <div class="page" id="pricing">
      <div class="pricing-page">
        <h1>Simple, Transparent Pricing</h1>
        <div class="pricing-grid">
          <div class="price-card"><h3>Free</h3><div class="price">0 dollars</div><div class="price-desc">7-day trial</div><ul><li>1 exchange connection</li><li>Basic grid bot</li><li>Email support</li><li>Manual trades only</li></ul><button class="btn" onclick="goToSignup(); return false;">Get Started</button></div>
          <div class="price-card featured"><h3>Pro</h3><div class="price">29 dollars</div><div class="price-desc">per month</div><ul><li>4 exchange connections</li><li>Advanced grid bots</li><li>24/7 AI automation</li><li>Priority support</li><li>Performance analytics</li></ul><button class="btn" onclick="goToSignup(); return false;">Subscribe</button></div>
          <div class="price-card"><h3>Enterprise</h3><div class="price">299 dollars</div><div class="price-desc">per month</div><ul><li>Unlimited exchanges</li><li>Custom bot strategies</li><li>Dedicated account manager</li><li>API access</li><li>White-label option</li></ul><button class="btn" onclick="goToSignup(); return false;">Contact Sales</button></div>
        </div>
      </div>
      <div class="footer">
        <div class="footer-links">
          <a href="#" onclick="showPage('landing'); return false;">Home</a>
          <a href="#" onclick="alert('Help center coming soon'); return false;">Help</a>
          <a href="#" onclick="alert('Contact: support@cryptoauto.com'); return false;">Contact Support</a>
          <a href="#" onclick="alert('Coming soon'); return false;">Terms</a>
          <a href="#" onclick="alert('Coming soon'); return false;">Privacy</a>
        </div>
        <div class="footer-bottom">
          <p>Copyright 2026 CryptoAuto. All rights reserved. | support@cryptoauto.com | 1-800-CRYPTO-1</p>
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
          <button class="btn-submit" onclick="doSignup(); return false;">Create Account</button>
          <p style="text-align: center; margin-top: 15px; font-size: 14px; color: rgba(255, 255, 255, 0.6);">
            Already have account? <a href="#" onclick="showLogin(); return false;" style="color: #10b981; text-decoration: none;">Login</a>
          </p>
        </div>
      </div>
    </div>
  </div>

  <div class="dashboard-container" id="dashContainer">
    <div class="dash-header">
      <div class="dash-logo" onclick="goHome(); return false;">CryptoAuto Dashboard</div>
      <div class="dash-user">
        <span id="userEmail"></span>
        <button class="logout-btn" onclick="doLogout(); return false;">Logout</button>
      </div>
    </div>
    
    <div class="dash-layout">
      <div class="dash-sidebar">
        <div class="sidebar-item active" onclick="switchSection('portfolio'); return false;">Portfolio</div>
        <div class="sidebar-item" onclick="switchSection('bots'); return false;">Trading Bots</div>
        <div class="sidebar-item" onclick="switchSection('exchanges'); return false;">Exchanges</div>
        <div class="sidebar-item" onclick="switchSection('profile'); return false;">Profile</div>
        <div class="sidebar-item" onclick="switchSection('account'); return false;">Account</div>
        <div class="sidebar-item" onclick="switchSection('billing'); return false;">Billing</div>
        <div id="adminLink" class="sidebar-item" onclick="switchSection('admin'); return false;" style="display:none; color: #f59e0b; border-left-color: #f59e0b;">Admin Panel</div>
      </div>

      <div class="dash-content">
        <div class="section show" id="portfolio">
          <h2>Portfolio</h2>
          <div class="stats-grid">
            <div class="stat-card"><div class="stat-value">12,45
