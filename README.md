# CryptoAuto - AI-Powered Crypto Trading

Passive income from automated crypto trading powered by AI. 

## 🚀 Quick Start

### Local Development
```bash
npm install
npm run dev
```

Visit `http://localhost:8787` in your browser.

### Deploy to Cloudflare
```bash
# Development
npm run deploy

# Production
npm run deploy:prod
```

## 📁 Project Structure

```
├── src/
│   ├── index.js                 # Main worker entry point
│   ├── signal-engine.js         # Trading signal generation
│   ├── order-manager.js         # Order execution
│   ├── admin.js                 # Admin dashboard
│   ├── risk-manager.js          # Risk management
│   ├── auth.js                  # JWT authentication
│   ├── api-keys.js              # API key management
│   ├── rate-limiter.js          # Rate limiting
│   ├── security.js              # Input validation & CORS
│   ├── pricing.js               # Pricing tiers
│   ├── revenue-tracker.js       # Revenue tracking
│   └── [other modules]
├── public/
│   └── index.html               # Landing page
├── wrangler.toml               # Cloudflare config
├── package.json                # npm config
└── README.md                   # This file
```

## 🔧 Configuration

### wrangler.toml
Update these values:
- `account_id` - Your Cloudflare Account ID
- `zone_id` - Your domain zone ID
- `route` - Your production domain

### Environment Variables
Set these secrets via `wrangler secret put`:

```bash
wrangler secret put ADMIN_PASSWORD_HASH
wrangler secret put STRIPE_SECRET_KEY
wrangler secret put STRIPE_WEBHOOK_SECRET
wrangler secret put CLAUDE_API_KEY
wrangler secret put JWT_SECRET
```

Generate secrets:
```bash
# Admin password hash
openssl dgst -sha256 <<< "your_password"

# JWT secret
openssl rand -hex 32
```

### KV Namespace
Create two KV namespaces:
- `STATE` - Application state
- `REVENUE_DATA` - Revenue tracking

Add their IDs to `wrangler.toml`.

## 🔐 Security Features

✅ JWT authentication  
✅ API key management with hashing  
✅ Rate limiting (DDoS protection)  
✅ Input validation  
✅ CORS headers  
✅ CSRF protection  
✅ Password hashing  
✅ Stripe webhook verification  

## 📊 API Endpoints

### Public
- `GET /` - Landing page
- `GET /pricing` - Pricing information
- `POST /webhook/stripe` - Stripe webhook

### Admin
- `POST /admin/login` - Admin login (JWT)
- `GET /admin` - Admin dashboard

### Authenticated (API Key Required)
- `GET /api/portfolio` - Portfolio stats
- `POST /api/execute-trade` - Execute trade signal

## 🚀 Deploy to Cloudflare

1. **Install Wrangler**
   ```bash
   npm install -g wrangler
   ```

2. **Authenticate**
   ```bash
   wrangler login
   ```

3. **Update wrangler.toml**
   - Add your Cloudflare Account ID
   - Add your Zone ID
   - Create KV namespaces and add IDs

4. **Set Secrets**
   ```bash
   wrangler secret put ADMIN_PASSWORD_HASH
   wrangler secret put STRIPE_SECRET_KEY
   wrangler secret put STRIPE_WEBHOOK_SECRET
   wrangler secret put CLAUDE_API_KEY
   wrangler secret put JWT_SECRET
   ```

5. **Deploy**
   ```bash
   npm run deploy:prod
   ```

## 📝 License

MIT

## 🤝 Support

For issues and questions, open a GitHub issue.
