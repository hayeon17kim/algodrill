"use client";

import { useState } from "react";
import { useLang } from "@/components/common/LangContext";
import { L } from "@/lib/i18n";
import type { PatternQuestion as PQ } from "@/data/questions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
          let cls = "w-full text-left p-5 rounded-xl border-2 transition-all font-semibold text-base ";
          if (!revealed) cls += "border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50 hover-lift shadow-sm";
          else if (i === q.answer) cls += "border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 text-green-900 shadow-md";
          else if (i === selected) cls += "border-red-400 bg-gradient-to-r from-red-50 to-rose-50 text-red-800 shadow-md";
          else cls += "border-gray-200 bg-gray-50 text-gray-400 opacity-60";
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
        <div className="space-y-4 animate-in">
          <Card className={`p-5 border-2 ${correct ? "border-green-300 bg-gradient-to-br from-green-50 to-emerald-50" : "border-red-300 bg-gradient-to-br from-red-50 to-rose-50"}`}>
            <div className="flex items-start gap-3">
              {correct ? (
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                  <XCircle className="w-5 h-5 text-white" />
                </div>
              )}
              <div className="flex-1">
                <p className="font-bold text-lg mb-2">{correct ? t.correctAnswer : t.wrongAnswer}</p>
                <p className="text-sm leading-relaxed text-gray-700">{L(q.explanation, lang)}</p>
              </div>
            </div>
          </Card>
          {q.speakingTip && (
            <Card className="p-5 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <Mic className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-blue-900 mb-2">{t.sayThis}</p>
                  <p className="text-sm text-blue-800 italic leading-relaxed">{L(q.speakingTip, lang)}</p>
                </div>
              </div>
            </Card>
          )}
          <Button
            size="lg"
            className="w-full h-14 rounded-xl font-bold text-lg shadow-lg hover-lift transition-all"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
            onClick={() => onAnswer(correct)}
          >
            {t.next}
          </Button>
        </div>
      )}
    </div>
  );
}
