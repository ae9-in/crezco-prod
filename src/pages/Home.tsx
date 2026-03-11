import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../lib/axios';
import { getCommunityFeed, FeedItem } from '../lib/api';
import { useUserRole } from '../context/UserRoleContext';

interface Event {
  id: string;
  _id?: string;
  title: string;
  event_date: string;
  college_id: {
    name: string;
  };
}

export default function Home() {
  const navigate = useNavigate();
  const { user } = useUserRole();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [metrics, setMetrics] = useState({
    users: 0,
    colleges: 0,
    events: 0,
    posts: 0
  });
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedLoading, setFeedLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch metrics
        const metricsRes = await api.get('/metrics');
        setMetrics(metricsRes.data);

        // Fetch upcoming events
        const eventsRes = await api.get('/events/upcoming');
        setUpcomingEvents(eventsRes.data);

        // Fetch community feed if logged in
        if (user) {
          setFeedLoading(true);
          try {
            const communityData = await getCommunityFeed();
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
    <div className="min-h-screen bg-[#05070A] text-white">
      <Navbar />

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#FF2BCD] opacity-20 blur-[100px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#32F5FF] opacity-20 blur-[120px] rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#8A2FFF] opacity-10 blur-[150px] rounded-full"></div>
        </div>

        <div className="absolute inset-0 scanline pointer-events-none"></div>

        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 h-full">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="border-r border-[#32F5FF]"></div>
            ))}
          </div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <div className="float flex justify-center">
              <img
                src="/crezco-hero-logo.png"
                alt="Crezco Neon Logo"
                className="h-24 sm:h-32 md:h-40 lg:h-48 mx-auto drop-shadow-[0_0_20px_rgba(255,0,255,0.8)]"
              />
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Together, We Grow Stronger.
            </h2>

            <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              A student-driven ecosystem built for{' '}
              <span className="text-[#FF2BCD] font-semibold">curiosity</span>,{' '}
              <span className="text-[#32F5FF] font-semibold">growth</span>, and{' '}
              <span className="text-[#8A2FFF] font-semibold">opportunities</span>.
            </p>

            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mt-8 mb-2">
              <span className="bg-gradient-to-r from-[#FF2BCD] via-[#8A2FFF] to-[#32F5FF] bg-clip-text text-transparent">
                Take charge, lead your campus, and get paid for your influence — Join now!
              </span>
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/campus-coordinator')}
                className="px-6 py-3 bg-gradient-to-r from-[#FF2BCD] via-[#8A2FFF] to-[#32F5FF] text-white font-bold rounded-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                Register Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Live Activity Strip */}
      <section className="relative py-12 bg-[#0A0F15] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">Live Activity</h2>
          <div className="flex space-x-8 animate-scroll">
            <div className="flex-shrink-0 text-gray-300 text-lg">• {metrics.colleges} colleges joined CREZCO</div>
            <div className="flex-shrink-0 text-gray-300 text-lg">• {metrics.events} events hosted on campus</div>
            <div className="flex-shrink-0 text-gray-300 text-lg">• {metrics.users} students connecting through curiosity</div>
            <div className="flex-shrink-0 text-gray-300 text-lg">• Expand your reach with Campus Coordinators</div>
            <div className="flex-shrink-0 text-gray-300 text-lg">• {metrics.posts} posts shared this week</div>
          </div>
        </div>
      </section>

      {/* Events Carousel */}
      <section className="relative py-20 bg-[#05070A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-12 text-center">Upcoming Events</h2>
          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#32F5FF] mx-auto"></div>
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No upcoming events found. Check back soon!
            </div>
          ) : (
            <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
              {upcomingEvents.map((event) => (
                <div key={event._id || event.id} className="flex-shrink-0 w-80 bg-[#0D0F1A] border border-[#8A2FFF]/30 rounded-2xl p-6 transition-all hover:border-[#32F5FF]/50">
                  <div className="w-full h-40 bg-gradient-to-br from-[#0D0F1A] to-[#1A1D2D] rounded-lg mb-4 flex items-center justify-center border border-[#8A2FFF]/10">
                    <svg className="w-12 h-12 text-[#8A2FFF]/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 truncate">{event.title}</h3>
                  <p className="text-gray-400 mb-2 truncate">{event.college_id?.name || 'College'}</p>
                  <p className="text-gray-400 mb-4">Date: {new Date(event.event_date).toLocaleDateString()}</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/events/${event._id || event.id}`)}
                      className="flex-1 px-4 py-2 bg-[#32F5FF] text-black font-bold rounded-lg text-sm"
                    >
                      View Details
                    </button>
                    <button className="flex-1 px-4 py-2 bg-[#FF2BCD]/10 border border-[#FF2BCD]/30 text-[#FF2BCD] font-bold rounded-lg text-sm">
                      Register
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Community Highlights Preview */}
      <section className="relative py-20 bg-[#0A0F15]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-12 text-center">From Our Community</h2>
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Community Feed</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {user ? (
                feedLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="w-full h-64 bg-[#0D0F1A] border border-[#8A2FFF]/10 rounded-2xl p-6 animate-pulse">
                      <div className="w-10 h-10 bg-gray-800 rounded-full mb-4"></div>
                      <div className="h-4 bg-gray-800 rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-gray-800 rounded w-1/2"></div>
                    </div>
                  ))
                ) : feed.length > 0 ? (
                  feed.map((item) => (
                    <div key={item.feed_id} className="bg-[#0D0F1A] border border-[#8A2FFF]/20 rounded-2xl p-6 hover:border-[#32F5FF]/40 transition-all group h-full flex flex-col">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF2BCD] to-[#8A2FFF] flex items-center justify-center text-white font-bold">
                          {(item as any).author?.name?.[0] || (item as any).created_by?.name?.[0] || 'U'}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-white font-bold truncate">{(item as any).author?.name || (item as any).created_by?.name || 'Anonymous'}</p>
                          <p className="text-gray-500 text-xs truncate">{(item as any).collegeName || (item as any).college_id?.name || 'Community'}</p>
                        </div>
                      </div>

                      {item.type === 'post' && (
                        <p className="text-gray-300 text-sm mb-4 line-clamp-3 flex-grow">
                          {item.content}
                        </p>
                      )}

                      {item.type === 'reel' && (
                        <div className="relative aspect-[9/16] max-h-48 bg-black rounded-lg mb-4 overflow-hidden flex-grow group cursor-pointer">
                          <video
                            src={(item as any).video_url}
                            className="w-full h-full object-cover"
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            onMouseOver={(e) => {
                              if (!e.currentTarget.controls) e.currentTarget.play();
                            }}
                            onMouseOut={(e) => {
                              if (!e.currentTarget.controls) e.currentTarget.pause();
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              const v = e.currentTarget;
                              v.muted = false;
                              v.controls = true;
                              v.play();
                            }}
                          />
                          <div className="absolute top-2 right-2 bg-black/60 px-2 py-0.5 rounded text-[10px] font-bold text-[#FF2BCD] pointer-events-none">REEL</div>
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
                            <svg className="w-8 h-8 text-white/50" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                          </div>
                          {item.caption && (
                            <p className="absolute bottom-2 left-2 right-2 text-[10px] text-white line-clamp-1 bg-black/40 p-1 rounded pointer-events-none">
                              {item.caption}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-gray-500 mt-auto pt-4 border-t border-white/5">
                        <div className="flex items-center space-x-3">
                          <span className="flex items-center space-x-1">
                            <span>{item.type === 'post' || item.type === 'reel' ? item.like_count : 0}</span>
                            <span className="text-[10px]">Likes</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <span>{item.type === 'post' || item.type === 'reel' ? item.comment_count : 0}</span>
                            <span className="text-[10px]">Comments</span>
                          </span>
                        </div>
                        <span className="text-[10px] uppercase tracking-wider text-[#32F5FF] font-bold">{item.type}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-10 bg-[#0D0F1A] border border-dashed border-[#8A2FFF]/20 rounded-2xl">
                    <p className="text-gray-400">Join a college to see what's happening in your community!</p>
                    <button
                      onClick={() => navigate('/community')}
                      className="mt-4 text-[#32F5FF] text-sm font-bold hover:underline"
                    >
                      Browse Colleges
                    </button>
                  </div>
                )
              ) : (
                // Logged out / Marketing section
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="w-full h-48 bg-gradient-to-br from-[#0D0F1A] to-[#1A1D2D] border border-[#8A2FFF]/10 rounded-lg flex items-center justify-center transition-all hover:border-[#8A2FFF]/30">
                    <span className="text-gray-600 italic">Latest Post {i + 1}</span>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="text-center">
            <button
              onClick={() => navigate('/community')}
              className="px-6 py-3 bg-gradient-to-r from-[#FF2BCD] via-[#8A2FFF] to-[#32F5FF] text-white font-bold rounded-lg hover:shadow-2xl transition-all duration-300"
            >
              View Community Feed
            </button>
          </div>
        </div>
      </section>

      {/* Impact Metrics Section */}
      <section className="relative py-20 bg-[#05070A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl sm:text-6xl font-bold text-[#FF2BCD] mb-2">
                {loading ? '...' : metrics.users}
              </div>
              <p className="text-gray-400">Total Users</p>
            </div>
            <div>
              <div className="text-5xl sm:text-6xl font-bold text-[#32F5FF] mb-2">
                {loading ? '...' : metrics.colleges}
              </div>
              <p className="text-gray-400">Total Colleges</p>
            </div>
            <div>
              <div className="text-5xl sm:text-6xl font-bold text-[#8A2FFF] mb-2">
                {loading ? '...' : metrics.events}
              </div>
              <p className="text-gray-400">Total Events Hosted</p>
            </div>
            <div>
              <div className="text-5xl sm:text-6xl font-bold text-[#FF2BCD] mb-2">
                {loading ? '...' : metrics.posts}
              </div>
              <p className="text-gray-400">Total Posts Shared</p>
            </div>
          </div>
        </div>
      </section>

      {/* Referral Banner */}
      <section className="relative py-20 bg-gradient-to-r from-[#FF2BCD] via-[#8A2FFF] to-[#32F5FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Earn by referring students, interns, and leaders</h2>
          <button
            onClick={() => navigate('/referrals')}
            className="px-6 py-3 bg-white text-black font-bold rounded-lg hover:shadow-2xl transition-all duration-300"
          >
            Start Referring
          </button>
        </div>
      </section>

      <section className="relative py-24 bg-[#05070A]">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#32F5FF] to-transparent"></div>
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FF2BCD] to-transparent"></div>
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#8A2FFF] to-transparent"></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[#FF2BCD] via-[#8A2FFF] to-[#32F5FF] bg-clip-text text-transparent">
                About Crezco
              </span>
            </h2>
            <div className="h-1 w-32 bg-gradient-to-r from-[#32F5FF] to-[#FF2BCD] mx-auto rounded-full mb-8"></div>
          </div>

          <div className="bg-[#0D0F1A] border border-[#8A2FFF]/30 rounded-2xl p-8 md:p-12">
            <p className="text-gray-300 text-lg leading-relaxed text-center">
              Crezco is a student-driven ecosystem built to empower{' '}
              <span className="text-[#FF2BCD] font-semibold">curiosity</span>, develop{' '}
              <span className="text-[#32F5FF] font-semibold">skills</span>, and unlock{' '}
              <span className="text-[#8A2FFF] font-semibold">opportunities</span>. Student coordinators inside each college help students enroll and connect with internal or external internships. Our mission is simple: help students discover their curiosity, develop their abilities, and grow stronger — together.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#FF2BCD] to-[#FF2BCD]/50 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-bold text-[#FF2BCD] mb-2">Discover</h3>
                <p className="text-gray-400 text-sm">Find your curiosity and passion</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#32F5FF] to-[#32F5FF]/50 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-bold text-[#32F5FF] mb-2">Develop</h3>
                <p className="text-gray-400 text-sm">Build skills and capabilities</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#8A2FFF] to-[#8A2FFF]/50 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-bold text-[#8A2FFF] mb-2">Grow</h3>
                <p className="text-gray-400 text-sm">Unlock opportunities and succeed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
