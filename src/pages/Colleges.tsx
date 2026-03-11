import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../lib/axios';
import { joinCollege, createPost } from '../lib/api'; // createPost is not needed here
import { useUserRole } from '../context/UserRoleContext';

const Colleges: React.FC = () => {
  const [collegeName, setCollegeName] = useState('');
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [memberColleges, setMemberColleges] = useState<Set<string>>(new Set());
  const { user } = useUserRole();

  // Load colleges
  const loadColleges = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/colleges');
      setColleges(response.data || []);

      if (user) {
        const myCollegesResponse = await api.get('/colleges/my');
        const myCollegeIds = new Set<string>(
          myCollegesResponse.data.map((m: any) => m.college_id._id || m.college_id)
        );
        setMemberColleges(myCollegeIds);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load colleges');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadColleges();
  }, [user]);

  // Assign colors based on index
  const getColor = (index: number) => {
    const colors = ['pink', 'blue', 'purple'];
    return colors[index % colors.length];
  };

  const getColorClasses = (color: string) => {
    switch(color) {
      case 'pink':
        return 'border-[#FF2BCD]/30 hover:border-[#FF2BCD]';
      case 'blue':
        return 'border-[#32F5FF]/30 hover:border-[#32F5FF]';
      case 'purple':
        return 'border-[#8A2FFF]/30 hover:border-[#8A2FFF]';
      default:
        return 'border-[#FF2BCD]/30 hover:border-[#FF2BCD]';
    }
  };

  const handleCreateCollege = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!collegeName.trim()) {
      setError('Please enter a college name');
      return;
    }

    if (!user) {
      setError('You must be logged in to create a college');
      return;
    }

    try {
      setError('');
      await api.post('/colleges', { name: collegeName });
      
      setCollegeName('');
      loadColleges();
      alert('College created successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create college');
    }
  };

  const handleJoinCommunity = async (collegeId: string) => {
    if (!user) {
      setError('You must be logged in to join a college');
      return;
    }

    try {
      setError('');
      await joinCollege(collegeId);
      
      setMemberColleges(new Set([...memberColleges, collegeId]));
      alert('Successfully joined the community!');
      loadColleges();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to join college');
    }
  };

  return (
    <div className="min-h-screen bg-[#05070A] text-white flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-[#FF2BCD] via-[#8A2FFF] to-[#32F5FF] bg-clip-text text-transparent">
              College Communities
            </span>
          </h1>
          <p className="text-gray-400 text-center text-lg mb-8">
            Explore college communities and connect with campus coordinators
          </p>

          {/* Error Message */}
          {error && (
            <div className="max-w-xl mx-auto mb-8 p-4 bg-red-500/20 border border-red-500 rounded-xl text-red-200 text-center">
              {error}
            </div>
          )}

          {/* Search Bar */}
          <div className="max-w-xl mx-auto mb-12">
            <div className="relative">
              <input
                type="text"
                placeholder="Search college name"
                className="w-full px-6 py-4 bg-[#0D0F1A] border border-[#FF2BCD]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#FF2BCD] transition-colors"
                onChange={(e) => {
                    const search = e.target.value.toLowerCase();
                    // Basic client side filtering for now
                    if (!search) {
                        loadColleges();
                    } else {
                        setColleges(prev => prev.filter(c => c.name.toLowerCase().includes(search)));
                    }
                }}
              />
              <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Create College Form */}
          <div className="max-w-xl mx-auto mb-12 bg-[#0D0F1A] border border-[#8A2FFF]/30 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Create New College</h3>
            <form onSubmit={handleCreateCollege} className="flex gap-4">
              <input
                type="text"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                placeholder="Enter college name"
                className="flex-1 px-4 py-3 bg-[#05070A] border border-[#8A2FFF]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8A2FFF] transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-[#8A2FFF] text-white font-bold rounded-xl hover:bg-[#8A2FFF]/80 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Submitting...' : 'Create'}
              </button>
            </form>
          </div>

          {/* College Cards Grid */}
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#32F5FF] mx-auto"></div>
            </div>
          ) : colleges.length === 0 ? (
            <div className="text-center text-gray-400 py-10 bg-[#0D0F1A] rounded-2xl border border-dashed border-gray-800">No colleges yet. Create one to get started!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {colleges.map((college, index) => (
                <div
                  key={college._id || college.id}
                  className={`bg-[#0D0F1A] border ${getColorClasses(getColor(index))} rounded-2xl overflow-hidden transition-all duration-300 group`}
                >
                {/* Banner Placeholder */}
                <div className="h-32 bg-gradient-to-br from-[#0A0F15] to-[#1A1F2E] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-black opacity-40 group-hover:opacity-20 transition-opacity"></div>
                  <svg className="w-12 h-12 text-gray-600 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{college.name}</h3>
                  
                  <div className="flex items-center mb-4">
                    <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-gray-500 text-sm">
                      {college.memberships?.length || 0} member{(college.memberships?.length || 0) !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <Link
                    to={`/colleges/${college._id || college.id}`}
                    className="block w-full py-3 bg-[#FF2BCD] text-white font-bold rounded-lg text-center hover:bg-[#FF2BCD]/80 transition-colors mb-4"
                  >
                    View Community
                  </Link>
                  {memberColleges.has(college._id || college.id.toString()) ? (
                    <div className="w-full py-3 bg-[#32F5FF]/10 text-[#32F5FF] font-bold rounded-lg text-center border border-[#32F5FF]/30">
                      Member
                    </div>
                  ) : (
                    <button
                      onClick={() => handleJoinCommunity(college._id || college.id)}
                      className="w-full py-3 bg-[#8A2FFF] text-white font-bold rounded-lg hover:bg-[#8A2FFF]/80 transition-colors shadow-lg shadow-[#8A2FFF]/20"
                    >
                      Join Community
                    </button>
                  )}
                </div>
              </div>
            ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Colleges;
