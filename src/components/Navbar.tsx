import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Bell } from 'lucide-react';
import { useUserRole } from '../context/UserRoleContext';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../lib/api';

interface Notification {
  id: string;
  _id?: string;
  user_id: string;
  actor_id: string;
  type: 'like' | 'comment' | 'join';
  entity_id: string | number;
  read: boolean;
  created_at: string;
  actor?: { name: string };
  actor_id_populated?: { name: string }; // Handle different population formats
}

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const navigate = useNavigate();
  const { user, logout } = useUserRole();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
    setIsNotifOpen(false);
  };

  const fetchNotifs = async () => {
    if (!user) return;
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  useEffect(() => {
    if (!user) return;

    fetchNotifs();

    // Poll for new notifications every 30 seconds instead of Supabase Realtime
    const interval = setInterval(fetchNotifs, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navLinks = [
    { to: "/", label: "Home", color: "pink" },
    { to: "/curious", label: "About", color: "blue" },
    {
      to: "/community", label: "Community", color: "pink", dropdown: [
        { to: "/community", label: "Community Feed" }
      ]
    },
    {
      to: "/gigs", label: "Opportunities", color: "purple", dropdown: [
        { to: "/events", label: "Events" },
        { to: "/gigs", label: "Gigs" },
        { to: "/referrals", label: "Referrals" }
      ]
    },
    {
      to: "/campus-coordinator", label: "Campus", color: "pink", dropdown: [
        { to: "/campus-coordinator", label: "Campus Coordinator" },
        { to: "/dashboard", label: "Dashboard" }
      ]
    },
    { to: "/leaderboard", label: "Rankings", color: "purple" },
    { to: "/colleges", label: "Colleges", color: "pink" },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'pink':
        return 'hover:text-[#FF2BCD]';
      case 'blue':
        return 'hover:text-[#32F5FF]';
      case 'purple':
        return 'hover:text-[#8A2FFF]';
      default:
        return 'hover:text-[#FF2BCD]';
    }
  };

  const getGlowClass = (color: string) => {
    switch (color) {
      case 'pink':
        return 'group-hover:neon-glow-pink';
      case 'blue':
        return 'group-hover:neon-glow-blue';
      case 'purple':
        return 'group-hover:neon-glow-purple';
      default:
        return 'group-hover:neon-glow-pink';
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#05070A]/80 backdrop-blur-md border-b border-[#FF2BCD]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <img
              src="/crescologo.png"
              alt="Crezco Logo"
              className="w-10 h-10 object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link, index) => (
              <div key={index} className="relative group pb-4">
                <Link
                  to={link.to}
                  className={`text-gray-300 ${getColorClasses(link.color)} transition-colors duration-300 font-medium group`}
                >
                  <span className={getGlowClass(link.color)}>
                    {link.label}
                  </span>
                </Link>
                {link.dropdown && (
                  <div className="absolute left-0 mt-2 bg-[#0B0F1A] border border-[#2EE5FF]/30 rounded-xl shadow-[0_0_20px_rgba(46,229,255,0.3)] overflow-hidden z-50 w-48 hidden group-hover:block">
                    <div className="px-3 py-4 space-y-2">
                      {link.dropdown.map((item, idx) => (
                        <Link
                          key={idx}
                          to={item.to}
                          className="block px-4 py-2 text-gray-300 hover:text-[#FF2BCD] hover:bg-[#1A1F2E] rounded-lg transition-all duration-300 font-medium"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Login/User Menu */}
          <div className="hidden md:block">
            {user ? (
              <div className="flex items-center space-x-6">
                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    className="text-gray-300 hover:text-[#32F5FF] transition-all relative p-1"
                  >
                    <Bell size={20} className={unreadCount > 0 ? "animate-pulse text-[#32F5FF]" : ""} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#FF2BCD] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-[0_0_10px_rgba(255,43,205,0.5)]">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {isNotifOpen && (
                    <div className="absolute right-0 mt-3 w-80 bg-[#0B0F1A] border border-[#32F5FF]/30 rounded-xl shadow-[0_0_30px_rgba(50,245,255,0.2)] overflow-hidden z-[60]">
                      <div className="p-4 border-b border-[#32F5FF]/20 flex justify-between items-center bg-[#0D111D]">
                        <h3 className="text-white font-bold">Notifications</h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={async () => {
                              try {
                                await markAllNotificationsRead();
                                setNotifications((prev: Notification[]) => prev.map((n: Notification) => ({ ...n, read: true })));
                              } catch (err) {
                                console.error('Failed to mark all as read:', err);
                              }
                            }}
                            className="text-xs text-[#32F5FF] hover:text-[#FF2BCD] transition-colors"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notif) => (
                            <div
                              key={notif._id || notif.id}
                              onClick={async () => {
                                if (!notif.read) {
                                  try {
                                    await markNotificationRead(notif._id || notif.id);
                                    setNotifications((prev: Notification[]) => prev.map((n: Notification) => (n._id || n.id) === (notif._id || notif.id) ? { ...n, read: true } : n));
                                  } catch (err) {
                                    console.error('Failed to mark as read:', err);
                                  }
                                }
                                // Navigate based on type
                                if (notif.type === 'join') navigate('/campus-coordinator');
                                else navigate('/community');
                                setIsNotifOpen(false);
                              }}
                              className={`p-4 border-b border-[#32F5FF]/10 hover:bg-[#1A1F2E] cursor-pointer transition-colors ${!notif.read ? 'bg-[#32F5FF]/5' : ''}`}
                            >
                              <div className="flex items-start space-x-3">
                                <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${!notif.read ? 'bg-[#FF2BCD] shadow-[0_0_5px_#FF2BCD]' : 'bg-transparent'}`} />
                                <div>
                                  <p className="text-sm text-gray-200">
                                    <span className="font-bold text-[#32F5FF]">{notif.actor?.name || notif.actor_id_populated?.name || 'Someone'}</span>
                                    {notif.type === 'like' && ' liked your post'}
                                    {notif.type === 'comment' && ' commented on your post'}
                                    {notif.type === 'join' && ' joined your college community'}
                                  </p>
                                  <p className="text-[10px] text-gray-500 mt-1">
                                    {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(notif.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-8 text-center text-gray-500 text-sm">
                            No notifications yet
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-gray-300 text-sm hidden lg:inline">{user.email}</span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-300 hover:text-[#FF2BCD] transition-colors duration-300 font-medium group"
                  >
                    <span className="group-hover:neon-glow-pink">Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-gray-300 hover:text-[#32F5FF] transition-colors duration-300 font-medium group"
              >
                <span className="group-hover:neon-glow-blue">Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 hover:text-[#FF2BCD]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#05070A] border-b border-[#FF2BCD]/30">
          <div className="px-4 py-4 space-y-4">
            {navLinks.map((link, index) => (
              <div key={index}>
                <Link
                  to={link.to}
                  className={`block text-gray-300 ${getColorClasses(link.color)} transition-colors duration-300 font-medium py-2`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
                {link.dropdown && (
                  <div className="pl-4 space-y-2 border-l border-[#2EE5FF]/30 ml-2">
                    {link.dropdown.map((item, idx) => (
                      <Link
                        key={idx}
                        to={item.to}
                        className="block text-gray-400 hover:text-[#FF2BCD] transition-colors duration-300 py-1"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {user ? (
              <div className="border-t border-[#2EE5FF]/30 mt-4 pt-4">
                <p className="text-gray-300 text-sm mb-3">{user.email}</p>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-gray-300 hover:text-[#FF2BCD] transition-colors duration-300 font-medium py-2"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="block text-gray-300 hover:text-[#32F5FF] transition-colors duration-300 font-medium py-2 border-t border-[#2EE5FF]/30 mt-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
