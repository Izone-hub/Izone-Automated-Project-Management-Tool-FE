'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { Sparkles, Menu, X } from "lucide-react"

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-card/80 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-foreground font-serif">
            Izone
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#testimonials" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Testimonials
          </a>
          <a href="#pricing" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Pricing
          </a>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-full px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
          >
            Get Started
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg md:hidden text-foreground"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-card px-6 pb-6 pt-4 md:hidden">
          <div className="flex flex-col gap-4">
            <a href="#features" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-muted-foreground">Features</a>
            <a href="#testimonials" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-muted-foreground">Testimonials</a>
            <a href="#pricing" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-muted-foreground">Pricing</a>
            <Link href="/login" className="rounded-full bg-primary px-5 py-2.5 text-center text-sm font-medium text-primary-foreground">
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}