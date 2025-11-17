# Vercel Environment Variables - Complete List

## 🎯 FRONTEND (Next.js) - Public Variables

These variables are exposed to the browser (must start with `NEXT_PUBLIC_`):

```bash
NEXT_PUBLIC_API_URL=https://your-backend-api.vercel.app
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
NEXT_PUBLIC_SERVER_WALLET=0x2983D066D42a79295dFAC0F752EA2FA7940C33dA
```

---

## 🔒 BACKEND API - Server Variables

These are server-side only (NOT exposed to browser):

### Database (Supabase) - REQUIRED
```bash
SUPABASE_URL=https://jejfuksuzmsvqmgweopi.supabase.co
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
```

### AI Service (OpenAI) - REQUIRED
```bash
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4o-mini
```

### Email Service (Resend) - REQUIRED
```bash
RESEND_API_KEY=re_...
EMAIL_FROM=onboarding@resend.dev
EMAIL_FROM_NAME=PolyCaster
```

### Payment & Blockchain (BNB Chain / BSC) - REQUIRED
```bash
THIRDWEB_SECRET_KEY=your_thirdweb_secret_key
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
SERVER_WALLET_ADDRESS=0x2983D066D42a79295dFAC0F752EA2FA7940C33dA
PAYMENT_RECIPIENT_WALLET=0x2983D066D42a79295dFAC0F752EA2FA7940C33dA
BNB_RPC_URL=https://public-bsc-mainnet.fastnode.io
USDC_CONTRACT_ADDRESS=0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d
MIN_PAYMENT_AMOUNT=0.3
```

**Note:** BNB Chain USDC uses **18 decimals** (not 6!)

### External APIs - OPTIONAL (has defaults)
```bash
POLYMARKET_API_URL=https://gamma-api.polymarket.com/markets
```

### Server Configuration - REQUIRED
```bash
FRONTEND_URL=https://your-frontend.vercel.app
PORT=8000
NODE_ENV=production
```

---

## 📋 Quick Copy-Paste Format

### Frontend (3 variables):
```
NEXT_PUBLIC_API_URL=https://your-backend-api.vercel.app
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
NEXT_PUBLIC_SERVER_WALLET=0x2983D066D42a79295dFAC0F752EA2FA7940C33dA
```

### Backend (17 variables):
```
SUPABASE_URL=https://jejfuksuzmsvqmgweopi.supabase.co
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4o-mini
RESEND_API_KEY=re_...
EMAIL_FROM=onboarding@resend.dev
EMAIL_FROM_NAME=PolyCaster
THIRDWEB_SECRET_KEY=your_thirdweb_secret_key
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
SERVER_WALLET_ADDRESS=0x2983D066D42a79295dFAC0F752EA2FA7940C33dA
PAYMENT_RECIPIENT_WALLET=0x2983D066D42a79295dFAC0F752EA2FA7940C33dA
BASE_RPC_URL=https://sepolia.base.org
USDC_CONTRACT_ADDRESS=0x036CbD53842c5426634e7929541eC2318f3dCF7e
MIN_PAYMENT_AMOUNT=0.3
POLYMARKET_API_URL=https://gamma-api.polymarket.com/markets
FRONTEND_URL=https://your-frontend.vercel.app
PORT=8000
NODE_ENV=production
```

---

## ⚠️ Important Notes

1. **Replace placeholders** like `your_thirdweb_client_id` with actual values
2. **Set `FRONTEND_URL`** to your actual frontend Vercel URL (after frontend deploys)
3. **Set `NEXT_PUBLIC_API_URL`** to your actual backend Vercel URL (after backend deploys)
4. **All API keys** must be replaced with real values from your service providers
5. **Set environment** to "Production" when adding variables in Vercel
6. **Base Sepolia**: The project is configured for Base Sepolia testnet (not mainnet)

---

## 🚀 Deployment Order

1. **Deploy Backend First**
   - Copy all backend variables
   - Paste into Backend Project → Environment Variables
   - Deploy
   - Copy the backend URL (e.g., `https://polycaster-backend.vercel.app`)

2. **Deploy Frontend**
   - Copy frontend variables
   - Replace `https://your-backend-api.vercel.app` with actual backend URL
   - Paste into Frontend Project → Environment Variables
   - Deploy
   - Copy the frontend URL (e.g., `https://polycaster-frontend.vercel.app`)

