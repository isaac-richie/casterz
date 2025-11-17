'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Wallet, Zap, Shield, TrendingUp } from 'lucide-react'
import { useActiveAccount } from 'thirdweb/react'
import { ConnectButton } from 'thirdweb/react'
import { client, wallets } from '@/lib/thirdweb'

interface WalletRequirementModalProps {
  isOpen: boolean
  onClose?: () => void
}

export function WalletRequirementModal({ isOpen, onClose }: WalletRequirementModalProps) {
  const account = useActiveAccount()
  const [isWalletConnected, setIsWalletConnected] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setIsWalletConnected(!!account?.address)
    }, 0)
  }, [account])

  const isAnyWalletConnected = isWalletConnected

  // Auto-close when wallet is connected
  useEffect(() => {
    if (isAnyWalletConnected && isOpen && onClose) {
      // Small delay to show connection success
      const timer = setTimeout(() => {
        onClose()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isAnyWalletConnected, isOpen, onClose])

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-900 border-2 border-blue-500/20 shadow-2xl">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-2">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Wallet Connection Required
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600 dark:text-gray-300 space-y-3">
            <p>
              To access all features and get AI-powered market analysis, please connect your wallet.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="font-medium text-blue-900 dark:text-blue-100">AI Market Analysis</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Get intelligent insights and trading signals
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="font-medium text-purple-900 dark:text-purple-100">Secure Payments</p>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    Pay securely with USDC on Solana or EVM chains
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="font-medium text-green-900 dark:text-green-100">Track Your Signals</p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    View your purchase history and performance
                  </p>
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Connection Status */}
          {isAnyWalletConnected && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="font-medium">
                  Wallet connected!
                </span>
              </div>
            </div>
          )}

          {/* Wallet Connection Options */}
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Connect Wallet (EVM or Solana)
              </p>
              <ConnectButton
                client={client}
                wallets={wallets}
                theme="dark"
                connectModal={{
                  size: "wide",
                  title: "Connect Wallet",
                  showThirdwebBranding: false,
                  welcomeScreen: {
                    title: "Welcome to PolyCaster",
                    subtitle: "Connect with email or wallet (EVM or Solana supported)",
                  },
                }}
                connectButton={{
                  label: "Connect Wallet",
                  className: "w-full polycaster-gradient hover:opacity-90 text-white font-medium px-4 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg",
                }}
              />
            </div>
          </div>

          {/* Info Note */}
          <p className="text-xs text-center text-gray-500 dark:text-gray-400 pt-2">
            💡 You can browse markets without connecting, but wallet connection is required for AI analysis and purchases.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

