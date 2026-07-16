/**
 * CryptoAuto - Completely Rewritten Admin Dashboard
 */

import Stripe from 'stripe';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const ADMIN_DASHBOARD_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
  <title>CryptoAuto Admin</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: white; overflow: hidden; }
    
    .login-page { display: flex; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); align-items: center; justify-content: center; z-index: 1000; }
    .login-page.hidden { display: none !important; }
    .login-card { background: rgba(30, 41, 59, 0.9); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 12px; padding: 30px 20px; width: 100%; max-width: 380px; }
    .login-card h1 { margin-bottom: 25px; font-size: 28px; text-align: center; }
    .form-group { margin-bottom: 15px; }
    .form-group label { display: block; margin-bottom: 6px; font-size: 13px; font-weight: 600; }
    .form-group input { width: 100%; padding: 12px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; color: white; font-size: 16px; }
    .btn-login { width: 100%; padding: 12px; background: #10b981; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; margin-top: 10px; }
    .error { background: rgba(239, 68, 68, 0.2); color: #fca5a5; padding: 10px; border-radius: 6px; margin-bottom: 15px; font-size: 13px; }
    
    .dashboard { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; flex-direction: column; }
    .dashboard.active { display: flex !important; }
    
    .app-header { background: #1e293b; border-bottom: 1px solid rgba(16, 185, 129, 0.2); padding: 15px; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
    .app-header .logo { font-size: 20px; font-weight: 700; }
    
    .logout-btn { background: #ef4444 !important; color: white !important; border: none !important; padding: 10px 20px !important; border-radius: 6px !important; font-size: 14px !important; cursor: pointer !important; font-weight: 600 !important; }
    .logout-btn:active { background: #dc2626 !important; }
    
    .content { flex: 1; overflow-y: auto; padding: 20px; padding-bottom: 80px; }
    
    .portfolio-section { display: none; }
    .trades-section { display: none; }
    .settings-section { display: none; }
    .users-section { display: none; }
    
    .portfolio-section.show { display: block; }
    .trades-section.show { display: block; }
    .settings-section.show { display: block; }
    .users-section.show { display: block; }
    
    h2 { font-size: 20px; margin-bottom: 20px; }
    
    .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
    .stat-card { background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 15px; text-align: center; }
    .stat-card .value { font-size: 24px; font-weight: 700; margin-bottom: 4px; }
    .stat-card .label { font-size: 12px; color: rgba(255, 255, 255, 0.6); }
    
    .card { background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 20px; margin-bottom: 15px; }
    .card h3 { margin-bottom: 15px; font-size: 16px; font-weight: 600; }
    .card input { width: 100%; padding: 12px; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 6px; color: white; margin-bottom: 12px; font-size: 14px; }
    .card input::placeholder { color: rgba(255, 255, 255, 0.5); }
    
    .btn-save { background: #10b981 !important; color: white !important; padding: 12px 24px !important; border: none !important; border-radius: 6px !important; cursor: pointer !important; font-weight: 600 !important; font-size: 14px !important; width: 100% !important; }
    .btn-save:active { background: #059669 !important; }
    
    .success { background: rgba(16, 185, 129, 0.2); color: #86efac; padding: 12px; border-radius: 6px; margin-bottom: 15px; font-size: 13px; border: 1px solid rgba(16, 185, 129, 0.4); }
    .error-msg { background: rgba(239, 68, 68, 0.2); color: #fca5a5; padding: 12px; border-radius: 6px; margin-bottom: 15px; font-size: 13px; border: 1px solid rgba(239, 68, 68, 0.4); }
    
    .bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; background: #1e293b; border-top: 1px solid rgba(16, 185, 129, 0.2); display: flex; justify-content: space-around; height: 70px; }
    .nav-btn { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 8px; cursor: pointer; color: rgba(255, 255, 255, 0.6); font-size: 11px; border: none; background: none; }
    .nav-btn.active { color: #10b981; }
    .nav-btn .icon { font-size: 24px; margin-bottom: 2px; }
  </style>
</head>
<body>
<div class="login-page" id="loginPage">
  <div class="login-card">
    <h1>🤖 CryptoAuto</h1>
    <div id="loginError"></div>
    <div class="form-group">
      <label>Email</label>
      <input type="email" id="email" value="admin@example.com">
    </div>
    <div class="form-group">
      <label>Password</label>
      <input type="password" id="password">
    </div>
    <button class="btn-login" onclick="doLogin()">Login</button>
  </div>
</div>

<div class="dashboard" id="dashboard">
  <div class="app-header">
    <div class="logo">🚀 CryptoAuto</div>
    <button class="logout-btn" onclick="doLogout()">Logout</button>
  </div>
  
  <div class="content">
    <div class="portfolio-section show">
      <h2>📊 Portfolio</h2>
      <div class="stat-grid">
        <div class="stat-card"><div class="value">\$12,450</div><div class="label">Total</div></div>
        <div class="stat-card"><div class="value">65%</div><div class="label">Win Rate</div></div>
        <div class="stat-card"><div class="value">+3.2%</div><div class="label">This Month</div></div>
        <div class="stat-card"><div class="value">24</div><div class="label">Active</div></div>
      </div>
    </div>

    <div class="trades-section">
      <h2>💹 Trades</h2>
      <div class="card"><p>Trade history coming soon</p></div>
    </div>

    <div class="settings-section">
      <h2>⚙️ Settings</h2>
      <div class="card">
        <h3>🔐 Change Password</h3>
        <div id="passwordMessage"></div>
        <input type="password" id="currentPassword" placeholder="Current password">
        <input type="password" id="newPassword" placeholder="New password">
        <input type="password" id="confirmPassword" placeholder="Confirm new password">
        <button class="btn-save" onclick="changePassword()">Update Password</button>
      </div>
    </div>

    <div class="users-section">
      <h2>👥 Users</h2>
      <div class="card"><p>User management coming soon</p></div>
    </div>
  </div>

  <div class="bottom-nav">
    <button class="nav-btn active" onclick="showTab('portfolio')"><div class="icon">📊</div><div>Portfolio</div></button>
    <button class="nav-btn" onclick="showTab('trades')"><div class="icon">💹</div><div>Trades</div></button>
    <button class="nav-btn" onclick="showTab('settings')"><div class="icon">⚙️</div><div>Settings</div></button>
    <button class="nav-btn" onclick="showTab('users')"><div class="icon">👥</div><div>Users</div></button>
  </div>
</div>

<script>
  function showTab(tab) {
    // Hide all sections
    document.querySelectorAll('.portfolio-section, .trades-section, .settings-section, .users-section').forEach(el => {
      el.classList.remove('show');
    });
    
    // Remove active from all buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    // Show the selected section
    if (tab === 'portfolio') {
      document.querySelector('.portfolio-section').classList.add('show');
      document.querySelectorAll('.nav-btn')[0].classList.add('active');
    } else if (tab === 'trades') {
      document.querySelector('.trades-section').classList.add('show');
      document.querySelectorAll('.nav-btn')[1].classList.add('active');
    } else if (tab === 'settings') {
      document.querySelector('.settings-section').classList.add('show');
      document.querySelectorAll('.nav-btn')[2].classList.add('active');
    } else if (tab === 'users') {
      document.querySelector('.users-section').classList.add('show');
      document.querySelectorAll('.nav-btn')[3].classList.add('active');
    }
  }

  async function doLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        document.getElementById('loginPage').classList.add('hidden');
        document.getElementById('dashboard').classList.add('active');
      } else {
        document.getElementById('loginError').innerHTML = '<div class="error">' + (data.error || 'Login failed') + '</div>';
      }
    } catch (err) {
      document.getElementById('loginError').innerHTML = '<div class="error">Error: ' + err.message + '</div>';
    }
  }

  async function changePassword() {
    const token = localStorage.getItem('authToken');
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!currentPassword || !newPassword || !confirmPassword) {
      document.getElementById('passwordMessage').innerHTML = '<div class="error-msg">All fields required</div>';
      return;
    }
    if (newPassword !== confirmPassword) {
      document.getElementById('passwordMessage').innerHTML = '<div class="error-msg">Passwords do not match</div>';
      return;
    }

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (data.success) {
        document.getElementById('passwordMessage').innerHTML = '<div class="success">✓ Password changed!</div>';
        setTimeout(() => {
          document.getElementById('currentPassword').value = '';
          document.getElementById('newPassword').value = '';
          document.getElementById('confirmPassword').value = '';
          document.getElementById('passwordMessage').innerHTML = '';
        }, 2000);
      } else {
        document.getElementById('passwordMessage').innerHTML = '<div class="error-msg">' + (data.error || 'Failed') + '</div>';
      }
    } catch (err) {
      document.getElementById('passwordMessage').innerHTML = '<div class="error-msg">Error: ' + err.message + '</div>';
    }
  }

  function doLogout() {
    localStorage.removeItem('authToken');
    document.getElementById('loginPage').classList.remove('hidden');
    document.getElementById('dashboard').classList.remove('active');
    document.getElementById('email').value = 'admin@example.com';
    document.getElementById('password').value = '';
  }

  window.addEventListener('load', () => {
    if (localStorage.getItem('authToken')) {
      document.getElementById('loginPage').classList.add('hidden');
      document.getElementById('dashboard').classList.add('active');
    }
  });
</script>
</body>
</html>`;

const PRICING_PAGE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
  <title>Pricing</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; }
    .container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
    nav { display: flex; justify-content: space-between; margin-bottom: 40px; padding: 15px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .logo { font-size: 20px; font-weight: 700; }
    nav a { color: rgba(255,255,255,0.7); text-decoration: none; margin-left: 20px; font-size: 14px; }
    h1 { text-align: center; font-size: 32px; margin-bottom: 40px; }
    .pricing-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
    .pricing-card { background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 12px; padding: 25px; text-align: center; }
    .plan-name { font-size: 18px; font-weight: 700; margin-bottom: 10px; }
    .price { font-size: 32px; font-weight: 700; margin-bottom: 5px; }
    .btn { display: block; width: 100%; padding: 12px; background: #10b981; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 14px; margin: 15px 0; }
    .features { list-style: none; text-align: left; font-size: 13px; }
    .features li { padding: 8px 0; }
    .features li:before { content: "✓ "; color: #10b981; margin-right: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <nav>
      <div class="logo">🚀 CryptoAuto</div>
      <div><a href="/">Home</a><a href="/admin">Admin</a></div>
    </nav>
    <h1>Simple Pricing</h1>
    <div class="pricing-grid">
      <div class="pricing-card">
        <div class="plan-name">Free Trial</div>
        <div class="price">\$0</div>
        <div style="font-size: 13px; margin-bottom: 15px;">7 days</div>
        <button class="btn" onclick="window.location.href='/trial'">Get Started</button>
        <ul class="features">
          <li>Full access</li>
          <li>1 bot</li>
          <li>Binance</li>
          <li>Basic analytics</li>
        </ul>
      </div>
      <div class="pricing-card">
        <div class="plan-name">Pro</div>
        <div class="price">\$29</div>
        <div style="font-size: 13px; margin-bottom: 15px;">per month</div>
        <button class="btn" onclick="startCheckout('pro')">Start Pro</button>
        <ul class="features">
          <li>Unlimited bots</li>
          <li>All 4 exchanges</li>
          <li>Advanced signals</li>
          <li>Real-time alerts</li>
        </ul>
      </div>
      <div class="pricing-card">
        <div class="plan-name">Enterprise</div>
        <div class="price">\$299</div>
        <div style="font-size: 13px; margin-bottom: 15px;">per month</div>
        <button class="btn" onclick="startCheckout('enterprise')">Contact Sales</button>
        <ul class="features">
          <li>Everything in Pro</li>
          <li>Custom strategies</li>
          <li>API access</li>
          <li>24/7 support</li>
        </ul>
      </div>
    </div>
  </div>
  <script>
    async function startCheckout(plan) {
      try {
        const res = await fetch('/checkout?plan=' + plan);
        const data = await res.json();
        if (data.url) window.location.href = data.url;
      } catch (err) {
        alert('Checkout failed');
      }
    }
  </script>
</body>
</html>`;

const TRIAL_SIGNUP_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Free Trial</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .container { width: 100%; max-width: 400px; padding: 20px; }
    .card { background: rgba(30, 41, 59, 0.9); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 12px; padding: 30px; }
    h1 { font-size: 28px; margin-bottom: 10px; text-align: center; }
    .subtitle { text-align: center; color: rgba(255, 255, 255, 0.7); margin-bottom: 30px; }
    .form-group { margin-bottom: 15px; }
    .form-group label { display: block; margin-bottom: 6px; font-size: 14px; font-weight: 600; }
    .form-group input { width: 100%; padding: 12px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; color: white; font-size: 14px; }
    .btn { width: 100%; padding: 12px; background: #10b981; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 16px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <h1>🚀 Start Free Trial</h1>
      <p class="subtitle">7 days, full access, no credit card</p>
      <form onsubmit="handleSignup(event)">
        <div class="form-group">
          <label>Email</label>
          <input type="email" required placeholder="you@example.com">
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" required placeholder="••••••••">
        </div>
        <button type="submit" class="btn">Start Free Trial</button>
      </form>
    </div>
  </div>
  <script>
    function handleSignup(e) {
      e.preventDefault();
      alert('Trial account created!');
      window.location.href = '/';
    }
  </script>
</body>
</html>`;

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const pathname = url.pathname;
      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      };

      if (pathname === '/api/auth/login' && request.method === 'POST') {
        try {
          const { email, password } = await request.json();
          if (email !== 'admin@example.com') return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 401 });
          const passwordMatch = await bcrypt.compare(password, env.ADMIN_PASSWORD_HASH);
          if (!passwordMatch) return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 401 });
          const token = jwt.sign({ email }, env.JWT_SECRET, { expiresIn: '7d' });
          return new Response(JSON.stringify({ token }), { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
        } catch (error) {
          return new Response(JSON.stringify({ error: 'Login failed' }), { status: 500 });
        }
      }

      if (pathname === '/api/auth/change-password' && request.method === 'POST') {
        try {
          const authHeader = request.headers.get('Authorization');
          if (!authHeader) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
          const token = authHeader.replace('Bearer ', '');
          jwt.verify(token, env.JWT_SECRET);
          const { currentPassword } = await request.json();
          const passwordMatch = await bcrypt.compare(currentPassword, env.ADMIN_PASSWORD_HASH);
          if (!passwordMatch) return new Response(JSON.stringify({ error: 'Current password is incorrect' }), { status: 401 });
          return new Respons
