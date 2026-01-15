'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DonationSuccessPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const reference = searchParams.get('reference')
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
    const [message, setMessage] = useState('Verifying your donation...')
    const [donation, setDonation] = useState<any>(null)

    useEffect(() => {
        if (!reference) {
            setStatus('error')
            setMessage('No transaction reference found.')
            return
        }

        const verifyDonation = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/paystack/verify?reference=${reference}`)
                setStatus('success')
                setMessage('Thank you! Your donation was successful.')
                setDonation(res.data.donation)
            } catch (error: any) {
                if (error.response?.data?.donation) {
                    // Check if it was "already recorded" which counts as success for UI
                    setStatus('success')
                    setMessage('Your donation has been verified!')
                    setDonation(error.response.data.donation)
                } else {
                    console.error(error)
                    setStatus('error')
                    setMessage('Failed to verify donation. If you were charged, please contact support.')
                }
            }
        }

        // Avoid double verification if strict React mode
        if (status === 'verifying') {
            verifyDonation()
        }
    }, [reference])

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="max-w-md w-full bg-card p-8 rounded-2xl shadow-xl border border-border text-center">
                {status === 'verifying' && (
                    <div className="flex flex-col items-center">
                        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
                        <h2 className="text-xl font-bold">Verifying Payment...</h2>
                        <p className="text-muted-foreground mt-2">Please wait while we confirm your donation.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                        <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle2 className="h-10 w-10" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
                        <p className="text-muted-foreground mb-6">{message}</p>

                        {donation && (
                            <div className="bg-muted/50 p-4 rounded-lg w-full mb-6">
                                <p className="text-sm font-medium">Amount Donated</p>
                                <p className="text-2xl font-bold text-primary">${donation.amount_gross?.toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground mt-2">Reference: {reference}</p>
                            </div>
                        )}

                        <div className="space-y-3 w-full">
                            <Link href="/">
                                <Button className="w-full">Return Home</Button>
                            </Link>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center text-red-600">
                        <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                            <AlertCircle className="h-10 w-10" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
                        <p className="text-muted-foreground mb-6">{message}</p>
                        <Link href="/">
                            <Button variant="outline">Return Home</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
