import { Link } from 'react-router-dom';
import { Twitter, Instagram, Linkedin, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-[#05070A] border-t border-[#FF2BCD]/20">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF2BCD] blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#32F5FF] blur-[120px] rounded-full"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="/crescologo.png" 
                alt="Crezco Logo" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <p className="text-gray-400 text-sm">
              A student-driven ecosystem built for curiosity, growth, and opportunities.
            </p>
          </div>

          <div>
            <h3 className="text-[#32F5FF] font-semibold mb-4 text-lg">Quick Links</h3>
            <div className="space-y-2">
              <Link
                to="/curious"
                className="block text-gray-400 hover:text-[#FF2BCD] transition-colors duration-300"
              >
                Curious
              </Link>
              <Link
                to="/student-verticals"
                className="block text-gray-400 hover:text-[#FF2BCD] transition-colors duration-300"
              >
                Student Verticals
              </Link>
              <Link
                to="/brand-promoter"
                className="block text-gray-400 hover:text-[#FF2BCD] transition-colors duration-300"
              >
                Brand Promoter
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-[#32F5FF] font-semibold mb-4 text-lg">Connect With Us</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-[#0D0F1A] border border-[#FF2BCD]/30 flex items-center justify-center hover:border-[#FF2BCD] hover:neon-border-pink transition-all duration-300"
              >
                <Twitter className="w-5 h-5 text-gray-400 hover:text-[#FF2BCD]" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-[#0D0F1A] border border-[#32F5FF]/30 flex items-center justify-center hover:border-[#32F5FF] hover:neon-border-blue transition-all duration-300"
              >
                <Instagram className="w-5 h-5 text-gray-400 hover:text-[#32F5FF]" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-[#0D0F1A] border border-[#8A2FFF]/30 flex items-center justify-center hover:border-[#8A2FFF] hover:neon-border-purple transition-all duration-300"
              >
                <Linkedin className="w-5 h-5 text-gray-400 hover:text-[#8A2FFF]" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-[#0D0F1A] border border-[#FF2BCD]/30 flex items-center justify-center hover:border-[#FF2BCD] hover:neon-border-pink transition-all duration-300"
              >
                <Github className="w-5 h-5 text-gray-400 hover:text-[#FF2BCD]" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#8A2FFF]/20">
          <div className="h-px bg-gradient-to-r from-transparent via-[#FF2BCD] to-transparent mb-8"></div>
          <p className="text-center text-gray-500 text-sm">
            &copy; 2025 Crezco. All rights reserved. Together, We Grow Stronger.
          </p>
        </div>
      </div>
    </footer>
  );
}
