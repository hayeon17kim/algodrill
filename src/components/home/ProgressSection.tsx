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

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <div className="w-1 h-6 bg-primary rounded-full" />
          {t.progress}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-3 p-4 bg-muted rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{t.totalMaster}</span>
            <span className="text-lg font-bold text-primary">
              {mastered}/{totalQ}
            </span>
          </div>
          <Progress value={(mastered / totalQ) * 100} className="h-3" />
          <div className="text-right text-xs font-semibold text-primary">
            {Math.round((mastered / totalQ) * 100)}%
          </div>
        </div>

        <div className="space-y-3">
          {Object.entries(categoryStats).map(([cat, d]) => (
            <div key={cat} className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium truncate max-w-[140px]">
                {cat}
              </span>
              <div className="flex items-center gap-3 flex-shrink-0">
                <Progress value={(d.mastered / d.total) * 100} className="w-24 h-2" />
                <span className="text-xs font-semibold text-muted-foreground w-10 text-right tabular-nums">
                  {d.mastered}/{d.total}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
