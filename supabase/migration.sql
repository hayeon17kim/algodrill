-- AlgoDrill Supabase Schema
-- Run this in Supabase SQL Editor to set up the tables

-- Questions table (optional — for server-managed question sets)
CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('pattern', 'approach', 'fillblank', 'speaking', 'complexity')),
  category_id TEXT NOT NULL,
  difficulty INTEGER NOT NULL DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 3),
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User progress table (core — tracks SRS state per user per question)
CREATE TABLE IF NOT EXISTS user_progress (
  user_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  streak INTEGER NOT NULL DEFAULT 0,
  next_review TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, question_id)
);

-- Index for efficient queries
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress (user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_review ON user_progress (user_id, next_review);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_user_progress_updated
  BEFORE UPDATE ON user_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_questions_updated
  BEFORE UPDATE ON questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- User analytics/stats table (for caching computed stats)
CREATE TABLE IF NOT EXISTS user_stats (
  user_id TEXT PRIMARY KEY,
  overall_accuracy INTEGER DEFAULT 0,
  category_stats JSONB DEFAULT '{}',
  type_stats JSONB DEFAULT '{}',
  difficulty_stats JSONB DEFAULT '{}',
  weak_categories JSONB DEFAULT '[]',
  last_computed TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_stats_user ON user_stats (user_id);

CREATE TRIGGER trg_user_stats_updated
  BEFORE UPDATE ON user_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security (enable when using Supabase Auth)
-- ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can manage own progress"
--   ON user_progress FOR ALL
--   USING (auth.uid()::text = user_id);

-- ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can manage own stats"
--   ON user_stats FOR ALL
--   USING (auth.uid()::text = user_id);
