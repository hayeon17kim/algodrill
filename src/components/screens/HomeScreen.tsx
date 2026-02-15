"use client";

import { useLang } from "@/components/common/LangContext";
import { ProgressBar } from "@/components/common/ProgressBar";
import { LoginButton } from "@/components/common/LoginButton";
import { QUESTIONS } from "@/data/questions";
import { CATEGORIES } from "@/data/categories";
import { L } from "@/lib/i18n";
import {
  getLevelFromXP,
  getXPForNextLevel,
  getLevelProgress,
  getOverallProgressStats,
  getCategoryProgressStats,
  type QuestionProgress,
  type Stats,
} from "@/lib/storage";
import { MASTERED_STREAK_THRESHOLD } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Flame, Brain, FolderOpen, TrendingDown, Lightbulb, Zap, Trophy } from "lucide-react";
import { parseSimpleMarkdown } from "@/lib/markdown";
import { ThemeToggle } from "@/components/ui/theme-toggle";

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
  const { lang, t } = useLang();
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
        <div className="flex items-start justify-between">
          <div className="flex-1 text-center space-y-2">
            <h1 className="text-4xl font-bold text-primary">
              {t.appName}
            </h1>
            <p className="text-sm text-muted-foreground">{t.tagline}</p>
          </div>
          <div className="flex-shrink-0 ml-2">
            <ThemeToggle />
          </div>
        </div>

        <div className="flex justify-center">
          <LoginButton user={user} />
        </div>

        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider opacity-90">{t.todayStudy}</p>
                <p className="text-5xl font-bold mt-2">{dueCount}</p>
                <p className="text-sm font-medium opacity-90">{t.problems}</p>
                <p className="text-xs mt-1 opacity-75">{t.reviewDue}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-primary-foreground/20 rounded-xl">
                  {stats.todayCorrect >= 5 ?
                    <Flame className="w-10 h-10" /> :
                    <Brain className="w-10 h-10" />
                  }
                </div>
                <p className="text-xs mt-2 font-semibold">{stats.todayCorrect}/{stats.todayTotal} {t.correct}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 flex items-center justify-center bg-secondary rounded-lg">
                  <Trophy className="w-4 h-4 text-primary" />
                </div>
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">{t.level}</span>
              </div>
              <div className="text-4xl font-bold text-primary mb-1">
                {getLevelFromXP(stats.totalXP)}
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                {getXPForNextLevel(stats.totalXP)}XP {t.nextLevel}
              </div>
              <Progress value={getLevelProgress(stats.totalXP)} className="h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 flex items-center justify-center bg-orange-100 dark:bg-orange-950 rounded-lg">
                  <Flame className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wide">{t.dailyStreak}</span>
              </div>
              <div className="flex items-baseline gap-1 mb-1">
                <div className="text-4xl font-bold text-orange-600 dark:text-orange-400">
                  {stats.currentStreak}
                </div>
                <div className="text-xl">🔥</div>
              </div>
              <div className="text-xs text-muted-foreground">
                {t.bestStreak}: {stats.bestStreak}{t.streakDays}
              </div>
            </CardContent>
          </Card>
        </div>

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

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <div className="w-1 h-6 bg-primary rounded-full" />
              {t.progress}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-3 p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{t.totalMaster}</span>
                <span className="text-lg font-bold text-primary">{mastered}/{totalQ}</span>
              </div>
              <Progress value={(mastered / totalQ) * 100} className="h-3" />
              <div className="text-right text-xs font-semibold text-primary">
                {Math.round((mastered / totalQ) * 100)}%
              </div>
            </div>
            <div className="space-y-3">
              {Object.entries(catStats).map(([cat, d]) => (
                <div key={cat} className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium truncate max-w-[140px]">{cat}</span>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Progress value={(d.mastered / d.total) * 100} className="w-24 h-2" />
                    <span className="text-xs font-semibold text-muted-foreground w-10 text-right tabular-nums">{d.mastered}/{d.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-900">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-900 rounded-xl flex-shrink-0">
                <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-amber-900 dark:text-amber-100 mb-1.5">{t.tipTitle}</h3>
                <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">{parseSimpleMarkdown(t.tipText)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

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
