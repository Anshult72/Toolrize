export default function SeoContent() {
  return (
    <section
      className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12 py-16 sm:py-24 border-t border-border/40"
      aria-labelledby="seo-heading"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
        {/* Left Side Sticky Intro Section */}
        <div className="lg:col-span-1 lg:sticky lg:top-24 h-fit">
          <div className="bg-white rounded-3xl border border-border/70 p-6 sm:p-8 shadow-xs">
            <h2
              id="seo-heading"
              className="font-heading text-[22px] sm:text-[26px] font-extrabold text-foreground tracking-[-0.03em] leading-tight mb-4"
            >
              About Toolrize – Free Online Utility Platform
            </h2>
            <p className="text-[14px] text-muted leading-[1.7] font-medium mb-6">
              Toolrize is a next-generation online utility ecosystem engineered for Indian students, professionals, and job applicants.
            </p>
            <p className="text-[13px] text-muted-light leading-[1.7]">
              Whether you are optimizing a visa application photo, compressing scanned documents for official exams, or calculating university GPA, Toolrize offers rapid browser-level utilities completely free.
            </p>
          </div>
        </div>

        {/* Right Side Content Grids */}
        <div className="lg:col-span-2 space-y-8">
          {/* Benefits Grid */}
          <div className="bg-white rounded-3xl border border-border/70 p-6 sm:p-8 shadow-xs">
            <h3 className="font-heading text-[18px] sm:text-[20px] font-bold text-foreground tracking-[-0.02em] mb-6">
              Designed For Ultimate Speed &amp; Security
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { 
                  emoji: "🌐", 
                  title: "100% Client-Side Processing", 
                  desc: "Files remain strictly in your browser. We never upload or save your sensitive documents." 
                },
                { 
                  emoji: "💸", 
                  title: "No Sign-Up or Premium Fees", 
                  desc: "Absolutely unlimited runs. Free access to all document and conversion tools." 
                },
                { 
                  emoji: "🔒", 
                  title: "Privacy First Architecture", 
                  desc: "Local Javascript algorithms ensure your information is strictly yours." 
                },
                { 
                  emoji: "📱", 
                  title: "Fully Mobile Responsive", 
                  desc: "Instantly compress photos or calculate stats directly on your smartphone." 
                },
              ].map((benefit) => (
                <div
                  key={benefit.title}
                  className="flex gap-4 p-4.5 rounded-2xl bg-surface/40 border border-border/40 shadow-2xs hover:bg-white transition-all duration-200"
                >
                  <span className="text-[24px] flex-shrink-0 mt-0.5">{benefit.emoji}</span>
                  <div>
                    <h4 className="font-heading text-[14px] font-bold text-foreground mb-1.5 leading-snug">
                      {benefit.title}
                    </h4>
                    <p className="text-[12.5px] text-muted-light leading-[1.6]">
                      {benefit.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Content Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-border/70 p-6 sm:p-8 shadow-xs">
              <h3 className="font-heading text-[16px] sm:text-[18px] font-extrabold text-foreground tracking-[-0.02em] mb-3">
                Document &amp; PDF Optimizations
              </h3>
              <p className="text-[13.5px] text-muted leading-[1.7] font-medium">
                Our heavy-duty PDF engines allow users to merge multiple academic records, split massive e-books by custom page ranges, or resize files to specific KB targets without compromising textual legibility.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-border/70 p-6 sm:p-8 shadow-xs">
              <h3 className="font-heading text-[16px] sm:text-[18px] font-extrabold text-foreground tracking-[-0.02em] mb-3">
                Form Photo &amp; Signature Scaling
              </h3>
              <p className="text-[13.5px] text-muted leading-[1.7] font-medium">
                Conform to challenging portals like UPSC, SSC, and bank application portals. Resize, trim margins, clear backgrounds, and convert formats with single-click browser templates.
              </p>
            </div>
          </div>

          {/* Student Utilities */}
          <div className="bg-white rounded-3xl border border-border/70 p-6 sm:p-8 shadow-xs">
            <h3 className="font-heading text-[16px] sm:text-[18px] font-extrabold text-foreground tracking-[-0.02em] mb-3">
              Comprehensive Student Math &amp; Attendance Trackers
            </h3>
            <p className="text-[13.5px] text-muted leading-[1.7] font-medium">
              Eliminate daily manual calculations. Plan your bunk counts around strict 75% attendance rules, estimate graduation GPAs based on SGPA results across semesters, and compute percentage metrics for competitive entrance examinations instantly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
