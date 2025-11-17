'use client'

// Disable static generation for this page
export const dynamic = 'force-dynamic'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, Loader2, Mail } from 'lucide-react'
import { verifyEmail } from '@/lib/api/users'
import Link from 'next/link'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')

    if (!token) {
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => {
        setStatus('error')
        setMessage('No verification token provided')
      }, 0)
      return
    }

    const verify = async () => {
      try {
        const result = await verifyEmail(token)

        if (result.success) {
          setStatus('success')
          setMessage(result.message || 'Email verified successfully!')
        } else {
          setStatus('error')
          setMessage(result.error || 'Failed to verify email')
        }
      } catch (error) {
        setStatus('error')
        setMessage(error instanceof Error ? error.message : 'An error occurred')
      }
    }

    verify()
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <Mail className="w-6 h-6" />
            Email Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'loading' && (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-spin" />
              <p className="text-gray-600 dark:text-gray-400">Verifying your email...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center py-8">
              <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                Email Verified!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {message}
              </p>
              <div className="space-y-2">
                <Link href="/alerts">
                  <Button className="w-full polycaster-gradient hover:opacity-90 text-white">
                    Go to Alerts
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center py-8">
              <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
              <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                Verification Failed
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {message}
              </p>
              <div className="space-y-2">
                <Link href="/alerts">
                  <Button variant="outline" className="w-full">
                    Go to Alerts
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <Loader2 className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-spin" />
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}

