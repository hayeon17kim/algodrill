"use client";

import { createContext, useContext } from "react";
import { TEXTS, type Lang } from "@/lib/i18n";

interface LangCtx {
  lang: Lang;
  t: Record<string, string>;
  setLang: (l: Lang) => void;
}

export const LangContext = createContext<LangCtx>({
  lang: "ko",
  t: TEXTS.ko,
  setLang: () => {},
});

export function useLang() {
  return useContext(LangContext);
}
