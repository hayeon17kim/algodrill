"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertTriangle, ChevronRight } from "lucide-react";
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
    <Card className="border-destructive/30 bg-destructive/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-destructive text-base font-extrabold uppercase tracking-wider">
          <AlertTriangle className="w-5 h-5" />
          {lang === "ko" ? "취약 패턴 Top 3" : "Weak Patterns"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {weakCategories.map((weak, idx) => {
          const cat = CATEGORIES.find((c) => c.id === weak.categoryId);
          if (!cat) return null;

          return (
            <button
              key={weak.categoryId}
              onClick={() => onFocusCategory(weak.categoryId)}
              className="option-tile w-full"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-destructive text-destructive-foreground flex items-center justify-center font-black text-sm">
                  {idx + 1}
                </div>
                <div className="text-xl">{cat.icon}</div>
                <div className="text-left flex-1">
                  <div className="font-extrabold">{L(cat.name, lang)}</div>
                  <div className="text-xs font-bold text-muted-foreground">
                    {lang === "ko" ? "최근 오답" : "Recent errors"}: {weak.recentErrors}
                  </div>
                </div>
                <div className="text-right flex items-center gap-1">
                  <div className="text-xl font-black text-destructive">
                    {weak.accuracy}%
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}
