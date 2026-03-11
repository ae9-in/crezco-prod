import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useUserRole } from '../context/UserRoleContext';
import api from '../lib/axios';
import { createPost, createEvent } from '../lib/api';

const Dashboard: React.FC = () => {
  const { user, userRole, loading: authLoading, roleLoading } = useUserRole();

  const [displayName, setDisplayName] = useState<string>('');
  const [allColleges, setAllColleges] = useState<any[]>([]);
  const [memberCollegeIds, setMemberCollegeIds] = useState<Set<string>>(new Set());
  const [selectedCollegeId, setSelectedCollegeId] = useState<string>('');
  const [joinLoading, setJoinLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [newCollegeName, setNewCollegeName] = useState('');
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [eventForm, setEventForm] = useState({ title: '', description: '', date: '', college: '' });
  const [eventSubmitted, setEventSubmitted] = useState(false);
  const [eventError, setEventError] = useState<string | null>(null);
  const [postForm, setPostForm] = useState<{ caption: string, file: File | null }>({ caption: '', file: null });
  const [postSubmitted, setPostSubmitted] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);
  const [reelForm, setReelForm] = useState<{ caption: string, file: File | null }>({ caption: '', file: null });
  const [reelSubmitted, setReelSubmitted] = useState(false);
  const [reelError, setReelError] = useState<string | null>(null);
  const [referralForm, setReferralForm] = useState({ name: '', type: '' });
  const [referralSubmitted, setReferralSubmitted] = useState(false);
  const [statsData, setStatsData] = useState({ events: 0, posts: 0 });

  useEffect(() => {
    if (user) {
        setDisplayName(user.name || user.email.split('@')[0]);
    }
  }, [user]);

  const loadColleges = async () => {
    try {
      const response = await api.get('/colleges');
      const data = response.data;
      setAllColleges(data || []);
      
      if (user) {
        const myResponse = await api.get('/colleges/my');
        const myData = myResponse.data;
        const mySet = new Set<string>();
        myData.forEach((m: any) => {
            mySet.add(m.college_id._id || m.college_id);
        });
        setMemberCollegeIds(mySet);
        if (!selectedCollegeId && mySet.size > 0) {
          const first = Array.from(mySet)[0];
          setSelectedCollegeId(first);
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
    return allColleges.filter((c) => memberCollegeIds.has(c._id || c.id));
  }, [allColleges, memberCollegeIds]);

  const availableColleges = useMemo(() => {
    return allColleges.filter((c) => !memberCollegeIds.has(c._id || c.id));
  }, [allColleges, memberCollegeIds]);

  const handleJoinCollege = async (collegeId: string) => {
    if (!user || !collegeId) return;
    setJoinLoading(true);
    try {
      await api.post(`/colleges/${collegeId}/join`, { role: 'member' });
      const next = new Set(memberCollegeIds);
      next.add(collegeId);
      setMemberCollegeIds(next);
      setSelectedCollegeId(collegeId);
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
      const response = await api.post('/colleges', { name: newCollegeName.trim() });
      const college = response.data;
      setAllColleges([college, ...allColleges]);
      const next = new Set(memberCollegeIds);
      next.add(college._id);
      setMemberCollegeIds(next);
      setSelectedCollegeId(college._id);
      setNewCollegeName('');
    } catch(err) {
        console.error('Create failed', err);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedCollegeId) return;
    setEventError(null);
    try {
      await createEvent(selectedCollegeId, eventForm.title, eventForm.description, eventForm.date);
      setEventSubmitted(true);
      setTimeout(() => {
        setEventSubmitted(false);
        setEventForm({ title: '', description: '', date: '', college: '' });
        setActivePanel(null);
      }, 3000);
    } catch (err: any) {
      setEventError(err.response?.data?.message || 'Failed to create event.');
    }
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedCollegeId) return;
    setPostError(null);
    try {
      if (postForm.file) {
        const formData = new FormData();
        formData.append('college_id', selectedCollegeId);
        formData.append('content', postForm.caption);
        formData.append('media', postForm.file);
        await api.post('/posts', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await createPost(selectedCollegeId, postForm.caption);
      }
      setPostSubmitted(true);
      setTimeout(() => {
        setPostSubmitted(false);
        setPostForm({ caption: '', file: null });
        setActivePanel(null);
      }, 3000);
    } catch (err: any) {
      setPostError(err.response?.data?.message || 'Failed to upload post.');
    }
  };

  const handleReelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedCollegeId || !reelForm.file) return;
    setReelError(null);
    try {
        const formData = new FormData();
        formData.append('college_id', selectedCollegeId);
        formData.append('caption', reelForm.caption);
        formData.append('video', reelForm.file);
        await api.post('/reels', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
      setReelSubmitted(true);
      setTimeout(() => {
        setReelSubmitted(false);
        setReelForm({ caption: '', file: null });
        setActivePanel(null);
      }, 3000);
    } catch (err: any) {
      setReelError(err.response?.data?.message || 'Failed to upload reel.');
    }
  };

  const handleReferralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReferralSubmitted(true);
    setTimeout(() => {
      setReferralSubmitted(false);
      setReferralForm({ name: '', type: '' });
      setActivePanel(null);
    }, 3000);
  };

  const initials = displayName
    ? displayName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase() || '')
      .join('') || 'U'
    : 'U';

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#05070A] text-white flex flex-col">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF2BCD] mb-4"></div>
          <p className="text-gray-400 uppercase tracking-widest text-sm font-bold font-inter">Connecting...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (roleLoading && !userRole) {
    return (
      <div className="min-h-screen bg-[#05070A] text-white flex flex-col">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF2BCD] mb-4"></div>
          <p className="text-gray-500 text-xs font-medium font-inter">Verifying permissions...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (userRole !== 'cc') {
    return (
      <div className="min-h-screen bg-[#05070A] text-white flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-[#0D0F1A] border border-[#FF2BCD]/30 rounded-2xl p-8 shadow-2xl">
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2 font-outfit">Access Restricted</h1>
              <p className="text-gray-400 font-inter">Only Campus Coordinators can access this dashboard.</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070A] text-white flex flex-col">
        <Navbar />

        <main className="flex-grow pt-32 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-[#0D0F1A] border border-white/5 rounded-2xl p-8 mb-8 flex items-center space-x-6 relative overflow-hidden group">
                    <div className="absolute top-[-20%] right-[-10%] w-[30%] h-[150%] bg-[#FF2BCD] opacity-5 blur-[100px] rounded-full group-hover:opacity-10 transition-opacity"></div>
                    <div className="w-20 h-20 bg-gradient-to-br from-[#FF2BCD] via-[#8A2FFF] to-[#32F5FF] rounded-2xl flex items-center justify-center shadow-lg shadow-[#FF2BCD]/20 transform rotate-3">
                        <span className="text-3xl font-bold text-white -rotate-3">{initials}</span>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-white font-outfit mb-1">{displayName}</h2>
                        <div className="flex items-center space-x-2">
                            <span className="px-3 py-1 bg-[#FF2BCD]/20 text-[#FF2BCD] text-[10px] font-bold rounded-lg uppercase tracking-widest">
                                Campus Coordinator
                            </span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions (Colleges) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-[#0D0F1A] border border-white/5 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 font-outfit">Join a College</h3>
                        <div className="flex items-center space-x-3">
                            <select
                                className="flex-1 px-4 py-3 bg-[#05070A] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#FF2BCD]/50 appearance-none font-inter text-sm"
                                onChange={(e) => setSelectedCollegeId(e.target.value)}
                                value={selectedCollegeId}
                            >
                                <option value="" disabled>Select a college</option>
                                {availableColleges.map((c) => (
                                    <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>
                                ))}
                            </select>
                            <button
                                onClick={() => handleJoinCollege(selectedCollegeId)}
                                disabled={!selectedCollegeId || joinLoading}
                                className="px-6 py-3 bg-[#FF2BCD] text-white font-bold rounded-xl disabled:opacity-50 hover:opacity-90 transition-all font-inter text-sm shadow-lg shadow-[#FF2BCD]/10"
                            >
                                {joinLoading ? 'Joining...' : 'Join'}
                            </button>
                        </div>
                    </div>
                    <div className="bg-[#0D0F1A] border border-white/5 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 font-outfit">Launch New College</h3>
                        <div className="flex items-center space-x-3">
                            <input
                                type="text"
                                value={newCollegeName}
                                onChange={(e) => setNewCollegeName(e.target.value)}
                                placeholder="Enter college name"
                                className="flex-1 px-4 py-3 bg-[#05070A] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#32F5FF]/50 font-inter text-sm"
                            />
                            <button
                                onClick={handleCreateCollege}
                                disabled={!newCollegeName.trim() || createLoading}
                                className="px-6 py-3 bg-[#32F5FF] text-black font-bold rounded-xl disabled:opacity-50 hover:opacity-90 transition-all font-inter text-sm shadow-lg shadow-[#32F5FF]/10"
                            >
                                {createLoading ? 'Launching...' : 'Launch'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Active Selection */}
                {myColleges.length > 0 && (
                    <div className="bg-[#0D0F1A] border border-white/5 rounded-2xl p-6 mb-8 flex items-center justify-between">
                        <div className="text-gray-400 font-medium text-sm font-inter">Manage Community:</div>
                        <select
                            className="bg-transparent text-[#32F5FF] font-bold font-outfit focus:outline-none text-right cursor-pointer text-lg"
                            value={selectedCollegeId}
                            onChange={(e) => setSelectedCollegeId(e.target.value)}
                        >
                            {myColleges.map((c) => (
                                <option key={c._id || c.id} value={c._id || c.id} className="bg-[#0D0F1A] text-white">{c.name}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Dashboard Tools */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <button
                        onClick={() => myColleges.length > 0 && setActivePanel(activePanel === 'event' ? null : 'event')}
                        className={`p-6 rounded-2xl border transition-all flex flex-col items-center justify-center space-y-3 group ${activePanel === 'event' ? 'bg-[#32F5FF]/10 border-[#32F5FF]' : 'bg-[#0D0F1A] border-white/5 hover:border-[#32F5FF]/30'}`}
                        disabled={myColleges.length === 0}
                    >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${activePanel === 'event' ? 'bg-[#32F5FF] text-black' : 'bg-gray-800 text-gray-400 group-hover:text-[#32F5FF]'}`}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <span className="text-sm font-bold font-inter">Event</span>
                    </button>

                    <button
                        onClick={() => myColleges.length > 0 && setActivePanel(activePanel === 'post' ? null : 'post')}
                        className={`p-6 rounded-2xl border transition-all flex flex-col items-center justify-center space-y-3 group ${activePanel === 'post' ? 'bg-[#FF2BCD]/10 border-[#FF2BCD]' : 'bg-[#0D0F1A] border-white/5 hover:border-[#FF2BCD]/30'}`}
                        disabled={myColleges.length === 0}
                    >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${activePanel === 'post' ? 'bg-[#FF2BCD] text-white' : 'bg-gray-800 text-gray-400 group-hover:text-[#FF2BCD]'}`}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                        </div>
                        <span className="text-sm font-bold font-inter">Post</span>
                    </button>

                    <button
                        onClick={() => myColleges.length > 0 && setActivePanel(activePanel === 'reel' ? null : 'reel')}
                        className={`p-6 rounded-2xl border transition-all flex flex-col items-center justify-center space-y-3 group ${activePanel === 'reel' ? 'bg-[#8A2FFF]/10 border-[#8A2FFF]' : 'bg-[#0D0F1A] border-white/5 hover:border-[#8A2FFF]/30'}`}
                        disabled={myColleges.length === 0}
                    >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${activePanel === 'reel' ? 'bg-[#8A2FFF] text-white' : 'bg-gray-800 text-gray-400 group-hover:text-[#8A2FFF]'}`}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <span className="text-sm font-bold font-inter">Reel</span>
                    </button>

                    <button
                        onClick={() => setActivePanel(activePanel === 'referral' ? null : 'referral')}
                        className={`p-6 rounded-2xl border transition-all flex flex-col items-center justify-center space-y-3 group ${activePanel === 'referral' ? 'bg-white/10 border-white' : 'bg-[#0D0F1A] border-white/5 hover:border-white/30'}`}
                    >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${activePanel === 'referral' ? 'bg-white text-black' : 'bg-gray-800 text-gray-400 group-hover:text-white'}`}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <span className="text-sm font-bold font-inter">Referral</span>
                    </button>
                </div>

                {/* Panel Rendering */}
                {activePanel && (
                    <div className="bg-[#0D0F1A] border border-white/5 rounded-2xl p-8 mb-8 animate-fade-in shadow-2xl">
                        {activePanel === 'event' && (
                            <div className="max-w-2xl mx-auto">
                                <h3 className="text-2xl font-bold text-white mb-6 font-outfit">Create Event</h3>
                                {eventSubmitted ? (
                                    <div className="text-center py-10">
                                        <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <h4 className="text-xl font-bold text-white mb-2">Event Launched!</h4>
                                        <p className="text-gray-400">All members of your community will be notified.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleEventSubmit} className="space-y-6">
                                        {eventError && <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm">{eventError}</div>}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-gray-500 text-sm font-bold mb-2 uppercase tracking-widest font-inter">Title</label>
                                                <input type="text" required value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} className="w-full px-4 py-3 bg-[#05070A] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#32F5FF]/50" />
                                            </div>
                                            <div>
                                                <label className="block text-gray-500 text-sm font-bold mb-2 uppercase tracking-widest font-inter">Date</label>
                                                <input type="date" required value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} className="w-full px-4 py-3 bg-[#05070A] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#32F5FF]/50" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-gray-500 text-sm font-bold mb-2 uppercase tracking-widest font-inter">Description</label>
                                            <textarea required value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} className="w-full px-4 py-3 bg-[#05070A] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#32F5FF]/50 resize-none h-32" />
                                        </div>
                                        <button type="submit" className="w-full py-4 bg-[#32F5FF] text-black font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-[#32F5FF]/10 uppercase tracking-widest font-inter">Create Event</button>
                                    </form>
                                )}
                            </div>
                        )}

                        {activePanel === 'post' && (
                            <div className="max-w-2xl mx-auto">
                                <h3 className="text-2xl font-bold text-white mb-6 font-outfit">Upload Post</h3>
                                {postSubmitted ? (
                                    <div className="text-center py-10">
                                        <div className="w-20 h-20 bg-[#FF2BCD]/20 text-[#FF2BCD] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <h4 className="text-xl font-bold text-white mb-2">Post Shared!</h4>
                                        <p className="text-gray-400">Your post is now live on the community feed.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handlePostSubmit} className="space-y-6">
                                        {postError && <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm">{postError}</div>}
                                        <div>
                                            <label className="block text-gray-500 text-sm font-bold mb-2 uppercase tracking-widest font-inter">Caption</label>
                                            <textarea required value={postForm.caption} onChange={(e) => setPostForm({ ...postForm, caption: e.target.value })} className="w-full px-4 py-3 bg-[#05070A] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#FF2BCD]/50 resize-none h-32" />
                                        </div>
                                        <div>
                                            <label className="block text-gray-500 text-sm font-bold mb-2 uppercase tracking-widest font-inter">Media (Optional)</label>
                                            <input type="file" accept="image/*,video/*" onChange={(e) => setPostForm({ ...postForm, file: e.target.files?.[0] || null })} className="w-full px-4 py-3 bg-[#05070A] border border-white/10 rounded-xl text-white file:bg-transparent file:border-none file:text-[#FF2BCD] file:font-bold file:mr-4 file:cursor-pointer" />
                                        </div>
                                        <button type="submit" className="w-full py-4 bg-[#FF2BCD] text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-[#FF2BCD]/10 uppercase tracking-widest font-inter">Publish Post</button>
                                    </form>
                                )}
                            </div>
                        )}

                        {activePanel === 'reel' && (
                            <div className="max-w-2xl mx-auto">
                                <h3 className="text-2xl font-bold text-white mb-6 font-outfit">Upload Reel</h3>
                                {reelSubmitted ? (
                                    <div className="text-center py-10">
                                        <div className="w-20 h-20 bg-[#8A2FFF]/20 text-[#8A2FFF] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <h4 className="text-xl font-bold text-white mb-2">Reel Uploaded!</h4>
                                        <p className="text-gray-400">Short and sweet. Your reel is live.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleReelSubmit} className="space-y-6">
                                        {reelError && <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm">{reelError}</div>}
                                        <div>
                                            <label className="block text-gray-500 text-sm font-bold mb-2 uppercase tracking-widest font-inter">Caption</label>
                                            <textarea required value={reelForm.caption} onChange={(e) => setReelForm({ ...reelForm, caption: e.target.value })} className="w-full px-4 py-3 bg-[#05070A] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8A2FFF]/50 resize-none h-20" />
                                        </div>
                                        <div>
                                            <label className="block text-gray-500 text-sm font-bold mb-2 uppercase tracking-widest font-inter">Video Source</label>
                                            <input type="file" required accept="video/*" onChange={(e) => setReelForm({ ...reelForm, file: e.target.files?.[0] || null })} className="w-full px-4 py-3 bg-[#05070A] border border-white/10 rounded-xl text-white file:bg-transparent file:border-none file:text-[#8A2FFF] file:font-bold file:mr-4 file:cursor-pointer" />
                                        </div>
                                        <button type="submit" className="w-full py-4 bg-[#8A2FFF] text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-[#8A2FFF]/10 uppercase tracking-widest font-inter">Push Reel Live</button>
                                    </form>
                                )}
                            </div>
                        )}

                        {activePanel === 'referral' && (
                            <div className="max-w-2xl mx-auto">
                                <h3 className="text-2xl font-bold text-white mb-6 font-outfit">Submit Referral</h3>
                                {referralSubmitted ? (
                                    <div className="text-center py-10">
                                        <div className="w-20 h-20 bg-white/10 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                        </div>
                                        <h4 className="text-xl font-bold text-white mb-2">Referral Logged!</h4>
                                        <p className="text-gray-400">Our team will review your referral soon.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleReferralSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-gray-500 text-sm font-bold mb-2 uppercase tracking-widest font-inter">Candidate Name</label>
                                                <input type="text" required value={referralForm.name} onChange={(e) => setReferralForm({ ...referralForm, name: e.target.value })} className="w-full px-4 py-3 bg-[#05070A] border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/50" />
                                            </div>
                                            <div>
                                                <label className="block text-gray-500 text-sm font-bold mb-2 uppercase tracking-widest font-inter">Referral Type</label>
                                                <select required value={referralForm.type} onChange={(e) => setReferralForm({ ...referralForm, type: e.target.value })} className="w-full px-4 py-3 bg-[#05070A] border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/50 font-inter">
                                                    <option value="">Select Category</option>
                                                    <option value="Hiring">Hiring</option>
                                                    <option value="Product">Product</option>
                                                    <option value="Event">Event</option>
                                                    <option value="CC">Candidate CC</option>
                                                </select>
                                            </div>
                                        </div>
                                        <button type="submit" className="w-full py-4 bg-white text-black font-bold rounded-xl hover:opacity-90 transition-all shadow-lg uppercase tracking-widest font-inter">Log Referral</button>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
        <Footer />
    </div>
  );
};

export default Dashboard;
