export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      app_stats: {
        Row: {
          created_at: string
          id: string
          updated_at: string
          value: number
        }
        Insert: {
          created_at?: string
          id: string
          updated_at?: string
          value: number
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
          value?: number
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
          },
        ]
      }
      game_ai_evaluations: {
        Row: {
          ai_explanation: string
          ai_score: number
          ai_suggestion: string[] | null
          score_id: string
        }
        Insert: {
          ai_explanation: string
          ai_score: number
          ai_suggestion?: string[] | null
          score_id: string
        }
        Update: {
          ai_explanation?: string
          ai_score?: number
          ai_suggestion?: string[] | null
          score_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_ai_evaluations_score_id_fkey"
            columns: ["score_id"]
            isOneToOne: true
            referencedRelation: "game_scores"
            referencedColumns: ["id"]
          },
        ]
      }
      game_score_conversations: {
        Row: {
          content: string
          id: string
          role: Database["public"]["Enums"]["conversation_chat_role"]
          score_id: string
          timestamp: string
        }
        Insert: {
          content: string
          id?: string
          role: Database["public"]["Enums"]["conversation_chat_role"]
          score_id: string
          timestamp?: string
        }
        Update: {
          content?: string
          id?: string
          role?: Database["public"]["Enums"]["conversation_chat_role"]
          score_id?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_score_conversations_score_id_fkey"
            columns: ["score_id"]
            isOneToOne: false
            referencedRelation: "game_scores"
            referencedColumns: ["id"]
          },
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
          },
        ]
      }
      game_scores: {
        Row: {
          duration: number
          game_id: string
          id: string
          score_index: number
          target_word: string
        }
        Insert: {
          duration?: number
          game_id: string
          id?: string
          score_index?: number
          target_word: string
        }
        Update: {
          duration?: number
          game_id?: string
          id?: string
          score_index?: number
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
            foreignKeyName: "game_scores_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "v_game_level_info"
            referencedColumns: ["game_id"]
          },
          {
            foreignKeyName: "game_scores_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "v_user_played_level_game_with_scores_and_completed_times"
            referencedColumns: ["game_id"]
          },
          {
            foreignKeyName: "game_scores_target_word_fkey"
            columns: ["target_word"]
            isOneToOne: false
            referencedRelation: "words"
            referencedColumns: ["word"]
          },
        ]
      }
      games: {
        Row: {
          finished_at: string
          id: string
          level_id: string
          started_at: string
          user_id: string
        }
        Insert: {
          finished_at?: string
          id?: string
          level_id: string
          started_at?: string
          user_id: string
        }
        Update: {
          finished_at?: string
          id?: string
          level_id?: string
          started_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "games_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "v_game_level_info"
            referencedColumns: ["level_id"]
          },
          {
            foreignKeyName: "games_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "v_level_with_best_score_and_top_scorers"
            referencedColumns: ["level_id"]
          },
          {
            foreignKeyName: "games_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "v_levels_with_created_by_and_ranks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "v_user_played_level_game_with_scores_and_completed_times"
            referencedColumns: ["level_id"]
          },
          {
            foreignKeyName: "games_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_played_level_game_with_scores_and_completed_times"
            referencedColumns: ["user_id"]
          },
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
          },
          {
            foreignKeyName: "levels_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_user_played_level_game_with_scores_and_completed_times"
            referencedColumns: ["user_id"]
          },
        ]
      }
      plan_features: {
        Row: {
          description: string
          feature_order: number
          id: string
          plan_id: string
          status: Database["public"]["Enums"]["feature_status"]
          title: string
        }
        Insert: {
          description: string
          feature_order?: number
          id?: string
          plan_id: string
          status: Database["public"]["Enums"]["feature_status"]
          title: string
        }
        Update: {
          description?: string
          feature_order?: number
          id?: string
          plan_id?: string
          status?: Database["public"]["Enums"]["feature_status"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_features_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          id: string
          name: string
          price_id: string | null
          price_per_month: number
          tier: number
          trial_days: number
          type: Database["public"]["Enums"]["customer_plan_type"]
        }
        Insert: {
          id?: string
          name: string
          price_id?: string | null
          price_per_month: number
          tier?: number
          trial_days?: number
          type: Database["public"]["Enums"]["customer_plan_type"]
        }
        Update: {
          id?: string
          name?: string
          price_id?: string | null
          price_per_month?: number
          tier?: number
          trial_days?: number
          type?: Database["public"]["Enums"]["customer_plan_type"]
        }
        Relationships: []
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
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "v_user_played_level_game_with_scores_and_completed_times"
            referencedColumns: ["user_id"]
          },
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
            referencedRelation: "levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_attempted_levels_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "v_game_level_info"
            referencedColumns: ["level_id"]
          },
          {
            foreignKeyName: "user_attempted_levels_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "v_level_with_best_score_and_top_scorers"
            referencedColumns: ["level_id"]
          },
          {
            foreignKeyName: "user_attempted_levels_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "v_levels_with_created_by_and_ranks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_attempted_levels_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "v_user_played_level_game_with_scores_and_completed_times"
            referencedColumns: ["level_id"]
          },
          {
            foreignKeyName: "user_attempted_levels_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_attempted_levels_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_played_level_game_with_scores_and_completed_times"
            referencedColumns: ["user_id"]
          },
        ]
      }
      users: {
        Row: {
          email: string
          first_login_at: string
          id: string
          is_anonymous: boolean
          is_dev: boolean
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
          is_dev?: boolean
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
          is_dev?: boolean
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
          },
          {
            foreignKeyName: "words_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_user_played_level_game_with_scores_and_completed_times"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      v_game_level_info: {
        Row: {
          game_id: string | null
          level_difficulty: number | null
          level_id: string | null
          level_name: string | null
          total_score: number | null
          total_time_taken: number | null
        }
        Relationships: []
      }
      v_level_with_best_score_and_top_scorers: {
        Row: {
          best_score: number | null
          level_id: string | null
          top_scorer_ids: string[] | null
          top_scorer_names: string[] | null
        }
        Relationships: []
      }
      v_levels_with_created_by_and_ranks: {
        Row: {
          best_score: number | null
          created_at: string | null
          created_by: string | null
          difficulty: number | null
          id: string | null
          is_new: boolean | null
          is_verified: boolean | null
          name: string | null
          popularity: number | null
          top_scorer_ids: string[] | null
          top_scorer_names: string[] | null
          words: string[] | null
        }
        Relationships: []
      }
      v_user_played_level_game_with_scores_and_completed_times: {
        Row: {
          completed_times: number | null
          game_finished_at: string | null
          game_id: string | null
          is_best_score: boolean | null
          level_difficulty: number | null
          level_id: string | null
          level_name: string | null
          total_score: number | null
          total_time_taken: number | null
          user_email: string | null
          user_id: string | null
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
      f_delete_auth_user: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      f_increment_with_text_as_id: {
        Args: {
          _table_name: string
          _row_id: string
          _x: number
          _field_name: string
        }
        Returns: undefined
      }
      f_upload_a_game: {
        Args: {
          _user_id: string
          _level_id: string
          _game: Json
        }
        Returns: string
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
      feature_status: "complete" | "partial" | "absent"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
