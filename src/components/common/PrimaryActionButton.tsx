import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface PrimaryActionButtonProps {
  onClick: () => void;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}

/**
 * Primary action button used across question components and screens
 * Consistent large button with full width styling
 */
export function PrimaryActionButton({
  onClick,
  children,
  disabled = false,
  className = ""
}: PrimaryActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      size="lg"
      disabled={disabled}
      className={`w-full h-14 text-base ${className}`}
    >
      {children}
    </Button>
  );
}
