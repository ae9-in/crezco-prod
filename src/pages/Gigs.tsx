import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Briefcase, 
  Clock, 
  User, 
  ChevronRight, 
  Zap, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  X,
  Target,
  Trophy,
  ArrowRight,
  Search,
  Filter,
  ArrowUpDown
} from 'lucide-react';

interface Gig {
  _id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  stipend: number;
  location: string;
  type: string;
  created_by?: { name: string };
}

const Gigs: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    interest: ''
  });
  const [submitted, setSubmitted] = useState(false);
  
  // New States for Filtering and Sorting
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    const fetchGigs = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/api/gigs', {
          params: { category, sortBy, search, type }
        });
        setGigs(res.data);
      } catch (err) {
        console.error('Failed to fetch gigs:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchGigs();
    }, 300); // Debounce search

    return () => clearTimeout(timer);
  }, [category, sortBy, search, type]);

  const openModal = (gig: Gig) => {
    setSelectedGig(gig);
    setModalOpen(true);
    setSubmitted(false);
    setFormData({ name: '', email: '', interest: '' });
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedGig(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      closeModal();
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#05070A] text-white flex flex-col selection:bg-[#32F5FF]/30">
      <Navbar />

      <main className="flex-grow pt-28 pb-20 px-6 sm:px-8 max-w-7xl mx-auto w-full">
        {/* Immersive Header */}
        <section className="relative py-16 mb-16 text-center lg:text-left overflow-hidden">
           <div className="absolute top-0 right-0 w-[50%] h-full bg-[#32F5FF]/5 blur-[120px] rounded-full"></div>
           <div className="absolute bottom-0 left-0 w-[40%] h-full bg-[#8A2FFF]/5 blur-[100px] rounded-full"></div>
           
           <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center space-x-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-xl">
                 <Briefcase size={14} className="text-[#32F5FF]" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Opportunity Hub</span>
              </div>
              <h1 className="text-5xl sm:text-8xl font-black tracking-tight leading-[1.1]">
                Campus <br />
                <span className="bg-gradient-to-r from-[#FF2BCD] via-[#8A2FFF] to-[#32F5FF] bg-clip-text text-transparent">Micro-Gigs</span>
              </h1>
              <p className="text-gray-400 text-lg sm:text-xl max-w-2xl font-medium leading-relaxed">
                Unlock your potential with flexible, high-impact opportunities. Gain experience, build your network, and earn while you learn.
              </p>
           </div>
        </section>

        {/* Filter & Sort Bar */}
        <section className="mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
           <div className="flex flex-col lg:flex-row gap-6 p-6 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl items-center">
              {/* Search */}
              <div className="relative w-full lg:flex-1">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                 <input 
                    type="text" 
                    placeholder="Search for your next big break..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:border-[#32F5FF]/50 transition-all font-bold placeholder:text-gray-600"
                 />
              </div>

              <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                 {/* Category Filter */}
                 <div className="relative flex-1 lg:flex-none lg:w-48">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF2BCD]" size={16} />
                    <select 
                       value={category}
                       onChange={(e) => setCategory(e.target.value)}
                       className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-8 appearance-none focus:outline-none focus:border-[#FF2BCD]/50 transition-all text-xs font-black uppercase tracking-widest"
                    >
                       <option value="" className="bg-[#0D0F1A]">All Categories</option>
                       <option value="Marketing" className="bg-[#0D0F1A]">Marketing</option>
                       <option value="Tech" className="bg-[#0D0F1A]">Tech</option>
                       <option value="Creative" className="bg-[#0D0F1A]">Creative</option>
                       <option value="Event" className="bg-[#0D0F1A]">Event</option>
                    </select>
                 </div>

                 {/* Type Filter */}
                 <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
                    {['', 'remote', 'on-campus'].map((t) => (
                       <button
                          key={t}
                          onClick={() => setType(t)}
                          className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${type === t ? 'bg-gradient-to-r from-[#FF2BCD] to-[#8A2FFF] text-white' : 'text-gray-500 hover:text-white'}`}
                       >
                          {t === '' ? 'All' : t}
                       </button>
                    ))}
                 </div>

                 {/* Sort */}
                 <div className="relative flex-1 lg:flex-none lg:w-48">
                    <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 text-[#32F5FF]" size={16} />
                    <select 
                       value={sortBy}
                       onChange={(e) => setSortBy(e.target.value)}
                       className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-8 appearance-none focus:outline-none focus:border-[#32F5FF]/50 transition-all text-xs font-black uppercase tracking-widest"
                    >
                       <option value="" className="bg-[#0D0F1A]">Default Sort</option>
                       <option value="latest" className="bg-[#0D0F1A]">Newest First</option>
                       <option value="stipend" className="bg-[#0D0F1A]">Highest Reward</option>
                    </select>
                 </div>
              </div>
           </div>
        </section>

        {/* Gigs Grid */}
        <section className="relative min-h-[400px]">
          {loading ? (
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#32F5FF]/20 border-t-[#32F5FF] rounded-full animate-spin"></div>
             </div>
          ) : gigs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {gigs.map((gig) => (
                  <div
                  key={gig._id}
                  className="group relative bg-[#0D0F1A] border border-white/5 rounded-[3.5rem] p-8 hover:border-white/20 transition-all duration-500 shadow-2xl flex flex-col hover:-translate-y-2"
                  >
                  <div className="flex items-start justify-between mb-8">
                     <div className="p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform text-[#32F5FF]">
                        <Briefcase size={24} />
                     </div>
                     <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-[#32F5FF]"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{gig.duration || 'Flexible'}</span>
                     </div>
                  </div>

                  <div className="flex-grow space-y-4 mb-8">
                     <div className="inline-block px-3 py-1 rounded-lg bg-white/5 text-[10px] font-black uppercase tracking-widest text-[#FF2BCD]">
                        {gig.category}
                     </div>
                     <h3 className="text-2xl font-black group-hover:text-[#32F5FF] transition-colors leading-tight">{gig.title}</h3>
                     <p className="text-gray-500 text-sm font-medium leading-relaxed line-clamp-3">
                        {gig.description}
                     </p>
                     <div className="flex items-center space-x-2 text-gray-600">
                        <User size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">CC {gig.created_by?.name || 'Admin'}</span>
                     </div>
                  </div>

                  <div className="pt-6 border-t border-white/5 flex items-center justify-between mb-8">
                     <div className="space-y-1">
                        <p className="text-[8px] font-black uppercase tracking-widest text-gray-500">Reward</p>
                        <p className="text-sm font-black text-[#32F5FF]">₹{gig.stipend?.toLocaleString() || 'N/A'}</p>
                     </div>
                     <div className="flex items-center space-x-2 text-gray-500">
                        <Target size={12} />
                        <span className="text-[9px] font-black uppercase tracking-widest">{gig.type}</span>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <button 
                        onClick={() => openModal(gig)}
                        className="py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-transform"
                     >
                        Apply
                     </button>
                     <button className="py-4 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center space-x-2">
                        <Send size={12} />
                        <span>Refer</span>
                     </button>
                  </div>
                  </div>
               ))}
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-[4rem] border border-dashed border-white/10">
                <Target size={60} className="text-gray-700 mb-6" />
                <h3 className="text-2xl font-black mb-2">No Gigs Found</h3>
                <p className="text-gray-500 font-medium">Try adjusting your filters or search terms.</p>
                <button 
                  onClick={() => {setCategory(''); setSortBy(''); setSearch(''); setType('');}}
                  className="mt-8 text-[#32F5FF] font-black uppercase tracking-widest text-xs hover:underline"
                >
                   Clear All Filters
                </button>
             </div>
          )}
        </section>

        {/* Global Impact Teaser */}
        <section className="mt-24 p-12 sm:p-20 bg-white/5 border border-white/10 rounded-[4rem] text-center relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-br from-[#FF2BCD]/5 via-transparent to-[#32F5FF]/5"></div>
           <div className="relative z-10 max-w-2xl mx-auto space-y-8">
              <div className="w-20 h-20 bg-[#32F5FF]/10 rounded-3xl flex items-center justify-center mx-auto text-[#32F5FF]">
                 <Target size={40} />
              </div>
              <h2 className="text-4xl font-black">Not finding the right <span className="text-[#FF2BCD]">Gig?</span></h2>
              <p className="text-gray-400 font-medium">We're constantly adding new opportunities. Join our talent pool to get notified when a gig matching your skill set goes live.</p>
              <button className="px-10 py-5 bg-white text-black font-black rounded-2xl hover:scale-105 transition-transform">
                 Join Talent Pool
              </button>
           </div>
        </section>
      </main>

      {/* Modal */}
      {modalOpen && selectedGig && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-8 overflow-hidden">
          <div className="absolute inset-0 bg-[#05070A]/90 backdrop-blur-xl" onClick={closeModal}></div>
          
          <div className="relative w-full max-w-xl bg-[#0D0F1A] border border-white/10 rounded-[3rem] p-8 sm:p-12 shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300">
            <button onClick={closeModal} className="absolute top-8 right-8 p-3 bg-white/5 rounded-2xl text-gray-500 hover:text-white transition-colors">
               <X size={20} />
            </button>

            {submitted ? (
              <div className="text-center py-12 space-y-8">
                 <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-400">
                    <CheckCircle2 size={60} />
                 </div>
                 <div className="space-y-4">
                    <h3 className="text-3xl font-black">Application Logged</h3>
                    <p className="text-gray-500 font-medium italic">Our coordinators will reach out within 48 hours. Get ready to build.</p>
                 </div>
              </div>
            ) : (
              <div className="space-y-10">
                <div>
                   <div className="inline-flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-[#32F5FF] mb-4">
                      <Zap size={14} />
                      <span>Direct Application</span>
                   </div>
                   <h2 className="text-4xl font-black leading-tight">{selectedGig.title}</h2>
                   <p className="text-gray-500 font-medium mt-2">Apply for this gig and start your journey with CC {selectedGig.ccName}.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Profile Name</label>
                      <input 
                        required
                        type="text" 
                        placeholder="John Doe"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:border-[#32F5FF]/50 transition-all font-bold"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Contact Portal (Email)</label>
                      <input 
                        required
                        type="email" 
                        placeholder="john@campus.edu"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:border-[#32F5FF]/50 transition-all font-bold"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Motivation</label>
                      <textarea 
                        required
                        rows={3}
                        placeholder="Briefly explain why you're a fit..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:border-[#32F5FF]/50 transition-all font-bold resize-none"
                        value={formData.interest}
                        onChange={(e) => setFormData({...formData, interest: e.target.value})}
                      />
                   </div>

                   <button type="submit" className="w-full py-6 bg-[#32F5FF] text-black font-black rounded-2xl hover:shadow-[0_0_30px_rgba(50,245,255,0.3)] transition-all flex items-center justify-center space-x-3 group mt-4">
                      <span>Submit Intelligence</span>
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                   </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Gigs;
