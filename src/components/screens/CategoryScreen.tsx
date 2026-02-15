"use client";

import { useLang } from "@/components/common/LangContext";
import { L } from "@/lib/i18n";
import { QUESTIONS } from "@/data/questions";
import { CATEGORIES } from "@/data/categories";
import { getCategoryProgressStats, type QuestionProgress } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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
      <div className="max-w-md mx-auto px-4 py-6 space-y-5">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            {t.back}
          </Button>
          <h1 className="text-xl font-bold">{t.categoryMode}</h1>
        </div>
        <p className="text-sm text-muted-foreground">{t.selectCategory}</p>

        <div className="space-y-3">
          {activeCats.map((cat) => {
            const s = getCategoryProgressStats(progress, cat.id);
            const pct = s.total > 0 ? Math.round((s.mastered / s.total) * 100) : 0;
            return (
              <button key={cat.id} onClick={() => onSelectCategory(cat.id)}
                className="w-full text-left p-4 rounded-xl bg-card border hover:bg-accent transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 text-2xl">
                    {cat.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-bold truncate">{L(cat.name, lang)}</p>
                      <span className="text-xs text-muted-foreground ml-2 shrink-0">{s.total} {t.questionsAvailable}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex-1 bg-secondary rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">{s.mastered}/{s.total}</span>
                    </div>
                    {s.due > 0 && (
                      <p className="text-xs text-primary font-medium mt-1">{s.due} {t.reviewDue.toLowerCase()}</p>
                    )}
                  </div>
                  <span className="text-muted-foreground text-lg">→</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
