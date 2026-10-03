-- 1. Create a `profiles` table to store public user data linked to Supabase Auth
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone." 
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." 
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." 
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Trigger for creating a profile on every new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Create a `prompts` table for the AI Prompt Vault
CREATE TABLE prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  prompt_text TEXT NOT NULL,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for prompts
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public prompts are viewable by everyone." 
  ON prompts FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view their own private prompts." 
  ON prompts FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Users can insert their own prompts." 
  ON prompts FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own prompts." 
  ON prompts FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own prompts." 
  ON prompts FOR DELETE USING (auth.uid() = author_id);

-- 4. Create a `favorites` table so users can save/bookmark prompts
CREATE TABLE favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  prompt_id UUID REFERENCES public.prompts(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, prompt_id)
);

-- Enable RLS for favorites
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own favorites" 
  ON favorites FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites" 
  ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" 
  ON favorites FOR DELETE USING (auth.uid() = user_id);
