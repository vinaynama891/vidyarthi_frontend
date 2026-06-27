import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  GraduationCap,
  User,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  ClipboardList,
  LogOut,
  Plus,
  Loader2,
  BookOpen,
  Users,
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';
import logo from '../../assets/logo.png';


const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { logout, apiFetch } = useAuth();
  const { showToast } = useToast();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Test Submission Form States
  const [selectedClass, setSelectedClass] = useState('');
  const [subject, setSubject] = useState('');
  const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [submittingTest, setSubmittingTest] = useState(false);

  // Student Marks State: { [studentId]: { marks: '', totalMarks: 100, grade: 'A' } }
  const [marksState, setMarksState] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await apiFetch('/api/teachers/profile');
        setProfile(data);
        setSubject(data.subject || '');
        if (data.classesAssigned && data.classesAssigned.length > 0) {
          setSelectedClass(data.classesAssigned[0]);
        }
      } catch (err) {
        showToast(err.message || 'Error fetching teacher profile', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'info');
    navigate('/');
  };

  // Fetch student roster for the selected class to input marks
  const loadClassRoster = async () => {
    if (!selectedClass) {
      showToast('Please select a target class first', 'error');
      return;
    }

    try {
      setLoadingStudents(true);
      // Fetch students matching the class filter
      const roster = await apiFetch(`/api/students?classFilter=${selectedClass}`);
      setStudents(roster);

      // Initialize marks inputs for each student
      const initialMarks = {};
      roster.forEach((stu) => {
        initialMarks[stu.studentId] = {
          studentId: stu.studentId,
          studentName: stu.name,
          marks: '',
          totalMarks: 50, // default total marks
          grade: 'A'
        };
      });
      setMarksState(initialMarks);
    } catch (err) {
      showToast(err.message || 'Error loading student roster', 'error');
    } finally {
      setLoadingStudents(false);
    }
  };

  // Helper to calculate Grade dynamically based on percentage
  const calculateGrade = (marks, totalMarks) => {
    const m = parseFloat(marks) || 0;
    const t = parseFloat(totalMarks) || 100;
    if (t <= 0) return 'E';
    const percentage = (m / t) * 100;

    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'E';
  };

  // Handle Marks/Total Marks change for a student
  const handleMarksChange = (studentId, field, value) => {
    setMarksState((prev) => {
      const studentMarks = { ...prev[studentId] };
      studentMarks[field] = value;
      
      // Calculate grade on the fly
      studentMarks.grade = calculateGrade(
        field === 'marks' ? value : studentMarks.marks,
        field === 'totalMarks' ? value : studentMarks.totalMarks
      );

      return {
        ...prev,
        [studentId]: studentMarks
      };
    });
  };

  // Submit test results
  const handleSubmitTestResults = async (e) => {
    e.preventDefault();
    
    // Compile results array
    const resultsList = Object.values(marksState).map((item) => ({
      studentId: item.studentId,
      studentName: item.studentName,
      marks: parseFloat(item.marks) || 0,
      totalMarks: parseFloat(item.totalMarks) || 50,
      grade: item.grade
    }));

    if (resultsList.length === 0) {
      showToast('Roster is empty. Load a class with registered students.', 'error');
      return;
    }

    // Basic validation
    const hasEmptyMarks = resultsList.some((item) => isNaN(item.marks) || item.marks === '');
    // Since parseFloat returns NaN for empty/invalid values, check if any value is negative or exceeds total
    const invalidMarks = resultsList.some((item) => item.marks < 0 || item.marks > item.totalMarks);
    if (invalidMarks) {
      showToast('Please ensure marks are positive and do not exceed the total marks.', 'error');
      return;
    }

    try {
      setSubmittingTest(true);
      await apiFetch('/api/results', {
        method: 'POST',
        body: JSON.stringify({
          class: selectedClass,
          subject,
          teacherId: profile.teacherId,
          testDate,
          results: resultsList
        })
      });

      showToast('Test results submitted to Administrator review', 'success');
      // Reset roster
      setStudents([]);
      setMarksState({});
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmittingTest(false);
    }
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
          <p className="text-slate-500 font-bold">Could not load teacher profile.</p>
          <button onClick={handleLogout} className="px-5 py-2 text-white bg-primary rounded-lg text-xs">
            Go to Website
          </button>
        </div>
      </div>
    );
  }

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
              Teacher Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <span className="text-xs text-slate-400 block font-medium">Faculty Member</span>
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

      {/* Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full p-6 md:p-8 space-y-8 text-slate-800 text-left">
        
        {/* Welcome */}
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-primary font-heading">Welcome, {profile.name}!</h2>
          <p className="text-xs text-slate-450">Review assigned classes and submit student marks for test reports.</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-premium space-y-5">
          <h3 className="text-sm font-extrabold text-primary font-heading relative pl-3">
            Faculty Information Profile
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3 bg-secondary rounded-full" />
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-2.5">
              <div className="bg-slate-50 p-2 rounded-lg text-primary"><User className="w-4 h-4" /></div>
              <div>
                <span className="text-[10px] text-slate-400 block">Teacher ID</span>
                <span className="text-slate-800 font-bold font-stats text-sm">{profile.teacherId}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="bg-slate-50 p-2 rounded-lg text-primary"><BookOpen className="w-4 h-4" /></div>
              <div>
                <span className="text-[10px] text-slate-400 block">Subject Specialty</span>
                <span className="text-slate-800 font-bold">{profile.subject}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="bg-slate-50 p-2 rounded-lg text-primary"><Phone className="w-4 h-4" /></div>
              <div>
                <span className="text-[10px] text-slate-400 block">Phone Contact</span>
                <span className="text-slate-800">{profile.phone}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="bg-slate-50 p-2 rounded-lg text-primary"><Mail className="w-4 h-4" /></div>
              <div>
                <span className="text-[10px] text-slate-400 block">Email Address</span>
                <span className="text-slate-800">{profile.email}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-50 pt-4 flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-2">Assigned Classes:</span>
            {profile.classesAssigned && profile.classesAssigned.map((c) => (
              <span key={c} className="bg-primary/5 text-primary px-3 py-1 rounded-full text-[10px] font-bold">
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* Test Result Submission Panel */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-premium space-y-6">
          <h3 className="text-sm font-extrabold text-primary font-heading relative pl-3">
            Submit Class Test Results
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3 bg-secondary rounded-full" />
          </h3>

          {/* Configuration Form Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <div className="space-y-1 text-xs">
              <label className="font-bold text-slate-500 uppercase tracking-wider block">Target Class *</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full py-2.5 px-3 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 outline-none"
              >
                {profile.classesAssigned && profile.classesAssigned.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-slate-500 uppercase tracking-wider block">Subject *</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none text-slate-700 font-semibold"
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-slate-500 uppercase tracking-wider block">Exam Date *</label>
              <input
                type="date"
                required
                value={testDate}
                onChange={(e) => setTestDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none text-slate-700 font-semibold"
              />
            </div>

            <div>
              <button
                type="button"
                onClick={loadClassRoster}
                disabled={loadingStudents}
                className="w-full py-2.5 text-xs font-bold text-white bg-primary hover:bg-primary-light rounded-lg shadow transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {loadingStudents ? <Loader2 className="w-4 h-4 animate-spin" /> : <Users className="w-4 h-4" />}
                Load Roster
              </button>
            </div>
          </div>

          {/* Roster list table */}
          {students.length > 0 && (
            <form onSubmit={handleSubmitTestResults} className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <th className="px-6 py-4">Student ID</th>
                        <th className="px-6 py-4">Student Name</th>
                        <th className="px-6 py-4">Marks Obtained *</th>
                        <th className="px-6 py-4">Total Marks *</th>
                        <th className="px-6 py-4 text-center">Grade (Calculated)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-600 font-medium">
                      {students.map((stu) => {
                        const marksObj = marksState[stu.studentId] || {};
                        return (
                          <tr key={stu._id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-bold text-primary font-stats">{stu.studentId}</td>
                            <td className="px-6 py-4 font-bold text-slate-800">{stu.name}</td>
                            <td className="px-6 py-4">
                              <input
                                type="number"
                                required
                                value={marksObj.marks}
                                onChange={(e) => handleMarksChange(stu.studentId, 'marks', e.target.value)}
                                placeholder="0"
                                className="w-24 px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-primary text-xs"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="number"
                                required
                                value={marksObj.totalMarks}
                                onChange={(e) => handleMarksChange(stu.studentId, 'totalMarks', e.target.value)}
                                placeholder="50"
                                className="w-24 px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-primary text-xs"
                              />
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="bg-primary/5 text-primary text-[10px] font-black px-3 py-1 rounded-full border border-primary/10">
                                Grade {marksObj.grade || 'A'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={submittingTest}
                  className="px-6 py-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-lg rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {submittingTest ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting Marks...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" /> Submit Exam Marks
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {students.length === 0 && (
            <div className="text-slate-400 py-16 text-center text-xs font-semibold flex flex-col items-center gap-2 border border-dashed border-slate-150 rounded-2xl bg-slate-50/50">
              <FileSpreadsheet className="w-10 h-10 text-slate-300" />
              <p>Roster not loaded. Select class and click "Load Roster" to input exam marks.</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default TeacherDashboard;
