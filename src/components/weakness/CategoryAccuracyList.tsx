"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { CATEGORIES } from "@/data/categories";
import { L } from "@/lib/i18n";
import { getBarColor } from "@/lib/questionStyles";
import type { CategoryStats } from "@/lib/storage";

interface CategoryAccuracyListProps {
  categoryStats: CategoryStats[];
  lang: "ko" | "en";
}

export function CategoryAccuracyList({ categoryStats, lang }: CategoryAccuracyListProps) {
  const sortedCategories = [...categoryStats].sort((a, b) => a.accuracy - b.accuracy);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          {lang === "ko" ? "카테고리별 정답률" : "Accuracy by Category"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedCategories.map((stat) => {
          const cat = CATEGORIES.find((c) => c.id === stat.categoryId);
          if (!cat) return null;

          return (
            <div key={stat.categoryId}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{cat.icon}</span>
                  <span className="font-medium">{L(cat.name, lang)}</span>
                  <span className="text-xs text-muted-foreground">
                    ({stat.correct}/{stat.total})
                  </span>
                </div>
                <div className="font-bold">{stat.accuracy}%</div>
              </div>
              <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full ${getBarColor(stat.accuracy)} transition-all duration-500`}
                  style={{ width: `${stat.accuracy}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
