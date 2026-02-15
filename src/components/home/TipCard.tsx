"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { useLang } from "@/components/common/LangContext";
import { parseSimpleMarkdown } from "@/lib/markdown";

export function TipCard() {
  const { t } = useLang();

  return (
    <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-900">
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-900 rounded-xl flex-shrink-0">
            <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-amber-900 dark:text-amber-100 mb-1.5">
              {t.tipTitle}
            </h3>
            <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
              {parseSimpleMarkdown(t.tipText)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
