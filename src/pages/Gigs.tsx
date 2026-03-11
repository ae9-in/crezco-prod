import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface Gig {
  id: number;
  title: string;
  description: string;
  duration: string;
  ccName: string;
  color: string;
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

  const gigs: Gig[] = [
    {
      id: 1,
      title: "Brand Promotion Ambassador",
      description: "Promote leading brands on campus and earn commission for every successful referral.",
      duration: "2-4 weeks",
      ccName: "Sarah Johnson",
      color: "pink"
    },
    {
      id: 2,
      title: "Event Coordinator Assistant",
      description: "Help organize and manage campus events, gaining valuable event management experience.",
      duration: "1 month",
      ccName: "Michael Chen",
      color: "blue"
    },
    {
      id: 3,
      title: "Social Media Influencer",
      description: "Create content and promote events on your social media platforms.",
      duration: "Ongoing",
      ccName: "Emily Davis",
      color: "purple"
    },
    {
      id: 4,
      title: "Campus Survey Collector",
      description: "Collect feedback and data from students for market research campaigns.",
      duration: "2 weeks",
      ccName: "Alex Kumar",
      color: "pink"
    },
    {
      id: 5,
      title: "Workshop Facilitator",
      description: "Lead interactive sessions and workshops for student development programs.",
      duration: "3 weeks",
      ccName: "Rachel Green",
      color: "blue"
    },
    {
      id: 6,
      title: "Product Sampling Partner",
      description: "Distribute product samples and gather feedback from fellow students.",
      duration: "1 week",
      ccName: "David Park",
      color: "purple"
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'pink':
        return {
          border: 'border-[#FF2BCD]/30',
          hover: 'hover:border-[#FF2BCD]',
          bg: 'bg-[#FF2BCD]/20',
          text: 'text-[#FF2BCD]',
          button: 'bg-[#FF2BCD]'
        };
      case 'blue':
        return {
          border: 'border-[#32F5FF]/30',
          hover: 'hover:border-[#32F5FF]',
          bg: 'bg-[#32F5FF]/20',
          text: 'text-[#32F5FF]',
          button: 'bg-[#32F5FF]'
        };
      case 'purple':
        return {
          border: 'border-[#8A2FFF]/30',
          hover: 'hover:border-[#8A2FFF]',
          bg: 'bg-[#8A2FFF]/20',
          text: 'text-[#8A2FFF]',
          button: 'bg-[#8A2FFF]'
        };
      default:
        return {
          border: 'border-[#FF2BCD]/30',
          hover: 'hover:border-[#FF2BCD]',
          bg: 'bg-[#FF2BCD]/20',
          text: 'text-[#FF2BCD]',
          button: 'bg-[#FF2BCD]'
        };
    }
  };

  const openModal = (gig: Gig) => {
    setSelectedGig(gig);
    setModalOpen(true);
    setSubmitted(false);
    setFormData({ name: '', email: '', interest: '' });
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedGig(null);
    setSubmitted(false);
    setFormData({ name: '', email: '', interest: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      closeModal();
    }, 3000);
  };

  const getButtonColor = () => {
    if (!selectedGig) return 'bg-[#FF2BCD]';
    return getColorClasses(selectedGig.color).button;
  };

  return (
    <div className="min-h-screen bg-[#05070A] text-white">
      <Navbar />

      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-[#FF2BCD] via-[#8A2FFF] to-[#32F5FF] bg-clip-text text-transparent">
              Available Gigs
            </span>
          </h1>
          <p className="text-gray-400 text-center text-lg mb-12">
            Find flexible opportunities to earn and grow your skills
          </p>

          {/* Gigs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gigs.map((gig) => {
              const colors = getColorClasses(gig.color);
              return (
                <div
                  key={gig.id}
                  className={`bg-[#0D0F1A] border ${colors.border} rounded-2xl p-6 ${colors.hover} transition-all duration-300`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center`}>
                      <svg className={`w-6 h-6 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className={`px-3 py-1 ${colors.bg} ${colors.text} rounded-full text-sm font-medium`}>
                      {gig.duration}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{gig.title}</h3>
                  <p className="text-gray-400 mb-4">{gig.description}</p>

                  <div className="flex items-center mb-4">
                    <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-gray-500 text-sm">Hosted by CC {gig.ccName}</span>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => openModal(gig)}
                      className={`flex-1 py-3 ${colors.button} text-white font-bold rounded-lg hover:opacity-80 transition-opacity`}
                    >
                      Apply Now
                    </button>
                    <button className="flex-1 py-3 border border-gray-600 text-gray-300 font-bold rounded-lg hover:border-gray-400 hover:text-white transition-colors">
                      Refer Someone
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modal */}
      {modalOpen && selectedGig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0D0F1A] border border-[#FF2BCD]/30 rounded-2xl p-6 w-full max-w-md relative">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Application submitted</h3>
                <p className="text-gray-400">Our team will review your profile and get back to you soon.</p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-white mb-2">Apply for {selectedGig.title}</h2>
                <p className="text-gray-400 mb-6">Fill in your details to apply for this gig</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-[#05070A] border border-[#FF2BCD]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF2BCD] transition-colors"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-[#05070A] border border-[#FF2BCD]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF2BCD] transition-colors"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Why are you interested?</label>
                    <textarea
                      required
                      value={formData.interest}
                      onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                      className="w-full px-4 py-3 bg-[#05070A] border border-[#FF2BCD]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF2BCD] transition-colors resize-none"
                      placeholder="Tell us why you're interested in this gig"
                      rows={3}
                    />
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-3 ${getButtonColor()} text-white font-bold rounded-lg hover:opacity-80 transition-opacity mt-6`}
                  >
                    Submit Application
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Gigs;
