"use client";

import { useLang } from "@/components/common/LangContext";
import { ProgressBar } from "@/components/common/ProgressBar";
import { QUESTIONS } from "@/data/questions";
import { CATEGORIES } from "@/data/categories";
import { L } from "@/lib/i18n";
import type { QuestionProgress } from "@/lib/storage";

interface Props {
  progress: Record<string, QuestionProgress>;
  stats: { todayCorrect: number; todayTotal: number; lastDate: string };
  onStart: () => void;
  onCategoryMode: () => void;
  onReset: () => void;
}

export function HomeScreen({ progress, stats, onStart, onCategoryMode, onReset }: Props) {
  const { lang, t } = useLang();
  const totalQ = QUESTIONS.length;
  const mastered = Object.values(progress).filter((p) => p.streak >= 3).length;
  const dueCount = QUESTIONS.filter((q) => (progress[q.id]?.nextReview || 0) <= Date.now()).length;

  const catStats: Record<string, { total: number; mastered: number }> = {};
  QUESTIONS.forEach((q) => {
    const cat = CATEGORIES.find((c) => c.id === q.categoryId);
    const catName = cat ? L(cat.name, lang) : q.categoryId;
    if (!catStats[catName]) catStats[catName] = { total: 0, mastered: 0 };
    catStats[catName].total++;
    if ((progress[q.id]?.streak || 0) >= 3) catStats[catName].mastered++;
  });

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg,#eef2ff 0%,#fff 40%)" }}>
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-black text-gray-900">{t.appName}</h1>
          <p className="text-sm text-gray-500">{t.tagline}</p>
        </div>

        <div className="rounded-2xl p-5 text-white" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-200 text-sm font-medium">{t.todayStudy}</p>
              <p className="text-3xl font-black mt-1">{dueCount} {t.problems}</p>
              <p className="text-indigo-200 text-xs mt-1">{t.reviewDue}</p>
            </div>
            <div className="text-center">
              <div className="text-4xl">{stats.todayCorrect >= 5 ? "🔥" : "🧠"}</div>
              <p className="text-xs mt-1">{stats.todayCorrect}/{stats.todayTotal} {t.correct}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button onClick={onStart}
            className="w-full py-4 rounded-2xl font-bold text-lg text-white shadow-lg active:scale-95 transition-transform"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
            {dueCount > 0 ? t.startSession : t.reviewAll}
          </button>
          <button onClick={onCategoryMode}
            className="w-full py-3.5 rounded-2xl font-bold text-indigo-700 bg-indigo-50 border-2 border-indigo-200 active:bg-indigo-100 transition-all">
            📂 {t.categoryMode}
          </button>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-900 mb-3">{t.progress}</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">{t.totalMaster}</span>
            <span className="text-sm font-bold text-indigo-600">{mastered}/{totalQ}</span>
          </div>
          <ProgressBar current={mastered} total={totalQ} />
          <div className="space-y-2 mt-4">
            {Object.entries(catStats).map(([cat, d]) => (
              <div key={cat} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 truncate max-w-[140px]">{cat}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-indigo-500" style={{ width: `${(d.mastered / d.total) * 100}%` }} />
                  </div>
                  <span className="text-xs text-gray-500 w-8 text-right">{d.mastered}/{d.total}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200">
          <h3 className="font-bold text-amber-800 mb-2">💡 {t.tipTitle}</h3>
          <p className="text-sm text-amber-900 leading-relaxed">{t.tipText}</p>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-400">{t.saved}</p>
          <button onClick={onReset} className="text-xs text-gray-400 underline">{t.resetProgress}</button>
        </div>
      </div>
    </div>
  );
}
