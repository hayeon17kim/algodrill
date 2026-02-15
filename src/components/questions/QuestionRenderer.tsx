"use client";

import type { Question } from "@/data/questions";
import { PatternQuestion } from "./PatternQuestion";
import { ApproachQuestion } from "./ApproachQuestion";
import { FillBlankQuestion } from "./FillBlankQuestion";
import { SpeakingQuestion } from "./SpeakingQuestion";
import {
  isPatternQuestion,
  isApproachQuestion,
  isFillBlankQuestion,
  isSpeakingQuestion,
} from "@/lib/typeGuards";

export function QuestionRenderer({ question, onAnswer }: { question: Question; onAnswer: (correct: boolean) => void }) {
  if (isPatternQuestion(question)) {
    return <PatternQuestion q={question} onAnswer={onAnswer} />;
  }

  if (isApproachQuestion(question)) {
    return <ApproachQuestion q={question} onAnswer={onAnswer} />;
  }

  if (isFillBlankQuestion(question)) {
    return <FillBlankQuestion q={question} onAnswer={onAnswer} />;
  }

  if (isSpeakingQuestion(question)) {
    return <SpeakingQuestion q={question} onAnswer={onAnswer} />;
  }

  if (process.env.NODE_ENV === "development") {
    console.error("Unknown question type:", question);
  }

  return null;
}
