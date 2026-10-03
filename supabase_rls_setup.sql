-- ============================================================
-- STEP 1: Update profiles table to have role field
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;

CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- ============================================================
-- STEP 2: Update prompts table - add missing columns
-- ============================================================
ALTER TABLE public.prompts
  ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS style TEXT,
  ADD COLUMN IF NOT EXISTS ai_tool TEXT,
  ADD COLUMN IF NOT EXISTS difficulty TEXT CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  ADD COLUMN IF NOT EXISTS access TEXT NOT NULL DEFAULT 'Free' CHECK (access IN ('Free', 'Premium')),
  ADD COLUMN IF NOT EXISTS negative_prompt TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft'));

-- ============================================================
-- STEP 3: Drop ALL RLS policies on prompts (old AND new) and recreate
-- ============================================================
DROP POLICY IF EXISTS "P1" ON public.prompts;
DROP POLICY IF EXISTS "P2" ON public.prompts;
DROP POLICY IF EXISTS "P3" ON public.prompts;
DROP POLICY IF EXISTS "P4" ON public.prompts;
DROP POLICY IF EXISTS "Public prompts are viewable by everyone." ON public.prompts;
DROP POLICY IF EXISTS "Users can view their own private prompts." ON public.prompts;
DROP POLICY IF EXISTS "Users can insert their own prompts." ON public.prompts;
DROP POLICY IF EXISTS "Users can update their own prompts." ON public.prompts;
DROP POLICY IF EXISTS "Users can delete their own prompts." ON public.prompts;
DROP POLICY IF EXISTS "Public can view published prompts" ON public.prompts;
DROP POLICY IF EXISTS "Admins can view all prompts" ON public.prompts;
DROP POLICY IF EXISTS "Admins can insert prompts" ON public.prompts;
DROP POLICY IF EXISTS "Admins can update prompts" ON public.prompts;
DROP POLICY IF EXISTS "Admins can delete prompts" ON public.prompts;

ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

-- Anyone can view published prompts
CREATE POLICY "Public can view published prompts"
ON public.prompts FOR SELECT
USING (status = 'published');

-- Admins can view ALL prompts including drafts
CREATE POLICY "Admins can view all prompts"
ON public.prompts FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Only admins can insert
CREATE POLICY "Admins can insert prompts"
ON public.prompts FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Only admins can update
CREATE POLICY "Admins can update prompts"
ON public.prompts FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Only admins can delete
CREATE POLICY "Admins can delete prompts"
ON public.prompts FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- ============================================================
-- STEP 4: Seed all prompts from mock data
-- ============================================================
INSERT INTO public.prompts (title, slug, description, prompt_text, negative_prompt, category, style, ai_tool, difficulty, access, status, author_id)
SELECT
  v.title, v.slug, v.description, v.prompt_text, v.negative_prompt,
  v.category, v.style, v.ai_tool, v.difficulty, v.access, 'published',
  (SELECT id FROM public.profiles WHERE role = 'admin' LIMIT 1)
