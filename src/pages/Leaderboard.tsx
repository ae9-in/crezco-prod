import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getTopCoordinators, getTopColleges } from '../lib/api';

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
            setTopCoordinators(coordinators);
            setTopColleges(colleges);
        } catch (err) {
            console.error('Error loading leaderboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const medalIcons = [
        <span className="text-2xl">🥇</span>,
        <span className="text-2xl">🥈</span>,
        <span className="text-2xl">🥉</span>
    ];

    return (
        <div className="min-h-screen bg-[#05070A] text-white flex flex-col">
            <Navbar />

            <main className="flex-grow pt-32 pb-16 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-20 animate-fade-in-down">
                        <h1 className="text-5xl sm:text-7xl font-black mb-6 font-outfit">
                            <span className="bg-gradient-to-r from-[#FF2BCD] via-[#8A2FFF] to-[#32F5FF] bg-clip-text text-transparent">
                                Elite Rankings
                            </span>
                        </h1>
                        <p className="text-xl text-gray-500 font-inter tracking-[0.2em] font-medium uppercase">
                            Celebrating Excellence Across Campuses
                        </p>
                    </div>

                    {loading ? (
                        <div className="text-center py-20 flex flex-col items-center">
                            <div className="w-16 h-16 border-4 border-white/5 border-t-[#32F5FF] rounded-full animate-spin mb-6"></div>
                            <p className="text-gray-500 font-inter uppercase tracking-widest text-xs font-bold">Consolidating rankings...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Top Coordinators */}
                            <div className="animate-fade-in-left">
                                <div className="flex items-center space-x-3 mb-8">
                                    <div className="w-1.5 h-10 bg-gradient-to-b from-[#FF2BCD] to-[#8A2FFF] rounded-full"></div>
                                    <h2 className="text-3xl font-black font-outfit uppercase tracking-wider">Top Coordinators</h2>
                                </div>
                                
                                <div className="space-y-4">
                                    {topCoordinators.length === 0 ? (
                                        <div className="p-12 text-center bg-[#0D0F1A] border border-dashed border-gray-800 rounded-3xl">
                                            <p className="text-gray-600 font-inter">No rankings available yet</p>
                                        </div>
                                    ) : (
                                        topCoordinators.map((coordinator, index) => (
                                            <div key={coordinator._id || index} className={`relative p-6 rounded-3xl border transition-all flex items-center justify-between group overflow-hidden ${index === 0 ? 'bg-gradient-to-br from-[#FF2BCD]/20 to-transparent border-[#FF2BCD]/30' : 'bg-[#0D0F1A] border-white/5 hover:border-white/10'}`}>
                                                {index < 3 && <div className="absolute top-0 right-0 p-4 opacity-10 blur-sm group-hover:opacity-20 transition-opacity transform rotate-12">{medalIcons[index]}</div>}
                                                <div className="flex items-center space-x-6 relative z-10">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl font-outfit border transform rotate-3 group-hover:rotate-0 transition-transform ${index === 0 ? 'bg-[#FF2BCD] text-white border-transparent' : 'bg-gray-800 text-gray-400 border-white/5'}`}>
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg font-outfit text-white group-hover:text-[#FF2BCD] transition-colors">{coordinator.name}</h3>
                                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest font-inter">Host Extraordinaire</p>
                                                    </div>
                                                </div>
                                                <div className="text-right relative z-10">
                                                    <p className="text-2xl font-black font-outfit text-[#32F5FF]">{coordinator.eventCount}</p>
                                                    <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest font-inter">Events Hosted</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Top Colleges */}
                            <div className="animate-fade-in-right">
                                <div className="flex items-center space-x-3 mb-8">
                                    <div className="w-1.5 h-10 bg-gradient-to-b from-[#32F5FF] to-[#8A2FFF] rounded-full"></div>
                                    <h2 className="text-3xl font-black font-outfit uppercase tracking-wider">Top Campuses</h2>
                                </div>
                                
                                <div className="space-y-4">
                                    {topColleges.length === 0 ? (
                                        <div className="p-12 text-center bg-[#0D0F1A] border border-dashed border-gray-800 rounded-3xl">
                                            <p className="text-gray-600 font-inter">Rankings in progress</p>
                                        </div>
                                    ) : (
                                        topColleges.map((college, index) => (
                                            <div key={college._id || index} className={`relative p-6 rounded-3xl border transition-all flex items-center justify-between group overflow-hidden ${index === 0 ? 'bg-gradient-to-br from-[#32F5FF]/10 to-transparent border-[#32F5FF]/30' : 'bg-[#0D0F1A] border-white/5 hover:border-white/10'}`}>
                                                <div className="flex items-center space-x-6 relative z-10">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl font-outfit border transform -rotate-3 group-hover:rotate-0 transition-transform ${index === 0 ? 'bg-[#32F5FF] text-black border-transparent' : 'bg-gray-800 text-gray-400 border-white/5'}`}>
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg font-outfit text-white group-hover:text-[#32F5FF] transition-colors">{college.name}</h3>
                                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest font-inter">Beacon of Innovation</p>
                                                    </div>
                                                </div>
                                                <div className="text-right relative z-10">
                                                    <p className="text-2xl font-black font-outfit text-[#8A2FFF]">{college.eventCount}</p>
                                                    <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest font-inter">Live Events</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Footer Teaser */}
                    <div className="mt-24 p-12 bg-gradient-to-r from-[#0D0F1A] to-[#151926] rounded-[40px] border border-white/5 text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <h3 className="text-2xl font-bold mb-4 font-outfit text-white">Join the Elite</h3>
                        <p className="text-gray-500 font-inter text-sm max-w-md mx-auto leading-relaxed">Refer friends, host events, and engage with your community to climb the rankings. The top performer each month wins exclusive CREZCO perks.</p>
                        <div className="mt-8">
                             <span className="px-6 py-2 bg-white/5 border border-white/10 text-gray-400 text-[10px] font-bold rounded-full uppercase tracking-[0.2em] font-inter">Coming Soon: Monthly Rewards</span>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Leaderboard;
