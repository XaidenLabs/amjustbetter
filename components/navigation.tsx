"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/ggnf-logo.jpg"
              alt="GGNF - Good God Never Fails"
              width={48}
              height={48}
              className="rounded"
            />
            <span className="font-bold text-lg text-primary hidden sm:inline">GGNF</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-foreground hover:text-primary transition">
              Home
            </Link>
            <Link href="/projects" className="text-foreground hover:text-primary transition">
              Projects
            </Link>
            <Link href="/blog" className="text-foreground hover:text-primary transition">
              Blog
            </Link>
            <Link href="/volunteer" className="text-foreground hover:text-primary transition">
              Volunteer
            </Link>
            <Link href="/login" className="text-foreground hover:text-primary transition font-medium">
              Login
            </Link>
            <Link
              href="/register"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition"
            >
              Get Started
            </Link>
            <Link
              href="/donate"
              className="bg-accent text-accent-foreground px-4 py-2 rounded-lg hover:opacity-90 transition"
            >
              Donate
            </Link>
            <Link href="/admin/login" className="text-foreground hover:text-primary transition text-sm font-semibold">
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 hover:bg-muted rounded-lg transition">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/" className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg transition">
              Home
            </Link>
            <Link href="/projects" className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg transition">
              Projects
            </Link>
            <Link href="/blog" className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg transition">
              Blog
            </Link>
            <Link href="/volunteer" className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg transition">
              Volunteer
            </Link>
            <Link href="/login" className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg transition">
              Login
            </Link>
            <Link href="/register" className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg transition">
              Get Started
            </Link>
            <Link
              href="/donate"
              className="block px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition"
            >
              Donate
            </Link>
            <Link
              href="/admin/login"
              className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg transition font-semibold"
            >
              Admin
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
