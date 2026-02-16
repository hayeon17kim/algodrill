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
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 flex items-center justify-center bg-secondary rounded-xl">
              <Trophy className="w-4 h-4 text-muted-foreground" />
            </div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {t.level}
            </span>
          </div>
          <div className="text-4xl font-black text-foreground mb-1">
            {getLevelFromXP(stats.totalXP)}
          </div>
          <div className="text-xs font-bold text-muted-foreground mb-2">
            {getXPForNextLevel(stats.totalXP)}XP {t.nextLevel}
          </div>
          <Progress value={getLevelProgress(stats.totalXP)} className="h-2" />
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 flex items-center justify-center bg-streak/10 rounded-xl">
              <Flame className="w-4 h-4 text-streak" />
            </div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {t.dailyStreak}
            </span>
          </div>
          <div className="flex items-baseline gap-1 mb-1">
            <div className="text-4xl font-black text-foreground">
              {stats.currentStreak}
            </div>
          </div>
          {stats.bestStreak > 0 && (
            <div className="text-xs font-bold text-muted-foreground">
              {t.bestStreak}: {stats.bestStreak}{t.streakDays}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
