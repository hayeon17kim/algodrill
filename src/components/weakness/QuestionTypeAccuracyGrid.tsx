"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Target } from "lucide-react";
import { getScoreColor } from "@/lib/questionStyles";
import type { TypeStats } from "@/lib/storage";

const TYPE_NAMES = {
  ko: {
    pattern: "패턴 인식",
    approach: "접근 순서",
    fillblank: "빈칸 채우기",
    speaking: "말하기 연습",
    complexity: "복잡도 분석",
  },
  en: {
    pattern: "Pattern Recognition",
    approach: "Approach Steps",
    fillblank: "Fill in the Blank",
    speaking: "Speaking Practice",
    complexity: "Complexity Analysis",
  },
};

interface QuestionTypeAccuracyGridProps {
  typeStats: TypeStats[];
  lang: "ko" | "en";
}

export function QuestionTypeAccuracyGrid({ typeStats, lang }: QuestionTypeAccuracyGridProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          {lang === "ko" ? "문제 유형별 정답률" : "Accuracy by Question Type"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {typeStats.map((stat) => (
            <div
              key={stat.type}
              className={`rounded-lg p-4 border ${getScoreColor(stat.accuracy)}`}
            >
              <div className="text-sm font-medium mb-1">
                {(TYPE_NAMES[lang] as Record<string, string>)[stat.type] || stat.type}
              </div>
              <div className="text-3xl font-bold">{stat.accuracy}%</div>
              <div className="text-xs opacity-75 mt-1">
                {stat.correct}/{stat.total} {lang === "ko" ? "정답" : "correct"}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
