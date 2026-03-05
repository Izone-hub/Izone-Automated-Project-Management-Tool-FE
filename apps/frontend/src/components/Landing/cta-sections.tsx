'use client'

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useFadeIn } from "@/hooks/use-fade-in"

export function CTASection() {
  const fade = useFadeIn()

  return (
    <section className="px-6 py-20 md:py-32 bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div
        ref={fade.ref}
        className={`mx-auto max-w-3xl rounded-3xl bg-primary px-8 py-16 text-center shadow-lg transition-all duration-700 md:px-16 md:py-20
          ${fade.isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}
          dark:bg-blue-700 dark:shadow-blue-900/20`}
      >
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-primary-foreground dark:text-white tracking-tight">
          Ready to streamline your projects?
        </h2>

        {/* Subheading */}
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-primary-foreground/80 dark:text-white/80 md:text-base">
          Join thousands of teams already using Izone Project Management to work smarter. Start your free trial today.
        </p>

        {/* CTA Button */}
        <Link
          href="/signup"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-card px-7 py-3 text-sm font-medium text-foreground shadow-md transition-all hover:shadow-lg hover:bg-card/90 active:scale-[0.98] dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500"
        >
          Get Started
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}