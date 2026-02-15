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
    <Card className="bg-primary text-primary-foreground border-0 overflow-hidden" style={{ boxShadow: "0 4px 0 hsl(102 78% 30%)" }}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest opacity-80">
              {t.todayStudy}
            </p>
            <p className="text-6xl font-black mt-1">{dueCount}</p>
            <p className="text-sm font-bold opacity-80">{t.problems}</p>
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
