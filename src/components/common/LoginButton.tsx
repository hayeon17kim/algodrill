"use client";

import { useContext, useState, useRef, useEffect } from "react";
import { LangContext } from "./LangContext";
import { signInWithGitHub, signOut } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { User, LogOut, ChevronDown } from "lucide-react";

interface LoginButtonProps {
  user: { id: string; email?: string } | null;
  onAuthChange?: () => void;
}

export function LoginButton({ user, onAuthChange }: LoginButtonProps) {
  const { t } = useContext(LangContext);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const handleSignIn = async () => {
    const { error } = await signInWithGitHub();
    if (error) {
      alert(error.message);
    }
  };

  const handleSignOut = async () => {
    setOpen(false);
    const { error } = await signOut();
    if (error) {
      alert(error.message);
    } else {
      onAuthChange?.();
    }
  };

  if (user) {
    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1 p-2 rounded-xl hover:bg-accent transition-colors"
        >
          <div className="w-7 h-7 flex items-center justify-center bg-primary/10 rounded-full">
            <User className="w-4 h-4 text-primary" />
          </div>
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-card border-2 border-border rounded-xl shadow-lg z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <p className="text-xs font-bold text-muted-foreground truncate">
                {user.email || `User ${user.id.slice(0, 8)}`}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm font-bold text-destructive hover:bg-destructive/5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              {t.logout || "Logout"}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <Button onClick={handleSignIn} variant="ghost" size="sm" className="gap-2">
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
      <span className="hidden sm:inline">{t.loginWithGitHub || "Login"}</span>
    </Button>
  );
}
