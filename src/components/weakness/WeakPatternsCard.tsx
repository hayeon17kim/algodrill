"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { CATEGORIES } from "@/data/categories";
import { L } from "@/lib/i18n";
import type { WeaknessInsight } from "@/lib/storage";

interface WeakPatternsCardProps {
  weakCategories: WeaknessInsight[];
  lang: "ko" | "en";
  onFocusCategory: (categoryId: string) => void;
}

export function WeakPatternsCard({ weakCategories, lang, onFocusCategory }: WeakPatternsCardProps) {
  if (weakCategories.length === 0) return null;

  return (
    <Card className="mb-6 border-destructive/50 bg-destructive/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="w-5 h-5" />
          {lang === "ko" ? "최근 7일 취약 패턴 Top 3" : "Weak Patterns (Last 7 Days)"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {weakCategories.map((weak, idx) => {
          const cat = CATEGORIES.find((c) => c.id === weak.categoryId);
          if (!cat) return null;

          return (
            <button
              key={weak.categoryId}
              onClick={() => onFocusCategory(weak.categoryId)}
              className="w-full bg-card rounded-lg p-4 flex items-center justify-between hover:bg-accent transition-colors border"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold text-destructive">
                  #{idx + 1}
                </div>
                <div className="text-xl">{cat.icon}</div>
                <div className="text-left">
                  <div className="font-semibold">{L(cat.name, lang)}</div>
                  <div className="text-sm text-muted-foreground">
                    {lang === "ko" ? "최근 오답" : "Recent errors"}: {weak.recentErrors}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-destructive">
                  {weak.accuracy}%
                </div>
                <div className="text-xs text-muted-foreground">
                  {lang === "ko" ? "정답률" : "accuracy"}
                </div>
              </div>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}
