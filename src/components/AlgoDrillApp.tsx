"use client";

import { useState, useCallback } from "react";
import { LangContext } from "@/components/common/LangContext";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { CategoryScreen } from "@/components/screens/CategoryScreen";
import { SessionScreen, type SessionResult } from "@/components/screens/SessionScreen";
import { ResultScreen } from "@/components/screens/ResultScreen";
import { WeaknessDashboard } from "@/components/screens/WeaknessDashboard";
import { TEXTS } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { useAppState } from "@/hooks/useAppState";
import { useSession } from "@/hooks/useSession";
import type { QuestionProgress } from "@/lib/storage";

type Screen = "home" | "category" | "session" | "result" | "weakness";

export default function AlgoDrillApp() {
  const [screen, setScreen] = useState<Screen>("home");

  // Custom hooks for state management
  const { user } = useAuth();
  const { lang, setLang, progress, setProgress, stats, setStats, dailyGoal, setDailyGoal, resetProgress } = useAppState(user?.id || null);
  const {
    sessionQuestions,
    sessionResults,
    sessionCategoryName,
    sessionMetadata,
    startSession: startSessionHook,
    completeSession: completeSessionHook,
  } = useSession(progress, setProgress, stats, setStats, lang);

  const startSession = useCallback(
    (categoryFilter: string | null = null) => {
      const started = startSessionHook(categoryFilter);
      if (started) {
        setScreen("session");
      }
      return started;
    },
    [startSessionHook]
  );

  const completeSession = useCallback(
    (np: Record<string, QuestionProgress>, results: SessionResult[]) => {
      completeSessionHook(np, results);
      setScreen("result");
    },
    [completeSessionHook]
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
      resetProgress();
    }
  };

  const tObj = TEXTS[lang];

  return (
    <LangContext.Provider value={{ lang, t: tObj, setLang }}>
      <div className="select-none">
        {screen === "home" && (
          <HomeScreen
            progress={progress}
            stats={stats}
            user={user}
            dailyGoal={dailyGoal}
            setDailyGoal={setDailyGoal}
            onStart={() => startSession(null)}
            onCategoryMode={() => setScreen("category")}
            onWeakness={() => setScreen("weakness")}
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
        {screen === "weakness" && (
          <WeaknessDashboard
            progress={progress}
            onBack={() => setScreen("home")}
            onFocusCategory={(catId) => {
              const started = startSession(catId);
              if (!started) {
                const t = TEXTS[lang];
                alert(t.noCategoryQuestions);
              }
            }}
          />
        )}
        {screen === "session" && (
          <SessionScreen
            questions={sessionQuestions}
            progress={progress}
            onComplete={completeSession}
            onCancel={() => setScreen("home")}
            categoryName={sessionCategoryName}
          />
        )}
        {screen === "result" && (
          <ResultScreen
            results={sessionResults}
            earnedXP={sessionMetadata.earnedXP}
            oldLevel={sessionMetadata.oldLevel}
            newLevel={sessionMetadata.newLevel}
            streakUpdated={sessionMetadata.streakUpdated}
            newStreak={sessionMetadata.newStreak}
            onHome={() => setScreen("home")}
          />
        )}
      </div>
    </LangContext.Provider>
  );
}
