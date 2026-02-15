"use client";

import { useLang } from "@/components/common/LangContext";
import { ProgressBar } from "@/components/common/ProgressBar";
import { LoginButton } from "@/components/common/LoginButton";
import { QUESTIONS } from "@/data/questions";
import { CATEGORIES } from "@/data/categories";
import { L } from "@/lib/i18n";
import type { QuestionProgress } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Flame, Brain, FolderOpen, TrendingDown, Lightbulb } from "lucide-react";

interface Props {
  progress: Record<string, QuestionProgress>;
  stats: { todayCorrect: number; todayTotal: number; lastDate: string };
  user: { id: string; email?: string } | null;
  onStart: () => void;
  onCategoryMode: () => void;
  onWeakness: () => void;
  onReset: () => void;
}

export function HomeScreen({ progress, stats, user, onStart, onCategoryMode, onWeakness, onReset }: Props) {
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-md mx-auto px-4 py-8 space-y-6">
        <div className="text-center space-y-2 animate-in">
          <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {t.appName}
          </h1>
          <p className="text-sm text-muted-foreground">{t.tagline}</p>
        </div>

        <div className="flex justify-center animate-in" style={{ animationDelay: '0.1s' }}>
          <LoginButton user={user} />
        </div>

        <Card className="border-0 shadow-xl hover-glow animate-in overflow-hidden" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", animationDelay: '0.2s' }}>
          <CardContent className="p-6 text-white relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="flex items-center justify-between relative z-10">
              <div className="space-y-1">
                <p className="text-indigo-200 text-xs font-semibold uppercase tracking-wider">{t.todayStudy}</p>
                <p className="text-5xl font-black mt-2">{dueCount}</p>
                <p className="text-indigo-100 text-sm font-medium">{t.problems}</p>
                <p className="text-indigo-200 text-xs mt-1">{t.reviewDue}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-white/20 rounded-2xl backdrop-blur-sm">
                  {stats.todayCorrect >= 5 ?
                    <Flame className="w-10 h-10 drop-shadow-lg" /> :
                    <Brain className="w-10 h-10 drop-shadow-lg" />
                  }
                </div>
                <p className="text-xs mt-2 font-semibold">{stats.todayCorrect}/{stats.todayTotal} {t.correct}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3 animate-in" style={{ animationDelay: '0.3s' }}>
          <Button onClick={onStart}
            size="lg"
            className="w-full h-16 rounded-2xl text-lg font-bold shadow-lg hover-lift hover:shadow-2xl transition-all duration-300"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
            {dueCount > 0 ? t.startSession : t.reviewAll}
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={onCategoryMode}
              variant="outline"
              size="lg"
              className="h-14 rounded-xl font-semibold text-indigo-700 bg-indigo-50/80 border-2 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 hover-lift backdrop-blur-sm transition-all">
              <FolderOpen className="w-5 h-5 mr-2" />
              {t.categoryMode}
            </Button>
            <Button onClick={onWeakness}
              variant="outline"
              size="lg"
              className="h-14 rounded-xl font-semibold text-red-700 bg-red-50/80 border-2 border-red-200 hover:bg-red-100 hover:border-red-300 hover-lift backdrop-blur-sm transition-all">
              <TrendingDown className="w-5 h-5 mr-2" />
              {lang === "ko" ? "약점 분석" : "Weakness"}
            </Button>
          </div>
        </div>

        <Card className="shadow-md hover-lift border-muted animate-in" style={{ animationDelay: '0.4s' }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
              {t.progress}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-3 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">{t.totalMaster}</span>
                <span className="text-lg font-black text-indigo-600">{mastered}/{totalQ}</span>
              </div>
              <Progress value={(mastered / totalQ) * 100} className="h-3" />
              <div className="text-right text-xs font-semibold text-indigo-600">
                {Math.round((mastered / totalQ) * 100)}%
              </div>
            </div>
            <div className="space-y-3">
              {Object.entries(catStats).map(([cat, d], idx) => (
                <div key={cat} className="flex items-center justify-between gap-3 group">
                  <span className="text-sm font-medium text-foreground truncate max-w-[140px] group-hover:text-indigo-600 transition-colors">{cat}</span>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Progress value={(d.mastered / d.total) * 100} className="w-24 h-2" />
                    <span className="text-xs font-semibold text-muted-foreground w-10 text-right tabular-nums">{d.mastered}/{d.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 shadow-sm hover-lift animate-in" style={{ animationDelay: '0.5s' }}>
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 flex items-center justify-center bg-amber-100 rounded-xl flex-shrink-0">
                <Lightbulb className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-amber-900 mb-1.5">{t.tipTitle}</h3>
                <p className="text-sm text-amber-800 leading-relaxed">{t.tipText}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center animate-in" style={{ animationDelay: '0.6s' }}>
          <p className="text-xs text-muted-foreground">{t.saved}</p>
          <Button onClick={onReset} variant="link" className="text-xs h-auto p-0 text-muted-foreground hover:text-destructive transition-colors">
            {t.resetProgress}
          </Button>
        </div>
      </div>
    </div>
  );
}
