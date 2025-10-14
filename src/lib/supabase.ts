import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'admin' | 'user'
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role?: 'admin' | 'user'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'admin' | 'user'
          created_at?: string
        }
      }
      voting_cards: {
        Row: {
          id: string
          category: string
          title: string
          description: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category: string
          title: string
          description: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category?: string
          title?: string
          description?: string
          created_at?: string
          updated_at?: string
        }
      }
      votes: {
        Row: {
          id: string
          option: 'agree' | 'neutral' | 'disagree'
          user_id: string
          voting_card_id: string
          created_at: string
        }
        Insert: {
          id?: string
          option: 'agree' | 'neutral' | 'disagree'
          user_id: string
          voting_card_id: string
          created_at?: string
        }
        Update: {
          id?: string
          option?: 'agree' | 'neutral' | 'disagree'
          user_id?: string
          voting_card_id?: string
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          content: string
          user_id: string
          voting_card_id: string
          created_at: string
        }
        Insert: {
          id?: string
          content: string
          user_id: string
          voting_card_id: string
          created_at?: string
        }
        Update: {
          id?: string
          content?: string
          user_id?: string
          voting_card_id?: string
          created_at?: string
        }
      }
    }
  }
}
