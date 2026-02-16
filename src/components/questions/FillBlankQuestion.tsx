"use client";

import { useState } from "react";
import { useLang } from "@/components/common/LangContext";
import { L } from "@/lib/i18n";
import type { FillBlankQuestion as FBQ } from "@/data/questions";
import { QuestionLayout } from "./QuestionLayout";
import { PrimaryActionButton } from "@/components/common/PrimaryActionButton";
import { ResultCard } from "@/components/common/ResultCard";
import { Code2 } from "lucide-react";
import { typeBadgeColors, getOptionButtonClass } from "@/lib/questionStyles";

export function FillBlankQuestion({ q, onAnswer }: { q: FBQ; onAnswer: (correct: boolean) => void }) {
  const { lang, t } = useLang();
  const [answers, setAnswers] = useState<(string | null)[]>(q.blanks.map(() => null));
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (bi: number, opt: string) => {
    if (revealed) return;
    const a = [...answers]; a[bi] = opt; setAnswers(a);
  };
  const allFilled = answers.every((a) => a !== null);
  const results = answers.map((a, i) => a === q.blanks[i].answer);
  const allCorrect = results.every((r) => r);

  return (
    <QuestionLayout
      badgeIcon={<Code2 className="w-4 h-4" />}
      badgeLabel={t.fillBlank}
      badgeColorClass={typeBadgeColors.fillblank}
      question={q.question}
    >
      <div className="rounded-2xl overflow-hidden border-2 border-foreground/20">
        <pre className="bg-foreground text-primary-foreground p-5 text-sm overflow-x-auto leading-relaxed font-mono whitespace-pre-wrap">{q.code}</pre>
      </div>
      <div className="space-y-5">
        {q.blanks.map((blank, bi) => (
          <div key={bi} className="space-y-3">
            <p className="text-sm font-extrabold flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-primary text-primary-foreground flex items-center justify-center text-xs font-black">
                {bi + 1}
              </span>
              {L(blank.placeholder, lang)}
            </p>
            <div className="flex flex-wrap gap-2">
              {blank.options.map((opt, oi) => {
                const isSelected = answers[bi] === opt;
                const isCorrectAnswer = opt === blank.answer;

                return (
                  <button
                    key={oi}
                    className={getOptionButtonClass(revealed, isSelected, isCorrectAnswer)}
                    onClick={() => handleSelect(bi, opt)}
                    disabled={revealed}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {!revealed && allFilled && (
        <PrimaryActionButton onClick={() => setRevealed(true)}>
          {t.checkAnswer}
        </PrimaryActionButton>
      )}
      {revealed && (
        <div className="space-y-4 animate-slide-up">
          <ResultCard
            variant={allCorrect ? "success" : "error"}
            icon={allCorrect ? "check" : "alert"}
            title={allCorrect ? t.allCorrect : `${results.filter((r) => r).length}/${results.length} ${t.correct}`}
          >
            <p className="text-muted-foreground">{L(q.explanation, lang)}</p>
          </ResultCard>
          <PrimaryActionButton onClick={() => onAnswer(allCorrect)} delayMs={2000}>
            {t.next}
          </PrimaryActionButton>
        </div>
      )}
    </QuestionLayout>
  );
}
