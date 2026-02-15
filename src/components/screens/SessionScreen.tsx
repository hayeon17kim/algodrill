"use client";

import { useState } from "react";
import { useLang } from "@/components/common/LangContext";
import { ProgressBar } from "@/components/common/ProgressBar";
import { QuestionRenderer } from "@/components/questions/QuestionRenderer";
import { L } from "@/lib/i18n";
import { CATEGORIES } from "@/data/categories";
import { updateProgress, type QuestionProgress } from "@/lib/storage";
import type { Question } from "@/data/questions";

export interface SessionResult {
  questionId: string;
  correct: boolean;
}

interface Props {
  questions: Question[];
  progress: Record<string, QuestionProgress>;
  onComplete: (newProgress: Record<string, QuestionProgress>, results: SessionResult[]) => void;
  categoryName: string | null;
}

export function SessionScreen({ questions, progress, onComplete, categoryName }: Props) {
  const { lang, t } = useLang();
  const [idx, setIdx] = useState(0);
  const [sp, setSp] = useState(progress);
  const [results, setResults] = useState<SessionResult[]>([]);

  const handleAnswer = (correct: boolean) => {
    const q = questions[idx];
    const np = updateProgress(sp, q.id, correct);
    setSp(np);
    const nr = [...results, { questionId: q.id, correct }];
    setResults(nr);
    if (idx + 1 >= questions.length) setTimeout(() => onComplete(np, nr), 300);
    else setIdx(idx + 1);
  };

  const q = questions[idx];
  const cat = CATEGORIES.find((c) => c.id === q.categoryId);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto px-4 py-4">
        {categoryName && (
          <div className="mb-2">
            <span className="text-xs text-indigo-600 font-semibold">{categoryName}</span>
          </div>
        )}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm text-gray-500 font-medium">{idx + 1}/{questions.length}</span>
          <div className="flex-1"><ProgressBar current={idx + 1} total={questions.length} /></div>
        </div>
        <div className="mb-4">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
            {cat ? `${cat.icon} ${L(cat.name, lang)}` : ""}
          </span>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 ml-2">
            {"⭐".repeat(q.difficulty)}
          </span>
        </div>
        <QuestionRenderer question={q} onAnswer={handleAnswer} key={q.id + idx} />
      </div>
    </div>
  );
}
