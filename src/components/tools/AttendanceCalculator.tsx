"use client";

import { useState } from "react";

export default function AttendanceCalculator() {
  const [total, setTotal] = useState<number>(40);
  const [attended, setAttended] = useState<number>(32);
  const [target, setTarget] = useState<number>(75);

  const currentPercent = total > 0 ? (attended / total) * 100 : 0;
  
  // Calculate bunkable/required classes
  let statusText = "";
  let bunkCount = 0;
  let attendCount = 0;

  if (currentPercent >= target) {
    // Current is higher than target, check how many can be bunked
    // Formula: (attended) / (total + x) >= target/100
    // => x <= (attended * 100 / target) - total
    bunkCount = Math.floor((attended * 100) / target) - total;
    statusText = bunkCount > 0 
      ? `You can safely bunk the next ${bunkCount} classes while maintaining your target ${target}% attendance.`
      : `You are exactly on track. You cannot skip any more classes.`;
  } else {
    // Current is lower than target, check how many must be attended consecutively
    // Formula: (attended + x) / (total + x) >= target/100
    // => x * (1 - target/100) >= (target/100 * total) - attended
    // => x * (100 - target) >= (target * total) - (100 * attended)
    // => x >= (target * total - 100 * attended) / (100 - target)
    attendCount = Math.ceil((target * total - 100 * attended) / (100 - target));
    statusText = `You need to attend the next ${attendCount} classes consecutively to reach your target of ${target}%.`;
  }

  return (
    <div className="bg-white rounded-3xl border border-border/70 p-6 sm:p-8 shadow-xs">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Controls Column */}
        <div className="md:col-span-1 space-y-4 border-r border-border/50 pr-0 md:pr-6">
          <h3 className="font-heading text-[16px] font-extrabold text-foreground mb-4">
            Input Details
          </h3>
          
          <div>
            <label htmlFor="total-classes" className="block text-[12px] font-extrabold text-foreground mb-1.5 uppercase tracking-wider">
              Total Classes Conducted:
            </label>
            <input
              id="total-classes"
              type="number"
              min="1"
              value={total}
              onChange={(e) => setTotal(Math.max(1, parseInt(e.target.value) || 0))}
              className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl font-bold text-[14px]"
            />
          </div>

          <div>
            <label htmlFor="attended-classes" className="block text-[12px] font-extrabold text-foreground mb-1.5 uppercase tracking-wider">
              Classes Attended:
            </label>
            <input
              id="attended-classes"
              type="number"
              min="0"
              max={total}
              value={attended}
              onChange={(e) => setAttended(Math.min(total, Math.max(0, parseInt(e.target.value) || 0)))}
              className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl font-bold text-[14px]"
            />
          </div>

          <div>
            <label htmlFor="target-attendance" className="block text-[12px] font-extrabold text-foreground mb-1.5 uppercase tracking-wider">
              Target Attendance (%):
            </label>
            <div className="flex items-center gap-3">
              <input
                id="target-attendance"
                type="number"
                min="10"
                max="100"
                value={target}
                onChange={(e) => setTarget(Math.min(100, Math.max(10, parseInt(e.target.value) || 75)))}
                className="w-20 px-3 py-2 bg-white border border-border rounded-xl font-bold text-[14px]"
              />
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={target}
                onChange={(e) => setTarget(parseInt(e.target.value))}
                className="flex-1 accent-accent"
              />
            </div>
          </div>
        </div>

        {/* Calculations Column */}
        <div className="md:col-span-2 flex flex-col justify-between pl-0 md:pl-2">
          <div>
            <span className="text-[11px] font-extrabold uppercase text-muted-light">Calculation Result</span>
            
            {/* Massive Attendance Percentage Display */}
            <div className="flex items-baseline gap-4 mt-2">
              <span className={`text-[48px] sm:text-[64px] font-heading font-extrabold tracking-[-0.04em] leading-none ${
                currentPercent >= target ? "text-emerald-600" : "text-amber-500"
              }`}>
                {currentPercent.toFixed(1)}%
              </span>
              <span className="text-[14px] font-extrabold text-muted-light uppercase tracking-wider">
                Current Attendance
              </span>
            </div>

            {/* Attendance Progress bar */}
            <div className="w-full h-3 bg-surface/50 rounded-full overflow-hidden mt-6 relative border border-border/30">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  currentPercent >= target ? "bg-emerald-600" : "bg-amber-500"
                }`}
                style={{ width: `${Math.min(100, currentPercent)}%` }}
              />
              {/* Target Line marker */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-red-500"
                style={{ left: `${target}%` }}
                title={`Target: ${target}%`}
              />
            </div>

            {/* Description strip */}
            <div className="mt-8 p-5 bg-surface/30 rounded-2xl border border-border/40">
              <span className="text-[20px] mr-2">📊</span>
              <p className="inline text-[13.5px] sm:text-[14.5px] font-bold text-foreground leading-relaxed">
                {statusText}
              </p>
            </div>
          </div>

          {/* Quick recommendations panel */}
          <div className="grid grid-cols-2 gap-4 mt-8 pt-5 border-t border-border/40">
            <div className="p-4 bg-white border border-border/60 rounded-xl shadow-2xs">
              <span className="block text-[11px] font-bold text-muted-light uppercase mb-1">Status Summary</span>
              <span className={`text-[14px] font-extrabold ${currentPercent >= target ? "text-emerald-600" : "text-red-500"}`}>
                {currentPercent >= target ? "🟢 Safe (On track)" : "🔴 Critical (Bunk warning)"}
              </span>
            </div>
            <div className="p-4 bg-white border border-border/60 rounded-xl shadow-2xs">
              <span className="block text-[11px] font-bold text-muted-light uppercase mb-1">Target Threshold</span>
              <span className="text-[14px] font-extrabold text-foreground">
                {target}% Minimum
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
