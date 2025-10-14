-- Voting System Database Schema for Supabase
-- Run these commands in your Supabase SQL editor

-- Create users table (extends auth.users)
-- Use IF NOT EXISTS to avoid conflicts
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create voting_cards table
CREATE TABLE IF NOT EXISTS public.voting_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create votes table
CREATE TABLE IF NOT EXISTS public.votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  option TEXT NOT NULL CHECK (option IN ('agree', 'neutral', 'disagree')),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  voting_card_id UUID REFERENCES public.voting_cards(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, voting_card_id) -- One vote per user per voting card
);

-- Create comments table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  voting_card_id UUID REFERENCES public.voting_cards(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voting_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Everyone can view user profiles" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Everyone can view voting cards" ON public.voting_cards;
DROP POLICY IF EXISTS "Only admins can create voting cards" ON public.voting_cards;
DROP POLICY IF EXISTS "Authenticated users can create voting cards" ON public.voting_cards;
DROP POLICY IF EXISTS "Only admins can update voting cards" ON public.voting_cards;
DROP POLICY IF EXISTS "Allow updates for voting cards" ON public.voting_cards;
DROP POLICY IF EXISTS "Only admins can delete voting cards" ON public.voting_cards;
DROP POLICY IF EXISTS "Admins can delete voting cards" ON public.voting_cards;
DROP POLICY IF EXISTS "Everyone can view votes" ON public.votes;
DROP POLICY IF EXISTS "Authenticated users can create votes" ON public.votes;
DROP POLICY IF EXISTS "Users can only vote once per card" ON public.votes;
DROP POLICY IF EXISTS "Everyone can view comments" ON public.comments;
DROP POLICY IF EXISTS "Authenticated users can create comments" ON public.comments;

-- RLS Policies for users table
-- Allow everyone to view user profiles (needed for displaying comment authors)
CREATE POLICY "Everyone can view user profiles" ON public.users
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for voting_cards table
CREATE POLICY "Everyone can view voting cards" ON public.voting_cards
  FOR SELECT USING (true);

-- Allow ALL authenticated users to create voting cards (not just admins)
CREATE POLICY "Authenticated users can create voting cards" ON public.voting_cards
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Only admins can update voting cards
CREATE POLICY "Allow updates for voting cards" ON public.voting_cards
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can delete voting cards
CREATE POLICY "Admins can delete voting cards" ON public.voting_cards
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for votes table
CREATE POLICY "Everyone can view votes" ON public.votes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create votes" ON public.votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for comments table
CREATE POLICY "Everyone can view comments" ON public.comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON public.comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Drop existing function and trigger if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Function to handle user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Drop existing function and trigger if they exist
DROP TRIGGER IF EXISTS update_voting_cards_updated_at ON public.voting_cards;
DROP FUNCTION IF EXISTS public.update_updated_at_column();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at on voting_cards
CREATE TRIGGER update_voting_cards_updated_at
  BEFORE UPDATE ON public.voting_cards
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
