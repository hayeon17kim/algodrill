import type {
  Question,
  PatternQuestion,
  ApproachQuestion,
  FillBlankQuestion,
  SpeakingQuestion,
} from "@/data/questions";

export function isPatternQuestion(q: Question): q is PatternQuestion {
  return (
    (q.type === "pattern" || q.type === "complexity") &&
    "options" in q &&
    Array.isArray(q.options) &&
    typeof q.answer === "number"
  );
}

export function isApproachQuestion(q: Question): q is ApproachQuestion {
  return (
    q.type === "approach" &&
    "steps" in q &&
    typeof q.steps === "object" &&
    Array.isArray(q.steps.ko) &&
    Array.isArray(q.steps.en)
  );
}

export function isFillBlankQuestion(q: Question): q is FillBlankQuestion {
  return (
    q.type === "fillblank" &&
    "code" in q &&
    typeof q.code === "string" &&
    "blanks" in q &&
    Array.isArray(q.blanks)
  );
}

export function isSpeakingQuestion(q: Question): q is SpeakingQuestion {
  return (
    q.type === "speaking" &&
    "goodAnswer" in q &&
    "badAnswers" in q &&
    typeof q.badAnswers === "object"
  );
}
