import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(email, password, name, 'student');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F0] dark:bg-[#141210] flex">
      {/* Left Column: Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:w-1/2 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          {/* Logo & Header */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#F5B731] flex items-center justify-center text-stone-950 font-bold shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-stone-950 dark:text-white block leading-tight">
                EduCamino
              </span>
              <span className="text-[10px] font-extrabold text-[#D97706] dark:text-amber-400 block uppercase tracking-wider">
                TEZHACK 2026
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E1B18] p-8 rounded-3xl border border-stone-200/80 dark:border-stone-800/80 shadow-2xs">
            <div className="mb-6">
              <div className="inline-block mb-2">
                <span className="bg-[#FEF3D6] dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border border-amber-300/40 dark:border-amber-800/40 text-[10px] font-black tracking-wider px-3.5 py-1 rounded-full uppercase">
                  NEW STUDENT REGISTRATION
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-950 dark:text-white tracking-tight">
                Create an account
              </h2>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-stone-950 dark:text-amber-300 hover:underline">
                  Sign in now &rarr;
                </Link>
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 p-3 rounded-xl text-xs border border-rose-200 dark:border-rose-900/60 font-medium">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-900 dark:text-stone-200 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full px-3.5 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 outline-none focus:ring-2 focus:ring-[#F5B731] transition-colors"
                  placeholder="Sanjit Barua"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-900 dark:text-stone-200 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-3.5 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 outline-none focus:ring-2 focus:ring-[#F5B731] transition-colors"
                  placeholder="student@tezhack.in"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-900 dark:text-stone-200 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-3.5 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 outline-none focus:ring-2 focus:ring-[#F5B731] transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 rounded-xl text-xs font-bold text-stone-950 bg-[#F5B731] hover:bg-amber-500 transition-all shadow-xs disabled:opacity-70 cursor-pointer"
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right Column: Visual Showcase */}
      <div className="hidden lg:flex relative w-0 flex-1 bg-stone-950 dark:bg-black items-center justify-center overflow-hidden border-l border-stone-800">
        <div className="relative z-10 px-12 max-w-2xl text-left text-white space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-[#F5B731] p-3 rounded-2xl text-stone-950 font-bold shadow-xs">
              <GraduationCap className="w-8 h-8" />
            </div>
            <span className="text-3xl font-bold tracking-tight">EduCamino</span>
          </div>

          <h2 className="text-4xl font-bold leading-tight tracking-tight text-white">
            Unlock your <br />
            <span className="text-[#F5B731]">academic potential.</span>
          </h2>
          <p className="text-sm text-stone-300 font-medium max-w-md leading-relaxed">
            Connect with verified scholarships across India using transparent deterministic matching against your actual qualifications.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="bg-stone-900/90 p-5 rounded-2xl border border-stone-800">
              <Sparkles className="w-5 h-5 text-[#F5B731] mb-2" />
              <h3 className="font-bold text-sm mb-1 text-white">Smart Matching</h3>
              <p className="text-stone-400 text-xs leading-relaxed">Evaluates your profile against official government and institutional criteria.</p>
            </div>
            <div className="bg-stone-900/90 p-5 rounded-2xl border border-stone-800">
              <ShieldCheck className="w-5 h-5 text-[#F5B731] mb-2" />
              <h3 className="font-bold text-sm mb-1 text-white">Verified Sources</h3>
              <p className="text-stone-400 text-xs leading-relaxed">100% authentic scholarships from government and private foundations.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
