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
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm font-semibold text-purple-600 bg-purple-50 px-3 py-2 rounded-lg w-fit">
        <ListOrdered className="w-4 h-4" />
        {t.approachOrder}
      </div>
      <Card className="p-6 shadow-lg border-2 border-purple-100">
        <p className="text-xl font-bold text-gray-900 leading-relaxed">{L(q.question, lang)}</p>
      </Card>
      {userOrder.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-700">{t.myOrder}</p>
          <div className="space-y-2">
            {userOrder.map((item, i) => (
              <div key={i} className={`p-4 rounded-xl text-sm flex items-center gap-3 border-2 transition-all ${
                revealed
                  ? stepResults[i]
                    ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 shadow-sm"
                    : "bg-gradient-to-r from-red-50 to-rose-50 border-red-300 shadow-sm"
                  : "bg-indigo-50 border-indigo-200"
              }`}>
                <span className="font-black text-base w-7 h-7 flex items-center justify-center bg-white rounded-lg shadow-sm">{i + 1}</span>
                <span className="flex-1 font-medium">{item.text}</span>
                {revealed && (
                  stepResults[i] ?
                    <CheckCircle className="w-5 h-5 text-green-600" /> :
                    <XCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
            ))}
          </div>
          {!revealed && (
            <Button
              onClick={handleUndo}
              variant="outline"
              size="sm"
              className="gap-2 hover-lift"
            >
              <Undo2 className="w-4 h-4" />
              {t.undoLast}
            </Button>
          )}
        </div>
      )}
      {!revealed && remaining.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-700">{t.tapToSelect}</p>
          <div className="space-y-2">
            {remaining.map((idx: number) => (
              <button
                key={idx}
                onClick={() => handlePick(idx)}
                className="w-full text-left p-4 rounded-xl text-sm font-medium border-2 border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50 hover-lift shadow-sm transition-all"
              >
                {shuffled[idx].text}
              </button>
            ))}
          </div>
        </div>
      )}
      {!revealed && remaining.length === 0 && (
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
            isCorrect
              ? "border-green-300 bg-gradient-to-br from-green-50 to-emerald-50"
              : "border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50"
          }`}>
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                isCorrect ? "bg-green-500" : "bg-amber-500"
              }`}>
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg mb-2">{isCorrect ? t.perfect : t.checkOrder}</p>
                <p className="text-sm leading-relaxed text-gray-700">{L(q.explanation, lang)}</p>
                {!isCorrect && (
                  <div className="mt-4 p-3 bg-white/60 rounded-lg space-y-2">
                    <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">{t.correctOrder}</p>
                    {steps.map((s: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="font-bold text-indigo-600 min-w-[1.5rem]">{i + 1}.</span>
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
          <Button
            size="lg"
            className="w-full h-14 rounded-xl font-bold text-lg shadow-lg hover-lift transition-all"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
            onClick={() => onAnswer(isCorrect)}
          >
            {t.next}
          </Button>
        </div>
      )}
    </div>
  );
}
