-- =============================================
-- DOMISLINK EMPIRE - COMPLETE DATABASE SCHEMA
-- ONE DATABASE FOR ALL WORLDWIDE SERVICES
-- =============================================

-- =============================================
-- PART 1: CORE TABLES (Shared Across All Apps)
-- =============================================

-- User Profiles (Universal - Works Everywhere)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  whatsapp TEXT,
  avatar_url TEXT,
  user_type TEXT DEFAULT 'user' CHECK (user_type IN ('user', 'agent', 'provider', 'instructor', 'admin', 'superadmin')),
  wallet_balance DECIMAL(15, 2) DEFAULT 0,
  xp_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  is_verified BOOLEAN DEFAULT FALSE,
  preferred_language TEXT DEFAULT 'en',
  country TEXT,
  country_code TEXT,
  state TEXT,
  city TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  timezone TEXT,
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Universal Payments
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  paystack_reference TEXT UNIQUE,
  payment_type TEXT NOT NULL,
  service TEXT NOT NULL CHECK (service IN ('realestate', 'tickets', 'flightmonitor', 'teachmaster', 'driving', 'wallet')),
  item_id UUID,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'refunded')),
  commission DECIMAL(15, 2) DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wallet Transactions
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
  description TEXT NOT NULL,
  service TEXT NOT NULL,
  balance_after DECIMAL(15, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PART 2: GEOLOCATION & COMMUNITIES (Worldwide)
-- =============================================

-- Countries
CREATE TABLE IF NOT EXISTS public.countries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  dial_code TEXT,
  currency TEXT,
  currency_symbol TEXT,
  flag_emoji TEXT,
  languages TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE
);

-- Regions/States
CREATE TABLE IF NOT EXISTS public.regions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  country_id UUID REFERENCES public.countries(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  code TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(country_id, name)
);

-- Cities
CREATE TABLE IF NOT EXISTS public.cities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  region_id UUID REFERENCES public.regions(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  population INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(region_id, name)
);

-- Communities (AI Auto-Created & Moderated)
CREATE TABLE IF NOT EXISTS public.communities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  type TEXT DEFAULT 'neighborhood' CHECK (type IN ('neighborhood', 'hamlet', 'district', 'suburb', 'village', 'town', 'zone')),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  boundaries JSONB,
  cover_image TEXT,
  ai_moderator_personality TEXT DEFAULT 'friendly',
  member_count INTEGER DEFAULT 0,
  listing_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(city_id, name)
);

-- Community Members
CREATE TABLE IF NOT EXISTS public.community_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(community_id, user_id)
);

-- Community Board Posts (AI Moderated)
CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  post_type TEXT DEFAULT 'discussion' CHECK (post_type IN ('discussion', 'announcement', 'question', 'event', 'advert')),
  images JSONB DEFAULT '[]',
  is_pinned BOOLEAN DEFAULT FALSE,
  is_ai_generated BOOLEAN DEFAULT FALSE,
  ai_moderation_status TEXT DEFAULT 'approved',
  likes INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ,
  delete_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Community Comments
CREATE TABLE IF NOT EXISTS public.community_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_ai_response BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PART 3: REAL ESTATE (Worldwide Community-Based)
-- =============================================

-- Property Listings
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  community_id UUID REFERENCES public.communities(id),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT NOT NULL,
  ai_description TEXT,
  property_type TEXT NOT NULL,
  listing_type TEXT NOT NULL CHECK (listing_type IN ('sale', 'rent', 'shortlet', 'lease')),
  price DECIMAL(15, 2) NOT NULL,
  price_negotiable BOOLEAN DEFAULT TRUE,
  price_period TEXT,
  currency TEXT DEFAULT 'USD',
  country TEXT NOT NULL,
  country_code TEXT,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  area TEXT,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  bedrooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  toilets INTEGER DEFAULT 0,
  parking_spaces INTEGER DEFAULT 0,
  size_sqm DECIMAL(10, 2),
  furnishing TEXT,
  amenities JSONB DEFAULT '[]',
  images JSONB DEFAULT '[]',
  video_url TEXT,
  virtual_tour_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'sold', 'rented', 'expired', 'rejected', 'archived')),
  is_featured BOOLEAN DEFAULT FALSE,
  featured_until TIMESTAMPTZ,
  views INTEGER DEFAULT 0,
  inquiries INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ,
  delete_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto Archive & Delete Function
