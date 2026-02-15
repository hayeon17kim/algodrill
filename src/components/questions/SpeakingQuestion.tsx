"use client";

import { useState } from "react";
import { useLang } from "@/components/common/LangContext";
import { L } from "@/lib/i18n";
import type { SpeakingQuestion as SQ } from "@/data/questions";
import { QuestionLayout } from "./QuestionLayout";
import { PrimaryActionButton } from "@/components/common/PrimaryActionButton";
import { ResultCard } from "@/components/common/ResultCard";
import { Mic, CheckCircle, XCircle, MessageSquare } from "lucide-react";
import { typeBadgeColors } from "@/lib/questionStyles";

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
          <div className="p-6 rounded-2xl border-2 border-warning/30 bg-warning/10">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-warning flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-5 h-5 text-warning-foreground" />
              </div>
              <div>
                <p className="font-extrabold text-foreground mb-2">{t.speakAloud}</p>
                <p className="text-sm text-muted-foreground leading-relaxed font-semibold">{t.speakAloudSub}</p>
              </div>
            </div>
          </div>
          <PrimaryActionButton onClick={() => setStep("reveal")}>
            {t.doneShowAnswer}
          </PrimaryActionButton>
        </div>
      )}
      {step === "reveal" && (
        <div className="space-y-4 animate-slide-up">
          <ResultCard variant="success" icon="check" title={t.goodExample}>
            <p className="italic">{L(q.goodAnswer, lang)}</p>
          </ResultCard>

          <ResultCard variant="error" icon="x" title={t.badExample}>
            <div className="space-y-1.5">
              {badAnswers.map((b, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-destructive font-black">{"•"}</span>
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </ResultCard>

          <ResultCard variant="info" title="">
            <p>{L(q.explanation, lang)}</p>
          </ResultCard>
          <div className="pt-2">
            <p className="text-center text-sm font-extrabold mb-4">{t.howWasI}</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                className={`py-4 px-4 rounded-2xl font-extrabold border-2 transition-all flex items-center justify-center gap-2 ${
                  selfScore === false
                    ? "border-destructive bg-destructive/10 text-destructive"
                    : "border-border bg-card hover:bg-accent text-foreground"
                }`}
                style={{ boxShadow: selfScore === false ? "0 3px 0 hsl(0 72% 38%)" : "0 3px 0 hsl(var(--border))" }}
                onClick={() => { setSelfScore(false); setTimeout(() => onAnswer(false), 400); }}
              >
                <XCircle className="w-5 h-5" />
                {t.didBad}
              </button>
              <button
                className={`py-4 px-4 rounded-2xl font-extrabold border-2 transition-all flex items-center justify-center gap-2 ${
                  selfScore === true
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card hover:bg-accent text-foreground"
                }`}
                style={{ boxShadow: selfScore === true ? "0 3px 0 hsl(102 78% 30%)" : "0 3px 0 hsl(var(--border))" }}
                onClick={() => { setSelfScore(true); setTimeout(() => onAnswer(true), 400); }}
              >
                <CheckCircle className="w-5 h-5" />
                {t.didGood}
              </button>
            </div>
          </div>
        </div>
      )}
    </QuestionLayout>
  );
}
