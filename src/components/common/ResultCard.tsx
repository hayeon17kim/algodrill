import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";

interface ResultCardProps {
  variant: "success" | "error" | "info";
  icon?: "check" | "alert" | "x";
  title: string;
  children: ReactNode;
  className?: string;
}

/**
 * Shared result card component used across question types
 * Shows success/error/info feedback with consistent styling
 */
export function ResultCard({ variant, icon = "check", title, children, className = "" }: ResultCardProps) {
  const variantStyles = {
    success: {
      card: "border-green-300 dark:border-green-800 bg-green-50 dark:bg-green-950",
      iconBg: "bg-green-500",
      textColor: "text-green-900 dark:text-green-100",
    },
    error: {
      card: "border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950",
      iconBg: "bg-amber-500",
      textColor: "text-amber-900 dark:text-amber-100",
    },
    info: {
      card: "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950",
      iconBg: "bg-blue-500",
      textColor: "text-blue-900 dark:text-blue-100",
    },
  };

  const icons = {
    check: CheckCircle,
    alert: AlertCircle,
    x: XCircle,
  };

  const Icon = icons[icon];
  const styles = variantStyles[variant];

  return (
    <Card className={`p-5 border-2 ${styles.card} ${className}`}>
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${styles.iconBg}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <p className={`font-bold text-lg mb-2 ${styles.textColor}`}>{title}</p>
          <div className="text-sm leading-relaxed">{children}</div>
        </div>
      </div>
    </Card>
  );
}
