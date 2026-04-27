import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { collegeApi, supabase } from '../lib/supabase';
import { useUserRole } from '../context/UserRoleContext';
import { 
  Search, 
  Plus, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  School,
  Globe,
  Sparkles,
  Zap
} from 'lucide-react';

const Colleges = () => {
  const [collegeName, setCollegeName] = useState('');
  const [colleges, setColleges] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [memberColleges, setMemberColleges] = useState(new Set());
  const { user } = useUserRole();

  const loadColleges = async () => {
    try {
      setLoading(true);
      setError('');
      
      const data = await collegeApi.getColleges();
      setColleges(data || []);

      if (user) {
        const { data: memberships } = await supabase
          .from('memberships')
          .select('college_id')
          .eq('user_id', user.id);
        
        const myCollegeIds = new Set(memberships?.map(m => m.college_id.toString()) || []);
        setMemberColleges(myCollegeIds);
      }
    } catch (err) {
      setError(err.message || 'Failed to load colleges');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadColleges();
  }, [user]);

  const filteredColleges = useMemo(() => {
    if (!searchQuery) return colleges;
    return colleges.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [colleges, searchQuery]);

  const handleCreateCollege = async (e) => {
    e.preventDefault();
    if (!collegeName.trim() || !user) {
      if (!user) setError('Please login to create a college');
      return;
    }

    try {
      setLoading(true);
      await collegeApi.createCollege(collegeName, user.id);
      setCollegeName('');
      loadColleges();
    } catch (err) {
      setError(err.message || 'Failed to create college');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCommunity = async (collegeId) => {
    if (!user) {
      setError('Please login to join a community');
      return;
    }
    try {
      await collegeApi.joinCollege(collegeId, user.id);
      setMemberColleges(new Set([...memberColleges, collegeId.toString()]));
      loadColleges();
    } catch (err) {
      setError(err.message || 'Failed to join college');
    }
  };

  return (
    <div className="min-h-screen bg-[#05070A] text-white flex flex-col selection:bg-[#FF2BCD]/30">
      <Navbar />

      <main className="flex-grow pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <section className="mb-16 text-center lg:text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF2BCD]/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>
          <div className="relative z-10 space-y-6">
            <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-tight">
              Explore <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-[#FF2BCD] via-[#8A2FFF] to-[#32F5FF] bg-clip-text text-transparent">Communities</span>
            </h1>
            <p className="text-gray-400 text-lg sm:text-xl max-w-2xl font-medium">
              Join the heartbeat of your campus. Connect with coordinators, discover exclusive events, and build your network.
            </p>
          </div>
        </section>

        {/* Search & Actions Bar */}
        <section className="mb-12">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-grow relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF2BCD] to-[#32F5FF] rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-500"></div>
              <div className="relative flex items-center">
                <Search size={22} className="absolute left-6 text-gray-500 group-focus-within:text-[#FF2BCD] transition-colors" />
                <input
                  type="text"
                  placeholder="Search by college name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0D0F1A] border border-white/10 rounded-2xl pl-16 pr-6 py-5 text-white font-bold focus:outline-none focus:border-[#FF2BCD]/50 transition-all placeholder:text-gray-600 shadow-2xl"
                />
              </div>
            </div>

            <div className="lg:min-w-[400px]">
               <form onSubmit={handleCreateCollege} className="flex gap-4 p-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
                  <input
                    type="text"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    placeholder="New college..."
                    className="flex-1 bg-transparent border-none px-4 py-2 text-white font-bold focus:outline-none placeholder:text-gray-600 text-sm"
                  />
                  <button
                    type="submit"
                    disabled={loading || !collegeName.trim()}
                    className="px-6 py-3 bg-[#FF2BCD] text-white font-black rounded-xl hover:scale-105 transition-all disabled:opacity-50 text-sm flex items-center space-x-2 shadow-lg shadow-[#FF2BCD]/20"
                  >
                    <Plus size={16} />
                    <span>Create</span>
                  </button>
               </form>
            </div>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-sm font-bold flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span>{error}</span>
            </div>
          )}
        </section>

        {/* Stats Row */}
        <section className="mb-12 grid grid-cols-2 md:grid-cols-4 gap-4">
           <div className="p-6 bg-white/5 border border-white/10 rounded-2xl text-center">
              <div className="text-2xl font-black text-[#32F5FF] mb-1">{colleges.length}</div>
              <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Active Campuses</div>
           </div>
           <div className="p-6 bg-white/5 border border-white/10 rounded-2xl text-center">
              <div className="text-2xl font-black text-[#FF2BCD] mb-1">2.4k</div>
              <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Global Members</div>
           </div>
           <div className="p-6 bg-white/5 border border-white/10 rounded-2xl text-center">
              <div className="text-2xl font-black text-[#8A2FFF] mb-1">150+</div>
              <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Coordinators</div>
           </div>
           <div className="p-6 bg-white/5 border border-white/10 rounded-2xl text-center">
              <div className="text-2xl font-black text-white mb-1">12</div>
              <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">New Today</div>
           </div>
        </section>

        {/* College Grid */}
        <section>
          {loading && colleges.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 bg-white/5 rounded-[2rem] animate-pulse"></div>
              ))}
            </div>
          ) : filteredColleges.length === 0 ? (
            <div className="py-32 flex flex-col items-center justify-center text-center px-6 bg-white/5 border border-dashed border-white/10 rounded-[3rem]">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 text-gray-600">
                <School size={40} />
              </div>
              <h3 className="text-2xl font-black mb-2">No campuses found</h3>
              <p className="text-gray-500 max-w-sm">Try searching for another name or create a new community for your college.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredColleges.map((college, index) => (
                <div
                  key={college.id}
                  className="group relative bg-[#0D0F1A] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-[#8A2FFF]/30 transition-all duration-500 shadow-2xl"
                >
                  <div className="h-32 bg-[#05070A] relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-br from-[#FF2BCD]/10 to-[#32F5FF]/10 opacity-50"></div>
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-gray-700 group-hover:scale-110 transition-transform duration-500">
                           <School size={32} />
                        </div>
                     </div>
                     {index % 3 === 0 && (
                        <div className="absolute top-4 right-4 px-3 py-1 bg-[#32F5FF]/10 border border-[#32F5FF]/20 text-[#32F5FF] text-[8px] font-black rounded-full uppercase tracking-widest flex items-center space-x-1">
                           <Zap size={10} />
                           <span>Trending</span>
                        </div>
                     )}
                  </div>

                  <div className="p-8 space-y-6">
                    <div className="min-h-[60px]">
                      <h3 className="text-2xl font-black text-white group-hover:text-[#32F5FF] transition-colors line-clamp-2">{college.name}</h3>
                    </div>
                    
                    <div className="flex items-center justify-between">
                       <div className="flex items-center space-x-2">
                          <div className="flex -space-x-2">
                             {[1,2,3].map(i => (
                                <div key={i} className="w-6 h-6 rounded-full border-2 border-[#0D0F1A] bg-gray-800 flex items-center justify-center text-[8px] font-black text-gray-400">
                                   {String.fromCharCode(64 + i + index)}
                                </div>
                             ))}
                          </div>
                          <span className="text-xs font-bold text-gray-500">
                            {college.memberships?.[0]?.count || 0} Members
                          </span>
                       </div>
                       <div className="flex items-center space-x-1 text-gray-600">
                          <MapPin size={14} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Campus</span>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-4">
                      <Link
                        to={`/colleges/${college.id}`}
                        className="flex items-center justify-center py-4 bg-white/5 border border-white/10 text-white text-sm font-black rounded-2xl hover:bg-white/10 transition-all group/btn"
                      >
                        <span>View</span>
                        <ArrowRight size={16} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                      
                      {memberColleges.has(college.id.toString()) ? (
                        <div className="flex items-center justify-center py-4 bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-black rounded-2xl space-x-2">
                          <CheckCircle2 size={16} />
                          <span>Member</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleJoinCommunity(college.id)}
                          className="flex items-center justify-center py-4 bg-[#FF2BCD] text-white text-sm font-black rounded-2xl hover:shadow-[0_0_20px_rgba(255,43,205,0.3)] transition-all active:scale-95"
                        >
                          Join
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Global Network Section */}
        <section className="mt-24 p-8 sm:p-16 bg-gradient-to-r from-[#FF2BCD]/10 via-[#8A2FFF]/10 to-[#32F5FF]/10 rounded-[3rem] border border-white/5 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-12 opacity-10">
              <Globe size={200} />
           </div>
           <div className="max-w-2xl relative z-10 space-y-8">
              <div className="inline-flex items-center space-x-3 bg-white/10 px-4 py-2 rounded-full border border-white/10">
                 <Sparkles size={16} className="text-yellow-400" />
                 <span className="text-xs font-black uppercase tracking-widest text-white">The Crezco Network</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black leading-tight">Can't find your <br /> <span className="text-[#32F5FF]">University?</span></h2>
              <p className="text-gray-400 text-lg font-medium">
                 Start a new community and become the official Campus Coordinator. Gain leadership experience, host events, and get exclusive rewards.
              </p>
              <button 
                onClick={() => navigate('/campus-coordinator')}
                className="px-10 py-5 bg-white text-black font-black rounded-2xl hover:scale-105 transition-transform flex items-center space-x-3"
              >
                 <span>Apply as Coordinator</span>
                 <ArrowRight size={20} />
              </button>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Colleges;
