"use client";

import { useState } from "react";
import { useLang } from "@/components/common/LangContext";
import { L } from "@/lib/i18n";
import type { FillBlankQuestion as FBQ } from "@/data/questions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Code2, CheckCircle, AlertCircle } from "lucide-react";

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
                let cls = "px-4 py-2.5 rounded-lg text-sm font-mono font-semibold border-2 transition-all ";
                if (!revealed) {
                  cls += answers[bi] === opt
                    ? "border-indigo-500 bg-indigo-100 text-indigo-700 shadow-sm"
                    : "border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50 hover-lift";
                } else if (opt === blank.answer) {
                  cls += "border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 shadow-md";
                } else if (opt === answers[bi]) {
                  cls += "border-red-400 bg-gradient-to-r from-red-50 to-rose-50 text-red-700 shadow-md";
                } else {
                  cls += "border-gray-200 bg-gray-50 text-gray-400 opacity-50";
                }
                return (
                  <button
                    key={oi}
                    className={cls}
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
          className="w-full h-14 rounded-xl font-bold text-lg shadow-lg hover-lift"
          style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
        >
          {t.checkAnswer}
        </Button>
      )}
      {revealed && (
        <div className="space-y-4 animate-in">
          <Card className={`p-5 border-2 ${
            allCorrect
              ? "border-green-300 bg-gradient-to-br from-green-50 to-emerald-50"
              : "border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50"
          }`}>
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                allCorrect ? "bg-green-500" : "bg-amber-500"
              }`}>
                {allCorrect ? (
                  <CheckCircle className="w-5 h-5 text-white" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-white" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg mb-2">
                  {allCorrect ? t.allCorrect : `${results.filter((r) => r).length}/${results.length} ${t.correct}`}
                </p>
                <p className="text-sm leading-relaxed text-gray-700">{L(q.explanation, lang)}</p>
              </div>
            </div>
          </Card>
          <Button
            size="lg"
            className="w-full h-14 rounded-xl font-bold text-lg shadow-lg hover-lift transition-all"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
            onClick={() => onAnswer(allCorrect)}
          >
            {t.next}
          </Button>
        </div>
      )}
    </div>
  );
}
