'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Brain, 
  TrendingUp, 
  Target, 
  AlertTriangle,
  CheckCircle,
  DollarSign,
  BarChart3,
  Zap,
  CreditCard,
  Loader2,
  Activity
} from 'lucide-react'
import { MarketAnalysis, Signal } from '@/types'
import { cn, formatPrice } from '@/lib/utils'
import { useWallet } from '@/hooks/useWallet'
import { ConnectButton, useActiveAccount, useSendTransaction } from 'thirdweb/react'
import { client, wallets } from '@/lib/thirdweb'
import { getContract, prepareContractCall } from 'thirdweb'
import { bsc } from 'thirdweb/chains'
import { getWalletChainType } from '@/lib/wallet-utils'

interface FacilitatorProps {
  marketId: string
  marketQuestion: string
  onAnalysisComplete?: (analysis: MarketAnalysis) => void
  className?: string
}

export function Facilitator({ 
  marketId, 
  marketQuestion, 
  onAnalysisComplete,
  className 
}: FacilitatorProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<MarketAnalysis | null>(null)
  const [signals, setSignals] = useState<Signal[]>([])
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [paymentRequired, setPaymentRequired] = useState(false)
  const [paymentData, setPaymentData] = useState<string | null>(null)
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false)
  
  const { isConnected, address } = useWallet()
  const account = useActiveAccount()
  const { mutateAsync: sendTransaction } = useSendTransaction()
  const queryClient = useQueryClient()
  
  // Detect wallet type (Thirdweb handles both EVM and Solana)
  const walletChainType = getWalletChainType(address || account?.address)
  const isEVMWallet = walletChainType === 'evm'
  
  // Payment Configuration (Thirdweb handles both EVM and Solana)
  // BNB Chain USDC: 0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d (18 decimals)
  const USDC_ADDRESS = '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d'
  const SERVER_WALLET = process.env.NEXT_PUBLIC_SERVER_WALLET || '0xYourServerWalletAddress'
  const PAYMENT_AMOUNT = '300000000000000000' // 0.3 USDC (18 decimals on BNB Chain)

  const handleAnalysis = async () => {
    // Require wallet connection for payment (Thirdweb handles both EVM and Solana)
    const hasWallet = isConnected && account
    
    if (!hasWallet) {
      setError('Please connect your wallet (EVM or Solana) to analyze markets.')
      return
    }

    setIsAnalyzing(true)
    setError(null)
    setProgress(0)

    try {
      // Use API URL from env or default to localhost
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      
      // First, try to get analysis without payment (will return 402 if payment required)
      const response = await fetch(`${API_URL}/ai/analyze/${marketId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_verified: false, // Always start with false to trigger payment flow
          user_wallet: address || account?.address || undefined,
        }),
      })

      if (response.status === 402) {
        // Payment required
        setPaymentRequired(true)
        setIsAnalyzing(false)
        return
      }

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const data = await response.json()
      
      if (data.success && data.signal) {
        // Convert backend signal to frontend analysis format
        const analysis: MarketAnalysis = {
          marketId: marketId,
          analysis: data.signal.raw_analysis || data.signal.reasoning,
          confidence: data.signal.confidence_score,
          recommendation: data.signal.recommendation,
          priceTarget: data.signal.price_target,
          riskLevel: data.signal.risk_level,
          reasoning: [data.signal.reasoning],
          createdAt: data.signal.created_at
        }
        
        setAnalysis(analysis)
        setSignals([data.signal])
        setIsAnalyzing(false)
        
        // Invalidate signals query to update history page
        if (account?.address) {
          queryClient.invalidateQueries({ queryKey: ['signals', account.address] })
        }
        
        if (onAnalysisComplete) {
          onAnalysisComplete(analysis)
        }
      } else {
        throw new Error(data.error || 'Analysis failed')
      }

    } catch (error) {
      console.error('Analysis error:', error)
      setError('Failed to analyze market. Please try again.')
      setIsAnalyzing(false)
      setProgress(0)
    }
  }

  const handlePayment = async () => {
    // Check wallet connection
    if (isEVMWallet && !account) {
      setError('Please connect your EVM wallet first')
      return
    }
    

    setIsPaymentProcessing(true)
    setError(null)

    try {
      // Use EVM payment handler (Thirdweb handles both EVM and Solana)
      await handleEVMPayment()
    } catch (error) {
      console.error('❌ Payment error:', error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      
      // User-friendly error messages
      if (errorMessage.includes('user rejected') || errorMessage.includes('User rejected')) {
        setError('Transaction rejected. Please try again.')
      } else if (errorMessage.includes('insufficient funds') || errorMessage.includes('insufficient')) {
        setError('Insufficient USDC balance. You need 0.3 USDC.')
      } else {
        setError(`Payment failed: ${errorMessage || 'Unknown error'}`)
      }
      
      setIsPaymentProcessing(false)
    }
  }

  const handleEVMPayment = async () => {
    if (!account) {
      throw new Error('EVM wallet not connected')
    }

    console.log('🔄 Starting EVM USDC payment...')
    console.log('From:', account.address)
    console.log('To:', SERVER_WALLET)
    console.log('Amount:', PAYMENT_AMOUNT, '(0.3 USDC)')

    // Get USDC contract
    const usdcContract = getContract({
      client,
      chain: bsc,
      address: USDC_ADDRESS
    })

    // Prepare USDC transfer transaction
    const transaction = prepareContractCall({
      contract: usdcContract,
      method: 'function transfer(address to, uint256 amount) returns (bool)',
      params: [SERVER_WALLET, BigInt(PAYMENT_AMOUNT)]
    })

    console.log('📝 Transaction prepared, waiting for user signature...')

    // Send transaction (MetaMask will pop up)
    const result = await sendTransaction(transaction)
    
    console.log('✅ Transaction sent! Hash:', result.transactionHash)
    console.log('⏳ Waiting for confirmation...')

    setPaymentData(result.transactionHash)
    setPaymentRequired(false)
    
    console.log('🎉 Payment confirmed on-chain!')
    
    // Now proceed with analysis (EVM)
    await handleAnalysisWithPayment(result.transactionHash)
  }

  // Solana payment handler removed - Thirdweb now handles both EVM and Solana

  const handleAnalysisWithPayment = async (txHash?: string, chain: 'evm' | 'solana' = 'evm') => {
    setIsAnalyzing(true)
    setProgress(0)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Use API URL from env or default to localhost
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      
      // Get wallet address (Thirdweb handles both EVM and Solana)
      const userWalletAddress = address || account?.address || '0x0000000000000000000000000000000000000000'

      // Call the AI analysis API with payment verification
      const response = await fetch(`${API_URL}/ai/analyze/${marketId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_verified: true,
          user_wallet: userWalletAddress,
          transaction_hash: txHash || paymentData,
          chain: chain, // Send chain type to backend
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Extract error message from backend response
        const errorMessage = data.error || data.message || 'Analysis failed'
        console.error('❌ Backend error:', errorMessage)
        throw new Error(errorMessage)
      }
      
      clearInterval(progressInterval)
      setProgress(100)
      
      // Wait a moment for the progress bar to complete
      setTimeout(() => {
        if (data.success && data.signal) {
          // Convert backend signal to frontend analysis format
          const analysis: MarketAnalysis = {
            marketId: marketId,
            analysis: data.signal.raw_analysis || data.signal.reasoning,
            confidence: data.signal.confidence_score,
            recommendation: data.signal.recommendation,
            priceTarget: data.signal.price_target,
            riskLevel: data.signal.risk_level,
            reasoning: data.signal.key_factors && data.signal.key_factors.length > 0 
              ? data.signal.key_factors 
              : [data.signal.reasoning],
            createdAt: data.signal.created_at,
            // Premium $100 analysis fields
            executiveSummary: data.signal.executive_summary,
            marketContext: data.signal.market_context,
            fundamentalAnalysis: data.signal.fundamental_analysis,
            technicalAnalysis: data.signal.technical_analysis,
            marketMicrostructure: data.signal.market_microstructure,
            keyFactors: data.signal.key_factors,
            riskAssessment: data.signal.risk_assessment,
            opportunityAnalysis: data.signal.opportunity_analysis,
            priceAnalysis: data.signal.price_analysis,
            competitiveAnalysis: data.signal.competitive_analysis,
            actionPlan: data.signal.action_plan
          }
          
          setAnalysis(analysis)
          setSignals([data.signal])
          setIsAnalyzing(false)
          setIsPaymentProcessing(false)
          
          // Invalidate signals query to update history page
          if (account?.address) {
            queryClient.invalidateQueries({ queryKey: ['signals', account.address] })
          }
          
          if (onAnalysisComplete) {
            onAnalysisComplete(analysis)
          }
        } else {
          throw new Error(data.error || 'Analysis failed')
        }
      }, 500)

    } catch (error) {
      console.error('Analysis error:', error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      
      // Show specific error messages
      let userFriendlyMessage = 'Failed to analyze market. Please try again.'
      
      if (errorMessage.includes('Transaction failed') || errorMessage.includes('Transaction not found')) {
        userFriendlyMessage = 'Transaction verification failed. The payment transaction may have failed on-chain. Please try again.'
      } else if (errorMessage.includes('Solana payment facilitator not configured')) {
        userFriendlyMessage = 'Solana payment system not configured. Please contact support.'
      } else if (errorMessage.includes('InvalidAccountData')) {
        userFriendlyMessage = 'Token account error. Please ensure you have USDC in your wallet and try again.'
      } else if (errorMessage) {
        userFriendlyMessage = errorMessage
      }
      
      setError(userFriendlyMessage)
      setIsAnalyzing(false)
      setIsPaymentProcessing(false)
      setProgress(0)
    }
  }

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'BUY':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'SELL':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'HOLD':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("space-y-6", className)}
    >
      {/* Analysis Trigger */}
      <Card className="polymarket-card-gradient polymarket-shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-blue-600" />
            <span>AI Market Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              Market Question:
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {marketQuestion}
            </p>
          </div>


          {/* Wallet Connection Required */}
          {!isConnected && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h4 className="font-medium text-blue-800 dark:text-blue-200">
                  Wallet Connection Required
                </h4>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                Connect your wallet (EVM or Solana) to analyze markets and make payments.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 mb-3">
                <ConnectButton
                  client={client}
                  wallets={wallets}
                  recommendedWallets={wallets}
                  theme="dark"
                  connectModal={{
                    size: "compact",
                    title: "Connect Wallet",
                    titleIcon: "",
                    showThirdwebBranding: false,
                    welcomeScreen: {
                      title: "Connect Wallet",
                      subtitle: "Connect with email or wallet (EVM or Solana supported)",
                    },
                  }}
                  connectButton={{
                    label: "Connect Wallet",
                    className: "w-full polycaster-gradient hover:opacity-90 text-white py-2 px-4 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center justify-center space-x-2",
                  }}
                />
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 text-center">
                💡 Thirdweb supports both EVM and Solana wallets
              </p>
            </div>
          )}


          {/* Payment Required UI */}
          {paymentRequired && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <CreditCard className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                  Payment Required
                </h4>
              </div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-4">
                Analysis requires a payment of $0.30 USDC to proceed.
              </p>
              <Button
                onClick={handlePayment}
                disabled={isPaymentProcessing}
                className="w-full polycaster-gradient hover:opacity-90 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:cursor-not-allowed"
              >
                {isPaymentProcessing ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Payment...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4" />
                    <span>Pay $0.30 USDC</span>
                  </div>
                )}
              </Button>
            </div>
          )}

          {/* Payment Success */}
          {paymentData && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h4 className="font-medium text-green-800 dark:text-green-200">
                  Payment Confirmed
                </h4>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-green-700 dark:text-green-300 break-all font-mono">
                  {paymentData}
                </p>
                <a
                  href={
                    walletChainType === 'solana'
                      ? `https://solscan.io/tx/${paymentData}`
                      : `https://sepolia.basescan.org/tx/${paymentData}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-green-600 dark:text-green-400 hover:underline flex items-center gap-1"
                >
                  View on {walletChainType === 'solana' ? 'Solscan' : 'BaseScan'} →
                </a>
              </div>
            </div>
          )}

          {!analysis && !isAnalyzing && !paymentRequired && (
            <Button
              onClick={handleAnalysis}
              disabled={!isConnected}
              className="w-full polycaster-gradient hover:opacity-90 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg transition-all duration-200 font-semibold shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
            >
              <Zap className="w-5 h-5" />
              <span>Start AI Analysis ($0.30)</span>
            </Button>
          )}
          
          {!isConnected && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200 text-center">
                Please connect your wallet (EVM or Solana) to analyze markets
              </p>
            </div>
          )}

          {isAnalyzing && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-2">
                  <Brain className="w-8 h-8 text-blue-600 animate-pulse" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  AI is analyzing the market...
                </p>
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-xs text-center text-gray-500">
                {progress}% complete
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Main Analysis Card */}
          <Card className="polymarket-card-gradient polymarket-shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span>AI Analysis Complete</span>
                </div>
                <Badge 
                  variant="outline" 
                  className={cn("font-medium text-base px-3 py-1", getRecommendationColor(analysis.recommendation))}
                >
                  {analysis.recommendation}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Executive Summary */}
              {analysis.executiveSummary && (
                <div className="p-5 bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 rounded-lg border-l-4 border-purple-500">
                  <div className="flex items-center space-x-2 mb-3">
                    <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <h4 className="font-semibold text-gray-900 dark:text-white text-base">
                      Executive Summary
                    </h4>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
                    {analysis.executiveSummary}
                  </p>
                </div>
              )}

              {/* Market Context */}
              {analysis.marketContext && (
                <div className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-center space-x-2 mb-3">
                    <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h4 className="font-semibold text-gray-900 dark:text-white text-base">
                      Market Context
                    </h4>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                    {analysis.marketContext}
                  </p>
                </div>
              )}

              {/* Fundamental Analysis */}
              {analysis.fundamentalAnalysis && (
                <div className="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border-l-4 border-indigo-500">
                  <div className="flex items-center space-x-2 mb-3">
                    <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <h4 className="font-semibold text-gray-900 dark:text-white text-base">
                      Fundamental Analysis
                    </h4>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                    {analysis.fundamentalAnalysis}
                  </p>
                </div>
              )}

              {/* Technical Analysis */}
              {analysis.technicalAnalysis && (
                <div className="p-5 bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-900/20 dark:to-fuchsia-900/20 rounded-lg border-l-4 border-violet-500">
                  <div className="flex items-center space-x-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                    <h4 className="font-semibold text-gray-900 dark:text-white text-base">
                      Technical Analysis
                    </h4>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                    {analysis.technicalAnalysis}
                  </p>
                </div>
              )}

              {/* Market Microstructure */}
              {analysis.marketMicrostructure && (
                <div className="p-5 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20 rounded-lg border-l-4 border-slate-500">
                  <div className="flex items-center space-x-2 mb-3">
                    <Activity className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    <h4 className="font-semibold text-gray-900 dark:text-white text-base">
                      Market Microstructure
                    </h4>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                    {analysis.marketMicrostructure}
                  </p>
                </div>
              )}

              {/* Key Factors */}
              {analysis.keyFactors && analysis.keyFactors.length > 0 && (
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center space-x-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Key Factors
                    </h4>
                  </div>
                  <ul className="space-y-3">
                    {analysis.keyFactors.map((factor, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
                            {index + 1}
                          </span>
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed flex-1">
                          {factor}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Opportunity Analysis */}
              {analysis.opportunityAnalysis && (
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center space-x-2 mb-3">
                    <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Opportunity Analysis
                    </h4>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                    {analysis.opportunityAnalysis}
                  </p>
                </div>
              )}

              {/* Price Analysis */}
              {analysis.priceAnalysis && (
                <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center space-x-2 mb-3">
                    <DollarSign className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Price Analysis
                    </h4>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                    {analysis.priceAnalysis}
                  </p>
                </div>
              )}

              {/* Risk Assessment */}
              {analysis.riskAssessment && (
                <div className="p-5 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-lg border-l-4 border-red-500">
                  <div className="flex items-center space-x-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <h4 className="font-semibold text-gray-900 dark:text-white text-base">
                      Risk Assessment
                    </h4>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                    {analysis.riskAssessment}
                  </p>
                </div>
              )}

              {/* Competitive Analysis */}
              {analysis.competitiveAnalysis && (
                <div className="p-5 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-lg border-l-4 border-teal-500">
                  <div className="flex items-center space-x-2 mb-3">
                    <BarChart3 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    <h4 className="font-semibold text-gray-900 dark:text-white text-base">
                      Competitive Analysis
                    </h4>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                    {analysis.competitiveAnalysis}
                  </p>
                </div>
              )}

              {/* Action Plan */}
              {analysis.actionPlan && (
                <div className="p-5 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-lg border-l-4 border-emerald-500">
                  <div className="flex items-center space-x-2 mb-3">
                    <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <h4 className="font-semibold text-gray-900 dark:text-white text-base">
                      Action Plan
                    </h4>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
                    {analysis.actionPlan}
                  </p>
                </div>
              )}

              {/* Fallback: Original Analysis Text */}
              {!analysis.executiveSummary && !analysis.marketContext && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Analysis Summary:
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {analysis.analysis}
                </p>
              </div>
              )}

              {/* Fallback: Original Reasoning Points */}
              {analysis.reasoning && analysis.reasoning.length > 0 && (!analysis.keyFactors || analysis.keyFactors.length === 0) && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Key Reasoning:
                  </h4>
                  <ul className="space-y-2">
                    {analysis.reasoning.map((point, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Signals */}
          {signals.length > 0 && (
            <Card className="polymarket-card-gradient polymarket-shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  <span>Market Signals</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {signals.map((signal, index) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge 
                          variant="outline" 
                          className={cn("font-medium", getRecommendationColor(signal.recommendation))}
                        >
                          {signal.recommendation}
                        </Badge>
                        <div className="text-sm text-gray-500">
                          {Math.round(signal.confidence_score * 100)}% confidence
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {signal.reasoning}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Target: {formatPrice(signal.price_target)}</span>
                        <span>{new Date(signal.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}
