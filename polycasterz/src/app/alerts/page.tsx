'use client'

// Disable static generation for this page
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAlerts } from '@/hooks/useAlerts'
import { useActiveAccount } from 'thirdweb/react'
import { useAlertNotifications } from '@/hooks/useAlertNotifications'
import { Bell, Loader2, Trash2, TrendingUp, TrendingDown, Target, Mail, RefreshCw, CheckCircle2, XCircle } from 'lucide-react'
import { EmailSettings } from '@/components/user/EmailSettings'
import Link from 'next/link'

function AlertsPageContent() {
  const [activeTab, setActiveTab] = useState<'active' | 'triggered' | 'cancelled'>('active')
  const [showEmailSettings, setShowEmailSettings] = useState(false)
  const { alerts, loading, error, deleteAlert, refetch } = useAlerts(activeTab)
  const account = useActiveAccount()
  const { markAllAsSeen } = useAlertNotifications()

  // Only refetch when tab changes (not on every mount)
  useEffect(() => {
    if (account) {
      refetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]) // Only refetch when tab changes, not on account change

  // Mark all alerts as seen when user visits alerts page
  useEffect(() => {
    if (account && activeTab === 'triggered') {
      // Small delay to ensure alerts are loaded
      setTimeout(() => {
        markAllAsSeen()
      }, 1000)
    }
  }, [account, activeTab, markAllAsSeen])

  if (!account) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <Bell className="w-16 h-16 mx-auto mb-4 text-orange-500" />
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Connect Your Wallet</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Please connect your wallet to view your price alerts
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
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-orange-500" />
          <p className="text-gray-600 dark:text-gray-400">Loading your alerts...</p>
        </div>
      </div>
    )
  }

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case 'above':
        return <TrendingUp className="w-4 h-4" />
      case 'below':
        return <TrendingDown className="w-4 h-4" />
      case 'equals':
        return <Target className="w-4 h-4" />
      default:
        return null
    }
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'above':
        return 'text-green-600 dark:text-green-400'
      case 'below':
        return 'text-red-600 dark:text-red-400'
      case 'equals':
        return 'text-blue-600 dark:text-blue-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">Active</Badge>
      case 'triggered':
        return <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">Triggered</Badge>
      case 'cancelled':
        return <Badge className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">Cancelled</Badge>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-2 sm:gap-3">
              <Bell className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-orange-500" />
              Your Price Alerts
            </h1>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => refetch()}
                        disabled={loading}
                        className="flex items-center gap-2"
                        title="Refresh alerts"
                      >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        <span className="hidden sm:inline">Refresh</span>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowEmailSettings(true)}
                        className="flex items-center gap-2"
                      >
                        <Mail className="w-4 h-4" />
                        <span className="hidden sm:inline">Email Settings</span>
                      </Button>
                      <Link href="/">
                        <Button variant="outline">
                          Back to Markets
                        </Button>
                      </Link>
                    </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your market price alerts
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'active' | 'triggered' | 'cancelled')} className="mb-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="triggered">Triggered</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Error State */}
        {error && (
          <Card className="mb-6">
            <CardContent className="pt-6 text-center">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <Button onClick={() => refetch()}>Try Again</Button>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!error && alerts.length === 0 && (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <Bell className="w-20 h-20 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                No {activeTab} Alerts
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                {activeTab === 'active' && "Create your first price alert by clicking the 🔔 Alert button on any market card"}
                {activeTab === 'triggered' && "Your triggered alerts will appear here"}
                {activeTab === 'cancelled' && "Your cancelled alerts will appear here"}
              </p>
              {activeTab === 'active' && (
                <Link href="/">
                  <Button>Browse Markets</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}

        {/* Alerts Grid */}
        {!error && alerts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {alerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="polymarket-card-gradient hover:shadow-xl transition-all duration-300 h-full">
                  <CardHeader className="pb-2 px-4 pt-4">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1">
                        {alert.market_question}
                      </CardTitle>
                      {activeTab === 'active' && (
                        <Button
                          onClick={async () => {
                            if (confirm('Are you sure you want to delete this alert?')) {
                              await deleteAlert(alert.id)
                            }
                          }}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 px-4 pb-4">
                    {/* Alert Details */}
                    <div className="p-2.5 bg-orange-50 dark:bg-orange-900/20 rounded-md border border-orange-200 dark:border-orange-800">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] text-orange-700 dark:text-orange-300">Alert Condition</span>
                        {getStatusBadge(alert.status)}
                      </div>
                      <div className={`flex items-center gap-1.5 text-sm font-bold ${getConditionColor(alert.condition)}`}>
                        {getConditionIcon(alert.condition)}
                        <span className="capitalize">{alert.condition}</span>
                        <span className="text-base">{(alert.target_price * 100).toFixed(0)}¢</span>
                      </div>
                    </div>

                    {/* Notes */}
                    {alert.notes && (
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
                        <p className="text-xs text-blue-900 dark:text-blue-100 leading-relaxed">
                          📝 {alert.notes}
                        </p>
                      </div>
                    )}

                    {/* Timestamp */}
                    <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400">
                      <span>
                        {alert.status === 'triggered' && alert.triggered_at
                          ? `Triggered ${new Date(alert.triggered_at).toLocaleDateString()}`
                          : `Created ${new Date(alert.created_at).toLocaleDateString()}`}
                      </span>
                      {alert.status === 'triggered' && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                      )}
                      {alert.status === 'cancelled' && (
                        <XCircle className="w-3.5 h-3.5 text-gray-500" />
                      )}
                    </div>

                    {/* Action */}
                    <Link href={`/?market=${alert.market_id}`} className="block">
                      <Button variant="outline" className="w-full py-1.5 text-xs" size="sm">
                        View Market
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Email Settings Modal */}
      <EmailSettings
        isOpen={showEmailSettings}
        onClose={() => setShowEmailSettings(false)}
      />
    </div>
  )
}

export default function AlertsPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // During SSR, render a loading state
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-orange-500" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return <AlertsPageContent />
}

