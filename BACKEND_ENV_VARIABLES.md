# 🔐 Backend Environment Variables for Deployment

Complete list of all environment variables required for backend deployment on Vercel.

---

## 📋 Required Environment Variables

### 🌐 **Core Configuration**

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NODE_ENV` | ✅ Yes | Environment mode | `production` |
| `PORT` | ⚠️ Optional | Server port (Vercel auto-assigns) | `8000` |
| `FRONTEND_URL` | ✅ Yes | Frontend deployment URL (for CORS) | `https://your-frontend.vercel.app` |

---

### 🗄️ **Database (Supabase)**

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `SUPABASE_URL` | ✅ Yes | Supabase project URL | `https://xxxxx.supabase.co` |
| `SUPABASE_KEY` | ✅ Yes | Supabase anon/public key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_SERVICE_KEY` | ✅ Yes | Supabase service role key (for admin operations) | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

**Note:** `SUPABASE_SERVICE_KEY` takes precedence over `SUPABASE_KEY` if both are set.

---

### 🤖 **AI Service (OpenAI)**

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `OPENAI_API_KEY` | ✅ Yes | OpenAI API key for AI analysis | `sk-proj-xxxxx...` |
| `OPENAI_MODEL` | ⚠️ Optional | OpenAI model to use | `gpt-4o-mini` (default) |

**Available Models:**
- `gpt-4o-mini` (default, recommended)
- `gpt-4o`
- `gpt-3.5-turbo`
- `gpt-5-nano` (experimental)

---

### 📧 **Email Service (Resend)**

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `RESEND_API_KEY` | ✅ Yes | Resend API key for email notifications | `re_xxxxx...` |
| `EMAIL_FROM` | ⚠️ Optional | Sender email address | `alerts@polycaster.com` |
| `EMAIL_FROM_NAME` | ⚠️ Optional | Sender display name | `PolyCaster` |

**Note:** For testing, use `onboarding@resend.dev` (pre-verified by Resend).

---

### 💳 **EVM Payment (Thirdweb - BNB Chain / BSC)**

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_THIRDWEB_CLIENT_ID` | ✅ Yes | Thirdweb client ID (public) | `your_client_id` |
| `THIRDWEB_SECRET_KEY` | ✅ Yes | Thirdweb secret key (private) | `your_secret_key` |
| `SERVER_WALLET_ADDRESS` | ✅ Yes | EVM wallet address to receive payments | `0x2983D066D42a79295dFAC0F752EA2FA7940C33dA` |
| `BNB_RPC_URL` | ✅ Yes | BNB Chain RPC endpoint | `https://public-bsc-mainnet.fastnode.io` |
| `USDC_CONTRACT_ADDRESS` | ⚠️ Optional | USDC contract on BNB Chain | `0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d` (default) |
| `PRIVATE_KEY` | ✅ Yes | Private key for server wallet (for signing) | `0x...` (keep secret!) |

**Note:** 
- BNB Chain USDC uses **18 decimals** (not 6!)
- Payment amount: 0.3 USDC = `300000000000000000` wei
- Chain ID: `56` (BNB Chain Mainnet)

**Alternative Variable Names:**
- `PAYMENT_RECIPIENT_WALLET` can be used instead of `SERVER_WALLET_ADDRESS`

---

### 🪙 **Solana Payment (Thirdweb X402)**

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `SOLANA_SERVER_WALLET` | ✅ Yes | Solana wallet address to receive payments | `YourSolanaWalletAddress...` |
| `SOLANA_RPC_URL` | ⚠️ Optional | Solana RPC endpoint | `https://api.mainnet-beta.solana.com` (default) |
| `SOLANA_PRIVATE_KEY` | ⚠️ Optional | Solana private key (base58 format) | `your_base58_private_key` |

**Note:** 
- Uses the same `THIRDWEB_SECRET_KEY` or `NEXT_PUBLIC_THIRDWEB_CLIENT_ID` as EVM payments
- If `SOLANA_SERVER_WALLET` is not set, Solana payments will be disabled
- Thirdweb X402 facilitator handles both EVM and Solana payments

