// ─── App Constants ──────────────────────────────────────────

/**
 * Streak threshold for considering a question "mastered"
 * A question is mastered when streak >= this value
 */
export const MASTERED_STREAK_THRESHOLD = 3;

/**
 * Spaced repetition intervals in hours
 */
export const SRS_INTERVALS_HOURS = [1, 3, 8, 24, 72];

/**
 * Batch size for Supabase upsert operations
 */
export const SUPABASE_BATCH_SIZE = 50;

/**
 * Number of days for weakness analysis
 */
export const WEAKNESS_ANALYSIS_DAYS = 7;

/**
 * Accuracy threshold for perfect performance (0-100)
 */
export const PERFECT_ACCURACY_THRESHOLD = 100;

/**
 * XP required per level
 */
export const XP_PER_LEVEL = 100;
