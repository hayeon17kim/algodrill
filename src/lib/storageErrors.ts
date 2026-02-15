import type { AppState } from "./storage";

export class StorageError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = "StorageError";
  }
}

export class NetworkError extends Error {
  constructor(message: string, public cause?: unknown, public retryable: boolean = true) {
    super(message);
    this.name = "NetworkError";
  }
}

// Logging utility
export const logStorageError = (context: string, error: unknown) => {
  if (process.env.NODE_ENV === "development") {
    console.error(`[Storage Error - ${context}]`, error);
  }
};

// Retry with exponential backoff
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delayMs * Math.pow(2, attempt)));
      }
    }
  }

  throw new NetworkError("Max retries exceeded", lastError);
}

// Validate AppState structure
export function validateAppState(data: unknown): data is AppState {
  if (!data || typeof data !== "object") return false;

  const state = data as any;

  if (!state.progress || typeof state.progress !== "object") return false;
  if (!state.stats || typeof state.stats !== "object") return false;
  if (typeof state.stats.todayCorrect !== "number") return false;
  if (typeof state.stats.todayTotal !== "number") return false;
  if (typeof state.stats.totalXP !== "number") return false;
  if (state.lang !== "ko" && state.lang !== "en") return false;

  return true;
}
