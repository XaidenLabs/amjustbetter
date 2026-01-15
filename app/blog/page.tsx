"use client"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import Link from "next/link"
import { blogPosts } from "@/lib/blog-data"
import { Calendar, ArrowRight } from "lucide-react"

export default function BlogPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        <section className="bg-secondary text-secondary-foreground py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog & News</h1>
            <p className="text-lg text-secondary-foreground/90">
              Stories, updates, and insights from GGNF&apos;s work in the field.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold">
                All Posts
              </span>
              {Array.from(new Set(blogPosts.map((post) => post.category))).map((category) => (
                <span
                  key={category}
                  className="bg-muted text-muted-foreground px-4 py-2 rounded-full text-sm font-semibold hover:bg-primary hover:text-primary-foreground cursor-pointer transition"
                >
                  {category}
                </span>
              ))}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-card rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                        {post.category}
                      </span>
                    </div>
                    {post.gallery && post.gallery.length > 1 && (
                      <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-xs">
                        +{post.gallery.length - 1} photos
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                      <Calendar className="h-4 w-4" />
                      <span>{post.date}</span>
                    </div>
                    <h3 className="text-xl font-bold text-card-foreground mb-2 group-hover:text-primary transition">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
                    >
                      Read More
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
