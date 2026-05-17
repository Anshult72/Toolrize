"use client";

import { useState } from "react";

interface SemesterRow {
  id: number;
  sgpa: number;
}

interface SubjectRow {
  id: number;
  gradePoints: number;
  credits: number;
}

export default function CgpaCalculator() {
  const [activeTab, setActiveTab] = useState<"semesters" | "subjects">("semesters");
  
  // Tab 1: Semesters SGPA
  const [semesters, setSemesters] = useState<SemesterRow[]>([
    { id: 1, sgpa: 8.5 },
    { id: 2, sgpa: 8.2 },
  ]);

  // Tab 2: Subjects GPA
  const [subjects, setSubjects] = useState<SubjectRow[]>([
    { id: 1, gradePoints: 9, credits: 4 }, // A grade
    { id: 2, gradePoints: 8, credits: 3 }, // B grade
    { id: 3, gradePoints: 10, credits: 2 }, // O grade
  ]);

  // Calculations
  const calcSemestersCgpa = () => {
    const validSgpas = semesters.filter((s) => s.sgpa > 0);
    if (validSgpas.length === 0) return 0;
    const sum = validSgpas.reduce((acc, curr) => acc + curr.sgpa, 0);
    return sum / validSgpas.length;
  };

  const calcSubjectsCgpa = () => {
    const validSubs = subjects.filter((s) => s.gradePoints > 0 && s.credits > 0);
    if (validSubs.length === 0) return 0;
    const totalQualityPoints = validSubs.reduce((acc, curr) => acc + curr.gradePoints * curr.credits, 0);
    const totalCredits = validSubs.reduce((acc, curr) => acc + curr.credits, 0);
    return totalCredits > 0 ? totalQualityPoints / totalCredits : 0;
  };

  const finalCgpa = activeTab === "semesters" ? calcSemestersCgpa() : calcSubjectsCgpa();
  
  // CBSE/Indian conversion: Percentage = CGPA * 9.5
  const percentage = finalCgpa * 9.5;

  const addSemesterRow = () => {
    setSemesters((prev) => [...prev, { id: Date.now(), sgpa: 0 }]);
  };

  const removeSemesterRow = (id: number) => {
    setSemesters((prev) => prev.filter((s) => s.id !== id));
  };

  const updateSgpa = (id: number, val: number) => {
    setSemesters((prev) =>
      prev.map((s) => (s.id === id ? { ...s, sgpa: Math.min(10, Math.max(0, val)) } : s))
    );
  };

  const addSubjectRow = () => {
    setSubjects((prev) => [...prev, { id: Date.now(), gradePoints: 0, credits: 3 }]);
  };

  const removeSubjectRow = (id: number) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  const updateSubject = (id: number, field: "gradePoints" | "credits", val: number) => {
    setSubjects((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: Math.max(0, val) } : s))
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-border/70 p-6 sm:p-8 shadow-xs">
      {/* Calculation Tab filters */}
      <div className="flex border-b border-border/50 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab("semesters")}
          className={`flex-1 py-3 text-[14px] font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "semesters"
              ? "border-accent text-accent"
              : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          Calculate using Semesters (SGPA)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("subjects")}
          className={`flex-1 py-3 text-[14px] font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "subjects"
              ? "border-accent text-accent"
              : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          Calculate using Subjects (Grades &amp; Credits)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Input Column */}
        <div className="md:col-span-2 space-y-4 border-r border-border/40 pr-0 md:pr-6">
          {activeTab === "semesters" ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-[15px] font-extrabold text-foreground">
                  Semester SGPA Entries
                </h3>
                <button
                  type="button"
                  onClick={addSemesterRow}
                  className="px-3.5 py-1.5 bg-accent/10 hover:bg-accent/15 text-accent text-[12px] font-extrabold rounded-lg transition-colors cursor-pointer"
                >
                  ➕ Add Semester
                </button>
              </div>

              <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                {semesters.map((sem, idx) => (
                  <div key={sem.id} className="flex items-center gap-3 bg-surface/30 p-2.5 rounded-xl border border-border/40">
                    <span className="text-[13px] font-extrabold text-foreground w-20">Sem {idx + 1}:</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      value={sem.sgpa || ""}
                      placeholder="Enter SGPA (0 - 10)"
                      onChange={(e) => updateSgpa(sem.id, parseFloat(e.target.value) || 0)}
                      className="flex-1 px-3 py-1.5 bg-white border border-border rounded-lg font-bold text-[13px]"
                    />
                    <button
                      type="button"
                      onClick={() => removeSemesterRow(sem.id)}
                      className="w-8 h-8 rounded-lg text-red-500 hover:bg-red-50 text-[14px] font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-[15px] font-extrabold text-foreground">
                  Subject Grade Entries
                </h3>
                <button
                  type="button"
                  onClick={addSubjectRow}
                  className="px-3.5 py-1.5 bg-accent/10 hover:bg-accent/15 text-accent text-[12px] font-extrabold rounded-lg transition-colors cursor-pointer"
                >
                  ➕ Add Subject
                </button>
              </div>

              <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                {subjects.map((sub, idx) => (
                  <div key={sub.id} className="grid grid-cols-12 gap-2 items-center bg-surface/30 p-2.5 rounded-xl border border-border/40">
                    <span className="col-span-2 text-[12.5px] font-extrabold text-foreground truncate">Sub {idx + 1}</span>
                    
                    <div className="col-span-5 flex items-center gap-1.5">
                      <label className="text-[10px] font-bold text-muted-light">Grade:</label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={sub.gradePoints || ""}
                        placeholder="Grade Points"
                        onChange={(e) => updateSubject(sub.id, "gradePoints", parseFloat(e.target.value) || 0)}
                        className="w-full px-2.5 py-1.5 bg-white border border-border rounded-lg font-bold text-[13px]"
                      />
                    </div>

                    <div className="col-span-4 flex items-center gap-1.5">
                      <label className="text-[10px] font-bold text-muted-light">Credits:</label>
                      <input
                        type="number"
                        min="1"
                        max="8"
                        value={sub.credits || ""}
                        onChange={(e) => updateSubject(sub.id, "credits", parseInt(e.target.value) || 0)}
                        className="w-full px-2.5 py-1.5 bg-white border border-border rounded-lg font-bold text-[13px]"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeSubjectRow(sub.id)}
                      className="col-span-1 w-8 h-8 rounded-lg text-red-500 hover:bg-red-50 text-[14px] font-bold flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Output Column */}
        <div className="md:col-span-1 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-extrabold uppercase text-muted-light">Calculated CGPA</span>
              <div className="text-[54px] font-heading font-extrabold tracking-[-0.03em] text-accent mt-1 leading-none">
                {finalCgpa.toFixed(2)}
              </div>
            </div>

            <div className="p-4.5 bg-emerald-50 border border-emerald-100 rounded-2xl">
              <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wide">
                Percentage Equivalent (AICTE/CBSE)
              </span>
              <div className="text-[28px] font-heading font-extrabold text-emerald-700 mt-1 leading-none">
                {percentage.toFixed(1)}%
              </div>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                Calculated as: CGPA × 9.5
              </p>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-border/40 space-y-2">
            <h4 className="text-[11px] font-extrabold text-foreground uppercase tracking-wide">
              Indian University Scale
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[12px] text-muted-light font-semibold">
              <div>Grade O (10 Points)</div>
              <div>Grade A+ (9 Points)</div>
              <div>Grade A (8 Points)</div>
              <div>Grade B (7 Points)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
