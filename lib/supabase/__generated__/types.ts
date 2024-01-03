export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      app_stats: {
        Row: {
          created_at: string
          id: string
          stat_name: string
          stat_value: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          stat_name: string
          stat_value: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          stat_name?: string
          stat_value?: string
          updated_at?: string
        }
        Relationships: []
      }
      curated_level_category: {
        Row: {
          name: string
        }
        Insert: {
          name: string
        }
        Update: {
          name?: string
        }
        Relationships: []
      }
      curated_levels: {
        Row: {
          category: string | null
          cover_image_url: string
          created_at: string
          difficulty: number
          id: string
          name: string
          updated_at: string
          words: string[]
        }
        Insert: {
          category?: string | null
          cover_image_url: string
          created_at?: string
          difficulty: number
          id?: string
          name: string
          updated_at?: string
          words: string[]
        }
        Update: {
          category?: string | null
          cover_image_url?: string
          created_at?: string
          difficulty?: number
          id?: string
          name?: string
          updated_at?: string
          words?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "curated_levels_category_fkey"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "curated_level_category"
            referencedColumns: ["name"]
          }
        ]
      }
      game_ai_evaluations: {
        Row: {
          ai_explanation: string
          ai_score: number
          ai_suggestion: string | null
          score_id: string
        }
        Insert: {
          ai_explanation: string
          ai_score: number
          ai_suggestion?: string | null
          score_id: string
        }
        Update: {
          ai_explanation?: string
          ai_score?: number
          ai_suggestion?: string | null
          score_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_ai_evaluations_score_id_fkey"
            columns: ["score_id"]
            isOneToOne: false
            referencedRelation: "game_scores"
            referencedColumns: ["id"]
          }
        ]
      }
      game_score_conversations: {
        Row: {
          content: string
          id: string
          role: Database["public"]["Enums"]["conversation_chat_role"]
          score_id: string
        }
        Insert: {
          content: string
          id?: string
          role: Database["public"]["Enums"]["conversation_chat_role"]
          score_id: string
        }
        Update: {
          content?: string
          id?: string
          role?: Database["public"]["Enums"]["conversation_chat_role"]
          score_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_score_conversations_score_id_fkey"
            columns: ["score_id"]
            isOneToOne: false
            referencedRelation: "game_scores"
            referencedColumns: ["id"]
          }
        ]
      }
      game_score_highlights: {
        Row: {
          end_position: number
          id: string
          score_id: string
          start_position: number
        }
        Insert: {
          end_position: number
          id?: string
          score_id: string
          start_position: number
        }
        Update: {
          end_position?: number
          id?: string
          score_id?: string
          start_position?: number
        }
        Relationships: [
          {
            foreignKeyName: "game_score_highlights_score_id_fkey"
            columns: ["score_id"]
            isOneToOne: false
            referencedRelation: "game_scores"
            referencedColumns: ["id"]
          }
        ]
      }
      game_scores: {
        Row: {
          duration: number
          game_id: string
          id: string
          target_word: string
        }
        Insert: {
          duration?: number
          game_id: string
          id?: string
          target_word: string
        }
        Update: {
          duration?: number
          game_id?: string
          id?: string
          target_word?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_scores_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_scores_target_word_fkey"
            columns: ["target_word"]
            isOneToOne: false
            referencedRelation: "words"
            referencedColumns: ["word"]
          }
        ]
      }
      games: {
        Row: {
          finished_at: string
          id: string
          level_id: string | null
          started_at: string
          user_id: string
        }
        Insert: {
          finished_at?: string
          id?: string
          level_id?: string | null
          started_at?: string
          user_id: string
        }
        Update: {
          finished_at?: string
          id?: string
          level_id?: string | null
          started_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "games_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "level_top_scorer_stats"
            referencedColumns: ["level_id"]
          },
          {
            foreignKeyName: "games_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      levels: {
        Row: {
          created_at: string
          created_by: string | null
          difficulty: number
          id: string
          is_new: boolean
          is_verified: boolean
          name: string
          popularity: number
          words: string[]
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          difficulty: number
          id?: string
          is_new?: boolean
          is_verified?: boolean
          name: string
          popularity?: number
          words: string[]
        }
        Update: {
          created_at?: string
          created_by?: string | null
          difficulty?: number
          id?: string
          is_new?: boolean
          is_verified?: boolean
          name?: string
          popularity?: number
          words?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "levels_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      subscriptions: {
        Row: {
          customer_id: string | null
          customer_plan_type: Database["public"]["Enums"]["customer_plan_type"]
          user_id: string
        }
        Insert: {
          customer_id?: string | null
          customer_plan_type?: Database["public"]["Enums"]["customer_plan_type"]
          user_id: string
        }
        Update: {
          customer_id?: string | null
          customer_plan_type?: Database["public"]["Enums"]["customer_plan_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_attempted_levels: {
        Row: {
          level_id: string
          user_id: string
        }
        Insert: {
          level_id: string
          user_id: string
        }
        Update: {
          level_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_attempted_levels_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "level_top_scorer_stats"
            referencedColumns: ["level_id"]
          },
          {
            foreignKeyName: "user_attempted_levels_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_attempted_levels_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          email: string
          first_login_at: string
          id: string
          is_anonymous: boolean
          last_login_at: string
          login_times: number
          name: string
          nickname: string | null
          photo_url: string | null
        }
        Insert: {
          email: string
          first_login_at?: string
          id?: string
          is_anonymous?: boolean
          last_login_at?: string
          login_times?: number
          name: string
          nickname?: string | null
          photo_url?: string | null
        }
        Update: {
          email?: string
          first_login_at?: string
          id?: string
          is_anonymous?: boolean
          last_login_at?: string
          login_times?: number
          name?: string
          nickname?: string | null
          photo_url?: string | null
        }
        Relationships: []
      }
      words: {
        Row: {
          created_by: string | null
          is_verified: boolean
          taboos: string[]
          updated_at: string
          word: string
        }
        Insert: {
          created_by?: string | null
          is_verified?: boolean
          taboos: string[]
          updated_at?: string
          word: string
        }
        Update: {
          created_by?: string | null
          is_verified?: boolean
          taboos?: string[]
          updated_at?: string
          word?: string
        }
        Relationships: [
          {
            foreignKeyName: "words_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      level_top_scorer_stats: {
        Row: {
          level_id: string | null
          player_ids: string[] | null
          total_score: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      citext:
        | {
            Args: {
              "": boolean
            }
            Returns: string
          }
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
      citext_hash: {
        Args: {
          "": string
        }
        Returns: number
      }
      citextin: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      citextout: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      citextrecv: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      citextsend: {
        Args: {
          "": string
        }
        Returns: string
      }
      get_best_performing_level_for_user: {
        Args: {
          _user_id: string
        }
        Returns: {
          level_id: string
          level_name: string
          difficulty: number
          score: number
        }[]
      }
      get_game_ranks_desc_for_level: {
        Args: {
          _level_id: string
        }
        Returns: {
          game_id: string
          player_id: string
          player_name: string
          total_score: number
        }[]
      }
      get_most_freq_played_levels_for_user: {
        Args: {
          _user_id: string
        }
        Returns: {
          level_id: string
          level_name: string
          difficulty: number
          completed_times: number
        }[]
      }
      get_total_score_for_game: {
        Args: {
          _game_id: string
        }
        Returns: {
          total_score: number
        }[]
      }
      get_user_played_levels_summary: {
        Args: {
          _user_id: string
        }
        Returns: {
          level_id: string
          completed_times: number
          last_played_at: string
          best_score: number
        }[]
      }
      increment: {
        Args: {
          _table_name: string
          _row_id: string
          _x: number
          _field_name: string
        }
        Returns: undefined
      }
    }
    Enums: {
      conversation_chat_role: "user" | "assistant" | "system" | "error"
      customer_plan_type: "free" | "pro"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
