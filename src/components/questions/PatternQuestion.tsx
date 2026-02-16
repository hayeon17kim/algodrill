"use client";

import { useState } from "react";
import { useLang } from "@/components/common/LangContext";
import { L } from "@/lib/i18n";
import type { PatternQuestion as PQ } from "@/data/questions";
import { QuestionLayout } from "./QuestionLayout";
import { PrimaryActionButton } from "@/components/common/PrimaryActionButton";
import { ResultCard } from "@/components/common/ResultCard";
import { Target, CheckCircle, XCircle, Mic, ChevronDown, ChevronUp } from "lucide-react";
import { typeBadgeColors, stateColors, iconColors } from "@/lib/questionStyles";

export function PatternQuestion({ q, onAnswer }: { q: PQ; onAnswer: (correct: boolean) => void }) {
  const { lang, t } = useLang();
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showTip, setShowTip] = useState(false);

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
                {revealed && isCorrectAnswer && <CheckCircle className={`w-5 h-5 text-green-600 flex-shrink-0`} />}
                {revealed && isUserSelection && !isCorrectAnswer && <XCircle className={`w-5 h-5 ${iconColors.incorrect} flex-shrink-0`} />}
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
            {/* Per-option reasons — show why each option is right/wrong */}
            {q.optionReasons && q.optionReasons.length > 0 && (
              <div className="mt-3 space-y-2">
                {q.options.map((opt, i) => {
                  const reason = q.optionReasons?.[i];
                  if (!reason) return null;
                  const isAnswer = i === q.answer;
                  return (
                    <div key={i} className={`flex items-start gap-2 text-sm rounded-xl px-3 py-2 ${
                      isAnswer ? "bg-green-500/10" : "bg-muted/50"
                    }`}>
                      {isAnswer
                        ? <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        : <XCircle className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      }
                      <div>
                        <span className="font-bold">{opt}</span>
                        <span className="text-muted-foreground"> — {L(reason, lang)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ResultCard>

          {q.speakingTip && (
            <div className="rounded-2xl border-2 border-info/30 overflow-hidden">
              <button
                onClick={() => setShowTip(!showTip)}
                className="w-full flex items-center justify-between px-4 py-3 bg-info/5 hover:bg-info/10 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-info" />
                  <span className="text-sm font-bold text-info">
                    {lang === "ko" ? "💡 면접에서 이렇게 말하세요" : "💡 Say it like this in interviews"}
                  </span>
                </div>
                {showTip ? <ChevronUp className="w-4 h-4 text-info" /> : <ChevronDown className="w-4 h-4 text-info" />}
              </button>
              {showTip && (
                <div className="px-4 py-3 border-t border-info/20">
                  <p className="italic text-sm text-muted-foreground">{L(q.speakingTip, lang)}</p>
                </div>
              )}
            </div>
          )}
          <PrimaryActionButton onClick={() => onAnswer(correct)} delayMs={2000}>
            {t.next}
          </PrimaryActionButton>
        </div>
      )}
    </QuestionLayout>
  );
}
