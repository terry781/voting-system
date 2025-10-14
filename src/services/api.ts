import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

export type VotingCard = Database['public']['Tables']['voting_cards']['Row'] & {
  votes?: Vote[]
  comments?: Comment[]
}
export type Vote = Database['public']['Tables']['votes']['Row'] & {
  user: User
}
export type Comment = Database['public']['Tables']['comments']['Row'] & {
  user: User
}
export type User = Database['public']['Tables']['users']['Row']

export interface VoteStats {
  total: number
  agree: number
  neutral: number
  disagree: number
}

// Auth API
export const authApi = {
  signUp: async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    })
    if (error) throw error
    return data
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) throw error
    return { ...user, ...profile }
  },
}

// Voting Cards API
export const votingCardsApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('voting_cards')
      .select(`
        *,
        votes (*),
        comments (*, user:users(*))
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('voting_cards')
      .select(`
        *,
        votes (*),
        comments (*, user:users(*))
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  create: async (data: { category: string; title: string; description: string }) => {
    const { data: result, error } = await supabase
      .from('voting_cards')
      .insert(data)
      .select()
      .single()

    if (error) throw error
    return result
  },

  update: async (id: string, data: { category: string; title: string; description: string }) => {
    const { data: result, error } = await supabase
      .from('voting_cards')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return result
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('voting_cards')
      .delete()
      .eq('id', id)

    if (error) throw error
  },
}

// Votes API
export const votesApi = {
  create: async (data: { option: 'agree' | 'neutral' | 'disagree'; votingCardId: string }) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data: result, error } = await supabase
      .from('votes')
      .insert({
        option: data.option,
        user_id: user.id,
        voting_card_id: data.votingCardId,
      })
      .select()
      .single()

    if (error) throw error
    return result
  },

  getStats: async (votingCardId: string) => {
    const { data, error } = await supabase
      .from('votes')
      .select('option')
      .eq('voting_card_id', votingCardId)

    if (error) throw error

    const stats = {
      total: data.length,
      agree: data.filter(v => v.option === 'agree').length,
      neutral: data.filter(v => v.option === 'neutral').length,
      disagree: data.filter(v => v.option === 'disagree').length,
    }

    return stats
  },

  getByVotingCard: async (votingCardId: string) => {
    const { data, error } = await supabase
      .from('votes')
      .select(`
        *,
        user:users(*)
      `)
      .eq('voting_card_id', votingCardId)

    if (error) throw error
    return data
  },
}

// Comments API
export const commentsApi = {
  create: async (data: { content: string; votingCardId: string }) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data: result, error } = await supabase
      .from('comments')
      .insert({
        content: data.content,
        user_id: user.id,
        voting_card_id: data.votingCardId,
      })
      .select(`
        *,
        user:users(*)
      `)
      .single()

    if (error) throw error
    return result
  },

  getByVotingCard: async (votingCardId: string) => {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        user:users(*)
      `)
      .eq('voting_card_id', votingCardId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },
}
