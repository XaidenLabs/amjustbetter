'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Share2, Facebook, Twitter, Linkedin, Link as LinkIcon } from "lucide-react"
import { useState } from "react"

interface ShareModalProps {
    url: string
    title: string
}

export default function ShareModal({ url, title }: ShareModalProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const shareLinks = [
        { name: 'Facebook', icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
        { name: 'Twitter', icon: Twitter, href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}` },
        { name: 'LinkedIn', icon: Linkedin, href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}` },
    ]

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-white/10 text-white hover:bg-white/20 border-0">
                    <Share2 className="mr-2 h-4 w-4" /> Share
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white text-gray-900">
                <DialogHeader>
                    <DialogTitle>Share this campaign</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex justify-center gap-4">
                        {shareLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition"
                            >
                                <link.icon className="h-6 w-6 text-gray-700" />
                            </a>
                        ))}
                    </div>
                    <div className="flex items-center space-x-2 mt-4">
                        <div className="grid flex-1 gap-2">
                            <input
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                readOnly
                                value={url}
                            />
                        </div>
                        <Button type="submit" size="sm" className="px-3" onClick={handleCopy}>
                            {copied ? 'Copied!' : <LinkIcon className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
