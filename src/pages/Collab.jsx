import React from 'react';
import { Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Collab() {
  return (
    <div className="min-h-screen bg-[#05070A] text-white">
      <Navbar />

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF2BCD] opacity-20 blur-[120px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#32F5FF] opacity-20 blur-[120px] rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#8A2FFF] opacity-10 blur-[150px] rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <div className="float">
              <div className="inline-block p-6 bg-[#0D0F1A] border-2 border-[#8A2FFF] rounded-3xl neon-border-purple mb-8">
                <Sparkles className="w-20 h-20 text-[#8A2FFF]" />
              </div>
            </div>

            <h1 className="text-6xl sm:text-7xl md:text-8xl font-black mb-6">
              <span className="bg-gradient-to-r from-[#8A2FFF] via-[#FF2BCD] to-[#32F5FF] bg-clip-text text-transparent neon-glow-purple">
                Coming Soon
              </span>
            </h1>

            <p className="text-2xl sm:text-3xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12">
              Institute Collaboration Portal
            </p>

            <div className="bg-[#0D0F1A] border-2 border-[#FF2BCD]/30 rounded-2xl p-8 md:p-12 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">
                <span className="bg-gradient-to-r from-[#FF2BCD] to-[#32F5FF] bg-clip-text text-transparent">
                  Partner With Us
                </span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                We're building something extraordinary for educational institutions. Join us in creating a platform where colleges and universities can collaborate, share resources, and empower students together.
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-[#FF2BCD] rounded-full pulse-glow"></div>
                  <span className="text-gray-300">Seamless integration with existing systems</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-[#32F5FF] rounded-full pulse-glow" style={{ animationDelay: '0.5s' }}></div>
                  <span className="text-gray-300">Data-driven insights and analytics</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-[#8A2FFF] rounded-full pulse-glow" style={{ animationDelay: '1s' }}></div>
                  <span className="text-gray-300">Custom solutions for your institution</span>
                </div>
              </div>

              <div className="mt-12">
                <button className="px-8 py-4 bg-gradient-to-r from-[#FF2BCD] via-[#8A2FFF] to-[#32F5FF] text-white font-bold rounded-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  Get Early Access
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
              <div className="bg-[#0D0F1A] border border-[#FF2BCD]/30 rounded-xl p-6">
                <div className="text-4xl font-black text-[#FF2BCD] mb-2">500+</div>
                <div className="text-gray-400">Institutions Interested</div>
              </div>
              <div className="bg-[#0D0F1A] border border-[#32F5FF]/30 rounded-xl p-6">
                <div className="text-4xl font-black text-[#32F5FF] mb-2">50K+</div>
                <div className="text-gray-400">Students Ready</div>
              </div>
              <div className="bg-[#0D0F1A] border border-[#8A2FFF]/30 rounded-xl p-6">
                <div className="text-4xl font-black text-[#8A2FFF] mb-2">Q2 2025</div>
                <div className="text-gray-400">Launch Date</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
