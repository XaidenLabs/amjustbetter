'use client'

import { useAuth } from '@/lib/auth-context'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import axios from 'axios'

export default function UserDashboard() {
    const router = useRouter()
    const { user, isLoading } = useAuth()

    const [campaigns, setCampaigns] = useState<any[]>([])

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push('/login')
            } else if (user.role !== 'user' && user.role !== 'admin') {
                if (user.role === 'admin') router.push('/dashboard/admin');
            } else {
                // Fetch user campaigns
                axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/user/campaigns`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                })
                    .then(res => setCampaigns(res.data))
                    .catch(err => console.error("Failed to fetch campaigns", err))
            }
        }
    }, [user, isLoading, router])

    if (isLoading || !user) {
        return (
            <div className="p-8 space-y-4">
                <Skeleton className="h-12 w-64" />
                <Skeleton className="h-64 w-full rounded-xl" />
            </div>
        )
    }

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">My Dashboard</h1>
                    <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg shadow-sm border border-white/20">
                        <span className="text-sm text-white/70 mr-2">Welcome,</span>
                        <span className="font-semibold text-white">{user.name}</span>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Financials</h2>
                        <span className="text-xs px-2 py-1 rounded bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">Action Required</span>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-lg font-medium mb-1">Set up Payouts</h3>
                            <p className="text-sm text-gray-400">Connect your bank account to receive funds from your campaigns.</p>
                        </div>
                        <Button
                            onClick={async () => {
                                try {
                                    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/stripe/connect`, {}, {
                                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                                    });
                                    window.location.href = res.data.url;
                                } catch (e) {
                                    console.error(e)
                                    alert("Failed to initiate Stripe Connect")
                                }
                            }}
                            className="bg-[#635BFF] hover:bg-[#534be0] text-white"
                        >
                            Connect with Stripe
                        </Button>
                    </div>
                </div>

                <div className="mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">My Campaigns</h2>
                        <Button onClick={() => router.push('/start-fundraiser')}>Start New Fundraiser</Button>
                    </div>

                    {campaigns.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {campaigns.map((camp) => (
                                <div key={camp.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 transition-colors">
                                    <div className="h-40 bg-black/20 relative">
                                        {camp.image_path ? (
                                            <img
                                                src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/storage/${camp.image_path}`}
                                                alt={camp.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white/30">No Image</div>
                                        )}
                                        <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 rounded text-xs font-bold uppercase tracking-wider text-white">
                                            {camp.status}
                                        </div>
                                    </div>
                                    <div className="p-5 space-y-4">
                                        <div>
                                            <h3 className="font-bold text-lg leading-tight mb-1 truncate">{camp.title}</h3>
                                            <p className="text-sm text-gray-400">Created on {new Date(camp.created_at).toLocaleDateString()}</p>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-300">${camp.total_raised?.toLocaleString() || 0} raised</span>
                                                <span className="text-gray-500">of ${camp.goal_amount?.toLocaleString()}</span>
                                            </div>
                                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary"
                                                    style={{ width: `${Math.min(100, ((camp.total_raised || 0) / camp.goal_amount) * 100)}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 hover:text-white" onClick={() => router.push(`/dashboard/campaigns/${camp.id}`)}>
                                                Manage Campaign
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="col-span-full text-center py-12 text-gray-400 bg-white/5 rounded-xl border border-white/10">
                            <p>No campaigns found. Start your first fundraiser!</p>
                            <Button className="mt-4" onClick={() => router.push('/start-fundraiser')}>Start Fundraiser</Button>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    )
}
