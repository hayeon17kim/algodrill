"use client";

import { useLang } from "@/components/common/LangContext";
import type { SessionResult } from "./SessionScreen";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Flame, Zap, BookOpen, CheckCircle2, XCircle, Sparkles, ArrowRight, Home } from "lucide-react";

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
  const { lang, t } = useLang();
  const correct = results.filter((r) => r.correct).length;
  const total = results.length;
  const pct = Math.round((correct / total) * 100);
  const didLevelUp = newLevel > oldLevel;
  const isPerfect = pct === 100;

  const getResultConfig = () => {
    if (isPerfect) return { message: t.resultPerfect, Icon: Trophy, color: "text-warning", bg: "bg-warning/10", border: "border-warning" };
    if (pct >= 80) return { message: t.resultGreat, Icon: Flame, color: "text-streak", bg: "bg-streak/10", border: "border-streak" };
    if (pct >= 60) return { message: t.resultGood, Icon: Zap, color: "text-info", bg: "bg-info/10", border: "border-info" };
    return { message: t.resultStudy, Icon: BookOpen, color: "text-primary", bg: "bg-primary/10", border: "border-primary" };
  };

  const { message, Icon, color, bg, border } = getResultConfig();

  // For result dots: summarize if more than 10
  const shouldSummarize = results.length > 10;
  const wrongCount = total - correct;

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

        {/* Hero Icon — perfect score gets gold tone */}
        <div className="flex justify-center animate-bounce-in">
          <div
            className={`w-28 h-28 rounded-3xl flex items-center justify-center border-4 ${
              isPerfect
                ? "bg-warning/10 border-warning"
                : `bg-card ${border}`
            }`}
            style={{
              boxShadow: isPerfect
                ? "0 6px 0 hsl(38 92% 38%)"
                : `0 6px 0 hsl(var(--primary) / 0.5)`
            }}
          >
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
                className={`h-full rounded-full transition-all duration-1000 ${
                  isPerfect ? "bg-warning" : "bg-primary"
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className={`text-lg font-black ${isPerfect ? "text-warning" : "text-primary"}`}>{pct}%</span>
          </div>
        </div>

        {/* XP Card — simplified, no duplicate score/accuracy */}
        <Card className="animate-slide-up">
          <CardContent className="p-5">
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
          </CardContent>
        </Card>

        {/* Streak Card — fixed text order */}
        {streakUpdated && (
          <div className="rounded-2xl border-2 border-streak/30 bg-streak/10 p-5 animate-slide-up">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-streak/20 rounded-2xl flex-shrink-0">
                <Flame className="w-7 h-7 text-streak" />
              </div>
              <div className="text-left flex-1">
                <div className="font-extrabold text-foreground text-base">{t.streakSafe}</div>
                <div className="text-sm font-bold text-muted-foreground">
                  {lang === "ko"
                    ? `${newStreak}${t.streakDay}`
                    : `${newStreak}${t.streakDay}`
                  }
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Conditional message: perfect → celebration, otherwise → spaced repeat */}
        <p className="text-sm font-bold text-muted-foreground">
          {isPerfect ? t.perfectCelebration : t.spacedRepeat}
        </p>

        {/* Result Dots or Summary */}
        {shouldSummarize ? (
          <div className="flex items-center justify-center gap-4 animate-slide-up">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-sm font-bold">{correct}{t.resultSummaryCorrect}</span>
            </div>
            {wrongCount > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-destructive flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-destructive-foreground" />
                </div>
                <span className="text-sm font-bold">{wrongCount}{t.resultSummaryWrong}</span>
              </div>
            )}
          </div>
        ) : (
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
        )}

        {/* CTA — primary "Continue Learning" + sub "Home" link */}
        <div className="space-y-3">
          <Button onClick={onHome} size="lg" className="w-full h-16 text-lg btn-3d gap-2">
            {t.continueLearning}
            <ArrowRight className="w-5 h-5" />
          </Button>
          <button
            onClick={onHome}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors mx-auto"
          >
            <Home className="w-4 h-4" />
            {t.backToHome}
          </button>
        </div>
      </div>
    </div>
  );
}
