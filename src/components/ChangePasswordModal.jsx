import React, { useState } from 'react';
import { X, Lock, Eye, EyeOff, KeyRound, CheckCircle, ShieldAlert, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const { apiFetch } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState(1); // 1: Verify Old Password, 2: Enter OTP & New Password
  const [loading, setLoading] = useState(false);
  const [maskedPhone, setMaskedPhone] = useState('');
  const [devOtp, setDevOtp] = useState('');

  // Form Fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password Visibility Toggle
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!isOpen) return null;

  const handleResetAndClose = () => {
    setStep(1);
    setCurrentPassword('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setShowOldPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setDevOtp('');
    setLoading(false);
    onClose();
  };

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast('Please enter your current password', 'warning');
      return;
    }

    try {
      setLoading(true);
      const res = await apiFetch('/api/auth/student/request-change', {
        method: 'POST',
        body: JSON.stringify({ currentPassword }),
      });

      showToast(res.message || 'OTP sent successfully!', 'success');
      setMaskedPhone(res.maskedPhone || 'registered number');
      setDevOtp(res.devOtp || '');
      setStep(2);
    } catch (err) {
      showToast(err.message || 'Verification failed. Please check your password.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP & Save Password
  const handleVerifyAndChange = async (e) => {
    e.preventDefault();
    if (!otp) {
      showToast('Please enter the 6-digit OTP code', 'warning');
      return;
    }
    if (otp.length !== 6) {
      showToast('OTP must be exactly 6 digits', 'warning');
      return;
    }
    if (!newPassword) {
      showToast('Please enter a new password', 'warning');
      return;
    }
    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters long', 'warning');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'warning');
      return;
    }

    try {
      setLoading(true);
      const res = await apiFetch('/api/auth/student/verify-change', {
        method: 'POST',
        body: JSON.stringify({ otp, newPassword }),
      });

      showToast(res.message || 'Password changed successfully!', 'success');
      handleResetAndClose();
    } catch (err) {
      showToast(err.message || 'OTP verification failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-premium overflow-hidden border border-slate-100 transform scale-100 transition-all duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 font-heading">
                Change Account Password
              </h3>
              <p className="text-[10px] text-slate-400 font-medium">
                Step {step} of 2 • Secure verification
              </p>
            </div>
          </div>
          <button 
            onClick={handleResetAndClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-full hover:bg-slate-200 cursor-pointer"
            disabled={loading}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {step === 1 ? (
            /* STEP 1: VERIFY OLD PASSWORD */
            <form onSubmit={handleRequestOtp} className="space-y-5 text-left">
              <div className="text-slate-500 text-xs leading-relaxed">
                To update your password, please verify your identity by entering your current password first. We will send an OTP message on your registered mobile number.
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Current Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showOldPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-800"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                    disabled={loading}
                  >
                    {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl text-xs font-bold tracking-wide shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verifying Password...
                    </>
                  ) : (
                    <>
                      Verify & Send OTP
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* STEP 2: VERIFY OTP AND CHANGE PASSWORD */
            <form onSubmit={handleVerifyAndChange} className="space-y-5 text-left">
              {/* WhatsApp OTP Sent Banner */}
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-emerald-800">OTP Sent via WhatsApp</h4>
                  <p className="text-[11px] text-emerald-600/90 leading-normal">
                    Verification code has been sent to your registered mobile number ending in <span className="font-bold">{maskedPhone.slice(-4)}</span>.
                  </p>
                </div>
              </div>

              {/* Development Mode OTP Helper */}
              {devOtp && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-amber-800">WhatsApp API Offline (Bypass)</h4>
                    <p className="text-[11px] text-amber-700 leading-normal">
                      Your UltraMsg instance is expired/stopped due to non-payment. Use OTP: <span className="font-mono font-bold bg-amber-150 px-2 py-0.5 rounded text-xs select-all text-slate-800">{devOtp}</span>
                    </p>
                  </div>
                </div>
              )}

              {/* OTP Code */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Enter 6-Digit OTP
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="******"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-2.5 text-center text-lg font-bold font-stats bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white tracking-widest transition-all text-slate-800"
                  disabled={loading}
                />
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  New Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    placeholder="Min 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-800"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                    disabled={loading}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Confirm New Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-800"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                    disabled={loading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-250 text-slate-600 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 text-center cursor-pointer"
                  disabled={loading}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl text-xs font-bold tracking-wide shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Changing Password...
                    </>
                  ) : (
                    'Change Password'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
