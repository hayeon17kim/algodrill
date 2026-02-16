"use client";

import { Trophy, Flame } from "lucide-react";
import { useLang } from "@/components/common/LangContext";
import type { Stats } from "@/lib/storage";
import { getLevelFromXP, getXPForNextLevel, getLevelProgress } from "@/lib/storage";

interface LevelStreakCardsProps {
  stats: Stats;
}

export function LevelStreakCards({ stats }: LevelStreakCardsProps) {
  const { t } = useLang();
  const level = getLevelFromXP(stats.totalXP);
  const xpToNext = getXPForNextLevel(stats.totalXP);
  const levelPct = getLevelProgress(stats.totalXP);

  return (
    <div className="flex items-center gap-3 px-1">
      {/* Level — inline */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="w-7 h-7 flex items-center justify-center bg-secondary rounded-lg flex-shrink-0">
          <Trophy className="w-3.5 h-3.5 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-sm font-black text-foreground">Lv.{level}</span>
          <span className="text-xs text-muted-foreground font-medium truncate">
            · {xpToNext}XP {t.nextLevel}
          </span>
        </div>
        {/* Tiny progress bar */}
        <div className="w-12 h-1.5 bg-secondary rounded-full flex-shrink-0 hidden sm:block">
          <div
            className="h-1.5 bg-primary/40 rounded-full transition-all"
            style={{ width: `${levelPct}%` }}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-border flex-shrink-0" />

      {/* Streak — inline */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-7 h-7 flex items-center justify-center bg-streak/10 rounded-lg">
          <Flame className="w-3.5 h-3.5 text-streak" />
        </div>
        <span className="text-sm font-black text-foreground">{stats.currentStreak}</span>
        <span className="text-xs text-muted-foreground font-medium">{t.streakDays}</span>
      </div>
    </div>
  );
}
