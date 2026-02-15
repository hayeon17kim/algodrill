import { supabase, isSupabaseConfigured } from "./supabase";
import { QUESTIONS, type Question } from "@/data/questions";

// ─── Types ──────────────────────────────────────────────────
export interface QuestionProgress {
  streak: number;
  nextReview: number; // epoch ms
  lastSeen: number;
}

export interface AppState {
  progress: Record<string, QuestionProgress>;
  stats: { todayCorrect: number; todayTotal: number; lastDate: string };
  lang: "ko" | "en";
}

// ─── Local Storage (offline-first cache) ────────────────────
const STORAGE_KEY = "algodrill_v2";

export function saveLocal(data: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function loadLocal(): AppState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ─── Supabase Sync (when configured) ────────────────────────
export async function syncToServer(userId: string, progress: Record<string, QuestionProgress>) {
  if (!isSupabaseConfigured() || !supabase) return;

  const rows = Object.entries(progress).map(([qId, p]) => ({
    user_id: userId,
    question_id: qId,
    streak: p.streak,
    next_review: new Date(p.nextReview).toISOString(),
    last_seen: p.lastSeen ? new Date(p.lastSeen).toISOString() : null,
  }));

  // Upsert in batches of 50
  for (let i = 0; i < rows.length; i += 50) {
    await supabase
      .from("user_progress")
      .upsert(rows.slice(i, i + 50), { onConflict: "user_id,question_id" });
  }
}

export async function loadFromServer(userId: string): Promise<Record<string, QuestionProgress> | null> {
  if (!isSupabaseConfigured() || !supabase) return null;

  const { data, error } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId);

  if (error || !data?.length) return null;

  const progress: Record<string, QuestionProgress> = {};
  for (const row of data) {
    progress[row.question_id] = {
      streak: row.streak,
      nextReview: new Date(row.next_review).getTime(),
      lastSeen: row.last_seen ? new Date(row.last_seen).getTime() : 0,
    };
  }
  return progress;
}

// ─── Spaced Repetition ──────────────────────────────────────
const SRS_INTERVALS_HOURS = [1, 3, 8, 24, 72];

export function getInitialProgress(): Record<string, QuestionProgress> {
  const p: Record<string, QuestionProgress> = {};
  QUESTIONS.forEach((q) => {
    p[q.id] = { streak: 0, nextReview: 0, lastSeen: 0 };
  });
  return p;
}

export function ensureAllQuestions(progress: Record<string, QuestionProgress>): Record<string, QuestionProgress> {
  const p = { ...progress };
  QUESTIONS.forEach((q) => {
    if (!p[q.id]) p[q.id] = { streak: 0, nextReview: 0, lastSeen: 0 };
  });
  return p;
}

export function getNextQuestions(
  progress: Record<string, QuestionProgress>,
  count = 5,
  categoryFilter: string | null = null
): Question[] {
  const now = Date.now();
  let pool = QUESTIONS as Question[];
  if (categoryFilter && categoryFilter !== "all") {
    pool = pool.filter((q) => q.categoryId === categoryFilter);
  }
  const due = pool
    .filter((q) => (progress[q.id]?.nextReview || 0) <= now)
    .sort((a, b) => (progress[a.id]?.streak || 0) - (progress[b.id]?.streak || 0));
  const unseen = due.filter((q) => !progress[q.id]?.lastSeen);
  const seen = due.filter((q) => progress[q.id]?.lastSeen);
  return [...unseen, ...seen].slice(0, count);
}

export function updateProgress(
  progress: Record<string, QuestionProgress>,
  questionId: string,
  correct: boolean
): Record<string, QuestionProgress> {
  const p = { ...progress };
  const curr = p[questionId] || { streak: 0, nextReview: 0, lastSeen: 0 };
  const now = Date.now();
  if (correct) {
    const hrs = SRS_INTERVALS_HOURS[Math.min(curr.streak, 4)];
    p[questionId] = { streak: curr.streak + 1, nextReview: now + hrs * 3600000, lastSeen: now };
  } else {
    p[questionId] = { streak: 0, nextReview: now, lastSeen: now };
  }
  return p;
}

// ─── Analytics & Weakness Detection ─────────────────────────
export interface CategoryStats {
  categoryId: string;
  total: number;
  correct: number;
  accuracy: number; // 0-100
}

export interface TypeStats {
  type: string;
  total: number;
  correct: number;
  accuracy: number;
}

