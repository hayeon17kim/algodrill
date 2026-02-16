"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Flame, Brain, Settings } from "lucide-react";
import { useLang } from "@/components/common/LangContext";
import { Button } from "@/components/ui/button";

interface StatsCardProps {
  dailyGoal: number;
  todayCorrect: number;
  todayTotal: number;
  setDailyGoal: (goal: number) => void;
}

export function StatsCard({ dailyGoal, todayCorrect, todayTotal, setDailyGoal }: StatsCardProps) {
  const { lang, t } = useLang();
  const [showGoalSelector, setShowGoalSelector] = useState(false);

  // Show goal selector on first use (when todayTotal is 0 and dailyGoal is default)
  useEffect(() => {
    if (todayTotal === 0 && dailyGoal === 10) {
      // Only show once per session
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

  const isOverGoal = todayTotal > dailyGoal;
  const progressPercent = Math.min((todayTotal / dailyGoal) * 100, 100);

  return (
    <Card className="bg-primary text-primary-foreground border-0 overflow-hidden" style={{ boxShadow: "0 4px 0 hsl(238 84% 50%)" }}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-black uppercase tracking-wide opacity-90">
                {t.todayStudy}
              </p>
              <button
                onClick={() => setShowGoalSelector(true)}
                className="opacity-60 hover:opacity-100 transition-opacity"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-6xl font-black mt-1">
              {todayTotal}
              <span className="text-3xl opacity-60">/{dailyGoal}</span>
            </p>
            <div className="w-full bg-primary-foreground/20 rounded-full h-2 mt-2">
              <div
                className="bg-primary-foreground rounded-full h-2 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {isOverGoal && (
              <p className="text-xs font-bold opacity-80 pt-1">
                {lang === "ko" ? "목표 달성! 🎉" : "Goal achieved! 🎉"}
              </p>
            )}
          </div>
          <div className="text-center flex flex-col items-center gap-2">
            <div className="w-16 h-16 flex items-center justify-center bg-primary-foreground/20 rounded-2xl">
              {todayCorrect >= 5 ? (
                <Flame className="w-10 h-10" />
              ) : (
                <Brain className="w-10 h-10" />
              )}
            </div>
            <p className="text-xs font-bold opacity-90">
              {todayCorrect}/{todayTotal} {t.correct}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
