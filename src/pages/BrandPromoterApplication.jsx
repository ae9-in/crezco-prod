import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function BrandPromoterApplication() {
  return (
    <div className="min-h-screen bg-[#05070A] text-white">
      <Navbar />

      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#8A2FFF] opacity-20 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#FF2BCD] opacity-20 blur-[120px] rounded-full"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-[#8A2FFF] via-[#FF2BCD] to-[#32F5FF] bg-clip-text text-transparent">
                Brand Promoter Application
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Ready to represent exciting brands and develop your marketing skills? Apply now!
            </p>
            <div className="h-1 w-48 bg-gradient-to-r from-[#8A2FFF] via-[#FF2BCD] to-[#32F5FF] mx-auto mt-8 rounded-full"></div>
          </div>

          <div className="max-w-4xl mx-auto bg-[#0D0F1A] border-2 border-[#8A2FFF]/30 rounded-2xl p-8 md:p-12">
            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-lg font-semibold text-white mb-3">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-4 bg-[#0A0F15] border border-[#8A2FFF]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#8A2FFF] focus:ring-2 focus:ring-[#8A2FFF]/50 transition-all duration-300"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-lg font-semibold text-white mb-3">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-4 bg-[#0A0F15] border border-[#8A2FFF]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#8A2FFF] focus:ring-2 focus:ring-[#8A2FFF]/50 transition-all duration-300"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-lg font-semibold text-white mb-3">College/University</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-4 bg-[#0A0F15] border border-[#8A2FFF]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#8A2FFF] focus:ring-2 focus:ring-[#8A2FFF]/50 transition-all duration-300"
                    placeholder="Enter your institution name"
                  />
                </div>
                
                <div>
                  <label className="block text-lg font-semibold text-white mb-3">Year of Study</label>
                  <select 
                    className="w-full px-4 py-4 bg-[#0A0F15] border border-[#8A2FFF]/30 rounded-lg text-white focus:outline-none focus:border-[#8A2FFF] focus:ring-2 focus:ring-[#8A2FFF]/50 transition-all duration-300"
                  >
                    <option value="" className="text-gray-500">Select your year</option>
                    <option value="1st">1st Year</option>
                    <option value="2nd">2nd Year</option>
                    <option value="3rd">3rd Year</option>
                    <option value="4th">4th Year</option>
                    <option value="5th">5th Year or Above</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-lg font-semibold text-white mb-3">Social Media Handles</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-4 bg-[#0A0F15] border border-[#8A2FFF]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#8A2FFF] focus:ring-2 focus:ring-[#8A2FFF]/50 transition-all duration-300"
                  placeholder="LinkedIn, Instagram, Twitter, etc. (separate with commas)"
                />
              </div>
              
              <div>
                <label className="block text-lg font-semibold text-white mb-3">Why do you want to be a Brand Promoter?</label>
                <textarea 
                  rows={5}
                  className="w-full px-4 py-4 bg-[#0A0F15] border border-[#8A2FFF]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#8A2FFF] focus:ring-2 focus:ring-[#8A2FFF]/50 transition-all duration-300"
                  placeholder="Tell us what interests you about brand promotion and marketing..."
                ></textarea>
              </div>
              
              <div>
                <label className="block text-lg font-semibold text-white mb-3">Any Previous Experience? (Optional)</label>
                <textarea 
                  rows={3}
                  className="w-full px-4 py-4 bg-[#0A0F15] border border-[#8A2FFF]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#8A2FFF] focus:ring-2 focus:ring-[#8A2FFF]/50 transition-all duration-300"
                  placeholder="Share any relevant experience in marketing, events, or brand representation..."
                ></textarea>
              </div>
              
              <div className="text-center pt-8">
                <button 
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-[#8A2FFF] via-[#FF2BCD] to-[#32F5FF] text-white font-bold rounded-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
