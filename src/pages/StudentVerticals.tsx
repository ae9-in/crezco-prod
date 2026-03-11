import { Briefcase, Megaphone, UserCheck } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function StudentVerticals() {
  const verticals = [
    {
      icon: Megaphone,
      title: 'Digital Marketing and Content Creation',
      description: 'Create compelling content, manage social media, and drive engagement for brands',
      color: 'from-[#FF2BCD] to-[#8A2FFF]',
      borderColor: 'border-[#FF2BCD]',
      benefits: [
        'Content creation skills',
        'Social media expertise',
        'Brand storytelling',
        'Analytics proficiency',
      ],
    },
    {
      icon: UserCheck,
      title: 'HR',
      description: 'Manage recruitment, organize events, and build student networks within your campus',
      color: 'from-[#32F5FF] to-[#8A2FFF]',
      borderColor: 'border-[#32F5FF]',
      benefits: [
        'Leadership experience',
        'Network building',
        'Event management',
        'People skills development',
      ],
    },
    {
      icon: Briefcase,
      title: 'Intern',
      description: 'Gain real-world experience across various domains and build your professional portfolio',
      color: 'from-[#8A2FFF] to-[#FF2BCD]',
      borderColor: 'border-[#8A2FFF]',
      benefits: [
        'Hands-on experience',
        'Industry exposure',
        'Skill development',
        'Resume building',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#05070A] text-white">
      <Navbar />

      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#32F5FF] opacity-20 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#8A2FFF] opacity-20 blur-[120px] rounded-full"></div>
        </div>

        <div className="absolute inset-0 scanline pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-[#32F5FF] via-[#8A2FFF] to-[#FF2BCD] bg-clip-text text-transparent">
                Student Verticals
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Transform your student journey with hands-on roles that build real skills and open doors to opportunities.
            </p>
            <div className="h-1 w-48 bg-gradient-to-r from-[#32F5FF] via-[#8A2FFF] to-[#FF2BCD] mx-auto mt-8 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16">
            {verticals.map((vertical, index) => (
              <div
                key={index}
                className={`group relative bg-[#0D0F1A] border-2 ${vertical.borderColor}/30 rounded-2xl p-8 overflow-hidden transition-all duration-500 hover:${vertical.borderColor} hover:scale-105`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${vertical.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                <div className="relative z-10">
                  <div className="flex items-start space-x-6 mb-6">
                    <div className={`w-20 h-20 bg-gradient-to-br ${vertical.color} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500`}>
                      <vertical.icon className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-2">{vertical.title}</h3>
                      <p className="text-gray-400 leading-relaxed">{vertical.description}</p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <h4 className="text-lg font-semibold text-white mb-3">What You'll Gain:</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {vertical.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <div className={`w-2 h-2 bg-gradient-to-r ${vertical.color} rounded-full`}></div>
                          <span className="text-gray-400 text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8">
                    <a 
                      href="https://docs.google.com/forms/d/e/1FAIpQLSdsd_eaTZugiVT-sxeebMKKAxoc3GvhL_ctUVU072ykurUFIw/viewform"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-8 py-4 bg-gradient-to-r ${vertical.color} text-white font-bold rounded-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 inline-block`}
                    >
                      Apply Now
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 bg-[#0D0F1A] border border-[#FF2BCD]/30 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-[#FF2BCD] to-[#32F5FF] bg-clip-text text-transparent">
                Why Choose Student Verticals?
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#FF2BCD] to-[#FF2BCD]/50 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">01</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Real Experience</h3>
                <p className="text-gray-400 text-sm">Work on actual projects that matter</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#32F5FF] to-[#32F5FF]/50 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">02</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Flexible Hours</h3>
                <p className="text-gray-400 text-sm">Balance studies and work seamlessly</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#8A2FFF] to-[#8A2FFF]/50 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">03</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Mentorship</h3>
                <p className="text-gray-400 text-sm">Learn from industry professionals</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#FF2BCD] to-[#FF2BCD]/50 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">04</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Certificate</h3>
                <p className="text-gray-400 text-sm">Get recognized for your contributions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
