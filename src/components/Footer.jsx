import { Link } from 'react-router-dom';
import {
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Mail,
  ArrowRight,
  Globe,
  ShieldCheck
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#05070A] pt-24 pb-12 overflow-hidden border-t border-white/5">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF2BCD]/5 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#32F5FF]/5 blur-[120px] rounded-full"></div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
          <div className="space-y-8">
            <Link to="/" className="inline-block group">
              <div className="flex items-center space-x-3">
                <img
                  src="/crescologo.png"
                  alt="Crezco Logo"
                  className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-500"
                />
                <span className="text-2xl font-black tracking-tighter font-outfit uppercase bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">Crezco</span>
              </div>
            </Link>
            <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-xs">
              A student-driven ecosystem engineered for exponential growth, curiosity, and boundless opportunities.
            </p>
            <div className="flex items-center space-x-4">
              {[
                { icon: Twitter, href: '#', color: '#32F5FF' },
                { icon: Instagram, href: '#', color: '#FF2BCD' },
                { icon: Linkedin, href: '#', color: '#8A2FFF' },
                { icon: Github, href: '#', color: '#FFFFFF' }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:scale-110 hover:border-white/20 transition-all group"
                >
                  <social.icon size={18} className="text-gray-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white flex items-center space-x-2">
              <div className="w-1 h-4 bg-[#32F5FF] rounded-full"></div>
              <span>Ecosystem</span>
            </h3>
            <ul className="space-y-4">
              {[
                { name: 'Curious', path: '/curious' },
                { name: 'Student Verticals', path: '/student-verticals' },
                { name: 'Brand Promoter', path: '/brand-promoter' },
                { name: 'Gigs Marketplace', path: '/gigs' }
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-500 hover:text-white text-sm font-black uppercase tracking-widest transition-colors flex items-center group"
                  >
                    <ArrowRight size={12} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white flex items-center space-x-2">
              <div className="w-1 h-4 bg-[#FF2BCD] rounded-full"></div>
              <span>Connect</span>
            </h3>
            <ul className="space-y-4">
              {[
                { name: 'Campus Network', path: '/colleges' },
                { name: 'Global Events', path: '/events' },
                { name: 'Leaderboard', path: '/leaderboard' },
                { name: 'Support Center', path: '#' }
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-500 hover:text-white text-sm font-black uppercase tracking-widest transition-colors flex items-center group"
                  >
                    <ArrowRight size={12} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white flex items-center space-x-2">
              <div className="w-1 h-4 bg-[#8A2FFF] rounded-full"></div>
              <span>Presence</span>
            </h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-white/5 border border-white/10 rounded-2xl text-[#32F5FF]">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Email Us</p>
                  <p className="text-sm font-bold text-white">hello@crezco.in</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-white/5 border border-white/10 rounded-2xl text-[#FF2BCD]">
                  <Globe size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">HQ</p>
                  <p className="text-sm font-bold text-white">Bangalore, India</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-center md:text-left">
            <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">
              &copy; {currentYear} Crezco Global. All Rights Reserved.
            </p>
            <div className="flex items-center space-x-6">
              <Link to="#" className="text-gray-600 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">Privacy</Link>
              <Link to="#" className="text-gray-600 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">Terms</Link>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
            <ShieldCheck size={14} className="text-[#32F5FF]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Secured Network</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
