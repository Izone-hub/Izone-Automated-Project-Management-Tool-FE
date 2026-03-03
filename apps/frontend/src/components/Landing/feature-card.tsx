'use client'

import { useFadeIn } from "@/hooks/use-fade-in"

export function FeatureCard({ feature, index }: any) {
  const fade = useFadeIn()
  const Icon = feature.icon

  return (
    <div
      ref={fade.ref}
      className={`group rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-500 hover:shadow-lg hover:-translate-y-0.5 ${
        fade.isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-secondary transition-colors group-hover:bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
    </div>
  )
}