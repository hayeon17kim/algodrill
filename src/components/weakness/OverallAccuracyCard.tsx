"use client";

import { Card, CardContent } from "@/components/ui/card";

interface OverallAccuracyCardProps {
  accuracy: number;
  totalAttempts: number;
  lang: "ko" | "en";
}

export function OverallAccuracyCard({ accuracy, totalAttempts, lang }: OverallAccuracyCardProps) {
  return (
    <Card className="mb-6">
      <CardContent className="p-6 text-center">
        <div className="text-6xl font-bold text-primary mb-2">
          {accuracy}%
        </div>
        <div className="text-muted-foreground">
          {lang === "ko" ? "전체 정답률" : "Overall Accuracy"}
        </div>
        <div className="text-sm text-muted-foreground mt-2">
          {totalAttempts} {lang === "ko" ? "문제 시도" : "questions attempted"}
        </div>
      </CardContent>
    </Card>
  );
}
