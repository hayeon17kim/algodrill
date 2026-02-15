"use client";

import { useLang } from "@/components/common/LangContext";
import { L } from "@/lib/i18n";
import { QUESTIONS } from "@/data/questions";
import { CATEGORIES } from "@/data/categories";
import { getCategoryProgressStats, type QuestionProgress } from "@/lib/storage";
import { ArrowLeft, ChevronRight } from "lucide-react";

interface Props {
  progress: Record<string, QuestionProgress>;
  onSelectCategory: (catId: string) => void;
  onBack: () => void;
}

export function CategoryScreen({ progress, onSelectCategory, onBack }: Props) {
  const { lang, t } = useLang();

  const activeCats = CATEGORIES.filter((c) => QUESTIONS.some((q) => q.categoryId === c.id));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card border-b-2 border-border">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-6 h-6" strokeWidth={3} />
          </button>
          <h1 className="text-lg font-black uppercase tracking-wide">{t.categoryMode}</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-3">
        {activeCats.map((cat) => {
          const s = getCategoryProgressStats(progress, cat.id);
          const pct = s.total > 0 ? Math.round((s.mastered / s.total) * 100) : 0;
          return (
            <button key={cat.id} onClick={() => onSelectCategory(cat.id)}
              className="option-tile w-full text-left">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 text-2xl bg-secondary rounded-xl">
                  {cat.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-extrabold truncate">{L(cat.name, lang)}</p>
                    <span className="text-xs font-bold text-muted-foreground ml-2 shrink-0">{s.total}Q</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 bg-secondary rounded-full h-3">
                      <div className="h-3 rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs font-extrabold text-muted-foreground shrink-0">{s.mastered}/{s.total}</span>
                  </div>
                  {s.due > 0 && (
                    <p className="text-xs text-primary font-bold mt-1">{s.due} {t.reviewDue.toLowerCase()}</p>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              </div>
            </button>
          );
        })}
      </main>
    </div>
  );
}
