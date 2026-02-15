"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Flame } from "lucide-react";
import { useLang } from "@/components/common/LangContext";
import type { Stats } from "@/lib/storage";
import { getLevelFromXP, getXPForNextLevel, getLevelProgress } from "@/lib/storage";

interface LevelStreakCardsProps {
  stats: Stats;
}

export function LevelStreakCards({ stats }: LevelStreakCardsProps) {
  const { t } = useLang();

  return (
    <div className="grid grid-cols-2 gap-3">
      <Card className="overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 flex items-center justify-center bg-primary/10 rounded-xl">
              <Trophy className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs font-extrabold text-primary uppercase tracking-widest">
              {t.level}
            </span>
          </div>
          <div className="text-5xl font-black text-primary mb-1">
            {getLevelFromXP(stats.totalXP)}
          </div>
          <div className="text-xs font-bold text-muted-foreground mb-3">
            {getXPForNextLevel(stats.totalXP)}XP {t.nextLevel}
          </div>
          <Progress value={getLevelProgress(stats.totalXP)} className="h-3" />
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 flex items-center justify-center bg-streak/10 rounded-xl">
              <Flame className="w-5 h-5 text-streak" />
            </div>
            <span className="text-xs font-extrabold text-streak uppercase tracking-widest">
              {t.dailyStreak}
            </span>
          </div>
          <div className="flex items-baseline gap-1 mb-1">
            <div className="text-5xl font-black text-streak">
              {stats.currentStreak}
            </div>
          </div>
          <div className="text-xs font-bold text-muted-foreground">
            {t.bestStreak}: {stats.bestStreak}{t.streakDays}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
