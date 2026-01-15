'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-background pt-20">
      {/* Decorative colored blobs/strokes */}
      <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-bl from-accent/10 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-[300px] bg-gradient-to-tr from-primary/10 to-transparent pointer-events-none" />

      {/* Artistic Brush Stroke Decoration (CSS shapes for now) */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 -left-24 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* Text Content */}
          <div className="space-y-8 text-center lg:text-left order-2 lg:order-1">
            <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span>Transforming Lives</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
              A world where no <span className="text-primary italic">child's life</span> is torn apart by war.
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Every five seconds one child dies in Africa due to malnutrition and related diseases, and you can help!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Link
                href="/donate"
                className="inline-flex items-center justify-center bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold text-lg hover:bg-primary/90 transition shadow-lg shadow-primary/25"
              >
                Donate Now
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center justify-center bg-white text-foreground px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition border-2 border-border shadow-sm"
              >
                Discover More
              </Link>
            </div>

            {/* Stats or Trust Indicators could go here */}
            <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 opacity-80">
              <div className="text-center lg:text-left">
                <p className="text-3xl font-bold text-secondary">288+</p>
                <p className="text-sm text-muted-foreground">Children Saved</p>
              </div>
              <div className="w-px h-10 bg-border"></div>
              <div className="text-center lg:text-left">
                <p className="text-3xl font-bold text-accent">150+</p>
                <p className="text-sm text-muted-foreground">Communities</p>
              </div>
            </div>

          </div>

          {/* Image Content */}
          <div className="relative order-1 lg:order-2 flex justify-center items-center">
            <div className="relative w-full max-w-[600px] aspect-square">
              {/* Abstract background behind image */}
              <div className="absolute inset-0 bg-accent/20 rounded-full blur-[100px] scale-90" />

              <img
                src="/african-map-child.png"
                alt="Artistic map of Africa with child's portrait"
                className="w-full h-full object-contain relative z-10 drop-shadow-2xl hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Floating elements/decorations */}
              <div className="absolute top-10 right-10 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl z-20 animate-bounce delay-700 hidden sm:block">
                <span className="text-xs font-bold uppercase text-primary tracking-wider">Urgent Cause</span>
                <p className="font-semibold text-foreground">Clean Water Access</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
