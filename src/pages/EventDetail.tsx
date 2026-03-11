import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../lib/axios';

const EventDetail: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/events/${eventId}`);
        setEvent(response.data);
      } catch (err: any) {
        console.error('Error fetching event:', err);
        setError(err.response?.data?.message || 'Failed to load event details');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070A] text-white flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#32F5FF]"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-[#05070A] text-white flex flex-col">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center h-screen text-center px-4">
          <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2 font-outfit">{error || 'Event not found'}</h1>
          <p className="text-gray-400 mb-8 font-inter">The event you are looking for might have been removed or is unavailable.</p>
          <button onClick={() => navigate('/events')} className="px-8 py-3 bg-[#32F5FF] text-black font-bold rounded-xl transition-all shadow-lg shadow-[#32F5FF]/10 uppercase tracking-widest text-xs font-inter">Back to Events</button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070A] text-white flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-16">
        {/* Event Banner */}
        <section className="relative py-20 px-4 group">
          <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-br from-[#0D0F1A] via-[#151926] to-[#0A0F15] border-b border-white/5 overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-[30%] h-[150%] bg-[#8A2FFF] opacity-5 blur-[100px] rounded-full group-hover:opacity-10 transition-opacity"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[120%] bg-[#32F5FF] opacity-5 blur-[120px] rounded-full group-hover:opacity-10 transition-opacity"></div>
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 text-gray-400 text-[10px] rounded-lg font-bold uppercase tracking-widest mb-6 font-inter underline decoration-[#32F5FF] underline-offset-4 decoration-2">
                {event.college_id?.name || 'On Campus'}
            </div>
            <h1 className="text-4xl sm:text-6xl font-black mb-8 font-outfit">
              <span className="bg-gradient-to-r from-[#FF2BCD] via-[#8A2FFF] to-[#32F5FF] bg-clip-text text-transparent">
                {event.title}
              </span>
            </h1>
            
            <div className="flex flex-wrap justify-center gap-6">
                <div className="flex items-center text-gray-400 text-sm font-inter">
                    <svg className="w-5 h-5 mr-3 text-[#32F5FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(event.event_date).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                <div className="flex items-center text-gray-400 text-sm font-inter">
                    <svg className="w-5 h-5 mr-3 text-[#8A2FFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    By {event.created_by?.name || 'Campus Coordinator'}
                </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <div className="flex items-center space-x-3 mb-8">
                    <div className="w-1.5 h-8 bg-gradient-to-b from-[#8A2FFF] to-[#FF2BCD] rounded-full"></div>
                    <h2 className="text-2xl font-bold font-outfit uppercase tracking-wider">About this event</h2>
                </div>
                <p className="text-gray-400 text-lg leading-relaxed font-inter whitespace-pre-wrap">
                  {event.description || 'Join us for this exciting campus event.'}
                </p>
              </div>

              <div className="bg-[#0D0F1A] border border-white/5 rounded-3xl p-8 h-fit shadow-2xl">
                <h2 className="text-xl font-bold mb-8 font-outfit text-white underline decoration-[#32F5FF] decoration-2 underline-offset-4">Event Pass</h2>
                <div className="space-y-6 mb-10">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1 font-inter">Status</p>
                    <p className="text-white font-bold flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                        Open for Registration
                    </p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1 font-inter">Price</p>
                    <p className="text-white font-bold text-lg font-outfit">FREE ENTRY</p>
                  </div>
                </div>

                <button className="w-full py-5 bg-gradient-to-br from-[#FF2BCD] via-[#8A2FFF] to-[#32F5FF] text-white font-black rounded-2xl hover:shadow-[0_0_25px_rgba(255,43,205,0.4)] transition-all uppercase tracking-widest text-sm font-inter">
                  Get Your Pass
                </button>
                <p className="text-center text-gray-500 text-[10px] mt-4 font-inter uppercase tracking-widest">
                  Valid for 1 Entry Only
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default EventDetail;
