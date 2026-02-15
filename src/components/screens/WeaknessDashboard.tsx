"use client";

import { useLang } from "@/components/common/LangContext";
import {
  getCategoryStats,
  getTypeStats,
  getWeakCategories,
  getOverallAccuracy,
  type QuestionProgress,
} from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
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
  const { lang, t } = useLang();

  const overallAccuracy = getOverallAccuracy(progress);
  const categoryStats = getCategoryStats(progress);
  const typeStats = getTypeStats(progress);
  const weakCategories = getWeakCategories(progress).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            {t.back}
          </Button>
          <h1 className="text-2xl font-bold">
            {lang === "ko" ? "약점 분석" : "Weakness Analysis"}
          </h1>
          <div className="w-20" />
        </div>

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

        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-900">
          <CardContent className="p-6 text-center text-sm text-blue-800 dark:text-blue-200">
            💡{" "}
            {lang === "ko"
              ? "약한 카테고리를 클릭하면 집중 연습할 수 있습니다"
              : "Click on weak categories to practice them"}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
