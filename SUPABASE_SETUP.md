# Supabase Setup Guide

## Overview
This project now uses Supabase as the backend for the campus community system. Follow these steps to set everything up.

## Prerequisites
- Supabase account (free at https://supabase.com)
- Supabase project created

## Step 1: Create Supabase Project
1. Go to https://supabase.com and sign up/log in
2. Create a new project or use an existing one
3. Note your **Project URL** and **Anon Key** (found in Settings > API)

## Step 2: Set Up Database Tables
1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Create a new query
4. Copy and paste the entire contents of `DATABASE_SCHEMA.sql`
5. Click **Run** to execute the schema

This will create:
- `users` table - stores user information
- `colleges` table - stores college information
- `memberships` table - tracks which users belong to which colleges
- `posts` table - stores community posts
- `events` table - stores college events

Plus all necessary indexes and Row Level Security (RLS) policies.

## Step 3: Configure Environment Variables
1. Copy `.env.local.example` to `.env.local`
2. Replace the values with your actual Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

## Step 4: Set Up Authentication (Optional but Recommended)
1. In Supabase, go to **Authentication > Providers**
2. Enable email/password or other providers you want
3. This allows users to sign up and log in

## Step 5: Test the Application
1. Run `npm install` to ensure all dependencies are installed
2. Run `npm run dev` to start the development server
3. Test creating colleges - they should now save to Supabase

## API Functions

### College Operations
Located in `src/lib/supabase.ts`:

```typescript
// Create a college (creator auto-added as CC)
collageApi.createCollege(name, userId)

// Get all colleges
collegeApi.getColleges()

// Get single college with related data
collegeApi.getCollege(collegeId)

// Join a college
collegeApi.joinCollege(userId, collegeId)

// Check if user is member
collegeApi.isMember(userId, collegeId)
```

### Post Operations
```typescript
// Create a post
postApi.createPost(collegeId, userId, content)

// Get posts for a college
postApi.getPostsByCollege(collegeId)
```

### Event Operations
```typescript
// Create an event
eventApi.createEvent(collegeId, title, description, date)

// Get events for a college
eventApi.getEventsByCollege(collegeId)
```

## Database Schema

### users
- `id` (UUID) - Primary key, linked to Supabase auth
- `name` (TEXT)
- `email` (TEXT, unique)
- `role` (TEXT) - admin, cc, member, visitor
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### colleges
- `id` (BIGSERIAL) - Primary key
- `name` (TEXT, unique)
- `created_by` (UUID) - References users.id
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### memberships
- `id` (BIGSERIAL) - Primary key
- `user_id` (UUID) - References users.id
- `college_id` (BIGINT) - References colleges.id
- `role` (TEXT) - 'cc' or 'member'
- `joined_at` (TIMESTAMP)
- Unique constraint on (user_id, college_id)

### posts
- `id` (BIGSERIAL) - Primary key
- `college_id` (BIGINT) - References colleges.id
- `user_id` (UUID) - References users.id
- `content` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### events
- `id` (BIGSERIAL) - Primary key
- `college_id` (BIGINT) - References colleges.id
- `title` (TEXT)
- `description` (TEXT)
- `date` (TIMESTAMP)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Important Notes

1. **Row Level Security (RLS)**: All tables have RLS enabled. This is important for security.
2. **Authentication**: The app uses Supabase Authentication. Users must be logged in to create colleges.
3. **Auto CC Addition**: When a user creates a college, they're automatically added as a Campus Coordinator (CC) member.
4. **No Server Folder**: The `/src/pages/server/` folder is no longer used.
5. **No Express/MongoDB**: All backend operations now go through Supabase client.

## Troubleshooting

### Issue: "VITE_SUPABASE_URL is not defined"
- Make sure `.env.local` exists and has the correct variables

### Issue: "Failed to load colleges"
- Check that the database tables are created correctly
- Verify your Supabase URL and Anon Key are correct
- Check browser console for detailed error messages

### Issue: "You must be logged in"
- Implement Supabase authentication or use the `setCurrentUserId` function with a test user ID

## Next Steps

1. Implement user authentication (login/signup) in the Login.tsx component
2. Add more features like posts, events, etc. using the API functions in supabase.ts
3. Set up more detailed user profiles if needed
4. Configure email notifications using Supabase functions
5. Set up storage for college banners and user avatars using Supabase Storage