---

### 📊 **Polymarket API**

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `POLYMARKET_API_URL` | ⚠️ Optional | Polymarket API endpoint | `https://gamma-api.polymarket.com/markets` (default) |

---

## 📝 **Complete .env Example**

```env
# ============================================
# Core Configuration
# ============================================
NODE_ENV=production
PORT=8000
FRONTEND_URL=https://your-frontend.vercel.app

# ============================================
# Database (Supabase)
# ============================================
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ============================================
# AI Service (OpenAI)
# ============================================
OPENAI_API_KEY=sk-proj-xxxxx...
OPENAI_MODEL=gpt-4o-mini

# ============================================
# Email Service (Resend)
# ============================================
RESEND_API_KEY=re_xxxxx...
EMAIL_FROM=alerts@polycaster.com
EMAIL_FROM_NAME=PolyCaster

# ============================================
# EVM Payment (Thirdweb - Base Sepolia)
# ============================================
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id
THIRDWEB_SECRET_KEY=your_secret_key
SERVER_WALLET_ADDRESS=0x2983D066D42a79295dFAC0F752EA2FA7940C33dA
BASE_RPC_URL=https://sepolia.base.org
USDC_CONTRACT_ADDRESS=0x036CbD53842c5426634e7929541eC2318f3dCF7e
PRIVATE_KEY=0x...

# ============================================
# Solana Payment
# ============================================
SOLANA_SERVER_WALLET=YourSolanaWalletAddress...
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_FACILITATOR_URL=https://facilitator.payai.network
SOLANA_PRIVATE_KEY=your_base58_private_key

# ============================================
# Polymarket API
# ============================================
POLYMARKET_API_URL=https://gamma-api.polymarket.com/markets
```

---

## 🚀 **Vercel Deployment Steps**

### 1. **Add Environment Variables in Vercel**

1. Go to your **Backend Project** → **Settings** → **Environment Variables**
2. Add each variable from the list above
3. Select **Production** environment (and optionally **Preview** and **Development**)

### 2. **Important Notes**

- ✅ **Never commit** `.env` files to Git
- ✅ **Use Vercel Environment Variables** for all secrets
- ✅ **Set `FRONTEND_URL`** after frontend deployment (use placeholder initially)
- ✅ **Keep private keys secure** - never expose in logs or client-side code
- ✅ **Use different keys** for production vs development

### 3. **Variable Priority**

Some variables have fallbacks or alternatives:

- `SUPABASE_SERVICE_KEY` > `SUPABASE_KEY` (if both set, service key is used)
- `SERVER_WALLET_ADDRESS` = `PAYMENT_RECIPIENT_WALLET` (either works)
- `THIRDWEB_SECRET_KEY` > `NEXT_PUBLIC_THIRDWEB_CLIENT_ID` (secret key preferred)

---

## ⚠️ **Security Checklist**

Before deploying to production:

- [ ] All required variables are set
- [ ] `FRONTEND_URL` matches your actual frontend URL
- [ ] Private keys are secure (not in Git)
- [ ] `NODE_ENV=production` is set
- [ ] Supabase RLS policies are configured
- [ ] Email domain is verified in Resend
- [ ] Server wallets have sufficient balance
- [ ] CORS is properly configured

---

## 🔍 **Verification**

After deployment, test these endpoints:

```bash
# Health check
curl https://your-backend.vercel.app/health

# Should return:
# {
#   "status": "healthy",
#   "services": {
#     "api": "running",
#     "polymarket": "healthy",
#     "ai_engine": "healthy",
#     "facilitator": "healthy",
#     "database": "healthy"
#   }
# }
```

---

## 📚 **Additional Resources**

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Supabase Documentation](https://supabase.com/docs)
- [OpenAI API Keys](https://platform.openai.com/api-keys)
- [Resend Documentation](https://resend.com/docs)
- [Thirdweb Documentation](https://portal.thirdweb.com)

---

Made with ❤️ by the PolyCaster Team
