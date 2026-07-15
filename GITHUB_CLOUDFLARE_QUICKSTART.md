# 🚀 GITHUB & CLOUDFLARE QUICKSTART

## Files for GitHub/Cloudflare (8 Core Files)

### Fixed Source Code (Copy to `/src/`)
```
index-FIXED.js              → Copy to src/index.js
signal-engine-FIXED.js      → Copy to src/signal-engine.js
order-manager-FIXED.js      → Copy to src/order-manager.js
admin-dashboard-FIXED.js    → Copy to src/admin.js
```

### Security Modules (Verify exist in `/src/`)
```
auth.js                     ✅ Check it's there
api-keys.js                 ✅ Check it's there
rate-limiter.js             ✅ Check it's there
security.js                 ✅ Check it's there
```

### Landing Page
```
LANDING_PAGE_ENHANCED.html  → Your landing page
```

---

## 🔧 Cloudflare Setup (5 Steps)

### 1. Update wrangler.toml
```toml
[env.production]
vars = { ENVIRONMENT = "production" }

[env.production.secrets]
ADMIN_PASSWORD_HASH = "..." # Generate: openssl dgst -sha256 <<< "password"
STRIPE_SECRET_KEY = "sk_live_..."
STRIPE_WEBHOOK_SECRET = "whsec_..."
CLAUDE_API_KEY = "sk-ant-api03-..."
JWT_SECRET = "..." # Generate: openssl rand -hex 32
```

### 2. Generate Secrets
```bash
# Admin password hash
openssl dgst -sha256 <<< "your_strong_password"

# JWT secret
openssl rand -hex 32
```

### 3. Set Cloudflare Secrets
```bash
wrangler secret put ADMIN_PASSWORD_HASH
wrangler secret put STRIPE_SECRET_KEY
wrangler secret put STRIPE_WEBHOOK_SECRET
wrangler secret put CLAUDE_API_KEY
wrangler secret put JWT_SECRET
```

### 4. Test Locally
```bash
wrangler dev
# Test in another terminal:
curl -X POST http://localhost:8787/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'
```

### 5. Deploy
```bash
wrangler publish --env production
```

---

## 📝 GitHub Setup

### 1. Copy Files to Your Repo
```bash
# Copy fixed source files
cp index-FIXED.js src/index.js
cp signal-engine-FIXED.js src/signal-engine.js
cp order-manager-FIXED.js src/order-manager.js
cp admin-dashboard-FIXED.js src/admin.js

# Verify security modules exist
ls src/auth.js src/api-keys.js src/rate-limiter.js src/security.js

# Copy landing page
cp LANDING_PAGE_ENHANCED.html public/index.html
```

### 2. Commit to GitHub
```bash
git add .
git commit -m "Security hardening: fix 14 critical issues, add auth, rate limiting, validation"
git push origin main
```

### 3. Optional: GitHub Actions
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Cloudflare

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install wrangler
      - run: npm run deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          ADMIN_PASSWORD_HASH: ${{ secrets.ADMIN_PASSWORD_HASH }}
          STRIPE_SECRET_KEY: ${{ secrets.STRIPE_SECRET_KEY }}
```

---

## ✅ Verification Checklist

### GitHub
- [ ] Files copied to `src/`
- [ ] Security modules verified
- [ ] Landing page in place
- [ ] wrangler.toml updated
- [ ] Code committed

### Cloudflare
- [ ] Secrets generated
- [ ] Secrets set with `wrangler secret put`
- [ ] Local test passes (`wrangler dev`)
- [ ] All endpoints respond
- [ ] Admin login works

### Production
- [ ] Deployed: `wrangler publish --env production`
- [ ] Live URL responds
- [ ] Admin accessible
- [ ] No errors in logs

---

## 🔒 Security Checklist

- [ ] Admin password is hashed (not plain text)
- [ ] Password not in URL (POST request only)
- [ ] Rate limiting active (11+ requests = blocked)
- [ ] API keys required for endpoints
- [ ] Input validation on all endpoints
- [ ] CORS headers configured
- [ ] CSRF tokens implemented
- [ ] Stripe webhook verified

---

## 📊 What's Fixed

✅ 14 critical security issues  
✅ Position sizing corrected  
✅ Profit calculations fixed  
✅ Signal deduplication added  
✅ Authentication system  
✅ Rate limiting  
✅ Input validation  
✅ Admin dashboard  
✅ Landing page enhanced  

---

## 📖 Documentation

- `QUICK_REFERENCE_IMPLEMENT_NOW.md` - 5 minute overview
- `AUDIT_AND_FIXES_COMPLETE.md` - Full implementation guide
- `READY_TO_DEPLOY.md` - Deployment checklist

---

## ⏱️ Timeline

| Step | Time |
|------|------|
| Copy files to repo | 5 min |
| Update wrangler.toml | 5 min |
| Generate secrets | 5 min |
| Set secrets | 5 min |
| Test locally | 1 hour |
| Deploy | 30 min |
| **TOTAL** | **~2 hours** |

---

## 🚀 Deploy Command

```bash
# One-line deploy
wrangler publish --env production
```

---

**Ready to deploy!** 🎉

All 8 core files are prepared and ready.
GitHub integration: copy and commit.
Cloudflare deployment: set secrets and publish.
