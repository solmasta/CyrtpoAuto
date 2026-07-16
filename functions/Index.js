import Stripe from 'stripe';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    if (pathname === '/') {
      return new Response('<html><body style="background:#0f172a;color:white;font-family:sans-serif;padding:40px;"><h1>🚀 CryptoAuto</h1><p>Your Savings Earn 0%. Let AI Make You 2-5% Monthly.</p><a href="/pricing" style="color:#10b981;">Pricing</a> | <a href="/admin" style="color:#10b981;">Admin</a></body></html>', { headers: { 'Content-Type': 'text/html' } });
    }

    if (pathname === '/pricing') {
      return new Response('<html><body style="background:#0f172a;color:white;font-family:sans-serif;padding:40px;"><h1>Pricing</h1><p>Free: $0 | Pro: $29/mo | Enterprise: $299/mo</p><a href="/" style="color:#10b981;">Home</a> | <a href="/admin" style="color:#10b981;">Admin</a></body></html>', { headers: { 'Content-Type': 'text/html' } });
    }

    if (pathname === '/admin') {
      return new Response('<html><body style="background:#0f172a;color:white;font-family:sans-serif;padding:40px;"><div style="position:fixed;top:20px;right:20px;background:#10b981;color:white;padding:8px 12px;border-radius:4px;font-size:12px;font-weight:600;">v3.0</div><h1>🚀 CryptoAuto Admin</h1><button style="background:#ef4444;color:white;padding:10px 20px;border:none;border-radius:6px;cursor:pointer;font-weight:600;">Logout</button><div style="margin-top:40px;"><button style="background:#10b981;color:white;padding:12px 20px;border:none;border-radius:6px;cursor:pointer;margin-right:10px;">Portfolio</button><button style="background:transparent;color:#10b981;padding:12px 20px;border:1px solid #10b981;border-radius:6px;cursor:pointer;margin-right:10px;">Settings</button></div><div style="margin-top:40px;"><h2>⚙️ Settings</h2><p>Change Password Form Here</p><input type="password" placeholder="Current password" style="width:100%;padding:10px;margin-bottom:10px;background:rgba(255,255,255,0.1);border:1px solid #10b981;color:white;border-radius:6px;"><input type="password" placeholder="New password" style="width:100%;padding:10px;margin-bottom:10px;background:rgba(255,255,255,0.1);border:1px solid #10b981;color:white;border-radius:6px;"><button style="background:#10b981;color:white;padding:10px 20px;border:none;border-radius:6px;cursor:pointer;">Update</button></div></body></html>', { headers: { 'Content-Type': 'text/html' } });
    }

    if (pathname === '/api/auth/login' && request.method === 'POST') {
      try {
        const { email, password } = await request.json();
        if (email === 'admin@example.com') {
          const match = await bcrypt.compare(password, env.ADMIN_PASSWORD_HASH);
          if (match) {
            const token = jwt.sign({ email }, env.JWT_SECRET, { expiresIn: '7d' });
            return new Response(JSON.stringify({ token }), { headers: { 'Content-Type': 'application/json' } });
          }
        }
        return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
      } catch (e) {
        return new Response(JSON.stringify({ error: 'Error' }), { status: 500 });
      }
    }

    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  }
};
