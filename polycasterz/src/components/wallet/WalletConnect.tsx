'use client'

import { ConnectButton } from 'thirdweb/react'
import { client, wallets } from '@/lib/thirdweb'

export function WalletConnect() {
  return (
    <div className="flex flex-col gap-2 sm:gap-3 w-full">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center w-full">
        {/* Thirdweb Connect Button - Supports both EVM and Solana */}
        <div className="w-full">
          <ConnectButton
            client={client}
            wallets={wallets}
            theme="dark"
            connectModal={{
              size: "wide",
              title: "Connect Wallet",
              titleIcon: "",
              showThirdwebBranding: false,
              welcomeScreen: {
                title: "Welcome to PolyCaster",
                subtitle: "Connect with email or wallet (EVM or Solana supported)",
              },
            }}
            connectButton={{
              label: "Connect Wallet",
              className: "polycaster-gradient hover:opacity-90 text-white font-medium px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg transition-all duration-200 shadow-md hover:shadow-lg w-full",
            }}
          />
        </div>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center sm:text-left px-1">
        💡 <strong>Connect your wallet</strong> (EVM or Solana) to get started with AI-powered market analysis.
      </p>
    </div>
  )
}

export function WalletConnectButton() {
  return (
    <ConnectButton
      client={client}
      wallets={wallets}
      theme="dark"
      connectModal={{
        size: "wide",
        title: "Connect Your Account",
        titleIcon: "",
        showThirdwebBranding: false,
        welcomeScreen: {
          title: "Welcome to PolyCaster",
          subtitle: "Connect with email or wallet to get started",
        },
      }}
      connectButton={{
        label: "Connect",
        className: "polycaster-gradient hover:opacity-90 text-white font-medium px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2 w-full sm:w-auto",
      }}
    />
  )
}

export function WalletConnectCompact() {
  return (
    <ConnectButton
      client={client}
      wallets={wallets}
      theme="dark"
      connectModal={{
        size: "wide",
        title: "Connect Your Account",
        titleIcon: "",
        showThirdwebBranding: false,
        welcomeScreen: {
          title: "Welcome to PolyCaster",
          subtitle: "Connect with email or wallet to get started",
        },
      }}
      connectButton={{
        label: "",
        className: "polycaster-gradient hover:opacity-90 text-white font-medium px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg",
      }}
    />
  )
}
