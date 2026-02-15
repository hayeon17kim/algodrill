"use client";

import { useState } from "react";
import { useLang } from "@/components/common/LangContext";
import { L } from "@/lib/i18n";
import type { PatternQuestion as PQ } from "@/data/questions";
import { QuestionLayout } from "./QuestionLayout";
import { PrimaryActionButton } from "@/components/common/PrimaryActionButton";
import { ResultCard } from "@/components/common/ResultCard";
import { Target, CheckCircle, XCircle, Mic } from "lucide-react";
import { typeBadgeColors, stateColors, iconColors } from "@/lib/questionStyles";

export function PatternQuestion({ q, onAnswer }: { q: PQ; onAnswer: (correct: boolean) => void }) {
  const { lang, t } = useLang();
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (i: number) => {
    if (!revealed) { setSelected(i); setRevealed(true); }
  };
  const correct = selected === q.answer;

  return (
    <QuestionLayout
      badgeIcon={<Target className="w-4 h-4" />}
      badgeLabel={t.patternRecog}
      badgeColorClass={typeBadgeColors.pattern}
      question={q.question}
    >
      <div className="space-y-3">
        {q.options.map((opt, i) => {
          const isCorrectAnswer = i === q.answer;
          const isUserSelection = i === selected;

          let cls: string;
          if (!revealed) {
            cls = stateColors.hover;
          } else if (isCorrectAnswer) {
            cls = stateColors.correct;
          } else if (isUserSelection) {
            cls = stateColors.incorrect;
          } else {
            cls = stateColors.disabled;
          }
          return (
            <button key={i} className={`w-full text-left text-base ${cls}`} onClick={() => handleSelect(i)} disabled={revealed}>
              <div className="flex items-center justify-between">
                <span>{opt}</span>
                {revealed && i === q.answer && <CheckCircle className={`w-5 h-5 ${iconColors.correct} flex-shrink-0`} />}
                {revealed && i === selected && i !== q.answer && <XCircle className={`w-5 h-5 ${iconColors.incorrect} flex-shrink-0`} />}
              </div>
            </button>
          );
        })}
      </div>
      {revealed && (
        <div className="space-y-4 animate-slide-up">
          <ResultCard
            variant={correct ? "success" : "error"}
            icon={correct ? "check" : "x"}
            title={correct ? t.correctAnswer : t.wrongAnswer}
          >
            <p className="text-muted-foreground">{L(q.explanation, lang)}</p>
          </ResultCard>

          {q.speakingTip && (
            <ResultCard variant="info" title={t.sayThis}>
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 flex-shrink-0 text-info" />
                <p className="italic text-muted-foreground">{L(q.speakingTip, lang)}</p>
              </div>
            </ResultCard>
          )}
          <PrimaryActionButton onClick={() => onAnswer(correct)}>
            {t.next}
          </PrimaryActionButton>
        </div>
      )}
    </QuestionLayout>
  );
}