CREATE OR REPLACE FUNCTION auto_archive_and_delete_listings()
RETURNS void AS $$
BEGIN
  -- Archive expired listings after 2 hours
  UPDATE public.listings 
  SET status = 'archived', archived_at = NOW(), delete_at = NOW() + INTERVAL '14 days'
  WHERE expires_at < NOW() - INTERVAL '2 hours' 
  AND status = 'active';
  
  -- Delete archived listings after 14 days
  DELETE FROM public.listings 
  WHERE delete_at < NOW() AND status = 'archived';
  
  -- Same for community posts
  UPDATE public.community_posts 
  SET archived_at = NOW(), delete_at = NOW() + INTERVAL '14 days'
  WHERE expires_at < NOW() - INTERVAL '2 hours' 
  AND archived_at IS NULL;
  
  DELETE FROM public.community_posts 
  WHERE delete_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Service Providers (Community-Based)
CREATE TABLE IF NOT EXISTS public.service_providers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  community_id UUID REFERENCES public.communities(id),
  business_name TEXT NOT NULL,
  slug TEXT UNIQUE,
  category TEXT NOT NULL,
  description TEXT,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  email TEXT,
  website TEXT,
  country TEXT NOT NULL,
  country_code TEXT,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  logo_url TEXT,
  images JSONB DEFAULT '[]',
  services_offered JSONB DEFAULT '[]',
  operating_hours JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending',
  is_verified BOOLEAN DEFAULT FALSE,
  rating DECIMAL(2, 1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ,
  delete_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alert Subscriptions
CREATE TABLE IF NOT EXISTS public.alert_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  community_ids UUID[] DEFAULT '{}',
  property_types TEXT[],
  listing_types TEXT[],
  min_price DECIMAL(15, 2),
  max_price DECIMAL(15, 2),
  currency TEXT,
  notify_email BOOLEAN DEFAULT TRUE,
  notify_sms BOOLEAN DEFAULT FALSE,
  notify_whatsapp BOOLEAN DEFAULT FALSE,
  notify_telegram BOOLEAN DEFAULT FALSE,
  frequency TEXT DEFAULT '12h',
  status TEXT DEFAULT 'active',
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PART 4: TICKETS (Flight Booking)
-- =============================================

-- Airlines
CREATE TABLE IF NOT EXISTS public.airlines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  type TEXT CHECK (type IN ('international', 'national', 'regional', 'charter')),
  country TEXT,
  website TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

-- Flight Bookings
CREATE TABLE IF NOT EXISTS public.flight_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  booking_reference TEXT UNIQUE NOT NULL,
  external_booking_id TEXT,
  departure_city TEXT NOT NULL,
  departure_code TEXT NOT NULL,
  departure_country TEXT,
  arrival_city TEXT NOT NULL,
  arrival_code TEXT NOT NULL,
  arrival_country TEXT,
  departure_date DATE NOT NULL,
  departure_time TIME,
  arrival_date DATE,
  arrival_time TIME,
  return_date DATE,
  return_time TIME,
  airline_code TEXT,
  flight_number TEXT,
  passengers INTEGER NOT NULL DEFAULT 1,
  cabin_class TEXT DEFAULT 'economy',
  ticket_price DECIMAL(15, 2) NOT NULL,
  total_price DECIMAL(15, 2) NOT NULL,
  commission DECIMAL(15, 2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'refunded')),
  flight_details JSONB DEFAULT '{}',
  passenger_details JSONB DEFAULT '[]',
  payment_id UUID REFERENCES public.payments(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Live Fare Cache (For Scrolling Display)
CREATE TABLE IF NOT EXISTS public.live_fares (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  departure_code TEXT NOT NULL,
  arrival_code TEXT NOT NULL,
  departure_city TEXT,
  arrival_city TEXT,
  airline_code TEXT,
  price DECIMAL(15, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  cabin_class TEXT DEFAULT 'economy',
  departure_date DATE,
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '1 hour'
);

-- =============================================
-- PART 5: FLIGHT MONITOR (Tracking & Forums)
-- =============================================

-- Tracked Flights
CREATE TABLE IF NOT EXISTS public.tracked_flights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  flight_number TEXT NOT NULL,
  airline_code TEXT,
  departure_code TEXT NOT NULL,
  arrival_code TEXT NOT NULL,
  scheduled_departure TIMESTAMPTZ,
  scheduled_arrival TIMESTAMPTZ,
  actual_departure TIMESTAMPTZ,
  actual_arrival TIMESTAMPTZ,
  status TEXT DEFAULT 'scheduled',
  gate TEXT,
  terminal TEXT,
  aircraft_type TEXT,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Airline Forums (Controversy Central!)
CREATE TABLE IF NOT EXISTS public.airline_forums (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  airline_id UUID REFERENCES public.airlines(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  member_count INTEGER DEFAULT 0,
  post_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Airline Forum Posts
CREATE TABLE IF NOT EXISTS public.airline_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  forum_id UUID REFERENCES public.airline_forums(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  post_type TEXT DEFAULT 'discussion' CHECK (post_type IN ('discussion', 'review', 'complaint', 'question', 'news')),
  images JSONB DEFAULT '[]',
  is_controversial BOOLEAN DEFAULT FALSE,
  is_pinned BOOLEAN DEFAULT FALSE,
  likes INTEGER DEFAULT 0,
  dislikes INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  ai_moderation_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Airline Post Comments
CREATE TABLE IF NOT EXISTS public.airline_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.airline_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PART 6: TEACHMASTER (Gamified Learning)
-- =============================================

-- AI Tutor Characters
CREATE TABLE IF NOT EXISTS public.ai_characters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  personality TEXT NOT NULL,
  teaching_style TEXT,
  avatar_url TEXT,
  voice_style TEXT,
  catchphrases JSONB DEFAULT '[]',
  subjects TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT ARRAY['en'],
  unlock_level INTEGER DEFAULT 1,
  unlock_xp INTEGER DEFAULT 0,
  is_premium BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  system_prompt TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subjects
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  exam_types TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE
);

-- Courses
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id UUID REFERENCES public.subjects(id),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  level TEXT CHECK (level IN ('JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3', 'JAMB')),
  exam_type TEXT,
  curriculum TEXT DEFAULT 'WAEC',
  price DECIMAL(10, 2) DEFAULT 0,
  is_free BOOLEAN DEFAULT TRUE,
  thumbnail_url TEXT,
  total_lessons INTEGER DEFAULT 0,
  total_duration_mins INTEGER DEFAULT 0,
  xp_reward INTEGER DEFAULT 100,
  enrolled_count INTEGER DEFAULT 0,
  rating DECIMAL(2, 1) DEFAULT 0,
  status TEXT DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lessons
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content_type TEXT DEFAULT 'video' CHECK (content_type IN ('video', 'text', 'interactive', 'quiz')),
  content_url TEXT,
  content_text TEXT,
  duration_mins INTEGER DEFAULT 0,
  order_index INTEGER DEFAULT 0,
  xp_reward INTEGER DEFAULT 10,
  is_free_preview BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Flash Cards (Spaced Repetition)
CREATE TABLE IF NOT EXISTS public.flashcards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  explanation TEXT,
  difficulty INTEGER DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 5),
  tags JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Flashcard Progress (Spaced Repetition)
CREATE TABLE IF NOT EXISTS public.flashcard_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  flashcard_id UUID REFERENCES public.flashcards(id) ON DELETE CASCADE NOT NULL,
  ease_factor DECIMAL(3, 2) DEFAULT 2.5,
  interval_days INTEGER DEFAULT 1,
  repetitions INTEGER DEFAULT 0,
  next_review TIMESTAMPTZ DEFAULT NOW(),
  last_reviewed TIMESTAMPTZ,
  UNIQUE(user_id, flashcard_id)
);

-- Quizzes & Mock Exams
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id),
  title TEXT NOT NULL,
  quiz_type TEXT DEFAULT 'practice' CHECK (quiz_type IN ('practice', 'mock_exam', 'challenge', 'battle')),
  exam_type TEXT,
  year INTEGER,
  duration_mins INTEGER DEFAULT 60,
  total_questions INTEGER DEFAULT 0,
  pass_mark INTEGER DEFAULT 50,
  xp_reward INTEGER DEFAULT 50,
  questions JSONB DEFAULT '[]',
  status TEXT DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quiz Attempts
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
  character_id UUID REFERENCES public.ai_characters(id),
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  percentage DECIMAL(5, 2) NOT NULL,
  passed BOOLEAN DEFAULT FALSE,
  xp_earned INTEGER DEFAULT 0,
  time_taken_secs INTEGER,
  answers JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enrollments
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  progress_percent INTEGER DEFAULT 0,
  completed_lessons UUID[] DEFAULT '{}',
  xp_earned INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, course_id)
);

