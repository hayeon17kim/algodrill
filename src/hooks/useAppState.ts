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
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === "undefined") return "ko";
    const saved = loadLocal();
    return saved?.lang || "ko";
  });

  const [progress, setProgress] = useState<Record<string, QuestionProgress>>(() => {
    if (typeof window === "undefined") return getInitialProgress();
    const saved = loadLocal();
    return ensureAllQuestions(saved?.progress || getInitialProgress());
  });

  const [stats, setStats] = useState<Stats>(() => {
    if (typeof window === "undefined") return getInitialStats();
    const saved = loadLocal();
    return saved?.stats || getInitialStats();
  });

  // Persist to localStorage
  useEffect(() => {
    saveLocal({ progress, stats, lang });
  }, [progress, stats, lang]);

  // Reset daily stats
  useEffect(() => {
    const today = new Date().toDateString();
    if (stats.lastDate !== today) {
      setStats({
        ...stats,
        todayCorrect: 0,
        todayTotal: 0,
        lastDate: today,
      });
    }
  }, []);

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
