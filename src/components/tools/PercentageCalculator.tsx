"use client";

import { useState } from "react";

export default function PercentageCalculator() {
  // Calculator 1: Basic percentage (What is X% of Y)
  const [percent1, setPercent1] = useState<number>(15);
  const [value1, setValue1] = useState<number>(200);
  const calcResult1 = (percent1 / 100) * value1;

  // Calculator 2: Percentage Increase/Decrease (Change from X to Y)
  const [valStart, setValStart] = useState<number>(80);
  const [valEnd, setValEnd] = useState<number>(120);
  const percentChange = valStart > 0 ? ((valEnd - valStart) / valStart) * 100 : 0;

  // Calculator 3: Academic Marks (Obtained X out of Y total)
  const [marksObtained, setMarksObtained] = useState<number>(450);
  const [marksTotal, setMarksTotal] = useState<number>(500);
  const marksPercent = marksTotal > 0 ? (marksObtained / marksTotal) * 100 : 0;

  return (
    <div className="bg-white rounded-3xl border border-border/70 p-6 sm:p-8 shadow-xs space-y-8">
      {/* Grid of three individual dedicated calculators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Calc 1: Find percentage of value */}
        <div className="bg-surface/20 border border-border/60 rounded-2xl p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[20px]">🔢</span>
              <h3 className="font-heading text-[15px] font-extrabold text-foreground">
                Percentage Value
              </h3>
            </div>
            
            <div>
              <label htmlFor="percent-input-1" className="block text-[11px] font-extrabold uppercase text-muted-light mb-1">
                What is (Percentage %):
              </label>
              <input
                id="percent-input-1"
                type="number"
                value={percent1}
                onChange={(e) => setPercent1(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white border border-border rounded-xl font-bold text-[13px]"
              />
            </div>

            <div>
              <label htmlFor="value-input-1" className="block text-[11px] font-extrabold uppercase text-muted-light mb-1">
                Of (Number value):
              </label>
              <input
                id="value-input-1"
                type="number"
                value={value1}
                onChange={(e) => setValue1(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white border border-border rounded-xl font-bold text-[13px]"
              />
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border/40">
            <span className="text-[10px] font-extrabold uppercase text-muted-light">Result</span>
            <div className="text-[24px] font-heading font-extrabold text-accent leading-none mt-1.5">
              {calcResult1.toFixed(2).replace(/\.00$/, "")}
            </div>
          </div>
        </div>

        {/* Calc 2: Find percentage change */}
        <div className="bg-surface/20 border border-border/60 rounded-2xl p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[20px]">📈</span>
              <h3 className="font-heading text-[15px] font-extrabold text-foreground">
                Percentage Change
              </h3>
            </div>
            
            <div>
              <label htmlFor="val-start" className="block text-[11px] font-extrabold uppercase text-muted-light mb-1">
                Initial Value:
              </label>
              <input
                id="val-start"
                type="number"
                value={valStart}
                onChange={(e) => setValStart(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white border border-border rounded-xl font-bold text-[13px]"
              />
            </div>

            <div>
              <label htmlFor="val-end" className="block text-[11px] font-extrabold uppercase text-muted-light mb-1">
                Final Value:
              </label>
              <input
                id="val-end"
                type="number"
                value={valEnd}
                onChange={(e) => setValEnd(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white border border-border rounded-xl font-bold text-[13px]"
              />
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border/40">
            <span className="text-[10px] font-extrabold uppercase text-muted-light">Result</span>
            <div className={`text-[24px] font-heading font-extrabold leading-none mt-1.5 ${
              percentChange >= 0 ? "text-emerald-600" : "text-red-500"
            }`}>
              {percentChange >= 0 ? `+${percentChange.toFixed(2)}%` : `${percentChange.toFixed(2)}%`}
            </div>
          </div>
        </div>

        {/* Calc 3: Academic Marks */}
        <div className="bg-surface/20 border border-border/60 rounded-2xl p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[20px]">🎓</span>
              <h3 className="font-heading text-[15px] font-extrabold text-foreground">
                Academic Marks
              </h3>
            </div>
            
            <div>
              <label htmlFor="marks-obt" className="block text-[11px] font-extrabold uppercase text-muted-light mb-1">
                Obtained Marks:
              </label>
              <input
                id="marks-obt"
                type="number"
                value={marksObtained}
                onChange={(e) => setMarksObtained(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white border border-border rounded-xl font-bold text-[13px]"
              />
            </div>

            <div>
              <label htmlFor="marks-tot" className="block text-[11px] font-extrabold uppercase text-muted-light mb-1">
                Total Marks possible:
              </label>
              <input
                id="marks-tot"
                type="number"
                value={marksTotal}
                onChange={(e) => setMarksTotal(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white border border-border rounded-xl font-bold text-[13px]"
              />
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border/40">
            <span className="text-[10px] font-extrabold uppercase text-muted-light">Result</span>
            <div className="text-[24px] font-heading font-extrabold text-emerald-600 leading-none mt-1.5">
              {marksPercent.toFixed(2).replace(/\.00$/, "")}%
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
