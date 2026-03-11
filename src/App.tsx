import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Curious from './pages/Curious';
import StudentVerticals from './pages/StudentVerticals';
import Collab from './pages/Collab';
import BrandPromoter from './pages/BrandPromoter';
import BrandPromoterApplication from './pages/BrandPromoterApplication';
import CampusCoordinator from './pages/CampusCoordinator';
import Community from './pages/Community';
import Events from './pages/Events';
import Gigs from './pages/Gigs';
import Referrals from './pages/Referrals';
import Leaderboard from './pages/Leaderboard';
import Colleges from './pages/Colleges';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import EventDetail from './pages/EventDetail';
import CollegeDetail from './pages/CollegeDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/curious" element={<Curious />} />
        <Route path="/student-verticals" element={<StudentVerticals />} />
        <Route path="/brand-promoter" element={<BrandPromoter />} />
        <Route path="/brand-promoter-application" element={<BrandPromoterApplication />} />
        <Route path="/collab" element={<Collab />} />
        <Route path="/campus-coordinator" element={<CampusCoordinator />} />
        <Route path="/community" element={<Community />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:eventId" element={<EventDetail />} />
        <Route path="/gigs" element={<Gigs />} />
        <Route path="/referrals" element={<Referrals />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/colleges" element={<Colleges />} />
        <Route path="/colleges/:collegeId" element={<CollegeDetail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
