import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../lib/axios';
import { useUserRole } from '../context/UserRoleContext';
import FeedInteraction from '../components/FeedInteraction';

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
      <div className="min-h-screen bg-[#05070A] text-white flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#32F5FF]"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !college) {
    return (
      <div className="min-h-screen bg-[#05070A] text-white flex flex-col">
          <Navbar />
          <main className="flex-grow flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xl text-white font-bold font-outfit mb-2">{error || 'College not found'}</p>
              <p className="text-gray-400 font-inter text-sm max-w-xs">We couldn't locate this campus community. Please check the URL and try again.</p>
          </main>
          <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070A] text-white flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-16">
          {/* Header */}
          <section className="relative py-20 px-4 group">
            <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-br from-[#0D0F1A] via-[#151926] to-[#0A0F15] border-b border-white/5 overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[30%] h-[150%] bg-[#FF2BCD] opacity-5 blur-[100px] rounded-full group-hover:opacity-10 transition-opacity"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[120%] bg-[#32F5FF] opacity-5 blur-[120px] rounded-full group-hover:opacity-10 transition-opacity"></div>
            </div>
            
            <div className="relative z-10 max-w-6xl mx-auto text-center">
              <h1 className="text-4xl sm:text-6xl font-black mb-6 font-outfit">
                <span className="bg-gradient-to-r from-[#FF2BCD] via-[#8A2FFF] to-[#32F5FF] bg-clip-text text-transparent">
                  {college.name}
                </span>
              </h1>
              
              <div className="flex flex-col items-center space-y-8">
                <div className="flex items-center space-x-6 text-gray-400">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-[#32F5FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span className="font-bold text-white font-inter">{memberships.length}</span>
                    <span className="text-xs uppercase tracking-widest font-inter">Members</span>
                  </div>
                </div>

                {user && !isMember && (
                  <button
                    onClick={handleJoinCollege}
                    disabled={joinLoading}
                    className="px-10 py-4 bg-gradient-to-r from-[#FF2BCD] to-[#8A2FFF] text-white font-black rounded-2xl hover:shadow-[0_0_25px_rgba(255,43,205,0.4)] transition-all uppercase tracking-widest text-xs font-inter disabled:opacity-50"
                  >
                    {joinLoading ? 'Syncing...' : 'Join Community'}
                  </button>
                )}

                {isMember && (
                  <div className="flex flex-col items-center space-y-6">
                    <span className="px-4 py-1.5 bg-white/5 border border-white/10 text-gray-400 text-[10px] font-bold rounded-lg uppercase tracking-widest font-inter">
                        Authorized Member
                    </span>
                    <div className="flex flex-wrap justify-center gap-4">
                      <button
                        onClick={() => setIsPostModalOpen(true)}
                        className="px-8 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all font-inter text-xs uppercase tracking-widest"
                      >
                        Create Post
                      </button>
                      <button
                        onClick={() => setIsReelModalOpen(true)}
                        className="px-8 py-3 bg-[#32F5FF] text-black font-bold rounded-xl hover:shadow-[0_0_15px_rgba(50,245,255,0.3)] transition-all font-inter text-xs uppercase tracking-widest"
                      >
                        Upload Reel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              {/* Members Grid */}
              <div className="mb-20">
                <div className="flex items-center space-x-3 mb-10">
                    <div className="w-1.5 h-8 bg-gradient-to-b from-[#32F5FF] to-[#8A2FFF] rounded-full"></div>
                    <h2 className="text-2xl font-bold font-outfit uppercase tracking-wider">Active Members</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                    {memberships.map((membership: any, index: number) => {
                      const userName = (membership.user_id?.name || membership.user_id?.email || 'User').split(' ')[0];
                      const role = membership.role || 'Member';
                      return (
                        <div
                          key={membership._id || membership.id}
                          className="bg-[#0D0F1A] border border-white/5 rounded-2xl p-6 text-center group hover:border-white/10 transition-all"
                        >
                          <div className={`w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5 group-hover:scale-110 transition-transform`}>
                            <span className="font-black text-white text-xl font-outfit">{(userName[0] || 'U').toUpperCase()}</span>
                          </div>
                          <h3 className="text-white font-bold mb-1 font-outfit truncate">{userName}</h3>
                          <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest font-inter">{role}</p>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Feed & Events */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Posts Feed */}
                <div className="lg:col-span-2">
                    <div className="flex items-center space-x-3 mb-10">
                        <div className="w-1.5 h-8 bg-[#FF2BCD] rounded-full"></div>
                        <h2 className="text-2xl font-bold font-outfit uppercase tracking-wider">Campus Feed</h2>
                    </div>
                    
                    <div className="space-y-8">
                        {posts.length > 0 ? (
                        posts.map((post) => (
                            <div key={post._id || post.id} className="bg-[#0D0F1A] border border-white/5 rounded-3xl overflow-hidden p-6 hover:border-white/10 transition-all">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/5">
                                            <span className="text-white font-bold font-outfit">{(post.created_by?.name?.[0] || 'U').toUpperCase()}</span>
                                        </div>
                                        <div>
                                            <p className="text-white font-bold font-inter text-sm">{post.created_by?.name || 'Anonymous'}</p>
                                            <p className="text-gray-500 text-[10px] font-inter uppercase tracking-widest">{new Date(post.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <p className="text-gray-300 mb-8 font-inter leading-relaxed">{post.content}</p>
                                
                                {post.media_url && (
                                    <div className="rounded-2xl overflow-hidden mb-8 border border-white/5">
                                        <img src={post.media_url} alt="Post content" className="w-full h-auto max-h-[400px] object-cover" />
                                    </div>
                                )}

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
                        ))
                        ) : (
                        <div className="py-20 text-center bg-[#0D0F1A] border border-dashed border-gray-800 rounded-3xl">
                            <p className="text-gray-500 font-inter italic">The feed is quiet. Start the conversation!</p>
                        </div>
                        )}
                    </div>
                </div>

                {/* Events Sidebar */}
                <div>
                    <div className="flex items-center space-x-3 mb-10">
                        <div className="w-1.5 h-8 bg-[#32F5FF] rounded-full"></div>
                        <h2 className="text-2xl font-bold font-outfit uppercase tracking-wider">Campus Events</h2>
                    </div>

                    <div className="space-y-4">
                        {events.length > 0 ? (
                        events.map((event) => (
                            <div key={event._id || event.id} className="bg-[#0D0F1A] border border-white/5 rounded-2xl p-5 hover:border-[#32F5FF]/30 transition-all group">
                                <p className="text-[10px] font-bold text-[#32F5FF] uppercase tracking-[0.2em] mb-3 font-inter">
                                    {new Date(event.event_date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                </p>
                                <h3 className="text-white font-bold font-outfit mb-2">{event.title}</h3>
                                <p className="text-gray-500 text-xs font-inter line-clamp-2 mb-4 leading-relaxed">{event.description}</p>
                                <button className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center group-hover:text-[#32F5FF] transition-colors font-inter">
                                    Details
                                    <svg className="w-3 h-3 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        ))
                        ) : (
                        <div className="p-10 text-center bg-[#0D0F1A] border border-dashed border-gray-800 rounded-2xl">
                             <p className="text-gray-600 text-xs font-inter italic">No scheduled events yet</p>
                        </div>
                        )}
                    </div>
                </div>
              </div>
            </div>
          </section>

          {/* Create Post Modal */}
          {isPostModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="bg-[#0D0F1A] border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl relative">
                <button onClick={() => setIsPostModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h2 className="text-2xl font-bold mb-8 font-outfit uppercase tracking-widest text-[#FF2BCD]">New Post</h2>
                <form onSubmit={handleCreatePost} className="space-y-6">
                  <div>
                    <label className="block text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-3 font-inter">Media (Legacy Support)</label>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="w-full bg-[#05070A] border border-white/5 rounded-xl p-3 text-xs text-gray-400 font-inter file:bg-transparent file:border-none file:text-[#FF2BCD] file:font-bold file:mr-4 file:cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-3 font-inter">Your Message</label>
                    <textarea
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      className="w-full bg-[#05070A] border border-white/5 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-[#FF2BCD]/50 min-h-[120px] font-inter resize-none"
                      placeholder="Share your thoughts with the campus..."
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="w-full py-4 bg-[#FF2BCD] text-white font-black rounded-2xl hover:shadow-[0_0_20px_rgba(255,43,205,0.4)] disabled:opacity-50 transition-all uppercase tracking-widest text-xs font-inter"
                  >
                    {uploading ? 'Syncing...' : 'Publish Post'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Upload Reel Modal */}
          {isReelModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="bg-[#0D0F1A] border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl relative">
                <button onClick={() => setIsReelModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h2 className="text-2xl font-bold mb-8 font-outfit uppercase tracking-widest text-[#32F5FF]">Burst Reel</h2>
                <form onSubmit={handleUploadReel} className="space-y-6">
                  <div>
                    <label className="block text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-3 font-inter">Video Source</label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="w-full bg-[#05070A] border border-white/5 rounded-xl p-3 text-xs text-gray-400 font-inter file:bg-transparent file:border-none file:text-[#32F5FF] file:font-bold file:mr-4 file:cursor-pointer"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-3 font-inter">Caption</label>
                    <textarea
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      className="w-full bg-[#05070A] border border-white/5 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-[#32F5FF]/50 min-h-[100px] font-inter resize-none"
                      placeholder="Cool caption here..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="w-full py-4 bg-[#32F5FF] text-black font-black rounded-2xl hover:shadow-[0_0_20px_rgba(50,245,255,0.3)] disabled:opacity-50 transition-all uppercase tracking-widest text-xs font-inter"
                  >
                    {uploading ? 'Processing...' : 'Go Live'}
                  </button>
                </form>
              </div>
            </div>
          )}
      </main>

      <Footer />
    </div>
  );
};

export default CollegeDetail;
