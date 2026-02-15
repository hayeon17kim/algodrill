"use client";

import { useState } from "react";
import { useLang } from "@/components/common/LangContext";
import { QuestionRenderer } from "@/components/questions/QuestionRenderer";
import { L } from "@/lib/i18n";
import { CATEGORIES } from "@/data/categories";
import { updateProgress, type QuestionProgress } from "@/lib/storage";
import type { Question } from "@/data/questions";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Star, X } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between animate-in">
          <div className="flex items-center gap-2">
            {categoryName && (
              <Badge variant="secondary" className="text-xs font-semibold  px-3 py-1.5">
                {categoryName}
              </Badge>
            )}
          </div>
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={handleCancel} className="gap-1">
              <X className="w-4 h-4" />
              {lang === "ko" ? "종료" : "Quit"}
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground font-semibold tabular-nums min-w-[3rem]">
            {idx + 1}/{questions.length}
          </span>
          <div className="flex-1 relative">
            <Progress value={((idx + 1) / questions.length) * 100} className="h-3 shadow-sm" />
            <div className="absolute right-0 -top-6 text-xs font-bold text-primary">
              {Math.round(((idx + 1) / questions.length) * 100)}%
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 animate-in" style={{ animationDelay: '0.2s' }}>
          <Badge variant="secondary" className=" px-3 py-1.5 font-semibold">
            {cat?.icon} {cat ? L(cat.name, lang) : ""}
          </Badge>
          <Badge variant="outline" className="gap-1 px-2.5 py-1.5 border-amber-300 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
            {Array.from({ length: q.difficulty }).map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400 dark:fill-amber-500 dark:text-amber-500" />
            ))}
          </Badge>
        </div>
        <div>
          <QuestionRenderer question={q} onAnswer={handleAnswer} key={q.id + idx} />
        </div>
      </div>
    </div>
  );
}
