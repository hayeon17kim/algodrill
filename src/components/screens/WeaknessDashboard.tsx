"use client";

import { useLang } from "@/components/common/LangContext";
import { CATEGORIES } from "@/data/categories";
import { L } from "@/lib/i18n";
import {
  getCategoryStats,
  getTypeStats,
  getWeakCategories,
  getOverallAccuracy,
  type QuestionProgress,
} from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, AlertTriangle, BarChart3, Target } from "lucide-react";

interface WeaknessDashboardProps {
  progress: Record<string, QuestionProgress>;
  onBack: () => void;
  onFocusCategory: (categoryId: string) => void;
}

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

export function WeaknessDashboard({ progress, onBack, onFocusCategory }: WeaknessDashboardProps) {
  const { lang, t } = useLang();

  const overallAccuracy = getOverallAccuracy(progress);
  const categoryStats = getCategoryStats(progress);
  const typeStats = getTypeStats(progress);
  const weakCategories = getWeakCategories(progress).slice(0, 3);

  const sortedCategories = [...categoryStats].sort((a, b) => a.accuracy - b.accuracy);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            {t.back}
          </Button>
          <h1 className="text-2xl font-bold">
            {lang === "ko" ? "약점 분석" : "Weakness Analysis"}
          </h1>
          <div className="w-20" />
        </div>

        <Card className="mb-6">
          <CardContent className="p-6 text-center">
            <div className="text-6xl font-bold text-primary mb-2">{overallAccuracy}%</div>
            <div className="text-muted-foreground">
              {lang === "ko" ? "전체 정답률" : "Overall Accuracy"}
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              {categoryStats.reduce((sum, cat) => sum + cat.total, 0)}{" "}
              {lang === "ko" ? "문제 시도" : "questions attempted"}
            </div>
          </CardContent>
        </Card>

        {weakCategories.length > 0 && (
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
                      <div className="text-2xl font-bold text-destructive">#{idx + 1}</div>
                      <div className="text-xl">{cat.icon}</div>
                      <div className="text-left">
                        <div className="font-semibold">{L(cat.name, lang)}</div>
                        <div className="text-sm text-muted-foreground">
                          {lang === "ko" ? "최근 오답" : "Recent errors"}: {weak.recentErrors}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-destructive">{weak.accuracy}%</div>
                      <div className="text-xs text-muted-foreground">
                        {lang === "ko" ? "정답률" : "accuracy"}
                      </div>
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        )}

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

              const getBarColor = (accuracy: number) => {
                if (accuracy >= 80) return "bg-green-500 dark:bg-green-600";
                if (accuracy >= 60) return "bg-yellow-500 dark:bg-yellow-600";
                return "bg-red-500 dark:bg-red-600";
              };

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

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              {lang === "ko" ? "문제 유형별 정답률" : "Accuracy by Question Type"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {typeStats.map((stat) => {
                const getScoreColor = (accuracy: number) => {
                  if (accuracy >= 80) return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800";
                  if (accuracy >= 60) return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800";
                  return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800";
                };

                return (
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
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-900">
          <CardContent className="p-6 text-center text-sm text-blue-800 dark:text-blue-200">
            💡{" "}
            {lang === "ko"
              ? "약한 카테고리를 클릭하면 집중 연습할 수 있습니다"
              : "Click on weak categories to practice them"}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
