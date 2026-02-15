"use client";

import { useState } from "react";
import { useLang } from "@/components/common/LangContext";
import { L } from "@/lib/i18n";
import type { SpeakingQuestion as SQ } from "@/data/questions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, CheckCircle, XCircle, Info, MessageSquare } from "lucide-react";

export function SpeakingQuestion({ q, onAnswer }: { q: SQ; onAnswer: (correct: boolean) => void }) {
  const { lang, t } = useLang();
  const [step, setStep] = useState<"think" | "reveal">("think");
  const [selfScore, setSelfScore] = useState<boolean | null>(null);
  const badAnswers = (lang === "ko" ? q.badAnswers.ko : q.badAnswers.en) as string[];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm font-semibold text-orange-600 bg-orange-50 px-3 py-2 rounded-lg w-fit">
        <Mic className="w-4 h-4" />
        {t.speakingPractice}
      </div>
      <Card className="p-6 shadow-lg border-2 border-orange-100">
        <p className="text-xl font-bold text-gray-900 leading-relaxed">{L(q.question, lang)}</p>
      </Card>
      {step === "think" && (
        <div className="space-y-4">
          <Card className="p-6 border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-orange-900 mb-2">{t.speakAloud}</p>
                <p className="text-sm text-orange-800 leading-relaxed">{t.speakAloudSub}</p>
              </div>
            </div>
          </Card>
          <Button
            onClick={() => setStep("reveal")}
            size="lg"
            className="w-full h-14 rounded-xl font-bold text-lg shadow-lg hover-lift"
            style={{ background: "linear-gradient(135deg,#f59e0b,#f97316)" }}
          >
            {t.doneShowAnswer}
          </Button>
        </div>
      )}
      {step === "reveal" && (
        <div className="space-y-4 animate-in">
          <Card className="p-5 border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-green-900 mb-2">{t.goodExample}</p>
                <p className="text-sm text-green-800 italic leading-relaxed">{L(q.goodAnswer, lang)}</p>
              </div>
            </div>
          </Card>
          <Card className="p-5 border-2 border-red-300 bg-gradient-to-br from-red-50 to-rose-50">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                <XCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-red-900 mb-3">{t.badExample}</p>
                <div className="space-y-1.5">
                  {badAnswers.map((b, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-red-800">
                      <span className="text-red-500 font-bold">•</span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
          <Card className="p-5 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <Info className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-blue-900 leading-relaxed">{L(q.explanation, lang)}</p>
              </div>
            </div>
          </Card>
          <div className="pt-2">
            <p className="text-center text-sm font-bold text-gray-700 mb-4">{t.howWasI}</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: t.didBad, score: false, icon: XCircle, activeColor: "border-red-400 bg-gradient-to-br from-red-100 to-rose-100 text-red-800 shadow-md" },
                { label: t.didGood, score: true, icon: CheckCircle, activeColor: "border-green-400 bg-gradient-to-br from-green-100 to-emerald-100 text-green-800 shadow-md" },
              ].map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.label}
                    className={`py-4 px-4 rounded-xl font-bold border-2 transition-all hover-lift flex items-center justify-center gap-2 ${
                      selfScore === opt.score ? opt.activeColor : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                    onClick={() => { setSelfScore(opt.score); setTimeout(() => onAnswer(opt.score), 400); }}
                  >
                    <Icon className="w-5 h-5" />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
