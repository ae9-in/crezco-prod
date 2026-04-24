import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../lib/axios';
import { useUserRole } from '../context/UserRoleContext';
import FeedInteraction from '../components/FeedInteraction';
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  Video, 
  Plus, 
  ChevronRight, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  X,
  Send,
  Zap
} from 'lucide-react';

const CollegeDetail: React.FC = () => {
  const { collegeId } = useParams<{ collegeId: string }>();
  const { user } = useUserRole();
  const [college, setCollege] = useState<any>(null);
  const [memberships, setMemberships] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [commentsMap, setCommentsMap] = useState<Record<string, any[]>>({}); // itemId -> comments
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMember, setIsMember] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);

  // Upload States
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isReelModalOpen, setIsReelModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');

  const fetchCollegeData = async () => {
    if (!collegeId) return;

    try {
      setLoading(true);
      setError('');

      const [collegeRes, memRes, postsRes, eventsRes] = await Promise.all([
        api.get(`/colleges/${collegeId}`),
        api.get(`/colleges/${collegeId}/members`),
        api.get(`/posts/college/${collegeId}`),
        api.get(`/events/college/${collegeId}`)
      ]);

      setCollege(collegeRes.data);
      setMemberships(memRes.data || []);
      setPosts(postsRes.data || []);
      setEvents(eventsRes.data || []);

      if (user) {
        const myRes = await api.get('/colleges/my');
        const isJoined = myRes.data.some((m: any) => (m.college_id._id || m.college_id) === collegeId);
        setIsMember(isJoined);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load college data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollegeData();
  }, [collegeId, user]);

  const handleJoinCollege = async () => {
    if (!user || !collegeId) return;
    try {
      setJoinLoading(true);
      await api.post(`/colleges/${collegeId}/join`, { role: 'member' });
      setIsMember(true);
      fetchCollegeData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to join college');
    } finally {
      setJoinLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collegeId) return;

    try {
      setUploading(true);
      setError('');
      const formData = new FormData();
      formData.append('college_id', collegeId);
      formData.append('content', caption);
      if (selectedFile) formData.append('media', selectedFile);

      await api.post('/posts', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
      });

      setIsPostModalOpen(false);
      setSelectedFile(null);
      setCaption('');
      fetchCollegeData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setUploading(false);
    }
  };

  const handleUploadReel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !collegeId) return;

    try {
      setUploading(true);
      setError('');
      const formData = new FormData();
      formData.append('college_id', collegeId);
      formData.append('caption', caption);
      formData.append('video', selectedFile);

      await api.post('/reels', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
      });

      setIsReelModalOpen(false);
      setSelectedFile(null);
      setCaption('');
      fetchCollegeData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload reel');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070A] text-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#32F5FF]/20 border-t-[#32F5FF] rounded-full animate-spin"></div>
          <p className="text-gray-500 font-black uppercase tracking-widest text-[10px]">Entering Campus</p>
        </div>
      </div>
    );
  }

  if (error || !college) {
    return (
      <div className="min-h-screen bg-[#05070A] text-white flex flex-col">
          <Navbar />
          <main className="flex-grow flex flex-col items-center justify-center p-8 text-center pt-28">
              <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-red-500/10">
                <AlertCircle size={40} />
              </div>
              <h2 className="text-3xl font-black mb-4 uppercase tracking-tight">{error || 'College not found'}</h2>
              <p className="text-gray-400 font-medium max-w-sm mb-10 leading-relaxed">
                We couldn't locate this campus community. It might have been relocated or initialized under a different name.
              </p>
              <button onClick={() => window.location.href='/colleges'} className="px-10 py-4 bg-white text-black font-black rounded-2xl hover:scale-105 transition-transform">
                Browse Colleges
              </button>
          </main>
          <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070A] text-white flex flex-col selection:bg-[#FF2BCD]/30">
      <Navbar />

      <main className="flex-grow pt-28 pb-20">
          {/* Immersive Header */}
          <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden">
             {/* Dynamic Background */}
             <div className="absolute inset-0 bg-gradient-to-b from-[#0D0F1A] via-[#05070A] to-[#05070A]"></div>
             <div className="absolute -top-[10%] -right-[5%] w-[40%] h-[60%] bg-[#FF2BCD] opacity-5 blur-[120px] rounded-full"></div>
             <div className="absolute -bottom-[10%] -left-[5%] w-[40%] h-[60%] bg-[#32F5FF] opacity-5 blur-[120px] rounded-full"></div>
             
             {/* Grid Overlay */}
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

             <div className="relative z-10 max-w-6xl mx-auto px-6 text-center space-y-12">
               <div className="space-y-4">
                  <div className="inline-flex items-center space-x-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-xl">
                     <MapPin size={14} className="text-[#32F5FF]" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Active Campus Community</span>
                  </div>
                  <h1 className="text-5xl sm:text-8xl font-black tracking-tight leading-[1.1]">
                    <span className="bg-gradient-to-r from-[#FF2BCD] via-[#8A2FFF] to-[#32F5FF] bg-clip-text text-transparent">
                      {college.name}
                    </span>
                  </h1>
               </div>

               <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                 <div className="flex items-center space-x-4 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl">
                   <div className="flex -space-x-2">
                     {[1,2,3,4].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-[#05070A] bg-gray-800 flex items-center justify-center text-[10px] font-black text-gray-400">
                          {String.fromCharCode(64 + i)}
                        </div>
                     ))}
                   </div>
                   <div className="text-left">
                     <div className="text-lg font-black leading-none">{memberships.length}</div>
                     <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Joined Members</div>
                   </div>
                 </div>

                 {user && !isMember ? (
                   <button
                     onClick={handleJoinCollege}
                     disabled={joinLoading}
                     className="px-12 py-5 bg-white text-black font-black rounded-2xl hover:scale-105 transition-all shadow-2xl shadow-white/10 disabled:opacity-50 flex items-center space-x-3"
                   >
                     {joinLoading ? <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div> : <><Zap size={18} /> <span>Join Community</span></>}
                   </button>
                 ) : isMember && (
                   <div className="flex flex-wrap justify-center gap-4">
                      <button
                        onClick={() => setIsPostModalOpen(true)}
                        className="px-8 py-4 bg-[#FF2BCD] text-white font-black rounded-2xl hover:shadow-[0_0_25px_rgba(255,43,205,0.4)] transition-all flex items-center space-x-2"
                      >
                        <Plus size={18} />
                        <span>Post Update</span>
                      </button>
                      <button
                        onClick={() => setIsReelModalOpen(true)}
                        className="px-8 py-4 bg-[#32F5FF] text-black font-black rounded-2xl hover:shadow-[0_0_25px_rgba(50,245,255,0.4)] transition-all flex items-center space-x-2"
                      >
                        <Video size={18} />
                        <span>Share Reel</span>
                      </button>
                   </div>
                 )}
               </div>
             </div>
          </section>

          <section className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
               
               {/* Left Column: Feed & Content */}
               <div className="lg:col-span-8 space-y-16">
                  
                  {/* Membership Highlights */}
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                       <h2 className="text-2xl font-black uppercase tracking-tight flex items-center space-x-3">
                          <Users size={24} className="text-[#32F5FF]" />
                          <span>Campus Leaders</span>
                       </h2>
                       <button className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">View All</button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                       {memberships.slice(0, 4).map((membership: any) => {
                          const userName = (membership.user_id?.name || membership.user_id?.email || 'User');
                          const initials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
                          return (
                            <div key={membership._id} className="p-6 bg-[#0D0F1A] border border-white/5 rounded-3xl text-center group hover:border-[#32F5FF]/30 transition-all">
                               <div className="w-16 h-16 bg-gradient-to-br from-[#151926] to-[#0A0F15] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5 group-hover:scale-105 transition-transform duration-500">
                                  <span className="text-xl font-black text-white">{initials}</span>
                               </div>
                               <h3 className="font-bold text-sm truncate mb-1">{userName.split(' ')[0]}</h3>
                               <div className="text-[8px] font-black uppercase tracking-widest text-gray-500">{membership.role || 'Member'}</div>
                            </div>
                          );
                       })}
                    </div>
                  </div>

                  {/* Feed */}
                  <div className="space-y-10">
                    <div className="flex items-center justify-between">
                       <h2 className="text-2xl font-black uppercase tracking-tight flex items-center space-x-3">
                          <MessageSquare size={24} className="text-[#FF2BCD]" />
                          <span>Campus Buzz</span>
                       </h2>
                    </div>

                    <div className="space-y-8">
                        {posts.length > 0 ? (
                        posts.map((post) => (
                            <div key={post._id || post.id} className="bg-[#0D0F1A] border border-white/5 rounded-[2.5rem] overflow-hidden p-6 sm:p-10 hover:border-white/10 transition-all group">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5">
                                            <span className="text-white font-black text-lg">{(post.created_by?.name?.[0] || 'U').toUpperCase()}</span>
                                        </div>
                                        <div>
                                            <p className="text-white font-black text-base">{post.created_by?.name || 'Anonymous'}</p>
                                            <div className="flex items-center space-x-2 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                                               <Clock size={12} />
                                               <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="p-2 text-gray-600 hover:text-white transition-colors">
                                       <Plus className="rotate-45" size={20} />
                                    </button>
                                </div>
                                
                                <p className="text-gray-300 mb-8 font-medium text-lg leading-relaxed">{post.content}</p>
                                
                                {post.media_url && (
                                    <div className="rounded-[2rem] overflow-hidden mb-8 border border-white/5">
                                        <img src={post.media_url} alt="Post content" className="w-full h-auto max-h-[500px] object-cover group-hover:scale-[1.02] transition-transform duration-700" />
                                    </div>
                                )}

                                <div className="pt-8 border-t border-white/5">
                                    <FeedInteraction
                                        itemId={post._id || post.id}
                                        itemType="post"
                                        collegeId={collegeId as string}
                                        likeCount={post.like_count || 0}
                                        commentCount={post.comment_count || 0}
                                        hasLiked={post.has_liked || false}
                                        comments={commentsMap[post._id || post.id] || []}
                                        isMember={isMember}
                                        onLikeToggle={async () => {
                                            if (!user) return;
                                            setPosts(prev => prev.map(p => (p._id || p.id) === (post._id || post.id) ? {
                                                ...p,
                                                has_liked: !p.has_liked,
                                                like_count: (p.like_count || 0) + (p.has_liked ? -1 : 1)
                                            } : p));
                                            try {
                                                await api.post(`/interactions/like`, {
                                                    item_id: post._id || post.id,
                                                    item_type: 'post'
                                                });
                                            } catch (err) { console.error(err); }
                                        }}
                                        onCommentAdd={async (text) => {
                                            if (!user || !isMember) return;
                                            try {
                                                const res = await api.post('/interactions/comment', {
                                                    item_id: post._id || post.id,
                                                    item_type: 'post',
                                                    content: text
                                                });
                                                setCommentsMap(prev => ({
                                                    ...prev,
                                                    [post._id || post.id]: [...(prev[post._id || post.id] || []), res.data]
                                                }));
                                                setPosts(prev => prev.map(p => (p._id || p.id) === (post._id || post.id) ? {
                                                    ...p,
                                                    comment_count: (p.comment_count || 0) + 1
                                                } : p));
                                            } catch (err) { console.error(err); }
                                        }}
                                    />
                                </div>
                            </div>
                        ))
                        ) : (
                        <div className="py-24 text-center bg-[#0D0F1A] border border-dashed border-white/5 rounded-[3rem]">
                           <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-700">
                              <MessageSquare size={32} />
                           </div>
                           <h3 className="text-xl font-black mb-2 uppercase tracking-tight">Empty Feed</h3>
                           <p className="text-gray-500 font-medium italic">Be the first to share something amazing with your campus!</p>
                        </div>
                        )}
                    </div>
                  </div>
               </div>

               {/* Right Column: Events & Sidebar */}
               <div className="lg:col-span-4 space-y-12">
                  <div className="sticky top-28 space-y-12">
                    {/* Events Panel */}
                    <div className="bg-[#0D0F1A] border border-white/5 rounded-[2.5rem] p-8 space-y-8">
                       <div className="flex items-center space-x-3">
                          <Calendar size={20} className="text-[#32F5FF]" />
                          <h2 className="text-xl font-black uppercase tracking-tight">Upcoming</h2>
                       </div>

                       <div className="space-y-6">
                          {events.length > 0 ? (
                          events.map((event) => (
                              <div key={event._id || event.id} className="relative group p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-[#32F5FF]/30 transition-all">
                                  <div className="flex items-start justify-between mb-4">
                                     <div className="px-3 py-1 bg-[#32F5FF]/10 text-[#32F5FF] text-[8px] font-black rounded-full uppercase tracking-widest">
                                        {new Date(event.event_date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                     </div>
                                     <div className="w-1 h-1 bg-[#32F5FF] rounded-full animate-pulse"></div>
                                  </div>
                                  <h3 className="text-white font-black text-sm mb-2 group-hover:text-[#32F5FF] transition-colors">{event.title}</h3>
                                  <p className="text-gray-500 text-[10px] font-medium line-clamp-2 leading-relaxed">{event.description}</p>
                                  <Link to={`/events/${event._id || event.id}`} className="mt-4 flex items-center text-[8px] font-black uppercase tracking-widest text-white group-hover:translate-x-1 transition-transform">
                                      <span>RSVP Details</span>
                                      <ChevronRight size={12} className="ml-1" />
                                  </Link>
                              </div>
                          ))
                          ) : (
                          <div className="py-12 text-center bg-[#05070A] rounded-3xl border border-dashed border-white/5">
                               <p className="text-gray-600 text-xs font-black uppercase tracking-widest italic">No events found</p>
                          </div>
                          )}
                       </div>
                    </div>

                    {/* Community Guidelines/About */}
                    <div className="bg-gradient-to-br from-[#FF2BCD]/10 to-[#8A2FFF]/10 border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                       <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                          <ShieldCheck size={24} className="text-white" />
                       </div>
                       <h3 className="text-xl font-black uppercase tracking-tight text-white">Guidelines</h3>
                       <p className="text-gray-400 text-xs font-medium leading-relaxed">
                          Be respectful, share helpful content, and keep the campus energy high. Official Crezco communities are moderated for safety.
                       </p>
                    </div>
                  </div>
               </div>

            </div>
          </section>

          {/* Modals - Modern Redesign */}
          {(isPostModalOpen || isReelModalOpen) && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-4 bg-[#05070A]/90 backdrop-blur-xl animate-in fade-in duration-300">
               <div className="bg-[#0D0F1A] border border-white/10 rounded-[3rem] w-full max-w-lg overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300">
                  <div className="p-8 sm:p-12 space-y-10">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isPostModalOpen ? 'bg-[#FF2BCD] text-white' : 'bg-[#32F5FF] text-black'}`}>
                              {isPostModalOpen ? <Plus size={24} /> : <Video size={24} />}
                           </div>
                           <h2 className="text-3xl font-black uppercase tracking-tight">{isPostModalOpen ? 'New Update' : 'New Reel'}</h2>
                        </div>
                        <button onClick={() => { setIsPostModalOpen(false); setIsReelModalOpen(false); setSelectedFile(null); setCaption(''); }} className="p-2 text-gray-500 hover:text-white transition-colors">
                           <X size={24} />
                        </button>
                     </div>

                     <form onSubmit={isPostModalOpen ? handleCreatePost : handleUploadReel} className="space-y-8">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Caption</label>
                           <textarea
                             value={caption}
                             onChange={(e) => setCaption(e.target.value)}
                             className={`w-full bg-[#05070A] border border-white/10 rounded-2xl p-6 text-white font-medium focus:outline-none transition-all resize-none ${isPostModalOpen ? 'focus:border-[#FF2BCD]/50 min-h-[160px]' : 'focus:border-[#32F5FF]/50 min-h-[120px]'}`}
                             placeholder={isPostModalOpen ? "What's happening on campus?" : "Share a catchy description for your reel..."}
                             required={isPostModalOpen}
                           />
                        </div>

                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Media</label>
                           <label className={`flex flex-col items-center justify-center w-full min-h-[140px] bg-[#05070A] border-2 border-dashed border-white/10 rounded-[2rem] cursor-pointer transition-all hover:bg-white/5 ${isPostModalOpen ? 'hover:border-[#FF2BCD]/50' : 'hover:border-[#32F5FF]/50'}`}>
                              <input
                                type="file"
                                accept={isPostModalOpen ? "image/*,video/*" : "video/*"}
                                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                className="hidden"
                                required={isReelModalOpen}
                              />
                              {selectedFile ? (
                                 <div className="flex flex-col items-center space-y-2">
                                    <CheckCircle2 size={32} className={isPostModalOpen ? 'text-[#FF2BCD]' : 'text-[#32F5FF]'} />
                                    <span className="font-bold text-xs text-white max-w-[200px] truncate">{selectedFile.name}</span>
                                 </div>
                              ) : (
                                 <div className="flex flex-col items-center space-y-2 text-gray-600">
                                    <ImageIcon size={32} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Click to upload {isPostModalOpen ? 'media' : 'video'}</span>
                                 </div>
                              )}
                           </label>
                        </div>

                        <button
                          type="submit"
                          disabled={uploading}
                          className={`w-full py-5 text-black font-black rounded-2xl transition-all flex items-center justify-center space-x-3 disabled:opacity-50 ${isPostModalOpen ? 'bg-[#FF2BCD] text-white hover:shadow-[0_0_30px_rgba(255,43,205,0.4)]' : 'bg-[#32F5FF] text-black hover:shadow-[0_0_30px_rgba(50,245,255,0.4)]'}`}
                        >
                          {uploading ? <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <><Send size={20} /> <span>{isPostModalOpen ? 'Publish Post' : 'Share Reel'}</span></>}
                        </button>
                     </form>
                  </div>
               </div>
            </div>
          )}
      </main>

      <Footer />
    </div>
  );
};

export default CollegeDetail;
