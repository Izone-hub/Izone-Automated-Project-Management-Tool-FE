'use client'

import { Star } from "lucide-react"
import { useFadeIn } from "@/hooks/use-fade-in"
import Image from "next/image"

export function TestimonialCard({ testimonial, index }: any) {
  const fade = useFadeIn()

  return (
    <div
      ref={fade.ref}
      className={`flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-500 ${
        fade.isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <div className="mb-4 flex gap-0.5">
        {Array.from({ length: 5 }).map((_, j) => (
          <Star key={j} className="h-4 w-4 text-amber-400" fill="currentColor" />
        ))}
      </div>

      <blockquote className="flex-1 text-sm leading-relaxed text-muted-foreground">
        "{testimonial.quote}"
      </blockquote>

      <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
        <Image src={testimonial.avatar} alt={testimonial.name} width={6} height={6} className="h-6 w-6 rounded-full object-cover" />
        <div>
          <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
          <p className="text-xs text-muted-foreground">{testimonial.role}</p>
        </div>
      </div>
    </div>
  )
}