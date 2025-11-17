# 🔧 Facilitator Frameworks Used

## **Overview**

PolyCaster uses **two different facilitator frameworks** depending on the blockchain:

---

## **1. EVM Chains (Base Sepolia)** 🔵

### **Framework: Thirdweb X402 Facilitator**

**Location**: `backend-ts/src/services/facilitator.ts`

**Package**: `thirdweb/x402`

**Implementation**:
```typescript
import { facilitator, settlePayment } from 'thirdweb/x402'
import { createThirdwebClient } from 'thirdweb'
import { baseSepolia } from 'thirdweb/chains'

// Create facilitator instance
this.thirdwebFacilitator = facilitator({
  client: this.client,
  serverWalletAddress: serverWallet || '',
  waitUntil: 'confirmed',
})

// Settle payment
const result = await settlePayment({
  resourceUrl,
  method: 'GET',
  paymentData,
  payTo: process.env.SERVER_WALLET_ADDRESS,
  network: baseSepolia,
  price,
  facilitator: this.thirdwebFacilitator,
})
```

**Configuration**:
- **Chain**: Base Sepolia (Testnet)
- **Token**: USDC (`0x036CbD53842c5426634e7929541eC2318f3dCF7e`)
- **Price**: $0.20 (200,000 with 6 decimals)
- **Credentials**: `THIRDWEB_SECRET_KEY` or `NEXT_PUBLIC_THIRDWEB_CLIENT_ID`

**Documentation**: [Thirdweb X402](https://portal.thirdweb.com/x402)

---

## **2. Solana** 🟣

### **Framework: Thirdweb X402 Facilitator**

**Location**: `backend-ts/src/services/facilitator.ts`

**Package**: `thirdweb/x402`

**Implementation**:
```typescript
import { facilitator, settlePayment } from 'thirdweb/x402'

// Create Solana facilitator instance
this.solanaFacilitator = facilitator({
  client: this.client,
  serverWalletAddress: solanaServerWallet || '',
  waitUntil: 'confirmed',
})

// Settle payment
const result = await settlePayment({
  resourceUrl,
  method: 'GET',
  paymentData,
  payTo: process.env.SOLANA_SERVER_WALLET,
  network: 'solana', // Solana is specified as a string
  price,
  facilitator: this.solanaFacilitator,
})
```

**Configuration**:
- **Chain**: Solana Mainnet
- **Token**: USDC (`EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`)
- **Price**: $0.20 (200,000 with 6 decimals)
- **Credentials**: `THIRDWEB_SECRET_KEY` or `NEXT_PUBLIC_THIRDWEB_CLIENT_ID`
- **Server Wallet**: `SOLANA_SERVER_WALLET` environment variable

**Documentation**: [Thirdweb X402 Solana Support](https://portal.thirdweb.com/x402)

---

## **Current Payment Flow**

### **Important Note** ⚠️

**Currently, the frontend sends direct on-chain transactions** (not through facilitator settlement):

1. **EVM**: Frontend sends USDC transfer directly via Thirdweb SDK
2. **Solana**: Frontend sends USDC transfer directly via Solana Wallet Adapter

The **facilitator frameworks are set up** but are **not actively used** in the current payment flow. Instead:

- ✅ **Frontend**: Sends direct token transfers
- ✅ **Backend**: Verifies transactions on-chain
- ✅ **Backend**: Provides analysis after verification

### **Why This Approach?**

1. **Simpler Implementation**: Direct transfers are easier to implement
2. **Better UX**: Users see transaction in their wallet immediately
3. **On-Chain Verification**: Backend verifies transactions are real
4. **No Facilitator Dependency**: Works without facilitator API calls

---

## **Facilitator vs Direct Transfer**

### **Using Facilitator (X402 Protocol)**
```
User → Facilitator API → Payment Settlement → Resource Access
```

**Pros**:
- ✅ Standardized X402 protocol
- ✅ Built-in payment verification
- ✅ Supports multiple payment methods

**Cons**:
- ❌ Requires facilitator API calls
- ❌ Additional dependency
- ❌ More complex flow

### **Current Approach (Direct Transfer)**
```
User → Direct Token Transfer → On-Chain Verification → Resource Access
```

**Pros**:
- ✅ Simpler implementation
- ✅ Direct user control
- ✅ No facilitator dependency
- ✅ Works with any wallet

**Cons**:
- ❌ Manual verification needed
- ❌ Not using X402 standard

---

## **Environment Variables**

### **EVM (Thirdweb)**
```env
# Required
THIRDWEB_SECRET_KEY=your_secret_key
# OR
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id

SERVER_WALLET_ADDRESS=0xYourEVMWalletAddress
```

### **Solana (Thirdweb)**
```env
# Required
THIRDWEB_SECRET_KEY=your_secret_key
# OR
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id

SOLANA_SERVER_WALLET=YourSolanaWalletAddress
```

---

## **Summary**

| Chain | Facilitator Framework | Status | Used in Flow? |
|-------|----------------------|--------|---------------|
| **EVM** | Thirdweb X402 | ✅ Configured | ❌ Not used (direct transfers) |
| **Solana** | Thirdweb X402 | ✅ Configured | ❌ Not used (direct transfers) |

**Current Implementation**: Direct on-chain token transfers with backend verification

**Facilitator Status**: Set up and ready, but not actively used in payment flow

---

**Last Updated**: Today  
**Status**: ✅ Unified Thirdweb X402 facilitator for both EVM and Solana, direct transfers in use


