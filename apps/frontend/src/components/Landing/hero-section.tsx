'use client'

import Link from "next/link"
import { Star, ArrowRight, ChevronRight } from "lucide-react"
import { useFadeIn } from "@/hooks/use-fade-in"

export function HeroSection() {
  const fade = useFadeIn()

  return (
    <section className="relative overflow-hidden px-6 pt-32 pb-20 md:pt-44 md:pb-32 bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      {/* Background decorative circles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/20 dark:bg-primary/10 animate-pulse" />
        <div className="absolute -bottom-20 -right-20 h-[300px] w-[300px] rounded-full bg-secondary/30 dark:bg-secondary/20 animate-pulse" />
      </div>

      {/* Main content */}
      <div
        ref={fade.ref}
        className={`relative mx-auto flex max-w-3xl flex-col items-center text-center transition-all duration-700 ${
          fade.isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-sm dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700">
          <Star className="h-3.5 w-3.5 text-amber-500" fill="currentColor" />
          Trusted by 5,000+ teams worldwide
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground dark:text-white leading-tight">
          Izone Project Management:{" "}
          <span className="text-blue-600 dark:text-blue-400 italic">Work Smarter, Not Harder</span>
        </h1>

        {/* Subheading */}
        <p className="mt-6 max-w-xl text-lg text-muted-foreground dark:text-gray-300 leading-relaxed">
          Streamline workflows, collaborate effortlessly, and manage your projects like a pro — all in one intuitive platform.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          {/* Primary CTA */}
          <Link
            href="/signin"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground shadow-md transition-all hover:shadow-lg hover:opacity-90 active:scale-[0.98] dark:bg-blue-600 dark:text-white"
          >
            Get Started
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>

          {/* Secondary CTA */}
          <a
            href="#features"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-7 py-3 text-sm font-medium text-foreground shadow-sm transition-all hover:bg-secondary active:scale-[0.98] dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            Learn More
            <ChevronRight className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
          </a>
        </div>
      </div>
    </section>
  )
}