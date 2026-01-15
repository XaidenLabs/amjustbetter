import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function CallToAction() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background with earthy gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/90" />

      {/* Abstract overlay patterns */}
      <div className="absolute inset-0 opacity-10 bg-[url('/noise.png')] mix-blend-overlay" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white font-serif tracking-tight">
          Ready to Make a Difference?
        </h2>
        <p className="text-lg md:text-xl mb-10 text-white/90 max-w-2xl mx-auto leading-relaxed">
          Whether you want to donate, volunteer, or simply learn more about our work, we welcome you to join our mission to empower the future.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center">
          <Link
            href="/donate"
            className="inline-flex items-center justify-center bg-accent text-accent-foreground px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg"
          >
            Donate Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <Link
            href="/volunteer"
            className="inline-flex items-center justify-center bg-transparent text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition border-2 border-white/30 backdrop-blur-sm"
          >
            Volunteer With Us
          </Link>
        </div>
      </div>
    </section>
  )
}
