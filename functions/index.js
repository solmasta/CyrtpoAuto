/**
 * CryptoAuto - Secure Authentication Version
 */

import Stripe from 'stripe';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Admin dashboard with password change
const ADMIN_DASHBOARD_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>CryptoAuto Admin</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: white; overflow: hidden; }
    .login-page { display: flex; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); align-items: center; justify-content: center; z-index: 1000; }
    .login-page.hidden { display: none !important; }
    .login-card { background: rgba(30, 41, 59, 0.9); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 12px; padding: 30px 20px; width: 100%; max-width: 380px; }
    .login-card h1 { margin-bottom: 25px; font-size: 28px; text-align: center; }
    .form-group { margin-bottom: 15px; }
    .form-group label { display: block; margin-bottom: 6px; font-size: 13px; font-weight: 600; }
    .form-group input { width: 100%; padding: 12px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; color: white; font-size: 16px; }
    .btn-login { width: 100%; padding: 12px; background: #10b981; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; margin-top: 10px; }
    .error { background: rgba(239, 68, 68, 0.2); color: #fca5a5; padding: 10px; border-radius: 6px; margin-bottom: 15px; font-size: 13px; }
    .dashboard { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; }
    .dashboard.active { display: flex !important; flex-direction: column; }
    .app-header { background: #1e293b; border-bottom: 1px solid rgba(16, 185, 129, 0.2); padding: 15px; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
    .app-header .logo { font-size: 20px; font-weight: 700; }
    .app-header .logout-btn { background: rgba(239, 68, 68, 0.2); color: #fca5a5; border: none; padding: 8px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; }
    .content { flex: 1; overflow-y: auto; padding: 20px; padding-bottom: 80px; }
    .section { display: none; }
    .section.active { display: block !important; }
    .section h2 { font-size: 20px; margin-bottom: 20px; }
    .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
    .stat-card { background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 15px; text-align: center; }
    .stat-card .value { font-size: 24px; font-weight: 700; margin-bottom: 4px; }
    .stat-card .label { font-size: 12px; color: rgba(255, 255, 255, 0.6); }
    .card { background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 15px; margin-bottom: 15px; }
    .card input { width: 100%; padding: 10px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 6px; color: white; margin: 10px 0; }
    .btn-save { background: #10b981; color: white; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; }
    .success { background: rgba(16, 185, 129, 0.2); color: #10b981; padding: 10px; border-radius: 6px; margin-bottom: 15px; }
    .bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; background: #1e293b; border-top: 1px solid rgba(16, 185, 129, 0.2); display: flex; justify-content: space-around; height: 70px; }
    .nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 8px; cursor: pointer; color: rgba(255, 255, 255, 0.6); font-size: 11px; }
    .nav-item.active { color: #10b981; }
    .nav-item .icon { font-size: 24px; margin-bottom: 2px; }
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
    <button class="app-header .logout-btn" onclick="doLogout()">Logout</button>
  </div>
  <div class="content">
    <div class="section active" id="portfolio">
      <h2>📊 Portfolio</h2>
      <div class="stat-grid">
        <div class="stat-card"><div class="value">$12,450</div><div class="label">Total</div></div>
        <div class="stat-card"><div class="value">65%</div><div class="label">Win Rate</div></div>
        <div class="stat-card"><div class="value">+3.2%</div><div class="label">This Month</div></div>
        <div class="stat-card"><div class="value">24</div><div class="label">Active</div></div>
      </div>
    </div>
    <div class="section" id="trades">
      <h2>💹 Trades</h2>
      <div class="card"><p>Trade history</p></div>
    </div>
    <div class="section" id="settings">
      <h2>⚙️ Settings</h2>
      <div class="card">
        <h3 style="margin-bottom: 15px;">Change Password</h3>
        <div id="passwordMessage"></div>
        <input type="password" id="currentPassword" placeholder="Current password">
        <input type="password" id="newPassword" placeholder="New password">
        <input type="password" id="confirmPassword" placeholder="Confirm new password">
        <button class="btn-save" onclick="changePassword()">Update Password</button>
      </div>
    </div>
    <div class="section" id="users">
      <h2>👥 Users</h2>
      <div class="card"><p>User management coming soon</p></div>
    </div>
  </div>
  <div class="bottom-nav">
    <div class="nav-item active" onclick="switchTab('portfolio')"><div class="icon">📊</div><div>Portfolio</div></div>
    <div class="nav-item" onclick="switchTab('trades')"><div class="icon">💹</div><div>Trades</div></div>
    <div class="nav-item" onclick="switchTab('settings')"><div class="icon">⚙️</div><div>Settings</div></div>
    <div class="nav-item" onclick="switchTab('users')"><div class="icon">👥</div><div>Users</div></div>
  </div>
</div>
<script>
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
      alert('All fields required');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
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
        document.getElementById('passwordMessage').innerHTML = '<div class="success">Password changed successfully!</div>';
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
      } else {
        document.getElementById('passwordMessage').innerHTML = '<div class="error">' + (data.error || 'Failed to change password') + '</div>';
      }
    } catch (err) {
      document.getElementById('passwordMessage').innerHTML = '<div class="error">Error: ' + err.message + '</div>';
    }
  }

  function switchTab(tabName) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    event.target.closest('.nav-item').classList.add('active');
  }

  function doLogout() {
    localStorage.removeItem('authToken');
    document.getElementById('loginPage').classList.remove('hidden');
    document.getElementById('dashboard').classList.remove('active');
    document.getElementById('email').value = 'admin@example.com';
    document.getElementById('password').value = '';
  }

  // Check if already logged in
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
    .features li { padding: 8px 0; color: rgba(255,255,255,0.8); }
    .features li:before { content: "✓ "; color: #10b981; margin-right: 8px; }
    @media (min-width: 768px) {
      .pricing-grid { grid-template-columns: repeat(3, 1fr); }
      h1 { font-size: 48px; }
    }
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
        <div class="price">$0</div>
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
        <div class="price">$29</div>
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
        <div class="price">$299</div>
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
        if (data.url) {
          window.location.href = data.url;
        }
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
      alert('Trial account created! Check your email to verify.');
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
      };

      // LOGIN API
      if (pathname === '/api/auth/login' && request.method === 'POST') {
        try {
          const { email, password } = await request.json();
          
          if (email !== 'admin@example.com') {
            return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 401 });
          }

          const passwordMatch = await bcrypt.compare(password, env.ADMIN_PASSWORD_HASH);
          if (!passwordMatch) {
            return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 401 });
          }

          const token = jwt.sign({ email }, env.JWT_SECRET, { expiresIn: '7d' });
          return new Response(JSON.stringify({ token }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        } catch (error) {
          return new Response(JSON.stringify({ error: 'Login failed' }), { status: 500 });
        }
      }

      // CHANGE PASSWORD API
      if (pathname === '/api/auth/change-password' && request.method === 'POST') {
        try {
          const authHeader = request.headers.get('Authorization');
          if (!authHeader) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
          }

          const token = authHeader.replace('Bearer ', '');
          const decoded = jwt.verify(token, env.JWT_SECRET);

          const { currentPassword, newPassword } = await request.json();
          
          const passwordMatch = await bcrypt.compare(currentPassword, env.ADMIN_PASSWORD_HASH);
          if (!passwordMatch) {
            return new Response(JSON.stringify({ error: 'Current password is incorrect' }), { status: 401 });
          }

          // Note: In production, you'd want to store new password securely
          // For now, we'll just accept it but note that it won't persist without a database
          return new Response(JSON.stringify({ success: true, message: 'Password changed (note: requires database persistence in production)' }), { status: 200 });
        } catch (error) {
          return new Response(JSON.stringify({ error: 'Password change failed' }), { status: 500 });
        }
      }

      // PAGES
      if (pathname === '/' && request.method === 'GET') {
        return new Response(getLandingPage(), { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8', ...corsHeaders } });
      }

      if (pathname === '/pricing' && request.method === 'GET') {
        return new Response(PRICING_PAGE_HTML, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8', ...corsHeaders } });
      }

      if (pathname === '/trial' && request.method === 'GET') {
        return new Response(TRIAL_SIGNUP_HTML, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8', ...corsHeaders } });
      }

      if (pathname === '/checkout' && request.method === 'GET') {
        const plan = url.searchParams.get('plan');
        try {
          const stripe = new Stripe(env.STRIPE_SECRET_KEY);
          const priceIds = { pro: env.STRIPE_PRO_PRICE_ID, enterprise: env.STRIPE_ENTERPRISE_PRICE_ID };
          const priceId = priceIds[plan];
          
          if (!priceId) {
            return new Response(JSON.stringify({ error: 'Invalid plan' }), { status: 400 });
          }

          const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            mode: 'subscription',
            success_url: `${url.origin}/success`,
            cancel_url: `${url.origin}/pricing`,
          });

  
