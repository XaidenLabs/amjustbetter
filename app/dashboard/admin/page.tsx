'use client'

import { useAuth } from '@/lib/auth-context'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

export default function AdminDashboard() {
    const { user, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading) {
            if (!user || user.role !== 'admin') {
                router.push('/login')
            }
        }
    }, [user, isLoading, router])

    if (isLoading || !user || user.role !== 'admin') {
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
                    <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                    <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20 backdrop-blur-sm">
                        <span className="text-sm text-emerald-300 font-bold uppercase tracking-wider">Administrator Access</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white/5 p-6 rounded-xl shadow-lg border border-white/10 hover:bg-white/10 transition-colors">
                        <h3 className="text-white/70 font-medium mb-2">Total Users</h3>
                        <p className="text-3xl font-bold text-white">12,345</p>
                        <span className="text-xs text-emerald-400 font-medium">↑ 12% from last month</span>
                    </div>
                    <div className="bg-white/5 p-6 rounded-xl shadow-lg border border-white/10 hover:bg-white/10 transition-colors">
                        <h3 className="text-white/70 font-medium mb-2">Total Donations</h3>
                        <p className="text-3xl font-bold text-white">$45,231</p>
                        <span className="text-xs text-emerald-400 font-medium">↑ 5% from last month</span>
                    </div>
                    <div className="bg-white/5 p-6 rounded-xl shadow-lg border border-white/10 hover:bg-white/10 transition-colors">
                        <h3 className="text-white/70 font-medium mb-2">Active Projects</h3>
                        <p className="text-3xl font-bold text-white">8</p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-xl shadow-lg border border-white/10 hover:bg-white/10 transition-colors">
                        <h3 className="text-white/70 font-medium mb-2">Pending Reviews</h3>
                        <p className="text-3xl font-bold text-white">15</p>
                        <span className="text-xs text-orange-400 font-medium">Action Required</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white/5 rounded-xl shadow-lg border border-white/10 overflow-hidden">
                        <div className="p-6 border-b border-white/10">
                            <h2 className="text-xl font-bold text-white">Recent Registrations</h2>
                        </div>
                        <div className="p-6">
                            {/* Placeholder table */}
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex justify-between items-center py-2 border-b last:border-0 border-white/10">
                                        <div>
                                            <p className="font-medium text-white">User {i}</p>
                                            <p className="text-xs text-white/50">user{i}@example.com</p>
                                        </div>
                                        <span className="text-xs bg-white/10 text-white/80 px-2 py-1 rounded">Just now</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 rounded-xl shadow-lg border border-white/10 overflow-hidden">
                        <div className="p-6 border-b border-white/10">
                            <h2 className="text-xl font-bold text-white">System Health</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1 text-white/80">
                                    <span>Server Load</span>
                                    <span className="font-bold text-white">23%</span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-2">
                                    <div className="bg-emerald-500 h-2 rounded-full w-[23%] shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1 text-white/80">
                                    <span>Database Storage</span>
                                    <span className="font-bold text-white">45%</span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-2">
                                    <div className="bg-blue-500 h-2 rounded-full w-[45%] shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
