'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSignals } from '@/hooks/useSignals'
import { useActiveAccount } from 'thirdweb/react'
import { 
  History, 
  Loader2, 
  ExternalLink, 
  TrendingUp, 
  TrendingDown, 
  Target,
  AlertCircle,
  Calendar,
  DollarSign,
  BarChart3
} from 'lucide-react'
import { formatPrice, formatTimeAgo, getRiskLevelColor } from '@/lib/utils'
import Link from 'next/link'

export default function HistoryPageContent() {
  const { signals, loading, error } = useSignals()
  const account = useActiveAccount()
  const [filter, setFilter] = useState<'all' | 'BUY' | 'SELL' | 'HOLD'>('all')
  const [sortBy, setSortBy] = useState<'date' | 'confidence'>('date')

  // Filter and sort signals
  const filteredSignals = signals
    .filter(signal => filter === 'all' || signal.recommendation === filter)
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      } else {
        return b.confidence_score - a.confidence_score
      }
    })

  const getRecommendationColor = (recommendation: 'BUY' | 'SELL' | 'HOLD') => {
    switch (recommendation) {
      case 'BUY':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 border-green-300 dark:border-green-800'
      case 'SELL':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 border-red-300 dark:border-red-800'
      case 'HOLD':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-800'
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
    }
  }

  const getRecommendationIcon = (recommendation: 'BUY' | 'SELL' | 'HOLD') => {
    switch (recommendation) {
      case 'BUY':
        return <TrendingUp className="w-4 h-4" />
      case 'SELL':
        return <TrendingDown className="w-4 h-4" />
      case 'HOLD':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Target className="w-4 h-4" />
    }
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <History className="w-16 h-16 mx-auto mb-4 text-blue-500" />
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Connect Your Wallet</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Please connect your wallet to view your signal purchase history
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600 dark:text-gray-400">Loading your signal history...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Calculate stats
  const stats = {
    total: signals.length,
    buy: signals.filter(s => s.recommendation === 'BUY').length,
    sell: signals.filter(s => s.recommendation === 'SELL').length,
    hold: signals.filter(s => s.recommendation === 'HOLD').length,
    avgConfidence: signals.length > 0
      ? Math.round((signals.reduce((sum, s) => sum + s.confidence_score, 0) / signals.length) * 100)
      : 0,
    totalSpent: signals.length * 0.3, // $0.30 per signal
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-2 sm:gap-3">
              <History className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-blue-500" />
              Signal Purchase History
            </h1>
            <Link href="/">
              <Button variant="outline">
                Back to Markets
              </Button>
            </Link>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            View all your AI analysis signals and recommendations
          </p>
        </div>

        {/* Stats Cards */}
        {signals.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
              <CardContent className="pt-4 pb-4 px-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-blue-600 dark:text-blue-400 mb-0.5">Total Signals</p>
                    <p className="text-xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</p>
                  </div>
                  <BarChart3 className="w-6 h-6 text-blue-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
              <CardContent className="pt-4 pb-4 px-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-green-600 dark:text-green-400 mb-0.5">BUY Signals</p>
                    <p className="text-xl font-bold text-green-900 dark:text-green-100">{stats.buy}</p>
                  </div>
                  <TrendingUp className="w-6 h-6 text-green-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800">
              <CardContent className="pt-4 pb-4 px-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-red-600 dark:text-red-400 mb-0.5">SELL Signals</p>
                    <p className="text-xl font-bold text-red-900 dark:text-red-100">{stats.sell}</p>
                  </div>
                  <TrendingDown className="w-6 h-6 text-red-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-800">
              <CardContent className="pt-4 pb-4 px-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-yellow-600 dark:text-yellow-400 mb-0.5">HOLD Signals</p>
                    <p className="text-xl font-bold text-yellow-900 dark:text-yellow-100">{stats.hold}</p>
                  </div>
                  <AlertCircle className="w-6 h-6 text-yellow-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
              <CardContent className="pt-4 pb-4 px-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-purple-600 dark:text-purple-400 mb-0.5">Avg Confidence</p>
                    <p className="text-xl font-bold text-purple-900 dark:text-purple-100">{stats.avgConfidence}%</p>
                  </div>
                  <Target className="w-6 h-6 text-purple-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 border-indigo-200 dark:border-indigo-800">
              <CardContent className="pt-4 pb-4 px-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-indigo-600 dark:text-indigo-400 mb-0.5">Total Spent</p>
                    <p className="text-xl font-bold text-indigo-900 dark:text-indigo-100">${stats.totalSpent.toFixed(2)}</p>
                  </div>
                  <DollarSign className="w-6 h-6 text-indigo-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {signals.length === 0 && (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <History className="w-20 h-20 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">No Signal History Yet</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                You haven&apos;t purchased any AI analysis signals yet. Start by analyzing markets to get AI-powered recommendations.
              </p>
              <Link href="/">
                <Button className="polycaster-gradient hover:opacity-90 text-white">
                  <Target className="w-4 h-4 mr-2" />
                  Analyze Markets
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Filters and Signals */}
        {signals.length > 0 && (
          <>
            {/* Filters */}
            <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
              <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
                <TabsList className="bg-white dark:bg-gray-800">
                  <TabsTrigger value="all">All ({signals.length})</TabsTrigger>
                  <TabsTrigger value="BUY">BUY ({stats.buy})</TabsTrigger>
                  <TabsTrigger value="SELL">SELL ({stats.sell})</TabsTrigger>
                  <TabsTrigger value="HOLD">HOLD ({stats.hold})</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
                <Button
                  variant={sortBy === 'date' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('date')}
                >
                  <Calendar className="w-4 h-4 mr-1" />
                  Date
                </Button>
                <Button
                  variant={sortBy === 'confidence' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('confidence')}
                >
                  <Target className="w-4 h-4 mr-1" />
                  Confidence
                </Button>
              </div>
            </div>

            {/* Signals Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              {filteredSignals.map((signal, index) => (
                <motion.div
                  key={signal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="polymarket-card-gradient hover:shadow-xl transition-all duration-300 h-full">
                    <CardHeader className="pb-2 px-4 pt-4">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1">
                          {signal.market_question}
                        </CardTitle>
                        <div className="flex flex-col items-end gap-1">
                          <Badge
                            className={`${getRecommendationColor(signal.recommendation)} flex items-center gap-1 px-1.5 py-0.5 text-[10px]`}
                          >
                            {getRecommendationIcon(signal.recommendation)}
                            {signal.recommendation}
                          </Badge>
                          {signal.chain && (
                            <Badge
                              variant="outline"
                              className={`text-[9px] px-1.5 py-0.5 ${
                                signal.chain === 'evm'
                                  ? 'border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20'
                                  : 'border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/20'
                              }`}
                            >
                              {signal.chain === 'evm' ? 'EVM' : 'Solana'}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 px-4 pb-4">
                      {/* Signal Details */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
                          <div className="text-[10px] text-blue-600 dark:text-blue-400 mb-0.5">Confidence</div>
                          <div className="text-lg font-bold text-blue-700 dark:text-blue-300">
                            {Math.round(signal.confidence_score * 100)}%
                          </div>
                        </div>
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-md border border-purple-200 dark:border-purple-800">
                          <div className="text-[10px] text-purple-600 dark:text-purple-400 mb-0.5">Price Target</div>
                          <div className="text-lg font-bold text-purple-700 dark:text-purple-300">
                            {formatPrice(signal.price_target)}
                          </div>
                        </div>
                      </div>

                      {/* Risk Level */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-gray-600 dark:text-gray-400">Risk Level:</span>
                        <Badge
                          variant="outline"
                          className={`${getRiskLevelColor(signal.risk_level)} border text-[10px] px-1.5 py-0.5`}
                        >
                          {signal.risk_level}
                        </Badge>
                      </div>

                      {/* Reasoning */}
                      {signal.reasoning && (
                        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                          <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-3 leading-relaxed">
                            {signal.reasoning}
                          </p>
                        </div>
                      )}

                      {/* Metadata */}
                      <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400 pt-1.5 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatTimeAgo(signal.created_at)}
                        </div>
                        {signal.market_category && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">
                            {signal.market_category}
                          </Badge>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="grid grid-cols-2 gap-1.5 pt-1.5">
                        <Link href={`/?market=${signal.market_id}`} className="w-full">
                          <Button variant="outline" className="w-full py-1.5 text-xs" size="sm">
                            View Market
                          </Button>
                        </Link>
                        <Button
                          onClick={() => {
                            window.open(`https://polymarket.com/event/${signal.market_id}`, '_blank')
                          }}
                          variant="outline"
                          size="sm"
                          className="w-full py-1.5 text-xs"
                        >
                          <ExternalLink className="w-3.5 h-3.5 mr-1" />
                          Polymarket
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* No filtered results */}
            {filteredSignals.length === 0 && (
              <Card>
                <CardContent className="pt-12 pb-12 text-center">
                  <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">No Signals Found</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    No signals match your current filter. Try a different filter.
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}

