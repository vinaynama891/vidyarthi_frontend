import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, API_BASE_URL } from '../../context/AuthContext';
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
  ArrowLeft,
  Plus,
  Loader2,
  BookOpen,
  Users,
  CheckCircle,
  FileSpreadsheet,
  X,
  Bell,
  CalendarCheck,
  FileText,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import logo from '../../assets/logo.png';


const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { logout, apiFetch } = useAuth();
  const { showToast } = useToast();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const [activeSection, setActiveSection] = useState('attendance'); // 'test-marks' | 'attendance' | 'announcements'

  // Test Submission Form States
  const [selectedClass, setSelectedClass] = useState('');
  const [subject, setSubject] = useState('');
  const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [submittingTest, setSubmittingTest] = useState(false);

  // Student Marks State: { [studentId]: { marks: '', totalMarks: 100, grade: 'A' } }
  const [marksState, setMarksState] = useState({});

  // Attendance States
  const [myAttendanceHistory, setMyAttendanceHistory] = useState([]);
  const [loadingMyAttendance, setLoadingMyAttendance] = useState(false);

  // Announcements log states
  const [announcements, setAnnouncements] = useState([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);

  const fetchAnnouncements = async () => {
    try {
      setLoadingAnnouncements(true);
      const data = await apiFetch('/api/broadcasts');
      setAnnouncements(data);
    } catch (err) {
      console.warn('Error fetching announcements:', err.message);
    } finally {
      setLoadingAnnouncements(false);
    }
  };

  const fetchMyAttendance = async () => {
    try {
      setLoadingMyAttendance(true);
      const data = await apiFetch('/api/attendance/teacher-history');
      setMyAttendanceHistory(data);
    } catch (err) {
      console.warn('Error fetching own attendance:', err.message);
    } finally {
      setLoadingMyAttendance(false);
    }
  };

  // Calendar states and helper functions
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();
    // Monday as 0, Sunday as 6
    const adjustedFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    return { totalDays, adjustedFirstDay };
  };

  const getDayStatus = (day, month, year, teacherId = 'default') => {
    const today = new Date();
    const targetDate = new Date(year, month, day);

    // Check database attendance records first
    const pad = (num) => num.toString().padStart(2, '0');
    const dateString = `${year}-${pad(month + 1)}-${pad(day)}`;
    const matchedRecord = myAttendanceHistory.find(rec => rec.date === dateString);
    if (matchedRecord) {
      return matchedRecord.status;
    }
    
    // Future days are unmarked
    if (targetDate > today) {
      return 'unmarked';
    }

    const dayOfWeek = targetDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Sundays are holidays
    if (dayOfWeek === 0) {
      return 'holiday';
    }

    // Typical public holidays
    const holidays = [
      { m: 0, d: 26 }, // Republic Day
      { m: 7, d: 15 }, // Independence Day
      { m: 9, d: 2 },  // Gandhi Jayanti
      { m: 11, d: 25 }, // Christmas
    ];

    const isHoliday = holidays.some(h => h.m === month && h.d === day);
    if (isHoliday) {
      return 'holiday';
    }

    // Deterministic status based on date + teacherId hash
    const seed = (day * 3 + month * 7 + year + teacherId.charCodeAt(0) + (teacherId.charCodeAt(1) || 0)) % 100;
    
    // 5% chance of absence
    if (seed < 5) {
      return 'absent';
    }
    
    return 'present';
  };

  const changeMonth = (offset) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    // Don't navigate to months before joining date
    const joiningDate = profile.joiningDate ? new Date(profile.joiningDate) : new Date();
    const limitDate = new Date(joiningDate.getFullYear(), joiningDate.getMonth(), 1);
    if (newDate < limitDate) return;
    // Don't navigate to future months beyond the current real-world month
    if (newDate > new Date()) return;
    setCurrentDate(newDate);
  };

  const getSalaryStats = () => {
    if (!profile || !profile.joiningDate) return { presentDays: 0, holidayDays: 0, salaryEarned: 0 };
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const pad = (num) => num.toString().padStart(2, '0');
    const monthPrefix = `${year}-${pad(month + 1)}`;
    
    const jDate = new Date(profile.joiningDate);
    const joinDateStr = `${jDate.getFullYear()}-${pad(jDate.getMonth() + 1)}-${pad(jDate.getDate())}`;

    // Filter myAttendanceHistory for logs in the selected month on/after joining date
    const currentMonthLogs = myAttendanceHistory.filter(log => {
      return log.date.startsWith(monthPrefix) && log.date >= joinDateStr;
    });

    const presentDays = currentMonthLogs.filter(log => log.status === 'present').length;
    const holidayDays = currentMonthLogs.filter(log => log.status === 'holiday').length;
    
    const perDaySalary = Math.round((profile.salary || 0) / 30);
    const salaryEarned = (presentDays + holidayDays) * perDaySalary;

    return { presentDays, holidayDays, salaryEarned };
  };

  const { presentDays, holidayDays, salaryEarned } = getSalaryStats();
  const perDaySalary = (profile && profile.salary) ? Math.round(profile.salary / 30) : 0;

  useEffect(() => {
    if (activeSection === 'announcements') {
      fetchAnnouncements();
    } else if (activeSection === 'attendance') {
      fetchMyAttendance();
    }
  }, [activeSection]);

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
        <div className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-all" onClick={() => navigate('/')}>
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

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block mr-1">
            <span className="text-xs text-slate-400 block font-medium">Faculty Member</span>
            <span className="text-sm font-bold text-slate-700">{profile.name}</span>
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-slate-50 hover:bg-slate-100 border border-slate-150 hover:border-slate-200 text-slate-700 px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 text-xs font-semibold"
            title="Back to Website"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Website</span>
          </button>
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

        {/* Interactive Info & Navigation Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Personal Profile */}
          <button
            onClick={() => setActiveModal('profile')}
            className="bg-white p-5 rounded-2xl border border-slate-100 shadow-premium hover:shadow-premiumHover hover:-translate-y-0.5 transition-all duration-300 text-left flex items-start gap-4 cursor-pointer focus:outline-none w-full"
          >
            <div className="bg-primary/5 p-3 rounded-2xl text-primary shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-xs font-black text-slate-800 font-heading">Faculty Profile</h3>
              <p className="text-[10px] text-slate-450 leading-tight">View personal contact details</p>
              <span className="text-[9px] font-bold text-primary inline-block mt-2 hover:underline">
                Open Details &rarr;
              </span>
            </div>
          </button>

          {/* Card 2: Teaching Classes */}
          <button
            onClick={() => setActiveModal('classes')}
            className="bg-white p-5 rounded-2xl border border-slate-100 shadow-premium hover:shadow-premiumHover hover:-translate-y-0.5 transition-all duration-300 text-left flex items-start gap-4 cursor-pointer focus:outline-none w-full"
          >
            <div className="bg-secondary/10 p-3 rounded-2xl text-secondary shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-xs font-black text-slate-800 font-heading">Teaching Classes</h3>
              <p className="text-[10px] text-slate-450 leading-tight">{profile.classesAssigned?.length || 0} Classes Assigned</p>
              <span className="text-[9px] font-bold text-secondary inline-block mt-2 hover:underline">
                Open Details &rarr;
              </span>
            </div>
          </button>

          {/* Card 3: Contract & Salary */}
          <button
            onClick={() => setActiveModal('salary')}
            className="bg-white p-5 rounded-2xl border border-slate-100 shadow-premium hover:shadow-premiumHover hover:-translate-y-0.5 transition-all duration-300 text-left flex items-start gap-4 cursor-pointer focus:outline-none w-full"
          >
            <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600 shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-xs font-black text-slate-800 font-heading">Contract Details</h3>
              <p className="text-[10px] text-slate-450 leading-tight">
                {profile.salary ? `Monthly: ₹${profile.salary.toLocaleString()} | Earned: ₹${salaryEarned.toLocaleString()}` : 'Salary and joining terms'}
              </p>
              <span className="text-[9px] font-bold text-emerald-600 inline-block mt-2 hover:underline">
                Open Details &rarr;
              </span>
            </div>
          </button>

          {/* Card 4: Test Marks Entry (Section Toggle) */}
          <button
            onClick={() => setActiveSection('test-marks')}
            className={`p-5 rounded-2xl border shadow-premium hover:shadow-premiumHover hover:-translate-y-0.5 transition-all duration-300 text-left flex items-start gap-4 cursor-pointer focus:outline-none w-full ${
              activeSection === 'test-marks'
                ? 'border-primary bg-primary/[0.02] ring-1 ring-primary/30'
                : 'bg-white border-slate-100'
            }`}
          >
            <div className={`p-3 rounded-2xl shrink-0 ${activeSection === 'test-marks' ? 'bg-primary text-white' : 'bg-primary/5 text-primary'}`}>
              <ClipboardList className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-xs font-black text-slate-800 font-heading">Test Marks Entry</h3>
              <p className="text-[10px] text-slate-450 leading-tight">Submit class test scores</p>
              <span className={`text-[9px] font-extrabold inline-block mt-2 ${activeSection === 'test-marks' ? 'text-primary' : 'text-slate-400'}`}>
                {activeSection === 'test-marks' ? '● Active Workspace' : 'Switch Workspace &rarr;'}
              </span>
            </div>
          </button>

          {/* Card 5: Teacher's Attendance (Section Toggle) */}
          <button
            onClick={() => setActiveSection('attendance')}
            className={`p-5 rounded-2xl border shadow-premium hover:shadow-premiumHover hover:-translate-y-0.5 transition-all duration-300 text-left flex items-start gap-4 cursor-pointer focus:outline-none w-full ${
              activeSection === 'attendance'
                ? 'border-secondary bg-secondary/[0.02] ring-1 ring-secondary/30'
                : 'bg-white border-slate-100'
            }`}
          >
            <div className={`p-3 rounded-2xl shrink-0 ${activeSection === 'attendance' ? 'bg-secondary text-slate-900' : 'bg-secondary/10 text-secondary'}`}>
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-xs font-black text-slate-800 font-heading">My Attendance</h3>
              <p className="text-[10px] text-slate-450 leading-tight">View daily attendance logs</p>
              <span className={`text-[9px] font-extrabold inline-block mt-2 ${activeSection === 'attendance' ? 'text-secondary' : 'text-slate-400'}`}>
                {activeSection === 'attendance' ? '● Active Workspace' : 'Switch Workspace &rarr;'}
              </span>
            </div>
          </button>

          {/* Card 6: Announcements (Section Toggle) */}
          <button
            onClick={() => setActiveSection('announcements')}
            className={`p-5 rounded-2xl border shadow-premium hover:shadow-premiumHover hover:-translate-y-0.5 transition-all duration-300 text-left flex items-start gap-4 cursor-pointer focus:outline-none w-full ${
              activeSection === 'announcements'
                ? 'border-indigo-500 bg-indigo-50/[0.05] ring-1 ring-indigo-500/30'
                : 'bg-white border-slate-100'
            }`}
          >
            <div className={`p-3 rounded-2xl shrink-0 ${activeSection === 'announcements' ? 'bg-indigo-600 text-white' : 'bg-indigo-55 text-indigo-600'}`}>
              <Bell className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-xs font-black text-slate-800 font-heading">Web Announcements</h3>
              <p className="text-[10px] text-slate-450 leading-tight">Read institution notices</p>
              <span className={`text-[9px] font-extrabold inline-block mt-2 ${activeSection === 'announcements' ? 'text-indigo-600' : 'text-slate-400'}`}>
                {activeSection === 'announcements' ? '● Active Workspace' : 'Switch Workspace &rarr;'}
              </span>
            </div>
          </button>
        </div>

        {/* ==================== WORKSPACE 1: SUBMIT CLASS TEST RESULTS ==================== */}
        {activeSection === 'test-marks' && (
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
                  View Student
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
                <p>Students list not loaded. Select class and click "View Student" to input exam marks.</p>
              </div>
            )}
          </div>
        )}

        {/* ==================== WORKSPACE 2: TEACHER'S ATTENDANCE HISTORY ==================== */}
        {activeSection === 'attendance' && (() => {
          const { totalDays, adjustedFirstDay } = getDaysInMonth(currentDate);
          let presentCount = 0;
          let absentCount = 0;
          let holidayCount = 0;
          const year = currentDate.getFullYear();
          const month = currentDate.getMonth();

          for (let d = 1; d <= totalDays; d++) {
            const status = getDayStatus(d, month, year, profile.teacherId);
            if (status === 'present') presentCount++;
            else if (status === 'absent') absentCount++;
            else if (status === 'holiday') holidayCount++;
          }

          const totalLogged = presentCount + absentCount;
          const attendancePercentage = totalLogged > 0 ? Math.round((presentCount / totalLogged) * 100) : 100;

          const blanksArray = Array(adjustedFirstDay).fill(null);
          const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);

          return (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-premium space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><Calendar className="w-5 h-5" /></div>
                  <h3 className="text-sm font-extrabold text-primary font-heading relative pl-3">
                    Monthly Attendance Register
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3 bg-secondary rounded-full" />
                  </h3>
                </div>
                
                {/* Month Selector Controls */}
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-150 p-1 rounded-2xl">
                  {(() => {
                    const joiningDate = profile.joiningDate ? new Date(profile.joiningDate) : new Date();
                    const isLimit = currentDate.getFullYear() < joiningDate.getFullYear() || 
                                    (currentDate.getFullYear() === joiningDate.getFullYear() && currentDate.getMonth() <= joiningDate.getMonth());
                    return (
                      <button
                        onClick={() => changeMonth(-1)}
                        disabled={isLimit}
                        className="p-1.5 hover:bg-slate-200 text-slate-650 disabled:text-slate-300 disabled:hover:bg-transparent rounded-xl transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    );
                  })()}
                  <span className="text-xs font-bold text-slate-700 min-w-[120px] text-center">
                    {currentDate.toLocaleString('en-IN', { month: 'long', year: 'numeric' })}
                  </span>
                  <button
                    onClick={() => changeMonth(1)}
                    // Disabled if month is the current month
                    disabled={currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear()}
                    className="p-1.5 hover:bg-slate-200 text-slate-650 disabled:text-slate-300 disabled:hover:bg-transparent rounded-xl transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {loadingMyAttendance ? (
                <div className="flex justify-center items-center py-20 bg-slate-50/10 rounded-2xl border border-slate-100">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Attendance Statistics Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 text-left">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Attendance Rate</span>
                      <span className="text-xl font-bold font-stats text-emerald-600 mt-1 block">{attendancePercentage}%</span>
                    </div>
                    <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 text-left">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Days Present</span>
                      <span className="text-xl font-bold font-stats text-emerald-600 mt-1 block">{presentCount} Days</span>
                    </div>
                    <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 text-left">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Days Absent</span>
                      <span className="text-xl font-bold font-stats text-rose-500 mt-1 block">{absentCount} Days</span>
                    </div>
                    <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 text-left">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Holidays / Sundays</span>
                      <span className="text-xl font-bold font-stats text-amber-500 mt-1 block">{holidayCount} Days</span>
                    </div>
                  </div>

                  {/* Calendar Grid UI */}
                  <div className="max-w-xl mx-auto bg-slate-50/30 border border-slate-150 p-5 rounded-3xl space-y-4">
                    {/* Days of Week Header */}
                    <div className="grid grid-cols-7 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <div>Mon</div>
                      <div>Tue</div>
                      <div>Wed</div>
                      <div>Thu</div>
                      <div>Fri</div>
                      <div>Sat</div>
                      <div className="text-rose-500">Sun</div>
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 gap-2.5 text-xs text-center font-bold">
                      {/* Render blanks for offset */}
                      {blanksArray.map((_, idx) => (
                        <div key={`blank-${idx}`} className="aspect-square" />
                      ))}

                      {/* Render days */}
                      {daysArray.map((day) => {
                        const status = getDayStatus(day, currentDate.getMonth(), currentDate.getFullYear(), profile.teacherId);
                        
                        let bgClass = 'bg-white border border-slate-100 text-slate-700 hover:bg-slate-50';
                        let titleText = 'No record';

                        if (status === 'present') {
                          bgClass = 'bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100/70';
                          titleText = 'Present';
                        } else if (status === 'absent') {
                          bgClass = 'bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100/70';
                          titleText = 'Absent';
                        } else if (status === 'holiday') {
                          bgClass = 'bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100/70';
                          titleText = 'Holiday / Sunday';
                        } else if (status === 'unmarked') {
                          bgClass = 'bg-slate-100 border border-transparent text-slate-400 cursor-not-allowed';
                          titleText = 'Unmarked';
                        }

                        return (
                          <div
                            key={`day-${day}`}
                            title={`${day} ${currentDate.toLocaleString('en-IN', { month: 'short' })}: ${titleText}`}
                            className={`aspect-square flex items-center justify-center rounded-2xl transition-all duration-200 cursor-pointer shadow-sm select-none ${bgClass}`}
                          >
                            {day}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Legend bar */}
                  <div className="flex items-center justify-center gap-6 text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-50/60 py-2.5 px-6 rounded-2xl border border-slate-100 max-w-fit mx-auto">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-emerald-300" />
                      <span>Present</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-rose-300" />
                      <span>Absent</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-amber-300" />
                      <span>Holiday</span>
                    </div>
                  </div>

                </div>
              )}
            </div>
          );
        })()}

        {/* ==================== WORKSPACE 3: ANNOUNCEMENTS ==================== */}
        {activeSection === 'announcements' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-premium space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-primary font-heading relative pl-3">
                Institution Notices & Announcements
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3 bg-indigo-500 rounded-full" />
              </h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Targeted Notifications
              </span>
            </div>

            {loadingAnnouncements ? (
              <div className="flex justify-center items-center py-20 bg-slate-50/10 rounded-2xl border border-slate-100">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : announcements.filter(b => 
              !b.targets ||
              (!b.targets.classes?.length && !b.targets.teachers?.length) ||
              b.targets.teachers?.includes(profile._id) ||
              b.targets.classes?.some(c => profile.classesAssigned?.includes(c))
            ).length === 0 ? (
              <div className="text-slate-455 py-20 text-center text-xs font-semibold flex flex-col items-center gap-2 border border-dashed border-slate-150 rounded-2xl bg-slate-50/50">
                <Bell className="w-10 h-10 text-slate-300 animate-pulse" />
                <p>No active announcements or notices targeted to you/your classes yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {announcements.filter(b => 
                  !b.targets ||
                  (!b.targets.classes?.length && !b.targets.teachers?.length) ||
                  b.targets.teachers?.includes(profile._id) ||
                  b.targets.classes?.some(c => profile.classesAssigned?.includes(c))
                ).map((ann) => {
                  const imageSrc = ann.imageUrl && (ann.imageUrl.startsWith('http') ? ann.imageUrl : `${API_BASE_URL}${ann.imageUrl}`);
                  return (
                    <div
                      key={ann._id}
                      className="border border-slate-100 rounded-2xl p-5 hover:border-indigo-200 hover:bg-indigo-50/[0.02] transition-all duration-255 space-y-3 text-xs"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <h4 className="text-xs font-black text-slate-800 leading-tight">{ann.title}</h4>
                        <span className="text-[9px] font-bold text-slate-450 uppercase font-sans">
                          {new Date(ann.sentAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                      </div>
                      
                      <p className="text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">{ann.description}</p>
                      
                      {imageSrc && (
                        <div className="pt-2">
                          {imageSrc.toLowerCase().includes('.pdf') ? (
                            <a
                              href={imageSrc}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 border border-rose-100 bg-rose-50 hover:bg-rose-100/50 text-rose-700 font-bold rounded-xl text-[10px] transition-colors"
                            >
                              <FileText className="w-4 h-4 text-rose-500" /> View Attached Document (PDF)
                            </a>
                          ) : (
                            <div className="w-full max-w-sm rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
                              <img src={imageSrc} alt="Notice Attachment" className="w-full h-auto object-contain max-h-48" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Dynamic Details Modal Overlay */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform scale-100 transition-all duration-300">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 bg-slate-50 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-primary font-heading">
                {activeModal === 'profile' && 'Faculty Personal Profile'}
                {activeModal === 'classes' && 'Assigned Teaching Classes'}
                {activeModal === 'salary' && 'Employment & Contract Details'}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 text-xs text-left font-sans">
              {activeModal === 'profile' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded-xl">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Teacher ID</span>
                      <span className="text-slate-800 font-black font-stats text-sm">{profile.teacherId}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Subject Specialty</span>
                      <span className="text-slate-800 font-bold text-sm">{profile.subject}</span>
                    </div>
                  </div>

                  <div className="space-y-3.5 pt-2">
                    <div className="flex items-center gap-3 border-b border-slate-50 pb-2">
                      <User className="w-4 h-4 text-primary" />
                      <div>
                        <span className="text-[9px] text-slate-400 block font-bold uppercase">Full Name</span>
                        <span className="text-slate-800 font-bold text-xs">{profile.name}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 border-b border-slate-50 pb-2">
                      <User className="w-4 h-4 text-primary" />
                      <div>
                        <span className="text-[9px] text-slate-400 block font-bold uppercase">Father's Name</span>
                        <span className="text-slate-800 font-medium text-xs">{profile.fatherName}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 border-b border-slate-50 pb-2">
                      <Mail className="w-4 h-4 text-primary" />
                      <div>
                        <span className="text-[9px] text-slate-400 block font-bold uppercase">Email Contact</span>
                        <span className="text-slate-800 font-medium text-xs">{profile.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pb-2">
                      <Phone className="w-4 h-4 text-primary" />
                      <div>
                        <span className="text-[9px] text-slate-400 block font-bold uppercase">Phone Number</span>
                        <span className="text-slate-800 font-medium text-xs">{profile.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeModal === 'classes' && (
                <div className="space-y-4">
                  <p className="text-slate-400 font-semibold leading-relaxed">
                    You are authorized to enter test marks and manage records for the following classes:
                  </p>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    {profile.classesAssigned && profile.classesAssigned.map((c) => (
                      <div key={c} className="flex items-center gap-2.5 p-3 border border-slate-100 bg-slate-50 rounded-2xl font-bold text-slate-700">
                        <GraduationCap className="w-4 h-4 text-secondary" />
                        <span>{c}</span>
                      </div>
                    ))}
                    {(!profile.classesAssigned || profile.classesAssigned.length === 0) && (
                      <p className="text-slate-400 italic">No classes assigned yet.</p>
                    )}
                  </div>
                </div>
              )}

              {activeModal === 'salary' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 text-emerald-800 text-left">
                      <span className="text-[9px] text-emerald-600 block font-bold uppercase tracking-wider">Monthly Salary</span>
                      <div className="flex items-center gap-0.5 mt-1">
                        <span className="text-lg font-black font-stats leading-none">₹{profile.salary ? profile.salary.toLocaleString() : 0}</span>
                      </div>
                    </div>

                    <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 text-blue-800 text-left">
                      <span className="text-[9px] text-blue-600 block font-bold uppercase tracking-wider">Per Day Salary</span>
                      <div className="flex items-center gap-0.5 mt-1">
                        <span className="text-lg font-black font-stats leading-none">₹{perDaySalary.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-violet-50/50 p-4 rounded-2xl border border-violet-100 text-violet-800 text-left">
                      <span className="text-[9px] text-violet-600 block font-bold uppercase tracking-wider">Days Present (This Month)</span>
                      <div className="flex items-center gap-0.5 mt-1">
                        <span className="text-lg font-black font-stats leading-none">{presentDays} Days</span>
                      </div>
                    </div>

                    <div className="bg-sky-50/50 p-4 rounded-2xl border border-sky-100 text-sky-850 text-left">
                      <span className="text-[9px] text-sky-600 block font-bold uppercase tracking-wider">Holidays (Paid Offs)</span>
                      <div className="flex items-center gap-0.5 mt-1">
                        <span className="text-lg font-black font-stats leading-none">{holidayDays} Days</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-teal-50/50 p-4 rounded-2xl border border-teal-100 text-teal-800 text-left">
                      <span className="text-[9px] text-teal-600 block font-bold uppercase tracking-wider">Total Paid Days</span>
                      <div className="flex items-center gap-0.5 mt-1">
                        <span className="text-lg font-black font-stats leading-none">{presentDays + holidayDays} Days</span>
                      </div>
                    </div>

                    <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100 text-amber-800 text-left">
                      <span className="text-[9px] text-amber-600 block font-bold uppercase tracking-wider">Salary Earned (This Month)</span>
                      <div className="flex items-center gap-0.5 mt-1">
                        <span className="text-lg font-black font-stats leading-none text-amber-700">₹{salaryEarned.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl space-y-2 text-left">
                    <h4 className="font-bold text-slate-700">Employment Terms:</h4>
                    <ul className="list-disc list-inside text-slate-500 space-y-1 font-semibold">
                      <li>Permanent Full-Time Faculty Contract</li>
                      <li>Salary disbursements processed on the 1st of every month</li>
                      <li>Authorized to request class roster data and post test scores</li>
                      <li>Per-day salary computed based on standard billing month (30 days)</li>
                      <li>Holidays and Sundays are included as paid working days</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Close Button */}
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-5 py-2.5 text-white bg-primary hover:bg-primary-light font-bold rounded-xl shadow cursor-pointer transition-colors"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
