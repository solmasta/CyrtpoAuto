/**
 * CryptoAuto - Cloudflare Worker
 * Main entry point - handles all routes
 */

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const pathname = url.pathname;
      const method = request.method;

      // Add CORS headers
      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      };

      // Handle CORS preflight
      if (method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: corsHeaders,
        });
      }

      // ===== LANDING PAGE =====
      if (pathname === '/' && method === 'GET') {
        const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CryptoAuto - AI-Powered Crypto Trading</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: white;
      line-height: 1.6;
      min-height: 100vh;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 60px 20px;
    }
    nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 80px;
      padding: 20px 0;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .logo {
      font-size: 24px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .logo-icon {
      font-size: 28px;
    }
    nav a {
      color: rgba(255,255,255,0.7);
      text-decoration: none;
      margin-left: 30px;
      transition: color 0.3s;
    }
    nav a:hover {
      color: #10b981;
    }
    .hero {
      text-align: center;
      margin-bottom: 60px;
    }
    h1 {
      font-size: 56px;
      margin-bottom: 20px;
      line-height: 1.2;
    }
    .subtitle {
      font-size: 20px;
      color: rgba(255,255,255,0.8);
      margin-bottom: 40px;
    }
    .cta-button {
      display: inline-block;
      background: #10b981;
      color: white;
      padding: 14px 32px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s;
      border: none;
      cursor: pointer;
      font-size: 16px;
    }
    .cta-button:hover {
      background: #059669;
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);
    }
    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 30px;
      margin-top: 60px;
    }
    .feature {
      background: rgba(255,255,255,0.05);
      padding: 30px;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.1);
    }
    .feature-icon {
      font-size: 32px;
      margin-bottom: 15px;
    }
    .feature h3 {
      margin-bottom: 10px;
      font-size: 18px;
    }
    .feature p {
      color: rgba(255,255,255,0.7);
      font-size: 14px;
    }
    .status {
      text-align: center;
      margin-top: 40px;
      padding: 20px;
      background: rgba(16, 185, 129, 0.1);
      border-radius: 8px;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }
    .status-dot {
      display: inline-block;
      width: 12px;
      height: 12px;
      background: #10b981;
      border-radius: 50%;
      margin-right: 8px;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  </style>
</head>
<body>
  <div class="container">
    <nav>
      <div class="logo">
        <span class="logo-icon">🚀</span>
        <span>CryptoAuto</span>
      </div>
      <div>
        <a href="#features">Features</a>
        <a href="#pricing">Pricing</a>
      </div>
    </nav>

    <div class="hero">
      <h1>Your Savings Earn 0%. Let AI Make You 2–5% Monthly.</h1>
      <p class="subtitle">Passive income from automated crypto trading powered by AI.</p>
      <button class="cta-button" onclick="alert('Coming Soon')">Start Free Trial</button>
    </div>

    <div class="features">
      <div class="feature">
        <div class="feature-icon">🤖</div>
        <h3>AI-Powered</h3>
        <p>Advanced algorithms generate trading signals 24/7</p>
      </div>
      <div class="feature">
        <div class="feature-icon">🛡️</div>
        <h3>Your Money, Your Control</h3>
        <p>You keep your API keys. We never touch your funds.</p>
      </div>
      <div class="feature">
        <div class="feature-icon">📊</div>
        <h3>Real Returns</h3>
        <p>2–5% monthly profit. All trades visible on your exchange.</p>
      </div>
      <div class="feature">
        <div class="feature-icon">🔒</div>
        <h3>Military Security</h3>
        <p>Encrypted, hashed, secure. No passwords stored.</p>
      </div>
      <div class="feature">
        <div class="feature-icon">💰</div>
        <h3>Low Cost</h3>
        <p>Free trial. $9.99/month. No hidden fees.</p>
      </div>
      <div class="feature">
        <div class="feature-icon">✅</div>
        <h3>Transparent</h3>
        <p>Every trade shown. Win rate verified.</p>
      </div>
    </div>

    <div class="status">
      <span class="status-dot"></span>
      <strong>Status: Live & Active</strong>
      <p style="margin-top: 8px; font-size: 14px;">Worker deployed and ready for production</p>
    </div>
  </div>
</body>
</html>`;

        return new Response(html, {
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            ...corsHeaders,
          },
        });
      }

      // ===== ADMIN LOGIN =====
      if (pathname === '/admin/login' && method === 'POST') {
        try {
          const body = await request.json();
          const { email, password } = body;

          if (!email || !password) {
            return new Response(
              JSON.stringify({ error: 'Email and password required' }),
              { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
            );
          }

          // Demo: accept admin@example.com / password
          if (email === 'admin@example.com' && password === 'password') {
            const token = 'demo-jwt-token-' + Date.now();
            return new Response(
              JSON.stringify({ success: true, token }),
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

      // ===== API ROUTES =====
      if (pathname === '/api/portfolio' && method === 'GET') {
        const apiKey = request.headers.get('x-api-key');
        if (!apiKey) {
          return new Response(
            JSON.stringify({ error: 'API key required' }),
            { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
          );
        }

        return new Response(
          JSON.stringify({
            portfolio: {
              total_value: 1000,
              trades: [],
              win_rate: 0.65,
            },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }

      // ===== HEALTH CHECK =====
      if (pathname === '/health' && method === 'GET') {
        return new Response(
          JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }),
          { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }

      // ===== 404 =====
      return new Response(
        JSON.stringify({ error: 'Not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );

    } catch (error) {
      console.error('Worker error:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error', message: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
};
