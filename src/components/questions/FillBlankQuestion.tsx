"use client";

import { useState } from "react";
import { useLang } from "@/components/common/LangContext";
import { L } from "@/lib/i18n";
import type { FillBlankQuestion as FBQ } from "@/data/questions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ResultCard } from "@/components/common/ResultCard";
import { Code2 } from "lucide-react";

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
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm font-semibold text-green-600 bg-green-50 px-3 py-2 rounded-lg w-fit">
        <Code2 className="w-4 h-4" />
        {t.fillBlank}
      </div>
      <Card className="p-6 shadow-lg border-2 border-green-100">
        <p className="text-xl font-bold text-gray-900 leading-relaxed">{L(q.question, lang)}</p>
      </Card>
      <Card className="p-0 overflow-hidden shadow-lg border-2 border-gray-700">
        <pre className="bg-gray-900 text-green-400 p-5 text-sm overflow-x-auto leading-relaxed font-mono whitespace-pre-wrap">{q.code}</pre>
      </Card>
      <div className="space-y-5">
        {q.blanks.map((blank, bi) => (
          <div key={bi} className="space-y-3">
            <p className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-black">
                {bi + 1}
              </span>
              {L(blank.placeholder, lang)}
            </p>
            <div className="flex flex-wrap gap-2">
              {blank.options.map((opt, oi) => {
                const isSelected = answers[bi] === opt;
                const isCorrectAnswer = opt === blank.answer;
                const isWrongSelection = opt === answers[bi] && !isCorrectAnswer;

                const getButtonClass = () => {
                  const base = "px-4 py-2.5 rounded-lg text-sm font-mono font-semibold border-2 transition-all ";

                  if (!revealed) {
                    return base + (isSelected
                      ? "border-indigo-500 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-200 shadow-sm"
                      : "border-gray-200 bg-white dark:bg-gray-800 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950");
                  }

                  if (isCorrectAnswer) {
                    return base + "border-green-500 bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-200 shadow-md";
                  }

                  if (isWrongSelection) {
                    return base + "border-red-400 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-200 shadow-md";
                  }

                  return base + "border-gray-200 bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-600 opacity-50";
                };

                return (
                  <button
                    key={oi}
                    className={getButtonClass()}
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
        <Button
          onClick={() => setRevealed(true)}
          size="lg"
          className="w-full h-14 rounded-xl font-bold text-lg shadow-lg "
          
        >
          {t.checkAnswer}
        </Button>
      )}
      {revealed && (
        <div className="space-y-4 ">
          <ResultCard
            variant={allCorrect ? "success" : "error"}
            icon={allCorrect ? "check" : "alert"}
            title={allCorrect ? t.allCorrect : `${results.filter((r) => r).length}/${results.length} ${t.correct}`}
          >
            <p className="text-gray-700 dark:text-gray-300">{L(q.explanation, lang)}</p>
          </ResultCard>
          <Button
            size="lg"
            className="w-full h-14 rounded-xl font-bold text-lg shadow-lg  transition-all"
            
            onClick={() => onAnswer(allCorrect)}
          >
            {t.next}
          </Button>
        </div>
      )}
    </div>
  );
}
