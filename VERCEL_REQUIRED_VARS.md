# Required Environment Variables for Vercel

## 🔴 CRITICAL - Must Set (No Working Defaults)

These **MUST** be set in Vercel or the app won't work:

### Backend API (Required)
```bash
# Database - CRITICAL
SUPABASE_URL=https://jejfuksuzmsvqmgweopi.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

# AI Service - CRITICAL
OPENAI_API_KEY=sk-proj-...

# Email Service - CRITICAL
RESEND_API_KEY=re_...

# Payment Processing - CRITICAL
THIRDWEB_SECRET_KEY=your_thirdweb_secret_key

# CORS & Email Links - CRITICAL
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (Required)
```bash
# API Connection - CRITICAL
NEXT_PUBLIC_API_URL=https://your-backend-api.vercel.app

# Thirdweb - CRITICAL
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
```

---

## 🟡 IMPORTANT - Should Set (Have Defaults But May Not Work)

These have defaults but should be set explicitly:

### Backend
```bash
# Database (has default URL but should set key)
SUPABASE_KEY=your_supabase_anon_key

# AI Model (has default but should set)
OPENAI_MODEL=gpt-4o-mini

# Email (has defaults but should verify)
EMAIL_FROM=onboarding@resend.dev
EMAIL_FROM_NAME=PolyCaster

# Payment Wallet (has default but should set)
SERVER_WALLET_ADDRESS=0x2983D066D42a79295dFAC0F752EA2FA7940C33dA
PAYMENT_RECIPIENT_WALLET=0x2983D066D42a79295dFAC0F752EA2FA7940C33dA

# Blockchain (has defaults but should verify)
BNB_RPC_URL=https://public-bsc-mainnet.fastnode.io
USDC_CONTRACT_ADDRESS=0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d
MIN_PAYMENT_AMOUNT=0.3

# Note: BNB Chain USDC uses 18 decimals (not 6!)
```

### Frontend
```bash
# Optional but recommended
NEXT_PUBLIC_SERVER_WALLET=0x2983D066D42a79295dFAC0F752EA2FA7940C33dA
```

---

## 🟢 OPTIONAL - Have Working Defaults

These will work with defaults but can be customized:

### Backend
```bash
# External APIs (have production defaults)
POLYMARKET_API_URL=https://gamma-api.polymarket.com/markets

# Server Config (Vercel sets automatically)
PORT=8000
NODE_ENV=production
```

---

## 📋 Quick Checklist

### Backend API - Minimum Required (6 variables)
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_SERVICE_KEY`
- [ ] `OPENAI_API_KEY`
- [ ] `RESEND_API_KEY`
- [ ] `THIRDWEB_SECRET_KEY`
- [ ] `FRONTEND_URL`

### Frontend - Minimum Required (2 variables)
- [ ] `NEXT_PUBLIC_API_URL`
- [ ] `NEXT_PUBLIC_THIRDWEB_CLIENT_ID`

### Backend API - Recommended (8 more)
- [ ] `SUPABASE_KEY`
- [ ] `OPENAI_MODEL`
- [ ] `EMAIL_FROM`
- [ ] `EMAIL_FROM_NAME`
- [ ] `SERVER_WALLET_ADDRESS`
- [ ] `PAYMENT_RECIPIENT_WALLET`
- [ ] `BASE_RPC_URL`
- [ ] `USDC_CONTRACT_ADDRESS`

---

## 🎯 Summary

**Minimum to Deploy:**
- Backend: 6 required variables
- Frontend: 2 required variables

**Total Minimum: 8 variables**

**Recommended:**
- Backend: 14 variables
- Frontend: 3 variables

**Total Recommended: 17 variables**

---

## ⚠️ Important Notes

1. **FRONTEND_URL** is required for:
   - CORS security (blocks unauthorized origins)
   - Email link generation (alerts, verification)

2. **SUPABASE_SERVICE_KEY** is required for:
   - Database admin operations
   - Creating/updating records
   - Alert checker service

3. **All API keys** are required for their respective services to work

4. **NEXT_PUBLIC_API_URL** must be set AFTER backend deploys (use the backend's Vercel URL)

