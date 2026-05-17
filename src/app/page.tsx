import HeroSection from "@/components/HeroSection";
import CategoryFilter from "@/components/CategoryFilter";
import SeoContent from "@/components/SeoContent";
import JsonLd from "@/components/JsonLd";
import ToolCard from "@/components/ToolCard";
import { tools } from "@/lib/tools-data";
import Link from "next/link";

export default function HomePage() {
  // Filter specific categories for focused homepage landing strips
  const popularTools = tools.filter(t => 
    ["compress-image", "compress-pdf", "passport-photo", "attendance-calculator"].includes(t.id)
  );

  const studentTools = tools.filter(t => t.category === "student");
  const formTools = tools.filter(t => ["passport-photo", "signature-bg-remover", "image-resizer", "qr-code-generator"].includes(t.id));

  return (
    <>
      <JsonLd />
      
      {/* 1. Navbar (Loaded in RootLayout) */}
      
      {/* 2. Large Hero Section + 3. Trust Strip */}
      <HeroSection />

      {/* 4. Popular Tools Strip */}
      <section id="popular-tools" className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12 py-12 sm:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 border-b border-border/40 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-[11px] font-extrabold uppercase tracking-wider mb-2.5">
              🏆 Top Utility Pick
            </div>
            <h2 className="font-heading text-[28px] sm:text-[36px] font-extrabold text-foreground tracking-[-0.03em] leading-tight">
              Most Popular Tools
            </h2>
            <p className="mt-2 text-[14px] sm:text-[16px] text-muted font-medium">
              The absolute go-to tools used by thousands of users every single day.
            </p>
          </div>
          <div>
            <Link
              href="#categories"
              className="inline-flex items-center gap-2 text-[14px] font-bold text-accent hover:text-accent-dark transition-colors"
            >
              <span>View All 12 Tools</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-5">
          {popularTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* 5. Categories Section (Interactive filter of all 12 tools) */}
      <CategoryFilter />

      {/* 6. Student Utilities Section */}
      <section className="bg-white border-y border-border/40 py-16 sm:py-24">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14 items-center">
            {/* Info panel */}
            <div className="lg:col-span-1">
              <span className="text-[12px] font-extrabold text-accent uppercase tracking-widest bg-accent-light px-3.5 py-1 rounded-full border border-accent/15">
                For Students
              </span>
              <h2 className="font-heading text-[28px] sm:text-[38px] font-extrabold text-foreground tracking-[-0.03em] leading-tight mt-4">
                Smart Student Calculators
              </h2>
              <p className="mt-4 text-[15px] sm:text-[16px] text-muted leading-relaxed font-medium">
                Keep track of college attendance bunkers, estimate CGPA conversions, and compute math results in seconds with custom school tools.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                {[
                  "Calculate bunks and class skipping limits",
                  "Convert SGPA to CGPA instantly",
                  "Quick percentages for term exams"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold">✓</span>
                    <span className="text-[13px] sm:text-[14px] text-foreground font-semibold">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* List panel */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {studentTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Government Form Tools */}
      <section className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12 py-16 sm:py-24">
        <div className="text-center max-w-[680px] mx-auto mb-14">
          <span className="text-[12px] font-extrabold text-accent uppercase tracking-widest bg-accent-light px-3.5 py-1 rounded-full border border-accent/15">
            Sarkari &amp; Job Forms
          </span>
          <h2 className="font-heading text-[28px] sm:text-[36px] font-extrabold text-foreground tracking-[-0.03em] leading-tight mt-4">
            Indian Government Form Tools
          </h2>
          <p className="mt-4 text-[15px] sm:text-[17px] text-muted leading-relaxed font-medium">
            Perfectly resize images, remove signature backgrounds, and create compliant passport photos conforming to official dimensions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {formTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* 8. SEO Content Section */}
      <SeoContent />

      {/* 9. Footer (Loaded in RootLayout) */}
    </>
  );
}
