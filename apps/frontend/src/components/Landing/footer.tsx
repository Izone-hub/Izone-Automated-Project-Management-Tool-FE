'use client'

import { Sparkles, Twitter, Github, Linkedin } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-12 bg-background dark:bg-gray-900">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 md:flex-row md:justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="text-base font-semibold text-foreground dark:text-white font-serif">Izone</span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground dark:text-gray-400">
          <Link href="#features" className="transition-colors hover:text-foreground dark:hover:text-white">Features</Link>
          <Link href="#testimonials" className="transition-colors hover:text-foreground dark:hover:text-white">Testimonials</Link>
          <Link href="#pricing" className="transition-colors hover:text-foreground dark:hover:text-white">Pricing</Link>
          <Link href="#" className="transition-colors hover:text-foreground dark:hover:text-white">Privacy</Link>
          <Link href="#" className="transition-colors hover:text-foreground dark:hover:text-white">Terms</Link>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-4">
          <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground dark:text-gray-400 transition-colors hover:bg-secondary dark:hover:bg-gray-800 hover:text-foreground dark:hover:text-white">
            <Twitter className="h-4 w-4" />
          </Link>
          <Link href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground dark:text-gray-400 transition-colors hover:bg-secondary dark:hover:bg-gray-800 hover:text-foreground dark:hover:text-white">
            <Github className="h-4 w-4" />
          </Link>
          <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground dark:text-gray-400 transition-colors hover:bg-secondary dark:hover:bg-gray-800 hover:text-foreground dark:hover:text-white">
            <Linkedin className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mx-auto mt-8 max-w-6xl border-t border-border pt-6 text-center text-xs text-muted-foreground dark:text-gray-400">
        &copy; {new Date().getFullYear()} Izone Project Management. All rights reserved.
      </div>
    </footer>
  )
}