import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useUserRole } from '../context/UserRoleContext';
import { collegeApi, postApi, eventApi, supabase } from '../lib/supabase';
import { 
  Plus, 
  Video, 
  Image as ImageIcon, 
  Users, 
  Calendar, 
  Trophy, 
  Rocket, 
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Send
} from 'lucide-react';

const Dashboard = () => {
  const { user, userRole, loading: authLoading, roleLoading } = useUserRole();

  const [displayName, setDisplayName] = useState('');
  const [allColleges, setAllColleges] = useState([]);
  const [memberCollegeIds, setMemberCollegeIds] = useState(new Set());
  const [selectedCollegeId, setSelectedCollegeId] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [newCollegeName, setNewCollegeName] = useState('');
  const [activePanel, setActivePanel] = useState(null);
  
  const [eventForm, setEventForm] = useState({ title: '', description: '', date: '' });
  const [eventSubmitted, setEventSubmitted] = useState(false);
  const [eventError, setEventError] = useState(null);
  const [postForm, setPostForm] = useState({ caption: '', file: null });
  const [postSubmitted, setPostSubmitted] = useState(false);
  const [postError, setPostError] = useState(null);
  const [reelForm, setReelForm] = useState({ caption: '', file: null });
  const [reelSubmitted, setReelSubmitted] = useState(false);
  const [reelError, setReelError] = useState(null);
  const [referralForm, setReferralForm] = useState({ name: '', type: '' });
  const [referralSubmitted, setReferralSubmitted] = useState(false);

  useEffect(() => {
    if (user) {
        setDisplayName(user.name || user.email.split('@')[0]);
    }
  }, [user]);

  const loadColleges = async () => {
    try {
      const data = await collegeApi.getColleges();
      setAllColleges(data || []);
      
      if (user) {
        const { data: myData } = await supabase
          .from('memberships')
          .select('college_id')
          .eq('user_id', user.id);
        
        const mySet = new Set(myData?.map(m => m.college_id.toString()) || []);
        setMemberCollegeIds(mySet);
        if (!selectedCollegeId && mySet.size > 0) {
          setSelectedCollegeId(Array.from(mySet)[0]);
        }
      }
    } catch (e) {
      console.error('Failed to load colleges', e);
    }
  };

  useEffect(() => {
    loadColleges();
  }, [user]);

  const myColleges = useMemo(() => {
    return allColleges.filter((c) => memberCollegeIds.has(c.id.toString()));
  }, [allColleges, memberCollegeIds]);

  const availableColleges = useMemo(() => {
    return allColleges.filter((c) => !memberCollegeIds.has(c.id.toString()));
  }, [allColleges, memberCollegeIds]);

  const handleJoinCollege = async (collegeId) => {
    if (!user || !collegeId) return;
    setJoinLoading(true);
    try {
      await collegeApi.joinCollege(collegeId, user.id);
      setMemberCollegeIds(new Set([...memberCollegeIds, collegeId.toString()]));
      setSelectedCollegeId(collegeId.toString());
    } catch(err) {
        console.error('Join failed', err);
    } finally {
      setJoinLoading(false);
    }
  };

  const handleCreateCollege = async () => {
    if (!user || !newCollegeName.trim()) return;
    setCreateLoading(true);
    try {
      const college = await collegeApi.createCollege(newCollegeName.trim(), user.id);
      setAllColleges([college, ...allColleges]);
      setMemberCollegeIds(new Set([...memberCollegeIds, college.id.toString()]));
      setSelectedCollegeId(college.id.toString());
      setNewCollegeName('');
    } catch(err) {
        console.error('Create failed', err);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    if (!user || !selectedCollegeId) return;
    setEventError(null);
    try {
      await eventApi.createEvent(selectedCollegeId, eventForm.title, eventForm.description, eventForm.date);
      setEventSubmitted(true);
      setTimeout(() => {
        setEventSubmitted(false);
        setEventForm({ title: '', description: '', date: '' });
        setActivePanel(null);
      }, 3000);
    } catch (err) {
      setEventError(err.message || 'Failed to create event.');
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!user || !selectedCollegeId) return;
    setPostError(null);
    try {
      await postApi.createPost(selectedCollegeId, user.id, postForm.caption);
      setPostSubmitted(true);
      setTimeout(() => {
        setPostSubmitted(false);
        setPostForm({ caption: '', file: null });
        setActivePanel(null);
      }, 3000);
    } catch (err) {
      setPostError(err.message || 'Failed to upload post.');
    }
  };

  const handleReelSubmit = async (e) => {
    e.preventDefault();
    // Simplified for now, real video upload would use supabase.storage
    setReelSubmitted(true);
    setTimeout(() => {
      setReelSubmitted(false);
      setReelForm({ caption: '', file: null });
      setActivePanel(null);
    }, 3000);
  };

  const handleReferralSubmit = (e) => {
    e.preventDefault();
    setReferralSubmitted(true);
    setTimeout(() => {
      setReferralSubmitted(false);
      setReferralForm({ name: '', type: '' });
      setActivePanel(null);
    }, 3000);
  };

  const initials = useMemo(() => {
    if (!displayName) return 'CC';
    return displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }, [displayName]);

  if (authLoading || (roleLoading && !userRole)) {
    return (
      <div className="min-h-screen bg-[#05070A] text-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-16 h-16 border-4 border-[#FF2BCD]/20 border-t-[#FF2BCD] rounded-full animate-spin"></div>
          <p className="text-gray-500 font-black uppercase tracking-widest animate-pulse">Syncing Dashboard</p>
        </div>
      </div>
    );
  }

  if (userRole !== 'cc' && userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-[#05070A] text-white flex flex-col selection:bg-red-500/30">
        <Navbar />
        <main className="flex-grow flex items-center justify-center px-4 pt-20">
          <div className="max-w-xl w-full">
            <div className="bg-[#0D0F1A] border border-white/5 rounded-[2.5rem] p-12 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500"></div>
              <div className="w-24 h-24 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8">
                <AlertCircle size={48} />
              </div>
              <h1 className="text-4xl font-black mb-4">Access Denied</h1>
              <p className="text-gray-400 text-lg mb-8 font-medium">
                This dashboard is exclusive for <span className="text-white font-bold">Campus Coordinators</span>. 
                If you believe this is an error, please contact support.
              </p>
              <button 
                onClick={() => navigate('/')}
                className="px-10 py-4 bg-white text-black font-black rounded-2xl hover:scale-105 transition-transform"
              >
                Return to Home
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070A] text-white flex flex-col selection:bg-[#FF2BCD]/30">
      <Navbar />

      <main className="flex-grow pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* CC Hero Header */}
        <div className="relative mb-12 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#FF2BCD] via-[#8A2FFF] to-[#32F5FF] rounded-[3rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-[#0D0F1A] border border-white/10 rounded-[2.5rem] p-8 sm:p-12 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#FF2BCD] opacity-[0.03] blur-[100px] rounded-full"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#32F5FF] opacity-[0.03] blur-[100px] rounded-full"></div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 text-center md:text-left">
              <div className="relative">
                <div className="w-28 h-28 sm:w-36 sm:h-36 bg-gradient-to-br from-[#FF2BCD] via-[#8A2FFF] to-[#32F5FF] rounded-[2rem] flex items-center justify-center shadow-2xl shadow-[#FF2BCD]/20 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                  <span className="text-4xl sm:text-5xl font-black text-white">{initials}</span>
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#05070A] border-4 border-[#0D0F1A] rounded-full flex items-center justify-center text-green-400">
                   <CheckCircle2 size={20} />
                </div>
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <h2 className="text-4xl sm:text-5xl font-black tracking-tight">{displayName}</h2>
                  <span className="inline-flex px-4 py-1.5 bg-[#FF2BCD]/10 border border-[#FF2BCD]/20 text-[#FF2BCD] text-[10px] font-black rounded-full uppercase tracking-widest w-fit mx-auto md:mx-0">
                    Campus Coordinator
                  </span>
                </div>
                <p className="text-gray-400 text-lg font-medium max-w-xl">
                  Fueling growth and connection at <span className="text-[#32F5FF] font-bold">Crezco</span>. Manage your community, host events, and earn rewards.
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                   <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                      <Trophy size={16} className="text-yellow-500" />
                      <span className="text-sm font-bold">1,240 XP</span>
                   </div>
                   <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                      <Users size={16} className="text-[#32F5FF]" />
                      <span className="text-sm font-bold">{myColleges.length} Campuses</span>
                   </div>
                </div>
              </div>

              <button className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors hidden lg:block">
                 <Rocket size={24} className="text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Campus Management Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-[#0D0F1A] border border-white/5 rounded-[2rem] p-8 shadow-xl">
            <div className="flex items-center space-x-4 mb-8">
               <div className="p-3 bg-[#FF2BCD]/10 rounded-2xl text-[#FF2BCD]">
                 <Users size={24} />
               </div>
               <h3 className="text-2xl font-black">Join Campus</h3>
            </div>
            <div className="space-y-6">
              <div className="relative group">
                <select
                  value={selectedCollegeId}
                  onChange={(e) => setSelectedCollegeId(e.target.value)}
                  className="w-full bg-[#05070A] border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-[#FF2BCD]/50 appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select a college to join</option>
                  {availableColleges.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#0D0F1A]">{c.name}</option>
                  ))}
                </select>
                <ChevronDown size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-focus-within:rotate-180 transition-transform" />
              </div>
              <button
                onClick={() => handleJoinCollege(selectedCollegeId)}
                disabled={!selectedCollegeId || joinLoading}
                className="w-full py-4 bg-white text-black font-black rounded-2xl hover:bg-gray-200 disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
              >
                {joinLoading ? <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div> : <><Plus size={20} /> <span>Join Community</span></>}
              </button>
            </div>
          </div>

          <div className="bg-[#0D0F1A] border border-white/5 rounded-[2rem] p-8 shadow-xl">
            <div className="flex items-center space-x-4 mb-8">
               <div className="p-3 bg-[#32F5FF]/10 rounded-2xl text-[#32F5FF]">
                 <Rocket size={24} />
               </div>
               <h3 className="text-2xl font-black">Launch New Campus</h3>
            </div>
            <div className="space-y-6">
              <input
                type="text"
                value={newCollegeName}
                onChange={(e) => setNewCollegeName(e.target.value)}
                placeholder="Ex: Stanford University"
                className="w-full bg-[#05070A] border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-[#32F5FF]/50 placeholder:text-gray-600"
              />
              <button
                onClick={handleCreateCollege}
                disabled={!newCollegeName.trim() || createLoading}
                className="w-full py-4 bg-[#32F5FF] text-black font-black rounded-2xl hover:shadow-[0_0_30px_rgba(50,245,255,0.2)] disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
              >
                {createLoading ? <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div> : <><Rocket size={20} /> <span>Initialize Campus</span></>}
              </button>
            </div>
          </div>
        </div>

        {/* Community Selector */}
        {myColleges.length > 0 && (
          <div className="sticky top-24 z-40 mb-12">
            <div className="bg-[#0D0F1A]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
              <div className="flex items-center space-x-3 text-gray-400">
                <Users size={18} />
                <span className="text-sm font-black uppercase tracking-widest">Active Community</span>
              </div>
              <div className="relative min-w-[250px] w-full sm:w-auto">
                <select
                  value={selectedCollegeId}
                  onChange={(e) => setSelectedCollegeId(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-3 text-[#32F5FF] font-black appearance-none focus:outline-none"
                >
                  {myColleges.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#0D0F1A] text-white">{c.name}</option>
                  ))}
                </select>
                <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#32F5FF]" />
              </div>
            </div>
          </div>
        )}

        {/* Tool Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {[
            { id: 'event', label: 'Event', icon: Calendar, color: '#32F5FF' },
            { id: 'post', label: 'Post', icon: ImageIcon, color: '#FF2BCD' },
            { id: 'reel', label: 'Reel', icon: Video, color: '#8A2FFF' },
            { id: 'referral', label: 'Referral', icon: Users, color: '#FFFFFF' }
          ].map((tool) => (
            <button
              key={tool.id}
              onClick={() => (tool.id === 'referral' || myColleges.length > 0) && setActivePanel(activePanel === tool.id ? null : tool.id)}
              disabled={tool.id !== 'referral' && myColleges.length === 0}
              className={`relative group p-6 sm:p-8 rounded-[2.5rem] border transition-all duration-500 overflow-hidden flex flex-col items-center justify-center space-y-4 disabled:opacity-30 ${activePanel === tool.id ? 'bg-white/5 border-white/20 shadow-2xl scale-[1.02]' : 'bg-[#0D0F1A] border-white/5 hover:border-white/20'}`}
            >
              <div 
                className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl"
                style={{ 
                  backgroundColor: activePanel === tool.id ? tool.color : 'rgba(255,255,255,0.05)',
                  color: activePanel === tool.id ? (tool.id === 'event' || tool.id === 'referral' ? 'black' : 'white') : tool.color
                }}
              >
                <tool.icon size={tool.id === 'referral' ? 24 : 32} className="sm:w-8 sm:h-8" />
              </div>
              <span className={`text-sm sm:text-base font-black transition-colors ${activePanel === tool.id ? 'text-white' : 'text-gray-500 group-hover:text-white'}`}>
                {tool.label}
              </span>
            </button>
          ))}
        </div>

        {/* Dynamic Panels */}
        {activePanel && (
          <div className="bg-[#0D0F1A] border border-white/10 rounded-[3rem] p-8 sm:p-12 mb-12 shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
             {activePanel === 'event' && (
                <div className="max-w-3xl mx-auto">
                   <div className="flex items-center space-x-6 mb-10">
                      <div className="w-14 h-14 bg-[#32F5FF] text-black rounded-2xl flex items-center justify-center">
                         <Calendar size={28} />
                      </div>
                      <div>
                         <h3 className="text-3xl font-black">Create Event</h3>
                         <p className="text-gray-500 font-medium">Broadcast your upcoming campus activities</p>
                      </div>
                   </div>

                   {eventSubmitted ? (
                      <div className="text-center py-16 animate-in zoom-in duration-300">
                         <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(34,197,94,0.2)]">
                            <CheckCircle2 size={48} />
                         </div>
                         <h4 className="text-3xl font-black mb-4">Event Synchronized!</h4>
                         <p className="text-gray-400 text-lg">Your community has been notified of the new event.</p>
                      </div>
                   ) : (
                      <form onSubmit={handleEventSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         {eventError && <div className="col-span-full p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl font-bold flex items-center space-x-3"><AlertCircle size={18} /> <span>{eventError}</span></div>}
                         <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Event Title</label>
                            <input type="text" required value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} className="w-full bg-[#05070A] border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:border-[#32F5FF]/50 outline-none" placeholder="Ex: Crezco Tech Night" />
                         </div>
                         <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Event Date</label>
                            <input type="date" required value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} className="w-full bg-[#05070A] border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:border-[#32F5FF]/50 outline-none" />
                         </div>
                         <div className="col-span-full space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Description</label>
                            <textarea required value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} className="w-full h-40 bg-[#05070A] border border-white/10 rounded-2xl px-6 py-5 text-white font-medium focus:border-[#32F5FF]/50 outline-none resize-none" placeholder="Details about the event..." />
                         </div>
                         <button type="submit" className="col-span-full py-5 bg-[#32F5FF] text-black font-black rounded-2xl hover:shadow-[0_0_40px_rgba(50,245,255,0.3)] transition-all flex items-center justify-center space-x-3">
                            <Rocket size={20} />
                            <span>Launch Event</span>
                         </button>
                      </form>
                   )}
                </div>
             )}

             {activePanel === 'post' && (
                <div className="max-w-3xl mx-auto">
                   <div className="flex items-center space-x-6 mb-10">
                      <div className="w-14 h-14 bg-[#FF2BCD] text-white rounded-2xl flex items-center justify-center">
                         <ImageIcon size={28} />
                      </div>
                      <div>
                         <h3 className="text-3xl font-black">Upload Post</h3>
                         <p className="text-gray-500 font-medium">Share updates and photos with your campus</p>
                      </div>
                   </div>

                   {postSubmitted ? (
                      <div className="text-center py-16">
                         <div className="w-24 h-24 bg-[#FF2BCD]/10 text-[#FF2BCD] rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(255,43,205,0.2)]">
                            <CheckCircle2 size={48} />
                         </div>
                         <h4 className="text-3xl font-black mb-4">Post Published!</h4>
                         <p className="text-gray-400 text-lg">Your update is now live on the community feed.</p>
                      </div>
                   ) : (
                      <form onSubmit={handlePostSubmit} className="space-y-8">
                         {postError && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl font-bold flex items-center space-x-3"><AlertCircle size={18} /> <span>{postError}</span></div>}
                         <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Caption</label>
                            <textarea required value={postForm.caption} onChange={(e) => setPostForm({ ...postForm, caption: e.target.value })} className="w-full h-40 bg-[#05070A] border border-white/10 rounded-2xl px-6 py-5 text-white font-medium focus:border-[#FF2BCD]/50 outline-none resize-none" placeholder="What's happening?" />
                         </div>
                         <button type="submit" className="w-full py-5 bg-[#FF2BCD] text-white font-black rounded-2xl hover:shadow-[0_0_40px_rgba(255,43,205,0.3)] transition-all flex items-center justify-center space-x-3">
                            <ArrowRight size={20} />
                            <span>Publish to Feed</span>
                         </button>
                      </form>
                   )}
                </div>
             )}

             {activePanel === 'referral' && (
                <div className="max-w-3xl mx-auto">
                   <div className="flex items-center space-x-6 mb-10">
                      <div className="w-14 h-14 bg-white text-black rounded-2xl flex items-center justify-center">
                         <Users size={28} />
                      </div>
                      <div>
                         <h3 className="text-3xl font-black">Submit Referral</h3>
                         <p className="text-gray-500 font-medium">Earn rewards for growing the Crezco network</p>
                      </div>
                   </div>

                   {referralSubmitted ? (
                      <div className="text-center py-16">
                         <div className="w-24 h-24 bg-white/10 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                            <CheckCircle2 size={48} />
                         </div>
                         <h4 className="text-3xl font-black mb-4">Referral Received!</h4>
                         <p className="text-gray-400 text-lg">Our vetting team will review the candidate and update you.</p>
                      </div>
                   ) : (
                      <form onSubmit={handleReferralSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Candidate Name</label>
                            <input type="text" required value={referralForm.name} onChange={(e) => setReferralForm({ ...referralForm, name: e.target.value })} className="w-full bg-[#05070A] border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:border-white/50 outline-none" placeholder="Ex: John Smith" />
                         </div>
                         <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Category</label>
                            <div className="relative">
                               <select required value={referralForm.type} onChange={(e) => setReferralForm({ ...referralForm, type: e.target.value })} className="w-full bg-[#05070A] border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:border-white/50 outline-none appearance-none">
                                  <option value="">Select Referral Type</option>
                                  <option value="Hiring">Hiring Recommendation</option>
                                  <option value="Product">Product Partnership</option>
                                  <option value="Event">Event Collaboration</option>
                                  <option value="CC">Candidate Coordinator</option>
                               </select>
                               <ChevronDown size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500" />
                            </div>
                         </div>
                         <button type="submit" className="col-span-full py-5 bg-white text-black font-black rounded-2xl hover:scale-[1.02] transition-transform shadow-xl flex items-center justify-center space-x-3">
                            <Send size={20} />
                            <span>Log Referral</span>
                         </button>
                      </form>
                   )}
                </div>
             )}
          </div>
        )}

        {/* CC Activity Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="bg-[#0D0F1A] border border-white/5 rounded-[2rem] p-8">
              <div className="text-gray-500 text-xs font-black uppercase tracking-[0.2em] mb-2">Total Outreach</div>
              <div className="text-4xl font-black">4.2k</div>
              <div className="text-green-500 text-xs font-bold mt-2 flex items-center space-x-1">
                 <span>↑ 12%</span>
                 <span className="text-gray-600 font-medium">from last week</span>
              </div>
           </div>
           <div className="bg-[#0D0F1A] border border-white/5 rounded-[2rem] p-8">
              <div className="text-gray-500 text-xs font-black uppercase tracking-[0.2em] mb-2">Events Hosted</div>
              <div className="text-4xl font-black">{myColleges.length > 0 ? '08' : '00'}</div>
              <div className="text-[#32F5FF] text-xs font-bold mt-2">Next: Hackathon (May 12)</div>
           </div>
           <div className="bg-[#0D0F1A] border border-white/5 rounded-[2rem] p-8">
              <div className="text-gray-500 text-xs font-black uppercase tracking-[0.2em] mb-2">Referral Rewards</div>
              <div className="text-4xl font-black">₹ 1,500</div>
              <div className="text-[#FF2BCD] text-xs font-bold mt-2">Redeemable now</div>
           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
