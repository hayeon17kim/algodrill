"use client";

import { useState } from "react";
import { useLang } from "@/components/common/LangContext";
import { L } from "@/lib/i18n";
import type { SpeakingQuestion as SQ } from "@/data/questions";
import { Card } from "@/components/ui/card";
import { QuestionLayout } from "./QuestionLayout";
import { PrimaryActionButton } from "@/components/common/PrimaryActionButton";
import { ResultCard } from "@/components/common/ResultCard";
import { Mic, CheckCircle, XCircle, MessageSquare } from "lucide-react";
import { typeBadgeColors, stateColors } from "@/lib/questionStyles";

export function SpeakingQuestion({ q, onAnswer }: { q: SQ; onAnswer: (correct: boolean) => void }) {
  const { lang, t } = useLang();
  const [step, setStep] = useState<"think" | "reveal">("think");
  const [selfScore, setSelfScore] = useState<boolean | null>(null);
  const badAnswers = (lang === "ko" ? q.badAnswers.ko : q.badAnswers.en) as string[];

  return (
    <QuestionLayout
      badgeIcon={<Mic className="w-4 h-4" />}
      badgeLabel={t.speakingPractice}
      badgeColorClass={typeBadgeColors.speaking}
      question={q.question}
    >
      {step === "think" && (
        <div className="space-y-4">
          <Card className="p-6 border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-orange-900 dark:text-orange-100 mb-2">{t.speakAloud}</p>
                <p className="text-sm text-orange-800 dark:text-orange-200 leading-relaxed">{t.speakAloudSub}</p>
              </div>
            </div>
          </Card>
          <PrimaryActionButton onClick={() => setStep("reveal")}>
            {t.doneShowAnswer}
          </PrimaryActionButton>
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
            <p className="text-center text-sm font-bold mb-4">{t.howWasI}</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: t.didBad,
                  score: false,
                  icon: XCircle,
                  activeClass: stateColors.incorrect,
                  inactiveClass: "border-border bg-card hover:bg-accent"
                },
                {
                  label: t.didGood,
                  score: true,
                  icon: CheckCircle,
                  activeClass: stateColors.correct,
                  inactiveClass: "border-border bg-card hover:bg-accent"
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
    </QuestionLayout>
  );
}
