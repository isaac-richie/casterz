'use client'

import { useActiveAccount, useActiveWallet } from 'thirdweb/react'

export function useWallet() {
  const account = useActiveAccount()
  const wallet = useActiveWallet()
  
  // Derive state from account instead of using setState in effect
  const isConnected = !!account
  const address = account?.address || null

  const connect = async () => {
    // Thirdweb handles connection via ConnectButton component
    // This function is kept for compatibility
    console.log('Use ConnectButton component for wallet connection')
  }

  const disconnect = async () => {
    if (wallet) {
      await wallet.disconnect()
    }
  }

  const getShortAddress = (addr: string | null) => {
    if (!addr) return ''
    if (addr.length <= 10) return addr
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return {
    isConnected,
    address,
    connect,
    disconnect,
    getShortAddress,
    wallet,
  }
}
