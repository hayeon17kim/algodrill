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
import { WelcomeCard } from "@/components/home/WelcomeCard";

interface Props {
  progress: Record<string, QuestionProgress>;
  stats: Stats;
  user: { id: string; email?: string } | null;
  dailyGoal: number;
  setDailyGoal: (goal: number) => void;
  onStart: () => void;
  onCategoryMode: () => void;
  onWeakness: () => void;
  onReset: () => void;
}

export function HomeScreen({ progress, stats, user, dailyGoal, setDailyGoal, onStart, onCategoryMode, onWeakness, onReset }: Props) {
  const { lang, t, setLang } = useLang();
  const totalQ = QUESTIONS.length;
  const { mastered, due: dueCount } = getOverallProgressStats(progress);

  // Determine if user is brand new (no activity at all)
  const isNewUser = stats.todayTotal === 0 && mastered === 0 && stats.totalXP === 0;
  const hasLevelOrStreak = stats.totalXP > 0 || stats.currentStreak > 0;

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
      {/* Header — simplified */}
      <header className="sticky top-0 z-10 bg-card border-b-2 border-border">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-2xl font-black text-primary tracking-tight font-sans">
            {t.appName}
          </h1>
          <div className="flex items-center gap-1">
            <LangToggle lang={lang} setLang={setLang} />
            <ThemeToggle />
            <LoginButton user={user} />
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-8 pb-6 space-y-8">
        {isNewUser ? (
          /* ── New user: Welcome card with single CTA ── */
          <WelcomeCard onStart={onStart} />
        ) : (
          /* ── Returning user: Full dashboard ── */
          <>
            {/* Hero area: Today's stats */}
            <StatsCard
              dailyGoal={dailyGoal}
              todayCorrect={stats.todayCorrect}
              todayTotal={stats.todayTotal}
              setDailyGoal={setDailyGoal}
            />

            {/* Level & Streak — only if user has activity */}
            {hasLevelOrStreak && (
              <LevelStreakCards stats={stats} />
            )}

            {/* CTA buttons with clear hierarchy */}
            <div className="space-y-3">
              <Button onClick={onStart} size="lg" className="w-full h-16 text-lg btn-3d">
                {dueCount > 0 ? t.startSession : t.reviewAll}
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={onCategoryMode}
                  className="flex flex-col items-center gap-1.5 p-4 rounded-2xl border-2 border-border bg-card text-foreground hover:bg-accent transition-colors"
                >
                  <FolderOpen className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-bold">{t.categoryMode}</span>
                  <span className="text-xs text-muted-foreground">{t.categoryModeDesc}</span>
                </button>
                <button
                  onClick={onWeakness}
                  className="flex flex-col items-center gap-1.5 p-4 rounded-2xl border-2 border-border bg-card text-foreground hover:bg-accent transition-colors"
                >
                  <TrendingDown className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-bold">{lang === "ko" ? "약점 분석" : "Weakness"}</span>
                  <span className="text-xs text-muted-foreground">{t.weaknessDesc}</span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Progress — only show if user has started learning */}
        {!isNewUser && (
          <ProgressSection mastered={mastered} totalQ={totalQ} categoryStats={catStats} />
        )}

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
