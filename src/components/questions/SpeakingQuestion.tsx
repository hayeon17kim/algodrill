"use client";

import { useState } from "react";
import { useLang } from "@/components/common/LangContext";
import { L } from "@/lib/i18n";
import type { SpeakingQuestion as SQ } from "@/data/questions";

export function SpeakingQuestion({ q, onAnswer }: { q: SQ; onAnswer: (correct: boolean) => void }) {
  const { lang, t } = useLang();
  const [step, setStep] = useState<"think" | "reveal">("think");
  const [selfScore, setSelfScore] = useState<boolean | null>(null);
  const badAnswers = (lang === "ko" ? q.badAnswers.ko : q.badAnswers.en) as string[];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-orange-600">🎙️ {t.speakingPractice}</div>
      <p className="text-lg font-semibold text-gray-900 leading-relaxed">{L(q.question, lang)}</p>
      {step === "think" && (
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-orange-50 border border-orange-200">
            <p className="text-sm text-orange-800">🗣️ <strong>{t.speakAloud}</strong><br />{t.speakAloudSub}</p>
          </div>
          <button className="w-full py-3 rounded-xl font-bold text-white"
            style={{ background: "linear-gradient(135deg,#f59e0b,#f97316)" }}
            onClick={() => setStep("reveal")}>{t.doneShowAnswer}</button>
        </div>
      )}
      {step === "reveal" && (
        <div className="space-y-3 animate-fadeIn">
          <div className="p-4 rounded-xl bg-green-50 border border-green-200">
            <p className="font-semibold text-green-800 mb-2">✅ {t.goodExample}</p>
            <p className="text-sm text-green-900 italic leading-relaxed">{L(q.goodAnswer, lang)}</p>
          </div>
          <div className="p-4 rounded-xl bg-red-50 border border-red-200">
            <p className="font-semibold text-red-800 mb-2">❌ {t.badExample}</p>
            {badAnswers.map((b, i) => <p key={i} className="text-sm text-red-700 ml-2">• {b}</p>)}
          </div>
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
            <p className="text-sm text-blue-800">{L(q.explanation, lang)}</p>
          </div>
          <p className="text-center text-sm font-medium text-gray-600 mt-2">{t.howWasI}</p>
          <div className="flex gap-2">
            {[
              { label: t.didBad, score: false, color: "border-red-300 bg-red-50 text-red-700" },
              { label: t.didGood, score: true, color: "border-green-300 bg-green-50 text-green-700" },
            ].map((opt) => (
              <button key={opt.label}
                className={`flex-1 py-3 rounded-xl font-semibold border-2 transition-all ${selfScore === opt.score ? opt.color : "border-gray-200 bg-white"}`}
                onClick={() => { setSelfScore(opt.score); setTimeout(() => onAnswer(opt.score), 400); }}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
