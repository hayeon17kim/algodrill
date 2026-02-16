import { ReactNode, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface PrimaryActionButtonProps {
  onClick: () => void;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
  /** Delay in ms before button becomes clickable (default: 0) */
  delayMs?: number;
}

/**
 * Primary action button used across question components and screens
 * Supports optional delay to encourage reading feedback
 */
export function PrimaryActionButton({
  onClick,
  children,
  disabled = false,
  className = "",
  delayMs = 0,
}: PrimaryActionButtonProps) {
  const [waiting, setWaiting] = useState(delayMs > 0);
  const [countdown, setCountdown] = useState(Math.ceil(delayMs / 1000));

  useEffect(() => {
    if (delayMs <= 0) return;
    setWaiting(true);
    setCountdown(Math.ceil(delayMs / 1000));

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setWaiting(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [delayMs]);

  return (
    <Button
      onClick={onClick}
      size="lg"
      disabled={disabled || waiting}
      className={`w-full h-14 text-base ${className}`}
    >
      {waiting ? `${countdown}...` : children}
    </Button>
  );
}
