"use client";

import { useState, useEffect, useCallback } from "react";
import { LangContext } from "@/components/common/LangContext";
import { LangToggle } from "@/components/common/LangToggle";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { CategoryScreen } from "@/components/screens/CategoryScreen";
import { SessionScreen, type SessionResult } from "@/components/screens/SessionScreen";
import { ResultScreen } from "@/components/screens/ResultScreen";
import { CATEGORIES } from "@/data/categories";
import { QUESTIONS, type Question } from "@/data/questions";
import { L, TEXTS, type Lang } from "@/lib/i18n";
import {
  saveLocal,
  loadLocal,
  syncToServer,
  ensureAllQuestions,
  getInitialProgress,
  getNextQuestions,
  type QuestionProgress,
  type AppState,
} from "@/lib/storage";

type Screen = "home" | "category" | "session" | "result";

export default function AlgoDrillApp() {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === "undefined") return "ko";
    const saved = loadLocal();
    return saved?.lang || "ko";
  });

  const [screen, setScreen] = useState<Screen>("home");

  const [progress, setProgress] = useState<Record<string, QuestionProgress>>(() => {
    if (typeof window === "undefined") return getInitialProgress();
    const saved = loadLocal();
    return ensureAllQuestions(saved?.progress || getInitialProgress());
  });

  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [sessionResults, setSessionResults] = useState<SessionResult[]>([]);
  const [sessionCategoryName, setSessionCategoryName] = useState<string | null>(null);

  const [stats, setStats] = useState(() => {
    if (typeof window === "undefined") return { todayCorrect: 0, todayTotal: 0, lastDate: new Date().toDateString() };
    const saved = loadLocal();
    return saved?.stats || { todayCorrect: 0, todayTotal: 0, lastDate: new Date().toDateString() };
  });

  // Persist to localStorage
  useEffect(() => {
    saveLocal({ progress, stats, lang });
  }, [progress, stats, lang]);

  // Reset daily stats
  useEffect(() => {
    const today = new Date().toDateString();
    if (stats.lastDate !== today) {
      setStats({ todayCorrect: 0, todayTotal: 0, lastDate: today });
    }
  }, []);

  // Background Supabase sync (fire and forget)
  useEffect(() => {
    const userId = "anonymous"; // TODO: replace with real auth
    syncToServer(userId, progress).catch(() => {});
  }, [progress]);

  const startSession = useCallback(
    (categoryFilter: string | null = null) => {
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

      setScreen("session");
      return true;
    },
    [progress, lang],
  );

  const completeSession = useCallback(
    (np: Record<string, QuestionProgress>, results: SessionResult[]) => {
      setProgress(np);
      setSessionResults(results);
      const c = results.filter((r) => r.correct).length;
      setStats((s) => ({
        todayCorrect: s.todayCorrect + c,
        todayTotal: s.todayTotal + results.length,
        lastDate: new Date().toDateString(),
      }));
      setScreen("result");
    },
    [],
  );

  const handleCategorySelect = useCallback(
    (catId: string) => {
      const started = startSession(catId);
      if (!started) {
        const t = TEXTS[lang];
        alert(t.noCategoryQuestions);
      }
    },
    [startSession, lang],
  );

  const handleReset = () => {
    const t = TEXTS[lang];
    if (confirm(t.resetConfirm)) {
      setProgress(getInitialProgress());
      setStats({ todayCorrect: 0, todayTotal: 0, lastDate: new Date().toDateString() });
    }
  };

  const tObj = TEXTS[lang];

  return (
    <LangContext.Provider value={{ lang, t: tObj }}>
      <div className="select-none">
        <div className="fixed top-4 right-4 z-50">
          <LangToggle lang={lang} setLang={setLang} />
        </div>

        {screen === "home" && (
          <HomeScreen
            progress={progress}
            stats={stats}
            onStart={() => startSession(null)}
            onCategoryMode={() => setScreen("category")}
            onReset={handleReset}
          />
        )}
        {screen === "category" && (
          <CategoryScreen
            progress={progress}
            onSelectCategory={handleCategorySelect}
            onBack={() => setScreen("home")}
          />
        )}
        {screen === "session" && (
          <SessionScreen
            questions={sessionQuestions}
            progress={progress}
            onComplete={completeSession}
            categoryName={sessionCategoryName}
          />
        )}
        {screen === "result" && (
          <ResultScreen results={sessionResults} onHome={() => setScreen("home")} />
        )}
      </div>
    </LangContext.Provider>
  );
}
