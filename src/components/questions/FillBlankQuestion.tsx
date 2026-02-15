"use client";

import { useState } from "react";
import { useLang } from "@/components/common/LangContext";
import { L } from "@/lib/i18n";
import type { FillBlankQuestion as FBQ } from "@/data/questions";

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
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-green-600">👨‍💻 {t.fillBlank}</div>
      <p className="text-lg font-semibold text-gray-900">{L(q.question, lang)}</p>
      <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-xs overflow-x-auto leading-relaxed font-mono whitespace-pre-wrap">{q.code}</pre>
      <div className="space-y-4">
        {q.blanks.map((blank, bi) => (
          <div key={bi} className="space-y-2">
            <p className="text-sm font-medium text-gray-700">{L(blank.placeholder, lang)}</p>
            <div className="flex flex-wrap gap-2">
              {blank.options.map((opt, oi) => {
                let cls = "px-4 py-2 rounded-lg text-sm font-mono font-medium border-2 transition-all ";
                if (!revealed) cls += answers[bi] === opt ? "border-indigo-400 bg-indigo-50 text-indigo-700" : "border-gray-200 bg-white";
                else if (opt === blank.answer) cls += "border-green-400 bg-green-50 text-green-700";
                else if (opt === answers[bi]) cls += "border-red-300 bg-red-50 text-red-600";
                else cls += "border-gray-200 bg-gray-50 text-gray-400";
                return <button key={oi} className={cls} onClick={() => handleSelect(bi, opt)}>{opt}</button>;
              })}
            </div>
          </div>
        ))}
      </div>
      {!revealed && allFilled && (
        <button onClick={() => setRevealed(true)} className="w-full py-3 rounded-xl font-bold text-white"
          style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>{t.checkAnswer}</button>
      )}
      {revealed && (
        <div className="space-y-3 animate-fadeIn">
          <div className={`p-4 rounded-xl ${allCorrect ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"}`}>
            <p className="font-semibold mb-1">{allCorrect ? `✅ ${t.allCorrect}` : `${results.filter((r) => r).length}/${results.length} ${t.correct}`}</p>
            <p className="text-sm text-gray-700">{L(q.explanation, lang)}</p>
          </div>
          <button className="w-full py-3 rounded-xl font-bold text-white"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
            onClick={() => onAnswer(allCorrect)}>{t.next}</button>
        </div>
      )}
    </div>
  );
}
