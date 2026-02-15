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

  // Sort categories by accuracy (lowest first)
  const sortedCategories = [...categoryStats].sort((a, b) => a.accuracy - b.accuracy);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="text-2xl hover:scale-110 transition-transform"
          >
            ← {t.back}
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {lang === "ko" ? "약점 분석" : "Weakness Analysis"}
          </h1>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Overall Accuracy */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="text-center">
            <div className="text-6xl font-bold text-purple-600 mb-2">{overallAccuracy}%</div>
            <div className="text-gray-600">
              {lang === "ko" ? "전체 정답률" : "Overall Accuracy"}
            </div>
            <div className="text-sm text-gray-400 mt-2">
              {categoryStats.reduce((sum, cat) => sum + cat.total, 0)}{" "}
              {lang === "ko" ? "문제 시도" : "questions attempted"}
            </div>
          </div>
        </div>

        {/* Weak Categories Alert */}
        {weakCategories.length > 0 && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-bold text-red-800 mb-4">
              ⚠️ {lang === "ko" ? "최근 7일 취약 패턴 Top 3" : "Weak Patterns (Last 7 Days)"}
            </h2>
            <div className="space-y-3">
              {weakCategories.map((weak, idx) => {
                const cat = CATEGORIES.find((c) => c.id === weak.categoryId);
                if (!cat) return null;
                return (
                  <button
                    key={weak.categoryId}
                    onClick={() => onFocusCategory(weak.categoryId)}
                    className="w-full bg-white rounded-xl p-4 flex items-center justify-between hover:bg-red-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold text-red-500">#{idx + 1}</div>
                      <div className="text-xl">{cat.icon}</div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-800">{L(cat.name, lang)}</div>
                        <div className="text-sm text-gray-500">
                          {lang === "ko" ? "최근 오답" : "Recent errors"}: {weak.recentErrors}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-600">{weak.accuracy}%</div>
                      <div className="text-xs text-gray-400">
                        {lang === "ko" ? "정답률" : "accuracy"}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Category Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            📊 {lang === "ko" ? "카테고리별 정답률" : "Accuracy by Category"}
          </h2>
          <div className="space-y-4">
            {sortedCategories.map((stat) => {
              const cat = CATEGORIES.find((c) => c.id === stat.categoryId);
              if (!cat) return null;

              const getBarColor = (accuracy: number) => {
                if (accuracy >= 80) return "bg-green-500";
                if (accuracy >= 60) return "bg-yellow-500";
                return "bg-red-500";
              };

              return (
                <div key={stat.categoryId}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{cat.icon}</span>
                      <span className="font-medium text-gray-700">{L(cat.name, lang)}</span>
                      <span className="text-xs text-gray-400">
                        ({stat.correct}/{stat.total})
                      </span>
                    </div>
                    <div className="font-bold text-gray-800">{stat.accuracy}%</div>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getBarColor(stat.accuracy)} transition-all duration-500`}
                      style={{ width: `${stat.accuracy}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Type Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            🎯 {lang === "ko" ? "문제 유형별 정답률" : "Accuracy by Question Type"}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {typeStats.map((stat) => {
              const getScoreColor = (accuracy: number) => {
                if (accuracy >= 80) return "text-green-600 bg-green-50";
                if (accuracy >= 60) return "text-yellow-600 bg-yellow-50";
                return "text-red-600 bg-red-50";
              };

              return (
                <div
                  key={stat.type}
                  className={`rounded-xl p-4 ${getScoreColor(stat.accuracy)} border-2 ${
                    stat.accuracy >= 80
                      ? "border-green-200"
                      : stat.accuracy >= 60
                      ? "border-yellow-200"
                      : "border-red-200"
                  }`}
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
        </div>

        {/* Tips */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
          <div className="text-center text-sm text-blue-800">
            💡{" "}
            {lang === "ko"
              ? "약한 카테고리를 클릭하면 집중 연습할 수 있습니다"
              : "Click on weak categories to practice them"}
          </div>
        </div>
      </div>
    </div>
  );
}
