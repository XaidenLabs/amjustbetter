"use client"

import { useState } from "react"
import axios from "axios"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

// Initialize Stripe outside component
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function CheckoutForm({ clientSecret, onSuccess }: { clientSecret: string, onSuccess: () => void }) {
    const stripe = useStripe()
    const elements = useElements()
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!stripe || !elements) return

        setIsLoading(true)

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/dashboard/user`, // Redirect logic usually handled by backend/webhook, but stripe needs a return url
            },
            redirect: "if_required", // Important to stay in modal if possible
        })

        if (error) {
            setMessage(error.message ?? "An unexpected error occurred.")
        } else {
            setMessage("Donation successful!")
            onSuccess()
        }

        setIsLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <PaymentElement />
            {message && <div className="text-red-500 text-sm">{message}</div>}
            <Button disabled={isLoading || !stripe || !elements} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Donate Now"}
            </Button>
        </form>
    )
}

export default function DonationModal({ campaignId }: { campaignId: string }) {
    const [amount, setAmount] = useState("50")
    const [tipPercent, setTipPercent] = useState(15)
    // const [email, setEmail] = useState("") // If guest
    const [clientSecret, setClientSecret] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [loadingSecret, setLoadingSecret] = useState(false)

    const tipAmount = (parseFloat(amount || "0") * tipPercent) / 100
    const total = parseFloat(amount || "0") + tipAmount

    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(e.target.value)
    }

    const initPayment = async () => {
        if (!amount || parseFloat(amount) <= 0) return
        setLoadingSecret(true)
        try {
            // Call API to get Client Secret
            // Note: In real app, we might need email from guest user here.
            // For MVP logged in user, we send token (axios interceptor or manual).
            // Let's assume guest for now or basic token if valid.
            const response = await axios.post(`${api}/donations/payment_intent`, {
                campaign_id: campaignId,
                amount_cents: Math.round(parseFloat(amount) * 100),
                tip_cents: Math.round(tipAmount * 100),
                email: "guest@example.com", // TODO: Add email input field to modal Step 1
                is_anonymous: false
            })
            setClientSecret(response.data.clientSecret)
        } catch (error) {
            console.error(error)
            toast({ title: "Error", description: "Could not initialize payment", variant: "destructive" })
        } finally {
            setLoadingSecret(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="w-full text-lg py-6 bg-emerald-500 hover:bg-emerald-600 font-semibold shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    Donate Now
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-zinc-900 border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle>Make a Donation</DialogTitle>
                    <DialogDescription>Your support makes a difference.</DialogDescription>
                </DialogHeader>

                {!clientSecret ? (
                    <div className="space-y-6 py-4">
                        {/* Step 1: Amount & Tip */}
                        <div className="space-y-2">
                            <Label htmlFor="amount">Donation Amount ($)</Label>
                            <Input
                                id="amount"
                                type="number"
                                value={amount}
                                onChange={handleAmountChange}
                                className="text-lg bg-zinc-800 border-zinc-700"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <Label>Support the Platform ({tipPercent}%)</Label>
                                <span className="text-muted-foreground">${tipAmount.toFixed(2)}</span>
                            </div>
                            <Slider
                                defaultValue={[15]}
                                max={30}
                                step={1}
                                onValueChange={(val) => setTipPercent(val[0])}
                                className="py-2"
                            />
                            <p className="text-xs text-muted-foreground text-center">
                                We rely on tips to keep the platform free for organizers.
                            </p>
                        </div>

                        <div className="pt-4 border-t border-white/10 flex justify-between items-center font-bold text-lg">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>

                        <Button onClick={initPayment} disabled={loadingSecret} className="w-full bg-emerald-500 hover:bg-emerald-600">
                            {loadingSecret ? <Loader2 className="animate-spin" /> : "Continue to Payment"}
                        </Button>
                    </div>
                ) : (
                    // Step 2: Stripe Payment Element
                    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
                        <CheckoutForm clientSecret={clientSecret} onSuccess={() => {
                            setIsOpen(false)
                            setClientSecret("") // Reset
                            toast({ title: "Thank You!", description: "Your donation has been received." })
                            // Optionally refresh page data
                            window.location.reload()
                        }} />
                    </Elements>
                )}
            </DialogContent>
        </Dialog>
    )
}
