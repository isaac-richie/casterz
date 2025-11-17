import { createWallet, inAppWallet } from "thirdweb/wallets";
import { client } from "@/app/client";

// Standard Thirdweb wallet configuration
// Thirdweb automatically detects installed wallets (including Phantom)
export const wallets = [
  // In-App Wallet (email + social logins)
  inAppWallet({
    auth: {
      options: ["email", "google", "apple", "facebook"],
    },
  }),
  // EVM Wallets - Thirdweb auto-detects these if installed
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("com.trustwallet.app"),
  // Phantom is auto-detected by Thirdweb if installed
];

// Export the client
export { client };
