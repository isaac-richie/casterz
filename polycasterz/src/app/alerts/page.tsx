'use client'

// Disable static generation for this page
export const dynamic = 'force-dynamic'

import dynamicImport from 'next/dynamic'
import { Loader2 } from 'lucide-react'

// Dynamically import the content component with SSR disabled
const AlertsPageContent = dynamicImport(() => import('./AlertsPageContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-orange-500" />
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  ),
})

export default function AlertsPage() {
  return <AlertsPageContent />
}
