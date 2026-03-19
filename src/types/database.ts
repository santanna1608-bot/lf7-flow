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
      companies: {
        Row: {
          id: string
          name: string
          plan_type: string | null
          api_key_internal: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          plan_type?: string | null
          api_key_internal?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          plan_type?: string | null
          api_key_internal?: string | null
          created_at?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          role: string | null
          company_id: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          role?: string | null
          company_id?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          role?: string | null
          company_id?: string | null
          created_at?: string | null
        }
      }
      funnels: {
        Row: {
          id: string
          name: string
          stages: Json
          company_id: string
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          stages?: Json
          company_id: string
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          stages?: Json
          company_id?: string
          created_at?: string | null
        }
      }
      leads: {
        Row: {
          id: string
          name: string
          phone: string | null
          status: string
          funnel_id: string | null
          company_id: string
          last_message_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          phone?: string | null
          status: string
          funnel_id?: string | null
          company_id: string
          last_message_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          phone?: string | null
          status?: string
          funnel_id?: string | null
          company_id?: string
          last_message_at?: string | null
          created_at?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          lead_id: string
          role: string
          content: string
          company_id: string
          created_at: string | null
        }
        Insert: {
          id?: string
          lead_id: string
          role: string
          content: string
          company_id: string
          created_at?: string | null
        }
        Update: {
          id?: string
          lead_id?: string
          role?: string
          content?: string
          company_id?: string
          created_at?: string | null
        }
      }
    }
  }
}
