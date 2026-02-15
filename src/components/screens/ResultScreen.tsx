"use client";

import { useLang } from "@/components/common/LangContext";
import type { SessionResult } from "./SessionScreen";

interface Props {
  results: SessionResult[];
  onHome: () => void;
}

export function ResultScreen({ results, onHome }: Props) {
  const { t } = useLang();
  const correct = results.filter((r) => r.correct).length;
  const total = results.length;
  const pct = Math.round((correct / total) * 100);
  const [message, emoji] =
    pct === 100 ? [t.resultPerfect, "🏆"] :
    pct >= 80 ? [t.resultGreat, "🔥"] :
    pct >= 60 ? [t.resultGood, "💪"] :
    [t.resultStudy, "📚"];

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(180deg,#eef2ff 0%,#fff 50%)" }}>
      <div className="max-w-md mx-auto px-4 text-center space-y-6">
        <div className="text-6xl">{emoji}</div>
        <h2 className="text-2xl font-black text-gray-900">{message}</h2>
        <div className="text-5xl font-black text-indigo-600">{correct}/{total}</div>
        <p className="text-gray-500">{t.spacedRepeat}</p>
        <div className="flex gap-2 justify-center flex-wrap">
          {results.map((r, i) => (
            <div key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${r.correct ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>
              {r.correct ? "✓" : "✗"}
            </div>
          ))}
        </div>
        <button onClick={onHome}
          className="w-full py-4 rounded-2xl font-bold text-lg text-white shadow-lg active:scale-95 transition-transform"
          style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
          {t.goHome}
        </button>
      </div>
    </div>
  );
}
