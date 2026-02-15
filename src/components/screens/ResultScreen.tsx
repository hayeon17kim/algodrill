"use client";

import { useLang } from "@/components/common/LangContext";
import type { SessionResult } from "./SessionScreen";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Flame, Zap, BookOpen, CheckCircle2, XCircle, Sparkles, TrendingUp } from "lucide-react";

interface Props {
  results: SessionResult[];
  earnedXP: number;
  oldLevel: number;
  newLevel: number;
  streakUpdated: boolean;
  newStreak: number;
  onHome: () => void;
}

export function ResultScreen({ results, earnedXP, oldLevel, newLevel, streakUpdated, newStreak, onHome }: Props) {
  const { t } = useLang();
  const correct = results.filter((r) => r.correct).length;
  const total = results.length;
  const pct = Math.round((correct / total) * 100);
  const didLevelUp = newLevel > oldLevel;

  const getResultConfig = () => {
    if (pct === 100) return { message: t.resultPerfect, Icon: Trophy, color: "text-yellow-500" };
    if (pct >= 80) return { message: t.resultGreat, Icon: Flame, color: "text-orange-500" };
    if (pct >= 60) return { message: t.resultGood, Icon: Zap, color: "text-blue-500" };
    return { message: t.resultStudy, Icon: BookOpen, color: "text-indigo-500" };
  };

  const { message, Icon, color } = getResultConfig();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <div className="max-w-md mx-auto px-4 text-center space-y-6 py-12">
        {/* Level Up Banner */}
        {didLevelUp && (
          <div className="animate-bounce">
            <Card className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 border-0 shadow-2xl">
              <CardContent className="p-5 text-white">
                <div className="flex items-center justify-center gap-3">
                  <Sparkles className="w-7 h-7" />
                  <div>
                    <div className="text-xl font-black">🎉 {t.levelUp}</div>
                    <div className="text-base font-bold">{t.level} {newLevel}</div>
                  </div>
                  <Sparkles className="w-7 h-7" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="flex justify-center animate-in">
          <div className={`w-28 h-28 rounded-3xl bg-gradient-to-br ${
            pct === 100 ? 'from-yellow-400 to-orange-500' :
            pct >= 80 ? 'from-orange-400 to-red-500' :
            pct >= 60 ? 'from-blue-400 to-indigo-500' :
            'from-indigo-400 to-purple-500'
          } p-1 shadow-2xl hover-glow`}>
            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-3xl flex items-center justify-center">
              <Icon className={`w-16 h-16 ${color}`} />
            </div>
          </div>
        </div>

        <div className="space-y-3 animate-in" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white">{message}</h2>
          <div className="inline-flex items-baseline gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            <span className="text-6xl font-black">{correct}</span>
            <span className="text-4xl font-bold text-gray-400">/</span>
            <span className="text-6xl font-black">{total}</span>
          </div>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="h-2 w-32 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{pct}%</span>
          </div>
        </div>

        {/* XP Earned Card */}
        <Card className="shadow-lg border-indigo-100 animate-in" style={{ animationDelay: '0.2s' }}>
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 flex items-center justify-center bg-indigo-100 dark:bg-indigo-900 rounded-xl">
                  <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span className="text-sm font-semibold text-foreground">{t.xpEarned}</span>
              </div>
              <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                +{earnedXP} XP
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">{t.questionsCorrect}</div>
                <div className="text-lg font-bold text-foreground">{correct}/{total}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">{t.accuracyRate}</div>
                <div className="text-lg font-bold text-foreground">{pct}%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Streak Update Card */}
        {streakUpdated && (
          <Card className="shadow-lg border-orange-100 animate-in" style={{ animationDelay: '0.25s' }}>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-orange-100 dark:bg-orange-900 rounded-2xl flex-shrink-0">
                  <Flame className="w-7 h-7 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-bold text-orange-900 dark:text-orange-100 text-base">{t.streakSafe}</div>
                  <div className="text-sm text-orange-700 dark:text-orange-300">
                    {newStreak}{t.streakDays} {t.currentStreak}
                  </div>
                </div>
                <div className="text-4xl">🔥</div>
              </div>
            </CardContent>
          </Card>
        )}

        <p className="text-sm text-muted-foreground animate-in" style={{ animationDelay: '0.3s' }}>
          {t.spacedRepeat}
        </p>

        <Card className="p-5 shadow-lg border-muted animate-in" style={{ animationDelay: '0.35s' }}>
          <div className="flex gap-2 justify-center flex-wrap">
            {results.map((r, i) => (
              <div
                key={i}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110 ${
                  r.correct
                    ? "bg-gradient-to-br from-green-400 to-emerald-500 shadow-green-200 shadow-md"
                    : "bg-gradient-to-br from-red-400 to-rose-500 shadow-red-200 shadow-md"
                }`}
              >
                {r.correct ? (
                  <CheckCircle2 className="w-6 h-6 text-white" />
                ) : (
                  <XCircle className="w-6 h-6 text-white" />
                )}
              </div>
            ))}
          </div>
        </Card>

        <Button
          onClick={onHome}
          size="lg"
          className="w-full h-16 rounded-2xl text-lg font-bold shadow-xl hover-lift hover:shadow-2xl transition-all duration-300 animate-in"
          style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", animationDelay: '0.4s' }}
        >
          {t.goHome}
        </Button>
      </div>
    </div>
  );
}