FROM (VALUES
  ('Minimalist Geometric Logo','minimalist-geometric-logo','Clean, modern logo concept using simple geometric shapes.','A minimalist logo design using simple geometric shapes, flat colors, clean lines, vector style, white background','blurry, cluttered, low quality, realistic','Logo & Brand Identity','Minimalist','Midjourney','Beginner','Free'),
  ('Luxury Monogram Emblem','luxury-monogram-emblem','Elegant monogram design for premium brands.','A luxury monogram emblem logo design, elegant, gold and black color palette, premium, minimalist vector graphic, professional corporate branding, white background','blurry, cluttered, low quality','Logo & Brand Identity','Luxury','Midjourney','Intermediate','Premium'),
  ('Tech Startup Icon Logo','tech-startup-icon-logo','Bold, modern icon logo suited for tech brands.','A modern tech startup icon logo, bold design, neon colors, gradient, sleek and minimalistic, white background','blurry, cluttered, low quality','Logo & Brand Identity','Modern','DALL·E','Beginner','Free'),
  ('Bold Event Poster Concept','bold-event-poster-concept','Eye-catching poster layout for events and promotions.','A bold and eye-catching event poster design mockup, vibrant colors, large modern typography, energetic layout, high contrast','blurry, cluttered, low quality','Digital Design','Bold','Midjourney','Beginner','Free'),
  ('Abstract Gradient Flyer','abstract-gradient-flyer','Vibrant abstract flyer design with gradient accents.','An abstract gradient flyer template design, vibrant neon accents, fluid shapes, modern layout, corporate event flyer concept','blurry, cluttered, low quality','Digital Design','Abstract','DALL·E','Intermediate','Premium'),
  ('Corporate Business Ad','corporate-business-ad','Professional advertisement layout for corporate use.','A professional corporate business advertisement layout, clean modern design with subtle shadows, typography-focused, business concept','blurry, cluttered, low quality','Digital Design','Professional','Midjourney','Beginner','Free'),
  ('Instagram Carousel Template','instagram-carousel-template','Engaging multi-slide carousel design concept.','An engaging multi-slide Instagram carousel template design, seamless transition, trendy aesthetic, educational content layout','blurry, cluttered, low quality','Social Media Graphics','Trendy','Midjourney','Beginner','Free'),
  ('Story Highlight Covers Set','story-highlight-covers-set','Cohesive icon set for Instagram story highlights.','A cohesive set of minimalist vector icons for Instagram story highlight covers, pastel background, simple linework','blurry, cluttered, low quality','Social Media Graphics','Minimalist','DALL·E','Beginner','Free'),
  ('Product Launch Announcement','product-launch-announcement','High-impact social post for product launches.','A high-impact social media post design for a product launch, dynamic lighting, bold typography, dramatic shadows, 3d product presentation','blurry, cluttered, low quality','Social Media Graphics','Bold','Midjourney','Intermediate','Premium'),
  ('Retro Streetwear Graphic','retro-streetwear-graphic','Vintage-inspired graphic for streetwear apparel.','A vintage retro-inspired streetwear graphic t-shirt design, 90s aesthetic, bold illustration, distressed texture, urban style','blurry, cluttered, low quality','T-Shirt & Apparel','Retro','Midjourney','Intermediate','Premium'),
  ('Minimal Typography Tee','minimal-typography-tee','Clean typography-focused t-shirt design.','A minimalist typography-focused t-shirt design, clean sans-serif text layout, modern and simple, streetwear minimalist fashion, white background','blurry, cluttered, low quality','T-Shirt & Apparel','Minimalist','DALL·E','Beginner','Free'),
  ('Graphic Band Tee Concept','graphic-band-tee-concept','Bold illustrated design inspired by band merch.','An edgy graphic band tee design, heavy metal music merchandise style, skull illustration, bold ink lines, distressed typography','blurry, cluttered, low quality','T-Shirt & Apparel','Edgy','Midjourney','Intermediate','Premium'),
  ('Surreal Fantasy Landscape','surreal-fantasy-landscape','Dreamlike illustrated landscape concept art.','A surreal and dreamlike fantasy landscape illustration, highly detailed, vibrant lighting, whimsical atmosphere, glowing nature elements','blurry, cluttered, low quality, muted colors','AI Art & Illustration','Surreal','Midjourney','Advanced','Premium'),
  ('Character Concept Sketch','character-concept-sketch','Stylized character design for games or branding.','A stylized character concept sketch, expressive features, fantasy game character design, clean line art with subtle shading, cinematic lighting','blurry, cluttered, low quality','AI Art & Illustration','Illustrative','Midjourney','Intermediate','Premium'),
  ('Vibrant Pop Art Portrait','vibrant-pop-art-portrait','Colorful pop-art style portrait illustration.','A vibrant colorful pop-art style portrait illustration, comic book style halftones, thick bold outlines, bright primary colors','blurry, cluttered, low quality','AI Art & Illustration','Pop Art','DALL·E','Beginner','Free'),
  ('Sale Banner Concept','sale-banner-concept','Attention-grabbing banner for promotions and sales.','An attention-grabbing sale promotional banner design, high contrast red and yellow colors, bold modern typography, discount badge, eye-catching composition','blurry, cluttered, low quality','Advertising & Marketing','Bold','Midjourney','Beginner','Free'),
  ('Brand Campaign Visual','brand-campaign-visual','Cohesive visual concept for a marketing campaign.','A cohesive modern marketing brand campaign visual, lifestyle photography integrated with graphic shapes, energetic and professional, soft natural lighting','blurry, cluttered, low quality','Advertising & Marketing','Modern','DALL·E','Intermediate','Premium'),
  ('Email Newsletter Header','email-newsletter-header','Clean header graphic for email marketing.','A clean and modern email newsletter header graphic, simple geometric composition, welcoming atmosphere, corporate communication style','blurry, cluttered, low quality','Advertising & Marketing','Clean','Midjourney','Beginner','Free')
) AS v(title, slug, description, prompt_text, negative_prompt, category, style, ai_tool, difficulty, access)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- STEP 5: Make the current logged-in user an admin
-- (Run this after signing into the app at least once)
-- ============================================================
-- First, ensure your user exists in profiles table:
INSERT INTO public.profiles (id, email, role)
SELECT id, email, 'admin'
FROM auth.users
ON CONFLICT (id) DO UPDATE SET role = 'admin';
