import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { eventApi } from '../lib/supabase';
import { 
  Calendar, 
  MapPin, 
  User, 
  Clock, 
  ChevronLeft, 
  Share2, 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Ticket,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const EventDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;
      setLoading(true);
      setError(null);
      try {
        const data = await eventApi.getEvent(eventId);
        setEvent(data);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError(err.message || 'Failed to load event details');
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
        <main className="flex-grow flex flex-col items-center justify-center p-8 space-y-4">
            <div className="w-16 h-16 border-4 border-white/5 border-t-[#32F5FF] rounded-full animate-spin"></div>
            <p className="text-gray-500 font-black uppercase tracking-widest text-[10px]">Materializing Event Details</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-[#05070A] text-white flex flex-col">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center text-center px-6 py-32">
          <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-8">
            <AlertCircle size={40} />
          </div>
          <h1 className="text-3xl font-black mb-4 uppercase tracking-tight">{error || 'Intelligence Missing'}</h1>
          <p className="text-gray-500 mb-10 font-medium italic">The requested event has been decoupled from the network or moved.</p>
          <button onClick={() => navigate('/events')} className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all">
            Return to Hub
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  const date = new Date(event.date);

  return (
    <div className="min-h-screen bg-[#05070A] text-white flex flex-col selection:bg-[#32F5FF]/30">
      <Navbar />

      <main className="flex-grow pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Navigation & Actions */}
        <div className="flex items-center justify-between mb-12">
           <button onClick={() => navigate('/events')} className="flex items-center space-x-2 text-gray-500 hover:text-white transition-colors group">
              <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">Back to Hub</span>
           </button>
           <button className="p-3 bg-white/5 border border-white/10 rounded-2xl text-gray-400 hover:text-white transition-all group">
              <Share2 size={18} className="group-hover:scale-110 transition-transform" />
           </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
           
           {/* Left Column: Event Core Info */}
           <div className="lg:col-span-8 space-y-12">
              <div className="space-y-6">
                 <div className="inline-flex items-center space-x-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                    <Sparkles size={14} className="text-[#32F5FF]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#32F5FF]">Live Event Intelligence</span>
                 </div>
                 <h1 className="text-5xl sm:text-7xl font-black leading-tight tracking-tight">
                   {event.title}
                 </h1>
                 <div className="flex flex-wrap gap-4 pt-4">
                    <div className="flex items-center space-x-3 px-5 py-3 bg-white/5 rounded-2xl border border-white/10">
                       <div className="p-2 bg-[#32F5FF]/10 rounded-lg text-[#32F5FF]">
                          <Calendar size={18} />
                       </div>
                       <div className="text-left">
                          <p className="text-[8px] font-black uppercase tracking-widest text-gray-500">Date</p>
                          <p className="text-sm font-black">{date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                       </div>
                    </div>
                    <div className="flex items-center space-x-3 px-5 py-3 bg-white/5 rounded-2xl border border-white/10">
                       <div className="p-2 bg-[#8A2FFF]/10 rounded-lg text-[#8A2FFF]">
                          <MapPin size={18} />
                       </div>
                       <div className="text-left">
                          <p className="text-[8px] font-black uppercase tracking-widest text-gray-500">Location</p>
                          <p className="text-sm font-black">{event.college?.name || 'Main Hub'}</p>
                       </div>
                    </div>
                    <div className="flex items-center space-x-3 px-5 py-3 bg-white/5 rounded-2xl border border-white/10">
                       <div className="p-2 bg-[#FF2BCD]/10 rounded-lg text-[#FF2BCD]">
                          <User size={18} />
                       </div>
                       <div className="text-left">
                          <p className="text-[8px] font-black uppercase tracking-widest text-gray-500">Host</p>
                          <p className="text-sm font-black truncate max-w-[120px]">{event.creator?.name || 'Coordinator'}</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="aspect-video w-full bg-[#0D0F1A] border border-white/10 rounded-[3rem] overflow-hidden relative group">
                 <div className="absolute inset-0 bg-gradient-to-br from-[#32F5FF]/5 via-transparent to-[#FF2BCD]/5 opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
                 <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <Ticket size={120} className="text-white" />
                 </div>
              </div>

              <div className="space-y-8">
                 <h2 className="text-3xl font-black uppercase tracking-tight flex items-center space-x-4">
                    <div className="w-2 h-10 bg-[#32F5FF] rounded-full"></div>
                    <span>Intelligence Log</span>
                 </h2>
                 <p className="text-gray-400 text-lg sm:text-xl font-medium leading-relaxed whitespace-pre-wrap italic">
                    {event.description || 'No detailed description provided for this session.'}
                 </p>
              </div>
           </div>

           {/* Right Column: Ticket / RSVP */}
           <div className="lg:col-span-4">
              <div className="sticky top-32 space-y-8">
                 <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FF2BCD] via-[#8A2FFF] to-[#32F5FF] rounded-[3rem] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-700"></div>
                    <div className="relative bg-[#0D0F1A]/80 backdrop-blur-3xl border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl">
                       <div className="p-8 space-y-8">
                          <div className="flex items-center justify-between">
                             <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#32F5FF]">Official Pass</h3>
                             <ShieldCheck size={18} className="text-gray-500" />
                          </div>
                          
                          <div className="py-8 border-y border-white/5 border-dashed space-y-6">
                             <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Entry Type</span>
                                <span className="text-white font-black">Standard Access</span>
                             </div>
                             <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Pricing</span>
                                <span className="text-2xl font-black text-[#32F5FF]">FREE</span>
                             </div>
                             <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Availability</span>
                                <div className="flex items-center space-x-2">
                                   <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                   <span className="text-green-500 font-black text-xs">OPEN</span>
                                </div>
                             </div>
                          </div>

                          <button className="w-full py-6 bg-white text-black font-black rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-3 shadow-2xl">
                             <Zap size={20} />
                             <span>Claim Pass Now</span>
                          </button>
                       </div>
                       
                       <div className="bg-white/5 p-6 text-center">
                          <p className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-600">Limited Capacity • Verified Entry</p>
                       </div>
                    </div>
                 </div>

                 <div className="p-8 bg-white/5 border border-white/10 rounded-[3rem] space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center space-x-2">
                       <Clock size={12} />
                       <span>Event Protocols</span>
                    </h4>
                    <ul className="space-y-4">
                       {[
                         'Valid student ID required for physical entry',
                         'Registration closes 2 hours before start',
                         'Passes are non-transferable'
                       ].map((item, i) => (
                         <li key={i} className="flex items-start space-x-3 text-xs font-medium text-gray-400">
                            <CheckCircle2 size={14} className="text-[#32F5FF] shrink-0 mt-0.5" />
                            <span>{item}</span>
                         </li>
                       ))}
                    </ul>
                 </div>
              </div>
           </div>
        </div>

        {/* Global Footer Teaser */}
        <section className="mt-32 pt-20 border-t border-white/5 flex flex-col items-center text-center">
           <h3 className="text-3xl font-black mb-8">Discover more <span className="text-gradient">Experiences.</span></h3>
           <Link to="/events" className="group flex items-center space-x-4 bg-white/5 px-10 py-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
              <span className="font-black uppercase tracking-widest text-[10px]">Return to Event Hub</span>
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
           </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default EventDetail;
