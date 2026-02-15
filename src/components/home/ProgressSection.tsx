"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLang } from "@/components/common/LangContext";

interface ProgressSectionProps {
  mastered: number;
  totalQ: number;
  categoryStats: Record<string, { total: number; mastered: number }>;
}

export function ProgressSection({ mastered, totalQ, categoryStats }: ProgressSectionProps) {
  const { t } = useLang();
  const pct = totalQ > 0 ? Math.round((mastered / totalQ) * 100) : 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-extrabold flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
          {t.progress}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-3 p-4 bg-secondary/50 rounded-2xl">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold">{t.totalMaster}</span>
            <span className="text-lg font-black text-primary">
              {mastered}/{totalQ}
            </span>
          </div>
          <Progress value={pct} className="h-4" />
          <div className="text-right text-xs font-extrabold text-primary">
            {pct}%
          </div>
        </div>

        <div className="space-y-3">
          {Object.entries(categoryStats).map(([cat, d]) => {
            const catPct = d.total > 0 ? Math.round((d.mastered / d.total) * 100) : 0;
            return (
              <div key={cat} className="flex items-center justify-between gap-3">
                <span className="text-sm font-bold truncate max-w-[140px]">
                  {cat}
                </span>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <Progress value={catPct} className="w-24 h-3" />
                  <span className="text-xs font-extrabold text-muted-foreground w-10 text-right tabular-nums">
                    {d.mastered}/{d.total}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
