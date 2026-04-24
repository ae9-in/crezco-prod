import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, MapPin, ChevronRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Event {
    _id: string;
    title: string;
    description: string;
    event_date: string;
    location?: string;
    college_id?: { name: string };
}

const UpcomingEvents: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/events/upcoming');
                setEvents(res.data);
            } catch (err) {
                console.error('Failed to fetch upcoming events:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-[#32F5FF]/20 border-t-[#32F5FF] rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <section className="py-20 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#FF2BCD]/5 blur-[120px] rounded-full"></div>
            
            <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-4 md:space-y-0">
                    <div className="space-y-4">
                        <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-xl">
                            <Sparkles size={14} className="text-[#FF2BCD]" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#FF2BCD]">Live Updates</span>
                        </div>
                        <h2 className="text-4xl sm:text-6xl font-black tracking-tight">
                            Nexus <span className="bg-gradient-to-r from-[#FF2BCD] to-[#8A2FFF] bg-clip-text text-transparent">Events</span>
                        </h2>
                        <p className="text-gray-400 font-medium max-w-xl">Don't miss out on the most high-octane gatherings in your campus ecosystem.</p>
                    </div>
                    <Link to="/events" className="group flex items-center space-x-3 text-sm font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
                        <span>View All Events</span>
                        <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-[#FF2BCD]/20 group-hover:text-[#FF2BCD] transition-all">
                            <ChevronRight size={18} />
                        </div>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {events.length > 0 ? (
                        events.map((event) => (
                            <Link 
                                key={event._id} 
                                to={`/events`}
                                className="group relative bg-[#0D0F1A] border border-white/5 rounded-[2.5rem] p-8 hover:border-[#FF2BCD]/30 transition-all duration-500 overflow-hidden flex flex-col h-full"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FF2BCD]/20 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                
                                <div className="flex items-start justify-between mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FF2BCD] group-hover:scale-110 transition-transform">
                                        <Calendar size={20} />
                                    </div>
                                    <div className="px-3 py-1.5 rounded-full bg-[#FF2BCD]/10 border border-[#FF2BCD]/20 text-[#FF2BCD] text-[10px] font-black uppercase tracking-widest">
                                        {new Date(event.event_date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                    </div>
                                </div>

                                <div className="flex-grow space-y-3">
                                    <h3 className="text-xl font-black group-hover:text-[#FF2BCD] transition-colors leading-tight line-clamp-2">
                                        {event.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm font-medium line-clamp-2">
                                        {event.description}
                                    </p>
                                </div>

                                <div className="mt-8 pt-6 border-t border-white/5 flex items-center text-gray-500 space-x-3">
                                    <MapPin size={14} className="text-[#FF2BCD]" />
                                    <span className="text-[10px] font-black uppercase tracking-widest truncate">
                                        {event.location || event.college_id?.name || 'On Campus'}
                                    </span>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-[3rem] border-dashed">
                             <Calendar size={40} className="text-gray-600 mb-4" />
                             <p className="text-gray-500 font-black uppercase tracking-widest text-xs">No upcoming events found</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default UpcomingEvents;
