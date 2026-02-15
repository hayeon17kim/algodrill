"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { useLang } from "@/components/common/LangContext";
import { parseSimpleMarkdown } from "@/lib/markdown";

export function TipCard() {
  const { t } = useLang();

  return (
    <Card className="bg-warning/10 border-warning/30">
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-warning/20 rounded-2xl flex-shrink-0">
            <Lightbulb className="w-5 h-5 text-warning" />
          </div>
          <div className="flex-1">
            <h3 className="font-extrabold text-foreground mb-1.5">
              {t.tipTitle}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {parseSimpleMarkdown(t.tipText)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
