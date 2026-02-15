"use client";

import { useState } from "react";
import { useLang } from "@/components/common/LangContext";
import { L } from "@/lib/i18n";
import type { PatternQuestion as PQ } from "@/data/questions";

export function PatternQuestion({ q, onAnswer }: { q: PQ; onAnswer: (correct: boolean) => void }) {
  const { lang, t } = useLang();
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (i: number) => {
    if (!revealed) { setSelected(i); setRevealed(true); }
  };
  const correct = selected === q.answer;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-indigo-600">🎯 {t.patternRecog}</div>
      <p className="text-lg font-semibold text-gray-900 leading-relaxed">{L(q.question, lang)}</p>
      <div className="space-y-2">
        {q.options.map((opt, i) => {
          let cls = "w-full text-left p-4 rounded-xl border-2 transition-all font-medium ";
          if (!revealed) cls += "border-gray-200 bg-white active:bg-indigo-50";
          else if (i === q.answer) cls += "border-green-400 bg-green-50 text-green-800";
          else if (i === selected) cls += "border-red-300 bg-red-50 text-red-700";
          else cls += "border-gray-200 bg-gray-50 text-gray-400";
          return <button key={i} className={cls} onClick={() => handleSelect(i)}>{opt}</button>;
        })}
      </div>
      {revealed && (
        <div className="space-y-3 animate-fadeIn">
          <div className={`p-4 rounded-xl ${correct ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
            <p className="font-semibold mb-1">{correct ? `✅ ${t.correctAnswer}` : `❌ ${t.wrongAnswer}`}</p>
            <p className="text-sm text-gray-700">{L(q.explanation, lang)}</p>
          </div>
          {q.speakingTip && (
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
              <p className="font-semibold mb-1 text-blue-800">🎙️ {t.sayThis}</p>
              <p className="text-sm text-blue-900 italic">{L(q.speakingTip, lang)}</p>
            </div>
          )}
          <button className="w-full py-3 rounded-xl font-bold text-white"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
            onClick={() => onAnswer(correct)}>{t.next}</button>
        </div>
      )}
    </div>
  );
}
