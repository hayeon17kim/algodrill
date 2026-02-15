"use client";

import type { Lang } from "@/lib/i18n";

export function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <button
      onClick={() => setLang(lang === "ko" ? "en" : "ko")}
      className="px-3 py-1.5 rounded-full text-xs font-bold border-2 border-gray-200 bg-white hover:border-primary transition-all"
    >
      {lang === "ko" ? "EN" : "\ud55c"}
    </button>
  );
}
