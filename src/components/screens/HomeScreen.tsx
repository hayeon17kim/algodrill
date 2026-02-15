"use client";

import { useLang } from "@/components/common/LangContext";
import { ProgressBar } from "@/components/common/ProgressBar";
import { LoginButton } from "@/components/common/LoginButton";
import { QUESTIONS } from "@/data/questions";
import { CATEGORIES } from "@/data/categories";
import { L } from "@/lib/i18n";
import {
  getOverallProgressStats,
  getCategoryProgressStats,
  type QuestionProgress,
  type Stats,
} from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { FolderOpen, TrendingDown } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LangToggle } from "@/components/common/LangToggle";
import { StatsCard } from "@/components/home/StatsCard";
import { LevelStreakCards } from "@/components/home/LevelStreakCards";
import { ProgressSection } from "@/components/home/ProgressSection";
import { TipCard } from "@/components/home/TipCard";

interface Props {
  progress: Record<string, QuestionProgress>;
  stats: Stats;
  user: { id: string; email?: string } | null;
  onStart: () => void;
  onCategoryMode: () => void;
  onWeakness: () => void;
  onReset: () => void;
}

export function HomeScreen({ progress, stats, user, onStart, onCategoryMode, onWeakness, onReset }: Props) {
  const { lang, t, setLang } = useLang();
  const totalQ = QUESTIONS.length;
  const { mastered, due: dueCount } = getOverallProgressStats(progress);

  const catStats: Record<string, { total: number; mastered: number }> = {};
  CATEGORIES.forEach((cat) => {
    const statsForCat = getCategoryProgressStats(progress, cat.id);
    if (statsForCat.total > 0) {
      const catName = L(cat.name, lang);
      catStats[catName] = { total: statsForCat.total, mastered: statsForCat.mastered };
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-primary">
            {t.appName}
          </h1>
          <p className="text-sm text-muted-foreground">{t.tagline}</p>
        </div>

        <div className="flex justify-center gap-2">
          <LoginButton user={user} />
          <LangToggle lang={lang} setLang={setLang} />
          <ThemeToggle />
        </div>

        <StatsCard dueCount={dueCount} todayCorrect={stats.todayCorrect} todayTotal={stats.todayTotal} />

        <LevelStreakCards stats={stats} />

        <div className="space-y-3">
          <Button onClick={onStart} size="lg" className="w-full h-16 text-lg font-bold">
            {dueCount > 0 ? t.startSession : t.reviewAll}
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={onCategoryMode} variant="outline" size="lg" className="h-14 font-semibold">
              <FolderOpen className="w-5 h-5 mr-2" />
              {t.categoryMode}
            </Button>
            <Button onClick={onWeakness} variant="outline" size="lg" className="h-14 font-semibold">
              <TrendingDown className="w-5 h-5 mr-2" />
              {lang === "ko" ? "약점 분석" : "Weakness"}
            </Button>
          </div>
        </div>

        <ProgressSection mastered={mastered} totalQ={totalQ} categoryStats={catStats} />

        <TipCard />

        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground">{t.saved}</p>
          <Button onClick={onReset} variant="link" className="text-xs h-auto p-0 text-muted-foreground hover:text-destructive">
            {t.resetProgress}
          </Button>
        </div>
      </div>
    </div>
  );
}
