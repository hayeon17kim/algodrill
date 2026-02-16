"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, CheckCircle2, ChevronRight, Pencil } from "lucide-react";
import { useLang } from "@/components/common/LangContext";
import { Button } from "@/components/ui/button";

interface StatsCardProps {
  dailyGoal: number;
  todayCorrect: number;
  todayTotal: number;
  dueCount: number;
  setDailyGoal: (goal: number) => void;
  onStart: () => void;
}

/** Returns an emoji + localized comment based on accuracy */
function getAccuracyFeedback(
  correct: number,
  total: number,
  t: Record<string, string>
): { emoji: string; text: string } {
  if (total === 0) return { emoji: "", text: "" };
  const pct = Math.round((correct / total) * 100);
  if (pct === 100) return { emoji: "🎯", text: t.feedbackPerfect };
  if (pct >= 80) return { emoji: "🔥", text: t.feedbackGreat };
  if (pct >= 60) return { emoji: "💪", text: t.feedbackGood };
  return { emoji: "📚", text: t.feedbackKeepGoing };
}

export function StatsCard({ dailyGoal, todayCorrect, todayTotal, dueCount, setDailyGoal, onStart }: StatsCardProps) {
  const { lang, t } = useLang();
  const [showGoalSelector, setShowGoalSelector] = useState(false);

  // Show goal selector on first use (when todayTotal is 0 and dailyGoal is default)
  useEffect(() => {
    if (todayTotal === 0 && dailyGoal === 10) {
      const hasSeenGoalSelector = sessionStorage.getItem("hasSeenGoalSelector");
      if (!hasSeenGoalSelector) {
        setShowGoalSelector(true);
        sessionStorage.setItem("hasSeenGoalSelector", "true");
      }
    }
  }, [todayTotal, dailyGoal]);

  const handleGoalSelect = (goal: number) => {
    setDailyGoal(goal);
    setShowGoalSelector(false);
  };

  if (showGoalSelector) {
    return (
      <Card className="bg-primary text-primary-foreground border-0 overflow-hidden" style={{ boxShadow: "0 4px 0 hsl(238 84% 50%)" }}>
        <CardContent className="p-6">
          <div className="space-y-4">
            <p className="text-sm font-bold opacity-90">
              {lang === "ko" ? "하루에 몇 문제씩 풀고 싶으세요?" : "How many questions per day?"}
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[5, 10, 20].map((goal) => (
                <Button
                  key={goal}
                  onClick={() => handleGoalSelect(goal)}
                  variant="secondary"
                  className="h-16 text-lg font-black"
                >
                  {goal}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ── State detection ──
  const isCompleted = todayTotal >= dailyGoal;
  const isPerfect = isCompleted && todayCorrect === todayTotal;
  const wrongCount = todayTotal - todayCorrect;
  const remaining = Math.max(dailyGoal - todayTotal, 0);
  const progressPercent = Math.min((todayTotal / dailyGoal) * 100, 100);
  const accuracyPct = todayTotal > 0 ? Math.round((todayCorrect / todayTotal) * 100) : 0;
  const feedback = getAccuracyFeedback(todayCorrect, todayTotal, t);

  // ── CTA text & style based on state ──
  let ctaText: string;
  let ctaStyle: string;

  if (!isCompleted && todayTotal === 0) {
    // Not started
    ctaText = dueCount > 0 ? t.startSession : t.reviewAll;
    ctaStyle = "w-full h-14 text-lg font-black mt-4 bg-white text-primary hover:bg-white/90 shadow-lg border-2 border-white/60";
  } else if (!isCompleted) {
    // In progress
    ctaText = `${t.continueSession} · ${remaining} ${t.remainingCount}`;
    ctaStyle = "w-full h-14 text-lg font-black mt-4 bg-white text-primary hover:bg-white/90 shadow-lg border-2 border-white/60";
  } else if (wrongCount > 0) {
    // Completed with mistakes
    ctaText = t.reviewMistakes;
    ctaStyle = "w-full h-12 text-base font-bold mt-4 bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/25 border border-primary-foreground/30";
  } else {
    // Perfect
    ctaText = t.studyAhead;
    ctaStyle = "w-full h-12 text-base font-bold mt-4 bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/25 border border-primary-foreground/30";
  }

  return (
    <Card className="group bg-primary text-primary-foreground border-0 overflow-hidden" style={{ boxShadow: "0 4px 0 hsl(238 84% 50%)" }}>
      <CardContent className="p-6">
        {/* ── Completed state: celebration header ── */}
        {isCompleted && (
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-primary-foreground/20">
            <CheckCircle2 className="w-5 h-5" />
            <p className="text-sm font-black uppercase tracking-wide">
              {t.completedToday}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between">
          {/* Left: numbers */}
          <div className="space-y-1">
            {!isCompleted && (
              <p className="text-sm font-black uppercase tracking-wide opacity-90">
                {t.todayStudy}
              </p>
            )}
            <p className="text-6xl font-black mt-1">
              {todayTotal}
              <button
                onClick={() => setShowGoalSelector(true)}
                className="text-3xl opacity-60 hover:opacity-90 transition-opacity inline-flex items-center gap-0.5"
                title={lang === "ko" ? "목표 변경" : "Change goal"}
              >
                /{dailyGoal}
                <Pencil className="w-3 h-3 opacity-0 group-hover:opacity-100" />
              </button>
            </p>
            {/* Progress bar */}
            <div className="w-full bg-primary-foreground/20 rounded-full h-2 mt-2">
              <div
                className="bg-primary-foreground rounded-full h-2 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Right: accuracy feedback (only when questions attempted) */}
          {todayTotal > 0 ? (
            <div className="text-center flex flex-col items-center gap-1">
              {/* Accuracy ring */}
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="opacity-20" />
                  <circle
                    cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4"
                    strokeDasharray={`${accuracyPct * 1.76} 176`}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                  />
                </svg>
                <span className="absolute text-base font-black">{accuracyPct}%</span>
              </div>
              {/* Feedback comment */}
              <p className="text-xs font-bold">
                {feedback.emoji} {feedback.text}
              </p>
            </div>
          ) : (
            <div className="text-center flex flex-col items-center gap-2">
              <div className="w-16 h-16 flex items-center justify-center bg-primary-foreground/20 rounded-2xl">
                <Brain className="w-10 h-10" />
              </div>
            </div>
          )}
        </div>

        {/* ── Primary CTA ── */}
        <Button
          onClick={onStart}
          variant="ghost"
          size="lg"
          className={ctaStyle}
        >
          {ctaText}
          {!isCompleted && <ChevronRight className="w-5 h-5 ml-1" />}
        </Button>
      </CardContent>
    </Card>
  );
}
