"use client"

import CampaignWizard from "@/components/campaign/CampaignWizard"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { motion } from "framer-motion"

export default function StartFundraiserPage() {
    return (
        <DashboardLayout>
            <div className="py-12 px-4 md:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Start a Fundraiser</h1>
                        <p className="text-muted-foreground">It only takes a few minutes to start making a difference.</p>
                    </div>

                    <CampaignWizard />
                </motion.div>
            </div>
        </DashboardLayout>
    )
}
