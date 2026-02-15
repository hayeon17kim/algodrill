export type QuestionState = "correct" | "incorrect" | "neutral" | "selected";
export type QuestionType = "pattern" | "approach" | "fillblank" | "speaking";

// State-based colors
export const stateColors = {
  correct: "bg-green-50 dark:bg-green-950 border-green-300 dark:border-green-800 text-green-900 dark:text-green-100",
  incorrect: "bg-red-50 dark:bg-red-950 border-red-300 dark:border-red-800 text-red-800 dark:text-red-200",
  neutral: "bg-secondary border-border",
  selected: "border-indigo-500 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-200 shadow-sm",
  hover: "border-gray-200 bg-white dark:bg-gray-800 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950",
  disabled: "border-gray-200 bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-600 opacity-50",
} as const;

// Type badge colors
export const typeBadgeColors: Record<QuestionType, string> = {
  pattern: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950",
  approach: "text-primary bg-secondary",
  fillblank: "text-green-600 bg-green-50 dark:bg-green-950",
  speaking: "text-orange-600 bg-orange-50 dark:bg-orange-950",
};

// Score-based colors (for WeaknessDashboard)
export const getScoreColor = (accuracy: number): string => {
  if (accuracy >= 80) return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800";
  if (accuracy >= 60) return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800";
  return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800";
};

// Bar color for progress bars
export const getBarColor = (accuracy: number): string => {
  if (accuracy >= 80) return "bg-green-500 dark:bg-green-600";
  if (accuracy >= 60) return "bg-yellow-500 dark:bg-yellow-600";
  return "bg-red-500 dark:bg-red-600";
};

// Button state resolver (replaces FillBlank/Pattern logic)
export const getOptionButtonClass = (
  isRevealed: boolean,
  isSelected: boolean,
  isCorrect: boolean,
  baseClass: string = "px-4 py-2.5 rounded-lg text-sm font-mono font-semibold border-2 transition-all"
): string => {
  if (!isRevealed) {
    return `${baseClass} ${isSelected ? stateColors.selected : stateColors.hover}`;
  }

  if (isCorrect) {
    return `${baseClass} ${stateColors.correct} shadow-md`;
  }

  if (isSelected && !isCorrect) {
    return `${baseClass} ${stateColors.incorrect} shadow-md`;
  }

  return `${baseClass} ${stateColors.disabled}`;
};

// Icon colors
export const iconColors = {
  correct: "text-green-600 dark:text-green-400",
  incorrect: "text-red-500 dark:text-red-400",
} as const;
