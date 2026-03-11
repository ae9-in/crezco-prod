import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../lib/axios';
import { useUserRole } from '../context/UserRoleContext';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

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
        setTimeout(() => navigate('/'), 1000);
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
        setTimeout(() => navigate('/'), 1000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = isSignUp ? handleSignUp : handleLogin;

  return (
    <div className="min-h-screen bg-[#05070A] text-white flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-16 px-4 flex items-center justify-center relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#ff00801a] blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#0070f31a] blur-[120px] rounded-full" />

        <div className="max-w-md w-full relative z-10">
          <div className="bg-[#0D0F1A] border border-[#FF2BCD]/20 rounded-2xl p-8 shadow-2xl backdrop-blur-md">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF2BCD] via-[#8A2FFF] to-[#32F5FF] mb-3 font-outfit">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h1>
              <p className="text-gray-400 font-inter">
                {isSignUp ? 'Join the Crezco community' : 'Sign in to continue your journey'}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <p>{isSignUp ? 'Account created! Redirecting...' : 'Login successful! Redirecting...'}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    disabled={loading || success}
                    className="w-full px-4 py-3 bg-[#05070A] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#FF2BCD]/50 transition-all font-inter"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  disabled={loading || success}
                  className="w-full px-4 py-3 bg-[#05070A] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#FF2BCD]/50 transition-all font-inter"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading || success}
                  className="w-full px-4 py-3 bg-[#05070A] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#FF2BCD]/50 transition-all font-inter"
                />
              </div>

              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading || success}
                    className="w-full px-4 py-3 bg-[#05070A] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#FF2BCD]/50 transition-all font-inter"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading || success}
                className="w-full py-3.5 bg-gradient-to-r from-[#FF2BCD] to-[#8A2FFF] text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-[#FF2BCD]/20 mt-2 font-inter"
              >
                {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm font-inter">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError(null);
                    setSuccess(false);
                  }}
                  className="text-[#FF2BCD] hover:text-[#FF2BCD]/80 font-semibold transition-colors ml-1"
                >
                  {isSignUp ? 'Login instead' : 'Create profile'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
