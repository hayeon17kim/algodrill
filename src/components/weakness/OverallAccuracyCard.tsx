"use client";

import { Card, CardContent } from "@/components/ui/card";

interface OverallAccuracyCardProps {
  accuracy: number;
  totalAttempts: number;
  lang: "ko" | "en";
}

export function OverallAccuracyCard({ accuracy, totalAttempts, lang }: OverallAccuracyCardProps) {
  return (
    <Card className="bg-primary text-primary-foreground border-0" style={{ boxShadow: "0 4px 0 hsl(102 78% 30%)" }}>
      <CardContent className="p-6 text-center">
        <div className="text-7xl font-black mb-1">
          {accuracy}%
        </div>
        <div className="text-sm font-bold opacity-80">
          {lang === "ko" ? "전체 정답률" : "Overall Accuracy"}
        </div>
        <div className="text-xs font-bold opacity-60 mt-2">
          {totalAttempts} {lang === "ko" ? "문제 시도" : "questions attempted"}
        </div>
      </CardContent>
    </Card>
  );
}
