'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import axios from 'axios'
import { Heart, CreditCard, ExternalLink } from "lucide-react"

export default function EmbedCampaignPage({ params }: { params: { slug: string } }) {
    const [campaign, setCampaign] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                // In a real embed, we might use a specific public endpoint or the same one with CORS enabled
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/campaigns/${params.slug}`)
                setCampaign(response.data)
            } catch (error) {
                console.error("Failed to load campaign", error)
            } finally {
                setLoading(false)
            }
        }
        fetchCampaign()
    }, [params.slug])

    if (loading) return <div className="p-4 text-center">Loading...</div>
    if (!campaign) return <div className="p-4 text-center">Campaign not found</div>

    const progress = Math.min((campaign.total_raised / campaign.goal_amount) * 100, 100)

    const handleDonate = () => {
        window.open(`${window.location.origin}/campaigns/${params.slug}`, '_blank')
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-transparent">
            {/* The bg-transparent allows the iframe explicitly to fit into host site design if needed, 
                but usually we want a card look. */}
            <Card className="w-full max-w-sm border shadow-xl bg-white text-gray-900">
                <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-lg leading-tight truncate" title={campaign.title}>
                        {campaign.title}
                    </CardTitle>
                </CardHeader>
                {campaign.image_url && (
                    <div className="w-full h-32 overflow-hidden bg-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={campaign.image_url} alt={campaign.title} className="w-full h-full object-cover" />
                    </div>
                )}
                <CardContent className="p-4 space-y-3">
                    <div className="space-y-1">
                        <div className="flex justify-between text-sm font-semibold">
                            <span>${Number(campaign.total_raised).toLocaleString()}</span>
                            <span className="text-gray-500">of ${Number(campaign.goal_amount).toLocaleString()}</span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${progress}%` }} />
                        </div>
                    </div>

                    {/* Top Donors Toggle/Preview could go here but for small embed, keeping it simple */}
                </CardContent>
                <CardFooter className="p-4 pt-0">
                    <Button onClick={handleDonate} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold">
                        Donate Now <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
