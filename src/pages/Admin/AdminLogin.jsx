import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { GraduationCap, Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import logo from '../../assets/logo.png';


const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, token } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (token) {
      navigate('/admin/dashboard');
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      showToast('Welcome back! Login successful.', 'success');
      navigate('/admin/dashboard');
    } else {
      showToast(result.message || 'Invalid credentials', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Decorative Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-secondary/15 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      {/* Back to Home floating button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 text-white/70 hover:text-white flex items-center gap-2 text-sm font-medium transition-all group duration-200"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Website
      </button>

      {/* Card Container */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-white/10 p-8 sm:p-10 transform scale-100 transition-all duration-300 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <img src={logo} alt="Vidyarthi Classes Logo" className="w-20 h-20 object-contain mx-auto" />
          <div>
            <h2 className="text-2xl font-extrabold font-heading text-primary">Admin Portal</h2>
            <p className="text-slate-400 text-xs mt-1">Sign in to manage Vidyarthi Classes Kota</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@vidyarthi.com"
                className="w-full pl-11 pr-4 py-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-slate-800 placeholder-slate-400"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-11 py-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-slate-800 placeholder-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary-light text-white py-3.5 px-4 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-75 disabled:pointer-events-none"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Demo Hint */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Demo Credentials:<br />
            Email: <strong className="text-slate-600 font-semibold">admin@vidyarthi.com</strong><br />
            Password: <strong className="text-slate-600 font-semibold">admin123</strong>
          </p>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
