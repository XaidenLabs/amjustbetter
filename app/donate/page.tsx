'use client'

import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import { useState } from 'react'
import { addTransaction } from '@/lib/admin-store'

export default function DonatePage() {
  const [amount, setAmount] = useState('500')
  const [customAmount, setCustomAmount] = useState('')
  const [donationType, setDonationType] = useState('once')
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')

  const presetAmounts = ['100', '500', '1000', '5000']

  const handleDonate = () => {
    const finalAmount = customAmount || amount
    addTransaction({
      type: 'donation',
      name: fullName,
      email: email,
      amount: parseInt(finalAmount),
      date: new Date().toISOString(),
      status: 'completed',
      details: `${donationType === 'monthly' ? 'Monthly' : 'One-time'} donation`
    })
    
    console.log('Donation:', { amount: finalAmount, type: donationType, email, fullName })
    
    // Simulating Paystack integration
    alert(`Redirecting to Paystack to donate ${finalAmount} NGN...`)
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white">
        <section className="bg-gradient-to-r from-accent to-red-600 text-white py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Support Our Mission</h1>
            <p className="text-lg text-white/90">Your contribution makes a real difference in changing lives.</p>
          </div>
        </section>

        <section className="py-12 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Donation Form */}
              <div className="bg-muted rounded-lg p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Make a Donation</h2>

                {/* Donation Type */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-foreground mb-3">Donation Type</label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setDonationType('once')}
                      className={`flex-1 py-2 rounded-lg font-semibold transition ${
                        donationType === 'once'
                          ? 'bg-primary text-white'
                          : 'bg-white border border-border'
                      }`}
                    >
                      One-time
                    </button>
                    <button
                      onClick={() => setDonationType('monthly')}
                      className={`flex-1 py-2 rounded-lg font-semibold transition ${
                        donationType === 'monthly'
                          ? 'bg-primary text-white'
                          : 'bg-white border border-border'
                      }`}
                    >
                      Monthly
                    </button>
                  </div>
                </div>

                {/* Preset Amounts */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-foreground mb-3">Amount (NGN)</label>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {presetAmounts.map((preset) => (
                      <button
                        key={preset}
                        onClick={() => {
                          setAmount(preset)
                          setCustomAmount('')
                        }}
                        className={`py-2 rounded-lg font-semibold transition ${
                          amount === preset && !customAmount
                            ? 'bg-primary text-white'
                            : 'bg-white border border-border hover:bg-muted'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>

                  {/* Custom Amount */}
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value)
                      setAmount('')
                    }}
                    placeholder="Enter custom amount"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Personal Info */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-foreground mb-2">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-4"
                    placeholder="Your name"
                  />

                  <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="your@email.com"
                  />
                </div>

                {/* Donate Button */}
                <button
                  onClick={handleDonate}
                  className="w-full bg-accent text-accent-foreground py-3 rounded-lg font-bold hover:opacity-90 transition text-lg"
                >
                  Donate {customAmount || amount} NGN
                </button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Payment is secured by Paystack
                </p>
              </div>

              {/* Impact Info */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Your Impact</h2>

                <div className="space-y-4">
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                    <p className="font-semibold text-primary">1,000 NGN</p>
                    <p className="text-muted-foreground text-sm">Provides school supplies for one child</p>
                  </div>

                  <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4">
                    <p className="font-semibold text-secondary">5,000 NGN</p>
                    <p className="text-muted-foreground text-sm">Funds a health camp for a community</p>
                  </div>

                  <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                    <p className="font-semibold text-accent">10,000 NGN</p>
                    <p className="text-muted-foreground text-sm">Provides skill training to 5 individuals</p>
                  </div>

                  <div className="bg-muted rounded-lg p-4 mt-6">
                    <h3 className="font-bold text-foreground mb-2">Why Donate?</h3>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>✓ 100% transparent use of funds</li>
                      <li>✓ Regular impact updates</li>
                      <li>✓ Tax-deductible donations</li>
                      <li>✓ Secure payment processing</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