3. **Update Backend `FRONTEND_URL`**
   - Go back to Backend Project → Environment Variables
   - Update `FRONTEND_URL` with the frontend URL from step 2
   - Redeploy backend

---

## 📝 Variable Descriptions

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | ✅ Yes | - |
| `NEXT_PUBLIC_THIRDWEB_CLIENT_ID` | Thirdweb client ID | ✅ Yes | - |
| `NEXT_PUBLIC_SERVER_WALLET` | Server wallet address | ⚠️ Optional | `0x2983D066D42a79295dFAC0F752EA2FA7940C33dA` |
| `SUPABASE_URL` | Supabase project URL | ✅ Yes | `https://jejfuksuzmsvqmgweopi.supabase.co` |
| `SUPABASE_KEY` | Supabase anon key | ✅ Yes | - |
| `SUPABASE_SERVICE_KEY` | Supabase service role key | ✅ Yes | - |
| `OPENAI_API_KEY` | OpenAI API key | ✅ Yes | - |
| `OPENAI_MODEL` | OpenAI model | ⚠️ Optional | `gpt-4o-mini` |
| `RESEND_API_KEY` | Resend API key | ✅ Yes | - |
| `EMAIL_FROM` | Email sender address | ⚠️ Optional | `onboarding@resend.dev` |
| `EMAIL_FROM_NAME` | Email sender name | ⚠️ Optional | `PolyCaster` |
| `THIRDWEB_SECRET_KEY` | Thirdweb secret key | ✅ Yes | - |
| `SERVER_WALLET_ADDRESS` | Server wallet for payments | ⚠️ Optional | `0x2983D066D42a79295dFAC0F752EA2FA7940C33dA` |
| `PAYMENT_RECIPIENT_WALLET` | Payment recipient wallet | ⚠️ Optional | Same as `SERVER_WALLET_ADDRESS` |
| `BASE_RPC_URL` | Base Sepolia RPC endpoint | ⚠️ Optional | `https://sepolia.base.org` |
| `USDC_CONTRACT_ADDRESS` | USDC on Base Sepolia | ⚠️ Optional | `0x036CbD53842c5426634e7929541eC2318f3dCF7e` |
| `MIN_PAYMENT_AMOUNT` | Minimum payment | ⚠️ Optional | `0.3` |
| `POLYMARKET_API_URL` | Polymarket API | ⚠️ Optional | `https://gamma-api.polymarket.com/markets` |
| `FRONTEND_URL` | Frontend URL for CORS | ✅ Yes | - |
| `PORT` | Server port | ⚠️ Optional | `8000` (Vercel sets automatically) |
| `NODE_ENV` | Environment mode | ⚠️ Optional | `production` |

---

## ✅ Checklist

### Backend Variables (17)
- [ ] SUPABASE_URL
- [ ] SUPABASE_KEY
- [ ] SUPABASE_SERVICE_KEY
- [ ] OPENAI_API_KEY
- [ ] OPENAI_MODEL
- [ ] RESEND_API_KEY
- [ ] EMAIL_FROM
- [ ] EMAIL_FROM_NAME
- [ ] THIRDWEB_SECRET_KEY
- [ ] NEXT_PUBLIC_THIRDWEB_CLIENT_ID
- [ ] SERVER_WALLET_ADDRESS
- [ ] PAYMENT_RECIPIENT_WALLET
- [ ] BASE_RPC_URL
- [ ] USDC_CONTRACT_ADDRESS
- [ ] MIN_PAYMENT_AMOUNT
- [ ] POLYMARKET_API_URL
- [ ] FRONTEND_URL (set after frontend deploys)
- [ ] PORT (optional, Vercel sets automatically)
- [ ] NODE_ENV (optional, defaults to production)

### Frontend Variables (3)
- [ ] NEXT_PUBLIC_API_URL (set after backend deploys)
- [ ] NEXT_PUBLIC_THIRDWEB_CLIENT_ID
- [ ] NEXT_PUBLIC_SERVER_WALLET (optional)

---

## 🔗 After Deployment

1. Test backend health: `https://your-backend.vercel.app/health`
2. Test frontend loads without errors
3. Test API connection from frontend
4. Test payment flow
5. Test email verification
6. Test AI analysis


