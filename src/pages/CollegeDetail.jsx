import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useUserRole } from '../context/UserRoleContext';
import FeedInteraction from '../components/FeedInteraction';
import { collegeApi, postApi, eventApi, supabase } from '../lib/supabase';
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

const CollegeDetail = () => {
  const { collegeId } = useParams();
  const { user } = useUserRole();
  const [college, setCollege] = useState(null);
  const [memberships, setMemberships] = useState([]);
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [commentsMap, setCommentsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMember, setIsMember] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);

  // Upload States
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isReelModalOpen, setIsReelModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [caption, setCaption] = useState('');

  const fetchCollegeData = async () => {
    if (!collegeId) return;

    try {
      setLoading(true);
      setError('');

      const data = await collegeApi.getCollege(collegeId);
      setCollege(data);
      setMemberships(data.memberships || []);
      setPosts(data.posts || []);
      setEvents(data.events || []);

      if (user) {
        const memberStatus = await collegeApi.isMember(collegeId, user.id);
        setIsMember(!!memberStatus);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load college data');
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
      await collegeApi.joinCollege(collegeId, user.id);
      setIsMember(true);
      fetchCollegeData();
    } catch (err) {
      console.error(err);
      setError('Failed to join college');
    } finally {
      setJoinLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!collegeId || !user) return;

    try {
      setUploading(true);
      setError('');
      
      let mediaUrl = null;
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data, error: uploadError } = await supabase.storage
          .from('posts')
          .upload(fileName, selectedFile);
        
        if (uploadError) throw uploadError;
        mediaUrl = supabase.storage.from('posts').getPublicUrl(data.path).data.publicUrl;
      }

      await supabase.from('posts').insert([{
        college_id: collegeId,
        user_id: user.id,
        content: caption,
        media_url: mediaUrl
      }]);

      setIsPostModalOpen(false);
      setSelectedFile(null);
      setCaption('');
      fetchCollegeData();
    } catch (err) {
      console.error(err);
      setError('Failed to create post');
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
                We couldn't locate this campus community.
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
          <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-b from-[#0D0F1A] via-[#05070A] to-[#05070A]"></div>
             <div className="absolute -top-[10%] -right-[5%] w-[40%] h-[60%] bg-[#FF2BCD] opacity-5 blur-[120px] rounded-full"></div>
             <div className="absolute -bottom-[10%] -left-[5%] w-[40%] h-[60%] bg-[#32F5FF] opacity-5 blur-[120px] rounded-full"></div>
             
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
                   </div>
                 )}
               </div>
             </div>
          </section>

          <section className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
               <div className="lg:col-span-8 space-y-16">
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                       <h2 className="text-2xl font-black uppercase tracking-tight flex items-center space-x-3">
                          <Users size={24} className="text-[#32F5FF]" />
                          <span>Campus Leaders</span>
                       </h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                       {memberships.slice(0, 4).map((membership) => (
                         <div key={membership.id} className="p-6 bg-[#0D0F1A] border border-white/5 rounded-3xl text-center group hover:border-[#32F5FF]/30 transition-all">
                            <h3 className="font-bold text-sm truncate mb-1">{membership.user_id?.name || 'User'}</h3>
                            <div className="text-[8px] font-black uppercase tracking-widest text-gray-500">{membership.role || 'Member'}</div>
                         </div>
                       ))}
                    </div>
                  </div>

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
                            <div key={post.id} className="bg-[#0D0F1A] border border-white/5 rounded-[2.5rem] overflow-hidden p-6 sm:p-10 hover:border-white/10 transition-all group">
                                <p className="text-gray-300 mb-8 font-medium text-lg leading-relaxed">{post.content}</p>
                                {post.media_url && (
                                    <div className="rounded-[2rem] overflow-hidden mb-8 border border-white/5">
                                        <img src={post.media_url} alt="Post content" className="w-full h-auto max-h-[500px] object-cover" />
                                    </div>
                                )}
                                <div className="pt-8 border-t border-white/5">
                                    <FeedInteraction
                                        itemId={post.id}
                                        itemType="post"
                                        collegeId={collegeId}
                                        likeCount={post.likes?.[0]?.count || 0}
                                        commentCount={post.comments?.[0]?.count || 0}
                                        isMember={isMember}
                                    />
                                </div>
                            </div>
                        ))
                        ) : (
                        <div className="py-24 text-center bg-[#0D0F1A] border border-dashed border-white/5 rounded-[3rem]">
                           <h3 className="text-xl font-black mb-2 uppercase tracking-tight">Empty Feed</h3>
                        </div>
                        )}
                    </div>
                  </div>
               </div>

               <div className="lg:col-span-4 space-y-12">
                  <div className="sticky top-28 space-y-12">
                    <div className="bg-[#0D0F1A] border border-white/5 rounded-[2.5rem] p-8 space-y-8">
                       <div className="flex items-center space-x-3">
                          <Calendar size={20} className="text-[#32F5FF]" />
                          <h2 className="text-xl font-black uppercase tracking-tight">Upcoming</h2>
                       </div>
                       <div className="space-y-6">
                          {events.map((event) => (
                              <div key={event.id} className="relative group p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-[#32F5FF]/30 transition-all">
                                  <h3 className="text-white font-black text-sm mb-2">{event.title}</h3>
                                  <Link to={`/events/${event.id}`} className="mt-4 flex items-center text-[8px] font-black uppercase tracking-widest text-white group-hover:translate-x-1 transition-transform">
                                      <span>RSVP Details</span>
                                      <ChevronRight size={12} className="ml-1" />
                                  </Link>
                              </div>
                          ))}
                       </div>
                    </div>
                  </div>
               </div>
            </div>
          </section>

          {isPostModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-4 bg-[#05070A]/90 backdrop-blur-xl">
               <div className="bg-[#0D0F1A] border border-white/10 rounded-[3rem] w-full max-w-lg overflow-hidden p-8 sm:p-12">
                  <div className="flex items-center justify-between mb-8">
                     <h2 className="text-3xl font-black uppercase tracking-tight">New Update</h2>
                     <button onClick={() => setIsPostModalOpen(false)} className="text-gray-500 hover:text-white"><X size={24} /></button>
                  </div>
                  <form onSubmit={handleCreatePost} className="space-y-8">
                     <textarea
                       value={caption}
                       onChange={(e) => setCaption(e.target.value)}
                       className="w-full bg-[#05070A] border border-white/10 rounded-2xl p-6 text-white min-h-[160px] focus:outline-none"
                       placeholder="What's happening on campus?"
                       required
                     />
                     <input
                       type="file"
                       onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                       className="block w-full text-sm text-gray-500"
                     />
                     <button
                       type="submit"
                       disabled={uploading}
                       className="w-full py-5 bg-[#FF2BCD] text-white font-black rounded-2xl flex items-center justify-center space-x-3 disabled:opacity-50"
                     >
                       {uploading ? 'Publishing...' : 'Publish Post'}
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
