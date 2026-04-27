import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function CampusCoordinator() {
  return (
    <div className="min-h-screen bg-[#05070A] text-white">
      <Navbar />

      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FF2BCD] opacity-20 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#32F5FF] opacity-20 blur-[120px] rounded-full"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mt-16">
            <div className="group relative bg-[#0D0F1A] border-2 border-[#FF2BCD]/30 rounded-2xl p-8 md:p-12 max-w-2xl w-full overflow-hidden transition-all duration-500 hover:border-[#FF2BCD] hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF2BCD] to-[#FF2BCD]/10 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              
              <div className="relative z-10 text-center">
                <h1 className="text-4xl md:text-5xl font-black mb-4">
                  <span className="bg-gradient-to-r from-[#FF2BCD] via-[#8A2FFF] to-[#32F5FF] bg-clip-text text-transparent">
                    Campus Coordinator
                  </span>
                </h1>
                
                <p className="text-2xl md:text-3xl text-white mb-6">
                  Lead, influence, and help students grow across your campus.
                </p>
                
                <div className="h-1 w-32 bg-gradient-to-r from-[#FF2BCD] via-[#8A2FFF] to-[#32F5FF] mx-auto rounded-full mb-8"></div>
                
                <p className="text-gray-400 mb-8">
                  Campus Coordinators act as leaders within their institution, representing Crezco, supporting student engagement, helping manage activities, and fostering opportunities for growth.
                </p>
                
                <div className="mt-8">
                  <a 
                    href="https://docs.google.com/forms/d/e/1FAIpQLSe8bc0PIsMQcPIdonf0ff4CZ-aWTZw_7qKS2g4gSV3a-p1xQQ/viewform?usp=dialog"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 bg-gradient-to-r from-[#FF2BCD] via-[#8A2FFF] to-[#32F5FF] text-white font-bold rounded-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 inline-block"
                  >
                    Apply Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
