import { ReactNode } from "react";
import { useLang } from "@/components/common/LangContext";
import { L, type Bilingual } from "@/lib/i18n";

interface QuestionLayoutProps {
  /** Question type badge icon (e.g., Target, Code2, ListOrdered) */
  badgeIcon: ReactNode;
  /** Question type label from translations */
  badgeLabel: string;
  /** Badge color classes */
  badgeColorClass: string;
  /** Question text (bilingual) */
  question: Bilingual | string;
  /** Main interactive area for answering the question */
  children: ReactNode;
}

/**
 * Common layout wrapper for all question types
 * Duolingo-style clean layout: type pill, bold question, answer area
 */
export function QuestionLayout({
  badgeIcon,
  badgeLabel,
  badgeColorClass,
  question,
  children,
}: QuestionLayoutProps) {
  const { lang } = useLang();

  return (
    <div className="space-y-6">
      {/* Type Badge — pill style */}
      <div className={`inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest ${badgeColorClass} px-3 py-1.5 rounded-xl`}>
        {badgeIcon}
        {badgeLabel}
      </div>

      {/* Question Text — big and bold, no card wrapper */}
      <h2 className="text-2xl font-black leading-snug text-balance">
        {typeof question === 'string' ? question : L(question, lang)}
      </h2>

      {/* Answer Area (children) */}
      {children}
    </div>
  );
}
