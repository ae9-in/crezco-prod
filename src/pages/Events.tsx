import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../lib/axios';

interface Event {
  _id: string;
  id: string;
  title: string;
  description: string;
  event_date: string;
  college_id: any;
  created_by: any;
}

interface College {
  _id: string;
  name: string;
}

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollegeId, setSelectedCollegeId] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [eventsRes, colRes] = await Promise.all([
        api.get('/events'),
        api.get('/colleges')
      ]);
      setEvents(eventsRes.data || []);
      setColleges(colRes.data || []);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredEvents = events.filter(event => {
    const collegeName = event.college_id?.name || 'Unknown';
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collegeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCollege = selectedCollegeId ? (event.college_id?._id === selectedCollegeId || event.college_id === selectedCollegeId) : true;
    return matchesSearch && matchesCollege;
  });

  return (
    <div className="min-h-screen bg-[#05070A] text-white flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <section className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4 font-outfit">
                <span className="bg-gradient-to-r from-[#32F5FF] via-[#8A2FFF] to-[#FF2BCD] bg-clip-text text-transparent">
                  Campus Events
                </span>
              </h1>
              <p className="text-gray-400 font-inter text-lg">Never miss a beat from your favorite campuses.</p>
          </section>

          {/* Filters */}
          <section className="flex flex-col md:flex-row gap-4 mb-12 items-center justify-center">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events..."
                className="w-full px-5 py-3 bg-[#0D0F1A] border border-white/5 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#32F5FF]/50 font-inter"
              />
              <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <select
              value={selectedCollegeId}
              onChange={(e) => setSelectedCollegeId(e.target.value)}
              className="px-5 py-3 bg-[#0D0F1A] border border-white/5 rounded-xl text-white focus:outline-none focus:border-[#8A2FFF]/50 font-inter appearance-none cursor-pointer min-w-[200px]"
            >
              <option value="">All Colleges</option>
              {colleges.map(college => (
                <option key={college._id} value={college._id}>{college.name}</option>
              ))}
            </select>
          </section>

          {/* Events Grid */}
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#32F5FF] mx-auto mb-4"></div>
              <p className="text-gray-400 font-inter">Syncing campus events...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-20 bg-[#0D0F1A] border border-dashed border-gray-800 rounded-2xl">
              <p className="text-xl text-gray-500 font-inter italic">No events found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <div key={event._id || event.id} className="bg-[#0D0F1A] border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 group shadow-lg">
                  {/* Event Banner */}
                  <div className="w-full h-48 bg-gradient-to-br from-[#0D0F1A] via-[#151926] to-[#0A0F15] flex items-center justify-center border-b border-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <svg className="w-16 h-16 text-gray-800 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-white font-outfit line-clamp-1">{event.title}</h3>
                    </div>

                    <div className="space-y-3 mb-8">
                      <div className="flex items-center text-gray-400 text-sm font-inter">
                        <div className="w-8 h-8 rounded-lg bg-[#32F5FF]/10 flex items-center justify-center mr-3 text-[#32F5FF]">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        {new Date(event.event_date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center text-gray-400 text-sm font-inter">
                        <div className="w-8 h-8 rounded-lg bg-[#8A2FFF]/10 flex items-center justify-center mr-3 text-[#8A2FFF]">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        {event.college_id?.name || 'Various Campuses'}
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Link to={`/events/${event._id || event.id}`} className="flex-1 px-4 py-3 bg-[#32F5FF] text-black font-bold rounded-xl hover:shadow-[0_0_15px_rgba(50,245,255,0.3)] transition-all text-center text-xs uppercase tracking-widest font-inter">
                        Details
                      </Link>
                      <button className="flex-1 px-4 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all text-xs uppercase tracking-widest font-inter">
                        Register
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Events;
