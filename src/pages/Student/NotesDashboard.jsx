import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, API_BASE_URL } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import SecureViewerModal from '../../components/SecureViewerModal';
import {
  GraduationCap,
  User,
  Phone,
  BookOpen,
  Lock,
  Unlock,
  Download,
  LogOut,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import logo from '../../assets/logo.png';

const NotesDashboard = () => {
  const navigate = useNavigate();
  const { logout, apiFetch, user } = useAuth();
  const { showToast } = useToast();

  const [profile, setProfile] = useState(null);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch student profile
        const profileData = await apiFetch('/api/students/profile');
        setProfile(profileData);

        // Fetch study materials securely filtered for student
        const materialsData = await apiFetch('/api/study-materials/student');
        setStudyMaterials(materialsData);
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
    showToast('Logged out successfully', 'success');
    navigate('/');
  };

  const handleLockedClick = (material) => {
    const whatsappNumber = '919703040756';
    const text = `Hi, I have logged in as Student ID "${profile?.studentId}" and I want to unlock the study material "${material.title}" for class "${material.targetClass}".`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bgLight flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-slate-400 font-semibold text-sm">Loading Student Portal...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bgLight flex flex-col font-sans">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-all" onClick={() => navigate('/')}>
              <img src={logo} alt="Vidyarthi Classes" className="w-10 h-10 object-contain" />
              <div>
                <span className="text-lg font-bold font-heading text-primary leading-none block">
                  Vidyarthi Classes
                </span>
                <span className="text-[10px] font-bold tracking-widest text-secondary uppercase font-stats mt-0.5 block">
                  Student Portal
                </span>
              </div>
            </div>

            {/* Back & Logout Action */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-750 bg-slate-50 hover:bg-slate-100 border border-slate-150 hover:border-slate-200 rounded-xl transition-all duration-200 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Home
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-danger bg-rose-50 hover:bg-rose-100 border border-rose-100 hover:border-rose-200 rounded-xl transition-all duration-200 cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* DASHBOARD BODY */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* WELCOME BANNER */}
        <div className="bg-gradient-to-r from-primary to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading">
              Welcome back, {profile?.name}!
            </h1>
            <p className="text-indigo-200 text-sm font-medium">
              Access your learning materials and unlock new notes.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-secondary text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-md">
            <GraduationCap className="w-4 h-4" /> Notes Member
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* PROFILE / DETAILS CARD */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-primary font-heading border-b border-slate-100 pb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-secondary" /> Student Details
            </h2>
            <div className="space-y-4 text-sm text-left">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Student ID</span>
                <span className="font-bold text-slate-800 font-stats bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-150 inline-block">
                  {profile?.studentId}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Full Name</span>
                <span className="font-semibold text-slate-700">{profile?.name}</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Father's Name</span>
                <span className="font-semibold text-slate-700">{profile?.fatherName}</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Course / Class</span>
                <span className="bg-primary/5 text-primary px-2.5 py-1 rounded-full text-[10px] font-bold inline-block border border-primary/10">
                  {profile?.class}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Registered Phone</span>
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-slate-400" /> {profile?.phone}
                </span>
              </div>
            </div>
          </div>

          {/* STUDY MATERIALS LIST */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-xl font-bold text-primary font-heading flex items-center gap-2">
                <BookOpen className="w-5.5 h-5.5 text-secondary" /> Study Materials ({profile?.class})
              </h2>
            </div>

            {studyMaterials.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center text-slate-400 font-semibold">
                No study materials found for your class.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {studyMaterials.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
                  >
                    <div className="p-6 space-y-4">
                      <div className="flex justify-between items-start gap-2">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            item.isUnlocked
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          {item.isUnlocked ? (
                            <>
                              <Unlock className="w-3 h-3" /> Unlocked
                            </>
                          ) : (
                            <>
                              <Lock className="w-3 h-3 text-slate-400" /> Locked
                            </>
                          )}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          {item.targetClass}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-left">
                        <h3 className="font-bold text-slate-800 text-base line-clamp-2">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="text-slate-500 text-xs line-clamp-3 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between gap-3">
                      {item.isUnlocked ? (
                        <button
                          onClick={() => setSelectedNote(item)}
                          className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                        >
                          <BookOpen className="w-4 h-4" /> View Material
                        </button>
                      ) : (
                        <button
                          onClick={() => handleLockedClick(item)}
                          className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary-light rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                        >
                          <Lock className="w-4 h-4" /> Request Access
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Secure Viewer Modal */}
      {selectedNote && (
        <SecureViewerModal
          isOpen={!!selectedNote}
          onClose={() => setSelectedNote(null)}
          fileUrl={selectedNote.fileUrl.startsWith('http') ? selectedNote.fileUrl : `${API_BASE_URL}${selectedNote.fileUrl}`}
          title={selectedNote.title}
          student={{
            name: profile?.name,
            studentId: profile?.studentId,
            phone: profile?.phone
          }}
        />
      )}

      {/* FOOTER */}
      <footer className="bg-primary text-white py-6 border-t border-slate-800 text-center text-xs mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-400 font-medium">
          &copy; {new Date().getFullYear()} Vidyarthi Classes, Kota. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default NotesDashboard;
