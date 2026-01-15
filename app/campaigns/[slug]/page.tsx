"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Share2, Heart, AlertCircle, Clock, Trophy, Code } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import DonationWizard from "@/components/donation/DonationWizard"
import ShareModal from "@/components/donation/ShareModal"
import UpdateEditor from "@/components/updates/UpdateEditor"

export default function CampaignPage() {
    const params = useParams()
    const router = useRouter()
    const slug = params.slug

    // Define type for campaign
    interface Donation {
        id: string;
        donor_name: string;
        amount_gross: number;
        created_at: string;
        frequency: string;
        is_anonymous: boolean;
        comment: string | null;
    }

    interface Campaign {
        id: string;
        title: string;
        description: string;
        goal_amount: number;
        total_raised: number;
        image_path: string | null;
        organizer: {
            name: string;
        };
        created_at: string;
        donations?: Donation[];
    }

    interface CampaignUpdate {
        id: string;
        title: string;
        content: string;
        created_at: string;
        image_path: string | null;
    }

    const [campaign, setCampaign] = useState<Campaign | null>(null)
    const [updates, setUpdates] = useState<CampaignUpdate[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        if (!slug) return

        const fetchCampaign = async () => {
            try {
                // Assuming public route
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/campaigns/${slug}`)
                setCampaign(response.data)

                if (response.data.id) {
                    const updatesRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/campaigns/${response.data.id}/updates`)
                    setUpdates(updatesRes.data)
                }
            } catch (err) {
                console.error(err)
                setError("Failed to load campaign. It might not exist or has been removed.")
            } finally {
                setLoading(false)
            }
        }

        fetchCampaign()
    }, [slug])

    if (loading) {
        return (
            <DashboardLayout>
                <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
                    <Skeleton className="h-[400px] w-full rounded-xl" />
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    if (error || !campaign) {
        return (
            <DashboardLayout>
                <div className="max-w-4xl mx-auto py-20 px-4 text-center">
                    <Alert variant="destructive" className="mb-4 max-w-lg mx-auto">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                    <Button onClick={() => router.push('/dashboard/user')}>Return to Dashboard</Button>
                </div>
            </DashboardLayout>
        )
    }

    const percentage = Math.min(100, Math.round((campaign.total_raised / campaign.goal_amount) * 100))

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto py-8 px-4 md:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Media & Story */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="rounded-xl overflow-hidden bg-black/20 aspect-video relative">
                            {campaign.image_path ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/storage/${campaign.image_path}`}
                                    alt={campaign.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-white/5">
                                    No Image Provided
                                </div>
                            )}
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold mb-2">{campaign.title}</h1>
                            <div className="flex items-center text-sm text-muted-foreground mb-6">
                                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold mr-2">
                                    {campaign.organizer.name.charAt(0).toUpperCase()}
                                </div>
                                <span>Organized by <span className="text-foreground font-medium">{campaign.organizer.name}</span></span>
                                <span className="mx-2">•</span>
                                <span>{new Date(campaign.created_at).toLocaleDateString()}</span>
                            </div>

                            <Card className="bg-white/5 border-white/10">
                                <CardContent className="pt-6">
                                    <h3 className="text-xl font-semibold mb-4">About this fundraiser</h3>
                                    <p className="whitespace-pre-wrap leading-relaxed text-gray-300">
                                        {campaign.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Updates Section */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold">Updates</h2>

                            <UpdateEditor
                                campaignId={campaign.id}
                                onUpdatePosted={() => {
                                    // Refresh updates
                                    axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/campaigns/${campaign.id}/updates`)
                                        .then(res => setUpdates(res.data))
                                }}
                            />

                            <div className="space-y-8 relative border-l-2 border-white/10 ml-4 pl-8 py-2">
                                {updates.map((update) => (
                                    <div key={update.id} className="relative">
                                        <div className="absolute -left-[41px] top-0 h-5 w-5 rounded-full bg-primary border-4 border-background" />
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-semibold">{update.title}</h3>
                                                <span className="text-sm text-muted-foreground">{new Date(update.created_at).toLocaleDateString()}</span>
                                            </div>
                                            {update.image_path && (
                                                <div className="rounded-lg overflow-hidden my-3 aspect-video bg-black/50">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/storage/${update.image_path}`}
                                                        alt={update.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}
                                            <p className="text-gray-300 whitespace-pre-wrap">{update.content}</p>
                                        </div>
                                    </div>
                                ))}
                                {updates.length === 0 && (
                                    <div className="text-muted-foreground">No updates yet.</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Donation Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <Card className="border-0 shadow-2xl bg-white/10 backdrop-blur-md border-t border-white/20">
                                <CardContent className="p-6 space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-bold">${campaign.total_raised.toLocaleString()}</span>
                                            <span className="text-muted-foreground">raised of ${campaign.goal_amount.toLocaleString()} goal</span>
                                        </div>
                                        <Progress value={percentage} className="h-2" />
                                        <p className="text-xs text-right text-muted-foreground">{percentage}% funded</p>
                                    </div>

                                    <div className="space-y-3">
                                        <DonationWizard campaignId={campaign.id} campaignTitle={campaign.title} />
                                        <ShareModal url={`https://yoursite.com/campaigns/${slug}`} title={campaign.title} />
                                    </div>

                                    <div className="pt-4 border-t border-white/10">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                            <Heart className="h-4 w-4 text-pink-500" />
                                            <span><strong>{campaign.donations?.length || 0}</strong> recent donations</span>
                                        </div>

                                        <div className="space-y-4">
                                            {campaign.donations?.map((donation) => (
                                                <div key={donation.id} className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold">
                                                            {donation.is_anonymous ? 'A' : (donation.donor_name ? donation.donor_name.charAt(0).toUpperCase() : 'G')}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-white">
                                                                {donation.is_anonymous ? 'Anonymous' : (donation.donor_name || 'Guest')}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                                <Clock className="h-3 w-3" />
                                                                {new Date(donation.created_at).toLocaleDateString()}
                                                                {new Date(donation.created_at).toLocaleDateString()}
                                                                {donation.frequency === 'monthly' && <span className="bg-primary/20 text-primary text-[10px] px-1 rounded ml-1">Monthly</span>}
                                                            </p>
                                                            {donation.comment && (
                                                                <p className="text-sm text-gray-300 mt-1 italic">"{donation.comment}"</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span className="font-bold text-emerald-400">${Number(donation.amount_gross).toFixed(2)}</span>
                                                </div>
                                            ))}
                                            {(!campaign.donations || campaign.donations.length === 0) && (
                                                <p className="text-sm text-muted-foreground text-center py-2">Be the first to donate!</p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
