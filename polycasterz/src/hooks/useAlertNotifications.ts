'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useActiveAccount } from 'thirdweb/react'
import { alertsApi } from '@/lib/api/alerts'
import { PriceAlert } from '@/types'
import { useToast } from '@/components/ui/toast'

const POLL_INTERVAL = 30000 // 30 seconds
const SEEN_ALERTS_KEY = 'polycaster_seen_alerts'

export function useAlertNotifications() {
  // Safe to call useActiveAccount - it handles SSR internally
  const account = useActiveAccount()
  const [triggeredAlerts, setTriggeredAlerts] = useState<PriceAlert[]>([])
  const [triggeredCount, setTriggeredCount] = useState(0)
  const [isPolling, setIsPolling] = useState(false)
  const hasCheckedInitialRef = useRef(false)
  const { addToast } = useToast()

  // Get seen alert IDs from localStorage
  const getSeenAlertIds = useCallback((): Set<string> => {
    if (typeof window === 'undefined') return new Set()
    try {
      const seen = localStorage.getItem(SEEN_ALERTS_KEY)
      return seen ? new Set(JSON.parse(seen)) : new Set()
    } catch {
      return new Set()
    }
  }, [])

  // Mark alert as seen
  const markAlertAsSeen = useCallback((alertId: string) => {
    if (typeof window === 'undefined') return
    try {
      const seen = getSeenAlertIds()
      seen.add(alertId)
      localStorage.setItem(SEEN_ALERTS_KEY, JSON.stringify(Array.from(seen)))
      
      // Recalculate unseen count after marking as seen
      // Use the updated seen set (which now includes alertId)
      const unseenCount = triggeredAlerts.filter(alert => !seen.has(alert.id)).length
      setTriggeredCount(unseenCount)
    } catch (error) {
      console.error('Error marking alert as seen:', error)
    }
  }, [getSeenAlertIds, triggeredAlerts])

  // Mark all alerts as seen (when user visits alerts page)
  const markAllAlertsAsSeen = useCallback(() => {
    if (typeof window === 'undefined') return
    try {
      const seen = getSeenAlertIds()
      triggeredAlerts.forEach(alert => seen.add(alert.id))
      localStorage.setItem(SEEN_ALERTS_KEY, JSON.stringify(Array.from(seen)))
      
      // Recalculate unseen count - should be 0 since all are now seen
      const unseenCount = triggeredAlerts.filter(alert => !seen.has(alert.id)).length
      setTriggeredCount(unseenCount)
    } catch (error) {
      console.error('Error marking all alerts as seen:', error)
    }
  }, [triggeredAlerts, getSeenAlertIds])

  const checkForTriggeredAlerts = useCallback(async () => {
    if (!account?.address || isPolling) return

    setIsPolling(true)
    try {
      const result = await alertsApi.get(account.address, 'triggered')
      
      // Only process if we have a successful response AND alerts array exists AND has items
      if (result.success && result.alerts && Array.isArray(result.alerts) && result.alerts.length > 0) {
        const seenAlertIds = getSeenAlertIds()
        
        // Filter out seen alerts (only show toast for new unseen alerts)
        const unseenAlerts = result.alerts.filter((alert) => {
          return !seenAlertIds.has(alert.id)
        })

        // Show toast notifications ONLY for unseen alerts (first time) AND only if there are any
        if (unseenAlerts.length > 0 && addToast) {
          unseenAlerts.forEach((alert) => {
            const conditionText = alert.condition === 'above' ? 'above' : 
                                 alert.condition === 'below' ? 'below' : 'equals'
            
            addToast({
              type: 'alert',
              title: '🔔 Price Alert Triggered!',
              description: `${alert.market_question.substring(0, 60)}... - Price is ${conditionText} ${(alert.target_price * 100).toFixed(0)}¢`,
              duration: 8000,
            })

            // Mark as seen immediately after showing toast
            markAlertAsSeen(alert.id)
          })
        }
        
        // Update state - store ALL triggered alerts, but badge count should only show UNSEEN alerts
        setTriggeredAlerts(result.alerts)
        // Badge count should only show unseen alerts, not all triggered alerts
        setTriggeredCount(unseenAlerts.length)
      } else {
        // No alerts or empty array - reset state
        setTriggeredAlerts([])
        setTriggeredCount(0)
      }
    } catch (error) {
      console.error('Error checking for triggered alerts:', error)
      // On error, reset state to avoid showing stale data
      setTriggeredAlerts([])
      setTriggeredCount(0)
    } finally {
      setIsPolling(false)
      hasCheckedInitialRef.current = true
    }
  }, [account?.address, isPolling, getSeenAlertIds, markAlertAsSeen, addToast])

  // Poll for triggered alerts (only when tab is visible)
  useEffect(() => {
    if (!account?.address) {
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => {
        setTriggeredAlerts([])
        setTriggeredCount(0)
      }, 0)
      hasCheckedInitialRef.current = false // Reset when user disconnects
      return
    }

    // Reset check flag when address changes (new user logged in)
    hasCheckedInitialRef.current = false

    // Initial check (only once on mount or when address changes)
    checkForTriggeredAlerts()

    // Only poll when tab is visible (saves API calls)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Tab became visible, check immediately
        checkForTriggeredAlerts()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Set up polling interval (only when tab is visible)
    const interval = setInterval(() => {
      // Only poll if tab is visible
      if (document.visibilityState === 'visible') {
        checkForTriggeredAlerts()
      }
    }, POLL_INTERVAL)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [account?.address, checkForTriggeredAlerts])

  return {
    triggeredCount,
    triggeredAlerts,
    isPolling,
    refresh: checkForTriggeredAlerts,
    markAllAsSeen: markAllAlertsAsSeen,
  }
}

