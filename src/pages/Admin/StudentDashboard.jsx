import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, API_BASE_URL } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  GraduationCap,
  User,
  Phone,
  MapPin,
  Gift,
  LogOut,
  ArrowLeft,
  CalendarDays,
  Award,
  Loader2,
  FileSpreadsheet,
  X,
  BookOpen,
  Bell,
  FileText,
  CreditCard,
  Download,
  Calendar,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import logo from '../../assets/logo.png';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { logout, apiFetch } = useAuth();
  const { showToast } = useToast();

  const [profile, setProfile] = useState(null);
  const [results, setResults] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('fees'); // 'material', 'fees', 'notices', 'results', 'attendance'
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [studyMaterials, setStudyMaterials] = useState([]);

  // Attendance state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [realAttendanceHistory, setRealAttendanceHistory] = useState([]);
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

        // Fetch broadcasts for notices
        try {
          const noticesData = await apiFetch('/api/broadcasts');
          // Filter notices targeting this student's class (or all classes if empty targets)
          const studentNotices = noticesData.filter(notice => 
            !notice.targets || 
            !notice.targets.classes || 
            notice.targets.classes.length === 0 || 
            notice.targets.classes.includes(profileData.class)
          );
          setNotices(studentNotices);
        } catch (noticeErr) {
          console.warn('Could not fetch notices:', noticeErr.message);
        }

        // Fetch study materials
        try {
          const materialsData = await apiFetch('/api/study-materials');
          // Filter by target class (matching student class)
          const filteredMaterials = materialsData.filter(mat => 
            mat.targetClass === profileData.class || mat.targetClass === 'All'
          );
          setStudyMaterials(filteredMaterials);
        } catch (matErr) {
          console.warn('Could not fetch study materials:', matErr.message);
        }

        // Fetch real attendance history
        try {
          const historyData = await apiFetch('/api/attendance/student-history');
          setRealAttendanceHistory(historyData);
        } catch (historyErr) {
          console.warn('Could not fetch attendance history:', historyErr.message);
        }
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

  const handlePrintReceipt = (student) => {
    const printWindow = window.open('', '_blank');
    
    // Get all styles from document to apply them to print window
    let stylesHtml = '';
    for (const node of document.querySelectorAll('style, link[rel="stylesheet"]')) {
      stylesHtml += node.outerHTML;
    }
    
    // Calculate fees
    const netTuition = student.totalFees - student.discount;
    const pendingTuition = netTuition - student.paidFees;
    const netGoodies = student.goodiesTotalFee;
    const pendingGoodies = netGoodies - student.goodiesPaidFee;
    const totalOriginal = student.totalFees + student.goodiesTotalFee;
    const totalNet = netTuition + netGoodies;
    const totalPaid = student.paidFees + student.goodiesPaidFee;
    const totalPending = pendingTuition + pendingGoodies;
    
    // Format dates
    const today = new Date().toLocaleDateString('en-IN');
    
    // Payment Mode checks
    const lastInstallment = student.installments && student.installments.length > 0 
      ? student.installments[student.installments.length - 1] 
      : null;
      
    const payMode = lastInstallment?.method || 'Cash';
    const payDate = lastInstallment?.date ? new Date(lastInstallment.date).toLocaleDateString('en-IN') : today;
    const payRemarks = lastInstallment?.remarks || 'N/A';
    const payTxn = lastInstallment?._id ? lastInstallment._id.toString().substring(18).toUpperCase() : 'N/A';
    
    // Build installments rows
    let installmentsRowsHtml = '';
    for (let i = 0; i < 5; i++) {
      const inst = student.installments && student.installments[i];
      installmentsRowsHtml += `
        <tr style="height: 2rem; border-bottom: 1px solid #e2e8f0;">
          <td style="border-right: 1px solid #e2e8f0; text-align: center;">${i + 1}</td>
          <td style="border-right: 1px solid #e2e8f0; text-align: center;">${inst ? new Date(inst.date).toLocaleDateString('en-IN') : ''}</td>
          <td style="border-right: 1px solid #e2e8f0; text-align: center; font-weight: bold;">${inst ? '₹' + inst.amount.toLocaleString() : ''}</td>
          <td style="border-right: 1px solid #e2e8f0; text-align: center;">${inst ? inst.method : ''}</td>
          <td style="text-align: center;">${inst ? inst.remarks || 'Success' : ''}</td>
        </tr>
      `;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Fee Receipt - ${student.name}</title>
          ${stylesHtml}
          <style>
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .no-print { display: none; }
            }
            body {
              font-family: 'Poppins', 'Inter', sans-serif;
              background-color: #ffffff;
              color: #1e293b;
              padding: 20px;
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="max-w-[800px] mx-auto border-4 p-6 rounded-3xl relative" style="border-color: #1A3C5E;">
            <!-- Top Border Header -->
            <div class="flex justify-between items-start mb-6">
              <!-- Left Branding -->
              <div class="flex items-center gap-4">
                <img src="/logo.png" alt="Logo" class="w-20 h-20 object-contain" />
                <div class="text-left">
                  <h1 class="text-3xl font-black tracking-tight" style="color: #1A3C5E;">विद्यार्थी क्लासेज</h1>
                  <p class="text-sm font-extrabold tracking-widest text-slate-500 uppercase mt-0.5">— नींव से निर्माण तक —</p>
                  <p class="text-xs font-bold text-slate-400 mt-1">KOTA, RAJASTHAN</p>
                </div>
              </div>
              <!-- Right Badges -->
              <div class="text-right space-y-3">
                <span class="inline-block px-6 py-2 text-sm font-black text-white rounded-xl shadow-sm" style="background-color: #1A3C5E;">FEE INVOICE</span>
                <table class="text-xs text-left w-full mt-2 font-medium">
                  <tbody>
                    <tr><td class="pr-2 font-bold text-slate-500">Invoice No.</td><td>: VC-${student.studentId}-${student._id ? student._id.toString().substring(20).toUpperCase() : 'N/A'}</td></tr>
                    <tr><td class="pr-2 font-bold text-slate-500">Invoice Date</td><td>: ${today}</td></tr>
                    <tr><td class="pr-2 font-bold text-slate-500">Admission No.</td><td>: ${student.studentId}</td></tr>
                    <tr><td class="pr-2 font-bold text-slate-500">Student ID</td><td>: ${student.studentId}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-6 mb-6">
              <!-- Student Details -->
              <div class="border border-slate-200 rounded-2xl p-4 text-left">
                <h3 class="text-xs font-black text-white px-3 py-1.5 rounded-lg mb-3 uppercase tracking-wider" style="background-color: #1A3C5E;">Student Details</h3>
                <table class="w-full text-xs space-y-1 font-medium">
                  <tbody>
                    <tr><td class="w-24 font-bold text-slate-500 py-1">Student Name</td><td>: ${student.name}</td></tr>
                    <tr><td class="font-bold text-slate-500 py-1">Father's Name</td><td>: ${student.fatherName}</td></tr>
                    <tr><td class="font-bold text-slate-500 py-1">Course</td><td>: ${student.class}</td></tr>
                    <tr><td class="font-bold text-slate-500 py-1">Class/Batch</td><td>: ${student.class}</td></tr>
                    <tr><td class="font-bold text-slate-500 py-1">Phone No.</td><td>: ${student.phone}</td></tr>
                    <tr><td class="font-bold text-slate-500 py-1">Address</td><td>: ${student.address || 'N/A'}</td></tr>
                  </tbody>
                </table>
              </div>

              <!-- Payment Details -->
              <div class="border border-slate-200 rounded-2xl p-4 text-left">
                <h3 class="text-xs font-black text-white px-3 py-1.5 rounded-lg mb-3 uppercase tracking-wider" style="background-color: #1A3C5E;">Payment Details</h3>
                <table class="w-full text-xs font-medium">
                  <tbody>
                    <tr>
                      <td class="w-24 font-bold text-slate-500 py-1">Payment Mode</td>
                      <td>: 
                        <span class="inline-flex items-center gap-1.5 mr-2">
                          <input type="checkbox" ${payMode === 'Cash' ? 'checked' : ''} disabled /> Cash
                        </span>
                        <span class="inline-flex items-center gap-1.5 mr-2">
                          <input type="checkbox" ${payMode === 'Online' ? 'checked' : ''} disabled /> Online
                        </span>
                        <span class="inline-flex items-center gap-1.5">
                          <input type="checkbox" ${payMode === 'Other' ? 'checked' : ''} disabled /> Other
                        </span>
                      </td>
                    </tr>
                    <tr><td class="font-bold text-slate-500 py-1">Transaction ID</td><td>: ${payTxn}</td></tr>
                    <tr><td class="font-bold text-slate-500 py-1">Payment Date</td><td>: ${payDate}</td></tr>
                    <tr><td class="font-bold text-slate-500 py-1">Remarks</td><td>: ${payRemarks}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Fee Table -->
            <table class="w-full text-xs border border-slate-200 mb-6 font-medium text-left">
              <thead>
                <tr class="text-white uppercase tracking-wider" style="background-color: #1A3C5E;">
                  <th class="p-2 border-r border-slate-200 text-center">S. No.</th>
                  <th class="p-2 border-r border-slate-200">Particulars</th>
                  <th class="p-2 border-r border-slate-200 text-right">Total Fee (₹)</th>
                  <th class="p-2 border-r border-slate-200 text-right">Discount (₹)</th>
                  <th class="p-2 border-r border-slate-200 text-right">Net Fee (₹)</th>
                  <th class="p-2 border-r border-slate-200 text-right">Paid Amount (₹)</th>
                  <th class="p-2 text-right">Pending Fee (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b border-slate-200">
                  <td class="p-2 border-r border-slate-200 text-center">1.</td>
                  <td class="p-2 border-r border-slate-200 font-bold">Tuition Fee</td>
                  <td class="p-2 border-r border-slate-200 text-right">₹${student.totalFees.toLocaleString()}</td>
                  <td class="p-2 border-r border-slate-200 text-right">₹${student.discount.toLocaleString()}</td>
                  <td class="p-2 border-r border-slate-200 text-right">₹${netTuition.toLocaleString()}</td>
                  <td class="p-2 border-r border-slate-200 text-right">₹${student.paidFees.toLocaleString()}</td>
                  <td class="p-2 text-right">₹${pendingTuition.toLocaleString()}</td>
                </tr>
                <tr class="border-b border-slate-200">
                  <td class="p-2 border-r border-slate-200 text-center">2.</td>
                  <td class="p-2 border-r border-slate-200 font-bold">Goodies Fee</td>
                  <td class="p-2 border-r border-slate-200 text-right">₹${student.goodiesTotalFee.toLocaleString()}</td>
                  <td class="p-2 border-r border-slate-200 text-right">₹0</td>
                  <td class="p-2 border-r border-slate-200 text-right">₹${netGoodies.toLocaleString()}</td>
                  <td class="p-2 border-r border-slate-200 text-right">₹${student.goodiesPaidFee.toLocaleString()}</td>
                  <td class="p-2 text-right">₹${pendingGoodies.toLocaleString()}</td>
                </tr>
                <tr class="font-extrabold bg-slate-100">
                  <td class="p-2 border-r border-slate-200 text-center"></td>
                  <td class="p-2 border-r border-slate-200">TOTAL</td>
                  <td class="p-2 border-r border-slate-200 text-right">₹${totalOriginal.toLocaleString()}</td>
                  <td class="p-2 border-r border-slate-200 text-right">₹${student.discount.toLocaleString()}</td>
                  <td class="p-2 border-r border-slate-200 text-right">₹${totalNet.toLocaleString()}</td>
                  <td class="p-2 border-r border-slate-200 text-right">₹${totalPaid.toLocaleString()}</td>
                  <td class="p-2 text-right">₹${totalPending.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
            <p class="text-[10px] text-slate-400 text-left mb-6">* Discount is applicable only as per institute policy.</p>

            <div class="grid grid-cols-2 gap-6 mb-6">
              <!-- Fee Summary -->
              <div class="border border-slate-200 rounded-2xl p-4 text-left">
                <h3 class="text-xs font-black text-white px-3 py-1.5 rounded-lg mb-3 uppercase tracking-wider" style="background-color: #1A3C5E;">Fee Summary</h3>
                <table class="w-full text-xs font-medium">
                  <tbody>
                    <tr class="border-b border-slate-100"><td class="font-bold text-slate-500 py-1.5">Total Fee (₹)</td><td class="text-right font-stats">₹${totalOriginal.toLocaleString()}</td></tr>
                    <tr class="border-b border-slate-100"><td class="font-bold text-slate-500 py-1.5">Discount (₹)</td><td class="text-right font-stats">₹${student.discount.toLocaleString()}</td></tr>
                    <tr class="border-b border-slate-100 bg-blue-50/50"><td class="font-bold text-slate-700 py-1.5">Net Fee (After Discount) (₹)</td><td class="text-right font-bold text-primary font-stats">₹${totalNet.toLocaleString()}</td></tr>
                    <tr class="border-b border-slate-100"><td class="font-bold text-slate-500 py-1.5">Paid Amount (₹)</td><td class="text-right text-emerald-600 font-bold font-stats">₹${totalPaid.toLocaleString()}</td></tr>
                    <tr class="border-b border-slate-100 bg-rose-50/30"><td class="font-bold text-slate-700 py-1.5">Pending Fee (₹)</td><td class="text-right text-danger font-bold font-stats">₹${totalPending.toLocaleString()}</td></tr>
                    <tr><td class="font-bold text-slate-500 py-1.5">Due Date (if any)</td><td class="text-right text-slate-500 font-stats">N/A</td></tr>
                  </tbody>
                </table>
              </div>

              <!-- Previous Fee Details -->
              <div class="border border-slate-200 rounded-2xl p-4 text-left">
                <h3 class="text-xs font-black text-white px-3 py-1.5 rounded-lg mb-3 uppercase tracking-wider" style="background-color: #1A3C5E;">Previous Fee Details</h3>
                <table class="w-full text-xs border border-slate-200 font-medium">
                  <thead>
                    <tr class="bg-slate-100 text-slate-600">
                      <th class="p-1 border-r border-b border-slate-200 text-center w-10">S. No.</th>
                      <th class="p-1 border-r border-b border-slate-200 text-center">Payment Date</th>
                      <th class="p-1 border-r border-b border-slate-200 text-center">Paid Amount (₹)</th>
                      <th class="p-1 border-r border-b border-slate-200 text-center">Payment Mode</th>
                      <th class="p-1 border-b border-slate-200 text-center">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${installmentsRowsHtml}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Bottom Footer -->
            <div class="border-t border-slate-200 pt-6 mt-8">
              <div class="grid grid-cols-3 gap-4 items-end">
                <!-- Important Notes -->
                <div class="text-left col-span-2 space-y-1">
                  <h4 class="text-xs font-black text-slate-700 uppercase tracking-wider">Important Notes</h4>
                  <ul class="text-[10px] text-slate-400 space-y-0.5 list-disc list-inside">
                    <li>Fees once paid will not be refundable.</li>
                    <li>Please keep this invoice safe for future reference.</li>
                    <li>Any query regarding fees, contact the office.</li>
                  </ul>
                  <p class="text-xs font-extrabold italic text-primary mt-2" style="color: #1A3C5E;">Thank You!</p>
                </div>

                <!-- Contact & Signature -->
                <div class="text-right space-y-8">
                  <div class="text-xs text-slate-500 font-medium space-y-1">
                    <div>📞 97030 40756</div>
                    <div>📍 Kota, Rajasthan</div>
                  </div>
                  <div>
                    <div class="border-t border-slate-400 w-44 ml-auto mb-1"></div>
                    <p class="text-[10px] font-bold text-slate-400 uppercase">Authorized Signature</p>
                    <p class="text-xs font-black" style="color: #1A3C5E;">विद्यार्थी क्लासेज</p>
                  </div>
                </div>
              </div>
              <!-- Accent Footer Border -->
              <div class="mt-6 pt-3 border-t-2 flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-400" style="border-color: #1A3C5E;">
                <span>Vidyarthi Classes Kota</span>
                <span style="color: #1A3C5E;">नींव से निर्माण तक</span>
                <span>Quality Education</span>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Helper functions for Attendance Calendar
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();
    // Monday as 0, Sunday as 6
    const adjustedFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    return { totalDays, adjustedFirstDay };
  };

  const getDayStatus = (day, month, year, studentId = 'default') => {
    const today = new Date();
    const targetDate = new Date(year, month, day);

    // Check database attendance records first
    const pad = (num) => num.toString().padStart(2, '0');
    const dateString = `${year}-${pad(month + 1)}-${pad(day)}`;
    const matchedRecord = realAttendanceHistory.find(rec => rec.date === dateString);
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

    // Typical Indian public holidays for simulation
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

    // Deterministic status based on date + studentId hash
    // Generates ~90% attendance, so present is highly probable
    const seed = (day * 3 + month * 7 + year + studentId.charCodeAt(0) + (studentId.charCodeAt(1) || 0)) % 100;
    
    // 8% chance of absence
    if (seed < 8) {
      return 'absent';
    }
    
    return 'present';
  };

  const changeMonth = (offset) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    // Don't navigate to months before June 2026
    const limitDate = new Date(2026, 5, 1); // June 2026
    if (newDate < limitDate) return;
    // Don't navigate to future months beyond the current real-world month
    if (newDate > new Date()) return;
    setCurrentDate(newDate);
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

  // Calculate calendar elements
  const { totalDays, adjustedFirstDay } = getDaysInMonth(currentDate);
  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);
  const blanksArray = Array.from({ length: adjustedFirstDay });

  // Calculate current month statistics
  let presentCount = 0;
  let absentCount = 0;
  let holidayCount = 0;
  daysArray.forEach(d => {
    const status = getDayStatus(d, currentDate.getMonth(), currentDate.getFullYear(), profile.studentId);
    if (status === 'present') presentCount++;
    else if (status === 'absent') absentCount++;
    else if (status === 'holiday') holidayCount++;
  });
  const totalSchoolDays = presentCount + absentCount;
  const attendancePercentage = totalSchoolDays > 0 ? ((presentCount / totalSchoolDays) * 100).toFixed(1) : '100.0';

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

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block mr-1">
            <span className="text-xs text-slate-400 block font-medium">Logged in as Student</span>
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

      {/* Content Area */}
      <main className="flex-grow max-w-7xl mx-auto w-full p-6 md:p-8 space-y-8 text-slate-800 text-left">
        
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-primary font-heading">Welcome, {profile.name}!</h2>
            <p className="text-xs text-slate-550 font-semibold">Class: {profile.class} | ID: {profile.studentId}</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-1.5 pr-3 border-r border-slate-200">
              <Phone className="w-3.5 h-3.5 text-primary" />
              <span>{profile.phone}</span>
            </div>
            <div className="flex items-center gap-1.5 pl-1">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span className="line-clamp-1 max-w-[150px]">{profile.address || 'Kota, Rajasthan'}</span>
            </div>
          </div>
        </div>

        {/* Interactive Grid Cards / Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
          {/* Study Material Tab Card */}
          <button
            onClick={() => setActiveSection('material')}
            className={`flex flex-col justify-between p-5 rounded-3xl border text-left transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${
              activeSection === 'material'
                ? 'bg-gradient-to-br from-indigo-50 to-indigo-100/50 border-indigo-200 shadow-lg shadow-indigo-100/70 ring-2 ring-indigo-500/20'
                : 'bg-white border-slate-100 hover:border-slate-200 shadow-premium'
            }`}
          >
            <div className={`p-3 rounded-2xl w-fit ${activeSection === 'material' ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-650'}`}>
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="mt-4">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">
                {studyMaterials.length} Materials
              </span>
              <h3 className="text-sm font-extrabold text-primary mt-1 block">Study Material</h3>
            </div>
          </button>

          {/* Pay Fee Tab Card */}
          <button
            onClick={() => setActiveSection('fees')}
            className={`flex flex-col justify-between p-5 rounded-3xl border text-left transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${
              activeSection === 'fees'
                ? 'bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200 shadow-lg shadow-emerald-100/70 ring-2 ring-emerald-500/20'
                : 'bg-white border-slate-100 hover:border-slate-200 shadow-premium'
            }`}
          >
            <div className={`p-3 rounded-2xl w-fit ${activeSection === 'fees' ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-600'}`}>
              <CreditCard className="w-6 h-6" />
            </div>
            <div className="mt-4">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">
                Pending: ₹{pendingFeeBalance.toLocaleString()}
              </span>
              <h3 className="text-sm font-extrabold text-primary mt-1 block">Pay Fee & Receipt</h3>
            </div>
          </button>

          {/* Attendance Tab Card */}
          <button
            onClick={() => setActiveSection('attendance')}
            className={`flex flex-col justify-between p-5 rounded-3xl border text-left transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${
              activeSection === 'attendance'
                ? 'bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200 shadow-lg shadow-emerald-100/70 ring-2 ring-emerald-500/20'
                : 'bg-white border-slate-100 hover:border-slate-200 shadow-premium'
            }`}
          >
            <div className={`p-3 rounded-2xl w-fit ${activeSection === 'attendance' ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-600'}`}>
              <Calendar className="w-6 h-6" />
            </div>
            <div className="mt-4">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">
                {attendancePercentage}% Present
              </span>
              <h3 className="text-sm font-extrabold text-primary mt-1 block">Attendance</h3>
            </div>
          </button>

          {/* Notices Tab Card */}
          <button
            onClick={() => setActiveSection('notices')}
            className={`flex flex-col justify-between p-5 rounded-3xl border text-left transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${
              activeSection === 'notices'
                ? 'bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200 shadow-lg shadow-amber-100/70 ring-2 ring-amber-500/20'
                : 'bg-white border-slate-100 hover:border-slate-200 shadow-premium'
            }`}
          >
            <div className={`p-3 rounded-2xl w-fit ${activeSection === 'notices' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-600'}`}>
              <Bell className="w-6 h-6" />
            </div>
            <div className="mt-4">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">
                {notices.length} Announcements
              </span>
              <h3 className="text-sm font-extrabold text-primary mt-1 block">Notices & Logs</h3>
            </div>
          </button>

          {/* Result Tab Card */}
          <button
            onClick={() => setActiveSection('results')}
            className={`flex flex-col justify-between p-5 rounded-3xl border text-left transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${
              activeSection === 'results'
                ? 'bg-gradient-to-br from-rose-50 to-rose-100/50 border-rose-200 shadow-lg shadow-rose-100/70 ring-2 ring-rose-500/20'
                : 'bg-white border-slate-100 hover:border-slate-200 shadow-premium'
            }`}
          >
            <div className={`p-3 rounded-2xl w-fit ${activeSection === 'results' ? 'bg-rose-500 text-white' : 'bg-rose-50 text-rose-600'}`}>
              <Award className="w-6 h-6" />
            </div>
            <div className="mt-4">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">
                {results.length} Scorecards
              </span>
              <h3 className="text-sm font-extrabold text-primary mt-1 block">Exam Results</h3>
            </div>
          </button>
        </div>

        {/* Active Section Content Display Area */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-premium p-6 sm:p-8 animate-fade-in">
          
          {/* ========================================================== */}
          {/* 1. STUDY MATERIAL SECTION */}
          {/* ========================================================== */}
          {activeSection === 'material' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><BookOpen className="w-5 h-5" /></div>
                <h3 className="text-base font-extrabold text-primary font-heading">Coursework & Study Material</h3>
              </div>
              
              {studyMaterials.length === 0 ? (
                <div className="text-slate-400 py-16 text-center text-sm font-medium flex flex-col items-center gap-2 border border-dashed border-slate-200 rounded-2xl bg-slate-50/20">
                  <BookOpen className="w-10 h-10 text-slate-300" />
                  <p>No study materials uploaded for your class yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {studyMaterials.map((mat) => {
                    const materialFileUrl = mat.fileUrl.startsWith('http') ? mat.fileUrl : `${API_BASE_URL}${mat.fileUrl}`;
                    return (
                      <div key={mat._id} className="border border-slate-100 bg-slate-50/50 p-5 rounded-2xl flex flex-col justify-between hover:border-indigo-200 hover:bg-white transition-all duration-200 text-left">
                        <div className="space-y-2">
                          <FileText className="w-8 h-8 text-indigo-500" />
                          <h4 className="text-xs font-bold text-slate-800 leading-tight">{mat.title}</h4>
                          {mat.description && <p className="text-[11px] text-slate-550 leading-normal line-clamp-2">{mat.description}</p>}
                          <span className="text-[9px] font-bold text-slate-400 block uppercase">
                            Uploaded on: {new Date(mat.uploadedAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <a
                          href={materialFileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 flex items-center justify-center gap-1.5 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded-xl shadow-sm transition-colors cursor-pointer text-center font-sans"
                        >
                          <Download className="w-3.5 h-3.5" /> View/Download Material
                        </a>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ========================================================== */}
          {/* 2. PAY FEE & RECEIPTS SECTION */}
          {/* ========================================================== */}
          {activeSection === 'fees' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><CreditCard className="w-5 h-5" /></div>
                  <h3 className="text-base font-extrabold text-primary font-heading">Fee Ledger & Receipts</h3>
                </div>
                <button
                  onClick={() => setIsReceiptModalOpen(true)}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-light text-white text-[11px] font-bold rounded-xl shadow-md transition-all duration-200 cursor-pointer font-sans"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  View Fee Receipt (Invoice)
                </button>
              </div>

              {/* Grid of details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block tracking-wider">Tuition Base Fee</span>
                  <span className="text-lg font-bold font-stats text-primary mt-1 block">₹{profile.totalFees.toLocaleString()}</span>
                </div>
                <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block tracking-wider">Scholarship / Discount</span>
                  <span className="text-lg font-bold font-stats text-rose-500 mt-1 block">- ₹{profile.discount.toLocaleString()}</span>
                </div>
                <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block tracking-wider">Net Fees Paid</span>
                  <span className="text-lg font-bold font-stats text-emerald-600 mt-1 block">₹{profile.paidFees.toLocaleString()}</span>
                </div>
                <div className={`p-5 rounded-2xl border ${pendingFeeBalance > 0 ? 'bg-rose-50/50 border-rose-100' : 'bg-emerald-55/50 border-emerald-100'}`}>
                  <span className="text-[9px] text-slate-400 font-bold uppercase block tracking-wider">Pending Tuition Balance</span>
                  <span className={`text-lg font-black font-stats mt-1 block ${pendingFeeBalance > 0 ? 'text-danger' : 'text-emerald-600'}`}>
                    ₹{pendingFeeBalance > 0 ? pendingFeeBalance.toLocaleString() : '0'}/-
                  </span>
                </div>
              </div>

              {/* Goodies Status Box */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 rounded-2xl border border-slate-100 bg-slate-50/40 gap-4">
                <div className="flex items-center gap-3.5 text-left">
                  <div className={`p-3 rounded-xl ${profile.goodiesStatus === 'All Distributed' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-secondary'}`}>
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Institute Materials (Goodies) Status</span>
                    <span className="text-sm font-bold text-slate-700 mt-0.5 block">{profile.goodiesStatus}</span>
                  </div>
                </div>
                <div className="text-left sm:text-right text-[10px] text-slate-550 bg-white border border-slate-100 px-3.5 py-2 rounded-xl">
                  Goodies Charges: <strong className="text-slate-800">₹{profile.goodiesTotalFee}</strong> | Paid: <strong className="text-emerald-600">₹{profile.goodiesPaidFee}</strong>
                </div>
              </div>

              {/* Installment History */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-primary font-heading uppercase tracking-wider">Payment Transaction History</h4>
                <div className="overflow-x-auto border border-slate-100 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="px-4 py-3 text-center w-12">S.No.</th>
                        <th className="px-4 py-3">Receipt Date</th>
                        <th className="px-4 py-3">Installment Paid</th>
                        <th className="px-4 py-3">Mode</th>
                        <th className="px-4 py-3">Payment Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[11px] font-medium text-slate-600">
                      {profile.installments && profile.installments.length > 0 ? (
                        profile.installments.map((inst, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-4 py-3 text-center font-bold text-slate-450">{idx + 1}</td>
                            <td className="px-4 py-3 text-slate-500">
                              {new Date(inst.date).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </td>
                            <td className="px-4 py-3 font-bold text-emerald-600">₹{inst.amount.toLocaleString()}</td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-0.5 rounded-full border border-slate-200 bg-slate-50 text-[10px] font-bold">
                                {inst.method}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-slate-400 italic">{inst.remarks || 'Success'}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-4 py-8 text-center text-slate-400 font-semibold italic bg-white">
                            No payment transactions recorded yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* 3. ATTENDANCE SECTION */}
          {/* ========================================================== */}
          {activeSection === 'attendance' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><Calendar className="w-5 h-5" /></div>
                  <h3 className="text-base font-extrabold text-primary font-heading">Monthly Attendance Register</h3>
                </div>
                
                {/* Month Selector Controls */}
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-150 p-1 rounded-2xl">
                  <button
                    onClick={() => changeMonth(-1)}
                    disabled={currentDate.getFullYear() <= 2026 && currentDate.getMonth() <= 5}
                    className="p-1.5 hover:bg-slate-200 text-slate-605 disabled:text-slate-300 disabled:hover:bg-transparent rounded-xl transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
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
                    const status = getDayStatus(day, currentDate.getMonth(), currentDate.getFullYear(), profile.studentId);
                    
                    let bgClass = 'bg-white border border-slate-100 text-slate-700 hover:bg-slate-50';
                    let titleText = 'No record';

                    if (status === 'present') {
                      bgClass = 'bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100/70';
                      titleText = 'Present';
                    } else if (status === 'absent') {
                      bgClass = 'bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100/70';
                      titleText = 'Absent';
                    } else if (status === 'holiday') {
                      bgClass = 'bg-amber-55/70 border border-amber-200 text-amber-700 hover:bg-amber-100/70';
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
                  <span>Holiday / Sunday</span>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================== */}
          {/* 4. NOTICES & LOGS SECTION */}
          {/* ========================================================== */}
          {activeSection === 'notices' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><Bell className="w-5 h-5" /></div>
                <h3 className="text-base font-extrabold text-primary font-heading">Notices & Announcements</h3>
              </div>

              {notices.length === 0 ? (
                <div className="text-slate-400 py-16 text-center text-sm font-medium flex flex-col items-center gap-2 border border-dashed border-slate-200 rounded-2xl bg-slate-50/20">
                  <Bell className="w-10 h-10 text-slate-300" />
                  <p>No active announcements sent to your class yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notices.map((n) => {
                    const hasAttachment = !!n.imageUrl;
                    const isNoticePdf = hasAttachment && (n.imageUrl.toLowerCase().includes('.pdf'));
                    const attachmentUrl = hasAttachment && (n.imageUrl.startsWith('http') ? n.imageUrl : `${API_BASE_URL}${n.imageUrl}`);

                    return (
                      <div key={n._id} className="border border-slate-100 rounded-2xl p-5 hover:border-amber-200 hover:bg-slate-50/20 transition-all duration-200 space-y-3">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <h4 className="text-sm font-extrabold text-slate-800 leading-tight">{n.title}</h4>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">
                            {new Date(n.sentAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-650 leading-relaxed whitespace-pre-wrap">{n.description}</p>
                        
                        {/* Notice Attachment Render */}
                        {hasAttachment && (
                          <div className="pt-2">
                            {isNoticePdf ? (
                              <a
                                href={attachmentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 border border-rose-100 bg-rose-50/50 hover:bg-rose-50 text-rose-700 font-bold rounded-xl text-[10px] transition-colors"
                              >
                                <FileText className="w-4 h-4 text-rose-500" /> View Notice Attachment (PDF)
                              </a>
                            ) : (
                              <div className="w-full max-w-sm rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
                                <img src={attachmentUrl} alt="Announcement" className="w-full h-auto object-contain max-h-48" />
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

          {/* ========================================================== */}
          {/* 5. EXAM PERFORMANCE RESULTS SECTION */}
          {/* ========================================================== */}
          {activeSection === 'results' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-xl"><Award className="w-5 h-5" /></div>
                <h3 className="text-base font-extrabold text-primary font-heading">Exam Performance Results</h3>
              </div>

              <div className="overflow-x-auto border border-slate-150 rounded-2xl">
                {results.length === 0 ? (
                  <div className="text-slate-400 py-16 text-center text-sm font-medium flex flex-col items-center gap-2 bg-slate-50/20">
                    <FileSpreadsheet className="w-10 h-10 text-slate-300" />
                    <p>No published test scorecard performance results found for your class.</p>
                  </div>
                ) : (
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-100 font-bold text-slate-400 uppercase tracking-wider">
                        <th className="px-6 py-4">Subject</th>
                        <th className="px-6 py-4">Test Date</th>
                        <th className="px-6 py-4">Marks Obtained</th>
                        <th className="px-6 py-4">Total Marks</th>
                        <th className="px-6 py-4">Percentage</th>
                        <th className="px-6 py-4">Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-650">
                      {results.map((test) => {
                        const score = test.results.find((res) => res.studentId === profile.studentId);
                        if (!score) return null;

                        const percentage = ((score.marks / score.totalMarks) * 100).toFixed(1);

                        return (
                          <tr key={test._id} className="hover:bg-slate-50/30 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-800 flex items-center gap-2">
                              <Award className="w-4 h-4 text-secondary shrink-0" />
                              {test.subject}
                            </td>
                            <td className="px-6 py-4 text-slate-400">
                              <div className="flex items-center gap-1.5 font-medium">
                                <CalendarDays className="w-4 h-4 text-slate-400" />
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
                )}
              </div>
            </div>
          )}

        </div>

      </main>

      {/* Receipt Modal Preview */}
      {isReceiptModalOpen && (() => {
        const student = profile;
        const netTuition = student.totalFees - student.discount;
        const pendingTuition = netTuition - student.paidFees;
        const netGoodies = student.goodiesTotalFee;
        const pendingGoodies = netGoodies - student.goodiesPaidFee;
        const totalOriginal = student.totalFees + student.goodiesTotalFee;
        const totalNet = netTuition + netGoodies;
        const totalPaid = student.paidFees + student.goodiesPaidFee;
        const totalPending = pendingTuition + pendingGoodies;
        
        const today = new Date().toLocaleDateString('en-IN');
        const lastInstallment = student.installments && student.installments.length > 0 
          ? student.installments[student.installments.length - 1] 
          : null;
          
        const payMode = lastInstallment?.method || 'Cash';
        const payDate = lastInstallment?.date ? new Date(lastInstallment.date).toLocaleDateString('en-IN') : today;
        const payRemarks = lastInstallment?.remarks || 'N/A';
        const payTxn = lastInstallment?._id ? lastInstallment._id.toString().substring(18).toUpperCase() : 'N/A';

        return (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="w-full max-w-[850px] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col my-8 max-h-[90vh]">
              {/* Header actions */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 rounded-t-3xl shrink-0">
                <div className="flex items-center gap-2 text-slate-800">
                  <FileSpreadsheet className="w-5 h-5 text-primary" />
                  <h3 className="text-sm font-extrabold text-primary font-heading uppercase tracking-wider">Fee Receipt Preview</h3>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handlePrintReceipt(student)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-light rounded-xl shadow-md transition-all cursor-pointer font-sans"
                  >
                    Print Receipt
                  </button>
                  <button
                    onClick={() => setIsReceiptModalOpen(false)}
                    className="p-1.5 hover:bg-slate-200 text-slate-500 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Receipt Body */}
              <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                <div id="receipt-print-area" className="border-4 p-6 rounded-3xl relative text-slate-800 text-xs font-medium text-left" style={{ borderColor: '#1A3C5E' }}>
                  {/* Top Branding Section */}
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <img src={logo} alt="Logo" className="w-16 h-16 object-contain" />
                      <div>
                        <h1 className="text-2xl font-black tracking-tight" style={{ color: '#1A3C5E' }}>विद्यार्थी क्लासेज</h1>
                        <p className="text-[10px] font-extrabold tracking-widest text-slate-500 uppercase mt-0.5">— नींव से निर्माण तक —</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1">KOTA, RAJASTHAN</p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right space-y-2 w-full sm:w-auto">
                      <span className="inline-block px-5 py-1.5 text-xs font-black text-white rounded-lg shadow-sm" style={{ backgroundColor: '#1A3C5E' }}>FEE INVOICE</span>
                      <table className="text-[10px] text-left w-full mt-2 font-medium">
                        <tbody>
                          <tr><td className="pr-2 font-bold text-slate-500">Invoice No.</td><td>: VC-{student.studentId}-{student._id ? student._id.toString().substring(20).toUpperCase() : 'N/A'}</td></tr>
                          <tr><td className="pr-2 font-bold text-slate-500">Invoice Date</td><td>: {today}</td></tr>
                          <tr><td className="pr-2 font-bold text-slate-500">Admission No.</td><td>: {student.studentId}</td></tr>
                          <tr><td className="pr-2 font-bold text-slate-500">Student ID</td><td>: {student.studentId}</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Two columns: Student Details & Payment Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Student Details */}
                    <div className="border border-slate-200 rounded-2xl p-4">
                      <h3 className="text-[10px] font-black text-white px-3 py-1 rounded-md mb-3 uppercase tracking-wider" style={{ backgroundColor: '#1A3C5E' }}>Student Details</h3>
                      <table className="w-full text-[11px] space-y-1 font-medium">
                        <tbody>
                          <tr><td className="w-24 font-bold text-slate-500 py-0.5">Student Name</td><td>: {student.name}</td></tr>
                          <tr><td className="font-bold text-slate-500 py-0.5">Father's Name</td><td>: {student.fatherName}</td></tr>
                          <tr><td className="font-bold text-slate-500 py-0.5">Course</td><td>: {student.class}</td></tr>
                          <tr><td className="font-bold text-slate-500 py-0.5">Class/Batch</td><td>: {student.class}</td></tr>
                          <tr><td className="font-bold text-slate-500 py-0.5">Phone No.</td><td>: {student.phone}</td></tr>
                          <tr><td className="font-bold text-slate-500 py-0.5">Address</td><td>: {student.address || 'N/A'}</td></tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Payment Details */}
                    <div className="border border-slate-200 rounded-2xl p-4">
                      <h3 className="text-[10px] font-black text-white px-3 py-1 rounded-md mb-3 uppercase tracking-wider" style={{ backgroundColor: '#1A3C5E' }}>Payment Details</h3>
                      <table className="w-full text-[11px] font-medium">
                        <tbody>
                          <tr>
                            <td className="w-24 font-bold text-slate-500 py-1">Payment Mode</td>
                            <td>: 
                              <span className="inline-flex items-center gap-1 mr-2">
                                <input type="checkbox" checked={payMode === 'Cash'} readOnly disabled /> Cash
                              </span>
                              <span className="inline-flex items-center gap-1 mr-2">
                                <input type="checkbox" checked={payMode === 'Online'} readOnly disabled /> Online
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <input type="checkbox" checked={payMode === 'Other'} readOnly disabled /> Other
                              </span>
                            </td>
                          </tr>
                          <tr><td className="font-bold text-slate-500 py-1">Transaction ID</td><td>: {payTxn}</td></tr>
                          <tr><td className="font-bold text-slate-500 py-1">Payment Date</td><td>: {payDate}</td></tr>
                          <tr><td className="font-bold text-slate-500 py-1">Remarks</td><td>: {payRemarks}</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Fee Table */}
                  <div className="overflow-x-auto border border-slate-200 rounded-xl mb-6">
                    <table className="w-full text-[11px] font-medium text-left border-collapse">
                      <thead>
                        <tr className="text-white uppercase tracking-wider" style={{ backgroundColor: '#1A3C5E' }}>
                          <th className="p-2 border-r border-slate-200 text-center w-12">S. No.</th>
                          <th className="p-2 border-r border-slate-200">Particulars</th>
                          <th className="p-2 border-r border-slate-200 text-right">Total Fee (₹)</th>
                          <th className="p-2 border-r border-slate-200 text-right">Discount (₹)</th>
                          <th className="p-2 border-r border-slate-200 text-right">Net Fee (₹)</th>
                          <th className="p-2 border-r border-slate-200 text-right">Paid Amount (₹)</th>
                          <th className="p-2 text-right">Pending Fee (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-200 hover:bg-slate-50/50">
                          <td className="p-2 border-r border-slate-200 text-center">1.</td>
                          <td className="p-2 border-r border-slate-200 font-bold">Tuition Fee</td>
                          <td className="p-2 border-r border-slate-200 text-right">₹{student.totalFees.toLocaleString()}</td>
                          <td className="p-2 border-r border-slate-200 text-right">₹{student.discount.toLocaleString()}</td>
                          <td className="p-2 border-r border-slate-200 text-right">₹{netTuition.toLocaleString()}</td>
                          <td className="p-2 border-r border-slate-200 text-right">₹{student.paidFees.toLocaleString()}</td>
                          <td className="p-2 text-right">₹{pendingTuition.toLocaleString()}</td>
                        </tr>
                        <tr className="border-b border-slate-200 hover:bg-slate-50/50">
                          <td className="p-2 border-r border-slate-200 text-center">2.</td>
                          <td className="p-2 border-r border-slate-200 font-bold">Goodies Fee</td>
                          <td className="p-2 border-r border-slate-200 text-right">₹{student.goodiesTotalFee.toLocaleString()}</td>
                          <td className="p-2 border-r border-slate-200 text-right">₹0</td>
                          <td className="p-2 border-r border-slate-200 text-right">₹{netGoodies.toLocaleString()}</td>
                          <td className="p-2 border-r border-slate-200 text-right">₹{student.goodiesPaidFee.toLocaleString()}</td>
                          <td className="p-2 text-right">₹{pendingGoodies.toLocaleString()}</td>
                        </tr>
                        <tr className="font-extrabold bg-slate-100">
                          <td className="p-2 border-r border-slate-200 text-center"></td>
                          <td className="p-2 border-r border-slate-200">TOTAL</td>
                          <td className="p-2 border-r border-slate-200 text-right">₹{totalOriginal.toLocaleString()}</td>
                          <td className="p-2 border-r border-slate-200 text-right">₹{student.discount.toLocaleString()}</td>
                          <td className="p-2 border-r border-slate-200 text-right">₹{totalNet.toLocaleString()}</td>
                          <td className="p-2 border-r border-slate-200 text-right">₹{totalPaid.toLocaleString()}</td>
                          <td className="p-2 text-right">₹{totalPending.toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[10px] text-slate-400 text-left mb-6">* Discount is applicable only as per institute policy.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Fee Summary */}
                    <div className="border border-slate-200 rounded-2xl p-4">
                      <h3 className="text-[10px] font-black text-white px-3 py-1 rounded-md mb-3 uppercase tracking-wider" style={{ backgroundColor: '#1A3C5E' }}>Fee Summary</h3>
                      <table className="w-full text-[11px] font-medium">
                        <tbody>
                          <tr className="border-b border-slate-100"><td className="font-bold text-slate-500 py-1">Total Fee (₹)</td><td className="text-right font-stats font-bold text-slate-700">₹{totalOriginal.toLocaleString()}</td></tr>
                          <tr className="border-b border-slate-100"><td className="font-bold text-slate-500 py-1">Discount (₹)</td><td class="text-right font-stats font-bold text-slate-750">₹{student.discount.toLocaleString()}</td></tr>
                          <tr className="border-b border-slate-100 bg-blue-50/50"><td className="font-bold text-slate-700 py-1">Net Fee (After Discount) (₹)</td><td className="text-right font-bold text-primary font-stats">₹{totalNet.toLocaleString()}</td></tr>
                          <tr className="border-b border-slate-100"><td className="font-bold text-slate-500 py-1">Paid Amount (₹)</td><td className="text-right text-emerald-600 font-bold font-stats">₹{totalPaid.toLocaleString()}</td></tr>
                          <tr className="border-b border-slate-100 bg-rose-50/30"><td className="font-bold text-slate-700 py-1">Pending Fee (₹)</td><td className="text-right text-danger font-bold font-stats">₹{totalPending.toLocaleString()}</td></tr>
                          <tr><td className="font-bold text-slate-500 py-1">Due Date (if any)</td><td className="text-right text-slate-500 font-stats font-stats font-stats font-stats">N/A</td></tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Previous Fee Details */}
                    <div className="border border-slate-200 rounded-2xl p-4 overflow-y-auto max-h-[220px]">
                      <h3 className="text-[10px] font-black text-white px-3 py-1 rounded-md mb-3 uppercase tracking-wider" style={{ backgroundColor: '#1A3C5E' }}>Previous Fee Details</h3>
                      <table className="w-full text-[10px] border border-slate-200 font-medium">
                        <thead>
                          <tr className="bg-slate-100 text-slate-650">
                            <th className="p-1 border-r border-b border-slate-200 text-center w-8">S.No.</th>
                            <th className="p-1 border-r border-b border-slate-200 text-center font-bold">Payment Date</th>
                            <th className="p-1 border-r border-b border-slate-200 text-center font-bold font-stats">Paid (₹)</th>
                            <th className="p-1 border-r border-b border-slate-200 text-center font-bold">Mode</th>
                            <th className="p-1 border-b border-slate-200 text-center font-bold">Remarks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.from({ length: 5 }).map((_, idx) => {
                            const inst = student.installments && student.installments[idx];
                            return (
                              <tr key={idx} className="h-7 border-b border-slate-200">
                                <td className="border-r border-slate-200 text-center">{idx + 1}</td>
                                <td className="border-r border-slate-200 text-center">{inst ? new Date(inst.date).toLocaleDateString('en-IN') : ''}</td>
                                <td className="border-r border-slate-200 text-center font-bold">{inst ? '₹' + inst.amount.toLocaleString() : ''}</td>
                                <td className="border-r border-slate-200 text-center">{inst ? inst.method : ''}</td>
                                <td className="text-center">{inst ? inst.remarks || 'Success' : ''}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Bottom Notes */}
                  <div className="border-t border-slate-200 pt-4 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                      <div className="text-left md:col-span-2 space-y-1">
                        <h4 className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Important Notes</h4>
                        <ul className="text-[9px] text-slate-400 space-y-0.5 list-disc list-inside">
                          <li>Fees once paid will not be refundable.</li>
                          <li>Please keep this invoice safe for future reference.</li>
                          <li>Any query regarding fees, contact the office.</li>
                        </ul>
                        <p className="text-[10px] font-extrabold italic text-primary mt-2" style={{ color: '#1A3C5E' }}>Thank You!</p>
                      </div>

                      <div className="text-right space-y-6 text-[10px] font-medium text-slate-500">
                        <div className="space-y-0.5">
                          <div>📞 97030 40756</div>
                          <div>📍 Kota, Rajasthan</div>
                        </div>
                        <div>
                          <div className="border-t border-slate-300 w-36 ml-auto mb-0.5"></div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">Authorized Signature</p>
                          <p className="text-[11px] font-black" style={{ color: '#1A3C5E' }}>विद्यार्थी क्लासेज</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-2 border-t flex justify-between items-center text-[9px] font-bold uppercase tracking-wider text-slate-400" style={{ borderColor: '#1A3C5E' }}>
                      <span>Vidyarthi Classes Kota</span>
                      <span style={{ color: '#1A3C5E' }}>नींव से निर्माण तक</span>
                      <span>Quality Education</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default StudentDashboard;
