export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-24 lg:pt-32 lg:pb-28" aria-labelledby="hero-heading">
      {/* Background layers */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Warm SaaS background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#f5ebd8] via-background to-background" />
        
        {/* Fine premium dot matrix */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, #e5ddd0 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          opacity: 0.7
        }} />
        
        {/* Noise overlay */}
        <div className="absolute inset-0 hero-noise opacity-[0.03]" />
        
        {/* Dynamic decorative visual glow elements */}
        <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] rounded-full bg-accent/[0.05] blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[20%] right-[-5%] w-[500px] h-[500px] rounded-full bg-amber-500/[0.04] blur-[100px] animate-pulse" style={{ animationDuration: '12s' }} />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[920px] text-center">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2.5 px-4.5 py-1.5 rounded-full bg-white/80 border border-border/80 text-foreground text-[12px] sm:text-[13px] font-semibold tracking-[0.04em] uppercase shadow-sm backdrop-blur-md mb-8">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <span>Smart Tools for Documents, Forms &amp; Students</span>
          </div>

          {/* Large Hero Title */}
          <h1
            id="hero-heading"
            className="font-heading text-[36px] sm:text-[54px] lg:text-[68px] font-extrabold text-foreground leading-[1.08] tracking-[-0.04em]"
          >
            Simple, fast and <span className="relative text-accent inline-block">
              100% Free
              <svg className="absolute -bottom-2.5 left-0 w-full h-[8px] text-accent/20" viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <path d="M0 6C50 1.5 150 1.5 200 6" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
              </svg>
            </span> online tools.
          </h1>

          {/* Hero Subheading */}
          <p className="mt-8 text-[16px] sm:text-[19px] lg:text-[21px] text-muted leading-[1.6] max-w-[720px] mx-auto font-medium">
            Toolrize simplifies your document, image, and student tasks. No sign-up required, no installation, files are processed instantly right in your browser.
          </p>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#popular-tools"
              className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-b from-accent to-accent-dark text-white text-[15px] font-bold rounded-xl shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/35 transition-all duration-200 w-full sm:w-auto"
            >
              Explore Popular Tools
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover:translate-x-1">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </a>
            <a
              href="#categories"
              className="inline-flex items-center justify-center px-8 py-4 bg-white border border-border hover:border-border-hover text-foreground text-[15px] font-bold rounded-xl shadow-sm hover:shadow-md transition-all duration-200 w-full sm:w-auto"
            >
              Browse by Category
            </a>
          </div>
        </div>

        {/* Feature/Trust Strip - Polished SaaS style */}
        <div className="mt-20 lg:mt-24 border-t border-border/60 pt-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 max-w-[1100px] mx-auto">
            {[
              { 
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                    <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
                  </svg>
                ), 
                title: "100% Free Forever", 
                desc: "No trials, no hidden fees, unlimited use." 
              },
              { 
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
                  </svg>
                ), 
                title: "Privacy Protected", 
                desc: "Safe browser-based local processing." 
              },
              { 
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                    <path d="m12 3-1.912 5.886H3.82l4.82 3.502-1.84 5.664L12 14.544l5.2 3.774-1.84-5.664 4.82-3.502h-6.268z"/>
                  </svg>
                ), 
                title: "No Sign Up Required", 
                desc: "Get started instantly without credentials." 
              },
              { 
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                  </svg>
                ), 
                title: "Lightning Fast", 
                desc: "Instant processing on any device." 
              }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3.5 p-4 rounded-2xl bg-white/40 border border-border/40 backdrop-blur-sm shadow-sm hover:shadow-md hover:bg-white/60 transition-all duration-200">
                <div className="flex-shrink-0 p-2 bg-white rounded-xl shadow-xs border border-border/50">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-heading text-[14px] font-bold text-foreground mb-1">{item.title}</h4>
                  <p className="text-[12px] text-muted-light leading-[1.5]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
