"use client";

import type { Question } from "@/data/questions";
import { PatternQuestion } from "./PatternQuestion";
import { ApproachQuestion } from "./ApproachQuestion";
import { FillBlankQuestion } from "./FillBlankQuestion";
import { SpeakingQuestion } from "./SpeakingQuestion";

export function QuestionRenderer({ question, onAnswer }: { question: Question; onAnswer: (correct: boolean) => void }) {
  if (question.type === "pattern" || question.type === "complexity")
    return <PatternQuestion q={question as any} onAnswer={onAnswer} />;
  if (question.type === "approach")
    return <ApproachQuestion q={question as any} onAnswer={onAnswer} />;
  if (question.type === "fillblank")
    return <FillBlankQuestion q={question as any} onAnswer={onAnswer} />;
  if (question.type === "speaking")
    return <SpeakingQuestion q={question as any} onAnswer={onAnswer} />;
  return null;
}
