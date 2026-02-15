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
