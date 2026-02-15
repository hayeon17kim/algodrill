import { useState, useEffect, useCallback } from "react";
import {
  saveLocal,
  loadLocal,
  syncToServer,
  ensureAllQuestions,
  getInitialProgress,
  getInitialStats,
  type QuestionProgress,
  type Stats,
} from "@/lib/storage";
import type { Lang } from "@/lib/i18n";

/**
 * Custom hook for managing app state (progress, stats, language)
 */
export function useAppState(userId: string | null) {
  // Initialize with default values to avoid hydration mismatch
  const [lang, setLang] = useState<Lang>("ko");
  const [progress, setProgress] = useState<Record<string, QuestionProgress>>(getInitialProgress);
  const [stats, setStats] = useState<Stats>(getInitialStats);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage only on client side
  useEffect(() => {
    if (typeof window !== "undefined" && !isInitialized) {
      const saved = loadLocal();
      if (saved) {
        setLang(saved.lang || "ko");
        setProgress(ensureAllQuestions(saved.progress || getInitialProgress()));
        setStats(saved.stats || getInitialStats());
      }
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Persist to localStorage (only after initialization to avoid overwriting on first render)
  useEffect(() => {
    if (isInitialized) {
      saveLocal({ progress, stats, lang });
    }
  }, [progress, stats, lang, isInitialized]);

  // Reset daily stats
  useEffect(() => {
    if (isInitialized) {
      const today = new Date().toDateString();
      if (stats.lastDate !== today) {
        setStats({
          ...stats,
          todayCorrect: 0,
          todayTotal: 0,
          lastDate: today,
        });
      }
    }
  }, [isInitialized, stats]);

  // Background Supabase sync (fire and forget)
  useEffect(() => {
    const effectiveUserId = userId || "anonymous";
    syncToServer(effectiveUserId, progress).catch(() => {
      // Silently fail - offline mode
    });
  }, [progress, userId]);

  const resetProgress = useCallback(() => {
    setProgress(getInitialProgress());
    setStats(getInitialStats());
  }, []);

  return {
    lang,
    setLang,
    progress,
    setProgress,
    stats,
    setStats,
    resetProgress,
  };
}
