"use client";

import { useState } from "react";
import { categories, getToolsByCategory, type ToolCategory } from "@/lib/tools-data";
import ToolCard from "./ToolCard";

export default function CategoryFilter() {
  const [activeCategory, setActiveCategory] = useState<ToolCategory | "all">("all");
  const filteredTools = getToolsByCategory(activeCategory);

  return (
    <section id="categories" className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12 py-16 sm:py-24 border-t border-border/40">
      {/* Section Header */}
      <div className="text-center max-w-[620px] mx-auto mb-12">
        <h2 className="font-heading text-[28px] sm:text-[36px] font-extrabold text-foreground tracking-[-0.03em] leading-tight">
          Browse by Category
        </h2>
        <p className="mt-3.5 text-[15px] sm:text-[17px] text-muted leading-relaxed font-medium">
          Choose a dynamic filter below to quickly explore our comprehensive collection of productivity utilities.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2.5 justify-center mb-12">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`px-6 py-3 text-[14px] font-semibold rounded-full border transition-all duration-200 cursor-pointer shadow-xs ${
              activeCategory === cat.id
                ? "bg-foreground text-white border-foreground shadow-md scale-[1.02]"
                : "bg-white text-muted border-border hover:border-border-hover hover:text-foreground hover:bg-surface/30"
            }`}
            aria-pressed={activeCategory === cat.id}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      <div
        id="tools-grid"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
        role="list"
        aria-label="Available tools"
      >
        {filteredTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  );
}
