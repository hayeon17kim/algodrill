"use client";

import { useLang } from "@/components/common/LangContext";
import { L } from "@/lib/i18n";
import { QUESTIONS } from "@/data/questions";
import { CATEGORIES } from "@/data/categories";
import type { QuestionProgress } from "@/lib/storage";

interface Props {
  progress: Record<string, QuestionProgress>;
  onSelectCategory: (catId: string) => void;
  onBack: () => void;
}

export function CategoryScreen({ progress, onSelectCategory, onBack }: Props) {
  const { lang, t } = useLang();
  const now = Date.now();

  const getCategoryStats = (catId: string) => {
    const qs = QUESTIONS.filter((q) => q.categoryId === catId);
    const total = qs.length;
    const mastered = qs.filter((q) => (progress[q.id]?.streak || 0) >= 3).length;
    const due = qs.filter((q) => (progress[q.id]?.nextReview || 0) <= now).length;
    return { total, mastered, due };
  };

  const activeCats = CATEGORIES.filter((c) => QUESTIONS.some((q) => q.categoryId === c.id));

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg,#eef2ff 0%,#fff 40%)" }}>
      <div className="max-w-md mx-auto px-4 py-6 space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-sm text-gray-500 font-medium">{t.back}</button>
          <h1 className="text-xl font-black text-gray-900">{t.categoryMode}</h1>
        </div>
        <p className="text-sm text-gray-500">{t.selectCategory}</p>

        <div className="space-y-3">
          {activeCats.map((cat) => {
            const s = getCategoryStats(cat.id);
            const pct = s.total > 0 ? Math.round((s.mastered / s.total) * 100) : 0;
            return (
              <button key={cat.id} onClick={() => onSelectCategory(cat.id)}
                className="w-full text-left p-4 rounded-2xl bg-white border-2 border-gray-100 shadow-sm active:bg-indigo-50 transition-all">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cat.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-gray-900 truncate">{L(cat.name, lang)}</p>
                      <span className="text-xs text-gray-500 ml-2 shrink-0">{s.total} {t.questionsAvailable}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-indigo-500 transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-gray-500 shrink-0">{s.mastered}/{s.total}</span>
                    </div>
                    {s.due > 0 && (
                      <p className="text-xs text-indigo-600 font-medium mt-1">{s.due} {t.reviewDue.toLowerCase()}</p>
                    )}
                  </div>
                  <span className="text-gray-300 text-lg">→</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
