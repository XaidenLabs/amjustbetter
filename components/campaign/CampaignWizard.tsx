"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Upload, ChevronRight, ChevronLeft, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { useAuth } from "@/lib/auth-context"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export default function CampaignWizard() {
    const router = useRouter()
    // const { token } = useAuth() // Need to ensure we send auth token
    const { toast } = useToast()

    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        title: "",
        goal_amount: "",
        description: "",
        beneficiary_action: "myself", // Default
        beneficiary_email: "",
        image: null as File | null,
        imagePreview: "",
    })
    const [loading, setLoading] = useState(false)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setFormData((prev) => ({
                ...prev,
                image: file,
                imagePreview: URL.createObjectURL(file), // Provide preview
            }))
        }
    }

    const handleBeneficiaryChange = (value: string) => {
        setFormData((prev) => ({ ...prev, beneficiary_action: value }))
    }

    const nextStep = () => setStep((prev) => prev + 1)
    const prevStep = () => setStep((prev) => prev - 1)

    const handleSubmit = async () => {
        setLoading(true)
        try {
            const data = new FormData()
            data.append("title", formData.title)
            data.append("goal_amount", formData.goal_amount)
            data.append("description", formData.description)
            data.append("beneficiary_action", formData.beneficiary_action)
            if (formData.beneficiary_action === 'someone_else' && formData.beneficiary_email) {
                data.append("beneficiary_email", formData.beneficiary_email)
            }
            if (formData.image) {
                data.append("image", formData.image)
            }

            // Axios call
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/campaigns`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Simple auth for MVP
                }
            })

            toast({
                title: "Success!",
                description: "Your campaign has been published.",
            })

            router.push(`/campaigns/${response.data.slug}`) // Redirect to new campaign
        } catch (error: any) {
            console.error(error)
            toast({
                title: "Error",
                description: error.response?.data?.message || "Something went wrong.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, x: 10 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -10 },
    }

    return (
        <div className="max-w-2xl mx-auto w-full">
            <div className="mb-8 flex justify-between items-center text-sm font-medium text-muted-foreground">
                <span className={step >= 1 ? "text-primary" : ""}>Step 1: Details</span>
                <span className={step >= 2 ? "text-primary" : ""}>Step 2: Story & Media</span>
                <span className={step >= 3 ? "text-primary" : ""}>Step 3: Review</span>
            </div>

            {/* Step Indicators (Simple Bar) */}
            <div className="w-full h-1 bg-secondary mb-8 rounded-full overflow-hidden">
                <div
                    className="h-full bg-primary transition-all duration-300 ease-in-out"
                    style={{ width: `${(step / 3) * 100}%` }}
                />
            </div>

            <Card className="border-0 shadow-lg bg-white/5 backdrop-blur-lg border-white/10">
                <CardHeader>
                    <CardTitle>
                        {step === 1 && "Let's start with the basics"}
                        {step === 2 && "Tell your story"}
                        {step === 3 && "Review and Launch"}
                    </CardTitle>
                    <CardDescription>
                        {step === 1 && "Give your campaign a title and set a goal."}
                        {step === 2 && "Upload a photo and describe why you're fundraising."}
                        {step === 3 && "You're almost there! Check everything before publishing."}
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 min-h-[300px]">

                    {step === 1 && (
                        <motion.div initial="hidden" animate="visible" exit="exit" variants={fadeIn} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Campaign Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    placeholder="e.g. Help Save the Community Garden"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="bg-background/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="goal_amount">Goal Amount ($)</Label>
                                <Input
                                    id="goal_amount"
                                    name="goal_amount"
                                    type="number"
                                    placeholder="5000"
                                    value={formData.goal_amount}
                                    onChange={handleInputChange}
                                    className="bg-background/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Who are you raising funds for?</Label>
                                <div className="flex gap-4">
                                    <Button
                                        variant={formData.beneficiary_action === 'myself' ? 'default' : 'outline'}
                                        onClick={() => handleBeneficiaryChange('myself')}
                                        className="flex-1"
                                        type="button"
                                    >
                                        Myself
                                    </Button>
                                    <Button
                                        variant={formData.beneficiary_action === 'someone_else' ? 'default' : 'outline'}
                                        onClick={() => handleBeneficiaryChange('someone_else')}
                                        className="flex-1"
                                        type="button"
                                    >
                                        Someone Else
                                    </Button>
                                </div>
                            </div>

                            {formData.beneficiary_action === 'someone_else' && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
                                    <Label htmlFor="beneficiary_email">Beneficiary Email</Label>
                                    <Input
                                        id="beneficiary_email"
                                        name="beneficiary_email"
                                        type="email"
                                        placeholder="beneficiary@example.com"
                                        value={formData.beneficiary_email}
                                        onChange={handleInputChange}
                                        className="bg-background/50"
                                    />
                                    <p className="text-xs text-muted-foreground">We&apos;ll send them an invite to accept the funds.</p>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div initial="hidden" animate="visible" exit="exit" variants={fadeIn} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="description">Story</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="Tell us why this matters..."
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="min-h-[150px] bg-background/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="image">Cover Image</Label>
                                <div className={`mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-10 ${formData.imagePreview ? 'bg-cover bg-center' : ''}`} style={formData.imagePreview ? { backgroundImage: `url(${formData.imagePreview})` } : {}}>
                                    <div className={`text-center ${formData.imagePreview ? 'bg-black/50 p-4 rounded-lg backdrop-blur-sm' : ''}`}>
                                        <Upload className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                                        <div className="mt-4 flex text-sm leading-6 text-gray-400 justify-center">
                                            <Label
                                                htmlFor="file-upload"
                                                className="relative cursor-pointer rounded-md font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary/80"
                                            >
                                                <span>Upload a file</span>
                                                <Input id="file-upload" name="image" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                            </Label>
                                            <p className="pl-1 text-gray-400">or drag and drop</p>
                                        </div>
                                        <p className="text-xs leading-5 text-gray-400">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div initial="hidden" animate="visible" exit="exit" variants={fadeIn} className="space-y-6">
                            <div className="rounded-lg border border-white/10 p-4 bg-white/5 space-y-3">
                                <h3 className="font-semibold text-lg">{formData.title || "Untitled Campaign"}</h3>
                                <p className="text-sm text-gray-400 line-clamp-3">{formData.description || "No description provided."}</p>
                                <div className="flex justify-between text-sm">
                                    <span>Goal: <span className="font-bold text-primary">${formData.goal_amount}</span></span>
                                    <span>For: {formData.beneficiary_action === 'myself' ? 'Myself' : 'Someone Else'}</span>
                                </div>
                                {formData.imagePreview && (
                                    <div className="relative h-40 w-full rounded-md overflow-hidden">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={formData.imagePreview} alt="Preview" className="object-cover w-full h-full" />
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-2 p-3 rounded-md bg-yellow-500/10 border border-yellow-500/20 text-yellow-200 text-sm">
                                <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
                                Your campaign will be published immediately after this step.
                            </div>
                        </motion.div>
                    )}

                </CardContent>
                <CardFooter className="flex justify-between">
                    {step > 1 ? (
                        <Button variant="ghost" onClick={prevStep}>
                            <ChevronLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                    ) : (<div></div>)}

                    {step < 3 ? (
                        <Button onClick={nextStep} disabled={!formData.title && step === 1}>
                            Next <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit} disabled={loading} className="bg-primary text-primary-foreground hover:bg-primary/90">
                            {loading ? "Publishing..." : "Launch Campaign"} {loading ? null : <Check className="ml-2 h-4 w-4" />}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}
