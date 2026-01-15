'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import axios from 'axios'

interface UpdateEditorProps {
    campaignId: string
    onUpdatePosted: () => void
}

export default function UpdateEditor({ campaignId, onUpdatePosted }: UpdateEditorProps) {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [image, setImage] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData()
        formData.append('title', title)
        formData.append('content', content)
        if (image) formData.append('image', image)

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/campaigns/${campaignId}/updates`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    // Authorization token should be handled globally or passed here if not automatic
                    // Assuming global interceptor or cookie session
                }
            })
            setTitle('')
            setContent('')
            setImage(null)
            onUpdatePosted()
        } catch (error) {
            console.error('Failed to post update', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border border-white/10 rounded-lg bg-white/5">

            <Input
                placeholder="Update Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="bg-white/10 border-white/10 text-white placeholder:text-white/50"
            />
            <Textarea
                placeholder="Share the latest news..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="bg-white/10 border-white/10 text-white placeholder:text-white/50 min-h-[100px]"
            />
            <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="bg-white/10 border-white/10 text-white file:text-white file:bg-white/10 file:border-0 file:rounded-md file:mr-4 file:px-2 file:py-1 cursor-pointer"
            />
            <Button disabled={loading} type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                {loading ? 'Posting...' : 'Post Update'}
            </Button>
        </form>
    )
}
