-- ============================================================
-- Favorites Table Setup — Impact Graphics AI Prompt Vault
-- Safe to re-run (idempotent)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt_id UUID NOT NULL REFERENCES public.prompts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, prompt_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first (safe to re-run)
DROP POLICY IF EXISTS "Users can view their own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can add their own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can remove their own favorites" ON public.favorites;

CREATE POLICY "Users can view their own favorites"
ON public.favorites FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own favorites"
ON public.favorites FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own favorites"
ON public.favorites FOR DELETE
USING (auth.uid() = user_id);

-- Grant access to authenticated users
GRANT SELECT, INSERT, DELETE ON public.favorites TO authenticated;
