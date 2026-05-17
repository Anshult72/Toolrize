import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-white" role="contentinfo">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info Column */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group" aria-label="Toolrize Home">
              <div className="flex items-center justify-center w-8 h-8 rounded-[9px] bg-gradient-to-br from-accent to-accent-dark text-white text-[13px] font-extrabold shadow-sm">
                T
              </div>
              <span className="font-heading text-[18px] font-extrabold text-foreground tracking-[-0.02em]">
                Toolrize
              </span>
            </Link>
            <p className="text-[13px] sm:text-[14px] text-muted leading-[1.6] max-w-[320px] font-medium">
              {siteConfig.tagline}. High-speed client-side online tools for documents, images, PDFs and students.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-[12px] font-extrabold text-foreground mb-4 uppercase tracking-[0.06em]">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {siteConfig.footerLinks.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13.5px] font-semibold text-muted hover:text-accent transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-heading text-[12px] font-extrabold text-foreground mb-4 uppercase tracking-[0.06em]">
              Categories
            </h3>
            <ul className="space-y-2.5">
              {siteConfig.footerLinks.categories.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13.5px] font-semibold text-muted hover:text-accent transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Tools Links */}
          <div>
            <h3 className="font-heading text-[12px] font-extrabold text-foreground mb-4 uppercase tracking-[0.06em]">
              Popular Tools
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: "Compress Image", href: "/compress-image-to-20kb" },
                { label: "Compress PDF", href: "/compress-pdf-to-100kb" },
                { label: "Passport Photo Maker", href: "/passport-size-photo-maker" },
                { label: "Attendance Calculator", href: "/attendance-calculator" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13.5px] font-semibold text-muted hover:text-accent transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom copyright stripe */}
        <div className="mt-16 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] font-medium text-muted-light">
            &copy; {currentYear} Toolrize. Built with security &amp; privacy first. All rights reserved.
          </p>
          <p className="text-[12px] font-medium text-muted-light flex items-center gap-1">
            Made with <span className="text-accent">❤️</span> in India
          </p>
        </div>
      </div>
    </footer>
  );
}
