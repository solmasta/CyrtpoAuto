import Stripe from 'stripe';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
          return new Response(JSON.stringify({ success: true }), { status: 200 });
        } catch (error) {
          return new Response(JSON.stringify({ error: 'Password change failed' }), { status: 500 });
        }
      }

      if (pathname === '/' && request.method === 'GET') {
        return new Response(getHomePage(), { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8', ...corsHeaders } });
      }

      if (pathname === '/pricing' && request.method === 'GET') {
        return new Response(getPricingPage(), { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8', ...corsHeaders } });
      }

      if (pathname === '/trial' && request.method === 'GET') {
        return new Response(getTrialPage(), { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8', ...corsHeaders } });
      }

      if (pathname === '/admin' && request.method === 'GET') {
        return new Response(getAdminPage(), { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8', ...corsHeaders } });
      }

      if (pathname === '/checkout' && request.method === 'GET') {
        const plan = url.searchParams.get('plan');
        try {
          const stripe = new Stripe(env.STRIPE_SECRET_KEY);
          const priceIds = { pro: env.STRIPE_PRO_PRICE_ID, enterprise: env.STRIPE_ENTERPRISE_PRICE_ID };
          const priceId = priceIds[plan];
          if (!priceId) return new Response(JSON.stringify({ error: 'Invalid plan' }), { status: 400 });
          const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            mode: 'subscription',
            success_url: url.origin + '/success',
            cancel_url: url.origin + '/pricing',
          });
          return new Response(JSON.stringify({ url: session.url }), { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
        } catch (error) {
          return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }
      }

      if (pathname === '/health' && request.method === 'GET') {
        return new Response(JSON.stringify({ status: 'ok' }), { status: 200 });
      }

      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    }
  }
};

function getHomePage() {
  return '<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>CryptoAuto</title><style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);color:white;}.container{max-width:1200px;margin:0 auto;padding:40px 20px;}nav{display:flex;justify-content:space-between;margin-bottom:60px;padding:15px 0;border-bottom:1px solid rgba(255,255,255,0.1);}.logo{font-size:20px;font-weight:700;}nav a{color:rgba(255,255,255,0.7);text-decoration:none;margin-left:20px;font-size:14px;}h1{font-size:36px;margin-bottom:15px;}.cta{background:#10b981;color:white;padding:12px 28px;border-radius:6px;border:none;font-weight:600;cursor:pointer;}.features{display:grid;grid-template-columns:1fr;gap:20px;margin-top:40px;margin-bottom:40px;}.feature{background:rgba(255,255,255,0.05);padding:20px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);}.feature-icon{font-size:28px;margin-bottom:10px;}</style></head><body><div class="container"><nav><div class="logo">🚀 CryptoAuto</div><div><a href="/pricing">Pricing</a><a href="/admin">Admin</a></div></nav><div><h1>Your Savings Earn 0%. Let AI Make You 2–5% Monthly.</h1><p>Passive income from automated crypto trading.</p><button class="cta" onclick="window.location.href=\'/pricing\'">Start Free Trial</button></div><div class="features"><div class="feature"><div class="feature-icon">🤖</div><h3>AI-Powered Signals</h3></div><div class="feature"><div class="feature-icon">🛡️</div><h3>Your Control</h3></div><div class="feature"><div class="feature-icon">📊</div><h3>Real Returns</h3></div><div class="feature"><div class="feature-icon">🔒</div><h3>Security</h3></div><div class="feature"><div class="feature-icon">💰</div><h3>Low Cost</h3></div><div class="feature"><div class="feature-icon">✅</div><h3>Transparent</h3></div></div><div style="text-align:center;padding:15px;background:rgba(16,185,129,0.1);border-radius:6px;margin-top:40px;">✅ Status: Live & Active</div></div></body></html>';
}

function getPricingPage() {
  return '<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Pricing</title><style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);color:white;}.container{max-width:1200px;margin:0 auto;padding:40px 20px;}nav{display:flex;justify-content:space-between;margin-bottom:40px;padding:15px 0;border-bottom:1px solid rgba(255,255,255,0.1);}.logo{font-size:20px;font-weight:700;}nav a{color:rgba(255,255,255,0.7);text-decoration:none;margin-left:20px;font-size:14px;}h1{text-align:center;font-size:32px;margin-bottom:40px;}.pricing-grid{display:grid;grid-template-columns:1fr;gap:20px;}.pricing-card{background:rgba(30,41,59,0.6);border:1px solid rgba(16,185,129,0.2);border-radius:12px;padding:25px;text-align:center;}.btn{width:100%;padding:12px;background:#10b981;color:white;border:none;border-radius:6px;font-weight:600;cursor:pointer;margin:15px 0;}</style></head><body><div class="container"><nav><div class="logo">🚀 CryptoAuto</div><div><a href="/">Home</a><a href="/admin">Admin</a></div></nav><h1>Simple Pricing</h1><div class="pricing-grid"><div class="pricing-card"><div style="font-size:18px;font-weight:700;margin-bottom:10px;">Free Trial</div><div style="font-size:32px;font-weight:700;margin-bottom:5px;">$0</div><button class="btn" onclick="window.location.href=\'/trial\'">Get Started</button></div><div class="pricing-card"><div style="font-size:18px;font-weight:700;margin-bottom:10px;">Pro</div><div style="font-size:32px;font-weight:700;margin-bottom:5px;">$29</div><button class="btn" onclick="startCheckout(\'pro\')">Start Pro</button></div><div class="pricing-card"><div style="font-size:18px;font-weight:700;margin-bottom:10px;">Enterprise</div><div style="font-size:32px;font-weight:700;margin-bottom:5px;">$299</div><button class="btn" onclick="startCheckout(\'enterprise\')">Contact Sales</button></div></div></div><script>function startCheckout(plan){fetch(\'/checkout?plan=\'+plan).then(r=>r.json()).then(d=>{if(d.url)window.location.href=d.url;});}</script></body></html>';
}

function getTrialPage() {
  return '<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Free Trial</title><style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);color:white;min-height:100vh;display:flex;align-items:center;justify-content:center;}.card{background:rgba(30,41,59,0.9);border:1px solid rgba(16,185,129,0.2);border-radius:12px;padding:30px;max-width:400px;width:100%;}h1{font-size:28px;text-align:center;margin-bottom:10px;}input{width:100%;padding:12px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:white;margin-bottom:12px;font-size:14px;}.btn{width:100%;padding:12px;background:#10b981;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;margin-top:20px;}</style></head><body><div class="card"><h1>🚀 Start Free Trial</h1><p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:30px;">7 days, full access</p><form onsubmit="handleSignup(event)"><input type="email" placeholder="Email" required><input type="password" placeholder="Password" required><button type="submit" class="btn">Start Trial</button></form></div><script>function handleSignup(e){e.preventDefault();alert("Trial created!");window.location.href="/";}</script></body></html>';
}

function getAdminPage() {
  return '<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0,viewport-fit=cover"><title>CryptoAuto Admin</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#0f172a;color:white;height:100vh;overflow:hidden;}.version{position:fixed;top:60px;right:10px;background:#10b981;color:white;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600;z-index:999;}.login{display:flex;position:fixed;top:0;left:0;width:100%;height:100%;background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);align-items:center;justify-content:center;z-index:1000;}.login.hidden{display:none;}.card{background:rgba(30,41,59,0.9);border:1px solid rgba(16,185,129,0.2);border-radius:12px;padding:30px;width:100%;max-width:380px;}.card h1{margin-bottom:25px;font-size:28px;text-align:center;}input{width:100%;padding:12px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:white;margin-bottom:15px;font-size:16px;}.btn-login{width:100%;padding:12px;background:#10b981;color:white;border:none;border-radius:8px;font-size:16px;font-weight:600;cursor:pointer;margin-top:10px;}.error{background:rgba(239,68,68,0.2);color:#fca5a5;padding:10px;border-radius:6px;margin-bottom:15px;}.dashboard{display:none;position:fixed;top:0;left:0;width:100%;height:100%;flex-direction:column;}.dashboard.active{display:flex;}.header{background:#1e293b;border-bottom:1px solid rgba(16,185,129,0.2);padding:15px;display:flex;justify-content:space-between;align-items:center;}.logo{font-size:20px;font-weight:700;}.logout-btn{background:#ef4444;color:white;border:none;padding:10px 20px;border-radius:6px;font-size:14px;cursor:pointer;font-weight:600;}.content{flex:1;overflow-y:auto;padding:20px;padding-bottom:80px;}.section{display:none;}.section.show{display:block;}.nav-btn{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:8px;cursor:pointer;color:rgba(255,255,255,0.6);font-size:11px;border:none;background:none;}.nav-btn.active{color:#10b981;}.nav{position:fixed;bottom:0;left:0;right:0;background:#1e293b;border-top:1px solid rgba(16,185,129,0.2);display:flex;height:70px;}.input-pwd{width:100%;padding:12px;background:rgba(255,255,255,0.08);border:1px solid rgba(16,185,129,0.4);border-radius:6px;color:white;margin-bottom:12px;}.btn-save{width:100%;background:#10b981;color:white;padding:12px;border:none;border-radius:6px;cursor:pointer;font-weight:600;}.success{background:rgba(16,185,129,0.2);color:#86efac;padding:12px;border-radius:6px;margin-bottom:15px;}.error-msg{background:rgba(239,68,68,0.2);color:#fca5a5;padding:12px;border-radius:6px;margin-bottom:15px;}</style></head><body><div class="version">v3.0</div><div class="login" id="login"><div class="card"><h1>🤖 CryptoAuto</h1><div id="loginErr"></div><input type="email" id="email" value="admin@example.com" placeholder="Email"><input type="password" id="password" placeholder="Password"><button class="btn-login" onclick="doLogin()">Login</button></div></div><div class="dashboard" id="dash"><div class="header"><div class="logo">🚀 CryptoAuto</div><button class="logout-btn" onclick="doLogout()">Logout</button></div><div class="content"><div class="section show" id="port"><h2>📊 Portfolio</h2><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;"><div style="background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);border-radius:8px;padding:15px;text-align:center;"><div style="font-size:24px;font-weight:700;">$12,450</div><div style="font-size:12px;color:rgba(255,255,255,0.6);">Total</div></div><div style="background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);border-radius:8px;padding:15px;text-align:center;"><div style="font-size:24px;font-weight:700;">65%</div><div style="font-size:12px;color:rgba(255,255,255,0.6);">Win Rate</div></div></div></div><div class="section" id="trades"><h2>💹 Trades</h2><p>Coming soon</p></div><div class="section" id="settings"><h2>⚙️ Settings</h2><div style="background:rgba(30,41,59,0.6);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:20px;"><h3>🔐 Change Password</h3><div id="pwdMsg"></div><input class="input-pwd" type="password" id="curPwd" placeholder="Current password"><input class="input-pwd" type="password" id="newPwd" placeholder="New password"><input class="input-pwd" type="password" id="conPwd" placeholder="Confirm password"><button class="btn-save" onclick="changePwd()">Update</button></div></div><div class="section" id="users"><h2>👥 Users</h2><p>Coming soon</p></div></div><div class="nav"><button class="nav-btn active" onclick="tab(\'port\')"><div style="font-size:24px;margin-bottom:2px;">📊</div>Portfolio</button><button class="nav-btn" onclick="tab(\'trades\')"><div style="font-size:24px;margin-bottom:2px;">💹</div>Trades</button><button class="nav-btn" onclick="tab(\'settings\')"><div style="font-size:24px;margin-bottom:2px;">⚙️</div>Settings</button><button class="nav-btn" onclick="tab(\'users\')"><div style="font-size:24px;margin-bottom:2px;">👥</div>Users</button></div></div></div><script>function tab(t){document.querySelectorAll(\'.section\').forEach(e=>e.classList.remove(\'show\'));document.querySelectorAll(\'.nav-btn\').forEach(e=>e.classList.remove(\'active\'));document.getElementById(t).classList.add(\'show\');event.target.closest(\'.nav-btn\').classList.add(\'active\');}async function doLogin(){const e=document.getElementById(\'email\').value,a=document.getElementById(\'password\').value;try{const t=await fetch(\'/api/auth/login\',{method:\'POST\',headers:{\'Content-Type\':\'application/json\'},body:JSON.stringify({email:e,password:a})});if(!t.ok){document.getElementById(\'loginErr\').innerHTML=\'<div class="error">Login failed</div>\';return;}const n=await t.json();n.token?(localStorage.setItem(\'authToken\',n.token),document.getElementById(\'login\').classList.add(\'hidden\'),document.getElementById(\'dash\').classList.add(\'active\')):document.getElementById(\'loginErr\').innerHTML=\'<div class="error">\'+n.error+\'</div>\';}catch(t){document.getElementById(\'loginErr\').innerHTML=\'<div class="error">Error: \'+t.message+\'</div>\'}}async function changePwd(){const t=localStorage.getItem(\'authToken\'),e=document.getElementById(\'curPwd\').value,a=document.getElementById(\'newPwd\').value,n=document.getElementById(\'conPwd\').value;if(!e||!a||!n)return void(document.getElementById(\'pwdMsg\').innerHTML=\'<div class="error-msg">All fields required</div>\');if(a!==n)return void(document.getElementById(\'pwdMsg\').innerHTML=\'<div class="error-msg">Passwords do not match</div>\');try{const o=await fetch(\'/api/auth/change-password\',{method:\'POST\',headers:{\'Content-Type\':\'application/json\',\'Authorization\':\'Bearer \'+t},body:JSON.stringify({currentPassword:e,newPassword:a})});if(!o.ok){document.getElementById(\'pwdMsg\').innerHTML=\'<div class="error-msg">Failed</div>\';return;}const s=await o.json();s.success?(document.getElementById(\'pwdMsg\').innerHTML=\'<div class="success">Password changed!</div>\',document.getElementById(\'curPwd\').value=\'\',document.getElementById(\'newPwd\').value=\'\',document.getElementById(\'conPwd\').value=\'\'):document.getElementById(\'pwdMsg\').innerHTML=\'<div class="error-msg">\'+s.error+\'</div>\';}catch(o){document.getElementById(\'pwdMsg\').innerHTML=\'<div class="error-msg">Error: \'+o.message+\'</div>\'}}function doLogout(){localStorage.removeItem(\'authToken\'),document.getElementById(\'login\').classList.remove(\'hidden\'),document.getElementById(\'dash\').classList.remove(\'active\')}window.addEventListener(\'load\',()=>{localStorage.getItem(\'authToken\')&&(document.getElementById(\'login\').classList.add(\'hidden\'),document.getElementById(\'dash\').classList.add(\'active\'))})</script></body></html>';
}
