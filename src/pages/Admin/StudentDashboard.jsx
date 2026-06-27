import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  GraduationCap,
  User,
  Phone,
  MapPin,
  Coins,
  DollarSign,
  TrendingDown,
  Gift,
  LogOut,
  CalendarDays,
  Award,
  Loader2,
  FileSpreadsheet
} from 'lucide-react';
import logo from '../../assets/logo.png';


const StudentDashboard = () => {
  const navigate = useNavigate();
  const { logout, apiFetch } = useAuth();
  const { showToast } = useToast();

  const [profile, setProfile] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch student profile
        const profileData = await apiFetch('/api/students/profile');
        setProfile(profileData);

        // Fetch student test results (automatically filtered on backend by student class)
        const resultsData = await apiFetch('/api/results');
        setResults(resultsData);
      } catch (err) {
        showToast(err.message || 'Error fetching dashboard data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'info');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bgLight flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-bgLight flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-premium text-center space-y-4 max-w-sm">
          <p className="text-slate-500 font-bold">Could not load student profile.</p>
          <button onClick={handleLogout} className="px-5 py-2 text-white bg-primary rounded-lg text-xs">
            Go to Website
          </button>
        </div>
      </div>
    );
  }

  const netFeePayable = profile.totalFees - profile.discount;
  const pendingFeeBalance = netFeePayable - profile.paidFees;

  return (
    <div className="min-h-screen bg-bgLight flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm flex items-center justify-between px-6 h-20 shrink-0">
        <div className="flex items-center gap-2.5">
          <img src={logo} alt="Vidyarthi Classes Logo" className="w-10 h-10 object-contain" />
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-primary font-heading leading-none block">
              Vidyarthi Classes Kota
            </h1>
            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest font-stats mt-0.5 block">
              Student Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <span className="text-xs text-slate-400 block font-medium">Logged in as Student</span>
            <span className="text-sm font-bold text-slate-700">{profile.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-rose-50 hover:bg-rose-100 text-danger p-2.5 rounded-xl transition-all duration-200 cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-grow max-w-7xl mx-auto w-full p-6 md:p-8 space-y-8 text-slate-800 text-left">
        
        {/* Welcome Section */}
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-primary font-heading">Welcome, {profile.name}!</h2>
          <p className="text-xs text-slate-450">Manage your course registration details, fee bills, and check test scorecard marks.</p>
        </div>

        {/* Profile Card & Goodies box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Details Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-premium space-y-5 md:col-span-2">
            <h3 className="text-sm font-extrabold text-primary font-heading relative pl-3">
              Student Information
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3 bg-secondary rounded-full" />
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-2.5">
                <div className="bg-slate-50 p-2 rounded-lg text-primary"><User className="w-4 h-4" /></div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Student ID</span>
                  <span className="text-slate-800 font-bold font-stats text-sm">{profile.studentId}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="bg-slate-50 p-2 rounded-lg text-primary"><GraduationCap className="w-4 h-4" /></div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Registered Class</span>
                  <span className="text-slate-800 font-bold">{profile.class}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="bg-slate-50 p-2 rounded-lg text-primary"><Phone className="w-4 h-4" /></div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Phone Number</span>
                  <span className="text-slate-800">{profile.phone}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="bg-slate-50 p-2 rounded-lg text-primary"><MapPin className="w-4 h-4" /></div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Home Address</span>
                  <span className="text-slate-800 line-clamp-1">{profile.address || 'Kota, Rajasthan'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Goodies Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-premium flex flex-col justify-between">
            <h3 className="text-sm font-extrabold text-primary font-heading relative pl-3">
              Goodies Inventory
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3 bg-secondary rounded-full" />
            </h3>
            
            <div className="py-4 flex items-center gap-4">
              <div className={`p-4 rounded-2xl ${
                profile.goodiesStatus === 'All Distributed' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-secondary'
              }`}>
                <Gift className="w-8 h-8" />
              </div>
              <div className="text-left">
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Distribution Status</span>
                <span className="text-base font-bold text-slate-800 mt-1 block">{profile.goodiesStatus}</span>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 font-semibold bg-slate-50 p-2.5 rounded-xl">
              Goodies Bill: ₹{profile.goodiesTotalFee} | Paid: ₹{profile.goodiesPaidFee}
            </div>
          </div>
        </div>

        {/* Fees Ledger Cards */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-primary font-heading relative pl-3">
            Your Fees Ledger Summary
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3 bg-secondary rounded-full" />
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-premium">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Course Base Fee</span>
              <span className="text-xl font-bold font-stats text-primary mt-1.5 block">₹{profile.totalFees.toLocaleString()}</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-premium">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Discount Availed</span>
              <span className="text-xl font-bold font-stats text-rose-500 mt-1.5 block">- ₹{profile.discount.toLocaleString()}</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-premium">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Amount Paid</span>
              <span className="text-xl font-bold font-stats text-emerald-600 mt-1.5 block">₹{profile.paidFees.toLocaleString()}</span>
            </div>

            <div className={`p-5 rounded-2xl border ${
              pendingFeeBalance > 0 ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'
            } shadow-premium`}>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Pending Balance</span>
              <span className={`text-xl font-black font-stats mt-1.5 block ${
                pendingFeeBalance > 0 ? 'text-danger' : 'text-emerald-600'
              }`}>
                ₹{pendingFeeBalance > 0 ? pendingFeeBalance.toLocaleString() : '0'}/-
              </span>
            </div>
          </div>
        </div>

        {/* Published Test Results Scorecard */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-primary font-heading relative pl-3">
            Exam Performance Scorecard
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3 bg-secondary rounded-full" />
          </h3>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-premium overflow-hidden">
            {results.length === 0 ? (
              <div className="text-slate-400 py-16 text-center text-sm font-medium flex flex-col items-center gap-2">
                <FileSpreadsheet className="w-10 h-10 text-slate-300" />
                <p>No published test results available yet for your class.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <th className="px-6 py-4">Subject</th>
                      <th className="px-6 py-4">Test Date</th>
                      <th className="px-6 py-4">Marks Obtained</th>
                      <th className="px-6 py-4">Total Marks</th>
                      <th className="px-6 py-4">Percentage</th>
                      <th className="px-6 py-4">Performance Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-650 font-medium">
                    {results.map((test) => {
                      // Find student specific score in results array
                      const score = test.results.find((res) => res.studentId === profile.studentId);
                      if (!score) return null;

                      const percentage = ((score.marks / score.totalMarks) * 100).toFixed(1);

                      return (
                        <tr key={test._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-800 flex items-center gap-2">
                            <Award className="w-4 h-4 text-secondary shrink-0" />
                            {test.subject}
                          </td>
                          <td className="px-6 py-4 text-slate-400">
                            <div className="flex items-center gap-1.5">
                              <CalendarDays className="w-4 h-4" />
                              {new Date(test.testDate).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-bold text-primary font-stats text-sm">
                            {score.marks}
                          </td>
                          <td className="px-6 py-4 font-stats">
                            {score.totalMarks}
                          </td>
                          <td className="px-6 py-4 font-stats font-bold text-slate-700">
                            {percentage}%
                          </td>
                          <td className="px-6 py-4">
                            <span className="bg-primary/5 text-primary text-[10px] font-black px-3 py-1 rounded-full border border-primary/10">
                              Grade {score.grade || 'A'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
};

export default StudentDashboard;
