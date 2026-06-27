import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, API_BASE_URL } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import ConfirmationModal from '../../components/ConfirmationModal';
import {
  GraduationCap,
  Users,
  UserCheck,
  Calendar,
  FileText,
  DollarSign,
  TrendingDown,
  ClipboardList,
  Award,
  Image as ImageIcon,
  Radio,
  LogOut,
  Menu,
  X,
  Plus,
  Search,
  SlidersHorizontal,
  Edit,
  Trash2,
  Eye,
  Check,
  CheckCircle2,
  CalendarDays,
  Coins,
  Send,
  Loader2,
  HelpCircle
} from 'lucide-react';
import logo from '../../assets/logo.png';


const AdminDashboard = () => {
  const navigate = useNavigate();
  const { admin, logout, apiFetch } = useAuth();
  const { showToast } = useToast();

  // Sidebar mobile state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // API loading states
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalFees: 0,
    paidFees: 0,
    pendingFees: 0
  });

  // Data states
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [feeStructures, setFeeStructures] = useState([]);
  const [feeRecords, setFeeRecords] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [broadcasts, setBroadcasts] = useState([]);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({
    title: '',
    description: '',
    classes: [],
    teachers: [],
    enquiries: [],
    image: null
  });

  // Filter & Search states
  const [studentSearch, setStudentSearch] = useState('');
  const [studentClassFilter, setStudentClassFilter] = useState('');
  const [teacherSearch, setTeacherSearch] = useState('');
  const [feeRecordSearch, setFeeRecordSearch] = useState('');
  const [expenseMonth, setExpenseMonth] = useState((new Date().getMonth() + 1).toString());
  const [expenseYear, setExpenseYear] = useState(new Date().getFullYear().toString());
  const [testClassFilter, setTestClassFilter] = useState('');

  // Modals state
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedReceiptStudent, setSelectedReceiptStudent] = useState(null);

  const openReceiptModal = (student) => {
    setSelectedReceiptStudent(student);
    setIsReceiptModalOpen(true);
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

  // Edit states
  const [editingStudent, setEditingStudent] = useState(null);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [editingFeeClass, setEditingFeeClass] = useState(null);
  const [editingFeeAmount, setEditingFeeAmount] = useState('');

  // Delete Confirmation Modals state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  // Dropdown list for classes
  const classesOptions = [
    'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
    'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
    'Class 11', 'Class 12', 'BSTC', 'Rajasthan GK', 'Hindi Literature'
  ];

  // --- STUDENT FORM STATE ---
  const [studentForm, setStudentForm] = useState({
    name: '',
    fatherName: '',
    class: 'Class 10',
    phone: '',
    goodiesStatus: 'Pending',
    discount: 0,
    totalFees: 0,
    paidFees: 0,
    goodiesTotalFee: 0,
    goodiesPaidFee: 0,
    address: '',
    installments: []
  });

  // --- TEACHER FORM STATE ---
  const [teacherForm, setTeacherForm] = useState({
    name: '',
    fatherName: '',
    subject: '',
    classesAssigned: [],
    phone: '',
    email: '',
    salary: 0,
    joiningDate: new Date().toISOString().split('T')[0]
  });

  // --- EXPENSE FORM STATE ---
  const [expenseForm, setExpenseForm] = useState({
    title: '',
    category: 'Rent',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  // --- ACHIEVEMENT FORM STATE ---
  const [achievementForm, setAchievementForm] = useState({
    studentName: '',
    fatherName: '',
    class: 'Class 10',
    description: '',
    photo: null
  });

  // --- GALLERY FORM STATE ---
  const [galleryFiles, setGalleryFiles] = useState([]);

  // --- ENQUIRY LIST STATE ---
  const [enquiryList, setEnquiryList] = useState([]);



  // Fetch stats and relevant tab data on change
  useEffect(() => {
    fetchStats();
    if (activeTab === 'dashboard') fetchStats();
    else if (activeTab === 'student') fetchStudents();
    else if (activeTab === 'teacher') fetchTeachers();
    else if (activeTab === 'fees') {
      fetchFeeStructures();
      fetchFeeRecords();
    } else if (activeTab === 'expenses') fetchExpenses();
    else if (activeTab === 'test-result') fetchTestResults();
    else if (activeTab === 'achievement') fetchAchievements();
    else if (activeTab === 'gallery') fetchGallery();
    else if (activeTab === 'broadcast') {
      fetchBroadcasts();
      fetchTeachers();
      fetchEnquiries();
    } else if (activeTab === 'enquiry') {
      fetchEnquiries();
    }
  }, [activeTab]);

  // Refetch expenses when month/year filters change
  useEffect(() => {
    if (activeTab === 'expenses') {
      fetchExpenses();
    }
  }, [expenseMonth, expenseYear]);

  // Refetch students when search or class filters change
  useEffect(() => {
    if (activeTab === 'student') {
      fetchStudents();
    }
  }, [studentSearch, studentClassFilter]);

  // Refetch teachers when search changes
  useEffect(() => {
    if (activeTab === 'teacher') {
      fetchTeachers();
    }
  }, [teacherSearch]);

  // Refetch fee records on search
  useEffect(() => {
    if (activeTab === 'fees') {
      fetchFeeRecords();
    }
  }, [feeRecordSearch]);

  // Refetch test results on class filter
  useEffect(() => {
    if (activeTab === 'test-result') {
      fetchTestResults();
    }
  }, [testClassFilter]);

  // API Call functions
  const fetchStats = async () => {
    try {
      const data = await apiFetch('/api/dashboard/stats');
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await apiFetch(
        `/api/students?search=${studentSearch}&classFilter=${studentClassFilter}`
      );
      setStudents(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const data = await apiFetch(`/api/teachers?search=${teacherSearch}`);
      setTeachers(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchFeeStructures = async () => {
    try {
      const data = await apiFetch('/api/fees/structure');
      setFeeStructures(data);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const fetchFeeRecords = async () => {
    try {
      const data = await apiFetch(`/api/fees/records?search=${feeRecordSearch}`);
      setFeeRecords(data);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const data = await apiFetch(`/api/expenses?month=${expenseMonth}&year=${expenseYear}`);
      setExpenses(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchTestResults = async () => {
    try {
      setLoading(true);
      const data = await apiFetch(`/api/results?classFilter=${testClassFilter}`);
      setTestResults(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/api/achievements');
      setAchievements(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/api/gallery');
      setGallery(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchBroadcasts = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/api/broadcasts');
      setBroadcasts(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetBroadcastForm = () => {
    setBroadcastForm({
      title: '',
      description: '',
      classes: [],
      teachers: [],
      enquiries: [],
      image: null
    });
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastForm.title || !broadcastForm.description) {
      showToast('Title and Description are required', 'error');
      return;
    }
    if (
      broadcastForm.classes.length === 0 &&
      broadcastForm.teachers.length === 0 &&
      broadcastForm.enquiries.length === 0
    ) {
      showToast('Please select at least one class, teacher, or enquiry to send to', 'error');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', broadcastForm.title);
      formData.append('description', broadcastForm.description);
      formData.append('classes', JSON.stringify(broadcastForm.classes));
      formData.append('teachers', JSON.stringify(broadcastForm.teachers));
      formData.append('enquiries', JSON.stringify(broadcastForm.enquiries));
      if (broadcastForm.image) {
        formData.append('image', broadcastForm.image);
      }

      const res = await apiFetch('/api/broadcasts', {
        method: 'POST',
        body: formData
      });

      showToast(res.message || 'Broadcast sent successfully via WhatsApp!', 'success');
      setIsBroadcastModalOpen(false);
      resetBroadcastForm();
      fetchBroadcasts();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // --- Auto-fill fee logic for Student Registration ---
  const handleStudentClassChange = async (className) => {
    try {
      // Set the selected class in form state
      setStudentForm((prev) => ({ ...prev, class: className }));
      
      // Fetch fee from /api/fees/structure/:class
      const structure = await apiFetch(`/api/fees/structure/${className}`);
      if (structure && structure.fee) {
        setStudentForm((prev) => ({ ...prev, totalFees: structure.fee }));
      }
    } catch (err) {
      console.warn('Could not auto-fill class fee structure:', err.message);
      // Fallback
      setStudentForm((prev) => ({ ...prev, totalFees: 0 }));
    }
  };

  // Triggered when editing a student and changing class
  const handleEditStudentClassChange = async (className, currentFormSetter) => {
    try {
      const structure = await apiFetch(`/api/fees/structure/${className}`);
      if (structure && structure.fee) {
        currentFormSetter((prev) => ({ ...prev, class: className, totalFees: structure.fee }));
      }
    } catch (err) {
      currentFormSetter((prev) => ({ ...prev, class: className }));
    }
  };

  // Register Student handler
  const handleRegisterStudent = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingStudent) {
        // Edit student
        const updated = await apiFetch(`/api/students/${editingStudent._id}`, {
          method: 'PUT',
          body: JSON.stringify(studentForm)
        });
        showToast('Student details updated successfully', 'success');
      } else {
        // Create new
        const created = await apiFetch('/api/students/register', {
          method: 'POST',
          body: JSON.stringify(studentForm)
        });
        showToast(`Student registered successfully! ID: ${created.studentId}`, 'success');
      }
      
      setIsStudentModalOpen(false);
      setEditingStudent(null);
      resetStudentForm();
      fetchStudents();
      fetchStats();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Register Teacher handler
  const handleRegisterTeacher = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingTeacher) {
        // Edit
        await apiFetch(`/api/teachers/${editingTeacher._id}`, {
          method: 'PUT',
          body: JSON.stringify(teacherForm)
        });
        showToast('Teacher details updated successfully', 'success');
      } else {
        // Register new
        const created = await apiFetch('/api/teachers/register', {
          method: 'POST',
          body: JSON.stringify(teacherForm)
        });
        showToast(`Teacher registered successfully! ID: ${created.teacherId}`, 'success');
      }
      setIsTeacherModalOpen(false);
      setEditingTeacher(null);
      resetTeacherForm();
      fetchTeachers();
      fetchStats();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Edit class base fee
  const handleSaveClassFee = async (className) => {
    try {
      if (!editingFeeAmount) return;
      await apiFetch(`/api/fees/structure/${className}`, {
        method: 'PUT',
        body: JSON.stringify({ fee: parseFloat(editingFeeAmount) })
      });
      showToast(`Base fee for ${className} updated successfully`, 'success');
      setEditingFeeClass(null);
      fetchFeeStructures();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Save Expense handler
  const handleSaveExpense = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await apiFetch('/api/expenses', {
        method: 'POST',
        body: JSON.stringify(expenseForm)
      });
      showToast('Expense logged successfully', 'success');
      setIsExpenseModalOpen(false);
      resetExpenseForm();
      fetchExpenses();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Publish Achievement handler
  const handlePublishAchievement = async (e) => {
    e.preventDefault();
    
    // Safety check backend enforcement
    if (achievements.length >= 6) {
      showToast('Maximum of 6 achievements limit reached. Delete one first.', 'error');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('studentName', achievementForm.studentName);
      formData.append('fatherName', achievementForm.fatherName);
      formData.append('class', achievementForm.class);
      formData.append('description', achievementForm.description);
      formData.append('photo', achievementForm.photo);

      await apiFetch('/api/achievements', {
        method: 'POST',
        body: formData
      });

      showToast('Achievement published successfully', 'success');
      setIsAchievementModalOpen(false);
      resetAchievementForm();
      fetchAchievements();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Upload Gallery Photos handler
  const handleUploadGallery = async (e) => {
    e.preventDefault();
    if (galleryFiles.length === 0) {
      showToast('Please select at least one photo to upload', 'error');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      for (let i = 0; i < galleryFiles.length; i++) {
        formData.append('photos', galleryFiles[i]);
      }

      await apiFetch('/api/gallery/upload', {
        method: 'POST',
        body: formData
      });

      showToast('Photos uploaded to achievements gallery', 'success');
      setIsGalleryModalOpen(false);
      setGalleryFiles([]);
      fetchGallery();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Publish Test Result handler
  const handlePublishTest = async (testId) => {
    try {
      await apiFetch(`/api/results/${testId}/publish`, {
        method: 'PUT'
      });
      showToast('Test results published to students successfully', 'success');
      fetchTestResults();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Trigger custom confirmation modal for delete
  const triggerDeleteConfirm = (title, message, onConfirm) => {
    setDeleteModal({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        closeDeleteModal();
      }
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal((prev) => ({ ...prev, isOpen: false }));
  };

  // Delete handlers
  const handleDeleteStudent = (student) => {
    triggerDeleteConfirm(
      'Delete Student Record',
      `Are you sure you want to delete the student "${student.name}" (ID: ${student.studentId})? This will permanently remove their records.`,
      async () => {
        try {
          await apiFetch(`/api/students/${student._id}`, { method: 'DELETE' });
          showToast('Student deleted successfully', 'success');
          fetchStudents();
          fetchStats();
        } catch (err) {
          showToast(err.message, 'error');
        }
      }
    );
  };

  const handleDeleteTeacher = (teacher) => {
    triggerDeleteConfirm(
      'Remove Teacher Record',
      `Are you sure you want to remove teacher "${teacher.name}"? This action cannot be undone.`,
      async () => {
        try {
          await apiFetch(`/api/teachers/${teacher._id}`, { method: 'DELETE' });
          showToast('Teacher removed successfully', 'success');
          fetchTeachers();
          fetchStats();
        } catch (err) {
          showToast(err.message, 'error');
        }
      }
    );
  };

  const handleDeleteExpense = (expense) => {
    triggerDeleteConfirm(
      'Delete Expense Entry',
      `Delete expense "${expense.title}" of ₹${expense.amount.toLocaleString()}?`,
      async () => {
        try {
          await apiFetch(`/api/expenses/${expense._id}`, { method: 'DELETE' });
          showToast('Expense entry deleted', 'success');
          fetchExpenses();
        } catch (err) {
          showToast(err.message, 'error');
        }
      }
    );
  };

  const handleDeleteAchievement = (ach) => {
    triggerDeleteConfirm(
      'Delete Achievement Card',
      `Remove achievement card of "${ach.studentName}"?`,
      async () => {
        try {
          await apiFetch(`/api/achievements/${ach._id}`, { method: 'DELETE' });
          showToast('Achievement card deleted', 'success');
          fetchAchievements();
        } catch (err) {
          showToast(err.message, 'error');
        }
      }
    );
  };

  const handleDeleteGallery = (photo) => {
    triggerDeleteConfirm(
      'Delete Gallery Photo',
      'Remove this photo from achievements gallery?',
      async () => {
        try {
          await apiFetch(`/api/gallery/${photo._id}`, { method: 'DELETE' });
          showToast('Photo deleted from gallery', 'success');
          fetchGallery();
        } catch (err) {
          showToast(err.message, 'error');
        }
      }
    );
  };

  // --- Reset Forms ---
  const resetStudentForm = () => {
    setStudentForm({
      name: '',
      fatherName: '',
      class: 'Class 10',
      phone: '',
      goodiesStatus: 'Pending',
      discount: 0,
      totalFees: 0,
      paidFees: 0,
      goodiesTotalFee: 0,
      goodiesPaidFee: 0,
      address: '',
      installments: []
    });
  };

  const resetTeacherForm = () => {
    setTeacherForm({
      name: '',
      fatherName: '',
      subject: '',
      classesAssigned: [],
      phone: '',
      email: '',
      salary: 0,
      joiningDate: new Date().toISOString().split('T')[0]
    });
  };

  const resetExpenseForm = () => {
    setExpenseForm({
      title: '',
      category: 'Rent',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
  };

  const resetAchievementForm = () => {
    setAchievementForm({
      studentName: '',
      fatherName: '',
      class: 'Class 10',
      description: '',
      photo: null
    });
  };

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/api/enquiries');
      setEnquiryList(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEnquiry = (enquiry) => {
    triggerDeleteConfirm(
      'Delete Enquiry',
      `Are you sure you want to delete the enquiry from "${enquiry.studentName}"?`,
      async () => {
        try {
          await apiFetch(`/api/enquiries/${enquiry._id}`, { method: 'DELETE' });
          showToast('Enquiry deleted successfully', 'success');
          fetchEnquiries();
        } catch (err) {
          showToast(err.message, 'error');
        }
      }
    );
  };



  // --- Edit Modals Openers ---
  const openEditStudent = (student) => {
    setEditingStudent(student);
    setStudentForm({
      name: student.name,
      fatherName: student.fatherName,
      class: student.class,
      phone: student.phone,
      goodiesStatus: student.goodiesStatus,
      discount: student.discount,
      totalFees: student.totalFees,
      paidFees: student.paidFees,
      goodiesTotalFee: student.goodiesTotalFee,
      goodiesPaidFee: student.goodiesPaidFee,
      address: student.address || '',
      installments: student.installments || []
    });
    setIsStudentModalOpen(true);
  };

  const openEditTeacher = (teacher) => {
    setEditingTeacher(teacher);
    setTeacherForm({
      name: teacher.name,
      fatherName: teacher.fatherName,
      subject: teacher.subject,
      classesAssigned: teacher.classesAssigned,
      phone: teacher.phone,
      email: teacher.email,
      salary: teacher.salary,
      joiningDate: new Date(teacher.joiningDate).toISOString().split('T')[0]
    });
    setIsTeacherModalOpen(true);
  };

  // Logout handler
  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'info');
    navigate('/');
  };

  // Sidebar list
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: ClipboardList },
    { id: 'student', label: 'Student', icon: Users },
    { id: 'teacher', label: 'Teacher', icon: UserCheck },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'fees', label: 'Fee Management', icon: Coins },
    { id: 'expenses', label: 'Expenses', icon: TrendingDown },
    { id: 'test-result', label: 'Test Result', icon: ClipboardList },
    { id: 'achievement', label: 'Achievement', icon: Award },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'broadcast', label: 'Broadcast', icon: Radio },
    { id: 'enquiry', label: 'Enquiries', icon: HelpCircle }
  ];

  return (
    <div className="min-h-screen bg-bgLight flex flex-col font-sans">
      {/* top navbar header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm flex items-center justify-between px-6 h-20 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="Vidyarthi Classes Logo" className="w-10 h-10 object-contain" />
            <h1 className="text-lg sm:text-xl font-bold text-primary font-heading tracking-tight">
              Vidyarthi Classes Kota
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <span className="text-xs text-slate-400 block font-medium">Logged in as</span>
            <span className="text-sm font-bold text-slate-700">{admin?.name || 'Administrator'}</span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-rose-50 hover:bg-rose-100 text-danger p-2.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center"
            title="Log Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar Container */}
        <aside
          className={`bg-primary w-64 shrink-0 h-full text-slate-300 flex flex-col justify-between absolute z-40 md:relative transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 transition-transform duration-300 ease-in-out`}
        >
          <div className="overflow-y-auto py-6 px-4 space-y-1 flex-1">
            {sidebarItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    activeTab === item.id
                      ? 'bg-secondary text-white shadow-md'
                      : 'hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <IconComponent className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
          <div className="p-4 border-t border-white/5 text-[10px] text-slate-400 text-center">
            © 2026 Vidyarthi Classes Kota
          </div>
        </aside>

        {/* Backdrop for mobile menu */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-xs md:hidden"
          />
        )}

        {/* Content Panel */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 text-slate-800">
          {/* STATS CARDS (Top of Dashboard Page) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Heading */}
              <div className="text-left space-y-1">
                <h2 className="text-2xl font-extrabold text-primary font-heading">Overview Dashboard</h2>
                <p className="text-xs text-slate-400">Live operational stats aggregated from MongoDB database.</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-premium hover:shadow-premiumHover hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-5 text-left">
                  <div className="bg-primary/5 p-4 rounded-xl text-primary"><Users className="w-8 h-8" /></div>
                  <div>
                    <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Total Students</span>
                    <span className="text-3xl font-bold font-stats text-primary mt-1 block">{stats.totalStudents}</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-premium hover:shadow-premiumHover hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-5 text-left">
                  <div className="bg-secondary/10 p-4 rounded-xl text-secondary"><UserCheck className="w-8 h-8" /></div>
                  <div>
                    <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Total Teachers</span>
                    <span className="text-3xl font-bold font-stats text-primary mt-1 block">{stats.totalTeachers}</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-premium hover:shadow-premiumHover hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-5 text-left">
                  <div className="bg-emerald-50 p-4 rounded-xl text-emerald-600"><Coins className="w-8 h-8" /></div>
                  <div>
                    <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Total Fees Billing</span>
                    <span className="text-3xl font-bold font-stats text-emerald-600 mt-1 block">₹{stats.totalFees.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-premium flex items-center gap-5 text-left">
                  <div className="bg-emerald-500/10 p-4 rounded-xl text-emerald-600"><DollarSign className="w-8 h-8" /></div>
                  <div>
                    <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Paid Fees Collection</span>
                    <span className="text-3xl font-bold font-stats text-emerald-600 mt-1 block">₹{stats.paidFees.toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-premium flex items-center gap-5 text-left">
                  <div className="bg-rose-50 p-4 rounded-xl text-danger"><TrendingDown className="w-8 h-8" /></div>
                  <div>
                    <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Pending Fees Owed</span>
                    <span className="text-3xl font-bold font-stats text-danger mt-1 block">₹{stats.pendingFees.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions / Recent Activity */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-premium text-left space-y-4">
                <h3 className="text-md font-bold text-primary font-heading">Quick Shortcuts</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <button onClick={() => { setActiveTab('student'); setIsStudentModalOpen(true); }} className="p-4 border border-slate-100 hover:bg-slate-50 transition-colors text-center rounded-xl space-y-2 cursor-pointer">
                    <Plus className="w-5 h-5 mx-auto text-primary" />
                    <span className="text-xs font-semibold text-slate-600 block">Add Student</span>
                  </button>
                  <button onClick={() => { setActiveTab('teacher'); setIsTeacherModalOpen(true); }} className="p-4 border border-slate-100 hover:bg-slate-50 transition-colors text-center rounded-xl space-y-2 cursor-pointer">
                    <Plus className="w-5 h-5 mx-auto text-secondary" />
                    <span className="text-xs font-semibold text-slate-600 block">Add Teacher</span>
                  </button>
                  <button onClick={() => { setActiveTab('expenses'); setIsExpenseModalOpen(true); }} className="p-4 border border-slate-100 hover:bg-slate-50 transition-colors text-center rounded-xl space-y-2 cursor-pointer">
                    <Plus className="w-5 h-5 mx-auto text-rose-500" />
                    <span className="text-xs font-semibold text-slate-600 block">Add Expense</span>
                  </button>
                  <button onClick={() => { setActiveTab('achievement'); setIsAchievementModalOpen(true); }} className="p-4 border border-slate-100 hover:bg-slate-50 transition-colors text-center rounded-xl space-y-2 cursor-pointer">
                    <Plus className="w-5 h-5 mx-auto text-emerald-500" />
                    <span className="text-xs font-semibold text-slate-600 block">Add Achiever</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==================== 2. STUDENT PAGE ==================== */}
          {activeTab === 'student' && (
            <div className="space-y-6 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-primary font-heading">Students Registrar</h2>
                  <p className="text-xs text-slate-400">Register new students and manage profiles.</p>
                </div>
                <button
                  onClick={() => { setEditingStudent(null); resetStudentForm(); setIsStudentModalOpen(true); }}
                  className="px-5 py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-lg rounded-xl flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <Plus className="w-5 h-5" /> Register Student
                </button>
              </div>

              {/* Filters / Search */}
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="Search by student name, ID or father's name..."
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 rounded-lg border border-slate-200 outline-none focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary transition-all text-slate-700"
                  />
                </div>
                
                <div className="w-full sm:w-48 shrink-0">
                  <select
                    value={studentClassFilter}
                    onChange={(e) => setStudentClassFilter(e.target.value)}
                    className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 outline-none focus:bg-white"
                  >
                    <option value="">All Classes</option>
                    {classesOptions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Students Table */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-premium overflow-hidden">
                {loading ? (
                  <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                ) : students.length === 0 ? (
                  <div className="text-slate-400 py-16 text-center text-sm font-medium">No student records found.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                      <thead>
                        <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                          <th className="px-6 py-4">ID</th>
                          <th className="px-6 py-4">Student Name</th>
                          <th className="px-6 py-4">Father Name</th>
                          <th className="px-6 py-4">Class</th>
                          <th className="px-6 py-4">Phone</th>
                          <th className="px-6 py-4">Total Fee</th>
                          <th className="px-6 py-4">Paid Fee</th>
                          <th className="px-6 py-4">Pending Fee</th>
                          <th className="px-6 py-4">Goodies</th>
                          <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs text-slate-600 font-medium">
                        {students.map((student) => {
                          const netFee = student.totalFees - student.discount;
                          const pendingFee = netFee - student.paidFees;
                          return (
                            <tr key={student._id} className="hover:bg-slate-55/30 transition-colors">
                              <td className="px-6 py-4 font-bold text-primary font-stats">{student.studentId}</td>
                              <td className="px-6 py-4 font-bold text-slate-800">{student.name}</td>
                              <td className="px-6 py-4">{student.fatherName}</td>
                              <td className="px-6 py-4">
                                <span className="bg-primary/5 text-primary px-2.5 py-1 rounded-full text-[10px] font-bold">
                                  {student.class}
                                </span>
                              </td>
                              <td className="px-6 py-4">{student.phone}</td>
                              <td className="px-6 py-4 font-stats">₹{student.totalFees.toLocaleString()}</td>
                              <td className="px-6 py-4 text-emerald-600 font-bold font-stats">₹{student.paidFees.toLocaleString()}</td>
                              <td className={`px-6 py-4 font-bold font-stats ${pendingFee > 0 ? 'text-danger' : 'text-emerald-600'}`}>
                                ₹{pendingFee > 0 ? pendingFee.toLocaleString() : 0}
                              </td>
                              <td className="px-6 py-4 space-y-1 text-left">
                                <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                  student.goodiesStatus === 'All Distributed'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                    : student.goodiesStatus === 'Pending'
                                    ? 'bg-slate-50 text-slate-400 border border-slate-200'
                                    : 'bg-orange-50 text-secondary border border-orange-100'
                                }`}>
                                  {student.goodiesStatus}
                                </span>
                                <div className="text-[10px] text-slate-400 font-semibold font-stats">
                                  Paid: ₹{student.goodiesPaidFee} / ₹{student.goodiesTotalFee}
                                </div>
                              </td>
                              <td className="px-6 py-4 flex items-center justify-center gap-2">
                                <button
                                  onClick={() => openReceiptModal(student)}
                                  className="p-2 border border-slate-100 rounded-lg text-slate-500 hover:bg-amber-50 hover:text-secondary transition-colors cursor-pointer"
                                  title="Fee Invoice / Receipt"
                                >
                                  <FileText className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => openEditStudent(student)}
                                  className="p-2 border border-slate-100 rounded-lg text-slate-500 hover:bg-primary/5 hover:text-primary transition-colors cursor-pointer"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteStudent(student)}
                                  className="p-2 border border-slate-100 rounded-lg text-slate-500 hover:bg-rose-50 hover:text-danger transition-colors cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
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
          )}

          {/* ==================== 3. TEACHER PAGE ==================== */}
          {activeTab === 'teacher' && (
            <div className="space-y-6 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-primary font-heading">Faculty & Teachers</h2>
                  <p className="text-xs text-slate-400">Register teachers, assign classes and subjects.</p>
                </div>
                <button
                  onClick={() => { setEditingTeacher(null); resetTeacherForm(); setIsTeacherModalOpen(true); }}
                  className="px-5 py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-lg rounded-xl flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <Plus className="w-5 h-5" /> Register Teacher
                </button>
              </div>

              {/* Filter Search */}
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="relative w-full sm:max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={teacherSearch}
                    onChange={(e) => setTeacherSearch(e.target.value)}
                    placeholder="Search by teacher name, ID, or subject..."
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 rounded-lg border border-slate-200 outline-none focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary transition-all text-slate-700"
                  />
                </div>
              </div>

              {/* Faculty Table */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-premium overflow-hidden">
                {loading ? (
                  <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                ) : teachers.length === 0 ? (
                  <div className="text-slate-400 py-16 text-center text-sm font-medium">No teacher records found.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                      <thead>
                        <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                          <th className="px-6 py-4">ID</th>
                          <th className="px-6 py-4">Teacher Name</th>
                          <th className="px-6 py-4">Subject</th>
                          <th className="px-6 py-4">Assigned Classes</th>
                          <th className="px-6 py-4">Phone Number</th>
                          <th className="px-6 py-4">Salary</th>
                          <th className="px-6 py-4">Joining Date</th>
                          <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs text-slate-600 font-medium">
                        {teachers.map((teacher) => (
                          <tr key={teacher._id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-bold text-primary font-stats">{teacher.teacherId}</td>
                            <td className="px-6 py-4 font-bold text-slate-800">{teacher.name}</td>
                            <td className="px-6 py-4 font-semibold text-secondary">{teacher.subject}</td>
                            <td className="px-6 py-4 max-w-xs">
                              <div className="flex flex-wrap gap-1.5">
                                {teacher.classesAssigned.map((c) => (
                                  <span key={c} className="bg-primary/5 text-primary px-2 py-0.5 rounded text-[9px] font-bold">
                                    {c}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-6 py-4">{teacher.phone}</td>
                            <td className="px-6 py-4 font-stats">₹{teacher.salary.toLocaleString()}</td>
                            <td className="px-6 py-4 text-slate-400">
                              {new Date(teacher.joiningDate).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </td>
                            <td className="px-6 py-4 flex items-center justify-center gap-2">
                              <button
                                onClick={() => openEditTeacher(teacher)}
                                className="p-2 border border-slate-100 rounded-lg text-slate-500 hover:bg-primary/5 hover:text-primary transition-colors cursor-pointer"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteTeacher(teacher)}
                                className="p-2 border border-slate-100 rounded-lg text-slate-500 hover:bg-rose-50 hover:text-danger transition-colors cursor-pointer"
                                title="Remove"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================== 4. FEE MANAGEMENT PAGE ==================== */}
          {activeTab === 'fees' && (
            <div className="space-y-8 text-left">
              {/* Heading */}
              <div>
                <h2 className="text-2xl font-extrabold text-primary font-heading">Fee Management</h2>
                <p className="text-xs text-slate-400">Configure base class fees structure and inspect student outstanding bills.</p>
              </div>

              {/* SECTION A - Class Fee Structure */}
              <div className="space-y-4">
                <h3 className="text-md font-bold text-primary font-heading relative pl-3.5">
                  Class Fee Structure (Section A)
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-3 bg-secondary rounded-full" />
                </h3>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-premium overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                      <thead>
                        <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                          <th className="px-6 py-4">Class</th>
                          <th className="px-6 py-4">Base Configured Fee</th>
                          <th className="px-6 py-4">Registered Students</th>
                          <th className="px-6 py-4 text-emerald-600">Fully Paid Students</th>
                          <th className="px-6 py-4 text-danger font-semibold">Pending Students</th>
                          <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs text-slate-600 font-medium">
                        {feeStructures.map((structure) => (
                          <tr key={structure._id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-800">{structure.class}</td>
                            <td className="px-6 py-4">
                              {editingFeeClass === structure.class ? (
                                <div className="flex items-center gap-2 max-w-[150px]">
                                  <span className="text-slate-400">₹</span>
                                  <input
                                    type="number"
                                    value={editingFeeAmount}
                                    onChange={(e) => setEditingFeeAmount(e.target.value)}
                                    className="w-full border border-slate-300 rounded px-2.5 py-1 outline-none text-xs focus:ring-1 focus:ring-primary"
                                    autoFocus
                                  />
                                </div>
                              ) : (
                                <span className="font-stats text-slate-800 font-bold">₹{structure.fee.toLocaleString()}</span>
                              )}
                            </td>
                            <td className="px-6 py-4 font-stats">{structure.students}</td>
                            <td className="px-6 py-4 text-emerald-600 font-bold font-stats">{structure.paid}</td>
                            <td className="px-6 py-4 text-danger font-bold font-stats">{structure.pending}</td>
                            <td className="px-6 py-4 text-center">
                              {editingFeeClass === structure.class ? (
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => handleSaveClassFee(structure.class)}
                                    className="bg-emerald-600 text-white p-1.5 rounded hover:bg-emerald-700 transition-colors cursor-pointer"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setEditingFeeClass(null)}
                                    className="bg-slate-150 text-slate-600 p-1.5 rounded hover:bg-slate-200 transition-colors cursor-pointer"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    setEditingFeeClass(structure.class);
                                    setEditingFeeAmount(structure.fee.toString());
                                  }}
                                  className="px-3.5 py-1.5 border border-slate-200 hover:border-primary/30 rounded-lg text-slate-600 hover:text-primary transition-all text-[11px] font-semibold cursor-pointer"
                                >
                                  Edit Fee
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
              </div>
            </div>
          </div>
        </div>
      )}

          {/* ==================== 5. EXPENSES PAGE ==================== */}
          {activeTab === 'expenses' && (
            <div className="space-y-6 text-left">
              {/* Heading */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-primary font-heading font-sans">Business Expenses Journal</h2>
                  <p className="text-xs text-slate-400">Sticky journal-style logging tool to filter and register utility expenses.</p>
                </div>
                <button
                  onClick={() => { resetExpenseForm(); setIsExpenseModalOpen(true); }}
                  className="px-5 py-3 text-sm font-bold text-white bg-primary hover:bg-primary-light shadow-md hover:shadow-lg rounded-xl flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <Plus className="w-5 h-5" /> Log Expense
                </button>
              </div>

              {/* Filter Row & Total */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-premium flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                {/* Date Dropdowns */}
                <div className="flex items-center gap-3">
                  <div>
                    <select
                      value={expenseMonth}
                      onChange={(e) => setExpenseMonth(e.target.value)}
                      className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 outline-none focus:bg-white focus:ring-1 focus:ring-primary"
                    >
                      <option value="1">January</option>
                      <option value="2">February</option>
                      <option value="3">March</option>
                      <option value="4">April</option>
                      <option value="5">May</option>
                      <option value="6">June</option>
                      <option value="7">July</option>
                      <option value="8">August</option>
                      <option value="9">September</option>
                      <option value="10">October</option>
                      <option value="11">November</option>
                      <option value="12">December</option>
                    </select>
                  </div>
                  
                  <div>
                    <select
                      value={expenseYear}
                      onChange={(e) => setExpenseYear(e.target.value)}
                      className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 outline-none focus:bg-white focus:ring-1 focus:ring-primary"
                    >
                      <option value="2024">2024</option>
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                      <option value="2027">2027</option>
                    </select>
                  </div>
                </div>

                {/* Monthly Total */}
                <div className="bg-rose-50/50 border border-rose-100/50 px-6 py-3.5 rounded-2xl shrink-0">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Total Expenses in {new Date(parseInt(expenseYear), parseInt(expenseMonth) - 1).toLocaleString('default', { month: 'long' })} {expenseYear}
                  </span>
                  <span className="text-2xl font-black font-stats text-danger mt-1 block">
                    ₹{expenses.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}/-
                  </span>
                </div>
              </div>

              {/* Journal Grid */}
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : expenses.length === 0 ? (
                <div className="text-slate-400 py-20 text-center text-sm font-medium border border-dashed border-slate-200 rounded-2xl bg-white">No expenses logged for this month.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {expenses.map((expense) => {
                    const categoryColors = {
                      Rent: 'bg-indigo-50 text-indigo-700 border-indigo-100',
                      Salary: 'bg-emerald-50 text-emerald-700 border-emerald-100',
                      Electricity: 'bg-amber-50 text-amber-700 border-amber-100',
                      Stationary: 'bg-rose-50 text-rose-700 border-rose-100',
                      Maintenance: 'bg-teal-50 text-teal-700 border-teal-100',
                      Other: 'bg-slate-50 text-slate-700 border-slate-200'
                    };
                    return (
                      <div
                        key={expense._id}
                        className="bg-white rounded-2xl p-6 border border-slate-100 shadow-premium hover:shadow-premiumHover hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-5"
                      >
                        {/* Title & Category */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-3">
                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase border ${
                              categoryColors[expense.category] || categoryColors.Other
                            }`}>
                              {expense.category}
                            </span>
                            <span className="text-xs text-slate-400 font-semibold">
                              {new Date(expense.date).toLocaleDateString('en-IN', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          
                          <h4 className="text-base font-extrabold text-primary font-heading line-clamp-2">
                            {expense.title}
                          </h4>
                          
                          {expense.description && (
                            <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                              {expense.description}
                            </p>
                          )}
                        </div>

                        {/* Amount & Delete */}
                        <div className="border-t border-slate-50 pt-4 flex items-center justify-between">
                          <span className="text-lg font-black font-stats text-danger">
                            ₹{expense.amount.toLocaleString()}
                          </span>
                          <button
                            onClick={() => handleDeleteExpense(expense)}
                            className="p-2 bg-rose-50 text-danger hover:bg-rose-100 hover:text-danger-dark rounded-xl transition-all duration-200 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ==================== 6. TEST RESULT PAGE ==================== */}
          {activeTab === 'test-result' && (
            <div className="space-y-8 text-left">
              {/* Heading */}
              <div>
                <h2 className="text-2xl font-extrabold text-primary font-heading">Test Results</h2>
                <p className="text-xs text-slate-400">Publish exam marks submitted by teaching staff to students.</p>
              </div>

              {/* Class Filter bar */}
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div className="w-full sm:w-48 shrink-0">
                  <select
                    value={testClassFilter}
                    onChange={(e) => setTestClassFilter(e.target.value)}
                    className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 outline-none"
                  >
                    <option value="">All Classes</option>
                    {classesOptions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submitted Test Cards */}
              {loading ? (
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : testResults.length === 0 ? (
                <div className="text-slate-400 py-16 text-center text-sm font-medium">No submitted test results found.</div>
              ) : (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {testResults.map((result) => (
                      <div
                        key={result._id}
                        className="bg-white rounded-2xl p-6 border border-slate-100 shadow-premium flex flex-col justify-between space-y-6"
                      >
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="bg-primary/5 text-primary text-[10px] font-bold px-2.5 py-1 rounded-full">
                              {result.class}
                            </span>
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                              result.isPublished
                                ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                                : 'bg-amber-50 border-amber-100 text-amber-600'
                            }`}>
                              {result.isPublished ? 'Published' : 'Pending Review'}
                            </span>
                          </div>

                          <div>
                            <h4 className="text-base font-extrabold text-primary font-heading">{result.subject} Exam</h4>
                            <div className="text-xs text-slate-400 font-semibold mt-1 flex items-center gap-1.5">
                              <CalendarDays className="w-4 h-4" />
                              Date: {new Date(result.testDate).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                            <div className="text-xs text-slate-400 font-semibold mt-1">Submitted by Teacher ID: {result.teacherId}</div>
                          </div>
                        </div>

                        <div className="border-t border-slate-50 pt-4 flex items-center justify-between">
                          <span className="text-xs text-slate-400 font-semibold">
                            Total Students: <strong className="text-slate-700 font-bold">{result.results.length}</strong>
                          </span>
                          {!result.isPublished && (
                            <button
                              onClick={() => handlePublishTest(result._id)}
                              className="px-4 py-2 text-xs font-bold text-white bg-secondary hover:bg-secondary-dark rounded-xl shadow-md transition-all duration-200 cursor-pointer flex items-center gap-1.5"
                            >
                              <CheckCircle2 className="w-4 h-4" /> Publish Result
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Complete Results Details Table */}
                  <div className="space-y-4">
                    <h3 className="text-md font-bold text-primary font-heading relative pl-3.5">
                      Student Scores List Table View
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-3 bg-secondary rounded-full" />
                    </h3>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-premium overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                          <thead>
                            <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                              <th className="px-6 py-4">Student ID</th>
                              <th className="px-6 py-4">Student Name</th>
                              <th className="px-6 py-4">Class</th>
                              <th className="px-6 py-4">Subject</th>
                              <th className="px-6 py-4">Marks Obtained</th>
                              <th className="px-6 py-4">Total Marks</th>
                              <th className="px-6 py-4">Grade</th>
                              <th className="px-6 py-4">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-xs text-slate-600 font-medium">
                            {testResults.flatMap((test) =>
                              test.results.map((res, idx) => (
                                <tr key={`${test._id}-${idx}`} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="px-6 py-4 font-bold text-primary font-stats">{res.studentId}</td>
                                  <td className="px-6 py-4 font-bold text-slate-800">{res.studentName}</td>
                                  <td className="px-6 py-4">{test.class}</td>
                                  <td className="px-6 py-4 font-semibold text-secondary">{test.subject}</td>
                                  <td className="px-6 py-4 font-bold font-stats text-slate-700">{res.marks}</td>
                                  <td className="px-6 py-4 font-stats">{res.totalMarks}</td>
                                  <td className="px-6 py-4">
                                    <span className="bg-primary/5 text-primary text-[10px] font-bold px-2 py-0.5 rounded">
                                      {res.grade || 'A'}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase ${
                                      test.isPublished
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                        : 'bg-slate-50 text-slate-400 border border-slate-200'
                                    }`}>
                                      {test.isPublished ? 'Published' : 'Hidden'}
                                    </span>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================== 7. ACHIEVEMENT PAGE ==================== */}
          {activeTab === 'achievement' && (
            <div className="space-y-6 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-primary font-heading font-sans">Landing Page Achievers</h2>
                  <p className="text-xs text-slate-400">Show student achievements on the landing page (Strict Limit: Maximum 6).</p>
                </div>
                
                {achievements.length >= 6 ? (
                  <div className="text-rose-500 font-semibold text-xs border border-rose-200 bg-rose-50 px-4 py-2 rounded-xl flex items-center gap-1.5 shrink-0 select-none">
                    Delete one to add new
                  </div>
                ) : (
                  <button
                    onClick={() => { resetAchievementForm(); setIsAchievementModalOpen(true); }}
                    className="px-5 py-3 text-sm font-bold text-white bg-primary hover:bg-primary-light shadow-md hover:shadow-lg rounded-xl flex items-center gap-2 cursor-pointer shrink-0"
                  >
                    <Plus className="w-5 h-5" /> Add Achievement
                  </button>
                )}
              </div>

              {/* Achievements Grid */}
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : achievements.length === 0 ? (
                <div className="text-slate-400 py-16 text-center text-sm font-medium">No achievers added yet.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {achievements.map((ach) => {
                    const src = ach.photoUrl.startsWith('http')
                      ? ach.photoUrl
                      : `${API_BASE_URL}${ach.photoUrl}`;
                    return (
                      <div
                        key={ach._id}
                        className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-premium flex flex-col justify-between"
                      >
                        <div className="aspect-[4/3] w-full bg-slate-100 overflow-hidden relative border-b border-slate-100">
                          <img
                            src={src}
                            alt={ach.studentName}
                            className="w-full h-full object-cover object-top"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=250';
                            }}
                          />
                          <div className="absolute top-3 right-3 bg-secondary text-white font-bold font-stats text-[10px] px-2.5 py-0.5 rounded-full shadow-sm">
                            {ach.class}
                          </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                          <div>
                            <h4 className="text-sm font-extrabold text-primary font-heading">{ach.studentName}</h4>
                            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider mt-0.5">S/O: {ach.fatherName}</span>
                            <p className="text-slate-500 text-[11px] mt-2.5 leading-relaxed font-medium">
                              {ach.description}
                            </p>
                          </div>

                          <div className="pt-4 border-t border-slate-50 flex items-center justify-end">
                            <button
                              onClick={() => handleDeleteAchievement(ach)}
                              className="p-2 text-danger hover:bg-rose-50 hover:text-danger-dark border border-slate-100 rounded-xl transition-all duration-200 cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ==================== 8. GALLERY PAGE ==================== */}
          {activeTab === 'gallery' && (
            <div className="space-y-6 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-primary font-heading font-sans">Gallery Repository</h2>
                  <p className="text-xs text-slate-400">Bulk upload student images to display in the achievements portfolio see-more section.</p>
                </div>
                <button
                  onClick={() => { setGalleryFiles([]); setIsGalleryModalOpen(true); }}
                  className="px-5 py-3 text-sm font-bold text-white bg-primary hover:bg-primary-light shadow-md hover:shadow-lg rounded-xl flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <Plus className="w-5 h-5" /> Bulk Upload Images
                </button>
              </div>

              {/* Gallery Image Grid */}
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : gallery.length === 0 ? (
                <div className="text-slate-400 py-20 text-center text-sm font-medium border border-dashed border-slate-200 rounded-2xl bg-white">No photos in repository yet.</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                  {gallery.map((photo) => {
                    const src = photo.photoUrl.startsWith('http')
                      ? photo.photoUrl
                      : `${API_BASE_URL}${photo.photoUrl}`;
                    return (
                      <div
                        key={photo._id}
                        className="bg-white rounded-xl overflow-hidden border border-slate-100 shadow-premium relative group aspect-square flex items-center justify-center bg-slate-50"
                      >
                        <img
                          src={src}
                          alt="gallery item"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=150';
                          }}
                        />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                          <button
                            onClick={() => handleDeleteGallery(photo)}
                            className="bg-danger hover:bg-danger-dark text-white p-2.5 rounded-xl shadow-lg transition-transform duration-200 scale-90 hover:scale-100 cursor-pointer"
                            title="Delete Photo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ==================== 9. ATTENDANCE PAGE (MOCK) ==================== */}
          {activeTab === 'attendance' && (
            <div className="space-y-6 text-left">
              <div>
                <h2 className="text-2xl font-extrabold text-primary font-heading font-sans">Attendance Register</h2>
                <p className="text-xs text-slate-400">Class attendance simulator logs.</p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-premium text-center space-y-4">
                <CalendarDays className="w-12 h-12 text-slate-350 mx-auto" />
                <h4 className="text-base font-extrabold text-primary font-heading">Mark Digital Attendance</h4>
                <p className="text-slate-500 text-xs max-w-sm mx-auto leading-relaxed">
                  Select a class roster below to simulate or audit daily student attendance marks.
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <select className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-primary">
                    {classesOptions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <button onClick={() => showToast('Attendance marked successfully', 'success')} className="px-5 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-light rounded-lg transition-colors cursor-pointer">
                    Simulate Roll Call
                  </button>
                </div>
              </div>
            </div>
          )}


          {/* ==================== 11. BROADCAST PAGE ==================== */}
          {activeTab === 'broadcast' && (
            <div className="space-y-6 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-primary font-heading font-sans">WhatsApp Announcements</h2>
                  <p className="text-xs text-slate-400">Broadcast official messages and alerts directly to student and teacher WhatsApp numbers.</p>
                </div>
                <button
                  onClick={() => { resetBroadcastForm(); setIsBroadcastModalOpen(true); }}
                  className="px-5 py-3 text-sm font-bold text-white bg-primary hover:bg-primary-light shadow-md hover:shadow-lg rounded-xl flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <Plus className="w-5 h-5" /> Send New Broadcast
                </button>
              </div>

              {/* Broadcasts List */}
              <div className="space-y-4">
                <h3 className="text-md font-bold text-primary font-heading relative pl-3.5">
                  Broadcast Logs History
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-3 bg-secondary rounded-full" />
                </h3>

                {loading ? (
                  <div className="flex justify-center items-center py-20 bg-white rounded-2xl border border-slate-100 shadow-premium">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                ) : broadcasts.length === 0 ? (
                  <div className="text-slate-400 py-20 text-center text-sm font-medium border border-dashed border-slate-200 rounded-2xl bg-white">
                    No announcement broadcasts sent yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {broadcasts.map((b) => {
                      const imageSrc = b.imageUrl && (b.imageUrl.startsWith('http') ? b.imageUrl : `${API_BASE_URL}${b.imageUrl}`);
                      return (
                        <div
                          key={b._id}
                          className="bg-white rounded-2xl p-6 border border-slate-100 shadow-premium hover:shadow-premiumHover hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
                        >
                          <div className="space-y-4">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h4 className="text-base font-extrabold text-primary font-heading leading-tight">{b.title}</h4>
                                <span className="text-[10px] text-slate-400 font-semibold mt-1 block">
                                  Sent on: {new Date(b.sentAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                                </span>
                              </div>
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0">
                                WhatsApp
                              </span>
                            </div>

                            {imageSrc && (
                              <div className="w-full h-40 rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
                                <img src={imageSrc} alt="Broadcast Attachment" className="w-full h-full object-cover animate-fade-in" />
                              </div>
                            )}

                            <p className="text-slate-600 text-xs leading-relaxed font-medium whitespace-pre-wrap">
                              {b.description}
                            </p>

                            {/* Target Badges */}
                            <div className="space-y-2 pt-2 border-t border-slate-50">
                              <div className="flex flex-wrap gap-1.5 items-center">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Targets:</span>
                                {b.targets.classes?.length > 0 && (
                                  <span className="bg-primary/5 text-primary px-2 py-0.5 rounded text-[9px] font-extrabold border border-primary/10">
                                    {b.targets.classes.length} Classes
                                  </span>
                                )}
                                {b.targets.teachers?.length > 0 && (
                                  <span className="bg-secondary/10 text-secondary px-2 py-0.5 rounded text-[9px] font-extrabold border border-secondary/10">
                                    {b.targets.teachers.length} Teachers
                                  </span>
                                )}
                                {b.targets.enquiries?.length > 0 && (
                                  <span className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded text-[9px] font-extrabold border border-amber-100">
                                    {b.targets.enquiries.length} Enquiries
                                  </span>
                                )}
                                {(!b.targets.classes?.length && !b.targets.teachers?.length && !b.targets.enquiries?.length) && (
                                  <span className="text-slate-400 italic text-[10px]">None</span>
                                )}
                              </div>
                              
                              <div className="text-[10px] text-slate-400 font-semibold line-clamp-1">
                                {[
                                  ...(b.targets.classes || []),
                                  ...(b.targets.teachers || []).map(tid => {
                                    const tObj = teachers.find(t => t._id === tid);
                                    return tObj ? tObj.name : tid;
                                  }),
                                  ...(b.targets.enquiries || []).map(eid => {
                                    const eObj = enquiryList.find(e => e._id === eid);
                                    return eObj ? `${eObj.studentName} (Enquiry)` : eid;
                                  })
                                ].join(', ')}
                              </div>
                            </div>
                          </div>

                          <div className="pt-4 mt-4 border-t border-slate-50 flex items-center justify-between text-[11px] font-bold">
                            <span className="text-slate-400 font-medium">Recipients Total: <strong className="text-slate-700 font-bold">{b.stats?.totalCount || 0}</strong></span>
                            <div className="flex gap-3 text-[10px]">
                              <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-extrabold">✓ {b.stats?.successCount || 0} Success</span>
                              {b.stats?.failedCount > 0 && (
                                <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded font-extrabold">✗ {b.stats?.failedCount} Failed</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'enquiry' && (
            <div className="space-y-8 animate-fadeIn text-left">
              {/* Heading */}
              <div className="text-left space-y-1">
                <h2 className="text-2xl font-extrabold text-primary font-heading font-sans">Admission Enquiries</h2>
                <p className="text-xs text-slate-400">View and manage enquiries submitted from your website's contact form.</p>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : enquiryList.length === 0 ? (
                <div className="text-slate-450 py-24 text-center text-sm font-semibold border border-dashed border-slate-200 bg-white rounded-3xl flex flex-col items-center justify-center gap-3">
                  <ClipboardList className="w-12 h-12 text-slate-300" />
                  <p>No enquiries found in the registry.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                  {enquiryList.map((enquiry) => (
                    <div
                      key={enquiry._id}
                      className="bg-white border border-slate-100 rounded-2xl p-6 shadow-premium hover:shadow-premiumHover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-3">
                          <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shrink-0">
                            New Enquiry
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold font-stats">
                            {new Date(enquiry.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-base font-extrabold text-primary font-heading line-clamp-1">
                            {enquiry.title}
                          </h4>
                          <p className="text-slate-500 text-xs leading-relaxed min-h-12 whitespace-pre-line">
                            {enquiry.description}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-slate-50 space-y-1.5 text-xs text-slate-650">
                          <div className="flex justify-between">
                            <span className="font-semibold text-slate-400">Student Name:</span>
                            <span className="font-bold text-slate-700">{enquiry.studentName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-slate-400">Father's Name:</span>
                            <span className="font-bold text-slate-700">{enquiry.fatherName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-slate-400">Mobile Number:</span>
                            <a href={`tel:${enquiry.mobileNumber}`} className="font-bold text-secondary hover:underline">
                              {enquiry.mobileNumber}
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-slate-50 pt-4 mt-5 flex justify-end">
                        <button
                          onClick={() => handleDeleteEnquiry(enquiry)}
                          className="bg-rose-50 hover:bg-rose-100 text-danger px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ========================================================== */}
      {/* ==================== STUDENT MODAL FORM ================== */}
      {/* ========================================================== */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 transform scale-100 transition-all duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 bg-slate-50 border-b border-slate-100">
              <h3 className="text-lg font-bold text-primary font-heading">
                {editingStudent ? 'Edit Student Details' : 'Register New Student'}
              </h3>
              <button
                onClick={() => { setIsStudentModalOpen(false); setEditingStudent(null); }}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleRegisterStudent} className="p-6 space-y-6 text-left text-xs max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wider block">Student Name *</label>
                  <input
                    type="text"
                    required
                    value={studentForm.name}
                    onChange={(e) => setStudentForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white text-slate-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wider block">Father's Name *</label>
                  <input
                    type="text"
                    required
                    value={studentForm.fatherName}
                    onChange={(e) => setStudentForm((prev) => ({ ...prev, fatherName: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white text-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wider block">Class *</label>
                  <select
                    value={studentForm.class}
                    onChange={(e) => {
                      if (editingStudent) {
                        handleEditStudentClassChange(e.target.value, setStudentForm);
                      } else {
                        handleStudentClassChange(e.target.value);
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-semibold text-slate-600 focus:bg-white"
                  >
                    {classesOptions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wider block">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={studentForm.phone}
                    onChange={(e) => setStudentForm((prev) => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white text-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wider block">Goodies Distributed</label>
                  <select
                    value={studentForm.goodiesStatus}
                    onChange={(e) => setStudentForm((prev) => ({ ...prev, goodiesStatus: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-semibold text-slate-600 focus:bg-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Bag & Books">Bag & Books</option>
                    <option value="T-Shirt Only">T-Shirt Only</option>
                    <option value="All Distributed">All Distributed</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wider block">Discount (₹)</label>
                  <input
                    type="number"
                    value={studentForm.discount}
                    onChange={(e) => setStudentForm((prev) => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white text-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wider block">Total Fees (₹) [Auto-Filled]</label>
                  <input
                    type="number"
                    required
                    value={studentForm.totalFees}
                    onChange={(e) => setStudentForm((prev) => ({ ...prev, totalFees: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white font-bold text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wider block">Paid Fees (₹)</label>
                  <input
                    type="number"
                    value={studentForm.paidFees}
                    onChange={(e) => setStudentForm((prev) => ({ ...prev, paidFees: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white text-slate-700 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wider block">Goodies Total Fee (₹)</label>
                  <input
                    type="number"
                    value={studentForm.goodiesTotalFee}
                    onChange={(e) => setStudentForm((prev) => ({ ...prev, goodiesTotalFee: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white text-slate-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wider block">Goodies Paid Fee (₹)</label>
                  <input
                    type="number"
                    value={studentForm.goodiesPaidFee}
                    onChange={(e) => setStudentForm((prev) => ({ ...prev, goodiesPaidFee: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white text-slate-700"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase tracking-wider block">Address</label>
                <textarea
                  value={studentForm.address}
                  onChange={(e) => setStudentForm((prev) => ({ ...prev, address: e.target.value }))}
                  rows="3"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white text-slate-700"
                />
              </div>

              {/* Installments Management Section */}
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <h4 className="text-sm font-extrabold text-primary font-heading relative pl-3 text-left">
                  Installments / Fee Payment History
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3 bg-secondary rounded-full" />
                </h4>
                
                {/* Add Installment Form */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end text-xs">
                  <div className="space-y-1 text-left">
                    <label className="font-bold text-slate-500 uppercase tracking-wider block">Date</label>
                    <input
                      type="date"
                      id="inst-date"
                      defaultValue={new Date().toISOString().split('T')[0]}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg outline-none text-slate-700 font-medium"
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="font-bold text-slate-500 uppercase tracking-wider block">Amount (₹)</label>
                    <input
                      type="number"
                      id="inst-amount"
                      placeholder="Amount"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg outline-none text-slate-700 font-bold"
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="font-bold text-slate-500 uppercase tracking-wider block">Mode</label>
                    <select
                      id="inst-method"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg outline-none text-slate-600 font-bold"
                    >
                      <option value="Cash">Cash</option>
                      <option value="Online">Online</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const dateVal = document.getElementById('inst-date').value;
                      const amtVal = parseFloat(document.getElementById('inst-amount').value);
                      const methodVal = document.getElementById('inst-method').value;
                      
                      if (isNaN(amtVal) || amtVal <= 0) {
                        showToast('Please enter a valid installment amount', 'error');
                        return;
                      }
                      
                      const newInst = {
                        date: dateVal || new Date().toISOString().split('T')[0],
                        amount: amtVal,
                        method: methodVal,
                        remarks: 'Installment'
                      };
                      
                      setStudentForm((prev) => {
                        const updatedInsts = [...(prev.installments || []), newInst];
                        const sumPaid = updatedInsts.reduce((acc, curr) => acc + curr.amount, 0);
                        return {
                          ...prev,
                          installments: updatedInsts,
                          paidFees: sumPaid
                        };
                      });
                      
                      document.getElementById('inst-amount').value = '';
                    }}
                    className="px-4 py-2 bg-secondary text-white font-semibold rounded-lg hover:bg-secondary-dark transition-all cursor-pointer text-center text-xs"
                  >
                    Add Payment
                  </button>
                </div>

                {/* Installments Table */}
                <div className="overflow-x-auto border border-slate-100 rounded-xl">
                  <table className="w-full text-xs font-medium text-left">
                    <thead>
                      <tr className="bg-slate-50 text-slate-550 text-[10px] uppercase tracking-wider border-b border-slate-100">
                        <th className="p-2 text-center w-10">S. No.</th>
                        <th className="p-2">Date</th>
                        <th className="p-2">Amount (₹)</th>
                        <th className="p-2">Mode</th>
                        <th className="p-2 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-55">
                      {(!studentForm.installments || studentForm.installments.length === 0) ? (
                        <tr>
                          <td colSpan="5" className="p-3 text-center text-slate-400 italic">No installments added yet.</td>
                        </tr>
                      ) : (
                        studentForm.installments.map((inst, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="p-2 text-center text-slate-450">{idx + 1}</td>
                            <td className="p-2">{new Date(inst.date).toLocaleDateString('en-IN')}</td>
                            <td className="p-2 font-bold font-stats text-slate-700">₹{inst.amount.toLocaleString()}</td>
                            <td className="p-2">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                inst.method === 'Cash' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                inst.method === 'Online' ? 'bg-sky-50 text-sky-700 border border-sky-100' :
                                'bg-slate-100 text-slate-650'
                              }`}>
                                {inst.method}
                              </span>
                            </td>
                            <td className="p-2 text-center">
                              <button
                                type="button"
                                onClick={() => {
                                  setStudentForm((prev) => {
                                    const updatedInsts = prev.installments.filter((_, i) => i !== idx);
                                    const sumPaid = updatedInsts.reduce((acc, curr) => acc + curr.amount, 0);
                                    return {
                                      ...prev,
                                      installments: updatedInsts,
                                      paidFees: sumPaid
                                    };
                                  });
                                }}
                                className="text-danger hover:text-rose-700 font-bold hover:underline cursor-pointer"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setIsStudentModalOpen(false); setEditingStudent(null); }}
                  className="px-4 py-2 text-slate-500 hover:bg-slate-50 rounded-lg border border-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 text-white bg-primary hover:bg-primary-light rounded-lg shadow font-semibold cursor-pointer"
                >
                  {editingStudent ? 'Save Details' : 'Register Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* ==================== TEACHER MODAL FORM ================== */}
      {/* ========================================================== */}
      {isTeacherModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 transform scale-100 transition-all duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 bg-slate-50 border-b border-slate-100">
              <h3 className="text-lg font-bold text-primary font-heading">
                {editingTeacher ? 'Edit Faculty Details' : 'Register New Teacher'}
              </h3>
              <button
                onClick={() => { setIsTeacherModalOpen(false); setEditingTeacher(null); }}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleRegisterTeacher} className="p-6 space-y-6 text-left text-xs max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wider block">Teacher Name *</label>
                  <input
                    type="text"
                    required
                    value={teacherForm.name}
                    onChange={(e) => setTeacherForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white text-slate-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wider block">Father's Name *</label>
                  <input
                    type="text"
                    required
                    value={teacherForm.fatherName}
                    onChange={(e) => setTeacherForm((prev) => ({ ...prev, fatherName: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white text-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wider block">Subject *</label>
                  <input
                    type="text"
                    required
                    value={teacherForm.subject}
                    onChange={(e) => setTeacherForm((prev) => ({ ...prev, subject: e.target.value }))}
                    placeholder="e.g. Rajasthan GK, Mathematics"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white text-slate-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wider block">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={teacherForm.phone}
                    onChange={(e) => setTeacherForm((prev) => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white text-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wider block">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={teacherForm.email}
                    onChange={(e) => setTeacherForm((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white text-slate-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wider block">Joining Date *</label>
                  <input
                    type="date"
                    required
                    value={teacherForm.joiningDate}
                    onChange={(e) => setTeacherForm((prev) => ({ ...prev, joiningDate: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white text-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wider block">Salary (₹) *</label>
                  <input
                    type="number"
                    required
                    value={teacherForm.salary}
                    onChange={(e) => setTeacherForm((prev) => ({ ...prev, salary: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white text-slate-700 font-bold"
                  />
                </div>
              </div>

              {/* Class Assigned Multi Select checkboxes */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wider block">Assigned Classes *</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-4 border border-slate-100 bg-slate-50 rounded-xl max-h-[150px] overflow-y-auto">
                  {classesOptions.map((c) => {
                    const isChecked = teacherForm.classesAssigned.includes(c);
                    return (
                      <label key={c} className="flex items-center gap-2 font-semibold text-slate-600 select-none cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setTeacherForm((prev) => ({
                                ...prev,
                                classesAssigned: [...prev.classesAssigned, c]
                              }));
                            } else {
                              setTeacherForm((prev) => ({
                                ...prev,
                                classesAssigned: prev.classesAssigned.filter((item) => item !== c)
                              }));
                            }
                          }}
                          className="rounded text-primary border-slate-350 focus:ring-primary w-4 h-4 cursor-pointer"
                        />
                        <span>{c}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase tracking-wider block">Address</label>
                <textarea
                  value={teacherForm.address}
                  onChange={(e) => setTeacherForm((prev) => ({ ...prev, address: e.target.value }))}
                  rows="3"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white text-slate-700"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setIsTeacherModalOpen(false); setEditingTeacher(null); }}
                  className="px-4 py-2 text-slate-500 hover:bg-slate-50 rounded-lg border border-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 text-white bg-primary hover:bg-primary-light rounded-lg shadow font-semibold cursor-pointer"
                >
                  {editingTeacher ? 'Save Details' : 'Register Teacher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* ==================== EXPENSE MODAL FORM ================== */}
      {/* ========================================================== */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform scale-100 transition-all duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 bg-slate-50 border-b border-slate-100">
              <h3 className="text-lg font-bold text-primary font-heading">
                Log New Expense
              </h3>
              <button
                onClick={() => setIsExpenseModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveExpense} className="p-6 space-y-4 text-left text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase tracking-wider block">Expense Title *</label>
                <input
                  type="text"
                  required
                  value={expenseForm.title}
                  onChange={(e) => setExpenseForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white text-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wider block">Category *</label>
                  <select
                    value={expenseForm.category}
                    onChange={(e) => setExpenseForm((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-semibold text-slate-600 focus:bg-white"
                  >
                    <option value="Rent">Rent</option>
                    <option value="Salary">Salary</option>
                    <option value="Electricity">Electricity</option>
                    <option value="Stationary">Stationary</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wider block">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm((prev) => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white text-slate-700 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase tracking-wider block">Date *</label>
                <input
                  type="date"
                  required
                  value={expenseForm.date}
                  onChange={(e) => setExpenseForm((prev) => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white text-slate-700"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase tracking-wider block">Description</label>
                <textarea
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows="3"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white text-slate-700"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-4 py-2 text-slate-500 hover:bg-slate-50 rounded-lg border border-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 text-white bg-primary hover:bg-primary-light rounded-lg shadow font-semibold cursor-pointer"
                >
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* ==================== ACHIEVEMENT MODAL FORM ============== */}
      {/* ========================================================== */}
      {isAchievementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform scale-100 transition-all duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 bg-slate-50 border-b border-slate-100">
              <h3 className="text-lg font-bold text-primary font-heading">
                Publish Achievement Card
              </h3>
              <button
                onClick={() => setIsAchievementModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handlePublishAchievement} className="p-6 space-y-4 text-left text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase tracking-wider block">Student Photo *</label>
                <input
                  type="file"
                  required
                  accept="image/*"
                  onChange={(e) => setAchievementForm((prev) => ({ ...prev, photo: e.target.files[0] }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white text-slate-700"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase tracking-wider block">Student Name *</label>
                <input
                  type="text"
                  required
                  value={achievementForm.studentName}
                  onChange={(e) => setAchievementForm((prev) => ({ ...prev, studentName: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white text-slate-700"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase tracking-wider block">Father's Name *</label>
                <input
                  type="text"
                  required
                  value={achievementForm.fatherName}
                  onChange={(e) => setAchievementForm((prev) => ({ ...prev, fatherName: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white text-slate-700"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase tracking-wider block">Class *</label>
                <select
                  value={achievementForm.class}
                  onChange={(e) => setAchievementForm((prev) => ({ ...prev, class: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-semibold text-slate-600 focus:bg-white"
                >
                  {classesOptions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase tracking-wider block">Description / Achievement Detail *</label>
                <textarea
                  required
                  value={achievementForm.description}
                  onChange={(e) => setAchievementForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="e.g. Scored 98.4% in CBSE Class 12 Boards"
                  rows="3"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white text-slate-700"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAchievementModalOpen(false)}
                  className="px-4 py-2 text-slate-500 hover:bg-slate-50 rounded-lg border border-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 text-white bg-primary hover:bg-primary-light rounded-lg shadow font-semibold cursor-pointer"
                >
                  Publish Achievement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* ==================== GALLERY MODAL FORM ================== */}
      {/* ========================================================== */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform scale-100 transition-all duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 bg-slate-50 border-b border-slate-100">
              <h3 className="text-lg font-bold text-primary font-heading">
                Upload Gallery Photos
              </h3>
              <button
                onClick={() => setIsGalleryModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUploadGallery} className="p-6 space-y-4 text-left text-xs">
              <div className="space-y-2">
                <label className="font-bold text-slate-500 uppercase tracking-wider block">Select Images * (Multiple Allowed)</label>
                <input
                  type="file"
                  required
                  multiple
                  accept="image/*"
                  onChange={(e) => setGalleryFiles(e.target.files)}
                  className="w-full px-3 py-4 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white text-slate-700"
                />
                <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                  Selected Files: <strong className="text-slate-700 font-bold">{galleryFiles.length} files</strong>
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsGalleryModalOpen(false)}
                  className="px-4 py-2 text-slate-500 hover:bg-slate-50 rounded-lg border border-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 text-white bg-primary hover:bg-primary-light rounded-lg shadow font-semibold cursor-pointer"
                >
                  Upload Images
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* ==================== BROADCAST MODAL FORM ================ */}
      {/* ========================================================== */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform scale-100 transition-all duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 bg-slate-50 border-b border-slate-100">
              <h3 className="text-lg font-bold text-primary font-heading">
                Send WhatsApp Announcement
              </h3>
              <button
                onClick={() => { setIsBroadcastModalOpen(false); resetBroadcastForm(); }}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSendBroadcast} className="p-6 space-y-5 text-left text-xs max-h-[75vh] overflow-y-auto">
              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase tracking-wider block">Message Title * (Compulsory)</label>
                <input
                  type="text"
                  required
                  value={broadcastForm.title}
                  onChange={(e) => setBroadcastForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Special Holiday Announcement"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white text-slate-700"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase tracking-wider block">Message Description * (Compulsory)</label>
                <textarea
                  required
                  value={broadcastForm.description}
                  onChange={(e) => setBroadcastForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Type WhatsApp message contents here..."
                  rows="4"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white text-slate-700"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase tracking-wider block">Attach Image (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBroadcastForm((prev) => ({ ...prev, image: e.target.files[0] }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white text-slate-700"
                />
              </div>

              {/* Target Classes Select */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-500 uppercase tracking-wider block">Select Classes (Students)</label>
                  <button
                    type="button"
                    onClick={() => {
                      const allSelected = broadcastForm.classes.length === classesOptions.length;
                      setBroadcastForm((prev) => ({
                        ...prev,
                        classes: allSelected ? [] : [...classesOptions]
                      }));
                    }}
                    className="text-[10px] font-extrabold text-primary hover:underline cursor-pointer"
                  >
                    {broadcastForm.classes.length === classesOptions.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 border border-slate-100 bg-slate-50 rounded-xl max-h-[140px] overflow-y-auto">
                  {classesOptions.map((c) => {
                    const isChecked = broadcastForm.classes.includes(c);
                    return (
                      <label key={c} className="flex items-center gap-2 font-semibold text-slate-600 select-none cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setBroadcastForm((prev) => ({
                                ...prev,
                                classes: [...prev.classes, c]
                              }));
                            } else {
                              setBroadcastForm((prev) => ({
                                ...prev,
                                classes: prev.classes.filter((item) => item !== c)
                              }));
                            }
                          }}
                          className="rounded text-primary border-slate-350 focus:ring-primary w-4 h-4 cursor-pointer"
                        />
                        <span>{c}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Target Teachers Select */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-500 uppercase tracking-wider block">Select Teachers</label>
                  <button
                    type="button"
                    onClick={() => {
                      const allSelected = broadcastForm.teachers.length === teachers.length;
                      setBroadcastForm((prev) => ({
                        ...prev,
                        teachers: allSelected ? [] : teachers.map(t => t._id)
                      }));
                    }}
                    className="text-[10px] font-extrabold text-primary hover:underline cursor-pointer"
                  >
                    {broadcastForm.teachers.length === teachers.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 border border-slate-100 bg-slate-50 rounded-xl max-h-[140px] overflow-y-auto">
                  {teachers.map((t) => {
                    const isChecked = broadcastForm.teachers.includes(t._id);
                    return (
                      <label key={t._id} className="flex items-center gap-2 font-semibold text-slate-600 select-none cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setBroadcastForm((prev) => ({
                                ...prev,
                                teachers: [...prev.teachers, t._id]
                              }));
                            } else {
                              setBroadcastForm((prev) => ({
                                ...prev,
                                teachers: prev.teachers.filter((id) => id !== t._id)
                              }));
                            }
                          }}
                          className="rounded text-primary border-slate-350 focus:ring-primary w-4 h-4 cursor-pointer"
                        />
                        <span>{t.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Target Enquiries Select */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-500 uppercase tracking-wider block">Select Enquiry Candidates</label>
                  <button
                    type="button"
                    onClick={() => {
                      const allSelected = broadcastForm.enquiries.length === enquiryList.length;
                      setBroadcastForm((prev) => ({
                        ...prev,
                        enquiries: allSelected ? [] : enquiryList.map(e => e._id)
                      }));
                    }}
                    className="text-[10px] font-extrabold text-primary hover:underline cursor-pointer"
                  >
                    {broadcastForm.enquiries.length === enquiryList.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                {enquiryList.length === 0 ? (
                  <div className="text-slate-400 p-3 text-center text-[11px] border border-slate-100 bg-slate-50 rounded-xl">
                    No admission enquiries available to select.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 border border-slate-100 bg-slate-50 rounded-xl max-h-[140px] overflow-y-auto">
                    {enquiryList.map((e) => {
                      const isChecked = broadcastForm.enquiries.includes(e._id);
                      return (
                        <label key={e._id} className="flex items-center gap-2 font-semibold text-slate-600 select-none cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(chk) => {
                              if (chk.target.checked) {
                                setBroadcastForm((prev) => ({
                                  ...prev,
                                  enquiries: [...prev.enquiries, e._id]
                                }));
                              } else {
                                setBroadcastForm((prev) => ({
                                  ...prev,
                                  enquiries: prev.enquiries.filter((id) => id !== e._id)
                                }));
                              }
                            }}
                            className="rounded text-primary border-slate-350 focus:ring-primary w-4 h-4 cursor-pointer"
                          />
                          <span className="truncate" title={`${e.studentName} (${e.title})`}>
                            {e.studentName}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setIsBroadcastModalOpen(false); resetBroadcastForm(); }}
                  className="px-4 py-2 text-slate-500 hover:bg-slate-50 rounded-lg border border-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 text-white bg-primary hover:bg-primary-light rounded-lg shadow font-semibold cursor-pointer flex items-center gap-1.5"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Send Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal component */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title={deleteModal.title}
        message={deleteModal.message}
        onConfirm={deleteModal.onConfirm}
        onCancel={closeDeleteModal}
      />

      {/* Receipt Modal Preview */}
      {isReceiptModalOpen && selectedReceiptStudent && (() => {
        const student = selectedReceiptStudent;
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
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <h3 className="text-sm font-extrabold text-primary font-heading uppercase tracking-wider">Fee Receipt Preview</h3>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handlePrintReceipt(student)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-light rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Print Receipt
                  </button>
                  <button
                    onClick={() => { setIsReceiptModalOpen(false); setSelectedReceiptStudent(null); }}
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
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <img src={logo} alt="Logo" className="w-16 h-16 object-contain" />
                      <div>
                        <h1 className="text-2xl font-black tracking-tight" style={{ color: '#1A3C5E' }}>विद्यार्थी क्लासेज</h1>
                        <p className="text-[10px] font-extrabold tracking-widest text-slate-500 uppercase mt-0.5">— नींव से निर्माण तक —</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1">KOTA, RAJASTHAN</p>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
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
                        <tr className="border-b border-slate-200 hover:bg-slate-55/50">
                          <td className="p-2 border-r border-slate-200 text-center">1.</td>
                          <td className="p-2 border-r border-slate-200 font-bold">Tuition Fee</td>
                          <td className="p-2 border-r border-slate-200 text-right">₹{student.totalFees.toLocaleString()}</td>
                          <td className="p-2 border-r border-slate-200 text-right">₹{student.discount.toLocaleString()}</td>
                          <td className="p-2 border-r border-slate-200 text-right">₹{netTuition.toLocaleString()}</td>
                          <td className="p-2 border-r border-slate-200 text-right">₹{student.paidFees.toLocaleString()}</td>
                          <td className="p-2 text-right">₹{pendingTuition.toLocaleString()}</td>
                        </tr>
                        <tr className="border-b border-slate-200 hover:bg-slate-55/50">
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
                          <tr className="border-b border-slate-100"><td className="font-bold text-slate-500 py-1">Total Fee (₹)</td><td className="text-right font-stats">₹{totalOriginal.toLocaleString()}</td></tr>
                          <tr className="border-b border-slate-100"><td className="font-bold text-slate-500 py-1">Discount (₹)</td><td className="text-right font-stats">₹{student.discount.toLocaleString()}</td></tr>
                          <tr className="border-b border-slate-100 bg-blue-50/50"><td className="font-bold text-slate-700 py-1">Net Fee (After Discount) (₹)</td><td className="text-right font-bold text-primary font-stats">₹{totalNet.toLocaleString()}</td></tr>
                          <tr className="border-b border-slate-100"><td className="font-bold text-slate-500 py-1">Paid Amount (₹)</td><td className="text-right text-emerald-600 font-bold font-stats">₹{totalPaid.toLocaleString()}</td></tr>
                          <tr className="border-b border-slate-100 bg-rose-50/30"><td className="font-bold text-slate-700 py-1">Pending Fee (₹)</td><td className="text-right text-danger font-bold font-stats">₹{totalPending.toLocaleString()}</td></tr>
                          <tr><td className="font-bold text-slate-500 py-1">Due Date (if any)</td><td className="text-right text-slate-500 font-stats">N/A</td></tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Previous Fee Details */}
                    <div className="border border-slate-200 rounded-2xl p-4 overflow-y-auto max-h-[220px]">
                      <h3 className="text-[10px] font-black text-white px-3 py-1 rounded-md mb-3 uppercase tracking-wider" style={{ backgroundColor: '#1A3C5E' }}>Previous Fee Details</h3>
                      <table className="w-full text-[10px] border border-slate-200 font-medium">
                        <thead>
                          <tr className="bg-slate-100 text-slate-600">
                            <th className="p-1 border-r border-b border-slate-200 text-center w-8">S.No.</th>
                            <th className="p-1 border-r border-b border-slate-200 text-center">Payment Date</th>
                            <th className="p-1 border-r border-b border-slate-200 text-center">Paid (₹)</th>
                            <th className="p-1 border-r border-b border-slate-200 text-center">Mode</th>
                            <th className="p-1 border-b border-slate-200 text-center">Remarks</th>
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

                  {/* Receipt Footer */}
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
                          <div className="border-t border-slate-450 w-36 ml-auto mb-0.5"></div>
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

      {/* Delete Confirmation Modal component */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title={deleteModal.title}
        message={deleteModal.message}
        onConfirm={deleteModal.onConfirm}
        onCancel={closeDeleteModal}
      />


    </div>
  );
};

export default AdminDashboard;
