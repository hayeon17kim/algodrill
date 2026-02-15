// Supabase generated types — update via `supabase gen types typescript`
// For now, manual definition matching our schema

export interface Database {
  public: {
    Tables: {
      questions: {
        Row: {
          id: string;
          type: string;
          category_id: string;
          difficulty: number;
          data: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          type: string;
          category_id: string;
          difficulty: number;
          data: Record<string, unknown>;
        };
        Update: Partial<Database["public"]["Tables"]["questions"]["Insert"]>;
      };
      user_progress: {
        Row: {
          user_id: string;
          question_id: string;
          streak: number;
          next_review: string;
          last_seen: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          question_id: string;
          streak: number;
          next_review: string;
          last_seen?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["user_progress"]["Insert"]>;
      };
    };
  };
}
