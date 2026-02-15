import { ReactNode } from "react";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";

interface ResultCardProps {
  variant: "success" | "error" | "info";
  icon?: "check" | "alert" | "x";
  title: string;
  children: ReactNode;
  className?: string;
}

/**
 * Duolingo-style result feedback banner
 * Shows success/error/info feedback with bold colors and rounded design
 */
export function ResultCard({ variant, icon = "check", title, children, className = "" }: ResultCardProps) {
  const variantStyles = {
    success: {
      bg: "bg-primary/10 border-primary/30",
      iconBg: "bg-primary",
      textColor: "text-primary",
    },
    error: {
      bg: "bg-destructive/10 border-destructive/30",
      iconBg: "bg-destructive",
      textColor: "text-destructive",
    },
    info: {
      bg: "bg-info/10 border-info/30",
      iconBg: "bg-info",
      textColor: "text-info",
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
    <div className={`p-5 rounded-2xl border-2 ${styles.bg} ${className}`}>
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${styles.iconBg}`}>
          <Icon className="w-5 h-5 text-card" />
        </div>
        <div className="flex-1">
          <p className={`font-extrabold text-lg mb-2 ${styles.textColor}`}>{title}</p>
          <div className="text-sm leading-relaxed font-semibold">{children}</div>
        </div>
      </div>
    </div>
  );
}
