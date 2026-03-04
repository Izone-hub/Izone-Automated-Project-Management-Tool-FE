'use client'

import { Star } from "lucide-react"
import { useFadeIn } from "@/hooks/use-fade-in"
import Image from "next/image"

interface Testimonial {
  quote: string
  name: string
  role: string
  avatar: string
}

interface TestimonialCardProps {
  testimonial: Testimonial
  index: number
}

export function TestimonialCard({ testimonial, index }: TestimonialCardProps) {
  const fade = useFadeIn()

  return (
    <div
      ref={fade.ref}
      className={`flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-500 dark:bg-gray-800 dark:border-gray-700 ${
        fade.isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      {/* Star rating */}
      <div className="mb-4 flex gap-0.5">
        {Array.from({ length: 5 }).map((_, j) => (
          <Star key={j} className="h-4 w-4 text-amber-400" fill="currentColor" />
        ))}
      </div>

      {/* Testimonial quote */}
      <blockquote className="flex-1 text-sm leading-relaxed text-muted-foreground dark:text-gray-300">
        "{testimonial.quote}"
      </blockquote>

      {/* User info */}
      <div className="mt-6 flex items-center gap-3 border-t border-border pt-5 dark:border-gray-700">
        <Image
          src={testimonial.avatar}
          alt={testimonial.name}
          width={24}
          height={24}
          className="h-6 w-6 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-semibold text-foreground dark:text-gray-100">{testimonial.name}</p>
          <p className="text-xs text-muted-foreground dark:text-gray-400">{testimonial.role}</p>
        </div>
      </div>
    </div>
  )
}