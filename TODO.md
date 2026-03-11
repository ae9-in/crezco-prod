# Convert TypeScript React Project to JavaScript

## Files to Convert (.tsx to .jsx)
- src/main.tsx -> src/main.jsx
- src/App.tsx -> src/App.jsx
- src/components/Footer.tsx -> src/components/Footer.jsx
- src/components/Navbar.tsx -> src/components/Navbar.jsx
- src/pages/Home.tsx -> src/pages/Home.jsx
- src/pages/Community.tsx -> src/pages/Community.jsx
- src/pages/Events.tsx -> src/pages/Events.jsx
- src/pages/EventDetail.tsx -> src/pages/EventDetail.jsx
- src/pages/Gigs.tsx -> src/pages/Gigs.jsx
- src/pages/Referrals.tsx -> src/pages/Referrals.jsx
- src/pages/Training.tsx -> src/pages/Training.jsx
- src/pages/Leaderboard.tsx -> src/pages/Leaderboard.jsx
- src/pages/Colleges.tsx -> src/pages/Colleges.jsx
- src/pages/Login.tsx -> src/pages/Login.jsx
- src/pages/Dashboard.tsx -> src/pages/Dashboard.jsx
- src/pages/Curious.tsx -> src/pages/Curious.jsx
- src/pages/StudentVerticals.tsx -> src/pages/StudentVerticals.jsx
- src/pages/BrandPromoter.tsx -> src/pages/BrandPromoter.jsx
- src/pages/BrandPromoterApplication.tsx -> src/pages/BrandPromoterApplication.jsx
- src/pages/CampusCoordinator.tsx -> src/pages/CampusCoordinator.jsx
- src/pages/Collab.tsx -> src/pages/Collab.jsx

## Steps
1. Convert each .tsx file to .jsx, removing TypeScript syntax
2. Update imports in App.jsx to use .jsx extensions
3. Update main.jsx to import App.jsx
4. Remove TypeScript config files (tsconfig.json, tsconfig.app.json, tsconfig.node.json, src/vite-env.d.ts)
5. Update package.json to remove TypeScript dependencies if not needed
6. Test the build and run
