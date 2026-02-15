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
import { Star } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30">
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {categoryName && (
          <div className="animate-in">
            <Badge variant="secondary" className="text-xs font-semibold bg-indigo-100 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5">
              {categoryName}
            </Badge>
          </div>
        )}
        <div className="flex items-center gap-3 animate-in" style={{ animationDelay: '0.1s' }}>
          <span className="text-sm text-muted-foreground font-semibold tabular-nums min-w-[3rem]">
            {idx + 1}/{questions.length}
          </span>
          <div className="flex-1 relative">
            <Progress value={((idx + 1) / questions.length) * 100} className="h-3 shadow-sm" />
            <div className="absolute right-0 -top-6 text-xs font-bold text-indigo-600">
              {Math.round(((idx + 1) / questions.length) * 100)}%
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 animate-in" style={{ animationDelay: '0.2s' }}>
          <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 font-semibold">
            {cat?.icon} {cat ? L(cat.name, lang) : ""}
          </Badge>
          <Badge variant="outline" className="gap-1 px-2.5 py-1.5 border-amber-300 bg-amber-50">
            {Array.from({ length: q.difficulty }).map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
          </Badge>
        </div>
        <div className="animate-in" style={{ animationDelay: '0.3s' }}>
          <QuestionRenderer question={q} onAnswer={handleAnswer} key={q.id + idx} />
        </div>
      </div>
    </div>
  );
}
