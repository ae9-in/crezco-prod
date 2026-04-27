import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Bell, ChevronDown, LogOut, User, Settings, Info, Users, Briefcase, GraduationCap, Award, School } from 'lucide-react';
import { useUserRole } from '../context/UserRoleContext';
import { notificationApi } from '../lib/supabase';

export default function Navbar() {
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const [isNotifOpen, setIsNotifOpen] = useState(false);
   const [notifications, setNotifications] = useState([]);
   const [activeDropdown, setActiveDropdown] = useState(null);
   const [isScrolled, setIsScrolled] = useState(false);

   const navigate = useNavigate();
   const location = useLocation();
   const { user, logout } = useUserRole();
   const notifRef = useRef(null);

   useEffect(() => {
      const handleScroll = () => {
         setIsScrolled(window.scrollY > 20);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
   }, []);

   useEffect(() => {
      const handleClickOutside = (event) => {
         if (notifRef.current && !notifRef.current.contains(event.target)) {
            setIsNotifOpen(false);
         }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
   }, []);

   useEffect(() => {
      setIsMobileMenuOpen(false);
      setActiveDropdown(null);
   }, [location]);

   const handleLogout = () => {
      logout();
      navigate('/login');
      setIsMobileMenuOpen(false);
      setIsNotifOpen(false);
   };

   const fetchNotifs = async () => {
      if (!user) return;
      try {
         const data = await notificationApi.getNotifications(user.id);
         setNotifications(data);
      } catch (err) {
         console.error('Failed to fetch notifications:', err);
      }
   };

   useEffect(() => {
      if (!user) return;
      fetchNotifs();
      const interval = setInterval(fetchNotifs, 30000);
      return () => clearInterval(interval);
   }, [user]);

   const unreadCount = notifications.filter(n => !n.read).length;

   const navLinks = [
      { to: "/", label: "Home", color: "pink", icon: <Info size={18} /> },
      { to: "/curious", label: "About", color: "blue", icon: <Info size={18} /> },
      {
         to: "/community", label: "Community", color: "pink", icon: <Users size={18} />,
         dropdown: [
            { to: "/community", label: "Community Feed", icon: <Users size={16} /> }
         ]
      },
      {
         to: "/gigs", label: "Opportunities", color: "purple", icon: <Briefcase size={18} />,
         dropdown: [
            { to: "/events", label: "Events", icon: <Award size={16} /> },
            { to: "/gigs", label: "Gigs", icon: <Briefcase size={16} /> },
            { to: "/referrals", label: "Referrals", icon: <Users size={16} /> }
         ]
      },
      {
         to: "/campus-coordinator", label: "Campus", color: "pink", icon: <GraduationCap size={18} />,
         dropdown: [
            { to: "/campus-coordinator", label: "Campus Coordinator", icon: <User size={16} /> },
            { to: "/dashboard", label: "Dashboard", icon: <Settings size={16} /> }
         ]
      },
      { to: "/leaderboard", label: "Rankings", color: "purple", icon: <Award size={18} /> },
      { to: "/colleges", label: "Colleges", color: "pink", icon: <School size={18} /> },
   ];

   const getGlowClass = (color) => {
      switch (color) {
         case 'pink': return 'group-hover:neon-glow-pink';
         case 'blue': return 'group-hover:neon-glow-blue';
         case 'purple': return 'group-hover:neon-glow-purple';
         default: return 'group-hover:neon-glow-pink';
      }
   };

   const getActiveBorder = (to, color) => {
      if (location.pathname === to) {
         switch (color) {
            case 'pink': return 'border-b-2 border-[#FF2BCD] text-[#FF2BCD]';
            case 'blue': return 'border-b-2 border-[#32F5FF] text-[#32F5FF]';
            case 'purple': return 'border-b-2 border-[#8A2FFF] text-[#8A2FFF]';
            default: return 'border-b-2 border-[#FF2BCD] text-[#FF2BCD]';
         }
      }
      return 'border-b-2 border-transparent text-gray-300';
   };

   return (
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#05070A]/90 backdrop-blur-xl border-b border-[#FF2BCD]/30 shadow-[0_4px_30px_rgba(255,43,205,0.1)]' : 'bg-transparent'}`}>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
               <Link to="/" className="flex items-center space-x-3 group relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-[#FF2BCD] to-[#32F5FF] rounded-full blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                  <img
                     src="/crescologo.png"
                     alt="Crezco Logo"
                     className="w-12 h-12 object-contain transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110"
                  />
                  <span className="font-black tracking-tighter text-2xl bg-gradient-to-r from-[#FF2BCD] to-[#32F5FF] bg-clip-text text-transparent">Crezco</span>
               </Link>

               <div className="hidden lg:flex items-center space-x-1">
                  {navLinks.map((link, index) => (
                     <div key={index} className="relative group px-1">
                        <div className="relative">
                           <Link
                              to={link.to}
                              onMouseEnter={() => setActiveDropdown(link.label)}
                              className={`flex items-center space-x-1 px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-lg hover:bg-white/5 ${getActiveBorder(link.to, link.color)} group`}
                           >
                              <span className={getGlowClass(link.color)}>
                                 {link.label}
                              </span>
                              {link.dropdown && <ChevronDown size={14} className="ml-1 opacity-50 group-hover:rotate-180 transition-transform duration-300" />}
                           </Link>

                           {link.dropdown && (
                              <div className="absolute left-0 mt-1 w-56 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                                 <div className="bg-[#0B0F1A]/95 backdrop-blur-xl border border-[#2EE5FF]/20 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(46,229,255,0.1)] overflow-hidden p-2 mt-2">
                                    {link.dropdown.map((item, idx) => (
                                       <Link
                                          key={idx}
                                          to={item.to}
                                          className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-[#FF2BCD]/20 hover:to-[#8A2FFF]/20 rounded-lg transition-all duration-300"
                                       >
                                          <span className="p-1.5 rounded-md bg-white/5 text-[#32F5FF]">{item.icon}</span>
                                          <span className="font-medium">{item.label}</span>
                                       </Link>
                                    ))}
                                 </div>
                              </div>
                           )}
                        </div>
                     </div>
                  ))}
               </div>

               <div className="flex items-center space-x-3 sm:space-x-6">
                  {user ? (
                     <>
                        <div className="relative" ref={notifRef}>
                           <button
                              onClick={() => setIsNotifOpen(!isNotifOpen)}
                              className={`relative p-2 rounded-full transition-all duration-300 ${isNotifOpen ? 'bg-[#32F5FF]/10 text-[#32F5FF]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                           >
                              <Bell size={22} className={unreadCount > 0 ? "animate-bounce" : ""} />
                              {unreadCount > 0 && (
                                 <span className="absolute top-1.5 right-1.5 flex h-4 w-4">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF2BCD] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-[#FF2BCD] text-[10px] font-bold text-white items-center justify-center shadow-[0_0_10px_rgba(255,43,205,0.8)]">
                                       {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                 </span>
                              )}
                           </button>

                           {isNotifOpen && (
                              <div className="absolute right-0 mt-4 w-80 sm:w-96 bg-[#0B0F1A]/95 backdrop-blur-2xl border border-[#32F5FF]/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden z-[60] origin-top-right animate-in fade-in zoom-in duration-200">
                                 <div className="p-5 border-b border-[#32F5FF]/20 flex justify-between items-center bg-gradient-to-r from-[#0D111D] to-[#161B2A]">
                                    <div>
                                       <h3 className="text-white font-bold text-lg">Notifications</h3>
                                       <p className="text-xs text-gray-400 mt-1">You have {unreadCount} unread messages</p>
                                    </div>
                                    {unreadCount > 0 && (
                                       <button
                                          onClick={async () => {
                                             try {
                                                await notificationApi.markAllNotificationsRead(user.id);
                                                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                                             } catch (err) {
                                                console.error('Failed to mark all as read:', err);
                                             }
                                          }}
                                          className="text-xs font-bold text-[#32F5FF] hover:text-[#FF2BCD] bg-white/5 px-3 py-1.5 rounded-full transition-all"
                                       >
                                          Mark all read
                                       </button>
                                    )}
                                 </div>
                                 <div className="max-h-[28rem] overflow-y-auto scrollbar-thin scrollbar-thumb-[#32F5FF]/20">
                                    {notifications.length > 0 ? (
                                       notifications.map((notif) => (
                                          <div
                                             key={notif.id}
                                             onClick={async () => {
                                                if (!notif.read) {
                                                   try {
                                                      await notificationApi.markNotificationRead(notif.id);
                                                      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
                                                   } catch (err) {
                                                      console.error('Failed to mark as read:', err);
                                                   }
                                                }
                                                if (notif.type === 'join') navigate('/campus-coordinator');
                                                else navigate('/community');
                                                setIsNotifOpen(false);
                                             }}
                                             className={`p-4 border-b border-[#32F5FF]/5 hover:bg-white/5 cursor-pointer transition-all ${!notif.read ? 'bg-[#32F5FF]/5' : ''}`}
                                          >
                                             <div className="flex items-start space-x-3">
                                                <div className="relative">
                                                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF2BCD] to-[#8A2FFF] flex items-center justify-center text-white font-bold text-sm">
                                                      {(notif.actor?.name?.[0] || 'U').toUpperCase()}
                                                   </div>
                                                   {!notif.read && <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#FF2BCD] border-2 border-[#0B0F1A] rounded-full"></div>}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                   <p className="text-sm text-gray-200 leading-tight">
                                                      <span className="font-bold text-white">{notif.actor?.name || 'Someone'}</span>
                                                      <span className="ml-1 text-gray-400">
                                                         {notif.type === 'like' && 'liked your post'}
                                                         {notif.type === 'comment' && 'commented on your post'}
                                                         {notif.type === 'join' && 'joined your college community'}
                                                      </span>
                                                   </p>
                                                   <p className="text-[11px] text-gray-500 mt-1 flex items-center">
                                                      <span className="w-1 h-1 rounded-full bg-gray-600 mr-1.5"></span>
                                                      {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(notif.created_at).toLocaleDateString()}
                                                   </p>
                                                </div>
                                             </div>
                                          </div>
                                       ))
                                    ) : (
                                       <div className="py-20 flex flex-col items-center justify-center text-center px-10">
                                          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                             <Bell size={24} className="text-gray-600" />
                                          </div>
                                          <h4 className="text-white font-medium">All caught up!</h4>
                                          <p className="text-gray-500 text-xs mt-1">No new notifications at the moment.</p>
                                       </div>
                                    )}
                                 </div>
                                 <div className="p-3 bg-[#0D111D] border-t border-[#32F5FF]/10 text-center">
                                    <button onClick={() => setIsNotifOpen(false)} className="text-xs text-gray-400 hover:text-white transition-colors">Close</button>
                                 </div>
                              </div>
                           )}
                        </div>

                        <div className="flex items-center">
                           <div className="hidden sm:flex flex-col items-end mr-4">
                              <span className="text-white text-xs font-bold truncate max-w-[120px]">{user.name || user.email?.split('@')[0]}</span>
                              <span className="text-[10px] text-gray-400">Student</span>
                           </div>
                           <button
                              onClick={handleLogout}
                              className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-[#FF2BCD]/10 hover:border-[#FF2BCD]/30 transition-all duration-300 group"
                           >
                              <LogOut size={16} className="text-gray-400 group-hover:text-[#FF2BCD]" />
                              <span className="text-sm font-bold text-gray-300 group-hover:text-white">Logout</span>
                           </button>
                        </div>
                     </>
                  ) : (
                     <Link
                        to="/login"
                        className="relative group px-6 py-2.5 overflow-hidden rounded-full transition-all duration-500"
                     >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FF2BCD] via-[#8A2FFF] to-[#32F5FF] opacity-100 group-hover:opacity-80 transition-opacity"></div>
                        <span className="relative text-white font-bold text-sm tracking-wide">Get Started</span>
                     </Link>
                  )}

                  <button
                     className="lg:hidden p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white transition-all"
                     onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  >
                     {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                  </button>
               </div>
            </div>
         </div>

         <div
            className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden transition-all duration-500 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setIsMobileMenuOpen(false)}
         />

         <div className={`fixed top-0 right-0 w-[85%] max-w-sm h-full bg-[#05070A] z-[100] lg:hidden transition-transform duration-500 ease-out border-l border-white/10 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex flex-col h-full">
               <div className="p-6 flex justify-between items-center border-b border-white/5">
                  <div className="flex items-center space-x-2">
                     <img src="/crescologo.png" alt="Logo" className="w-10 h-10" />
                     <span className="font-black tracking-tighter text-xl bg-gradient-to-r from-[#FF2BCD] to-[#32F5FF] bg-clip-text text-transparent">Crezco</span>
                  </div>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg bg-white/5 text-gray-400"><X size={20} /></button>
               </div>

               <div className="flex-1 overflow-y-auto p-6 space-y-2">
                  {navLinks.map((link, index) => (
                     <div key={index} className="space-y-1">
                        <div
                           className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${location.pathname === link.to ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}
                           onClick={() => !link.dropdown && setIsMobileMenuOpen(false)}
                        >
                           <Link to={link.to} className="flex items-center space-x-4 flex-1">
                              <span className={`p-2 rounded-lg ${location.pathname === link.to ? 'bg-gradient-to-br from-[#FF2BCD] to-[#8A2FFF] text-white' : 'bg-white/5 text-gray-500'}`}>{link.icon}</span>
                              <span className="font-bold">{link.label}</span>
                           </Link>
                           {link.dropdown && (
                              <button
                                 onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setActiveDropdown(activeDropdown === link.label ? null : link.label);
                                 }}
                                 className={`p-1.5 transition-transform duration-300 ${activeDropdown === link.label ? 'rotate-180 text-[#32F5FF]' : ''}`}
                              >
                                 <ChevronDown size={18} />
                              </button>
                           )}
                        </div>

                        {link.dropdown && activeDropdown === link.label && (
                           <div className="ml-12 space-y-1 py-1 animate-in slide-in-from-top-2 duration-300">
                              {link.dropdown.map((item, idx) => (
                                 <Link
                                    key={idx}
                                    to={item.to}
                                    className={`block p-3 rounded-xl text-sm font-medium transition-all ${location.pathname === item.to ? 'text-[#32F5FF] bg-[#32F5FF]/10' : 'text-gray-500 hover:text-gray-300'}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                 >
                                    {item.label}
                                 </Link>
                              ))}
                           </div>
                        )}
                     </div>
                  ))}
               </div>

               <div className="p-6 border-t border-white/5 bg-[#0A0F15]">
                  {user ? (
                     <div className="space-y-4">
                        <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-2xl">
                           <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF2BCD] to-[#8A2FFF] flex items-center justify-center text-white font-bold text-lg">
                              {user.name?.[0] || user.email?.[0]}
                           </div>
                           <div className="flex-1 min-w-0">
                              <p className="text-white font-bold truncate">{user.name || 'Student'}</p>
                              <p className="text-xs text-gray-500 truncate">{user.email}</p>
                           </div>
                        </div>
                        <button
                           onClick={handleLogout}
                           className="w-full flex items-center justify-center space-x-2 p-4 rounded-2xl bg-red-500/10 text-red-500 font-bold hover:bg-red-500/20 transition-all"
                        >
                           <LogOut size={18} />
                           <span>Log Out</span>
                        </button>
                     </div>
                  ) : (
                     <Link
                        to="/login"
                        className="w-full flex items-center justify-center p-4 rounded-2xl bg-gradient-to-r from-[#FF2BCD] to-[#32F5FF] text-white font-bold shadow-[0_10px_20px_rgba(255,43,205,0.2)]"
                        onClick={() => setIsMobileMenuOpen(false)}
                     >
                        Sign In to Crezco
                     </Link>
                  )}
               </div>
            </div>
         </div>
      </nav>
   );
}
