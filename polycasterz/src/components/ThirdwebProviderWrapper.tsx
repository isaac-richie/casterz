'use client'

import { ThirdwebProvider } from 'thirdweb/react'
import { useState } from 'react'

export function ThirdwebProviderWrapper({ children }: { children: React.ReactNode }) {
  // Use useState with lazy initialization to avoid setState in effect
  const [mounted] = useState(() => typeof window !== 'undefined')

  // During SSR or before mount, render children without ThirdwebProvider
  // This prevents React context errors during static generation
  if (!mounted) {
    return <>{children}</>
  }

  // Only render ThirdwebProvider on client side after mount
  return <ThirdwebProvider>{children}</ThirdwebProvider>
}
