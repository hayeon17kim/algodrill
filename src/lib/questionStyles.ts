export type QuestionState = "correct" | "incorrect" | "neutral" | "selected";
export type QuestionType = "pattern" | "approach" | "fillblank" | "speaking";

// State-based colors — Duolingo tile style
export const stateColors = {
  correct: "option-tile option-tile-correct",
  incorrect: "option-tile option-tile-incorrect",
  neutral: "option-tile",
  selected: "option-tile option-tile-selected",
  hover: "option-tile",
  disabled: "option-tile option-tile-disabled",
} as const;

// Type badge colors — bold pill badges
export const typeBadgeColors: Record<QuestionType, string> = {
  pattern: "text-info-foreground bg-info",
  approach: "text-primary-foreground bg-primary",
  fillblank: "text-success-foreground bg-success",
  speaking: "text-warning-foreground bg-warning",
};

// Score-based colors (for WeaknessDashboard)
export const getScoreColor = (accuracy: number): string => {
  if (accuracy >= 80) return "text-primary bg-primary/10 border-primary/30";
  if (accuracy >= 60) return "text-warning bg-warning/10 border-warning/30";
  return "text-destructive bg-destructive/10 border-destructive/30";
};

// Bar color for progress bars
export const getBarColor = (accuracy: number): string => {
  if (accuracy >= 80) return "bg-primary";
  if (accuracy >= 60) return "bg-warning";
  return "bg-destructive";
};

// Button state resolver — Duolingo option tile style
export const getOptionButtonClass = (
  isRevealed: boolean,
  isSelected: boolean,
  isCorrect: boolean,
  baseClass: string = "px-4 py-3 rounded-2xl text-sm font-mono font-bold border-2 transition-all"
): string => {
  if (!isRevealed) {
    return `${baseClass} ${isSelected ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"}`;
  }

  if (isCorrect) {
    return `${baseClass} border-primary bg-primary/10`;
  }

  if (isSelected && !isCorrect) {
    return `${baseClass} border-destructive bg-destructive/10`;
  }

  return `${baseClass} border-border bg-card opacity-40`;
};

// Icon colors
export const iconColors = {
  correct: "text-green-600",
  incorrect: "text-destructive",
} as const;
