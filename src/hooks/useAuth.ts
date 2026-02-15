import { useState, useEffect } from "react";
import { getCurrentUser, onAuthStateChange } from "@/lib/supabase";

export interface User {
  id: string;
  email?: string;
}

/**
 * Custom hook for managing authentication state
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load initial auth state
    getCurrentUser()
      .then((u) => {
        if (u) setUser({ id: u.id, email: u.email });
      })
      .finally(() => setIsLoading(false));

    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChange((userId) => {
      if (userId) {
        getCurrentUser().then((u) => {
          if (u) setUser({ id: u.id, email: u.email });
        });
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  return { user, isLoading };
}
