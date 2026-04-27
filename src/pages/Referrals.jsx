import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Referrals = () => {
  const [formData, setFormData] = useState({
    hiring: { name: '', contact: '' },
    product: { name: '', contact: '' },
    event: { name: '', contact: '' },
    cc: { name: '', contact: '' }
  });

  const [successMessage, setSuccessMessage] = useState({
    hiring: false,
    product: false,
    event: false,
    cc: false
  });

  const handleInputChange = (type, field, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };

  const handleSubmit = (type) => {
    setSuccessMessage(prev => ({ ...prev, [type]: true }));
    setTimeout(() => {
      setSuccessMessage(prev => ({ ...prev, [type]: false }));
      setFormData(prev => ({ ...prev, [type]: { name: '', contact: '' } }));
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#05070A] text-white">
      <Navbar />

      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-[#FF2BCD] via-[#8A2FFF] to-[#32F5FF] bg-clip-text text-transparent">
              Referral & Earnings
            </span>
          </h1>
          <p className="text-gray-400 text-center text-lg mb-12">
            Earn rewards by referring candidates, leads, and campus leaders
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            <div className="bg-[#0D0F1A] border border-[#FF2BCD]/30 rounded-2xl p-6 hover:border-[#FF2BCD] transition-all duration-300">
              <div className="w-14 h-14 bg-[#FF2BCD]/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-[#FF2BCD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Hiring Referrals</h3>
              <p className="text-gray-400 mb-4">Refer candidates and earn per successful hire</p>
              
              <div className="space-y-3 mb-4">
                <input
                  type="text"
                  placeholder="Enter name"
                  value={formData.hiring.name}
                  onChange={(e) => handleInputChange('hiring', 'name', e.target.value)}
                  className="w-full px-4 py-3 bg-[#05070A] border border-[#FF2BCD]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF2BCD] transition-colors"
                />
                <input
                  type="text"
                  placeholder="Enter email or phone"
                  value={formData.hiring.contact}
                  onChange={(e) => handleInputChange('hiring', 'contact', e.target.value)}
                  className="w-full px-4 py-3 bg-[#05070A] border border-[#FF2BCD]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF2BCD] transition-colors"
                />
              </div>

              {successMessage.hiring ? (
                <div className="w-full py-3 bg-green-600 text-white font-bold rounded-lg text-center">
                  Referral submitted (placeholder)
                </div>
              ) : (
                <button 
                  onClick={() => handleSubmit('hiring')}
                  className="w-full py-3 bg-[#FF2BCD] text-white font-bold rounded-lg hover:bg-[#FF2BCD]/80 transition-colors"
                >
                  Submit Candidate
                </button>
              )}
            </div>

            <div className="bg-[#0D0F1A] border border-[#32F5FF]/30 rounded-2xl p-6 hover:border-[#32F5FF] transition-all duration-300">
              <div className="w-14 h-14 bg-[#32F5FF]/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-[#32F5FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Product Referrals</h3>
              <p className="text-gray-400 mb-4">Promote offerings and submit leads</p>
              
              <div className="space-y-3 mb-4">
                <input
                  type="text"
                  placeholder="Enter name"
                  value={formData.product.name}
                  onChange={(e) => handleInputChange('product', 'name', e.target.value)}
                  className="w-full px-4 py-3 bg-[#05070A] border border-[#32F5FF]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#32F5FF] transition-colors"
                />
                <input
                  type="text"
                  placeholder="Enter email or phone"
                  value={formData.product.contact}
                  onChange={(e) => handleInputChange('product', 'contact', e.target.value)}
                  className="w-full px-4 py-3 bg-[#05070A] border border-[#32F5FF]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#32F5FF] transition-colors"
                />
              </div>

              {successMessage.product ? (
                <div className="w-full py-3 bg-green-600 text-white font-bold rounded-lg text-center">
                  Referral submitted (placeholder)
                </div>
              ) : (
                <button 
                  onClick={() => handleSubmit('product')}
                  className="w-full py-3 bg-[#32F5FF] text-black font-bold rounded-lg hover:bg-[#32F5FF]/80 transition-colors"
                >
                  Submit Lead
                </button>
              )}
            </div>

            <div className="bg-[#0D0F1A] border border-[#8A2FFF]/30 rounded-2xl p-6 hover:border-[#8A2FFF] transition-all duration-300">
              <div className="w-14 h-14 bg-[#8A2FFF]/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-[#8A2FFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Event Referrals</h3>
              <p className="text-gray-400 mb-4">Bring participants to events</p>
              
              <div className="space-y-3 mb-4">
                <input
                  type="text"
                  placeholder="Enter name"
                  value={formData.event.name}
                  onChange={(e) => handleInputChange('event', 'name', e.target.value)}
                  className="w-full px-4 py-3 bg-[#05070A] border border-[#8A2FFF]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#8A2FFF] transition-colors"
                />
                <input
                  type="text"
                  placeholder="Enter email or phone"
                  value={formData.event.contact}
                  onChange={(e) => handleInputChange('event', 'contact', e.target.value)}
                  className="w-full px-4 py-3 bg-[#05070A] border border-[#8A2FFF]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#8A2FFF] transition-colors"
                />
              </div>

              {successMessage.event ? (
                <div className="w-full py-3 bg-green-600 text-white font-bold rounded-lg text-center">
                  Referral submitted (placeholder)
                </div>
              ) : (
                <button 
                  onClick={() => handleSubmit('event')}
                  className="w-full py-3 bg-[#8A2FFF] text-white font-bold rounded-lg hover:bg-[#8A2FFF]/80 transition-colors"
                >
                  Refer Participant
                </button>
              )}
            </div>

            <div className="bg-[#0D0F1A] border border-[#FF2BCD]/30 rounded-2xl p-6 hover:border-[#FF2BCD] transition-all duration-300">
              <div className="w-14 h-14 bg-[#FF2BCD]/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-[#FF2BCD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Campus Coordinator Referrals</h3>
              <p className="text-gray-400 mb-4">Recommend a new campus leader</p>
              
              <div className="space-y-3 mb-4">
                <input
                  type="text"
                  placeholder="Enter name"
                  value={formData.cc.name}
                  onChange={(e) => handleInputChange('cc', 'name', e.target.value)}
                  className="w-full px-4 py-3 bg-[#05070A] border border-[#FF2BCD]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF2BCD] transition-colors"
                />
                <input
                  type="text"
                  placeholder="Enter email or phone"
                  value={formData.cc.contact}
                  onChange={(e) => handleInputChange('cc', 'contact', e.target.value)}
                  className="w-full px-4 py-3 bg-[#05070A] border border-[#FF2BCD]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF2BCD] transition-colors"
                />
              </div>

              {successMessage.cc ? (
                <div className="w-full py-3 bg-green-600 text-white font-bold rounded-lg text-center">
                  Referral submitted (placeholder)
                </div>
              ) : (
                <button 
                  onClick={() => handleSubmit('cc')}
                  className="w-full py-3 bg-[#FF2BCD] text-white font-bold rounded-lg hover:bg-[#FF2BCD]/80 transition-colors"
                >
                  Refer CC
                </button>
              )}
            </div>
          </div>

          <div className="bg-[#0D0F1A] border border-[#8A2FFF]/30 rounded-2xl p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
              <span className="bg-gradient-to-r from-[#32F5FF] to-[#8A2FFF] bg-clip-text text-transparent">
                How You Earn
              </span>
            </h2>
            <div className="max-w-3xl mx-auto">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="w-3 h-3 bg-[#FF2BCD] rounded-full mt-2 mr-4 flex-shrink-0"></span>
                  <span className="text-gray-300">Performance-based rewards: The more successful referrals you make, the higher your earnings</span>
                </li>
                <li className="flex items-start">
                  <span className="w-3 h-3 bg-[#32F5FF] rounded-full mt-2 mr-4 flex-shrink-0"></span>
                  <span className="text-gray-300">Bonus incentives for hitting monthly targets and milestones</span>
                </li>
                <li className="flex items-start">
                  <span className="w-3 h-3 bg-[#8A2FFF] rounded-full mt-2 mr-4 flex-shrink-0"></span>
                  <span className="text-gray-300">Tiered commission rates: Earn 10-30% commission based on referral value</span>
                </li>
                <li className="flex items-start">
                  <span className="w-3 h-3 bg-[#FF2BCD] rounded-full mt-2 mr-4 flex-shrink-0"></span>
                  <span className="text-gray-300">Exclusive prizes and recognition for top referrers each quarter</span>
                </li>
                <li className="flex items-start">
                  <span className="w-3 h-3 bg-[#32F5FF] rounded-full mt-2 mr-4 flex-shrink-0"></span>
                  <span className="text-gray-300">Fast payouts: Receive earnings within 30 days of successful referral completion</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Referrals;
