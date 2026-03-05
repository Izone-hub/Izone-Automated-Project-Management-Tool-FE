'use client'

import { Navigation } from "@/components/Landing/navigation"
import { HeroSection } from "@/components/Landing/hero-section"
import { FeaturesSection } from "@/components/Landing/features-section"
import { TestimonialsSection } from "@/components/Landing/testimonials-section"
import { CTASection } from "@/components/Landing/cta-sections"
import { Footer } from "@/components/Landing/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}