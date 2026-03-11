# Quick Start: Test Supabase Authentication

## 🚀 Start the App

```bash
npm run dev
```

The app will start at `http://localhost:5173`

## 🧪 Test Sign Up

1. Navigate to http://localhost:5173/login
2. You should see a **"Create Account"** form
3. Enter:
   - **Full Name**: Test User
   - **Email**: testuser@example.com
   - **Password**: testpass123
   - **Confirm Password**: testpass123
4. Click **"Create Account"**
5. You should see: "Sign up successful! You can now log in."
6. Form should switch to login mode

## 🔑 Test Login

1. You're now in **"Login"** mode
2. Enter:
   - **Email**: testuser@example.com
   - **Password**: testpass123
3. Click **"Login"**
4. You should see: "Login successful! Redirecting..."
5. **IMPORTANT**: The page should redirect to `/dashboard`

## ✅ After Login - What to Check

1. **Navbar shows user email**
   - Top right should show: "testuser@example.com"
   - "Login" link should change to "Logout" button

2. **Can create colleges**
   - Go to /colleges
   - Create new college
   - Should appear in the list
   - You should be marked as a member

3. **Session persists**
   - Refresh the page → should still be logged in
   - Close and reopen browser → should still be logged in

4. **Logout works**
   - Click "Logout" button in navbar
   - Should redirect to /login
   - Page should refresh
   - Should be logged out

## 📊 Verify in Supabase Dashboard

1. Go to your Supabase dashboard
2. **Check Auth > Users**
   - Should see your test user email
   - Should show created_at timestamp

3. **Check Database > users table**
   - Should see a row with your user ID
   - Should have your email, name, and role='member'

## 🐛 If Something Doesn't Work

### "VITE_SUPABASE_URL is not defined"
- Create `.env.local` in project root
- Copy from `.env.local.example`
- Fill in your Supabase credentials
- Restart dev server

### "Can't sign up - email already in use"
- That email already has an account
- Try a different email
- Or delete the user from Supabase auth and try again

### "Login fails - invalid credentials"
- Check spelling of email
- Check spelling of password
- Make sure that email/password combo exists

### Page doesn't redirect to /dashboard after login
- Check browser console (F12) for errors
- Make sure `/dashboard` page exists and is accessible
- Check that UserRoleContext is properly imported in Login.tsx

### "Logout button doesn't appear"
- Make sure you're actually logged in
- Refresh the page
- Check browser console for errors

### Session not persisting after refresh
- Check .env.local has correct credentials
- Try clearing cookies and logging back in
- Check browser allows localStorage

## 📝 Testing Checklist

Use this to verify everything works:

- [ ] Can create account with sign up form
- [ ] Sign up shows success message
- [ ] Can log in with new account
- [ ] Login redirects to dashboard
- [ ] Navbar shows user email when logged in
- [ ] Can click logout button
- [ ] Logout redirects to login page
- [ ] Page still logged in after refresh
- [ ] Can create college while logged in
- [ ] College creator shows as member
- [ ] User appears in Supabase Auth users
- [ ] User profile created in users table
- [ ] Can log out and log back in again

## 🎯 Next Steps After Testing

1. **Create more test accounts** to test college invites
2. **Test creating colleges** and joining
3. **Update Dashboard.tsx** to show user's colleges
4. **Update CollegeDetail.tsx** to use auth
5. **Add more auth features**:
   - Forgot password
   - Email verification
   - Profile editing
   - OAuth (Google/GitHub)

## 💡 Pro Tips

1. **Save test emails you create**
   - demo1@test.com
   - demo2@test.com
   - etc.

2. **Test on mobile** by opening localhost on phone

3. **Test incognito mode** to verify no cached sessions

4. **Check browser Storage tab** to see session data

## 📞 Troubleshooting Resources

- [AUTH_GUIDE.md](AUTH_GUIDE.md) - Full authentication guide
- [AUTH_IMPLEMENTATION.md](AUTH_IMPLEMENTATION.md) - Implementation details
- [SUPABASE_SETUP.md](SUPABASE_SETUP.md) - Database setup

## ✨ Success Criteria

✅ Sign up → Create new account → Auto-login confirmed
✅ Login → Authenticate → Redirect to dashboard
✅ Logout → Clear session → Return to login
✅ Navbar → Shows user email → Has logout button
✅ Session → Persists on refresh → Survives reload
✅ Database → User profiles created → Auth linked

Once all ✅ are green, authentication is working!
