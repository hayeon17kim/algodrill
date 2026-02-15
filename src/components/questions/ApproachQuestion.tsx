"use client";

import { useState } from "react";
import { useLang } from "@/components/common/LangContext";
import { L } from "@/lib/i18n";
import type { ApproachQuestion as AQ } from "@/data/questions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ListOrdered, CheckCircle, XCircle, Undo2 } from "lucide-react";

export function ApproachQuestion({ q, onAnswer }: { q: AQ; onAnswer: (correct: boolean) => void }) {
  const { lang, t } = useLang();
  const steps = L(q.steps, lang) as unknown as string[];
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
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm font-semibold text-purple-600 bg-purple-50 px-3 py-2 rounded-lg w-fit">
        <ListOrdered className="w-4 h-4" />
        {t.approachOrder}
      </div>
      <Card className="p-6 shadow-lg border-2 border-purple-100">
        <p className="text-xl font-bold text-gray-900 leading-relaxed">{L(q.question, lang)}</p>
      </Card>
      {userOrder.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-gray-500">{t.myOrder}</p>
          {userOrder.map((item, i) => (
            <div key={i} className={`p-3 rounded-lg text-sm flex items-center gap-2 ${revealed ? (stepResults[i] ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200") : "bg-indigo-50 border border-indigo-200"}`}>
              <span className="font-bold text-xs w-5 text-center">{i + 1}</span>
              <span className="flex-1">{item.text}</span>
              {revealed && (stepResults[i] ? "✅" : "❌")}
            </div>
          ))}
          {!revealed && <button onClick={handleUndo} className="text-sm text-gray-500 underline">{t.undoLast}</button>}
        </div>
      )}
      {!revealed && remaining.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-gray-500">{t.tapToSelect}</p>
          {remaining.map((idx: number) => (
            <button key={idx} onClick={() => handlePick(idx)}
              className="w-full text-left p-3 rounded-lg text-sm border-2 border-gray-200 bg-white active:bg-indigo-50 transition-all">
              {shuffled[idx].text}
            </button>
          ))}
        </div>
      )}
      {!revealed && remaining.length === 0 && (
        <button onClick={() => setRevealed(true)} className="w-full py-3 rounded-xl font-bold text-white"
          style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>{t.checkAnswer}</button>
      )}
      {revealed && (
        <div className="space-y-3 animate-fadeIn">
          <div className={`p-4 rounded-xl ${isCorrect ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"}`}>
            <p className="font-semibold mb-1">{isCorrect ? `✅ ${t.perfect}` : t.checkOrder}</p>
            <p className="text-sm text-gray-700">{L(q.explanation, lang)}</p>
            {!isCorrect && (
              <div className="mt-3 space-y-1">
                <p className="text-xs font-semibold text-gray-600">{t.correctOrder}</p>
                {steps.map((s: string, i: number) => <p key={i} className="text-xs text-gray-600">{i + 1}. {s}</p>)}
              </div>
            )}
          </div>
          <button className="w-full py-3 rounded-xl font-bold text-white"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
            onClick={() => onAnswer(isCorrect)}>{t.next}</button>
        </div>
      )}
    </div>
  );
}
