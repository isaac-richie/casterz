'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { ToastProvider } from '@/components/ui/toast'

export function Providers({ children }: { children: React.ReactNode }) {
  // Use useState with lazy initialization to avoid setState in effect
  const [mounted] = useState(() => typeof window !== 'undefined')
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes - data is fresh for 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes - keep in cache for 10 minutes (formerly cacheTime)
            refetchOnWindowFocus: false, // Don't refetch when window regains focus
            refetchOnMount: false, // Don't refetch when component mounts (if data is fresh)
            refetchOnReconnect: false, // Don't refetch on reconnect
          },
        },
      })
  )

  // During SSR or before mount, render children without providers
  // This prevents React context errors during static generation
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        {children}
      </ToastProvider>
    </QueryClientProvider>
  )
}
