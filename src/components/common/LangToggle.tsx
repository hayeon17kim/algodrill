"use client";

import type { Lang } from "@/lib/i18n";

export function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <button
      onClick={() => setLang(lang === "ko" ? "en" : "ko")}
      className="w-9 h-9 rounded-xl text-xs font-extrabold border-2 border-border bg-card hover:bg-accent transition-all flex items-center justify-center"
    >
      {lang === "ko" ? "EN" : "KO"}
    </button>
  );
}
