import { notFound } from "next/navigation";
import { getToolBySlug, tools } from "@/lib/tools-data";
import { siteConfig } from "@/lib/site-config";
import type { Metadata } from "next";
import Link from "next/link";

const categoryStyles: Record<string, { iconBg: string; text: string }> = {
  image: { iconBg: "bg-blue-100/80 text-blue-600", text: "text-blue-600" },
  pdf: { iconBg: "bg-red-100/80 text-red-600", text: "text-red-600" },
  student: { iconBg: "bg-emerald-100/80 text-emerald-600", text: "text-emerald-600" },
  form: { iconBg: "bg-amber-100/80 text-amber-600", text: "text-amber-600" },
};

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return { title: "Tool Not Found" };
  return {
    title: tool.metaTitle,
    description: tool.metaDescription,
    keywords: tool.keywords,
    alternates: { canonical: `/${tool.slug}` },
    openGraph: { title: tool.metaTitle, description: tool.metaDescription, url: `${siteConfig.url}/${tool.slug}`, type: "website", siteName: siteConfig.name },
    twitter: { card: "summary_large_image", title: tool.metaTitle, description: tool.metaDescription },
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const styles = categoryStyles[tool.category] || categoryStyles.form;
  
  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.title,
    url: `${siteConfig.url}/${tool.slug}`,
    description: tool.description,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12 py-12 sm:py-16">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-[13px] sm:text-[14px] text-muted font-medium">
            <li>
              <Link href="/" className="hover:text-accent transition-colors duration-150">
                Home
              </Link>
            </li>
            <li><span className="text-border-hover">/</span></li>
            <li>
              <span className={`px-2 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-wider ${styles.iconBg}`}>
                {tool.category}
              </span>
            </li>
            <li><span className="text-border-hover">/</span></li>
            <li><span className="text-foreground font-bold">{tool.title}</span></li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Left/Center Interface Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Tool Identity Header */}
            <div className="bg-white rounded-3xl border border-border/70 p-6 sm:p-8 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                <div className={`flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-2xl ${styles.iconBg} text-[36px] shadow-sm`}>
                  {tool.icon}
                </div>
                <div>
                  <h1 className="font-heading text-[26px] sm:text-[34px] font-extrabold text-foreground leading-tight tracking-[-0.03em] mb-2">
                    {tool.title}
                  </h1>
                  <p className="text-[14px] sm:text-[16px] text-muted leading-relaxed font-semibold">
                    {tool.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Tool Interactive Panel (Coming Soon) */}
            <div className="relative overflow-hidden bg-white rounded-3xl border-2 border-dashed border-border/80 p-12 sm:p-20 text-center shadow-xs">
              {/* Subtle background matrix */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] hero-dots bg-[size:20px_20px]" />
              
              <div className="relative z-10 max-w-md mx-auto">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-[36px] mb-6 animate-bounce">
                  🚧
                </div>
                <h2 className="font-heading text-[22px] font-extrabold text-foreground tracking-[-0.02em] mb-3">
                  Tool Interface Under Construction
                </h2>
                <p className="text-[14px] text-muted-light max-w-sm mx-auto mb-8 leading-[1.6] font-medium">
                  We are actively building this next-generation online processor. It runs securely in your local browser sandbox to keep data 100% private.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2.5 px-6 py-3 bg-gradient-to-b from-accent to-accent-dark text-white text-[14px] font-bold rounded-xl shadow-md shadow-accent/20 hover:shadow-lg transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
                  Return to Dashboard
                </Link>
              </div>
            </div>
          </div>

          {/* Right Detailed Sidebar Column */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Context/SEO Card */}
            <div className="bg-white rounded-3xl border border-border/70 p-6 sm:p-8 shadow-2xs">
              <h2 className="font-heading text-[18px] font-extrabold text-foreground tracking-[-0.02em] mb-4">
                About this Tool
              </h2>
              <p className="text-[13.5px] text-muted leading-[1.7] font-medium mb-6">
                {tool.metaDescription}
              </p>
              
              <div className="border-t border-border/50 pt-5">
                <h3 className="text-[12px] font-extrabold text-foreground uppercase tracking-wider mb-3">
                  Covered Keywords
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {tool.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="inline-flex px-3 py-1 text-[11px] font-bold text-muted bg-surface/50 border border-border/40 rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Safety Instructions */}
            <div className="bg-gradient-to-br from-[#f6eedf] to-white rounded-3xl border border-border/70 p-6 sm:p-8 shadow-2xs">
              <h3 className="font-heading text-[15px] font-extrabold text-foreground mb-3 flex items-center gap-2">
                <span>🛡️</span> Client-Side Safe
              </h3>
              <p className="text-[12.5px] text-muted leading-[1.6]">
                Toolrize processors employ high-performance client side logic. Your private files are processed in real-time within your local memory sandbox, offering total absolute privacy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
