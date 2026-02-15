"use client";

import { useLang } from "@/components/common/LangContext";
import {
  getCategoryStats,
  getTypeStats,
  getWeakCategories,
  getOverallAccuracy,
  type QuestionProgress,
} from "@/lib/storage";
import { ArrowLeft, Lightbulb } from "lucide-react";
import { OverallAccuracyCard } from "@/components/weakness/OverallAccuracyCard";
import { WeakPatternsCard } from "@/components/weakness/WeakPatternsCard";
import { CategoryAccuracyList } from "@/components/weakness/CategoryAccuracyList";
import { QuestionTypeAccuracyGrid } from "@/components/weakness/QuestionTypeAccuracyGrid";

interface WeaknessDashboardProps {
  progress: Record<string, QuestionProgress>;
  onBack: () => void;
  onFocusCategory: (categoryId: string) => void;
}

export function WeaknessDashboard({ progress, onBack, onFocusCategory }: WeaknessDashboardProps) {
  const { lang } = useLang();

  const overallAccuracy = getOverallAccuracy(progress);
  const categoryStats = getCategoryStats(progress);
  const typeStats = getTypeStats(progress);
  const weakCategories = getWeakCategories(progress).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card border-b-2 border-border">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-6 h-6" strokeWidth={3} />
          </button>
          <h1 className="text-lg font-black uppercase tracking-wide">
            {lang === "ko" ? "약점 분석" : "Weakness Analysis"}
          </h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-5">
        <OverallAccuracyCard
          accuracy={overallAccuracy}
          totalAttempts={categoryStats.reduce((sum, cat) => sum + cat.total, 0)}
          lang={lang}
        />

        <WeakPatternsCard
          weakCategories={weakCategories}
          lang={lang}
          onFocusCategory={onFocusCategory}
        />

        <CategoryAccuracyList categoryStats={categoryStats} lang={lang} />

        <QuestionTypeAccuracyGrid typeStats={typeStats} lang={lang} />

        <div className="rounded-2xl border-2 border-info/30 bg-info/10 p-5">
          <div className="flex items-center gap-3 text-sm font-bold text-foreground">
            <Lightbulb className="w-5 h-5 text-info flex-shrink-0" />
            {lang === "ko"
              ? "약한 카테고리를 클릭하면 집중 연습할 수 있습니다"
              : "Click on weak categories to practice them"}
          </div>
        </div>
      </main>
    </div>
  );
}
