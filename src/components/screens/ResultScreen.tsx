"use client";

import { useLang } from "@/components/common/LangContext";
import type { SessionResult } from "./SessionScreen";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Flame, Zap, BookOpen, CheckCircle2, XCircle, Sparkles } from "lucide-react";

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
    if (pct === 100) return { message: t.resultPerfect, Icon: Trophy, color: "text-warning" };
    if (pct >= 80) return { message: t.resultGreat, Icon: Flame, color: "text-streak" };
    if (pct >= 60) return { message: t.resultGood, Icon: Zap, color: "text-info" };
    return { message: t.resultStudy, Icon: BookOpen, color: "text-primary" };
  };

  const { message, Icon, color } = getResultConfig();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-lg mx-auto px-4 text-center space-y-6 py-12">
        {/* Level Up Banner */}
        {didLevelUp && (
          <div className="bg-warning text-warning-foreground rounded-2xl p-5 animate-bounce-in" style={{ boxShadow: "0 4px 0 hsl(38 92% 38%)" }}>
            <div className="flex items-center justify-center gap-3">
              <Sparkles className="w-7 h-7" />
              <div>
                <div className="text-xl font-black">{t.levelUp}</div>
                <div className="text-base font-extrabold">{t.level} {newLevel}</div>
              </div>
              <Sparkles className="w-7 h-7" />
            </div>
          </div>
        )}

        {/* Hero Icon */}
        <div className="flex justify-center animate-bounce-in">
          <div className="w-28 h-28 rounded-3xl bg-card border-4 border-primary flex items-center justify-center" style={{ boxShadow: "0 6px 0 hsl(102 78% 30%)" }}>
            <Icon className={`w-16 h-16 ${color}`} />
          </div>
        </div>

        {/* Score */}
        <div className="space-y-3 animate-slide-up">
          <h2 className="text-3xl font-black text-balance">{message}</h2>
          <div className="inline-flex items-baseline gap-2">
            <span className="text-7xl font-black text-primary">{correct}</span>
            <span className="text-4xl font-black text-muted-foreground">/</span>
            <span className="text-7xl font-black text-primary">{total}</span>
          </div>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-4 w-36 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-1000"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-lg font-black text-primary">{pct}%</span>
          </div>
        </div>

        {/* XP Card */}
        <Card className="animate-slide-up">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-xl">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-extrabold">{t.xpEarned}</span>
              </div>
              <span className="text-3xl font-black text-primary">
                +{earnedXP} XP
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-3 border-t-2 border-border">
              <div className="text-center">
                <div className="text-xs font-bold text-muted-foreground mb-1">{t.questionsCorrect}</div>
                <div className="text-lg font-black">{correct}/{total}</div>
              </div>
              <div className="text-center">
                <div className="text-xs font-bold text-muted-foreground mb-1">{t.accuracyRate}</div>
                <div className="text-lg font-black">{pct}%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Streak Card */}
        {streakUpdated && (
          <div className="rounded-2xl border-2 border-streak/30 bg-streak/10 p-5 animate-slide-up">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-streak/20 rounded-2xl flex-shrink-0">
                <Flame className="w-7 h-7 text-streak" />
              </div>
              <div className="text-left flex-1">
                <div className="font-extrabold text-foreground text-base">{t.streakSafe}</div>
                <div className="text-sm font-bold text-muted-foreground">
                  {newStreak}{t.streakDays} {t.currentStreak}
                </div>
              </div>
            </div>
          </div>
        )}

        <p className="text-sm font-bold text-muted-foreground">
          {t.spacedRepeat}
        </p>

        {/* Result Dots */}
        <div className="flex gap-2 justify-center flex-wrap">
          {results.map((r, i) => (
            <div
              key={i}
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                r.correct
                  ? "bg-primary"
                  : "bg-destructive"
              }`}
            >
              {r.correct ? (
                <CheckCircle2 className="w-6 h-6 text-primary-foreground" />
              ) : (
                <XCircle className="w-6 h-6 text-destructive-foreground" />
              )}
            </div>
          ))}
        </div>

        <Button onClick={onHome} size="lg" className="w-full h-16 text-lg">
          {t.goHome}
        </Button>
      </div>
    </div>
  );
}
