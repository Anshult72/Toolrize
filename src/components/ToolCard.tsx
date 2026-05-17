import Link from "next/link";
import type { Tool } from "@/lib/tools-data";

const categoryStyles: Record<string, { bg: string; iconBg: string; text: string; borderHover: string; glow: string }> = {
  image: { 
    bg: "bg-blue-50/50", 
    iconBg: "bg-blue-100/80 text-blue-600", 
    text: "text-blue-600", 
    borderHover: "hover:border-blue-300", 
    glow: "group-hover:shadow-blue-500/5" 
  },
  pdf: { 
    bg: "bg-red-50/50", 
    iconBg: "bg-red-100/80 text-red-600", 
    text: "text-red-600", 
    borderHover: "hover:border-red-300", 
    glow: "group-hover:shadow-red-500/5" 
  },
  student: { 
    bg: "bg-emerald-50/50", 
    iconBg: "bg-emerald-100/80 text-emerald-600", 
    text: "text-emerald-600", 
    borderHover: "hover:border-emerald-300", 
    glow: "group-hover:shadow-emerald-500/5" 
  },
  form: { 
    bg: "bg-amber-50/50", 
    iconBg: "bg-amber-100/80 text-amber-600", 
    text: "text-amber-600", 
    borderHover: "hover:border-amber-300", 
    glow: "group-hover:shadow-amber-500/5" 
  },
};

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const styles = categoryStyles[tool.category] || categoryStyles.form;

  return (
    <Link
      href={`/${tool.slug}`}
      className={`group relative block bg-white rounded-2xl border border-border/80 p-6 sm:p-7 tool-card ${styles.borderHover} ${styles.glow}`}
      role="listitem"
      title={tool.metaTitle}
    >
      <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-6">
        {/* Large, Beautiful Icon Container */}
        <div className={`flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-2xl ${styles.iconBg} text-[28px] shadow-xs transition-transform duration-300 group-hover:scale-110`}>
          {tool.icon}
        </div>

        {/* Content Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <h3 className="font-heading text-[16px] sm:text-[18px] font-bold text-foreground leading-snug tracking-[-0.02em] group-hover:text-accent transition-colors duration-200">
              {tool.title}
            </h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-surface/75 border border-border/30 text-muted-light`}>
              {tool.category}
            </span>
          </div>
          
          <p className="text-[13px] sm:text-[14px] text-muted leading-[1.6] font-medium line-clamp-2">
            {tool.description}
          </p>

          {/* Quick Action Link Indicator */}
          <div className="mt-4 flex items-center gap-1.5 text-[12px] font-bold text-accent transition-all duration-200 opacity-80 group-hover:opacity-100">
            <span>Use Online Tool</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 transform translate-x-0 group-hover:translate-x-1">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
