import React, { useEffect, useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getTopCoordinators, getTopColleges } from '../lib/api';
import { 
  Trophy, 
  Users, 
  School, 
  TrendingUp, 
  Zap, 
  Crown, 
  Star,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const Leaderboard: React.FC = () => {
    const [topCoordinators, setTopCoordinators] = useState<any[]>([]);
    const [topColleges, setTopColleges] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const [coordinators, colleges] = await Promise.all([
                getTopCoordinators(),
                getTopColleges()
            ]);
            setTopCoordinators(coordinators || []);
            setTopColleges(colleges || []);
        } catch (err) {
            console.error('Error loading leaderboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const renderPodium = (data: any[], type: 'coordinator' | 'college') => {
        if (data.length === 0) return null;
        
        // Podium order: 2, 1, 3
        const podium = [data[1], data[0], data[2]].filter(Boolean);
        const colors = {
          coordinator: { bg: '#FF2BCD', text: 'text-[#FF2BCD]' },
          college: { bg: '#32F5FF', text: 'text-[#32F5FF]' }
        };
        const activeColor = colors[type];

        return (
          <div className="flex flex-row items-end justify-center gap-2 sm:gap-6 mb-16 px-2">
            {podium.map((item, idx) => {
              const originalIndex = data.indexOf(item);
              const isFirst = originalIndex === 0;
              const isSecond = originalIndex === 1;
              const isThird = originalIndex === 2;
              
              return (
                <div 
                  key={idx} 
                  className={`relative flex flex-col items-center transition-all duration-700 ${isFirst ? 'z-10 -mt-10' : 'z-0'}`}
                >
                  <div className={`relative mb-4 group`}>
                    <div className={`absolute inset-0 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity ${isFirst ? 'bg-yellow-400' : isSecond ? 'bg-gray-300' : 'bg-orange-400'}`}></div>
                    <div className={`w-16 h-16 sm:w-24 sm:h-24 rounded-full border-4 flex items-center justify-center bg-[#0D0F1A] relative z-10 ${isFirst ? 'border-yellow-400 scale-110' : isSecond ? 'border-gray-300' : 'border-orange-400'}`}>
                      {isFirst ? <Crown className="text-yellow-400" size={32} /> : (item.name?.[0] || 'U').toUpperCase()}
                    </div>
                    <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 ${isFirst ? 'bg-yellow-400 border-yellow-900 text-yellow-900' : isSecond ? 'bg-gray-300 border-gray-600 text-gray-600' : 'bg-orange-400 border-orange-800 text-orange-800'}`}>
                      {originalIndex + 1}
                    </div>
                  </div>
                  <div className={`text-center space-y-1 max-w-[100px] sm:max-w-[140px]`}>
                    <h3 className="font-black text-xs sm:text-sm truncate">{item.name}</h3>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${activeColor.text}`}>{item.eventCount} Events</p>
                  </div>
                </div>
              );
            })}
          </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#05070A] text-white flex flex-col selection:bg-[#FF2BCD]/30">
            <Navbar />

            <main className="flex-grow pt-28 pb-20 px-6 sm:px-8 max-w-7xl mx-auto w-full">
                {/* Immersive Header */}
                <section className="relative py-16 mb-12 text-center lg:text-left overflow-hidden">
                   <div className="absolute top-0 right-0 w-[40%] h-[100%] bg-[#FF2BCD]/5 blur-[120px] rounded-full"></div>
                   <div className="absolute bottom-0 left-0 w-[30%] h-[100%] bg-[#32F5FF]/5 blur-[100px] rounded-full"></div>
                   
                   <div className="relative z-10 space-y-6">
                      <div className="inline-flex items-center space-x-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-xl">
                         <Trophy size={14} className="text-yellow-400" />
                         <span className="text-[10px] font-black uppercase tracking-widest">Hall of Fame</span>
                      </div>
                      <h1 className="text-5xl sm:text-8xl font-black tracking-tight leading-[1.1]">
                        The Elite <br />
                        <span className="bg-gradient-to-r from-[#FF2BCD] via-[#8A2FFF] to-[#32F5FF] bg-clip-text text-transparent">Rankings</span>
                      </h1>
                      <p className="text-gray-400 text-lg sm:text-xl max-w-2xl font-medium leading-relaxed">
                        Recognizing the most active campus coordinators and communities pushing the boundaries of student engagement.
                      </p>
                   </div>
                </section>

                {loading ? (
                    <div className="py-32 flex flex-col items-center justify-center space-y-6">
                        <div className="w-16 h-16 border-4 border-white/5 border-t-[#32F5FF] rounded-full animate-spin"></div>
                        <p className="text-gray-500 font-black uppercase tracking-widest text-[10px]">Syncing elite data</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                        
                        {/* Coordinators Section */}
                        <section className="space-y-12">
                           <div className="flex items-center justify-between">
                              <h2 className="text-2xl font-black uppercase tracking-tight flex items-center space-x-4">
                                 <div className="w-2 h-10 bg-[#FF2BCD] rounded-full"></div>
                                 <span>Top Coordinators</span>
                              </h2>
                              <div className="p-3 bg-white/5 rounded-2xl text-gray-500 hover:text-white transition-colors cursor-pointer">
                                 <Users size={20} />
                              </div>
                           </div>

                           {renderPodium(topCoordinators, 'coordinator')}

                           <div className="space-y-4">
                              {topCoordinators.slice(3, 10).map((coordinator, index) => (
                                <div key={coordinator._id || index} className="group flex items-center justify-between p-6 bg-[#0D0F1A] border border-white/5 rounded-3xl hover:border-[#FF2BCD]/30 transition-all hover:translate-x-1 duration-300">
                                   <div className="flex items-center space-x-6">
                                      <span className="text-lg font-black text-gray-700 group-hover:text-[#FF2BCD] transition-colors">{index + 4}</span>
                                      <div>
                                         <h3 className="font-bold text-base text-white">{coordinator.name}</h3>
                                         <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Active Coordinator</p>
                                      </div>
                                   </div>
                                   <div className="text-right">
                                      <div className="text-xl font-black text-white">{coordinator.eventCount}</div>
                                      <p className="text-[8px] font-black uppercase tracking-widest text-gray-600">Events</p>
                                   </div>
                                </div>
                              ))}
                           </div>
                        </section>

                        {/* Colleges Section */}
                        <section className="space-y-12">
                           <div className="flex items-center justify-between">
                              <h2 className="text-2xl font-black uppercase tracking-tight flex items-center space-x-4">
                                 <div className="w-2 h-10 bg-[#32F5FF] rounded-full"></div>
                                 <span>Top Campuses</span>
                              </h2>
                              <div className="p-3 bg-white/5 rounded-2xl text-gray-500 hover:text-white transition-colors cursor-pointer">
                                 <School size={20} />
                              </div>
                           </div>

                           {renderPodium(topColleges, 'college')}

                           <div className="space-y-4">
                              {topColleges.slice(3, 10).map((college, index) => (
                                <div key={college._id || index} className="group flex items-center justify-between p-6 bg-[#0D0F1A] border border-white/5 rounded-3xl hover:border-[#32F5FF]/30 transition-all hover:translate-x-1 duration-300">
                                   <div className="flex items-center space-x-6">
                                      <span className="text-lg font-black text-gray-700 group-hover:text-[#32F5FF] transition-colors">{index + 4}</span>
                                      <div>
                                         <h3 className="font-bold text-base text-white">{college.name}</h3>
                                         <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Premier Campus</p>
                                      </div>
                                   </div>
                                   <div className="text-right">
                                      <div className="text-xl font-black text-white">{college.eventCount}</div>
                                      <p className="text-[8px] font-black uppercase tracking-widest text-gray-600">Events</p>
                                   </div>
                                </div>
                              ))}
                           </div>
                        </section>

                    </div>
                )}

                {/* Engagement CTA */}
                <section className="mt-32 relative rounded-[4rem] overflow-hidden group">
                   <div className="absolute inset-0 bg-gradient-to-r from-[#FF2BCD] via-[#8A2FFF] to-[#32F5FF] opacity-10 group-hover:opacity-20 transition-opacity duration-700"></div>
                   <div className="relative p-12 sm:p-20 bg-[#0D0F1A]/80 backdrop-blur-3xl border border-white/5 flex flex-col lg:flex-row items-center justify-between gap-12">
                      <div className="space-y-8 max-w-2xl text-center lg:text-left">
                         <div className="inline-flex items-center space-x-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                            <Zap size={14} className="text-[#32F5FF] animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Active Season</span>
                         </div>
                         <h2 className="text-4xl sm:text-6xl font-black leading-tight">Climb to the <br /> <span className="text-gradient">Summit of Excellence.</span></h2>
                         <p className="text-gray-400 text-lg font-medium">
                            Every event hosted, every post shared, and every referral successful counts towards your ranking. The top performers each month unlock exclusive Crezco partner perks.
                         </p>
                         <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                            <button onClick={() => window.location.href='/dashboard'} className="px-10 py-5 bg-white text-black font-black rounded-2xl hover:scale-105 transition-transform flex items-center space-x-3">
                               <span>Start Journey</span>
                               <ChevronRight size={18} />
                            </button>
                            <button className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all">
                               Rewards Program
                            </button>
                         </div>
                      </div>
                      
                      <div className="relative lg:block hidden">
                         <div className="w-80 h-80 bg-gradient-to-br from-[#151926] to-[#0A0F15] rounded-[4rem] flex items-center justify-center border border-white/10 shadow-2xl relative overflow-hidden group-hover:rotate-3 transition-transform duration-700">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#FF2BCD]/20 to-transparent"></div>
                            <Sparkles size={120} className="text-white opacity-20 group-hover:opacity-40 transition-opacity" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                               <p className="text-6xl font-black text-white">#1</p>
                               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#32F5FF]">Ranked</p>
                            </div>
                         </div>
                         <div className="absolute -top-6 -right-6 w-20 h-20 bg-yellow-400 rounded-3xl rotate-12 flex items-center justify-center shadow-2xl">
                            <Star size={40} className="text-yellow-900" />
                         </div>
                      </div>
                   </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Leaderboard;