export interface DifficultyStats {
  difficulty: number;
  total: number;
  correct: number;
  accuracy: number;
}

export interface WeaknessInsight {
  categoryId: string;
  accuracy: number;
  recentErrors: number; // last 7 days
}

/**
 * Calculate accuracy by category
 */
export function getCategoryStats(progress: Record<string, QuestionProgress>): CategoryStats[] {
  const categoryMap: Record<string, { total: number; correct: number }> = {};

  QUESTIONS.forEach((q) => {
    const p = progress[q.id];
    if (!p || !p.lastSeen) return; // not attempted yet

    if (!categoryMap[q.categoryId]) {
      categoryMap[q.categoryId] = { total: 0, correct: 0 };
    }
    categoryMap[q.categoryId].total++;
    // Streak > 0 means last attempt was correct
    if (p.streak > 0) {
      categoryMap[q.categoryId].correct++;
    }
  });

  return Object.entries(categoryMap).map(([categoryId, stats]) => ({
    categoryId,
    total: stats.total,
    correct: stats.correct,
    accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
  }));
}

/**
 * Calculate accuracy by question type
 */
export function getTypeStats(progress: Record<string, QuestionProgress>): TypeStats[] {
  const typeMap: Record<string, { total: number; correct: number }> = {};

  QUESTIONS.forEach((q) => {
    const p = progress[q.id];
    if (!p || !p.lastSeen) return;

    if (!typeMap[q.type]) {
      typeMap[q.type] = { total: 0, correct: 0 };
    }
    typeMap[q.type].total++;
    if (p.streak > 0) {
      typeMap[q.type].correct++;
    }
  });

  return Object.entries(typeMap).map(([type, stats]) => ({
    type,
    total: stats.total,
    correct: stats.correct,
    accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
  }));
}

/**
 * Calculate accuracy by difficulty
 */
export function getDifficultyStats(progress: Record<string, QuestionProgress>): DifficultyStats[] {
  const diffMap: Record<number, { total: number; correct: number }> = {};

  QUESTIONS.forEach((q) => {
    const p = progress[q.id];
    if (!p || !p.lastSeen) return;

    if (!diffMap[q.difficulty]) {
      diffMap[q.difficulty] = { total: 0, correct: 0 };
    }
    diffMap[q.difficulty].total++;
    if (p.streak > 0) {
      diffMap[q.difficulty].correct++;
    }
  });

  return Object.entries(diffMap).map(([diff, stats]) => ({
    difficulty: Number(diff),
    total: stats.total,
    correct: stats.correct,
    accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
  }));
}

/**
 * Find weak categories from last 7 days
 */
export function getWeakCategories(progress: Record<string, QuestionProgress>): WeaknessInsight[] {
  const sevenDaysAgo = Date.now() - 7 * 24 * 3600000;
  const categoryMap: Record<string, { total: number; correct: number; recentErrors: number }> = {};

  QUESTIONS.forEach((q) => {
    const p = progress[q.id];
    if (!p || !p.lastSeen) return;

    if (!categoryMap[q.categoryId]) {
      categoryMap[q.categoryId] = { total: 0, correct: 0, recentErrors: 0 };
    }

    // Overall stats
    categoryMap[q.categoryId].total++;
    if (p.streak > 0) {
      categoryMap[q.categoryId].correct++;
    }

    // Recent errors (last 7 days)
    if (p.lastSeen >= sevenDaysAgo && p.streak === 0) {
      categoryMap[q.categoryId].recentErrors++;
    }
  });

  const insights = Object.entries(categoryMap)
    .map(([categoryId, stats]) => ({
      categoryId,
      accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
      recentErrors: stats.recentErrors,
    }))
    .filter((insight) => insight.accuracy < 100); // Only show categories with room for improvement

  // Sort by: 1) recent errors descending, 2) accuracy ascending
  return insights.sort((a, b) => {
    if (b.recentErrors !== a.recentErrors) return b.recentErrors - a.recentErrors;
    return a.accuracy - b.accuracy;
  });
}

/**
 * Get overall accuracy
 */
export function getOverallAccuracy(progress: Record<string, QuestionProgress>): number {
  let total = 0;
  let correct = 0;

  QUESTIONS.forEach((q) => {
    const p = progress[q.id];
    if (!p || !p.lastSeen) return;
    total++;
    if (p.streak > 0) correct++;
  });

  return total > 0 ? Math.round((correct / total) * 100) : 0;
}
