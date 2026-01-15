const impacts = [
  { number: '2,500+', label: 'Students Educated' },
  { number: '1,200+', label: 'People Served' },
  { number: '50+', label: 'Active Projects' },
  { number: '5,000+', label: 'Volunteers' }
]

export default function ImpactSection() {
  return (
    <section className="relative py-16 md:py-24 bg-card overflow-hidden">
      {/* Abstract decorations */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center space-x-2 bg-secondary/10 text-secondary px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <span>Our Reach</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 font-serif">
            Making a <span className="text-primary italic">Measurable</span> Difference
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We believe in transparency and results. Here is the impact we've created together with our community.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {impacts.map((impact, index) => (
            <div key={index} className="group relative bg-background border-2 border-border/50 rounded-2xl p-8 text-center hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
              <p className="relative text-4xl md:text-5xl font-bold text-primary mb-3 font-serif">{impact.number}</p>
              <p className="relative text-muted-foreground font-medium uppercase tracking-wide text-sm">{impact.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
