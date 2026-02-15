import { useState, useCallback } from "react";
import { CATEGORIES } from "@/data/categories";
import type { Question } from "@/data/questions";
import type { SessionResult } from "@/components/screens/SessionScreen";
import {
  getNextQuestions,
  getInitialProgress,
  getXPForQuestion,
  getLevelFromXP,
  updateStreak,
  type QuestionProgress,
  type Stats,
} from "@/lib/storage";
import { L, type Lang } from "@/lib/i18n";

export interface SessionMetadata {
  earnedXP: number;
  oldLevel: number;
  newLevel: number;
  streakUpdated: boolean;
  newStreak: number;
}

/**
 * Custom hook for managing session state and logic
 */
export function useSession(
  progress: Record<string, QuestionProgress>,
  setProgress: (progress: Record<string, QuestionProgress>) => void,
  stats: Stats,
  setStats: (stats: Stats | ((s: Stats) => Stats)) => void,
  lang: Lang
) {
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [sessionResults, setSessionResults] = useState<SessionResult[]>([]);
  const [sessionCategoryName, setSessionCategoryName] = useState<string | null>(null);
  const [sessionMetadata, setSessionMetadata] = useState<SessionMetadata>({
    earnedXP: 0,
    oldLevel: 1,
    newLevel: 1,
    streakUpdated: false,
    newStreak: 0,
  });

  const startSession = useCallback(
    (categoryFilter: string | null = null): boolean => {
      let qs = getNextQuestions(progress, 5, categoryFilter);
      if (qs.length === 0 && !categoryFilter) {
        const fresh = getInitialProgress();
        setProgress(fresh);
        qs = getNextQuestions(fresh, 5, null);
      }
      if (qs.length === 0) return false;

      setSessionQuestions(qs);

      if (categoryFilter) {
        const cat = CATEGORIES.find((c) => c.id === categoryFilter);
        setSessionCategoryName(cat ? `${cat.icon} ${L(cat.name, lang)}` : null);
      } else {
        setSessionCategoryName(null);
      }

      return true;
    },
    [progress, lang, setProgress]
  );

  const completeSession = useCallback(
    (np: Record<string, QuestionProgress>, results: SessionResult[]) => {
      setProgress(np);
      setSessionResults(results);

      const c = results.filter((r) => r.correct).length;

      // Calculate XP earned
      const earnedXP = results.reduce((sum, r) => {
        const q = sessionQuestions.find((sq) => sq.id === r.questionId);
        return sum + getXPForQuestion(q?.difficulty || 1, r.correct);
      }, 0);

      // Get old level before XP update
      const oldLevel = getLevelFromXP(stats.totalXP);

      setStats((s) => {
        // Update streak
        const updated = updateStreak(s);
        const newXP = updated.totalXP + earnedXP;
        const newLevel = getLevelFromXP(newXP);

        // Store metadata for ResultScreen
        setSessionMetadata({
          earnedXP,
          oldLevel,
          newLevel,
          streakUpdated: updated.currentStreak > s.currentStreak,
          newStreak: updated.currentStreak,
        });

        return {
          ...updated,
          todayCorrect: updated.todayCorrect + c,
          todayTotal: updated.todayTotal + results.length,
          lastDate: new Date().toDateString(),
          totalXP: newXP,
        };
      });
    },
    [sessionQuestions, stats, setProgress, setStats]
  );

  return {
    sessionQuestions,
    sessionResults,
    sessionCategoryName,
    sessionMetadata,
    startSession,
    completeSession,
  };
}
