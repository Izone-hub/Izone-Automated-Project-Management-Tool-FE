'use client'

import { Zap, BarChart3, Shield, Sparkles } from "lucide-react"
import { FeatureCard } from "./feature-card"

const FEATURES = [
  {
    icon: Zap,
    title: "Lightning-fast workflows",
    description:
      "Automate repetitive tasks and focus on what matters. Our smart engine handles the rest.",
  },
  {
    icon: BarChart3,
    title: "Real-time analytics",
    description:
      "Instant insights into team performance with live dashboards and actionable reports.",
  },
  {
    icon: Shield,
    title: "Enterprise-grade security",
    description:
      "Data protected with end-to-end encryption, SSO, and compliance at every level.",
  },
  {
    icon: Sparkles,
    title: "AI-powered assistance",
    description:
      "Smart suggestions guide your decisions — from planning to execution, stay ahead.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="px-6 py-20 md:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Features</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-foreground tracking-tight">
            Everything your team needs
          </h2>
          <p className="mt-4 text-md md:text-lg text-muted-foreground leading-relaxed">
            Tools designed for modern teams to collaborate, automate, and succeed together.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={i} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}