-- Gamification: Achievements/Badges
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  category TEXT,
  xp_reward INTEGER DEFAULT 0,
  requirement_type TEXT,
  requirement_value INTEGER,
  is_secret BOOLEAN DEFAULT FALSE
);

-- User Achievements
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Gamification: Streaks
CREATE TABLE IF NOT EXISTS public.user_streaks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  streak_freezes INTEGER DEFAULT 0
);

-- Gamification: Leaderboards
CREATE TABLE IF NOT EXISTS public.leaderboard_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  period TEXT NOT NULL CHECK (period IN ('daily', 'weekly', 'monthly', 'alltime')),
  category TEXT DEFAULT 'xp',
  score INTEGER DEFAULT 0,
  rank INTEGER,
  period_start DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, period, category, period_start)
);

-- Study Squads (Teams)
CREATE TABLE IF NOT EXISTS public.study_squads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT,
  leader_id UUID REFERENCES public.profiles(id),
  total_xp INTEGER DEFAULT 0,
  member_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Squad Members
CREATE TABLE IF NOT EXISTS public.squad_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  squad_id UUID REFERENCES public.study_squads(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member',
  xp_contributed INTEGER DEFAULT 0,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(squad_id, user_id)
);

-- =============================================
-- PART 7: ADMIN AI BUILDER
-- =============================================

