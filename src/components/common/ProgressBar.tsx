"use client";

export function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = total > 0 ? (current / total) * 100 : 0;
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className="h-2.5 rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, background: "linear-gradient(90deg,#8b5cf6,#6366f1)" }}
      />
    </div>
  );
}
