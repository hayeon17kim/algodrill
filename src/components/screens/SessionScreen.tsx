"use client";

import { useState } from "react";
import { useLang } from "@/components/common/LangContext";
import { QuestionRenderer } from "@/components/questions/QuestionRenderer";
import { L } from "@/lib/i18n";
import { CATEGORIES } from "@/data/categories";
import { updateProgress, type QuestionProgress } from "@/lib/storage";
import type { Question } from "@/data/questions";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Star, X, CheckCircle2 } from "lucide-react";

export interface SessionResult {
  questionId: string;
  correct: boolean;
}

interface Props {
  questions: Question[];
  progress: Record<string, QuestionProgress>;
  onComplete: (newProgress: Record<string, QuestionProgress>, results: SessionResult[]) => void;
  onCancel?: () => void;
  categoryName: string | null;
}

export function SessionScreen({ questions, progress, onComplete, onCancel, categoryName }: Props) {
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

  const handleCancel = () => {
    if (onCancel) {
      const confirmMessage = lang === "ko"
        ? "진행 중인 세션을 종료하시겠습니까? 진행 상황이 저장되지 않습니다."
        : "Are you sure you want to quit? Your progress will not be saved.";
      if (confirm(confirmMessage)) {
        onCancel();
      }
    }
  };

  const q = questions[idx];
  const cat = CATEGORIES.find((c) => c.id === q.categoryId);
  const correctCount = results.filter(r => r.correct).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky top bar with progress + category */}
      <div className="sticky top-0 z-10 bg-card border-b-2 border-border">
        <div className="max-w-lg mx-auto px-4 py-3 space-y-2">
          <div className="flex items-center gap-3">
            {onCancel && (
              <button onClick={handleCancel} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-6 h-6" strokeWidth={3} />
              </button>
            )}
            <div className="flex-1 flex items-center gap-2">
              <Progress value={((idx + 1) / questions.length) * 100} className="h-4" />
              <span className="text-xs font-black text-muted-foreground whitespace-nowrap">
                {idx + 1}/{questions.length}
              </span>
            </div>
            <div className="flex items-center gap-1 text-primary font-extrabold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>{correctCount}/{results.length}</span>
            </div>
          </div>
          {/* Category + difficulty — always visible in sticky header */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-muted-foreground bg-secondary px-2.5 py-1 rounded-lg">
              <span>{cat?.icon}</span>
              <span>{cat ? L(cat.name, lang) : ""}</span>
            </div>
            <div className="flex items-center gap-0.5 bg-warning/10 px-2 py-1 rounded-lg">
              {Array.from({ length: q.difficulty }).map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-warning text-warning" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
        {/* Question content */}
        <div className="animate-slide-up">
          <QuestionRenderer question={q} onAnswer={handleAnswer} key={q.id + idx} />
        </div>
      </div>
    </div>
  );
}
