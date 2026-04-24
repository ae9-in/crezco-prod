import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../lib/axios';
import { useUserRole } from '../context/UserRoleContext';
import {
  AlertCircle,
  CheckCircle2,
  Mail,
  Lock,
  User as UserIcon,
  ArrowRight,
  ShieldCheck,
  Github,
  Chrome
} from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useUserRole();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!email.trim() || !name.trim() || !password.trim()) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
      });

      if (response.data) {
        setSuccess(true);
        setUser(response.data);
        setTimeout(() => navigate('/'), 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      if (response.data) {
        setSuccess(true);
        setUser(response.data);
        setTimeout(() => navigate('/'), 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = isSignUp ? handleSignUp : handleLogin;

  return (
    <div className="min-h-screen bg-[#05070A] text-white flex flex-col selection:bg-[#FF2BCD]/30">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 px-4 flex items-center justify-center relative overflow-hidden">
        {/* Dynamic Background Elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#FF2BCD]/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#32F5FF]/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

        <div className="max-w-xl w-full relative z-10">
          <div className="bg-[#0D0F1A]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 sm:p-12 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden relative group">
            {/* Subtle Top Glow */}
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 ${isSignUp ? 'bg-[#FF2BCD]' : 'bg-[#32F5FF]'} blur-sm opacity-50`}></div>

            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 rounded-2xl mb-6 border border-white/10 group-hover:scale-110 transition-transform duration-500">
                <ShieldCheck size={32} className={isSignUp ? 'text-[#FF2BCD]' : 'text-[#32F5FF]'} />
              </div>
              <h1 className="text-4xl sm:text-5xl font-black mb-4 font-outfit tracking-tight">
                <span className="bg-gradient-to-r from-[#FF2BCD] via-[#8A2FFF] to-[#32F5FF] bg-clip-text text-transparent">
                  {isSignUp ? 'Join Crezco' : 'Welcome Back'}
                </span>
              </h1>
              <p className="text-gray-400 font-medium max-w-xs mx-auto">
                {isSignUp ? 'Become part of the most exclusive student network.' : 'Sign in to access your campus dashboard.'}
              </p>
            </div>

            {error && (
              <div className="mb-8 p-5 bg-red-500/10 border border-red-500/20 rounded-[1.5rem] text-red-400 text-sm flex items-start gap-4 animate-in slide-in-from-top-2 duration-300">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-8 p-5 bg-green-500/10 border border-green-500/20 rounded-[1.5rem] text-green-400 text-sm flex items-start gap-4 animate-in slide-in-from-top-2 duration-300">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="font-medium">{isSignUp ? 'Account created! Entering network...' : 'Access granted! Redirecting...'}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {isSignUp && (
                <div className="relative group/input">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 ml-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within/input:text-[#FF2BCD] transition-colors" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      disabled={loading || success}
                      className="w-full pl-12 pr-6 py-4 bg-[#05070A] border border-white/10 rounded-2xl text-white placeholder-gray-700 focus:outline-none focus:border-[#FF2BCD]/50 transition-all font-bold"
                    />
                  </div>
                </div>
              )}

              <div className="relative group/input">
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within/input:text-[#8A2FFF] transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@university.edu"
                    disabled={loading || success}
                    className="w-full pl-12 pr-6 py-4 bg-[#05070A] border border-white/10 rounded-2xl text-white placeholder-gray-700 focus:outline-none focus:border-[#8A2FFF]/50 transition-all font-bold"
                  />
                </div>
              </div>

              <div className="relative group/input">
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within/input:text-[#32F5FF] transition-colors" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading || success}
                    className="w-full pl-12 pr-6 py-4 bg-[#05070A] border border-white/10 rounded-2xl text-white placeholder-gray-700 focus:outline-none focus:border-[#32F5FF]/50 transition-all font-bold"
                  />
                </div>
              </div>

              {isSignUp && (
                <div className="relative group/input">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 ml-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within/input:text-[#FF2BCD] transition-colors" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      disabled={loading || success}
                      className="w-full pl-12 pr-6 py-4 bg-[#05070A] border border-white/10 rounded-2xl text-white placeholder-gray-700 focus:outline-none focus:border-[#FF2BCD]/50 transition-all font-bold"
                    />
                  </div>
                </div>
              )}

              {!isSignUp && (
                <div className="flex justify-end">
                  <button type="button" className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-[#32F5FF] transition-colors">Forgot Password?</button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || success}
                className={`w-full py-5 ${isSignUp ? 'bg-[#FF2BCD]' : 'bg-[#32F5FF] text-black'} font-black rounded-2xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all shadow-2xl flex items-center justify-center space-x-3 mt-4`}
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>{isSignUp ? 'Initialize Account' : 'Authenticate'}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-12">
              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest text-gray-600"><span className="bg-[#0D0F1A] px-4">Or continue with</span></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center space-x-2 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
                  <Chrome size={18} className="text-white" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Google</span>
                </button>
                <button className="flex items-center justify-center space-x-2 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
                  <Github size={18} className="text-white" />
                  <span className="text-[10px] font-black uppercase tracking-widest">GitHub</span>
                </button>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">
                {isSignUp ? 'Member already?' : "New to the network?"}{' '}
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError(null);
                    setSuccess(false);
                  }}
                  className={`${isSignUp ? 'text-[#FF2BCD]' : 'text-[#32F5FF]'} hover:underline transition-all ml-1`}
                >
                  {isSignUp ? 'Access Account' : 'Create Profile'}
                </button>
              </p>
            </div>
          </div>

          <p className="mt-10 text-center text-gray-600 text-[10px] font-black uppercase tracking-widest flex items-center justify-center space-x-2">
            <span>Protected by Crezco Guard</span>
            <ShieldCheck size={12} />
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
