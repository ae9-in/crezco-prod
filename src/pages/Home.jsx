import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { metricsApi, postApi } from '../lib/supabase';
import { useUserRole } from '../context/UserRoleContext';
import { ArrowRight, Star, Zap, Target, TrendingUp, Globe, Users } from 'lucide-react';
import UpcomingEvents from '../components/UpcomingEvents';

export default function Home() {
   const navigate = useNavigate();
   const { user } = useUserRole();
   const [metrics, setMetrics] = useState({
      users: 0,
      colleges: 0,
      events: 0,
      posts: 0
   });
   const [feed, setFeed] = useState([]);
   const [loading, setLoading] = useState(true);
   const [feedLoading, setFeedLoading] = useState(false);

   useEffect(() => {
      const fetchData = async () => {
         setLoading(true);
         try {
            const metricsData = await metricsApi.getMetrics();
            setMetrics(metricsData);

            if (user) {
               setFeedLoading(true);
               try {
                  const communityData = await postApi.getCommunityFeed();
                  setFeed(communityData.slice(0, 3));
               } catch (feedErr) {
                  console.error('Error fetching community feed:', feedErr);
               } finally {
                  setFeedLoading(false);
               }
            }
         } catch (err) {
            console.error('Error fetching home data:', err);
         } finally {
            setLoading(false);
         }
      };

      fetchData();
   }, [user]);

   return (
      <div className="min-h-screen bg-[#05070A] text-white selection:bg-[#FF2BCD]/30">
         <Navbar />

         {/* Hero Section */}
         <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
               <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#FF2BCD] opacity-[0.08] blur-[120px] rounded-full animate-pulse"></div>
               <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-[#32F5FF] opacity-[0.08] blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-[#8A2FFF] opacity-[0.05] blur-[180px] rounded-full"></div>
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
               <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
               <div className="space-y-10">
                  <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                     <span className="flex h-2 w-2 rounded-full bg-[#32F5FF] animate-ping"></span>
                     <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">Empowering the Future</span>
                  </div>

                  <div className="max-w-4xl mx-auto">
                     <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white leading-tight tracking-tight mb-8">
                        Together, We Grow <br />
                        <span className="bg-gradient-to-r from-[#FF2BCD] via-[#8A2FFF] to-[#32F5FF] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,43,205,0.3)]">Stronger.</span>
                     </h1>

                     <p className="text-lg sm:text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-12">
                        A student-driven ecosystem built for{' '}
                        <span className="text-white font-semibold">curiosity</span>,{' '}
                        <span className="text-white font-semibold">growth</span>, and{' '}
                        <span className="text-white font-semibold">limitless opportunities</span>.
                     </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                     <button
                        onClick={() => navigate('/campus-coordinator')}
                        className="group relative w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-[#FF2BCD] to-[#8A2FFF] text-white font-black rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,43,205,0.4)] overflow-hidden"
                     >
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        <span className="relative flex items-center justify-center space-x-2">
                           <span>Register Now</span>
                           <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                     </button>

                     <button
                        onClick={() => navigate('/curious')}
                        className="w-full sm:w-auto px-10 py-5 bg-white/5 backdrop-blur-md border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all duration-300"
                     >
                        Learn More
                     </button>
                  </div>

                  <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                     <div className="flex items-center justify-center space-x-2">
                        <Zap size={20} />
                        <span className="font-bold">Fast Growth</span>
                     </div>
                     <div className="flex items-center justify-center space-x-2">
                        <Globe size={20} />
                        <span className="font-bold">Global Reach</span>
                     </div>
                     <div className="flex items-center justify-center space-x-2">
                        <Target size={20} />
                        <span className="font-bold">Targeted Goals</span>
                     </div>
                     <div className="flex items-center justify-center space-x-2">
                        <Star size={20} />
                        <span className="font-bold">Premium Quality</span>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* Stats Section */}
         <section className="relative py-20 bg-[#0A0F15]/50 border-y border-white/5 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                  {[
                     { label: 'Students', value: metrics.users, color: '#FF2BCD' },
                     { label: 'Colleges', value: metrics.colleges, color: '#32F5FF' },
                     { label: 'Events', value: metrics.events, color: '#8A2FFF' },
                     { label: 'Posts', value: metrics.posts, color: '#FF2BCD' }
                  ].map((stat, i) => (
                     <div key={i} className="group p-6 rounded-3xl transition-all hover:bg-white/5">
                        <div
                           className="text-4xl sm:text-5xl font-black mb-2 transition-transform group-hover:scale-110"
                           style={{ color: stat.color, textShadow: `0 0 20px ${stat.color}40` }}
                        >
                           {loading ? '...' : stat.value.toLocaleString()}+
                        </div>
                        <p className="text-gray-500 font-bold tracking-widest uppercase text-xs">{stat.label}</p>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* Upcoming Events Section */}
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
            <UpcomingEvents />
         </div>

         {/* Community Feed Section */}
         <section className="relative py-32 bg-[#0A0F15]/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="text-center max-w-3xl mx-auto mb-20">
                  <h2 className="text-4xl sm:text-5xl font-black mb-6">From Our <span className="text-[#FF2BCD]">Community</span></h2>
                  <p className="text-gray-400 text-lg">See what students are sharing across campuses. Join the conversation and share your own experiences.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                  {user ? (
                     feedLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                           <div key={i} className="aspect-[4/5] bg-white/5 rounded-[2.5rem] animate-pulse"></div>
                        ))
                     ) : feed.length > 0 ? (
                        feed.map((item) => (
                           <div key={item.id} className="group bg-[#0D0F1A] border border-white/5 rounded-[2.5rem] overflow-hidden transition-all hover:-translate-y-2">
                              <div className="p-6 border-b border-white/5 flex items-center space-x-3">
                                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF2BCD] to-[#8A2FFF] flex items-center justify-center font-black text-xs text-white">
                                    {item.author?.name?.[0] || 'U'}
                                 </div>
                                 <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-white truncate">{item.author?.name || 'Anonymous'}</p>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{item.college?.name || 'Global Community'}</p>
                                 </div>
                              </div>

                              <div className="p-6">
                                 <p className="text-gray-300 leading-relaxed line-clamp-4 min-h-[100px]">
                                    {item.content}
                                 </p>
                              </div>

                              <div className="px-6 py-4 bg-white/5 flex items-center justify-between">
                                 <div className="flex items-center space-x-4">
                                    <span className="flex items-center space-x-1.5 text-xs font-bold text-gray-400">
                                       <TrendingUp size={14} className="text-[#FF2BCD]" />
                                       <span>{item.likes_count || 0}</span>
                                    </span>
                                    <span className="flex items-center space-x-1.5 text-xs font-bold text-gray-400">
                                       <Users size={14} className="text-[#32F5FF]" />
                                       <span>{item.comments_count || 0}</span>
                                    </span>
                                 </div>
                                 <span className="text-[10px] font-black uppercase text-[#8A2FFF] tracking-tighter cursor-pointer">View post</span>
                              </div>
                           </div>
                        ))
                     ) : (
                        <div className="col-span-full py-20 text-center bg-white/5 rounded-[2.5rem] border border-dashed border-white/10">
                           <p className="text-gray-500 font-bold mb-6">No posts to show right now</p>
                           <button onClick={() => navigate('/community')} className="text-[#FF2BCD] font-black hover:underline">Explore Community</button>
                        </div>
                     )
                  ) : (
                     Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="aspect-[4/5] relative rounded-[2.5rem] overflow-hidden group">
                           <img
                              src={`https://images.unsplash.com/photo-${[
                                 '1523240715630-d1d2c711f9f2',
                                 '1517486808906-6ca8b3f04846',
                                 '1522202176988-66273c2fd55f'
                              ][i]}?auto=format&fit=crop&w=800&q=80`}
                              alt="Community Preview"
                              className="w-full h-full object-cover opacity-40 transition-transform duration-700 group-hover:scale-110"
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-[#05070A] via-transparent to-transparent"></div>
                           <div className="absolute bottom-8 left-8 right-8">
                              <div className="w-12 h-1.5 bg-[#FF2BCD] rounded-full mb-4"></div>
                              <h4 className="text-xl font-black text-white">Join the Community</h4>
                              <p className="text-gray-400 text-sm mt-2">Connect with {metrics.users}+ students worldwide.</p>
                           </div>
                        </div>
                     ))
                  )}
               </div>

               <div className="text-center">
                  <button
                     onClick={() => navigate('/community')}
                     className="px-10 py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all"
                  >
                     Enter Community
                  </button>
               </div>
            </div>
         </section>

         {/* Refer & Earn Section */}
         <section className="relative py-24 px-4 overflow-hidden">
            <div className="max-w-7xl mx-auto">
               <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-[#FF2BCD] via-[#8A2FFF] to-[#32F5FF] p-1 shadow-[0_30px_100px_rgba(255,43,205,0.3)]">
                  <div className="relative bg-[#05070A]/80 backdrop-blur-2xl rounded-[2.9rem] px-8 py-16 md:px-20 md:py-24 flex flex-col md:flex-row items-center justify-between overflow-hidden">
                     <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#32F5FF] opacity-10 blur-[100px] rounded-full"></div>
                     <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#FF2BCD] opacity-10 blur-[100px] rounded-full"></div>

                     <div className="relative z-10 max-w-xl text-center md:text-left mb-10 md:mb-0">
                        <h2 className="text-4xl sm:text-5xl font-black mb-6 leading-tight">Refer, Earn, and <br /><span className="text-[#32F5FF]">Grow Together.</span></h2>
                        <p className="text-gray-400 text-lg mb-10">Invite your friends to Crezco and get rewarded for every successful referral. Building the future is better together.</p>
                        <button
                           onClick={() => navigate('/referrals')}
                           className="w-full sm:w-auto px-10 py-5 bg-white text-black font-black rounded-2xl hover:scale-105 transition-all shadow-[0_15px_30px_rgba(255,255,255,0.1)]"
                        >
                           Get Referral Link
                        </button>
                     </div>

                     <div className="relative z-10 grid grid-cols-2 gap-4">
                        {[
                           { icon: <Users />, label: 'Invite', desc: 'Share your link' },
                           { icon: <Target />, label: 'Join', desc: 'They sign up' },
                           { icon: <Zap />, label: 'Impact', desc: 'Expand reach' },
                           { icon: <Star />, label: 'Earn', desc: 'Get rewards' }
                        ].map((item, i) => (
                           <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-[2rem] flex flex-col items-center text-center">
                              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white mb-3">
                                 {item.icon}
                              </div>
                              <h4 className="font-black text-white text-sm">{item.label}</h4>
                              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">{item.desc}</p>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         </section>

         <Footer />

         <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 30s linear infinite;
        }
      `}</style>
      </div>
   );
}
