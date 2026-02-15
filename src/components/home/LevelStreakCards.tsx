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
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 flex items-center justify-center bg-secondary rounded-lg">
              <Trophy className="w-4 h-4 text-primary" />
            </div>
            <span className="text-xs font-semibold text-primary uppercase tracking-wide">
              {t.level}
            </span>
          </div>
          <div className="text-4xl font-bold text-primary mb-1">
            {getLevelFromXP(stats.totalXP)}
          </div>
          <div className="text-xs text-muted-foreground mb-2">
            {getXPForNextLevel(stats.totalXP)}XP {t.nextLevel}
          </div>
          <Progress value={getLevelProgress(stats.totalXP)} className="h-2" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 flex items-center justify-center bg-orange-100 dark:bg-orange-950 rounded-lg">
              <Flame className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wide">
              {t.dailyStreak}
            </span>
          </div>
          <div className="flex items-baseline gap-1 mb-1">
            <div className="text-4xl font-bold text-orange-600 dark:text-orange-400">
              {stats.currentStreak}
            </div>
            <div className="text-xl">🔥</div>
          </div>
          <div className="text-xs text-muted-foreground">
            {t.bestStreak}: {stats.bestStreak}{t.streakDays}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
