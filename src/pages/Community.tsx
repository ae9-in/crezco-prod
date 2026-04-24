import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useUserRole } from '../context/UserRoleContext';
import { getCommunityFeed, FeedItem, getUserColleges, createPost } from '../lib/api';
import api from '../lib/axios';
import FeedInteraction from '../components/FeedInteraction';
import { Plus, Video, Image as ImageIcon, X, Send, ChevronRight, MessageCircle, Heart, Share2, Info } from 'lucide-react';

const Community: React.FC = () => {
  const { userRole, user, roleLoading } = useUserRole();
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentsMap, setCommentsMap] = useState<Record<string, any[]>>({});
  const [membershipMap, setMembershipMap] = useState<Record<string, boolean>>({});

  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'post' | 'reel'>('post');
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [userColleges, setUserColleges] = useState<any[]>([]);
  const [selectedCollegeId, setSelectedCollegeId] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const loadFeed = async () => {
    setLoading(true);
    try {
      const data = await getCommunityFeed();
      setFeed(data);
    } catch (err) {
      console.error('Error loading community feed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  useEffect(() => {
    const fetchColleges = async () => {
      if (userRole === 'cc' && user) {
        try {
          const colleges = await getUserColleges();
          const ccColleges = colleges.filter((c: any) => c.role === 'cc');
          setUserColleges(ccColleges.map((c: any) => c.college_id));
          
          if (ccColleges.length > 0) {
            setSelectedCollegeId(ccColleges[0].college_id._id || ccColleges[0].college_id);
          }
          
          const newMap: Record<string, boolean> = {};
          colleges.forEach((c: any) => {
            newMap[c.college_id._id || c.college_id] = true;
          });
          setMembershipMap(newMap);
        } catch (err) {
          console.error('Error fetching colleges for CC:', err);
        }
      }
    };
    fetchColleges();
  }, [userRole, user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (activeTab === 'reel' && !file.type.startsWith('video/')) {
        setError('Reels must be video files.');
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedCollegeId) return;

    setUploading(true);
    setError(null);
    try {
        const formData = new FormData();
        formData.append('college_id', selectedCollegeId);
        if (activeTab === 'post') {
            formData.append('content', content);
            if (selectedFile) formData.append('media', selectedFile);
            await api.post('/posts', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        } else {
            if (!selectedFile) throw new Error('Video is required for Reels');
            formData.append('caption', content);
            formData.append('video', selectedFile);
            await api.post('/reels', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        }

      setSuccess(true);
      setContent('');
      setSelectedFile(null);
      setTimeout(() => {
        setSuccess(false);
        setShowModal(false);
        loadFeed();
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to upload content');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070A] text-white flex flex-col selection:bg-[#FF2BCD]/30">
      <Navbar />

      <main className="flex-grow pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <div className="mb-12 text-center sm:text-left">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-4">
            Campus <span className="bg-gradient-to-r from-[#FF2BCD] via-[#8A2FFF] to-[#32F5FF] bg-clip-text text-transparent">Connect</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl font-medium">
            Join the pulse of campus life. Discover events, share moments, and grow with your community.
          </p>
        </div>

        {/* Action Bar */}
        <section className="mb-12">
          {roleLoading ? (
            <div className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl animate-pulse"></div>
          ) : userRole === 'cc' ? (
            <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
              <button
                onClick={() => { setShowModal(true); setActiveTab('post'); }}
                className="flex-1 flex items-center justify-center space-x-3 py-4 px-6 bg-gradient-to-r from-[#FF2BCD] to-[#8A2FFF] text-white font-black rounded-2xl hover:scale-[1.02] transition-all shadow-[0_10px_30px_rgba(255,43,205,0.2)]"
              >
                <Plus size={20} />
                <span>Create Post</span>
              </button>
              <button
                onClick={() => { setShowModal(true); setActiveTab('reel'); }}
                className="flex-1 flex items-center justify-center space-x-3 py-4 px-6 bg-white/10 border border-white/10 text-[#32F5FF] font-black rounded-2xl hover:bg-white/20 transition-all"
              >
                <Video size={20} />
                <span>Share Reel</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4 p-6 bg-[#FF2BCD]/5 border border-[#FF2BCD]/20 rounded-[2rem]">
              <div className="p-3 bg-[#FF2BCD]/10 rounded-xl text-[#FF2BCD]">
                <Info size={24} />
              </div>
              <p className="text-sm font-bold text-gray-400">
                Only <span className="text-[#FF2BCD]">Campus Coordinators</span> can post content. Want to lead? <button className="text-[#32F5FF] hover:underline" onClick={() => (window.location.href='/campus-coordinator')}>Apply here</button>
              </p>
            </div>
          )}
        </section>

        {/* Upload Modal */}
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => !uploading && setShowModal(false)}></div>
            <div className="relative bg-[#0D0F1A] border border-white/10 rounded-[2.5rem] p-6 sm:p-10 w-full max-w-xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#FF2BCD] via-[#8A2FFF] to-[#32F5FF]"></div>
              
              <div className="flex justify-between items-center mb-10">
                <div className="flex bg-white/5 p-1.5 rounded-2xl">
                  <button
                    onClick={() => { setActiveTab('post'); setError(null); }}
                    className={`px-8 py-3 rounded-xl text-sm font-black transition-all ${activeTab === 'post' ? 'bg-[#FF2BCD] text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    Post
                  </button>
                  <button
                    onClick={() => { setActiveTab('reel'); setError(null); }}
                    className={`px-8 py-3 rounded-xl text-sm font-black transition-all ${activeTab === 'reel' ? 'bg-[#32F5FF] text-black shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    Reel
                  </button>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-3 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                  disabled={uploading}
                >
                  <X size={20} />
                </button>
              </div>

              {success ? (
                <div className="text-center py-12 animate-in zoom-in duration-300">
                  <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
                    <Send size={40} className="animate-bounce" />
                  </div>
                  <h3 className="text-3xl font-black mb-4">Content Shared!</h3>
                  <p className="text-gray-400 text-lg">Your {activeTab} is now live on the campus feed.</p>
                </div>
              ) : (
                <form onSubmit={handleUpload} className="space-y-8">
                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-sm font-bold flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="space-y-4">
                    <label className="block text-xs font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Select Campus</label>
                    <div className="relative">
                      <select
                        value={selectedCollegeId}
                        onChange={(e) => setSelectedCollegeId(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-[#FF2BCD]/50 appearance-none"
                        required
                      >
                        <option value="" disabled>Choose your college</option>
                        {userColleges.map((college) => (
                          <option key={college._id || college.id} value={college._id || college.id} className="bg-[#0D0F1A]">
                            {college.name}
                          </option>
                        ))}
                      </select>
                      <ChevronRight size={18} className="absolute right-6 top-1/2 -translate-y-1/2 rotate-90 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-xs font-black uppercase tracking-[0.2em] text-gray-500 ml-1">
                      {activeTab === 'reel' ? 'Video File' : 'Media (Optional)'}
                    </label>
                    <input
                      type="file"
                      id="media-upload"
                      className="hidden"
                      onChange={handleFileChange}
                      accept={activeTab === 'reel' ? "video/*" : "image/*,video/*"}
                    />
                    <label
                      htmlFor="media-upload"
                      className="group flex flex-col items-center justify-center w-full h-40 bg-white/5 border-2 border-dashed border-white/10 rounded-[2rem] cursor-pointer hover:border-[#FF2BCD]/50 hover:bg-white/10 transition-all duration-300"
                    >
                      {selectedFile ? (
                        <div className="flex flex-col items-center space-y-2 px-6">
                          <div className="p-3 bg-[#32F5FF]/10 rounded-full text-[#32F5FF]">
                            {selectedFile.type.startsWith('video/') ? <Video size={24} /> : <ImageIcon size={24} />}
                          </div>
                          <span className="text-sm font-bold text-white truncate max-w-[250px]">{selectedFile.name}</span>
                          <span className="text-[10px] text-gray-500 uppercase font-black">Click to change</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center space-y-3">
                          <div className="p-4 bg-white/5 rounded-2xl text-gray-500 group-hover:text-[#FF2BCD] transition-colors">
                            {activeTab === 'reel' ? <Video size={32} /> : <ImageIcon size={32} />}
                          </div>
                          <div className="text-center">
                             <p className="text-sm font-bold text-gray-400">Browse Files</p>
                             <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest mt-1">
                               {activeTab === 'reel' ? 'Video format only' : 'Images or Videos'}
                             </p>
                          </div>
                        </div>
                      )}
                    </label>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-xs font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Caption</label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full h-32 bg-white/5 border border-white/10 rounded-[2rem] px-6 py-5 text-white font-medium focus:outline-none focus:border-[#FF2BCD]/50 resize-none placeholder:text-gray-600"
                      placeholder={activeTab === 'reel' ? "Tell us about this reel..." : "Share what's on your mind..."}
                      required={activeTab === 'reel'}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={uploading || !selectedCollegeId || (activeTab === 'reel' && !selectedFile)}
                    className={`w-full py-5 font-black rounded-2xl transition-all disabled:opacity-50 flex items-center justify-center space-x-3 shadow-xl ${activeTab === 'reel' ? 'bg-[#32F5FF] text-black hover:shadow-[0_0_30px_rgba(50,245,255,0.3)]' : 'bg-[#FF2BCD] text-white hover:shadow-[0_0_30px_rgba(255,43,205,0.3)]'}`}
                  >
                    {uploading ? (
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 border-3 border-current/20 border-t-current rounded-full animate-spin"></div>
                        <span>Sharing...</span>
                      </div>
                    ) : (
                      <span>{activeTab === 'reel' ? 'Share Reel' : 'Post to Feed'}</span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Feed Section */}
        <section>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-[500px] bg-white/5 rounded-[2.5rem] animate-pulse"></div>
              ))}
            </div>
          ) : feed.length === 0 ? (
            <div className="py-32 flex flex-col items-center justify-center text-center px-6 bg-white/5 border border-dashed border-white/10 rounded-[3rem]">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 text-gray-600">
                <MessageCircle size={40} />
              </div>
              <h3 className="text-2xl font-black mb-2">No activity yet</h3>
              <p className="text-gray-500 max-w-sm">Be the pioneer! Start sharing updates from your campus and build the community.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {feed.map((item) => (
                <div key={item.feed_id} className="bg-[#0D0F1A] border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col hover:border-[#8A2FFF]/30 transition-all group shadow-2xl">
                  {/* Media Content */}
                  <div className="w-full aspect-square sm:aspect-[4/5] bg-[#05070A] flex items-center justify-center relative overflow-hidden group/media">
                    {item.type === 'reel' ? (
                      <div className="w-full h-full">
                        <video
                          src={item.video_url}
                          className="w-full h-full object-cover cursor-pointer"
                          muted loop playsInline preload="metadata"
                          onMouseOver={(e) => !e.currentTarget.controls && e.currentTarget.play()}
                          onMouseOut={(e) => !e.currentTarget.controls && e.currentTarget.pause()}
                          onClick={(e) => {
                            const v = e.currentTarget;
                            v.muted = false;
                            v.controls = true;
                            v.play();
                          }}
                        />
                        <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black text-[#FF2BCD] border border-[#FF2BCD]/30 tracking-widest uppercase z-10">REEL</div>
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none group-hover/media:opacity-0 transition-opacity duration-300">
                           <div className="p-6 bg-white/10 backdrop-blur-xl rounded-full border border-white/20">
                              <Video size={40} className="text-white/70" />
                           </div>
                        </div>
                      </div>
                    ) : item.type === 'post' && item.media_url ? (
                      <img src={item.media_url} alt="Post" className="w-full h-full object-cover transition-transform duration-700 group-hover/media:scale-110" />
                    ) : (
                      <div className="flex flex-col items-center p-12 text-center">
                        <div className={`p-8 rounded-[2rem] mb-6 ${item.type === 'event' ? 'bg-[#32F5FF]/10 text-[#32F5FF]' : 'bg-[#8A2FFF]/10 text-[#8A2FFF]'}`}>
                           {item.type === 'event' ? <Calendar size={48} /> : <MessageCircle size={48} />}
                        </div>
                        <span className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em]">{item.type} Update</span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                         <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF2BCD] to-[#8A2FFF] flex items-center justify-center font-black text-xs text-white shadow-lg">
                           {(item as any).author?.name?.[0] || 'C'}
                         </div>
                         <div className="min-w-0">
                            <p className="text-sm font-black text-white truncate">{(item as any).author?.name || 'Coordinator'}</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest truncate">{(item as any).collegeName || 'Campus'}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-black text-gray-600 uppercase">{new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                      </div>
                    </div>

                    <div className="mb-8">
                       {item.type === 'event' && <h3 className="text-xl font-black text-[#32F5FF] mb-3 leading-tight">{item.title}</h3>}
                       <p className="text-gray-400 text-sm font-medium leading-relaxed line-clamp-4">
                         {item.type === 'post' ? item.content : item.type === 'reel' ? item.caption : (item as any).description}
                       </p>
                    </div>

                    <div className="mt-auto">
                      <FeedInteraction
                        itemId={item._id || item.id}
                        itemType={(item.type === 'event' ? 'post' : item.type) as 'post' | 'reel'}
                        collegeId={item.college_id as any}
                        likeCount={item.type === 'event' ? 0 : (item as any).like_count || 0}
                        commentCount={item.type === 'event' ? 0 : (item as any).comment_count || 0}
                        hasLiked={item.type === 'event' ? false : (item as any).has_liked || false}
                        comments={commentsMap[item._id || item.id] || []}
                        isMember={membershipMap[item.college_id as any] || false}
                        onLikeToggle={async () => {
                          if (item.type === 'event' || !user) return;
                          setFeed(prev => prev.map(fi => (fi._id || fi.id) === (item._id || item.id) ? {
                            ...fi,
                            has_liked: !(fi as any).has_liked,
                            like_count: (fi as any).like_count + ((fi as any).has_liked ? -1 : 1)
                          } as any : fi));

                          try {
                            const { toggleLike } = await import('../lib/api');
                            await toggleLike(item._id || item.id, item.type as 'post' | 'reel');
                          } catch (err) {
                            console.error('Like toggle failed:', err);
                          }
                        }}
                        onCommentAdd={async (text) => {
                          if (item.type === 'event' || !user) return;
                          const tempId = `temp-${Date.now()}`;
                          const tempComment = {
                            id: tempId,
                            user_id: user._id,
                            item_id: item._id || item.id,
                            item_type: item.type,
                            content: text,
                            created_at: new Date().toISOString(),
                            author: { name: user.name || user.email },
                            pending: true
                          };

                          setFeed(prev => prev.map(fi => (fi._id || fi.id) === (item._id || item.id) ? {
                            ...fi,
                            comment_count: ((fi as any).comment_count || 0) + 1
                          } as any : fi));

                          setCommentsMap(prev => ({
                            ...prev,
                            [item._id || item.id]: [...(prev[item._id || item.id] || []), tempComment]
                          }));

                          try {
                            const { addComment } = await import('../lib/api');
                            const newCmt = await addComment(item._id || item.id, item.type as 'post' | 'reel', text);
                            setCommentsMap(prev => ({
                              ...prev,
                              [item._id || item.id]: (prev[item._id || item.id] || []).map(c => c.id === tempId ? { ...newCmt, author: tempComment.author } : c)
                            }));
                          } catch (err) {
                            console.error('Comment add failed:', err);
                            setFeed(prev => prev.map(fi => (fi._id || fi.id) === (item._id || item.id) ? {
                              ...fi,
                              comment_count: Math.max(0, ((fi as any).comment_count || 0) - 1)
                            } as any : fi));
                            setCommentsMap(prev => ({
                              ...prev,
                              [item._id || item.id]: (prev[item._id || item.id] || []).filter(c => c.id !== tempId)
                            }));
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Community;
