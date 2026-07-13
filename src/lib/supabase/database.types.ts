// Tipos de la base de datos de Gota.
//
// Escritos a mano fieles a las migraciones de supabase/migrations para que el
// proyecto compile antes de conectar Supabase. Al conectar, REGENÉRALOS con:
//
//   supabase gen types typescript --linked > src/lib/supabase/database.types.ts
//
// (o --project-id <ref> / --local según tu flujo).

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
      profiles: {
        Row: {
          id: string
          display_name: string | null
          daily_goal_ml: number
          default_amount_ml: number
          timezone: string
          measurement_unit: string
          onboarding_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          daily_goal_ml?: number
          default_amount_ml?: number
          timezone?: string
          measurement_unit?: string
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string | null
          daily_goal_ml?: number
          default_amount_ml?: number
          timezone?: string
          measurement_unit?: string
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      hydration_entries: {
        Row: {
          id: string
          user_id: string
          amount_ml: number
          consumed_at: string
          source: string
          note: string | null
          client_request_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount_ml: number
          consumed_at?: string
          source?: string
          note?: string | null
          client_request_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount_ml?: number
          consumed_at?: string
          source?: string
          note?: string | null
          client_request_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      ai_insights: {
        Row: {
          id: string
          user_id: string
          period_start: string
          period_end: string
          insight_type: string
          content: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          period_start: string
          period_end: string
          insight_type: string
          content: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          period_start?: string
          period_end?: string
          insight_type?: string
          content?: Json
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<never, never>
    Functions: Record<never, never>
    Enums: Record<never, never>
    CompositeTypes: Record<never, never>
  }
}
