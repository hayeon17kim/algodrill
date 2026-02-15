"use client";

import { useLang } from "@/components/common/LangContext";
import type { SessionResult } from "./SessionScreen";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Flame, Zap, BookOpen, CheckCircle2, XCircle } from "lucide-react";

interface Props {
  results: SessionResult[];
  onHome: () => void;
}

export function ResultScreen({ results, onHome }: Props) {
  const { t } = useLang();
  const correct = results.filter((r) => r.correct).length;
  const total = results.length;
  const pct = Math.round((correct / total) * 100);

  const getResultConfig = () => {
    if (pct === 100) return { message: t.resultPerfect, Icon: Trophy, color: "text-yellow-500" };
    if (pct >= 80) return { message: t.resultGreat, Icon: Flame, color: "text-orange-500" };
    if (pct >= 60) return { message: t.resultGood, Icon: Zap, color: "text-blue-500" };
    return { message: t.resultStudy, Icon: BookOpen, color: "text-indigo-500" };
  };

  const { message, Icon, color } = getResultConfig();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-md mx-auto px-4 text-center space-y-8 py-12">
        <div className="flex justify-center animate-in">
          <div className={`w-28 h-28 rounded-3xl bg-gradient-to-br ${
            pct === 100 ? 'from-yellow-400 to-orange-500' :
            pct >= 80 ? 'from-orange-400 to-red-500' :
            pct >= 60 ? 'from-blue-400 to-indigo-500' :
            'from-indigo-400 to-purple-500'
          } p-1 shadow-2xl hover-glow`}>
            <div className="w-full h-full bg-white rounded-3xl flex items-center justify-center">
              <Icon className={`w-16 h-16 ${color}`} />
            </div>
          </div>
        </div>

        <div className="space-y-3 animate-in" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-3xl font-black text-gray-900">{message}</h2>
          <div className="inline-flex items-baseline gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            <span className="text-6xl font-black">{correct}</span>
            <span className="text-4xl font-bold text-gray-400">/</span>
            <span className="text-6xl font-black">{total}</span>
          </div>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-lg font-bold text-indigo-600">{pct}%</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground animate-in" style={{ animationDelay: '0.2s' }}>
          {t.spacedRepeat}
        </p>

        <Card className="p-5 shadow-lg border-muted animate-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex gap-2 justify-center flex-wrap">
            {results.map((r, i) => (
              <div
                key={i}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110 ${
                  r.correct
                    ? "bg-gradient-to-br from-green-400 to-emerald-500 shadow-green-200 shadow-md"
                    : "bg-gradient-to-br from-red-400 to-rose-500 shadow-red-200 shadow-md"
                }`}
                style={{ animationDelay: `${0.4 + i * 0.05}s` }}
              >
                {r.correct ? (
                  <CheckCircle2 className="w-6 h-6 text-white" />
                ) : (
                  <XCircle className="w-6 h-6 text-white" />
                )}
              </div>
            ))}
          </div>
        </Card>

        <Button
          onClick={onHome}
          size="lg"
          className="w-full h-16 rounded-2xl text-lg font-bold shadow-xl hover-lift hover:shadow-2xl transition-all duration-300 animate-in"
          style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", animationDelay: '0.5s' }}
        >
          {t.goHome}
        </Button>
      </div>
    </div>
  );
}
