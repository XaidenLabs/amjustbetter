"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Share2, Globe, Edit, DollarSign, Users, TrendingUp } from "lucide-react"
import UpdateEditor from "@/components/updates/UpdateEditor"
import ShareModal from "@/components/donation/ShareModal"

export default function CampaignManagementPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id

    // Using 'any' for speed, ideal would be proper interfaces
    const [campaign, setCampaign] = useState<any>(null)
    const [updates, setUpdates] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    // Move fetch to function for reusability
    const fetchCampaignData = async () => {
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                router.push('/login')
                return
            }

            // We need an endpoint that gets campaign by ID for the OWNER
            // Reuse public endpoint for now, but verify ownership on client or add specific endpoint?
            // Using public endpoint logic is fine for reading, assuming we just want basic data.
            // But we actually need ID lookup, not Slug lookup (dashboard usually links by ID).
            // Let's assume public slug endpoint -> we might need to find slug or just add a direct ID endpoint.
            // Actually, in `CampaignController` I have `show($slug)`. I don't have `showById`.
            // Let's try to fetch user campaigns and find this one, or just add a `GET /api/campaigns/{id}` endpoint?
            // Existing `CampaignController` resource usually implies `show` is by ID if not customized.
            // Wait, my `show` method uses `$slug`.

            // Allow fetching by ID too? Or just fix the Dashboard link to be by SLUG?
            // Using ID in dashboard URL `.../campaigns/[id]` is common.
            // Let's use a new endpoint or careful logic. 
            // IMPROVEMENT: Let's assume I modify the Controller to accept ID or Slug, or just add `GET /api/campaigns/manage/{id}`?
            // For now, let's try to fetch all user campaigns and filter? No, inefficient.
            // Let's add `GET /api/campaigns/{id}` support in backend for convenience?
            // OR change dashboard to link to `/dashboard/campaigns/[slug]`. 
            // ID is more robust for editing (slugs might change).

            // Decision: Add `find` method to Controller or similar.
            // Let's assume I add `GET /api/campaigns/id/{id}` for management. 

            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/campaigns/id/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            setCampaign(res.data)

            if (res.data.id) {
                const updatesRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/campaigns/${res.data.id}/updates`)
                setUpdates(updatesRes.data)
            }

        } catch (error) {
            console.error(error)
            // fallback or error
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id) fetchCampaignData()
    }, [id])

    if (loading) {
        return (
            <DashboardLayout>
                <div className="p-8 space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </DashboardLayout>
        )
    }

    if (!campaign) {
        return (
            <DashboardLayout>
                <div className="p-8 text-center text-gray-400">Campaign not found.</div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto py-6 px-4 md:px-8">
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/user')}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                            {campaign.title}
                        </h1>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${campaign.status === 'PUBLISHED' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                {campaign.status}
                            </span>
                            • Created on {new Date(campaign.created_at).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="ml-auto flex gap-2">
                        <Button className="bg-white/10 text-white hover:bg-white/20 border-0" size="sm" onClick={() => window.open(`/campaigns/${campaign.slug}`, '_blank')}>
                            <Globe className="h-4 w-4 mr-2" />
                            View Public Page
                        </Button>
                        <ShareModal url={`${window.location.origin}/campaigns/${campaign.slug}`} title={campaign.title} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="bg-white/5 border-white/10">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Raised</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">${campaign.total_raised?.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground mt-1">of ${campaign.goal_amount?.toLocaleString()} goal</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/5 border-white/10">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Donors</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">{campaign.donations?.length || 0}</div>
                            <p className="text-xs text-muted-foreground mt-1">Unique supporters</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/5 border-white/10">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Progress</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-emerald-400">
                                {Math.min(100, Math.round(((campaign.total_raised || 0) / campaign.goal_amount) * 100))}%
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Funded</p>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="updates" className="space-y-6">
                    <TabsList className="bg-white/5 border border-white/10">
                        <TabsTrigger value="updates">Updates</TabsTrigger>
                        <TabsTrigger value="donations">Donations</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="updates" className="space-y-6">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <h2 className="text-lg font-semibold mb-4">Post an Update</h2>
                            <UpdateEditor
                                campaignId={campaign.id}
                                onUpdatePosted={() => fetchCampaignData()}
                            />
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Past Updates</h3>
                            {updates.length === 0 ? (
                                <p className="text-muted-foreground italic">No updates posted yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {updates.map((update) => (
                                        <div key={update.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold">{update.title}</h4>
                                                <span className="text-xs text-muted-foreground">{new Date(update.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-sm text-gray-300 whitespace-pre-wrap">{update.content}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="donations">
                        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                            <div className="p-4 border-b border-white/10 font-semibold grid grid-cols-12 gap-4 text-sm text-muted-foreground">
                                <div className="col-span-4">Donor</div>
                                <div className="col-span-3">Amount</div>
                                <div className="col-span-3">Date</div>
                                <div className="col-span-2">Action</div>
                            </div>
                            <div className="divide-y divide-white/10">
                                {campaign.donations && campaign.donations.length > 0 ? (
                                    campaign.donations.map((d: any) => (
                                        <div key={d.id} className="p-4 grid grid-cols-12 gap-4 text-sm items-center">
                                            <div className="col-span-4 font-medium text-white">{d.is_anonymous ? 'Anonymous' : d.donor_name}</div>
                                            <div className="col-span-3 text-emerald-400 font-bold">${d.amount_gross}</div>
                                            <div className="col-span-3 text-gray-400">{new Date(d.created_at).toLocaleDateString()}</div>
                                            <div className="col-span-2">
                                                {/* Future: Refund, Thank you note */}
                                                <Button variant="ghost" size="sm" className="h-6 text-xs">Details</Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-muted-foreground">No donations yet.</div>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="settings">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
                            <p className="text-muted-foreground mb-4">Campaign settings (edit title, goal, description) coming soon.</p>
                            <Button variant="outline" disabled>Edit Campaign</Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    )
}
