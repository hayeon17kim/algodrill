"use client";

import { useLang } from "@/components/common/LangContext";
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
      {/* Top Bar */}
      <header className="sticky top-0 z-10 bg-card border-b-2 border-border">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-2xl font-black text-primary tracking-tight font-sans">
            {t.appName}
          </h1>
          <div className="flex items-center gap-2">
            <LoginButton user={user} />
            <LangToggle lang={lang} setLang={setLang} />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-5">
        <StatsCard dueCount={dueCount} todayCorrect={stats.todayCorrect} todayTotal={stats.todayTotal} />

        <LevelStreakCards stats={stats} />

        {/* Main CTA */}
        <div className="space-y-3">
          <Button onClick={onStart} size="lg" className="w-full h-16 text-lg">
            {dueCount > 0 ? t.startSession : t.reviewAll}
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={onCategoryMode} variant="outline" size="lg" className="h-14">
              <FolderOpen className="w-5 h-5 mr-2" />
              {t.categoryMode}
            </Button>
            <Button onClick={onWeakness} variant="outline" size="lg" className="h-14">
              <TrendingDown className="w-5 h-5 mr-2" />
              {lang === "ko" ? "약점 분석" : "Weakness"}
            </Button>
          </div>
        </div>

        <ProgressSection mastered={mastered} totalQ={totalQ} categoryStats={catStats} />

        <TipCard />

        <div className="flex justify-between items-center pb-4">
          <p className="text-xs font-semibold text-muted-foreground">{t.saved}</p>
          <Button onClick={onReset} variant="link" className="text-xs h-auto p-0 text-muted-foreground hover:text-destructive">
            {t.resetProgress}
          </Button>
        </div>
      </main>
    </div>
  );
}
