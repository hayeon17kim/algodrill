"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Flame, Brain } from "lucide-react";
import { useLang } from "@/components/common/LangContext";

interface StatsCardProps {
  dueCount: number;
  todayCorrect: number;
  todayTotal: number;
}

export function StatsCard({ dueCount, todayCorrect, todayTotal }: StatsCardProps) {
  const { t } = useLang();

  return (
    <Card className="bg-primary text-primary-foreground">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider opacity-90">
              {t.todayStudy}
            </p>
            <p className="text-5xl font-bold mt-2">{dueCount}</p>
            <p className="text-sm font-medium opacity-90">{t.problems}</p>
            <p className="text-xs mt-1 opacity-75">{t.reviewDue}</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 flex items-center justify-center bg-primary-foreground/20 rounded-xl">
              {todayCorrect >= 5 ? (
                <Flame className="w-10 h-10" />
              ) : (
                <Brain className="w-10 h-10" />
              )}
            </div>
            <p className="text-xs mt-2 font-semibold">
              {todayCorrect}/{todayTotal} {t.correct}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
