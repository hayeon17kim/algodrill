"use client";

import { useState } from "react";
import { useLang } from "@/components/common/LangContext";
import { L } from "@/lib/i18n";
import type { ApproachQuestion as AQ } from "@/data/questions";
import { Button } from "@/components/ui/button";
import { QuestionLayout } from "./QuestionLayout";
import { PrimaryActionButton } from "@/components/common/PrimaryActionButton";
import { ResultCard } from "@/components/common/ResultCard";
import { ListOrdered, CheckCircle, XCircle, Undo2 } from "lucide-react";
import { stateColors, typeBadgeColors, iconColors } from "@/lib/questionStyles";

export function ApproachQuestion({ q, onAnswer }: { q: AQ; onAnswer: (correct: boolean) => void }) {
  const { lang, t } = useLang();
  const steps = L(q.steps, lang);
  const [shuffled] = useState(() => {
    const a = steps.map((s: string, i: number) => ({ text: s, correctIdx: i }));
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  });
  const [userOrder, setUserOrder] = useState<typeof shuffled>([]);
  const [remaining, setRemaining] = useState(shuffled.map((_: unknown, i: number) => i));
  const [revealed, setRevealed] = useState(false);

  const handlePick = (idx: number) => {
    if (revealed) return;
    setUserOrder([...userOrder, shuffled[idx]]);
    setRemaining(remaining.filter((i: number) => i !== idx));
  };
  const handleUndo = () => {
    if (!userOrder.length || revealed) return;
    const last = userOrder[userOrder.length - 1];
    setUserOrder(userOrder.slice(0, -1));
    setRemaining([...remaining, shuffled.indexOf(last)].sort((a, b) => a - b));
  };

  const isCorrect = userOrder.every((item, i) => item.correctIdx === i);
  const stepResults = userOrder.map((item, i) => item.correctIdx === i);

  return (
    <QuestionLayout
      badgeIcon={<ListOrdered className="w-4 h-4" />}
      badgeLabel={t.approachOrder}
      badgeColorClass={typeBadgeColors.approach}
      question={q.question}
    >
      {userOrder.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-semibold">{t.myOrder}</p>
          <div className="space-y-2">
            {userOrder.map((item, i) => (
              <div key={i} className={`p-4 rounded-lg text-sm flex items-center gap-3 border ${
                revealed
                  ? stepResults[i]
                    ? stateColors.correct
                    : stateColors.incorrect
                  : stateColors.neutral
              }`}>
                <span className="font-bold text-base w-7 h-7 flex items-center justify-center bg-card rounded-lg">{i + 1}</span>
                <span className="flex-1 font-medium">{item.text}</span>
                {revealed && (
                  stepResults[i] ?
                    <CheckCircle className={`w-5 h-5 ${iconColors.correct}`} /> :
                    <XCircle className={`w-5 h-5 ${iconColors.incorrect}`} />
                )}
              </div>
            ))}
          </div>
          {!revealed && (
            <Button onClick={handleUndo} variant="outline" size="sm" className="gap-2">
              <Undo2 className="w-4 h-4" />
              {t.undoLast}
            </Button>
          )}
        </div>
      )}
      {!revealed && remaining.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-semibold">{t.tapToSelect}</p>
          <div className="space-y-2">
            {remaining.map((idx: number) => (
              <button
                key={idx}
                onClick={() => handlePick(idx)}
                className="w-full text-left p-4 rounded-lg text-sm font-medium border bg-card hover:bg-accent transition-colors"
              >
                {shuffled[idx].text}
              </button>
            ))}
          </div>
        </div>
      )}
      {!revealed && remaining.length === 0 && (
        <PrimaryActionButton onClick={() => setRevealed(true)}>
          {t.checkAnswer}
        </PrimaryActionButton>
      )}
      {revealed && (
        <div className="space-y-4">
          <ResultCard
            variant={isCorrect ? "success" : "error"}
            icon="check"
            title={isCorrect ? t.perfect : t.checkOrder}
          >
            <p className="text-gray-700 dark:text-gray-300">{L(q.explanation, lang)}</p>
            {!isCorrect && (
              <div className="mt-4 p-3 bg-card rounded-lg space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider">{t.correctOrder}</p>
                {steps.map((s: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="font-bold text-primary min-w-[1.5rem]">{i + 1}.</span>
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            )}
          </ResultCard>
          <PrimaryActionButton onClick={() => onAnswer(isCorrect)}>
            {t.next}
          </PrimaryActionButton>
        </div>
      )}
    </QuestionLayout>
  );
}
