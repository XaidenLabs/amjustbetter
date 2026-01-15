'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Heart, Lock, ExternalLink } from "lucide-react"
import axios from 'axios'

interface DonationWizardProps {
    campaignId: string
    campaignTitle: string
}

export default function DonationWizard({ campaignId, campaignTitle }: DonationWizardProps) {
    const [step, setStep] = useState(1)
    const [amount, setAmount] = useState('50')
    const [customAmount, setCustomAmount] = useState('')
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [isAnonymous, setIsAnonymous] = useState(false)
    const [loading, setLoading] = useState(false)
    const [comment, setComment] = useState('')

    const predefinedAmounts = ['10', '25', '50', '100', '250']

    const handleAmountSelect = (val: string) => {
        setAmount(val)
        setCustomAmount('')
    }

    const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomAmount(e.target.value)
        setAmount('')
    }

    const getFinalAmount = () => {
        return customAmount || amount
    }

    const nextStep = () => setStep(step + 1)
    const prevStep = () => setStep(step - 1)

    const handlePaystackPayment = async () => {
        setLoading(true)
        try {
            const finalAmount = parseInt(getFinalAmount()) * 100 // Convert to kobo

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/paystack/initialize`, {
                campaign_id: campaignId,
                amount_cents: finalAmount,
                email: email,
                is_anonymous: isAnonymous,
                comment: comment
            })

            const { authorization_url } = response.data

            if (authorization_url) {
                window.location.href = authorization_url
            } else {
                alert('Payment initialization failed. Please try again.')
            }

        } catch (error) {
            console.error('Payment setup failed', error)
            alert('Failed to initialize payment. Please check your connection and try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 text-lg shadow-lg transform transition hover:scale-[1.02]">
                    Donate Now <Heart className="ml-2 h-5 w-5 fill-current" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-white text-gray-900 border-none shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">Support {campaignTitle}</DialogTitle>
                </DialogHeader>

                <div className="mt-4">
                    {/* Progress Bar / Steps */}
                    <div className="flex justify-between mb-6 text-sm font-medium text-gray-400">
                        <span className={step >= 1 ? "text-primary" : ""}>Amount</span>
                        <span className={step >= 2 ? "text-primary" : ""}>Details</span>
                        <span className="text-gray-400">Payment</span>
                    </div>

                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-3 gap-3">
                                {predefinedAmounts.map((amt) => (
                                    <Button
                                        key={amt}
                                        variant={amount === amt && !customAmount ? "default" : "outline"}
                                        onClick={() => handleAmountSelect(amt)}
                                        className="text-lg"
                                    >
                                        ${amt}
                                    </Button>
                                ))}
                            </div>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                <Input
                                    type="number"
                                    placeholder="Custom Amount"
                                    value={customAmount}
                                    onChange={handleCustomAmountChange}
                                    className="pl-8 text-lg"
                                />
                            </div>

                            <p className="text-xs text-center text-gray-500">
                                Secure payments processed by Paystack
                            </p>

                            <Button onClick={nextStep} className="w-full text-lg py-6">Continue</Button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="name@example.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name (Optional)</Label>
                                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
                            </div>
                            <div className="flex items-center space-x-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="anonymous"
                                    checked={isAnonymous}
                                    onChange={(e) => setIsAnonymous(e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <Label htmlFor="anonymous" className="font-normal cursor-pointer">Donation is anonymous</Label>
                            </div>

                            <div className="space-y-2 pt-2">
                                <Label htmlFor="comment">Words of Support (Optional)</Label>
                                <Textarea
                                    id="comment"
                                    placeholder="Leave a message for the organizer..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button variant="outline" onClick={prevStep} className="flex-1">Back</Button>
                                <Button
                                    onClick={handlePaystackPayment}
                                    disabled={loading || !email}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                                >
                                    {loading ? 'Redirecting...' : 'Pay via Paystack'}
                                    {!loading && <ExternalLink className="ml-2 h-4 w-4" />}
                                </Button>
                            </div>
                            <p className="text-xs text-center text-gray-400 mt-2">
                                You will be redirected to Paystack to complete your secure donation.
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
