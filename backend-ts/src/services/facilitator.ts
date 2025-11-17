import { facilitator, settlePayment } from 'thirdweb/x402'
import { createThirdwebClient } from 'thirdweb'
import { bsc } from 'thirdweb/chains'
import { FacilitatorResponse } from '../types'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

export class FacilitatorService {
  private client
  private evmFacilitator
  private solanaFacilitator

  constructor() {
    const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID
    const secretKey = process.env.THIRDWEB_SECRET_KEY
    const evmServerWallet = process.env.SERVER_WALLET_ADDRESS || process.env.PAYMENT_RECIPIENT_WALLET
    const solanaServerWallet = process.env.SOLANA_SERVER_WALLET || ''

    if (!clientId && !secretKey) {
      console.warn('WARNING: Neither NEXT_PUBLIC_THIRDWEB_CLIENT_ID nor THIRDWEB_SECRET_KEY found in environment variables')
      // Create a mock client for development
      this.client = null
      this.evmFacilitator = null
      this.solanaFacilitator = null
      return
    }

    // Create client with available credentials
    if (secretKey) {
      this.client = createThirdwebClient({ secretKey })
    } else if (clientId) {
      this.client = createThirdwebClient({ clientId })
    } else {
      // This should not happen due to check above, but TypeScript needs this
      this.client = null
      this.evmFacilitator = null
      this.solanaFacilitator = null
      return
    }

    // EVM Facilitator (BNB Chain / BSC)
    this.evmFacilitator = facilitator({
      client: this.client,
      serverWalletAddress: evmServerWallet || '',
      waitUntil: 'confirmed',
    })

    // Solana Facilitator (using Thirdweb X402)
    if (solanaServerWallet) {
      this.solanaFacilitator = facilitator({
        client: this.client,
        serverWalletAddress: solanaServerWallet,
        waitUntil: 'confirmed',
      })
    } else {
      console.warn('⚠️  SOLANA_SERVER_WALLET not configured - Solana payments will be disabled')
      this.solanaFacilitator = null
    }
  }

  /**
   * Settle payment - supports both EVM (default) and Solana using Thirdweb X402
   * 
   * @param resourceUrl - The resource being paid for
   * @param paymentData - Payment transaction data
   * @param price - Price string (e.g., '$0.30')
   * @param chain - Optional: 'evm' (default) or 'solana'
   * @returns FacilitatorResponse
   */
  async settlePayment(
    resourceUrl: string,
    paymentData: string,
    price: string = '$0.30',
    chain?: 'evm' | 'solana'
  ): Promise<FacilitatorResponse> {
    // Route to Solana facilitator if requested
    if (chain === 'solana') {
      try {
        // If Solana facilitator is not available, return error
        if (!this.solanaFacilitator) {
          console.error('❌ Solana facilitator not configured - SOLANA_SERVER_WALLET is missing')
          return {
            status: 500,
            responseBody: {
              success: false,
              message: 'Solana payment facilitator not configured',
              error: 'SOLANA_SERVER_WALLET environment variable is not set. Please configure it in your backend .env file.',
              transaction_hash: undefined,
            },
            responseHeaders: {},
          }
        }

        const result = await settlePayment({
          resourceUrl,
          method: 'GET',
          paymentData,
          payTo: process.env.SOLANA_SERVER_WALLET || '',
          network: 'solana' as any, // Thirdweb X402 supports Solana as string
          price,
          facilitator: this.solanaFacilitator,
        })

        // Extract transaction hash from result
        const transactionHash = (result as any).paymentReceipt?.transaction || (result as any).transactionHash || ''
        
        return {
          status: 200,
          responseBody: {
            success: true,
            message: 'Solana payment settled successfully',
            transaction_hash: transactionHash,
            result,
          },
          responseHeaders: {},
        }
      } catch (error) {
        console.error('Solana payment settlement failed:', error)
        return {
          status: 500,
          responseBody: {
            success: false,
            message: 'Solana payment settlement failed',
            error: error instanceof Error ? error.message : 'Unknown error',
          },
          responseHeaders: {},
        }
      }
    }

    // Default: Use Thirdweb facilitator for EVM (BNB Chain / BSC)
    try {
      // If facilitator is not available (missing secret key), return mock response
      if (!this.evmFacilitator) {
        console.warn('Facilitator not available - returning mock response')
        return {
          status: 200,
          responseBody: {
            success: true,
            message: 'Mock payment settlement (THIRDWEB_SECRET_KEY not configured)',
            transaction_hash: '0x123...mock',
            result: { mock: true }
          },
          responseHeaders: {},
        }
      }

      const result = await settlePayment({
        resourceUrl,
        method: 'GET',
        paymentData,
        payTo: process.env.SERVER_WALLET_ADDRESS || process.env.PAYMENT_RECIPIENT_WALLET || '',
        network: bsc,
        price,
        facilitator: this.evmFacilitator,
      })

      // Extract transaction hash from result
      const transactionHash = (result as any).paymentReceipt?.transaction || (result as any).transactionHash || ''
      
      return {
        status: 200,
        responseBody: {
          success: true,
          message: 'Payment settled successfully',
          transaction_hash: transactionHash,
          result,
        },
        responseHeaders: {},
      }
    } catch (error) {
      console.error('Payment settlement failed:', error)
      return {
        status: 500,
        responseBody: {
          success: false,
          message: 'Payment settlement failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        responseHeaders: {},
      }
    }
  }

  async getSupportedPaymentMethods(chainId?: number, chain?: 'evm' | 'solana') {
    // Route to Solana if requested
    if (chain === 'solana') {
      try {
        if (!this.solanaFacilitator) {
          return {
            USDC: {
              chain: 'solana',
              tokenAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC on Solana
              decimals: 6,
              supported: false,
              note: 'SOLANA_SERVER_WALLET not configured'
            }
          }
        }

        // Use Thirdweb facilitator to get supported methods
        const supported = await this.solanaFacilitator.supported()
        return supported || {
          USDC: {
            chain: 'solana',
            tokenAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC on Solana
            decimals: 6,
            supported: true
          }
        }
      } catch (error) {
        console.error('Failed to get Solana payment methods:', error)
        return {
          USDC: {
            chain: 'solana',
            tokenAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
            decimals: 6,
            supported: false
          }
        }
      }
    }

    // Default: Use Thirdweb methods for EVM
    try {
      // If facilitator is not available, return mock methods
      if (!this.evmFacilitator) {
        console.warn('Facilitator not available - returning mock payment methods')
        return {
          USDC: {
            chainId: 56, // BNB Chain (BSC)
            tokenAddress: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', // USDC on BNB Chain
            decimals: 18,
            supported: true
          }
        }
      }

      if (chainId) {
        return await this.evmFacilitator.supported({ chainId })
      }
      return await this.evmFacilitator.supported()
    } catch (error) {
      console.error('Failed to get supported payment methods:', error)
      return {}
    }
  }
}

export const facilitatorService = new FacilitatorService()
