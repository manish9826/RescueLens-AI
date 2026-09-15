import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RescueLensLogo from '../components/RescueLensLogo';
import { ShieldCheck, MapPin, Sparkles, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, loginAsDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        login(data.token, data.user);
        navigate(from, { replace: true });
      } else {
        setError(data.error || 'Invalid email or password.');
      }
    } catch (err) {
      setError('A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemo = () => {
    loginAsDemo();
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-[#090D16] text-white">
      {/* Left Column - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 border-r border-slate-800 flex-col justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-cyber opacity-10 pointer-events-none"></div>
        <div className="absolute top-12 left-12">
          <RescueLensLogo size="lg" />
        </div>
        <div className="relative z-10 max-w-lg mt-12">
          <h1 className="text-4xl font-black mb-6">See the Emergency.<br/>Understand the Risk.<br/><span className="text-red-500">Act Faster.</span></h1>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Sparkles className="w-6 h-6 text-cyan-400 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg">AI Emergency Analysis</h3>
                <p className="text-slate-400">Instantly assess scene severity and identify critical risks.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <ShieldCheck className="w-6 h-6 text-green-400 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg">Live Rescue Guidance</h3>
                <p className="text-slate-400">Get actionable safety instructions before help arrives.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-blue-400 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg">Location Assistance</h3>
                <p className="text-slate-400">Securely pinpoint and share exact emergency coordinates.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="lg:hidden mb-8 flex justify-center">
             <RescueLensLogo size="md" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">Welcome back to RescueLens</h2>
          <p className="text-slate-400 mb-8">Sign in to access your emergency tools.</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
              <input 
                type="email" 
                required 
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                placeholder="commander@rescuelens.ai"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required 
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input type="checkbox" className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-cyan-500" />
                Remember me
              </label>
              <a href="#" className="text-cyan-400 hover:text-cyan-300 font-semibold">Forgot password?</a>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white font-bold py-3 rounded-xl shadow-lg transition-colors"
            >
              {isSubmitting ? 'Logging in...' : 'LOGIN'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <p className="text-slate-400 mb-4">Don't have an account? <Link to="/signup" className="text-cyan-400 font-bold hover:underline">Create Account</Link></p>
            <button 
              onClick={handleDemo}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3 rounded-xl border border-slate-700 transition-colors"
            >
              Continue as Demo User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
