'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  X, 
  CreditCard, 
  CheckCircle, 
  AlertTriangle, 
  Loader2,
  DollarSign,
  Wallet
} from 'lucide-react'
import { useWallet } from '@/hooks/useWallet'
import { Market } from '@/types'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  market: Market | null
  onPaymentSuccess?: (paymentData: { transactionHash?: string; paymentId?: string }) => void
}

export function PaymentModal({ 
  isOpen, 
  onClose, 
  market, 
  onPaymentSuccess 
}: PaymentModalProps) {
  const [amount, setAmount] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [transactionHash, setTransactionHash] = useState<string | null>(null)
  
  const { isConnected, address, connect, getShortAddress } = useWallet()

  const handlePayment = async () => {
    if (!market || !amount || !isConnected) return

    setIsProcessing(true)
    setPaymentStatus('processing')
    setError(null)

    try {
      // Call the payment API
      const response = await fetch('http://localhost:8000/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          marketId: market.id,
          amount: parseFloat(amount),
          walletAddress: address,
        }),
      })

      if (!response.ok) {
        throw new Error('Payment failed')
      }

      const data = await response.json()
      
      setTransactionHash(data.transactionHash)
      setPaymentStatus('success')
      
      if (onPaymentSuccess) {
        onPaymentSuccess(data)
      }

    } catch (error) {
      console.error('Payment error:', error)
      setError('Payment failed. Please try again.')
      setPaymentStatus('error')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClose = () => {
    setAmount('')
    setPaymentStatus('idle')
    setError(null)
    setTransactionHash(null)
    onClose()
  }

  if (!market) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="flex items-center space-x-2">
            <CreditCard className="w-6 h-6 text-blue-600" />
            <span>Purchase Analysis</span>
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Market Info */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
              {market.question}
            </h3>
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
              <span>{market.category}</span>
              <span>{market.current_price}¢</span>
            </div>
          </div>

          {/* Wallet Connection */}
          {!isConnected ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <Wallet className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Connect Your Wallet
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Connect your wallet to purchase AI analysis
                </p>
                <Button
                  onClick={connect}
                  className="w-full polycaster-gradient hover:opacity-90 text-white py-3 px-4 rounded-lg transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                >
                  Connect Wallet
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Connected Wallet */}
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">
                    Wallet Connected
                  </span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {getShortAddress(address || null)}
                </Badge>
              </div>

              {/* Payment Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Analysis Price
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-10"
                    min="0"
                    step="0.01"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Minimum: $1.00
                </p>
              </div>

              {/* Payment Button */}
              <Button
                onClick={handlePayment}
                disabled={!amount || parseFloat(amount) < 1 || isProcessing}
                className="w-full polycaster-gradient hover:opacity-90 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg transition-all duration-200 font-semibold shadow-md hover:shadow-lg disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  `Pay $${amount || '0.00'}`
                )}
              </Button>
            </div>
          )}

          {/* Payment Status */}
          <AnimatePresence>
            {paymentStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800 dark:text-green-200">
                    Payment Successful!
                  </span>
                </div>
                {transactionHash && (
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Transaction: {transactionHash.slice(0, 10)}...{transactionHash.slice(-8)}
                  </p>
                )}
              </motion.div>
            )}

            {paymentStatus === 'error' && error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span className="font-medium text-red-800 dark:text-red-200">
                    Payment Failed
                  </span>
                </div>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  {error}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )
}
