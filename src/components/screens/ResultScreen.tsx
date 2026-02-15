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
    if (pct === 100) return { message: t.resultPerfect, Icon: Trophy, color: "text-yellow-600 dark:text-yellow-400" };
    if (pct >= 80) return { message: t.resultGreat, Icon: Flame, color: "text-orange-600 dark:text-orange-400" };
    if (pct >= 60) return { message: t.resultGood, Icon: Zap, color: "text-blue-600 dark:text-blue-400" };
    return { message: t.resultStudy, Icon: BookOpen, color: "text-primary" };
  };

  const { message, Icon, color } = getResultConfig();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md mx-auto px-4 text-center space-y-6 py-12">
        {didLevelUp && (
          <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 border-0">
            <CardContent className="p-5 text-white">
              <div className="flex items-center justify-center gap-3">
                <Sparkles className="w-7 h-7" />
                <div>
                  <div className="text-xl font-bold">🎉 {t.levelUp}</div>
                  <div className="text-base font-semibold">{t.level} {newLevel}</div>
                </div>
                <Sparkles className="w-7 h-7" />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-center">
          <div className="w-28 h-28 rounded-3xl bg-card border-4 border-primary flex items-center justify-center">
            <Icon className={`w-16 h-16 ${color}`} />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl font-bold">{message}</h2>
          <div className="inline-flex items-baseline gap-2">
            <span className="text-6xl font-bold text-primary">{correct}</span>
            <span className="text-4xl font-bold text-muted-foreground">/</span>
            <span className="text-6xl font-bold text-primary">{total}</span>
          </div>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="h-2 w-32 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-1000"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-lg font-bold text-primary">{pct}%</span>
          </div>
        </div>

        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 flex items-center justify-center bg-secondary rounded-xl">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-semibold">{t.xpEarned}</span>
              </div>
              <span className="text-3xl font-bold text-primary">
                +{earnedXP} XP
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2 border-t">
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">{t.questionsCorrect}</div>
                <div className="text-lg font-bold">{correct}/{total}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">{t.accuracyRate}</div>
                <div className="text-lg font-bold">{pct}%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {streakUpdated && (
          <Card className="border-orange-200 dark:border-orange-900">
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

        <p className="text-sm text-muted-foreground">
          {t.spacedRepeat}
        </p>

        <Card className="p-5">
          <div className="flex gap-2 justify-center flex-wrap">
            {results.map((r, i) => (
              <div
                key={i}
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  r.correct
                    ? "bg-green-500 dark:bg-green-600"
                    : "bg-red-500 dark:bg-red-600"
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

        <Button onClick={onHome} size="lg" className="w-full h-16 text-lg font-bold">
          {t.goHome}
        </Button>
      </div>
    </div>
  );
}
