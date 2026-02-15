import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
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
 * Provides consistent structure: type badge → question card → answer area
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
      {/* Type Badge */}
      <div className={`flex items-center gap-2 text-sm font-semibold ${badgeColorClass} px-3 py-2 rounded-lg w-fit`}>
        {badgeIcon}
        {badgeLabel}
      </div>

      {/* Question Card */}
      <Card className="p-6">
        <p className="text-xl font-bold leading-relaxed">
          {typeof question === 'string' ? question : L(question, lang)}
        </p>
      </Card>

      {/* Answer Area (children) */}
      {children}
    </div>
  );
}
