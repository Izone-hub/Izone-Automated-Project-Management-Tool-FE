'use client'

import { Separator } from "@/components/ui/separator"

export default function SocialProof() {
  const companies = [
    "ACME Corp",
    "Globex",
    "Soylent",
    "Initech",
    "Umbrella",
  ]

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <p className="text-center text-sm font-medium uppercase tracking-widest mb-8 text-muted-foreground dark:text-gray-400">
          Trusted by teams worldwide
        </p>

        {/* Company Logos / Names */}
        <div className="flex flex-wrap justify-center items-center gap-10 opacity-70">
          {companies.map((company) => (
            <div
              key={company}
              className="text-lg sm:text-xl font-semibold text-muted-foreground dark:text-gray-300"
            >
              {company}
            </div>
          ))}
        </div>

        {/* Separator */}
        <Separator className="mt-16 border-border dark:border-gray-700" />
      </div>
    </section>
  )
}