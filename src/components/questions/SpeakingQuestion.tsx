"use client";

import { useState } from "react";
import { useLang } from "@/components/common/LangContext";
import { L } from "@/lib/i18n";
import type { SpeakingQuestion as SQ } from "@/data/questions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ResultCard } from "@/components/common/ResultCard";
import { Mic, CheckCircle, XCircle, MessageSquare } from "lucide-react";

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
            className="w-full h-14 rounded-xl font-bold text-lg shadow-lg bg-gradient-orange"
          >
            {t.doneShowAnswer}
          </Button>
        </div>
      )}
      {step === "reveal" && (
        <div className="space-y-4 ">
          <ResultCard variant="success" icon="check" title={t.goodExample}>
            <p className="italic text-green-800 dark:text-green-200">{L(q.goodAnswer, lang)}</p>
          </ResultCard>

          <ResultCard variant="error" icon="x" title={t.badExample}>
            <div className="space-y-1.5">
              {badAnswers.map((b, i) => (
                <div key={i} className="flex items-start gap-2 text-red-800 dark:text-red-200">
                  <span className="text-red-500 dark:text-red-400 font-bold">•</span>
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </ResultCard>

          <ResultCard variant="info" title="">
            <p className="text-blue-900 dark:text-blue-100">{L(q.explanation, lang)}</p>
          </ResultCard>
          <div className="pt-2">
            <p className="text-center text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">{t.howWasI}</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: t.didBad,
                  score: false,
                  icon: XCircle,
                  activeClass: "border-red-400 bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200 shadow-md",
                  inactiveClass: "border-gray-200 bg-white dark:bg-gray-800 hover:border-gray-300"
                },
                {
                  label: t.didGood,
                  score: true,
                  icon: CheckCircle,
                  activeClass: "border-green-400 bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200 shadow-md",
                  inactiveClass: "border-gray-200 bg-white dark:bg-gray-800 hover:border-gray-300"
                },
              ].map((opt) => {
                const Icon = opt.icon;
                const isSelected = selfScore === opt.score;
                return (
                  <button
                    key={opt.label}
                    className={`py-4 px-4 rounded-xl font-bold border-2 transition-all flex items-center justify-center gap-2 ${
                      isSelected ? opt.activeClass : opt.inactiveClass
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
