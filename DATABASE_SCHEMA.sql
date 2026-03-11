-- Supabase Database Schema for Campus Community System
-- Run these SQL queries in your Supabase SQL Editor

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT CHECK (role IN ('admin', 'cc', 'member', 'visitor')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Colleges Table
CREATE TABLE IF NOT EXISTS colleges (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Memberships Table (users in colleges)
CREATE TABLE IF NOT EXISTS memberships (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  college_id BIGINT NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('cc', 'member')),
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, college_id)
);

-- 4. Posts Table
CREATE TABLE IF NOT EXISTS posts (
  id BIGSERIAL PRIMARY KEY,
  college_id BIGINT NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. Events Table
CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,
  college_id BIGINT NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_colleges_created_by ON colleges(created_by);
CREATE INDEX IF NOT EXISTS idx_memberships_user_id ON memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_college_id ON memberships(college_id);
CREATE INDEX IF NOT EXISTS idx_posts_college_id ON posts(college_id);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_events_college_id ON events(college_id);

-- Enable Row Level Security (RLS)
-- These policies ensure users can only see and access data they should have access to
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view all users" ON users FOR SELECT USING (true);
-- CRITICAL: Without this INSERT policy, new user profile creation on signup will fail!
CREATE POLICY "Users can insert their own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for colleges table
CREATE POLICY "Anyone can view colleges" ON colleges FOR SELECT USING (true);
CREATE POLICY "create college" ON colleges FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "College creator can update their college" ON colleges FOR UPDATE USING (created_by = auth.uid());

-- RLS Policies for memberships table
CREATE POLICY "Users can view memberships" ON memberships FOR SELECT USING (true);
CREATE POLICY "Authenticated users can join colleges" ON memberships FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND user_id = auth.uid());

-- RLS Policies for posts table
CREATE POLICY "Anyone can view posts" ON posts FOR SELECT USING (true);
CREATE POLICY "College members can create posts" ON posts FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND
  user_id = auth.uid() AND
  EXISTS (SELECT 1 FROM memberships WHERE memberships.user_id = auth.uid() AND memberships.college_id = posts.college_id)
);

-- RLS Policies for events table
CREATE POLICY "Anyone can view events" ON events FOR SELECT USING (true);
CREATE POLICY "College CCs can create events" ON events FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND
  EXISTS (SELECT 1 FROM memberships WHERE memberships.user_id = auth.uid() AND memberships.college_id = events.college_id AND memberships.role = 'cc')
);
CREATE POLICY "College CCs can delete events" ON events FOR DELETE USING (
  EXISTS (SELECT 1 FROM memberships WHERE memberships.user_id = auth.uid() AND memberships.college_id = events.college_id AND memberships.role = 'cc')
);

-- 6. Likes Table
CREATE TABLE IF NOT EXISTS likes (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id BIGINT NOT NULL, -- id of post or reel
  item_type TEXT NOT NULL CHECK (item_type IN ('post', 'reel')),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, item_id, item_type)
);

-- 7. Comments Table
CREATE TABLE IF NOT EXISTS comments (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id BIGINT NOT NULL, -- id of post or reel
  item_type TEXT NOT NULL CHECK (item_type IN ('post', 'reel')),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- RLS for likes
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view likes" ON likes FOR SELECT USING (true);
CREATE POLICY "Logged in users can toggle their own likes" ON likes FOR ALL USING (auth.uid() = user_id);

-- RLS for comments
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Logged in users can manage their own comments" ON comments FOR ALL USING (auth.uid() = user_id);

-- 8. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  actor_id UUID NOT NULL CONSTRAINT notifications_actor_id_fkey REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('like', 'comment', 'join')),
  entity_id TEXT NOT NULL, -- UUID or BIGINT as string
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
-- Allow system/users to insert notifications (simplified for this app)
CREATE POLICY "Anyone can insert notifications" ON notifications FOR INSERT WITH CHECK (true);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(user_id) WHERE read = false;
