'use client'

import { TestimonialCard } from "./testimonial-card"

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "Head of Product, Acme Co",
    avatar: "/globe.svg",
    quote:
      "Izone Project Management transformed how our team collaborates. We shipped faster and more efficiently.",
  },
  {
    name: "James Rivera",
    role: "Engineering Lead, NovaTech",
    avatar: "/globe.svg",
    quote:
      "The analytics give us real-time visibility without building custom dashboards. Game changer.",
  },
  {
    name: "Priya Kapoor",
    role: "CEO, LaunchPad Studio",
    avatar: "/globe.svg",
    quote:
      "Our workflow is smoother and our team enjoys using Izone. The AI assistant is genuinely useful.",
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="px-6 py-20 md:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Testimonials</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-foreground tracking-tight">
            Loved by teams everywhere
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={i} testimonial={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}