import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { eventApi, collegeApi } from '../lib/supabase';
import { 
  Calendar, 
  Search, 
  Filter, 
  MapPin, 
  ChevronRight, 
  Zap, 
  Clock, 
  Trophy,
  Users,
  Sparkles,
  Ticket
} from 'lucide-react';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollegeId, setSelectedCollegeId] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      // For now, getting all events requires a separate fetch or a global event fetcher
      // I'll add a getGlobalEvents to eventApi
      const [eventsRes, colRes] = await Promise.all([
        eventApi.getEventsByCollege(null), // Modified to handle null/all
        collegeApi.getColleges()
      ]);
      setEvents(eventsRes || []);
      setColleges(colRes || []);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const collegeName = event.college?.name || 'Unknown';
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        collegeName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCollege = selectedCollegeId ? event.college_id.toString() === selectedCollegeId : true;
      return matchesSearch && matchesCollege;
    });
  }, [events, searchQuery, selectedCollegeId]);

  return (
    <div className="min-h-screen bg-[#05070A] text-white flex flex-col selection:bg-[#32F5FF]/30">
      <Navbar />

      <main className="flex-grow pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Immersive Header */}
        <section className="mb-16 relative overflow-hidden text-center lg:text-left py-12">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#32F5FF]/10 blur-[120px] rounded-full -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#8A2FFF]/10 blur-[100px] rounded-full -ml-32 -mb-32"></div>
          
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center space-x-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-xl">
               <Sparkles size={14} className="text-[#32F5FF]" />
               <span className="text-[10px] font-black uppercase tracking-widest">Campus Beat</span>
            </div>
            <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-tight">
              Live <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-[#32F5FF] via-[#8A2FFF] to-[#FF2BCD] bg-clip-text text-transparent">Campus Events</span>
            </h1>
            <p className="text-gray-400 text-lg sm:text-xl max-w-2xl font-medium">
              From hackathons to cultural fests. Discover, register, and experience the best of campus life across the network.
            </p>
          </div>
        </section>

        {/* Search & Filters */}
        <section className="mb-12">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-grow relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#32F5FF] to-[#8A2FFF] rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-500"></div>
              <div className="relative flex items-center">
                <Search size={22} className="absolute left-6 text-gray-500 group-focus-within:text-[#32F5FF] transition-colors" />
                <input
                  type="text"
                  placeholder="Search events, colleges, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0D0F1A] border border-white/10 rounded-2xl pl-16 pr-6 py-5 text-white font-bold focus:outline-none focus:border-[#32F5FF]/50 transition-all placeholder:text-gray-600 shadow-2xl"
                />
              </div>
            </div>

            <div className="lg:min-w-[300px] relative group">
               <div className="absolute inset-0 bg-white/5 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <div className="relative flex items-center">
                 <Filter size={20} className="absolute left-6 text-gray-500" />
                 <select
                   value={selectedCollegeId}
                   onChange={(e) => setSelectedCollegeId(e.target.value)}
                   className="w-full bg-[#0D0F1A] border border-white/10 rounded-2xl pl-16 pr-10 py-5 text-white font-bold appearance-none focus:outline-none focus:border-[#8A2FFF]/50 cursor-pointer"
                 >
                   <option value="">All Campuses</option>
                   {colleges.map(college => (
                     <option key={college.id} value={college.id}>{college.name}</option>
                   ))}
                 </select>
                 <ChevronRight size={18} className="absolute right-6 text-gray-500 rotate-90" />
               </div>
            </div>
          </div>
        </section>

        {/* Events Grid */}
        <section>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-[400px] bg-white/5 rounded-[3rem] animate-pulse"></div>
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="py-32 flex flex-col items-center justify-center text-center px-6 bg-white/5 border border-dashed border-white/10 rounded-[3rem]">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 text-gray-600">
                <Calendar size={40} />
              </div>
              <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">No Events Found</h3>
              <p className="text-gray-500 max-w-sm font-medium italic">Try adjusting your filters or stay tuned for updates.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event, index) => {
                const date = new Date(event.date);
                return (
                  <div key={event.id} className="group relative bg-[#0D0F1A] border border-white/5 rounded-[3rem] overflow-hidden hover:border-[#32F5FF]/30 transition-all duration-500 shadow-2xl flex flex-col">
                    <div className="h-48 bg-[#05070A] relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-br from-[#32F5FF]/10 to-[#8A2FFF]/10 opacity-50 group-hover:scale-110 transition-transform duration-700"></div>
                       <div className="absolute inset-0 flex items-center justify-center opacity-20">
                          <Calendar size={80} className="text-white" />
                       </div>
                       
                       <div className="absolute top-6 left-6 w-14 h-16 bg-[#0D0F1A]/80 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col items-center justify-center">
                          <span className="text-lg font-black leading-none">{date.getDate()}</span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#32F5FF]">
                            {date.toLocaleDateString(undefined, { month: 'short' })}
                          </span>
                       </div>
                    </div>

                    <div className="p-8 flex-grow flex flex-col">
                      <div className="mb-6 space-y-2">
                        <div className="flex items-center space-x-2 text-[#8A2FFF] text-[10px] font-black uppercase tracking-widest">
                           <MapPin size={12} />
                           <span>{event.college?.name || 'Crezco Network'}</span>
                        </div>
                        <h3 className="text-2xl font-black text-white group-hover:text-[#32F5FF] transition-colors leading-tight line-clamp-2">
                          {event.title}
                        </h3>
                      </div>

                      <p className="text-gray-500 text-sm font-medium line-clamp-3 mb-8 leading-relaxed">
                        {event.description}
                      </p>

                      <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                         <div className="flex items-center space-x-2 text-gray-400">
                            <Clock size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Starts 10:00 AM</span>
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-8">
                        <Link to={`/events/${event.id}`} className="flex items-center justify-center py-4 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all">
                          Details
                        </Link>
                        <button className="flex items-center justify-center py-4 bg-[#32F5FF] text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:shadow-[0_0_20px_rgba(50,245,255,0.4)] transition-all flex items-center space-x-2">
                          <Zap size={14} />
                          <span>RSVP</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Host Event CTA */}
        <section className="mt-24 relative rounded-[3rem] overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-r from-[#FF2BCD] via-[#8A2FFF] to-[#32F5FF] opacity-10 group-hover:opacity-20 transition-opacity duration-700"></div>
           <div className="relative p-12 sm:p-20 flex flex-col lg:flex-row items-center justify-between gap-12 bg-[#0D0F1A]/50 backdrop-blur-3xl border border-white/5">
              <div className="space-y-6 max-w-2xl text-center lg:text-left">
                 <h2 className="text-4xl sm:text-5xl font-black leading-tight">Host an Event <br /> <span className="text-[#FF2BCD]">on your Campus?</span></h2>
                 <p className="text-gray-400 text-lg font-medium">
                    Are you a Campus Coordinator? Start building your presence by hosting hackathons, workshops, or casual meetups. We provide the platform, you bring the energy.
                 </p>
                 <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
                    <Link to='/dashboard' className="px-10 py-5 bg-[#FF2BCD] text-white font-black rounded-2xl hover:scale-105 transition-transform shadow-2xl shadow-[#FF2BCD]/20">
                       Create Event
                    </Link>
                 </div>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Events;
