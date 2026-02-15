"use client";

import type { Lang } from "@/lib/i18n";

export function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <button
      onClick={() => setLang(lang === "ko" ? "en" : "ko")}
      className="px-3 py-1.5 rounded-full text-xs font-bold border-2 border-border bg-card hover:bg-accent transition-colors"
    >
      {lang === "ko" ? "EN" : "한"}
    </button>
  );
}
