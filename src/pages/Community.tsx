import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useUserRole } from '../context/UserRoleContext';
import { getCommunityFeed, FeedItem, getUserColleges, createPost } from '../lib/api';
import api from '../lib/axios';
import FeedInteraction from '../components/FeedInteraction';

const Community: React.FC = () => {
  const { userRole, user, roleLoading } = useUserRole();
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentsMap, setCommentsMap] = useState<Record<string, any[]>>({}); // itemId -> comments
  const [membershipMap, setMembershipMap] = useState<Record<string, boolean>>({}); // collegeId -> isMember

  // Modal & Upload State
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
          
          // Populate membership map for all colleges user is in
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
        loadFeed(); // Refresh feed to show new content
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to upload sharing');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070A] text-white flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Action Buttons */}
      <section className="pb-8">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-4">
          {roleLoading ? (
            <div className="w-full bg-[#0D0F1A] border border-[#FF2BCD]/30 rounded-xl p-4 flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#FF2BCD]"></div>
              <p className="text-gray-400">Verifying permissions...</p>
            </div>
          ) : userRole === 'cc' ? (
            <>
              <button
                onClick={() => { setShowModal(true); setActiveTab('post'); }}
                className="flex items-center space-x-2 py-3 px-6 bg-[#FF2BCD] text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(255,43,205,0.4)] transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Upload Post</span>
              </button>
              <button
                onClick={() => { setShowModal(true); setActiveTab('reel'); }}
                className="flex items-center space-x-2 py-3 px-6 bg-[#32F5FF] text-[#05070A] font-bold rounded-xl hover:shadow-[0_0_20px_rgba(50,245,255,0.4)] transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Upload Reel</span>
              </button>
            </>
          ) : (
            <div className="w-full bg-[#0D0F1A] border border-[#FF2BCD]/30 rounded-xl p-4 text-center">
              <p className="text-gray-400">
                Only Campus Coordinators can post content to the community feed
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0D0F1A] border border-[#FF2BCD]/30 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div className="flex space-x-4">
                <button
                  onClick={() => { setActiveTab('post'); setError(null); }}
                  className={`text-xl font-bold transition-colors ${activeTab === 'post' ? 'text-white border-b-2 border-[#FF2BCD]' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  Post
                </button>
                <button
                  onClick={() => { setActiveTab('reel'); setError(null); }}
                  className={`text-xl font-bold transition-colors ${activeTab === 'reel' ? 'text-white border-b-2 border-[#32F5FF]' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  Reel
                </button>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-white transition-colors"
                disabled={uploading}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {success ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">{activeTab === 'reel' ? 'Reel Shared!' : 'Post Shared!'}</h3>
                <p className="text-gray-400">Your content is now live on the campus feed.</p>
              </div>
            ) : (
              <form onSubmit={handleUpload} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 font-inter">Campus</label>
                  <select
                    value={selectedCollegeId}
                    onChange={(e) => setSelectedCollegeId(e.target.value)}
                    className="w-full bg-[#05070A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF2BCD]/50 appearance-none font-inter"
                    required
                  >
                    <option value="" disabled>Select College</option>
                    {userColleges.map((college) => (
                      <option key={college._id || college.id} value={college._id || college.id}>
                        {college.name}
                      </option>
                    ))}
                    {userColleges.length === 0 && (
                      <option value="" disabled>No CC Colleges Found</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 font-bold uppercase tracking-widest text-[#FF2BCD] font-inter">
                    {activeTab === 'reel' ? 'Reel Video' : 'Media (Image/Video)'}
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="media-upload"
                      className="hidden"
                      onChange={handleFileChange}
                      accept={activeTab === 'reel' ? "video/*" : "image/*,video/*"}
                    />
                    <label
                      htmlFor="media-upload"
                      className="flex flex-col items-center justify-center w-full h-32 bg-[#05070A] border-2 border-dashed border-[#FF2BCD]/20 rounded-xl cursor-pointer hover:border-[#FF2BCD]/50 transition-colors"
                    >
                      {selectedFile ? (
                        <div className="flex items-center space-x-2 text-white">
                          <svg className="w-6 h-6 text-[#32F5FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm font-medium truncate max-w-[200px] font-inter">{selectedFile.name}</span>
                        </div>
                      ) : (
                        <>
                          <svg className="w-8 h-8 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-xs text-gray-500 text-center font-inter">Tap to browse files {activeTab === 'reel' ? '(Video Required)' : '(Optional)'}</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 font-inter">Caption / Content</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-24 bg-[#05070A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF2BCD]/50 resize-none font-inter"
                    placeholder={activeTab === 'reel' ? "Write a catchy caption..." : "What's happening on campus?"}
                    required={activeTab === 'reel'}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={uploading || !selectedCollegeId || (activeTab === 'reel' && !selectedFile)}
                  className={`w-full py-4 font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center space-x-2 font-inter ${activeTab === 'reel' ? 'bg-[#32F5FF] text-[#05070A] hover:bg-[#32F5FF]/80' : 'bg-[#FF2BCD] text-white hover:bg-[#FF2BCD]/80'}`}
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <span>{activeTab === 'reel' ? 'Share Reel' : 'Share Post'}</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Page Header */}
      <section className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 font-outfit">
            <span className="bg-gradient-to-r from-[#FF2BCD] via-[#8A2FFF] to-[#32F5FF] bg-clip-text text-transparent">
              Community Feed
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-inter">
            Discover what's happening across all campuses
          </p>
      </section>

      {/* Unified Feed Section */}
      <section>
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#32F5FF] mx-auto mb-4"></div>
              <p className="text-gray-400 font-inter">Loading community activity...</p>
            </div>
          ) : feed.length === 0 ? (
            <div className="text-center py-20 text-gray-500 bg-[#0D0F1A] rounded-2xl border border-dashed border-gray-800 font-inter">
              No activity yet. Be the first to post!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {feed.map((item) => (
                <div key={item.feed_id} className="bg-[#0D0F1A] border border-white/5 rounded-2xl overflow-hidden flex flex-col hover:border-[#8A2FFF]/30 transition-all group">
                  {/* Media Content */}
                  <div className="w-full h-64 bg-[#05070A] flex items-center justify-center relative border-b border-white/5">
                    {item.type === 'reel' ? (
                      <>
                        <video
                          src={item.video_url}
                          className="w-full h-full object-cover cursor-pointer"
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          onMouseOver={(e) => {
                            if (!e.currentTarget.controls) {
                              e.currentTarget.play();
                            }
                          }}
                          onMouseOut={(e) => {
                            if (!e.currentTarget.controls) {
                              e.currentTarget.pause();
                            }
                          }}
                          onClick={(e) => {
                            const v = e.currentTarget;
                            v.muted = false;
                            v.controls = true;
                            v.play();
                          }}
                        />
                        <div className="absolute top-4 right-4 bg-black/60 px-2.5 py-1 rounded-lg text-[10px] font-bold text-[#FF2BCD] pointer-events-none tracking-widest uppercase">REEL</div>
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none group-hover:bg-transparent transition-all">
                          <svg className="w-12 h-12 text-white/50" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </>
                    ) : item.type === 'post' && item.media_url ? (
                      <img src={item.media_url} alt="Post content" className="w-full h-full object-cover" />
                    ) : (
                      <div className="p-8 text-center">
                        <svg className={`w-16 h-16 ${item.type === 'event' ? 'text-[#32F5FF]/10' : 'text-[#8A2FFF]/10'} mx-auto mb-4`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {item.type === 'event' ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" />
                          )}
                        </svg>
                        <span className="text-gray-700 text-[10px] font-bold uppercase tracking-[0.2em]">{item.type}</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-gray-400 text-[10px] rounded-md font-bold uppercase tracking-wider">
                          {(item as any).collegeName || (item as any).college_id?.name || 'Campus'}
                        </span>
                        {item.type === 'event' && (
                          <span className="px-2 py-0.5 bg-[#FF2BCD]/10 border border-[#FF2BCD]/20 text-[#FF2BCD] text-[10px] rounded-md font-bold uppercase tracking-wider">
                            EVENT
                          </span>
                        )}
                      </div>
                      <span className="text-gray-600 text-[10px] font-medium font-inter">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2 font-outfit">
                      {item.type === 'event' ? item.title : (item as any).author?.name || (item as any).created_by?.name || 'Campus Coordinator'}
                    </h3>

                    <p className="text-gray-400 mb-6 line-clamp-3 text-sm font-inter leading-relaxed">
                      {item.type === 'post' ? item.content : item.type === 'reel' ? item.caption : (item as any).description}
                    </p>

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
                        // Optimistic Update
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
