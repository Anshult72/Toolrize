"use client";

import { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/85 backdrop-blur-2xl border-b border-border/50">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
        <div className="flex h-[72px] items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group" aria-label="Toolrize Home">
            <div className="flex items-center justify-center w-9 h-9 rounded-[10px] bg-gradient-to-br from-accent to-accent-dark text-white text-[15px] font-extrabold shadow-md shadow-accent/25">
              T
            </div>
            <span className="text-[20px] font-bold text-foreground tracking-[-0.03em]">
              Toolrize
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {siteConfig.navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-[15px] font-medium text-muted hover:text-foreground rounded-lg hover:bg-surface/60 transition-all duration-150"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="hidden sm:flex items-center gap-2.5 h-10 px-4 text-[14px] text-muted-light border border-border rounded-xl hover:border-border-hover hover:text-muted bg-card/60 transition-all duration-150"
              aria-label="Search tools"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <span>Search tools...</span>
              <kbd className="ml-3 px-1.5 py-0.5 text-[11px] font-medium text-muted-light bg-surface/80 rounded-md border border-border/60">⌘K</kbd>
            </button>
            <button
              type="button"
              className="lg:hidden p-2.5 text-muted hover:text-foreground rounded-xl hover:bg-surface/60 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="lg:hidden border-t border-border/50 py-4 pb-5" aria-label="Mobile navigation">
            {siteConfig.navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="block px-4 py-3 text-[16px] font-medium text-muted hover:text-foreground rounded-xl hover:bg-surface/60 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
