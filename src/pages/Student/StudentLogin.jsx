import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { GraduationCap, User, Lock, Eye, EyeOff, Loader2, ArrowLeft, HelpCircle } from 'lucide-react';
import logo from '../../assets/logo.png';

const StudentLogin = () => {
  const navigate = useNavigate();
  const { login, token, user } = useAuth();
  const { showToast } = useToast();

  const [studentIdOrPhone, setStudentIdOrPhone] = useState('');
  const [password, setPassword] = useState('Vidyarthi@20'); // Pre-fill default password
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect to student dashboard
  useEffect(() => {
    if (token && user && user.role === 'student') {
      navigate('/student/dashboard');
    }
  }, [token, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentIdOrPhone || !password) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    setIsSubmitting(true);
    const result = await login(studentIdOrPhone, password);
    setIsSubmitting(false);

    if (result.success) {
      if (result.role === 'student') {
        showToast('Login successful! Welcome to your Student Portal.', 'success');
        navigate('/student/dashboard');
      } else {
        showToast('Only student credentials can log in here.', 'warning');
        navigate('/');
      }
    } else {
      showToast(result.message || 'Invalid Student ID or Password', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary/15 rounded-full blur-3xl" />

      {/* Back to Home floating button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 text-white/75 hover:text-white flex items-center gap-2 text-sm font-medium transition-all group duration-200"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Website
      </button>

      {/* Card Container */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8 sm:p-10 transform scale-100 transition-all duration-300 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <img src={logo} alt="Vidyarthi Classes Logo" className="w-18 h-18 object-contain mx-auto" />
          <div>
            <h2 className="text-2xl font-extrabold font-heading text-primary flex items-center justify-center gap-2">
              <GraduationCap className="w-6 h-6 text-secondary" />
              Student Portal
            </h2>
            <p className="text-slate-500 text-xs mt-1 font-semibold">Access your scorecard, fees, & goodies details</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Student ID or Phone */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Student ID / Registered Phone</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <User className="w-5 h-5" />
              </span>
              <input
                type="text"
                required
                value={studentIdOrPhone}
                onChange={(e) => setStudentIdOrPhone(e.target.value)}
                placeholder="e.g. ABC12 or 9876543210"
                className="w-full pl-11 pr-4 py-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none text-slate-800 placeholder-slate-400"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5 text-left">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Password</label>
              <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                Default is Vidyarthi@20
              </span>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Vidyarthi@20"
                className="w-full pl-11 pr-11 py-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none text-slate-800 placeholder-slate-400"
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
            className="w-full bg-secondary hover:bg-secondary-light text-slate-900 py-3.5 px-4 rounded-xl text-sm font-black shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-75 disabled:pointer-events-none"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                Enter Dashboard
              </>
            )}
          </button>
        </form>

        {/* Support Note */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-slate-400 text-[10px] leading-relaxed font-semibold">
            In case of login problems, please contact the institute office to confirm your registered mobile number and Student ID card details.
          </p>
        </div>

      </div>
    </div>
  );
};

export default StudentLogin;
