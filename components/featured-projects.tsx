"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import axios from "axios"
import { Skeleton } from "@/components/ui/skeleton"

export default function FeaturedProjects() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Check if we have an endpoint for this, using index for now
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/campaigns`)
        if (res.data.data) {
          setProjects(res.data.data.slice(0, 3)) // Limit to 3
        } else {
          // Fallback if structure different
          setProjects(res.data.slice(0, 3))
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="text-left max-w-2xl">
            <span className="text-accent font-bold tracking-wider uppercase text-sm mb-2 block">Our Initiatives</span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 font-serif">
              Empowering Communities
            </h2>
            <p className="text-lg text-muted-foreground">
              Discover the initiatives making real differences in people's lives across the continent.
            </p>
          </div>
          <Link
            href="/projects"
            className="hidden md:inline-flex items-center text-primary font-bold hover:text-primary/80 transition group"
          >
            View All Projects
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
          </Link>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-96 rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div key={project.id} className="group flex flex-col bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border/50">
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors z-10" />
                  {project.image_path ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/storage/${project.image_path}`}
                      alt={project.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
                  )}
                  <div className="absolute top-4 left-4 z-20">
                    <span className="inline-block bg-white/90 backdrop-blur-sm text-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                      {project.category || 'Campaign'}
                    </span>
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-grow relative">
                  {/* Decorative splash */}
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-accent/5 rounded-tl-full -z-0" />

                  <h3 className="text-2xl font-bold text-foreground mb-3 font-serif z-10 group-hover:text-primary transition-colors line-clamp-2">{project.title}</h3>
                  <p className="text-muted-foreground mb-6 flex-grow z-10 leading-relaxed line-clamp-3">{project.description}</p>

                  <Link
                    href={`/campaigns/${project.slug}`}
                    className="inline-flex items-center text-primary font-bold hover:underline z-10"
                  >
                    Learn More
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {projects.length === 0 && !loading && (
          <div className="text-center py-12 text-muted-foreground">
            No campaigns found. <Link href="/start-fundraiser" className="underline text-primary">Start one today!</Link>
          </div>
        )}

        <div className="text-center mt-12 md:hidden">
          <Link
            href="/projects"
            className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:opacity-90 transition"
          >
            View All Projects
          </Link>
        </div>
      </div>
    </section>
  )
}
