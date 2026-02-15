"use client";

import { useState } from "react";
import { useLang } from "@/components/common/LangContext";
import { L } from "@/lib/i18n";
import type { PatternQuestion as PQ } from "@/data/questions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ResultCard } from "@/components/common/ResultCard";
import { Target, CheckCircle, XCircle, Mic } from "lucide-react";

export function PatternQuestion({ q, onAnswer }: { q: PQ; onAnswer: (correct: boolean) => void }) {
  const { lang, t } = useLang();
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (i: number) => {
    if (!revealed) { setSelected(i); setRevealed(true); }
  };
  const correct = selected === q.answer;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg w-fit">
        <Target className="w-4 h-4" />
        {t.patternRecog}
      </div>
      <Card className="p-6 shadow-lg border-2 border-indigo-100">
        <p className="text-xl font-bold text-gray-900 leading-relaxed">{L(q.question, lang)}</p>
      </Card>
      <div className="space-y-3">
        {q.options.map((opt, i) => {
          const isCorrectAnswer = i === q.answer;
          const isUserSelection = i === selected;

          let cls = "w-full text-left p-5 rounded-xl border-2 transition-all font-semibold text-base ";

          if (!revealed) {
            cls += "border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50 shadow-sm";
          } else if (isCorrectAnswer) {
            cls += "border-green-500 bg-green-50 dark:bg-green-950 text-green-900 dark:text-green-100 shadow-md";
          } else if (isUserSelection) {
            cls += "border-red-400 bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-200 shadow-md";
          } else {
            cls += "border-gray-200 bg-gray-50 dark:bg-gray-900 text-gray-400 opacity-60";
          }
          return (
            <button key={i} className={cls} onClick={() => handleSelect(i)} disabled={revealed}>
              <div className="flex items-center justify-between">
                <span>{opt}</span>
                {revealed && i === q.answer && <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />}
                {revealed && i === selected && i !== q.answer && <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
              </div>
            </button>
          );
        })}
      </div>
      {revealed && (
        <div className="space-y-4 ">
          <ResultCard
            variant={correct ? "success" : "error"}
            icon={correct ? "check" : "x"}
            title={correct ? t.correctAnswer : t.wrongAnswer}
          >
            <p className="text-gray-700 dark:text-gray-300">{L(q.explanation, lang)}</p>
          </ResultCard>

          {q.speakingTip && (
            <ResultCard variant="info" title={t.sayThis}>
              <div className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                <Mic className="w-4 h-4 flex-shrink-0" />
                <p className="italic">{L(q.speakingTip, lang)}</p>
              </div>
            </ResultCard>
          )}
          <Button
            size="lg"
            className="w-full h-14 rounded-xl font-bold text-lg shadow-lg  transition-all"
            
            onClick={() => onAnswer(correct)}
          >
            {t.next}
          </Button>
        </div>
      )}
    </div>
  );
}
