# Supabase Authentication Guide

## Overview
The application now uses Supabase Authentication instead of custom login logic. Users can sign up and log in using email and password.

## Features Implemented

### Login Page (`src/pages/Login.tsx`)
- ✅ Email/password sign up form
- ✅ Email/password login form
- ✅ Form validation (email format, password match, minimum length)
- ✅ Error messages for failed auth attempts
- ✅ Loading states during auth operations
- ✅ Automatic redirect to dashboard after successful login
- ✅ Toggle between login and signup modes
- ✅ Demo credentials display for testing

### User Context (`src/context/UserRoleContext.tsx`)
- ✅ Tracks authenticated user from Supabase Auth
- ✅ Listens for auth state changes
- ✅ Restores session from localStorage on app load
- ✅ Provides logout functionality
- ✅ Stores user role information

## How Authentication Works

### Sign Up Flow
1. User enters email + password + confirm password
2. Submit → `supabase.auth.signUp(email, password)`
3. Supabase creates user account
4. Success message shown, user redirected to login
5. User can now log in with their credentials

### Login Flow
1. User enters email + password
2. Submit → `supabase.auth.signInWithPassword(email, password)`
3. Supabase verifies credentials
4. Session created and stored in localStorage
5. User redirected to dashboard
6. UserRoleContext detects auth state change

### Session Persistence
- On app load, `UserRoleProvider` checks for existing session
- If session exists, user stays logged in
- `onAuthStateChange` listener updates context on auth changes
- User can manually logout with `useUserRole().logout()`

## Using Authentication in Components

### Check if User is Logged In
```typescript
import { useUserRole } from '../context/UserRoleContext';

const MyComponent = () => {
  const { user, loading } = useUserRole();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;
  
  return <div>Welcome {user.email}</div>;
};
```

### Get User Email
```typescript
const { user } = useUserRole();
console.log(user?.email);
```

### Logout User
```typescript
const { logout } = useUserRole();
const handleLogout = async () => {
  await logout();
  navigate('/login');
};
```

### Check User Role
```typescript
const { userRole } = useUserRole();
if (userRole === 'admin') {
  // admin-only content
}
```

## Setting Up in Supabase

### 1. Enable Email Authentication
1. Go to Supabase Dashboard → Authentication
2. Click "Providers" tab
3. Ensure "Email" provider is enabled
4. Make sure "Confirm email" is disabled for development (optional)

### 2. Create Test User (Optional)
1. Dashboard → Authentication → Users
2. Click "Add user"
3. Enter email and password
4. User can now log in

### 3. Verify Configuration
- Check that VITE_SUPABASE_URL is set in `.env.local`
- Check that VITE_SUPABASE_ANON_KEY is set in `.env.local`

## Demo Credentials

For testing, use these demo credentials:
- Email: `demo@example.com`
- Password: `demo123`

(You'll need to create this user in Supabase first, or sign up through the app)

## Create a User in Database

After a user signs up with Supabase Auth, you may want to create a corresponding record in your `users` table:

```typescript
// In supabase.ts, add this function:
export const userApi = {
  async createUserProfile(userId: string, email: string, name: string) {
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          id: userId,
          email,
          name,
          role: 'member'
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
```

Then in Login.tsx after successful signup:
```typescript
const { user } = await supabase.auth.signUp({ email, password });
if (user?.id) {
  await userApi.createUserProfile(user.id, email, email.split('@')[0]);
}
```

## API Methods

All Supabase auth methods are available through the `supabase.auth` object:

```typescript
import { supabase } from '../lib/supabase';

// Sign up
await supabase.auth.signUp({ email, password });

// Sign in
await supabase.auth.signInWithPassword({ email, password });

// Sign out
await supabase.auth.signOut();

// Get current user
const { data } = await supabase.auth.getUser();

// Get session
const { data } = await supabase.auth.getSession();

// Listen for auth changes
const { data } = supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event);
});
```

## Security Best Practices

1. ✅ Using Supabase Auth (managed service)
2. ✅ Anon key is safe in frontend
3. ✅ Passwords never stored in localStorage
4. ✅ Session tokens managed by Supabase
5. ✅ Row Level Security (RLS) policies enforced on database

## Next Steps

1. Test sign up and login
2. Add profile completion page after signup
3. Add forgot password functionality
4. Add email verification
5. Add OAuth providers (Google, GitHub, etc.)
6. Create user profile records in `users` table on signup

## Common Issues

### "VITE_SUPABASE_URL is not defined"
- Create `.env.local` file
- Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart dev server

### "Invalid login credentials"
- Email or password incorrect
- User account doesn't exist
- User hasn't confirmed email (if email confirmation is enabled)

### "User already registered"
- Account with that email already exists
- Try logging in instead of signing up

### Session Not Persisting
- Check browser localStorage is enabled
- Check that `.env.local` has correct credentials
- Check browser console for errors