-- AI Build Sessions
CREATE TABLE IF NOT EXISTS public.ai_build_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  conversation JSONB DEFAULT '[]',
  files_created JSONB DEFAULT '[]',
  files_modified JSONB DEFAULT '[]',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Knowledge Base (Trained on DomisLink)
CREATE TABLE IF NOT EXISTS public.ai_knowledge_base (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags JSONB DEFAULT '[]',
  source TEXT,
  embedding VECTOR(1536),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- System Configurations
CREATE TABLE IF NOT EXISTS public.system_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES public.profiles(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PART 8: INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_profiles_country ON public.profiles(country_code);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON public.profiles(country, state, city);
CREATE INDEX IF NOT EXISTS idx_communities_city ON public.communities(city_id);
CREATE INDEX IF NOT EXISTS idx_communities_location ON public.communities(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_listings_community ON public.listings(community_id);
CREATE INDEX IF NOT EXISTS idx_listings_location ON public.listings(country_code, state, city);
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_expires ON public.listings(expires_at);
CREATE INDEX IF NOT EXISTS idx_providers_community ON public.service_providers(community_id);
CREATE INDEX IF NOT EXISTS idx_providers_category ON public.service_providers(category);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON public.flight_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_live_fares_route ON public.live_fares(departure_code, arrival_code);
CREATE INDEX IF NOT EXISTS idx_courses_level ON public.courses(level, exam_type);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON public.enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON public.quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_period ON public.leaderboard_entries(period, category, period_start);

-- =============================================
-- PART 9: ROW LEVEL SECURITY
-- =============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flight_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_build_sessions ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies
CREATE POLICY "Public profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users see own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create payments" ON public.payments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Active listings visible" ON public.listings FOR SELECT USING (status = 'active' OR user_id = auth.uid());
CREATE POLICY "Users manage own listings" ON public.listings FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Active providers visible" ON public.service_providers FOR SELECT USING (status = 'active' OR user_id = auth.uid());
CREATE POLICY "Users manage own providers" ON public.service_providers FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users see own bookings" ON public.flight_bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create bookings" ON public.flight_bookings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users see own enrollments" ON public.enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users manage enrollments" ON public.enrollments FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users see own attempts" ON public.quiz_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create attempts" ON public.quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin only for AI Builder
CREATE POLICY "Admins only build sessions" ON public.ai_build_sessions FOR ALL 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND user_type IN ('admin', 'superadmin')));

-- =============================================
-- DONE! Full Empire Database Ready
-- =============================================
