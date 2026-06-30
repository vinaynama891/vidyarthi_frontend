import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, API_BASE_URL } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import ConfirmationModal from '../../components/ConfirmationModal';
import {
  GraduationCap,
  BookOpen,
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
  ArrowLeft,
  Menu,
  X,
  Plus,
  Video,
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
  HelpCircle,
  Bell,
  Unlock,
  Gift,
  Lock
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
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [isStudyMaterialModalOpen, setIsStudyMaterialModalOpen] = useState(false);
  const [studyMaterialTitle, setStudyMaterialTitle] = useState('');
  const [studyMaterialDescription, setStudyMaterialDescription] = useState('');
  const [studyMaterialClass, setStudyMaterialClass] = useState('');
  const [studyMaterialFile, setStudyMaterialFile] = useState(null);
  const [studyMaterialNotesType, setStudyMaterialNotesType] = useState('Free');
  const [studyMaterialPrice, setStudyMaterialPrice] = useState('');
  const [isUploadingStudyMaterial, setIsUploadingStudyMaterial] = useState(false);
  const [selectedClassView, setSelectedClassView] = useState(null);
  const [attendanceSubTab, setAttendanceSubTab] = useState('students');
  const [selectedClassAttendance, setSelectedClassAttendance] = useState(null);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceRegistry, setAttendanceRegistry] = useState({});
  const [feeRecords, setFeeRecords] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [broadcasts, setBroadcasts] = useState([]);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [isAnnouncementMode, setIsAnnouncementMode] = useState(false);

  // --- ONLINE TESTS STATE ---
  const [onlineTests, setOnlineTests] = useState([]);
  const [isOnlineTestModalOpen, setIsOnlineTestModalOpen] = useState(false);
  const [onlineTestForm, setOnlineTestForm] = useState({
    title: '',
    subject: '',
    classes: [],
    timeLimit: 15,
    questions: [
      { questionText: '', options: ['', '', '', ''], correctOption: 0, marks: 1 }
    ],
    status: 'draft'
  });
  const [isTestAttemptsModalOpen, setIsTestAttemptsModalOpen] = useState(false);
  const [testAttempts, setTestAttempts] = useState([]);
  const [selectedTestForAttempts, setSelectedTestForAttempts] = useState(null);

  // --- DEMO CLASSES STATE ---
  const [demoClasses, setDemoClasses] = useState([]);
  const [isDemoClassModalOpen, setIsDemoClassModalOpen] = useState(false);
  const [demoClassForm, setDemoClassForm] = useState({
    title: '',
    videoUrl: '',
    description: ''
  });

  // --- PROMO OFFERS STATE ---
  const [offers, setOffers] = useState([]);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [offerTitle, setOfferTitle] = useState('');
  const [offerFile, setOfferFile] = useState(null);
  const [isUploadingOffer, setIsUploadingOffer] = useState(false);

  // --- CHANGE PASSWORD STATE ---
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // --- CUSTOMIZE COURSE CMS STATE ---
  const [selectedCourseName, setSelectedCourseName] = useState('Class 1 to 8');
  const [coursePage, setCoursePage] = useState(null);
  const [coursePageLoading, setCoursePageLoading] = useState(false);
  const [isAddBlockModalOpen, setIsAddBlockModalOpen] = useState(false);
  const [addBlockType, setAddBlockType] = useState('paragraph'); // 'paragraph', 'image', 'card'
  const [addBlockTitle, setAddBlockTitle] = useState('');
  const [addBlockContent, setAddBlockContent] = useState('');
  const [addBlockFile, setAddBlockFile] = useState(null);
  const [isAddingBlock, setIsAddingBlock] = useState(false);

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
  const [salaryMonth, setSalaryMonth] = useState((new Date().getMonth() + 1).toString());
  const [salaryYear, setSalaryYear] = useState(new Date().getFullYear().toString());
  const [feeRecordSearch, setFeeRecordSearch] = useState('');
  const [expenseMonth, setExpenseMonth] = useState((new Date().getMonth() + 1).toString());
  const [expenseYear, setExpenseYear] = useState(new Date().getFullYear().toString());
  const [testClassFilter, setTestClassFilter] = useState('');

  // Modals state
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isQuickAccessModalOpen, setIsQuickAccessModalOpen] = useState(false);
  const [quickAccessForm, setQuickAccessForm] = useState({
    name: '',
    phone: '',
    class: 'Class 10',
    unlockedNotes: []
  });
  const [generatedCredentials, setGeneratedCredentials] = useState(null);
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
  const [editingFeeEnglish, setEditingFeeEnglish] = useState('');
  const [editingFeeHindi, setEditingFeeHindi] = useState('');

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
    'Class 11 Arts', 'Class 11 Science Bio', 'Class 11 Science Maths',
    'Class 12 Arts', 'Class 12 Science Bio', 'Class 12 Science Maths',
    'BSTC', 'Rajasthan GK', 'Hindi Literature',
    '5TH JNV', '9TH JNV', 'LDC', 'CET', 'VDO'
  ];

  // --- STUDENT FORM STATE ---
  const [studentForm, setStudentForm] = useState({
    name: '',
    fatherName: '',
    class: 'Class 10',
    medium: 'English',
    phone: '',
    goodiesStatus: 'Pending',
    discount: 0,
    totalFees: 0,
    paidFees: 0,
    goodiesTotalFee: 0,
    goodiesPaidFee: 0,
    address: '',
    studentType: 'Regular',
    unlockedNotes: [],
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
    class: 'Class 10',
    description: '',
    photo: null
  });

  // --- GALLERY FORM STATE ---
  const [galleryFiles, setGalleryFiles] = useState([]);

  // --- ENQUIRY LIST STATE ---
  const [enquiryList, setEnquiryList] = useState([]);
  const [enquiryNotes, setEnquiryNotes] = useState({}); // { [enquiry._id]: string }
  const [savingNoteId, setSavingNoteId] = useState(null);



  // Fetch stats and relevant tab data on change
  useEffect(() => {
    fetchStats();
    if (activeTab === 'dashboard') fetchStats();
    else if (activeTab === 'student') {
      fetchStudents();
      fetchStudyMaterials();
    }
    else if (activeTab === 'notes-students') {
      fetchStudents();
      fetchStudyMaterials();
    }
    else if (activeTab === 'teacher') fetchTeachers();
    else if (activeTab === 'fees') {
      fetchFeeStructures();
      fetchFeeRecords();
    } else if (activeTab === 'expenses') fetchExpenses();
    else if (activeTab === 'test-result') fetchTestResults();
    else if (activeTab === 'online-tests') fetchOnlineTests();
    else if (activeTab === 'achievement') fetchAchievements();
    else if (activeTab === 'gallery') fetchGallery();
    else if (activeTab === 'broadcast' || activeTab === 'announcement') {
      fetchBroadcasts();
      fetchTeachers();
      fetchEnquiries();
    } else if (activeTab === 'enquiry') {
      fetchEnquiries();
    } else if (activeTab === 'study-material') {
      fetchStudyMaterials();
    } else if (activeTab === 'attendance') {
      fetchStudents();
      fetchTeachers();
    } else if (activeTab === 'demo-classes') {
      fetchDemoClasses();
    } else if (activeTab === 'offers') {
      fetchOffers();
    } else if (activeTab === 'customize-course') {
      fetchCoursePage(selectedCourseName);
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'customize-course') {
      fetchCoursePage(selectedCourseName);
    }
  }, [selectedCourseName, activeTab]);

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

  // Refetch teachers when search, month, or year changes
  useEffect(() => {
    if (activeTab === 'teacher') {
      fetchTeachers();
    }
  }, [teacherSearch, salaryMonth, salaryYear]);

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

  useEffect(() => {
    if (activeTab === 'attendance') {
      fetchAttendance();
    }
  }, [activeTab, attendanceDate, attendanceSubTab]);

  const fetchAttendance = async () => {
    try {
      const logs = await apiFetch(`/api/attendance?date=${attendanceDate}&userType=${attendanceSubTab}`);
      const newRegistry = { ...attendanceRegistry };
      logs.forEach(log => {
        const id = attendanceSubTab === 'students' ? log.studentId : log.teacherId;
        newRegistry[`${attendanceDate}_${id}`] = log.status;
      });
      setAttendanceRegistry(newRegistry);
    } catch (err) {
      console.warn('Could not fetch attendance records:', err.message);
    }
  };

  const handleSaveStudentAttendance = async () => {
    try {
      const classStudents = students.filter(s => s.class === selectedClassAttendance);
      const records = classStudents.map(s => {
        const key = `${attendanceDate}_${s.studentId}`;
        return {
          studentId: s.studentId,
          status: attendanceRegistry[key] || 'present'
        };
      });

      await apiFetch('/api/attendance/mark', {
        method: 'POST',
        body: JSON.stringify({
          date: attendanceDate,
          userType: 'student',
          records
        })
      });

      showToast(`Attendance for ${selectedClassAttendance} submitted successfully!`, 'success');
      setSelectedClassAttendance(null);
    } catch (err) {
      showToast(err.message || 'Failed to submit student attendance', 'error');
    }
  };

  const handleSaveTeacherAttendance = async () => {
    try {
      const records = teachers.map(t => {
        const key = `${attendanceDate}_${t._id}`;
        let isBeforeJoining = false;
        if (t.joiningDate) {
          const jd = new Date(t.joiningDate);
          const jdStr = `${jd.getFullYear()}-${String(jd.getMonth() + 1).padStart(2, '0')}-${String(jd.getDate()).padStart(2, '0')}`;
          isBeforeJoining = attendanceDate < jdStr;
        }
        return {
          teacherId: t._id,
          status: isBeforeJoining ? 'absent' : (attendanceRegistry[key] || 'present')
        };
      });

      await apiFetch('/api/attendance/mark', {
        method: 'POST',
        body: JSON.stringify({
          date: attendanceDate,
          userType: 'teacher',
          records
        })
      });

      showToast('Teacher attendance roster submitted successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to submit teacher attendance', 'error');
    }
  };

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
      const data = await apiFetch(`/api/teachers?search=${teacherSearch}&month=${salaryMonth}&year=${salaryYear}`);
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
      // Sort classes based on classesOptions index order
      const sortedData = [...data].sort((a, b) => {
        const indexA = classesOptions.indexOf(a.class);
        const indexB = classesOptions.indexOf(b.class);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });
      setFeeStructures(sortedData);
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

  const fetchStudyMaterials = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/api/study-materials');
      setStudyMaterials(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStudyMaterial = async (e) => {
    e.preventDefault();
    if (!studyMaterialTitle || !studyMaterialClass || !studyMaterialFile) {
      showToast('Title, Target Class, and File are required', 'error');
      return;
    }

    setIsUploadingStudyMaterial(true);
    try {
      const formData = new FormData();
      formData.append('title', studyMaterialTitle);
      formData.append('description', studyMaterialDescription);
      formData.append('targetClass', studyMaterialClass);
      formData.append('file', studyMaterialFile);

      const response = await fetch(`${API_BASE_URL}/api/study-materials`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.message || 'Failed to upload study material');
      }

      showToast('Study Material uploaded successfully', 'success');
      setIsStudyMaterialModalOpen(false);
      
      // Reset form
      setStudyMaterialTitle('');
      setStudyMaterialDescription('');
      setStudyMaterialClass('');
      setStudyMaterialFile(null);
      
      fetchStudyMaterials();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsUploadingStudyMaterial(false);
    }
  };

  const handleDeleteStudyMaterial = async (id) => {
    try {
      setLoading(true);
      const res = await apiFetch(`/api/study-materials/${id}`, {
        method: 'DELETE'
      });
      showToast(res.message || 'Study material deleted successfully', 'success');
      fetchStudyMaterials();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return '';
    let match = url.match(/[?&]v=([^&#]*)/);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    match = url.match(/youtu\.be\/([^&#]*)/);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    match = url.match(/youtube\.com\/embed\/([^&#]*)/);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return url;
  };

  const fetchDemoClasses = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/api/demo-classes');
      setDemoClasses(data);
    } catch (err) {
      showToast(err.message || 'Error fetching demo classes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDemoClass = async (e) => {
    e.preventDefault();
    if (!demoClassForm.title || !demoClassForm.videoUrl) {
      showToast('Title and Video URL are required', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await apiFetch('/api/demo-classes', {
        method: 'POST',
        body: JSON.stringify(demoClassForm)
      });
      showToast(res.message || 'Demo class added successfully', 'success');
      setIsDemoClassModalOpen(false);
      setDemoClassForm({ title: '', videoUrl: '', description: '' });
      fetchDemoClasses();
    } catch (err) {
      showToast(err.message || 'Failed to add demo class', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDemoClass = async (id) => {
    try {
      setLoading(true);
      const res = await apiFetch(`/api/demo-classes/${id}`, {
        method: 'DELETE'
      });
      showToast(res.message || 'Demo class deleted successfully', 'success');
      fetchDemoClasses();
    } catch (err) {
      showToast(err.message || 'Failed to delete demo class', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/api/offers');
      setOffers(data);
    } catch (err) {
      showToast(err.message || 'Error fetching promo offers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddOffer = async (e) => {
    e.preventDefault();
    if (!offerFile) {
      showToast('Please select a promo offer image file', 'error');
      return;
    }

    try {
      setIsUploadingOffer(true);
      const formData = new FormData();
      formData.append('title', offerTitle);
      formData.append('offerPhoto', offerFile);

      const response = await fetch(`${API_BASE_URL}/api/offers`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.message || 'Failed to upload offer');
      }

      showToast('Promo Offer uploaded successfully', 'success');
      setIsOfferModalOpen(false);
      setOfferTitle('');
      setOfferFile(null);
      fetchOffers();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsUploadingOffer(false);
    }
  };

  const handleToggleOffer = async (id) => {
    try {
      setLoading(true);
      const res = await apiFetch(`/api/offers/${id}/toggle`, {
        method: 'PUT'
      });
      showToast(res.message || 'Offer status updated', 'success');
      fetchOffers();
    } catch (err) {
      showToast(err.message || 'Failed to update offer status', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOffer = async (id) => {
    try {
      setLoading(true);
      const res = await apiFetch(`/api/offers/${id}`, {
        method: 'DELETE'
      });
      showToast(res.message || 'Offer deleted successfully', 'success');
      fetchOffers();
    } catch (err) {
      showToast(err.message || 'Failed to delete offer', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('All password fields are required', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    try {
      setIsChangingPassword(true);
      const res = await apiFetch('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword })
      });
      showToast(res.message || 'Password changed successfully', 'success');
      setIsChangePasswordModalOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      showToast(err.message || 'Failed to change password', 'error');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const fetchCoursePage = async (courseName) => {
    try {
      setCoursePageLoading(true);
      const data = await apiFetch(`/api/courses/${encodeURIComponent(courseName)}`);
      setCoursePage(data);
    } catch (err) {
      showToast(err.message || 'Failed to fetch course details', 'error');
    } finally {
      setCoursePageLoading(false);
    }
  };

  const handleAddBlockSubmit = async (e) => {
    e.preventDefault();
    if (!addBlockType) {
      showToast('Block type is required', 'error');
      return;
    }

    try {
      setIsAddingBlock(true);
      const formData = new FormData();
      formData.append('type', addBlockType);
      formData.append('title', addBlockTitle);
      formData.append('content', addBlockContent);
      if (addBlockFile) {
        formData.append('blockPhoto', addBlockFile);
      }

      const res = await apiFetch(`/api/courses/${encodeURIComponent(selectedCourseName)}/blocks`, {
        method: 'POST',
        body: formData
      });

      showToast(res.message || 'Content block added successfully', 'success');
      setIsAddBlockModalOpen(false);
      setAddBlockTitle('');
      setAddBlockContent('');
      setAddBlockFile(null);
      fetchCoursePage(selectedCourseName);
    } catch (err) {
      showToast(err.message || 'Failed to add content block', 'error');
    } finally {
      setIsAddingBlock(false);
    }
  };

  const handleDeleteCourseBlock = async (blockId) => {
    if (!window.confirm('Are you sure you want to delete this content block?')) {
      return;
    }

    try {
      setCoursePageLoading(true);
      const res = await apiFetch(`/api/courses/${encodeURIComponent(selectedCourseName)}/blocks/${blockId}`, {
        method: 'DELETE'
      });
      showToast(res.message || 'Content block deleted successfully', 'success');
      fetchCoursePage(selectedCourseName);
    } catch (err) {
      showToast(err.message || 'Failed to delete block', 'error');
    } finally {
      setCoursePageLoading(false);
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
      formData.append('isAnnouncement', isAnnouncementMode ? 'true' : 'false');
      if (broadcastForm.image) {
        formData.append('image', broadcastForm.image);
      }

      const res = await apiFetch('/api/broadcasts', {
        method: 'POST',
        body: formData
      });

      showToast(res.message || (isAnnouncementMode ? 'Announcement posted successfully!' : 'Broadcast sent successfully via WhatsApp!'), 'success');
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
  const handleStudentClassChange = async (className, mediumOverride) => {
    try {
      setStudentForm((prev) => ({ ...prev, class: className }));
      const structure = await apiFetch(`/api/fees/structure/${className}`);
      if (structure) {
        // Determine which fee to use based on medium
        const currentMedium = mediumOverride ?? studentForm.medium ?? 'English';
        const fee = currentMedium === 'Hindi'
          ? (structure.hindiMediumFee || 0)
          : (structure.englishMediumFee || structure.fee || 0);
        setStudentForm((prev) => ({ ...prev, totalFees: fee }));
      }
    } catch (err) {
      console.warn('Could not auto-fill class fee structure:', err.message);
      setStudentForm((prev) => ({ ...prev, totalFees: 0 }));
    }
  };

  // Auto-fill fee when medium changes (in student form)
  const handleStudentMediumChange = async (medium) => {
    setStudentForm((prev) => ({ ...prev, medium }));
    try {
      const structure = await apiFetch(`/api/fees/structure/${studentForm.class}`);
      if (structure) {
        const fee = medium === 'Hindi'
          ? (structure.hindiMediumFee || 0)
          : (structure.englishMediumFee || structure.fee || 0);
        setStudentForm((prev) => ({ ...prev, totalFees: fee }));
      }
    } catch (err) {
      console.warn('Could not auto-fill medium fee:', err.message);
    }
  };

  // Triggered when editing a student and changing class
  const handleEditStudentClassChange = async (className, currentFormSetter, mediumOverride) => {
    try {
      const structure = await apiFetch(`/api/fees/structure/${className}`);
      if (structure) {
        currentFormSetter((prev) => {
          const medium = mediumOverride ?? prev.medium ?? 'English';
          const fee = medium === 'Hindi'
            ? (structure.hindiMediumFee || 0)
            : (structure.englishMediumFee || structure.fee || 0);
          return { ...prev, class: className, totalFees: fee };
        });
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

  // --- QUICK NOTES ACCESS HANDLERS ---
  const resetQuickAccessForm = () => {
    setQuickAccessForm({
      name: '',
      phone: '',
      class: 'Class 10',
      unlockedNotes: []
    });
    setGeneratedCredentials(null);
  };

  const handleGrantQuickAccess = async (e) => {
    e.preventDefault();
    if (!quickAccessForm.name || !quickAccessForm.phone || !quickAccessForm.class) {
      showToast('Name, Phone Number, and Class are required', 'error');
      return;
    }

    try {
      setLoading(true);
      // Use the standard default password 'Vidyarthi@20' for all notes students
      const notesPassword = 'Vidyarthi@20';

      // Create student payload for NotesOnly account
      const payload = {
        name: quickAccessForm.name,
        fatherName: 'N/A', // Set default father's name
        class: quickAccessForm.class,
        phone: quickAccessForm.phone,
        password: notesPassword,
        studentType: 'NotesOnly',
        unlockedNotes: quickAccessForm.unlockedNotes,
        totalFees: 0,
        paidFees: 0,
        goodiesTotalFee: 0,
        goodiesPaidFee: 0,
        address: 'Access granted via Quick Access panel'
      };

      const response = await apiFetch('/api/students/register', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      // Show generated credentials to admin
      setGeneratedCredentials({
        studentId: response.studentId,
        password: notesPassword,
        name: response.name,
        phone: response.phone,
        class: response.class
      });

      showToast('Access credentials generated successfully!', 'success');
      fetchStudents(); // Sync student list
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
      if (!editingFeeEnglish && !editingFeeHindi) return;
      await apiFetch(`/api/fees/structure/${className}`, {
        method: 'PUT',
        body: JSON.stringify({
          englishMediumFee: parseFloat(editingFeeEnglish) || 0,
          hindiMediumFee: parseFloat(editingFeeHindi) || 0
        })
      });
      showToast(`Fee for ${className} updated successfully`, 'success');
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
      medium: 'English',
      phone: '',
      goodiesStatus: 'Pending',
      discount: 0,
      totalFees: 0,
      paidFees: 0,
      goodiesTotalFee: 0,
      goodiesPaidFee: 0,
      address: '',
      studentType: 'Regular',
      unlockedNotes: [],
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
      class: 'Class 10',
      description: '',
      photo: null
    });
  };

  // --- ONLINE TESTS HANDLERS & FETCHERS ---
  const fetchOnlineTests = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/api/online-tests');
      setOnlineTests(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveOnlineTest = async (e) => {
    e.preventDefault();
    if (!onlineTestForm.title || !onlineTestForm.subject || !onlineTestForm.classes.length) {
      showToast('Please fill all header fields and select at least one class', 'error');
      return;
    }
    // Validation on questions
    for (let i = 0; i < onlineTestForm.questions.length; i++) {
      const q = onlineTestForm.questions[i];
      if (!q.questionText || q.options.some(o => !o)) {
        showToast(`Please fill all fields for Question ${i + 1}`, 'error');
        return;
      }
    }

    try {
      setLoading(true);
      const isEdit = !!onlineTestForm._id;
      const url = isEdit ? `/api/online-tests/${onlineTestForm._id}` : '/api/online-tests';
      const method = isEdit ? 'PUT' : 'POST';

      await apiFetch(url, {
        method,
        body: JSON.stringify(onlineTestForm)
      });

      showToast(`Test ${isEdit ? 'updated' : 'created'} successfully`, 'success');
      setIsOnlineTestModalOpen(false);
      resetOnlineTestForm();
      fetchOnlineTests();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOnlineTest = (test) => {
    triggerDeleteConfirm(
      'Delete Online Test',
      `Are you sure you want to delete test "${test.title}"? All student attempts will also be deleted.`,
      async () => {
        try {
          await apiFetch(`/api/online-tests/${test._id}`, { method: 'DELETE' });
          showToast('Online test deleted successfully', 'success');
          fetchOnlineTests();
        } catch (err) {
          showToast(err.message, 'error');
        }
      }
    );
  };

  const handleToggleOnlineTest = async (testId) => {
    try {
      const res = await apiFetch(`/api/online-tests/${testId}/toggle`, { method: 'PATCH' });
      showToast(res.message, 'success');
      fetchOnlineTests();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const fetchTestAttempts = async (test) => {
    try {
      setLoading(true);
      setSelectedTestForAttempts(test);
      const data = await apiFetch(`/api/online-tests/${test._id}/attempts`);
      setTestAttempts(data);
      setIsTestAttemptsModalOpen(true);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetOnlineTestForm = () => {
    setOnlineTestForm({
      title: '',
      subject: '',
      classes: [],
      timeLimit: 15,
      questions: [
        { questionText: '', options: ['', '', '', ''], correctOption: 0, marks: 1 }
      ],
      status: 'draft'
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

  const handleSaveNote = async (enquiryId) => {
    const note = enquiryNotes[enquiryId] ?? enquiryList.find(e => e._id === enquiryId)?.adminNote ?? '';
    try {
      setSavingNoteId(enquiryId);
      await apiFetch(`/api/enquiries/${enquiryId}/note`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNote: note })
      });
      setEnquiryList(prev =>
        prev.map(e => e._id === enquiryId ? { ...e, adminNote: note } : e)
      );
      showToast('Note saved successfully', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSavingNoteId(null);
    }
  };



  // --- Edit Modals Openers ---
  const openEditStudent = (student) => {
    setEditingStudent(student);
    setStudentForm({
      name: student.name,
      fatherName: student.fatherName,
      class: student.class,
      medium: student.medium || 'English',
      phone: student.phone,
      goodiesStatus: student.goodiesStatus,
      discount: student.discount,
      totalFees: student.totalFees,
      paidFees: student.paidFees,
      goodiesTotalFee: student.goodiesTotalFee,
      goodiesPaidFee: student.goodiesPaidFee,
      address: student.address || '',
      studentType: student.studentType || 'Regular',
      unlockedNotes: (student.unlockedNotes || []).map(id => id._id || id || id.toString()),
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
    { id: 'notes-students', label: 'Notes Students', icon: GraduationCap },
    { id: 'teacher', label: 'Teacher', icon: UserCheck },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'fees', label: 'Fee Management', icon: Coins },
    { id: 'expenses', label: 'Expenses', icon: TrendingDown },
    { id: 'test-result', label: 'Test Result', icon: ClipboardList },
    { id: 'online-tests', label: 'Online Tests', icon: FileText },
    { id: 'achievement', label: 'Achievement', icon: Award },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'broadcast', label: 'Broadcast', icon: Radio },
    { id: 'announcement', label: 'Announcement', icon: Bell },
    { id: 'study-material', label: 'Study Material', icon: BookOpen },
    { id: 'enquiry', label: 'Enquiries', icon: HelpCircle },
    { id: 'demo-classes', label: 'Demo Classes', icon: Video },
    { id: 'offers', label: 'Promo Offers', icon: Gift },
    { id: 'customize-course', label: 'Customize Course', icon: BookOpen }
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
          
          <div className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-all" onClick={() => navigate('/')}>
            <img src={logo} alt="Vidyarthi Classes Logo" className="w-10 h-10 object-contain" />
            <h1 className="text-lg sm:text-xl font-bold text-primary font-heading tracking-tight">
              Vidyarthi Classes Kota
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block mr-1">
            <span className="text-xs text-slate-400 block font-medium">Logged in as</span>
            <span className="text-sm font-bold text-slate-700">{admin?.name || 'Administrator'}</span>
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-slate-50 hover:bg-slate-100 border border-slate-150 hover:border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 text-xs font-semibold"
            title="Back to Website"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Website</span>
          </button>
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
          <div className="p-4 border-t border-white/5 space-y-2 shrink-0">
            <button
              onClick={() => setIsChangePasswordModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-350 hover:text-white bg-white/5 hover:bg-white/10 transition-all duration-200 cursor-pointer border border-white/5"
            >
              <Lock className="w-3.5 h-3.5" /> Change Password
            </button>
            <div className="text-[10px] text-slate-400 text-center">
              © 2026 Vidyarthi Classes Kota
            </div>
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
                              <td className="px-6 py-4 font-bold text-primary font-stats">
                                {student.studentId}
                                {student.studentType === 'NotesOnly' && (
                                  <span className="block mt-1 bg-amber-50 text-secondary border border-amber-200/50 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md text-center max-w-[80px]">
                                    Notes Student
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 font-bold text-slate-800">{student.name}</td>
                              <td className="px-6 py-4">{student.fatherName}</td>
                              <td className="px-6 py-4">
                                <span className="bg-primary/5 text-primary px-2.5 py-1 rounded-full text-[10px] font-bold">
                                  {student.class}
                                </span>
                              </td>
                              <td className="px-6 py-4">{student.phone}</td>
                              <td className="px-6 py-4 font-stats">
                                {student.studentType === 'NotesOnly' ? '-' : `₹${student.totalFees.toLocaleString()}`}
                              </td>
                              <td className="px-6 py-4 text-emerald-600 font-bold font-stats">
                                {student.studentType === 'NotesOnly' ? '-' : `₹${student.paidFees.toLocaleString()}`}
                              </td>
                              <td className={`px-6 py-4 font-bold font-stats ${student.studentType === 'NotesOnly' ? 'text-slate-400' : pendingFee > 0 ? 'text-danger' : 'text-emerald-600'}`}>
                                {student.studentType === 'NotesOnly' ? '-' : `₹${pendingFee > 0 ? pendingFee.toLocaleString() : 0}`}
                              </td>
                              <td className="px-6 py-4 space-y-1 text-left">
                                {student.studentType === 'NotesOnly' ? (
                                  <span className="text-slate-400 font-semibold">-</span>
                                ) : (
                                  <>
                                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                      student.goodiesStatus === 'All Distributed'
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                        : student.goodiesStatus === 'Pending'
                                        ? 'bg-slate-55 text-slate-400 border border-slate-200'
                                        : 'bg-orange-50 text-secondary border border-orange-100'
                                    }`}>
                                      {student.goodiesStatus}
                                    </span>
                                    <div className="text-[10px] text-slate-400 font-semibold font-stats">
                                      Paid: ₹{student.goodiesPaidFee} / ₹{student.goodiesTotalFee}
                                    </div>
                                  </>
                                )}
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

          {/* ==================== NOTES STUDENTS PAGE ==================== */}
          {activeTab === 'notes-students' && (
            <div className="space-y-8 animate-fadeIn text-left">
              {/* Heading */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="text-left space-y-1">
                  <h2 className="text-2xl font-extrabold text-primary font-heading font-sans">Notes Students Registrar</h2>
                  <p className="text-xs text-slate-400">View and manage access credentials and unlocked notes for study material buyers.</p>
                </div>
                <button
                  onClick={() => {
                    resetQuickAccessForm();
                    setIsQuickAccessModalOpen(true);
                  }}
                  className="bg-secondary hover:bg-secondary-dark text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-md self-start sm:self-auto"
                >
                  <Unlock className="w-4 h-4" /> Grant Notes Access
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:w-80">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search by ID, Name or Phone..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-xs text-slate-700"
                  />
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">Filter Class:</span>
                  <select
                    value={studentClassFilter}
                    onChange={(e) => setStudentClassFilter(e.target.value)}
                    className="w-full sm:w-48 px-3.5 py-2 bg-white border border-slate-200 rounded-xl outline-none font-semibold text-xs text-slate-650 focus:ring-2 focus:ring-primary/10 focus:border-primary cursor-pointer"
                  >
                    <option value="">All Classes</option>
                    {classesOptions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-premium overflow-hidden">
                {loading ? (
                  <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                ) : (() => {
                  const filteredNotesStudents = students.filter(s => {
                    if (s.studentType !== 'NotesOnly') return false;
                    
                    // Apply class filter
                    if (studentClassFilter && s.class !== studentClassFilter) return false;
                    
                    // Apply search filter
                    if (studentSearch) {
                      const searchLower = studentSearch.toLowerCase();
                      return (
                        s.studentId.toLowerCase().includes(searchLower) ||
                        s.name.toLowerCase().includes(searchLower) ||
                        s.phone.includes(searchLower)
                      );
                    }
                    return true;
                  });

                  if (filteredNotesStudents.length === 0) {
                    return <div className="text-slate-400 py-16 text-center text-sm font-medium">No notes students found.</div>;
                  }

                  return (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-left">
                        <thead>
                          <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Student Name</th>
                            <th className="px-6 py-4">Class</th>
                            <th className="px-6 py-4">Phone</th>
                            <th className="px-6 py-4">Unlocked Notes</th>
                            <th className="px-6 py-4 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs text-slate-600 font-medium">
                          {filteredNotesStudents.map((student) => {
                            // Find note count
                            const noteCount = student.unlockedNotes?.length || 0;
                            return (
                              <tr key={student._id} className="hover:bg-slate-55/30 transition-colors">
                                <td className="px-6 py-4 font-bold text-primary font-stats">{student.studentId}</td>
                                <td className="px-6 py-4 font-bold text-slate-800">{student.name}</td>
                                <td className="px-6 py-4">
                                  <span className="bg-primary/5 text-primary px-2.5 py-1 rounded-full text-[10px] font-bold">
                                    {student.class}
                                  </span>
                                </td>
                                <td className="px-6 py-4">{student.phone}</td>
                                <td className="px-6 py-4">
                                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-md font-bold text-[10px]">
                                    {noteCount} Note{noteCount !== 1 ? 's' : ''} Unlocked
                                  </span>
                                </td>
                                <td className="px-6 py-4 flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => openEditStudent(student)}
                                    className="p-2 border border-slate-100 rounded-lg text-slate-500 hover:bg-primary/5 hover:text-primary transition-colors cursor-pointer"
                                    title="Edit Access / Details"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteStudent(student)}
                                    className="p-2 border border-slate-100 rounded-lg text-slate-500 hover:bg-rose-50 hover:text-danger transition-colors cursor-pointer"
                                    title="Delete Student"
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
                  );
                })()}
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
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
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

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Salary Month:</span>
                  <div>
                    <select
                      value={salaryMonth}
                      onChange={(e) => setSalaryMonth(e.target.value)}
                      className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 outline-none focus:bg-white focus:ring-1 focus:ring-primary cursor-pointer"
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
                      value={salaryYear}
                      onChange={(e) => setSalaryYear(e.target.value)}
                      className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 outline-none focus:bg-white focus:ring-1 focus:ring-primary cursor-pointer"
                    >
                      <option value="2024">2024</option>
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                      <option value="2027">2027</option>
                    </select>
                  </div>
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
                          <th className="px-6 py-4">Base Salary</th>
                          <th className="px-6 py-4">Per Day Salary</th>
                          <th className="px-6 py-4">Attendance (P/H)</th>
                          <th className="px-6 py-4">Salary Earned</th>
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
                            <td className="px-6 py-4 font-stats">₹{(teacher.perDaySalary || Math.round(teacher.salary / 30)).toLocaleString()}</td>
                            <td className="px-6 py-4 font-semibold">
                              <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md mr-1.5">{teacher.presentCount || 0} P</span>
                              <span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md">{teacher.holidayCount || 0} H</span>
                            </td>
                            <td className="px-6 py-4 font-stats font-bold text-emerald-600">₹{(teacher.salaryEarned || 0).toLocaleString()}</td>
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
                <p className="text-xs text-slate-400">Configure Hindi & English medium fees per class and inspect student outstanding bills.</p>
              </div>

              {/* Medium Toggle Info Strip */}
              <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl px-5 py-3.5">
                <div className="flex items-center gap-2 bg-white border border-indigo-200 rounded-xl px-1 py-1 shadow-sm">
                  <span className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-[11px] font-extrabold tracking-wide shadow">
                    Hindi Medium
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-[11px] font-extrabold tracking-wide shadow">
                    English Medium
                  </span>
                </div>
                <div className="text-xs text-indigo-700 font-semibold">
                  Dono mediums ki fees alag-alag set karo. Student register/edit karte waqt medium select karo — fee automatically fill ho jayegi.
                </div>
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
                          <th className="px-6 py-4">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                              English Medium Fee
                            </span>
                          </th>
                          <th className="px-6 py-4">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block"></span>
                              Hindi Medium Fee
                            </span>
                          </th>
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

                            {/* English Medium Fee */}
                            <td className="px-6 py-4">
                              {editingFeeClass === structure.class ? (
                                <div className="flex items-center gap-1.5 max-w-[140px]">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                                  <span className="text-slate-400">₹</span>
                                  <input
                                    type="number"
                                    value={editingFeeEnglish}
                                    onChange={(e) => setEditingFeeEnglish(e.target.value)}
                                    className="w-full border border-emerald-300 rounded px-2.5 py-1 outline-none text-xs focus:ring-1 focus:ring-emerald-400"
                                    placeholder="English fee"
                                    autoFocus
                                  />
                                </div>
                              ) : (
                                <span className="font-stats text-emerald-700 font-bold">₹{(structure.englishMediumFee || 0).toLocaleString()}</span>
                              )}
                            </td>

                            {/* Hindi Medium Fee */}
                            <td className="px-6 py-4">
                              {editingFeeClass === structure.class ? (
                                <div className="flex items-center gap-1.5 max-w-[140px]">
                                  <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0"></span>
                                  <span className="text-slate-400">₹</span>
                                  <input
                                    type="number"
                                    value={editingFeeHindi}
                                    onChange={(e) => setEditingFeeHindi(e.target.value)}
                                    className="w-full border border-indigo-300 rounded px-2.5 py-1 outline-none text-xs focus:ring-1 focus:ring-indigo-400"
                                    placeholder="Hindi fee"
                                  />
                                </div>
                              ) : (
                                <span className="font-stats text-indigo-700 font-bold">₹{(structure.hindiMediumFee || 0).toLocaleString()}</span>
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
                                    setEditingFeeEnglish((structure.englishMediumFee || 0).toString());
                                    setEditingFeeHindi((structure.hindiMediumFee || 0).toString());
                                  }}
                                  className="px-3.5 py-1.5 border border-slate-200 hover:border-primary/30 rounded-lg text-slate-600 hover:text-primary transition-all text-[11px] font-semibold cursor-pointer"
                                >
                                  Edit Fees
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

          {/* ==================== ONLINE TESTS PAGE ==================== */}
          {activeTab === 'online-tests' && (
            <div className="space-y-8 text-left animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <h2 className="text-2xl font-extrabold text-primary font-heading">Online Test Builder</h2>
                  <p className="text-xs text-slate-400">Create, edit, toggle, and view student attempts for online MCQ tests.</p>
                </div>
                <button
                  onClick={() => {
                    resetOnlineTestForm();
                    setIsOnlineTestModalOpen(true);
                  }}
                  className="px-5 py-3 text-sm font-bold text-white bg-primary hover:bg-primary-light shadow-md hover:shadow-lg rounded-xl flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <Plus className="w-5 h-5" /> Create Online Test
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : onlineTests.length === 0 ? (
                <div className="text-slate-400 py-24 text-center text-sm font-semibold border border-dashed border-slate-200 bg-white rounded-3xl flex flex-col items-center justify-center gap-3">
                  <FileText className="w-12 h-12 text-slate-300" />
                  <p>No online tests created yet. Click "Create Online Test" to start.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {onlineTests.map((test) => (
                    <div
                      key={test._id}
                      className="bg-white border border-slate-100 rounded-2xl p-6 shadow-premium hover:shadow-premiumHover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider">
                            {test.subject}
                          </span>
                          <button
                            onClick={() => handleToggleOnlineTest(test._id)}
                            className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm transition-all duration-200 cursor-pointer ${
                              test.status === 'live'
                                ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                                : 'bg-amber-500 text-white hover:bg-amber-600'
                            }`}
                          >
                            {test.status === 'live' ? '🟢 Live' : '🟡 Draft'}
                          </button>
                        </div>

                        <div>
                          <h4 className="text-base font-extrabold text-primary font-heading leading-snug line-clamp-2">
                            {test.title}
                          </h4>
                        </div>

                        <div className="pt-3 border-t border-slate-50 space-y-2 text-xs text-slate-600">
                          <div className="flex justify-between">
                            <span className="text-slate-450 font-semibold">Classes:</span>
                            <span className="font-bold text-slate-800 text-right">
                              {test.classes.join(', ')}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-450 font-semibold">Questions:</span>
                            <span className="font-bold text-slate-800 font-stats">{test.questions?.length || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-450 font-semibold">Time Limit:</span>
                            <span className="font-bold text-slate-800 font-stats">{test.timeLimit} Mins</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-450 font-semibold">Total Marks:</span>
                            <span className="font-bold text-emerald-600 font-stats">{test.totalMarks} Marks</span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-slate-50 pt-4 mt-5 flex items-center justify-between">
                        <button
                          onClick={() => fetchTestAttempts(test)}
                          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg text-[11px] font-extrabold transition-all duration-200 cursor-pointer flex items-center gap-1.5"
                        >
                          <Users className="w-3.5 h-3.5" /> Attempts ({test.attemptCount || 0})
                        </button>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setOnlineTestForm({
                                _id: test._id,
                                title: test.title,
                                subject: test.subject,
                                classes: test.classes,
                                timeLimit: test.timeLimit,
                                questions: test.questions.map(q => ({
                                  questionText: q.questionText,
                                  options: [...q.options],
                                  correctOption: q.correctOption,
                                  marks: q.marks || 1
                                })),
                                status: test.status
                              });
                              setIsOnlineTestModalOpen(true);
                            }}
                            className="p-2 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                            title="Edit test"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteOnlineTest(test)}
                            className="p-2 bg-rose-50 text-danger hover:bg-rose-100 rounded-lg transition-all"
                            title="Delete test"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
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

          {/* ==================== 9. ATTENDANCE PAGE (STUDENTS & TEACHERS) ==================== */}
          {activeTab === 'attendance' && (
            <div className="space-y-6 text-left animate-fadeIn">
              {/* Heading */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="text-left space-y-1">
                  <h2 className="text-2xl font-extrabold text-primary font-heading font-sans">Attendance Register</h2>
                  <p className="text-xs text-slate-400">Track and manage daily attendance logs for students and teachers.</p>
                </div>
                
                {/* Date Picker */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Date:</label>
                  <input
                    type="date"
                    value={attendanceDate}
                    max={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-primary font-semibold"
                  />
                </div>
              </div>

              {/* Sub-tabs Selection */}
              <div className="flex border-b border-slate-250">
                <button
                  onClick={() => {
                    setAttendanceSubTab('students');
                    setSelectedClassAttendance(null);
                  }}
                  className={`py-3 px-6 text-xs font-black uppercase tracking-wider border-b-2 transition-all duration-200 cursor-pointer ${
                    attendanceSubTab === 'students'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Student Attendance
                </button>
                <button
                  onClick={() => setAttendanceSubTab('teachers')}
                  className={`py-3 px-6 text-xs font-black uppercase tracking-wider border-b-2 transition-all duration-200 cursor-pointer ${
                    attendanceSubTab === 'teachers'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Teacher Attendance
                </button>
              </div>

              {/* ================= STUDENTS SECTION ================= */}
              {attendanceSubTab === 'students' && (
                <div className="space-y-6">
                  {selectedClassAttendance === null ? (
                    /* Classes Card Grid Selection */
                    <div className="space-y-4">
                      <div className="text-left space-y-1">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Select Class Stream</h3>
                        <p className="text-xs text-slate-450 font-semibold">Choose a class below to view its roster and log attendance.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {classesOptions.map((cName) => {
                          const classStudentsCount = students.filter(s => s.class === cName).length;
                          return (
                            <div
                              key={cName}
                              className="bg-white border border-slate-100 rounded-3xl p-5 shadow-premium hover:shadow-premiumHover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between text-left"
                            >
                              <div>
                                <div className="p-3 bg-indigo-50 text-indigo-650 rounded-2xl w-fit">
                                  <Users className="w-5 h-5" />
                                </div>
                                <h4 className="text-sm font-extrabold text-slate-800 mt-4 font-heading">{cName}</h4>
                                <span className="text-[11px] font-bold text-slate-400 mt-1 block">
                                  {classStudentsCount} student{classStudentsCount !== 1 ? 's' : ''} enrolled
                                </span>
                              </div>
                              
                              <button
                                onClick={() => setSelectedClassAttendance(cName)}
                                className="w-full text-center py-2.5 mt-5 bg-slate-50 border border-slate-150 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                              >
                                Open Register
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    /* Students Attendance marking list */
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => setSelectedClassAttendance(null)}
                          className="text-xs font-bold text-secondary hover:text-secondary-dark flex items-center gap-1 cursor-pointer bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-all"
                        >
                          &larr; Back to Classes
                        </button>
                        <span className="bg-primary/5 text-primary border border-primary/10 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase">
                          Class: {selectedClassAttendance}
                        </span>
                      </div>

                      {(() => {
                        const classStudents = students.filter(s => s.class === selectedClassAttendance);
                        
                        if (classStudents.length === 0) {
                          return (
                            <div className="text-slate-450 py-20 text-center text-sm font-semibold border border-dashed border-slate-200 bg-white rounded-3xl flex flex-col items-center justify-center gap-3">
                              <Users className="w-10 h-10 text-slate-300" />
                              <p>No students enrolled in {selectedClassAttendance} yet.</p>
                            </div>
                          );
                        }

                        return (
                          <div className="space-y-4">
                            <div className="overflow-x-auto border border-slate-150 rounded-2xl bg-white shadow-premium">
                              <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    <th className="px-6 py-4 text-center w-12">S.No.</th>
                                    <th className="px-6 py-4">Student ID</th>
                                    <th className="px-6 py-4">Student Name</th>
                                    <th className="px-6 py-4 text-center w-72">Attendance Status</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-650">
                                  {classStudents.map((s, idx) => {
                                    const registryKey = `${attendanceDate}_${s.studentId}`;
                                    const currentStatus = attendanceRegistry[registryKey] || 'present';
                                    
                                    return (
                                      <tr key={s._id} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="px-6 py-4 text-center font-bold text-slate-400">{idx + 1}</td>
                                        <td className="px-6 py-4 text-primary font-stats font-bold">{s.studentId}</td>
                                        <td className="px-6 py-4 font-bold text-slate-800">{s.name}</td>
                                        <td className="px-6 py-4 text-center">
                                          <div className="flex items-center justify-center gap-4">
                                            {/* Present */}
                                            <label className="flex items-center gap-1.5 cursor-pointer">
                                              <input
                                                type="radio"
                                                name={`status_${s.studentId}`}
                                                value="present"
                                                checked={currentStatus === 'present'}
                                                onChange={() => setAttendanceRegistry(prev => ({
                                                  ...prev,
                                                  [registryKey]: 'present'
                                                }))}
                                                className="accent-emerald-600"
                                              />
                                              <span className="text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Present</span>
                                            </label>

                                            {/* Absent */}
                                            <label className="flex items-center gap-1.5 cursor-pointer">
                                              <input
                                                type="radio"
                                                name={`status_${s.studentId}`}
                                                value="absent"
                                                checked={currentStatus === 'absent'}
                                                onChange={() => setAttendanceRegistry(prev => ({
                                                  ...prev,
                                                  [registryKey]: 'absent'
                                                }))}
                                                className="accent-rose-600"
                                              />
                                              <span className="text-[10px] font-bold uppercase text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">Absent</span>
                                            </label>

                                            {/* Holiday */}
                                            <label className="flex items-center gap-1.5 cursor-pointer">
                                              <input
                                                type="radio"
                                                name={`status_${s.studentId}`}
                                                value="holiday"
                                                checked={currentStatus === 'holiday'}
                                                onChange={() => setAttendanceRegistry(prev => ({
                                                  ...prev,
                                                  [registryKey]: 'holiday'
                                                }))}
                                                className="accent-amber-600"
                                              />
                                              <span className="text-[10px] font-bold uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">Holiday</span>
                                            </label>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>

                            {/* Submit Bar */}
                            <div className="flex justify-end gap-3 pt-2">
                              <button
                                onClick={() => setSelectedClassAttendance(null)}
                                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-xs font-bold transition-all cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleSaveStudentAttendance}
                                className="px-5 py-2.5 bg-primary hover:bg-primary-light text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                              >
                                Submit Attendance Roster
                              </button>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}

              {/* ================= TEACHERS SECTION ================= */}
              {attendanceSubTab === 'teachers' && (
                <div className="space-y-6">
                  {teachers.length === 0 ? (
                    <div className="text-slate-450 py-20 text-center text-sm font-semibold border border-dashed border-slate-200 bg-white rounded-3xl flex flex-col items-center justify-center gap-3">
                      <UserCheck className="w-10 h-10 text-slate-300" />
                      <p>No teachers registered yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-left space-y-1">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Teacher Roster Attendance</h3>
                        <p className="text-xs text-slate-455 font-semibold">Track daily present, absent, or holiday state logs for teaching staff.</p>
                      </div>

                      <div className="overflow-x-auto border border-slate-150 rounded-2xl bg-white shadow-premium">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              <th className="px-6 py-4 text-center w-12">S.No.</th>
                              <th className="px-6 py-4">Teacher ID</th>
                              <th className="px-6 py-4">Teacher Name</th>
                              <th className="px-6 py-4">Subject</th>
                              <th className="px-6 py-4 text-center w-72">Attendance Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-650">
                            {teachers.map((t, idx) => {
                              const registryKey = `${attendanceDate}_${t._id}`;
                              let isBeforeJoining = false;
                              if (t.joiningDate) {
                                const jd = new Date(t.joiningDate);
                                const jdStr = `${jd.getFullYear()}-${String(jd.getMonth() + 1).padStart(2, '0')}-${String(jd.getDate()).padStart(2, '0')}`;
                                isBeforeJoining = attendanceDate < jdStr;
                              }
                              const currentStatus = isBeforeJoining ? 'absent' : (attendanceRegistry[registryKey] || 'present');
                              
                              return (
                                <tr key={t._id} className="hover:bg-slate-50/30 transition-colors">
                                  <td className="px-6 py-4 text-center font-bold text-slate-400">{idx + 1}</td>
                                  <td className="px-6 py-4 text-primary font-stats font-bold">{t.teacherId || `T-${t._id.toString().substring(18).toUpperCase()}`}</td>
                                  <td className="px-6 py-4 font-bold text-slate-800">{t.name}</td>
                                  <td className="px-6 py-4 text-slate-450">{t.subject || 'General'}</td>
                                  <td className="px-6 py-4 text-center">
                                    {isBeforeJoining ? (
                                      <span className="text-[10px] font-bold uppercase text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">
                                        Not Joined Yet (Auto-Absent)
                                      </span>
                                    ) : (
                                      <div className="flex items-center justify-center gap-4">
                                        {/* Present */}
                                        <label className="flex items-center gap-1.5 cursor-pointer">
                                          <input
                                            type="radio"
                                            name={`status_t_${t._id}`}
                                            value="present"
                                            checked={currentStatus === 'present'}
                                            onChange={() => setAttendanceRegistry(prev => ({
                                              ...prev,
                                              [registryKey]: 'present'
                                            }))}
                                            className="accent-emerald-600"
                                          />
                                          <span className="text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Present</span>
                                        </label>

                                        {/* Absent */}
                                        <label className="flex items-center gap-1.5 cursor-pointer">
                                          <input
                                            type="radio"
                                            name={`status_t_${t._id}`}
                                            value="absent"
                                            checked={currentStatus === 'absent'}
                                            onChange={() => setAttendanceRegistry(prev => ({
                                              ...prev,
                                              [registryKey]: 'absent'
                                            }))}
                                            className="accent-rose-600"
                                          />
                                          <span className="text-[10px] font-bold uppercase text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">Absent</span>
                                        </label>

                                        {/* Holiday */}
                                        <label className="flex items-center gap-1.5 cursor-pointer">
                                          <input
                                            type="radio"
                                            name={`status_t_${t._id}`}
                                            value="holiday"
                                            checked={currentStatus === 'holiday'}
                                            onChange={() => setAttendanceRegistry(prev => ({
                                              ...prev,
                                              [registryKey]: 'holiday'
                                            }))}
                                            className="accent-amber-600"
                                          />
                                          <span className="text-[10px] font-bold uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">Holiday</span>
                                        </label>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Submit Bar */}
                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          className="px-5 py-2.5 bg-primary hover:bg-primary-light text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                          onClick={handleSaveTeacherAttendance}
                        >
                          Submit Teacher Attendance
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
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
                  onClick={() => { setIsAnnouncementMode(false); resetBroadcastForm(); setIsBroadcastModalOpen(true); }}
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
                ) : broadcasts.filter(b => !b.isAnnouncement).length === 0 ? (
                  <div className="text-slate-400 py-20 text-center text-sm font-medium border border-dashed border-slate-200 rounded-2xl bg-white">
                    No announcement broadcasts sent yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {broadcasts.filter(b => !b.isAnnouncement).map((b) => {
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
                              imageSrc.toLowerCase().includes('.pdf') ? (
                                <a
                                  href={imageSrc}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-3 p-4 bg-rose-50 hover:bg-rose-100/70 border border-rose-100 rounded-xl text-rose-700 font-bold transition-all"
                                >
                                  <FileText className="w-8 h-8 text-rose-500 shrink-0" />
                                  <div className="text-left">
                                    <p className="text-xs font-extrabold truncate max-w-[200px]">View Attachment (PDF)</p>
                                    <span className="text-[9px] text-rose-400 font-semibold">Click to open document</span>
                                  </div>
                                </a>
                              ) : (
                                <div className="w-full h-40 rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
                                  <img src={imageSrc} alt="Broadcast Attachment" className="w-full h-full object-cover animate-fade-in" />
                                </div>
                              )
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

          {/* ==================== ANNOUNCEMENT PAGE ==================== */}
          {activeTab === 'announcement' && (
            <div className="space-y-6 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-primary font-heading font-sans">Web Announcements</h2>
                  <p className="text-xs text-slate-400">Post announcements directly to the student dashboard (without sending WhatsApp messages).</p>
                </div>
                <button
                  onClick={() => { setIsAnnouncementMode(true); resetBroadcastForm(); setIsBroadcastModalOpen(true); }}
                  className="px-5 py-3 text-sm font-bold text-white bg-primary hover:bg-primary-light shadow-md hover:shadow-lg rounded-xl flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <Plus className="w-5 h-5" /> Post New Announcement
                </button>
              </div>

              {/* Announcements List */}
              <div className="space-y-4">
                <h3 className="text-md font-bold text-primary font-heading relative pl-3.5">
                  Announcement Logs History
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-3 bg-secondary rounded-full" />
                </h3>

                {loading ? (
                  <div className="flex justify-center items-center py-20 bg-white rounded-2xl border border-slate-100 shadow-premium">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                ) : broadcasts.filter(b => b.isAnnouncement).length === 0 ? (
                  <div className="text-slate-400 py-20 text-center text-sm font-medium border border-dashed border-slate-200 rounded-2xl bg-white">
                    No announcements posted yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {broadcasts.filter(b => b.isAnnouncement).map((b) => {
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
                                  Posted on: {new Date(b.sentAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                                </span>
                              </div>
                              <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0">
                                Web Only
                              </span>
                            </div>

                            {imageSrc && (
                              imageSrc.toLowerCase().includes('.pdf') ? (
                                <a
                                  href={imageSrc}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-3 p-4 bg-rose-50 hover:bg-rose-100/70 border border-rose-100 rounded-xl text-rose-700 font-bold transition-all"
                                >
                                  <FileText className="w-8 h-8 text-rose-500 shrink-0" />
                                  <div className="text-left">
                                    <p className="text-xs font-extrabold truncate max-w-[200px]">View Attachment (PDF)</p>
                                    <span className="text-[9px] text-rose-400 font-semibold">Click to open document</span>
                                  </div>
                                </a>
                              ) : (
                                <div className="w-full h-40 rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
                                  <img src={imageSrc} alt="Announcement Attachment" className="w-full h-full object-cover animate-fade-in" />
                                </div>
                              )
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

                        {/* Admin-only Note Section */}
                        <div className="mt-2 pt-4 border-t border-dashed border-indigo-100 space-y-2">
                          <div className="flex items-center gap-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-500">Admin Note</span>
                            <span className="ml-auto text-[9px] bg-indigo-50 text-indigo-400 px-2 py-0.5 rounded-full font-bold">Only you can see this</span>
                          </div>
                          <textarea
                            rows={3}
                            placeholder="Write a summary of your conversation with this student / parent..."
                            className="w-full text-xs text-slate-600 bg-indigo-50/60 border border-indigo-100 rounded-xl px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300 placeholder-slate-300 leading-relaxed transition-all duration-200"
                            value={enquiryNotes[enquiry._id] ?? enquiry.adminNote ?? ''}
                            onChange={e =>
                              setEnquiryNotes(prev => ({ ...prev, [enquiry._id]: e.target.value }))
                            }
                          />
                          <div className="flex justify-end">
                            <button
                              onClick={() => handleSaveNote(enquiry._id)}
                              disabled={savingNoteId === enquiry._id}
                              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-200 cursor-pointer"
                            >
                              {savingNoteId === enquiry._id ? (
                                <svg className="w-3 h-3 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                              )}
                              {savingNoteId === enquiry._id ? 'Saving...' : 'Save Note'}
                            </button>
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

          {activeTab === 'study-material' && (
            <div className="space-y-8 animate-fadeIn text-left">
              {/* Heading */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="text-left space-y-1">
                  <h2 className="text-2xl font-extrabold text-primary font-heading font-sans">Study Materials Management</h2>
                  <p className="text-xs text-slate-400">Manage, organize, and upload worksheets and syllabus notes by course categories.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
                  <button
                    onClick={() => {
                      resetQuickAccessForm();
                      setIsQuickAccessModalOpen(true);
                    }}
                    className="bg-secondary hover:bg-secondary-dark text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-md"
                  >
                    <Unlock className="w-4 h-4" /> Grant Notes Access
                  </button>
                  <button
                    onClick={() => {
                      setStudyMaterialClass('');
                      setIsStudyMaterialModalOpen(true);
                    }}
                    className="bg-primary hover:bg-primary-light text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-md"
                  >
                    <Plus className="w-4 h-4" /> Upload Material
                  </button>
                </div>
              </div>

              {loading && studyMaterials.length === 0 ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : selectedClassView ? (
                /* ============================================== */
                /* VIEWING MATERIALS FOR A SPECIFIC CLASS/COURSE */
                /* ============================================== */
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setSelectedClassView(null)}
                      className="text-xs font-bold text-secondary hover:text-secondary-dark flex items-center gap-1 cursor-pointer bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-all"
                    >
                      &larr; Back to Courses
                    </button>
                    <span className="bg-primary/5 text-primary border border-primary/10 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase">
                      Category: {selectedClassView}
                    </span>
                  </div>

                  <div className="text-left space-y-1">
                    <h3 className="text-lg font-extrabold text-slate-800 font-heading">
                      Uploaded files for {selectedClassView}
                    </h3>
                    <p className="text-xs text-slate-405">Showing all study guides, assignment sheets, and coursework notes.</p>
                  </div>

                  {(() => {
                    const filtered = studyMaterials.filter(mat => mat.targetClass === selectedClassView);
                    if (filtered.length === 0) {
                      return (
                        <div className="text-slate-450 py-20 text-center text-sm font-semibold border border-dashed border-slate-200 bg-white rounded-3xl flex flex-col items-center justify-center gap-3">
                          <BookOpen className="w-10 h-10 text-slate-300" />
                          <p>No study materials uploaded for {selectedClassView} yet.</p>
                          <button
                            onClick={() => {
                              setStudyMaterialClass(selectedClassView);
                              setIsStudyMaterialModalOpen(true);
                            }}
                            className="bg-primary hover:bg-primary-light text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                          >
                            Upload first file
                          </button>
                        </div>
                      );
                    }

                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                        {filtered.map((mat) => {
                          const downloadUrl = mat.fileUrl.startsWith('http') ? mat.fileUrl : `${API_BASE_URL}${mat.fileUrl}`;
                          return (
                            <div
                              key={mat._id}
                              className="bg-white border border-slate-100 rounded-2xl p-6 shadow-premium hover:shadow-premiumHover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                            >
                              <div className="space-y-3">
                                <span className="text-[10px] text-slate-400 font-bold font-stats block">
                                  Uploaded on: {new Date(mat.uploadedAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </span>
                                <h3 className="text-sm font-bold text-slate-800 leading-tight">{mat.title}</h3>
                                {mat.description && (
                                  <p className="text-xs text-slate-550 leading-normal line-clamp-3">{mat.description}</p>
                                )}
                              </div>

                              <div className="border-t border-slate-50 pt-4 mt-5 flex items-center justify-between">
                                <a
                                  href={downloadUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-secondary hover:underline text-xs font-bold flex items-center gap-1"
                                >
                                  <FileText className="w-4 h-4" /> View / Download
                                </a>
                                <button
                                  onClick={() => {
                                    if (window.confirm('Are you sure you want to delete this study material?')) {
                                      handleDeleteStudyMaterial(mat._id);
                                    }
                                  }}
                                  className="bg-rose-50 hover:bg-rose-100 text-danger p-2 rounded-lg transition-colors cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              ) : (
                /* ============================================== */
                /* CATEGORY COURSE CARDS GRID VIEW */
                /* ============================================== */
                <div className="space-y-6">
                  <div className="text-left space-y-1">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Course Categories</h3>
                    <p className="text-xs text-slate-450 font-semibold">Select a course category below to view and manage its materials, or add files directly.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {/* All Classes (Global) Card */}
                    {(() => {
                      const count = studyMaterials.filter(mat => mat.targetClass === 'All').length;
                      return (
                        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-premium hover:shadow-premiumHover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between text-left">
                          <div>
                            <div className="p-3 bg-slate-50 text-slate-600 rounded-2xl w-fit">
                              <BookOpen className="w-5 h-5" />
                            </div>
                            <h4 className="text-sm font-extrabold text-primary mt-4 font-heading">All Classes (Global)</h4>
                            <span className="text-[11px] font-bold text-slate-400 mt-1 block">
                              {count} file{count !== 1 ? 's' : ''} uploaded
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-6 pt-4 border-t border-slate-50">
                            <button
                              onClick={() => setSelectedClassView('All')}
                              className="w-full text-center py-2 bg-slate-50 border border-slate-150 hover:bg-slate-100 text-slate-700 text-[10px] font-bold rounded-xl transition-all cursor-pointer"
                            >
                              View Files
                            </button>
                            <button
                              onClick={() => {
                                setStudyMaterialClass('All');
                                setIsStudyMaterialModalOpen(true);
                              }}
                              className="w-full text-center py-2 bg-primary hover:bg-primary-light text-white text-[10px] font-bold rounded-xl shadow-sm transition-all cursor-pointer"
                            >
                              Upload
                            </button>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Classes Options Cards */}
                    {classesOptions.map((cName) => {
                      const count = studyMaterials.filter(mat => mat.targetClass === cName).length;
                      return (
                        <div key={cName} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-premium hover:shadow-premiumHover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between text-left">
                          <div>
                            <div className="p-3 bg-indigo-50 text-indigo-650 rounded-2xl w-fit">
                              <BookOpen className="w-5 h-5" />
                            </div>
                            <h4 className="text-sm font-extrabold text-slate-800 mt-4 font-heading">{cName}</h4>
                            <span className="text-[11px] font-bold text-slate-400 mt-1 block">
                              {count} file{count !== 1 ? 's' : ''} uploaded
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-6 pt-4 border-t border-slate-50">
                            <button
                              onClick={() => setSelectedClassView(cName)}
                              className="w-full text-center py-2 bg-slate-50 border border-slate-150 hover:bg-slate-100 text-slate-700 text-[10px] font-bold rounded-xl transition-all cursor-pointer"
                            >
                              View Files
                            </button>
                            <button
                              onClick={() => {
                                setStudyMaterialClass(cName);
                                setIsStudyMaterialModalOpen(true);
                              }}
                              className="w-full text-center py-2 bg-primary hover:bg-primary-light text-white text-[10px] font-bold rounded-xl shadow-sm transition-all cursor-pointer"
                            >
                              Upload
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'demo-classes' && (
            <div className="space-y-8 animate-fadeIn text-left">
              {/* Heading */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="text-left space-y-1">
                  <h2 className="text-2xl font-extrabold text-primary font-heading font-sans">Demo Classes Management</h2>
                  <p className="text-xs text-slate-400">Add, review, and delete demo class video links displayed on the landing page.</p>
                </div>
                <button
                  onClick={() => setIsDemoClassModalOpen(true)}
                  className="bg-primary hover:bg-primary-light text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-md self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" /> Add Demo Class
                </button>
              </div>

              {/* Demo Classes Grid/List */}
              {loading && demoClasses.length === 0 ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : demoClasses.length === 0 ? (
                <div className="text-slate-450 py-20 text-center text-sm font-semibold border border-dashed border-slate-200 bg-white rounded-3xl flex flex-col items-center justify-center gap-3">
                  <Video className="w-10 h-10 text-slate-300" />
                  <p>No demo classes added yet.</p>
                  <button
                    onClick={() => setIsDemoClassModalOpen(true)}
                    className="bg-primary hover:bg-primary-light text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    Add first video
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {demoClasses.map((demo) => {
                    const embedUrl = getYoutubeEmbedUrl(demo.videoUrl);
                    return (
                      <div
                        key={demo._id}
                        className="bg-white border border-slate-100 rounded-3xl p-5 shadow-premium hover:shadow-premiumHover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between text-left"
                      >
                        <div className="space-y-3">
                          {/* Video Preview */}
                          <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-100">
                            {embedUrl.includes('youtube.com/embed') ? (
                              <iframe
                                className="w-full h-full"
                                src={embedUrl}
                                title={demo.title}
                                allowFullScreen
                              ></iframe>
                            ) : (
                              <video
                                src={demo.videoUrl}
                                controls
                                className="w-full h-full object-cover"
                              ></video>
                            )}
                          </div>
                          
                          <h4 className="text-sm font-extrabold text-slate-800 font-heading leading-tight">{demo.title}</h4>
                          {demo.description && (
                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{demo.description}</p>
                          )}
                          <div className="text-[10px] text-slate-450 font-medium">
                            Link: <a href={demo.videoUrl} target="_blank" rel="noopener noreferrer" className="text-secondary break-all hover:underline">{demo.videoUrl}</a>
                          </div>
                        </div>

                        <div className="border-t border-slate-50 pt-4 mt-5 flex items-center justify-end">
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this demo class?')) {
                                handleDeleteDemoClass(demo._id);
                              }
                            }}
                            className="bg-rose-50 hover:bg-rose-100 text-danger p-2 rounded-xl transition-colors cursor-pointer"
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

          {activeTab === 'offers' && (
            <div className="space-y-8 animate-fadeIn text-left">
              {/* Heading */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="text-left space-y-1">
                  <h2 className="text-2xl font-extrabold text-primary font-heading font-sans">Promo Offers Management</h2>
                  <p className="text-xs text-slate-400">Upload and manage promotional pop-up offer images displayed on the landing page.</p>
                </div>
                <button
                  onClick={() => setIsOfferModalOpen(true)}
                  className="bg-primary hover:bg-primary-light text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-md self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" /> Upload Offer Pop-up
                </button>
              </div>

              {/* Promo Offers Grid/List */}
              {loading && offers.length === 0 ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : offers.length === 0 ? (
                <div className="text-slate-450 py-20 text-center text-sm font-semibold border border-dashed border-slate-200 bg-white rounded-3xl flex flex-col items-center justify-center gap-3">
                  <Gift className="w-10 h-10 text-slate-300" />
                  <p>No promo offers uploaded yet.</p>
                  <button
                    onClick={() => setIsOfferModalOpen(true)}
                    className="bg-primary hover:bg-primary-light text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    Upload first offer
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {offers.map((offer) => {
                    const downloadUrl = offer.photoUrl.startsWith('http') ? offer.photoUrl : `${API_BASE_URL}${offer.photoUrl}`;
                    return (
                      <div
                        key={offer._id}
                        className="bg-white border border-slate-100 rounded-3xl p-5 shadow-premium hover:shadow-premiumHover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between text-left"
                      >
                        <div className="space-y-4">
                          {/* Image Container */}
                          <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-150 shadow-inner group">
                            <img
                              src={downloadUrl}
                              alt={offer.title || 'Promo Offer'}
                              className="w-full h-full object-contain"
                            />
                            <div className="absolute top-2 right-2">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide border shadow-sm ${
                                offer.isActive 
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-250' 
                                  : 'bg-slate-50 text-slate-500 border-slate-200'
                              }`}>
                                {offer.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </div>
                          
                          {offer.title && (
                            <h4 className="text-sm font-extrabold text-slate-800 font-heading leading-tight">{offer.title}</h4>
                          )}
                          <div className="text-[10px] text-slate-400 font-medium">
                            Uploaded: {new Date(offer.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                        </div>

                        <div className="border-t border-slate-50 pt-4 mt-5 flex items-center justify-between">
                          <button
                            onClick={() => handleToggleOffer(offer._id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                              offer.isActive 
                                ? 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100' 
                                : 'bg-emerald-50 text-emerald-705 border-emerald-255 hover:bg-emerald-100'
                            }`}
                          >
                            {offer.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this offer popup?')) {
                                handleDeleteOffer(offer._id);
                              }
                            }}
                            className="bg-rose-50 hover:bg-rose-100 text-danger p-2 rounded-xl transition-colors cursor-pointer"
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

          {/* ==================== WORKSPACE 17: CUSTOMIZE COURSE CMS ==================== */}
          {activeTab === 'customize-course' && (
            <div className="space-y-8 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="space-y-1">
                  <h2 className="text-2xl font-extrabold text-primary font-heading">Customize Course Detail Pages</h2>
                  <p className="text-xs text-slate-400">Select a course to customize its landing detail page layout with custom cards, images, and paragraphs.</p>
                </div>
              </div>

              {/* Course Selector Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-premium flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-1.5 w-full sm:max-w-xs">
                  <label className="font-bold text-slate-500 uppercase tracking-wider block text-xs">Select Course / Class *</label>
                  <select
                    value={selectedCourseName}
                    onChange={(e) => setSelectedCourseName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-primary text-slate-700 font-semibold"
                  >
                    <option value="Class 1 to 8">Class 1 to 8</option>
                    <option value="Class 9 to 10">Class 9 to 10</option>
                    <option value="Class 11 to 12">Class 11 to 12</option>
                    <option value="BSTC">BSTC</option>
                    <option value="Rajasthan GK">Rajasthan GK</option>
                    <option value="Hindi Literature">Hindi Literature</option>
                  </select>
                </div>

                <div className="shrink-0 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setAddBlockType('paragraph');
                      setIsAddBlockModalOpen(true);
                    }}
                    className="w-full sm:w-auto px-5 py-3 bg-primary hover:bg-primary-light text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <BookOpen className="w-4 h-4 mr-1.5" /> Customize Course Page
                  </button>
                </div>
              </div>

              {/* Blocks Preview List */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-primary font-heading">Page Layout Preview ({selectedCourseName})</h3>
                
                {coursePageLoading ? (
                  <div className="flex justify-center items-center py-20 bg-white border border-slate-100 rounded-3xl">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                ) : !coursePage || coursePage.blocks.length === 0 ? (
                  <div className="text-slate-455 py-16 text-center text-xs font-semibold flex flex-col items-center gap-2 border border-dashed border-slate-150 rounded-2xl bg-slate-50/50">
                    <BookOpen className="w-8 h-8 text-slate-350" />
                    <p>No content blocks added yet. Click "Customize Course Page" above to design this page!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {coursePage.blocks.map((block) => {
                      const blockImgUrl = block.photoUrl 
                        ? (block.photoUrl.startsWith('http') ? block.photoUrl : `${API_BASE_URL}${block.photoUrl}`)
                        : null;

                      return (
                        <div key={block._id} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-premium relative flex flex-col md:flex-row gap-6 items-start group">
                          {/* Delete Block Button */}
                          <button
                            onClick={() => handleDeleteCourseBlock(block._id)}
                            className="absolute top-4 right-4 bg-rose-50 hover:bg-rose-100 text-danger p-2 rounded-xl transition-colors cursor-pointer"
                            title="Delete Block"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          {/* Block Icon / Type Tag */}
                          <span className="absolute top-4 left-4 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border bg-slate-50 text-slate-500 border-slate-105">
                            {block.type === 'paragraph' && <FileText className="w-3.5 h-3.5" />}
                            {block.type === 'image' && <ImageIcon className="w-3.5 h-3.5" />}
                            {block.type === 'card' && <BookOpen className="w-3.5 h-3.5" />}
                            {block.type}
                          </span>

                          <div className="pt-6 w-full flex flex-col md:flex-row gap-6">
                            {blockImgUrl && (
                              <div className="w-full md:w-1/4 aspect-video md:aspect-square rounded-2xl overflow-hidden border border-slate-150 bg-slate-50 shrink-0">
                                <img
                                  src={blockImgUrl}
                                  alt="Block Preview"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}

                            <div className="space-y-2 flex-grow text-xs font-semibold">
                              {block.title && (
                                <h4 className="text-base font-extrabold text-primary font-heading">{block.title}</h4>
                              )}
                              {block.content && (
                                <p className="text-slate-500 leading-relaxed whitespace-pre-wrap">{block.content}</p>
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

              {/* Class + Medium row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wider block">Class *</label>
                  <select
                    value={studentForm.class}
                    onChange={(e) => {
                      if (editingStudent) {
                        handleEditStudentClassChange(e.target.value, setStudentForm, studentForm.medium);
                      } else {
                        handleStudentClassChange(e.target.value, studentForm.medium);
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-semibold text-slate-600 focus:bg-white"
                  >
                    {classesOptions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Medium Selector */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wider block">Medium *</label>
                  <div className="flex rounded-lg overflow-hidden border border-slate-200 h-[38px]">
                    <button
                      type="button"
                      onClick={() => {
                        if (editingStudent) {
                          setStudentForm(prev => ({ ...prev, medium: 'English' }));
                          // refetch fee with English
                          apiFetch(`/api/fees/structure/${studentForm.class}`)
                            .then(s => s && setStudentForm(prev => ({ ...prev, totalFees: s.englishMediumFee || s.fee || 0 })))
                            .catch(() => {});
                        } else {
                          handleStudentMediumChange('English');
                        }
                      }}
                      className={`flex-1 text-xs font-extrabold tracking-wide transition-all duration-200 ${
                        studentForm.medium === 'English'
                          ? 'bg-emerald-600 text-white shadow-inner'
                          : 'bg-slate-50 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700'
                      }`}
                    >
                      🇬🇧 English
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (editingStudent) {
                          setStudentForm(prev => ({ ...prev, medium: 'Hindi' }));
                          apiFetch(`/api/fees/structure/${studentForm.class}`)
                            .then(s => s && setStudentForm(prev => ({ ...prev, totalFees: s.hindiMediumFee || 0 })))
                            .catch(() => {});
                        } else {
                          handleStudentMediumChange('Hindi');
                        }
                      }}
                      className={`flex-1 text-xs font-extrabold tracking-wide border-l border-slate-200 transition-all duration-200 ${
                        studentForm.medium === 'Hindi'
                          ? 'bg-indigo-600 text-white shadow-inner'
                          : 'bg-slate-50 text-slate-500 hover:bg-indigo-50 hover:text-indigo-700'
                      }`}
                    >
                      🇮🇳 Hindi
                    </button>
                  </div>
                  {studentForm.medium && studentForm.totalFees > 0 && (
                    <p className="text-[10px] text-slate-400 mt-1">
                      Auto-filled fee: <span className="font-bold text-primary">₹{studentForm.totalFees.toLocaleString()}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <label className="font-bold text-slate-500 uppercase tracking-wider block">Student Type *</label>
                  <select
                    value={studentForm.studentType}
                    onChange={(e) => setStudentForm((prev) => ({ ...prev, studentType: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-semibold text-slate-600 focus:bg-white"
                  >
                    <option value="Regular">Regular (Coaching Student)</option>
                    <option value="NotesOnly">Notes Only (Study Material Student)</option>
                  </select>
                </div>
              </div>

              {studentForm.studentType !== 'NotesOnly' && (
                <>
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
                </>
              )}

              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase tracking-wider block">Address</label>
                <textarea
                  value={studentForm.address}
                  onChange={(e) => setStudentForm((prev) => ({ ...prev, address: e.target.value }))}
                  rows="3"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white text-slate-700"
                />
              </div>

              {studentForm.studentType === 'NotesOnly' && (
                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/60 text-left">
                  <h4 className="font-bold text-slate-600 uppercase tracking-wider text-xs">Unlock Study Materials / Notes</h4>
                  <p className="text-[10px] text-slate-400 font-semibold mb-2">Check the study materials to unlock them for this student. The first note of each class is always free.</p>
                  
                  {studyMaterials.length === 0 ? (
                    <div className="text-slate-400 font-bold py-2">No study materials uploaded yet. Go to Study Material tab to upload.</div>
                  ) : (
                    <div className="max-h-60 overflow-y-auto space-y-4 pr-2">
                      {Object.entries(
                        studyMaterials.reduce((acc, mat) => {
                          const targetClass = mat.targetClass || 'Other';
                          if (!acc[targetClass]) acc[targetClass] = [];
                          acc[targetClass].push(mat);
                          return acc;
                        }, {})
                      ).map(([className, mats]) => (
                        <div key={className} className="space-y-1.5">
                          <h5 className="font-bold text-primary text-[10px] uppercase border-b border-slate-200/50 pb-0.5">{className}</h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {mats.map((mat) => {
                              const isChecked = studentForm.unlockedNotes?.some(id => (id._id || id) === mat._id);
                              return (
                                <label key={mat._id} className="flex items-start gap-2.5 p-2 bg-white rounded-lg border border-slate-100 hover:border-slate-250 hover:bg-slate-50/50 cursor-pointer select-none">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => {
                                      const updatedList = e.target.checked
                                        ? [...(studentForm.unlockedNotes || []), mat._id]
                                        : (studentForm.unlockedNotes || []).filter(id => (id._id || id) !== mat._id);
                                      setStudentForm(prev => ({ ...prev, unlockedNotes: updatedList }));
                                    }}
                                    className="mt-0.5 w-3.5 h-3.5 border-slate-300 text-secondary focus:ring-secondary/20 rounded cursor-pointer"
                                  />
                                  <div className="text-left leading-tight">
                                    <span className="font-semibold text-slate-700 block text-[11px] truncate" title={mat.title}>{mat.title}</span>
                                    {mat.description && <span className="text-[9px] text-slate-400 line-clamp-1">{mat.description}</span>}
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Installments Management Section */}
              {studentForm.studentType !== 'NotesOnly' && (
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
                            <tr key={idx} className="hover:bg-slate-55/30">
                              <td className="p-2 text-center text-slate-455">{idx + 1}</td>
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
              )}

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
      {/* ================= QUICK NOTES ACCESS MODAL =============== */}
      {/* ========================================================== */}
      {isQuickAccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 transform scale-100 transition-all duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 bg-slate-50 border-b border-slate-100">
              <h3 className="text-lg font-bold text-primary font-heading">
                Grant Notes Access & Generate Credentials
              </h3>
              <button
                onClick={() => setIsQuickAccessModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {generatedCredentials ? (
              /* Success / Credentials display state */
              <div className="p-8 space-y-6 text-center text-xs">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-slate-800">Access Granted Successfully!</h4>
                  <p className="text-slate-400 font-semibold">Copy the credentials below and send them to the customer.</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4 max-w-md mx-auto text-left">
                  <div className="grid grid-cols-2 gap-y-3 gap-x-4 border-b border-slate-200/60 pb-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Student Name</span>
                      <span className="font-semibold text-slate-700 text-sm">{generatedCredentials.name}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Phone Number</span>
                      <span className="font-semibold text-slate-700 text-sm">{generatedCredentials.phone}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Class / Category</span>
                      <span className="bg-primary/5 text-primary border border-primary/10 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase inline-block mt-0.5">{generatedCredentials.class}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div className="bg-white border border-slate-150 p-3.5 rounded-xl shadow-xs text-center space-y-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">STUDENT ID</span>
                      <span className="font-extrabold text-primary text-base tracking-wide font-stats block select-all">{generatedCredentials.studentId}</span>
                    </div>
                    <div className="bg-white border border-slate-150 p-3.5 rounded-xl shadow-xs text-center space-y-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">PASSWORD</span>
                      <span className="font-extrabold text-secondary text-base tracking-wide font-stats block select-all">{generatedCredentials.password}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 pt-4">
                  <button
                    onClick={() => {
                      const copyText = `*Vidyarthi Classes Kota*\n\nYour Notes Account has been created successfully!\n\n*Student ID:* ${generatedCredentials.studentId}\n*Password:* ${generatedCredentials.password}\n*Class:* ${generatedCredentials.class}\n\nLogin link: ${window.location.origin}/student/login`;
                      navigator.clipboard.writeText(copyText);
                      showToast('Credentials copied to clipboard!', 'success');
                    }}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    Copy Credentials Info
                  </button>
                  <button
                    onClick={() => setIsQuickAccessModalOpen(false)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-xl font-semibold border border-slate-200 transition-all cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              /* Input form state */
              <form onSubmit={handleGrantQuickAccess} className="p-6 space-y-6 text-left text-xs max-h-[75vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase tracking-wider block">Student Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Kumar"
                      value={quickAccessForm.name}
                      onChange={(e) => setQuickAccessForm((prev) => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white text-slate-700"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase tracking-wider block">Phone / Mobile Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 9876543210"
                      value={quickAccessForm.phone}
                      onChange={(e) => setQuickAccessForm((prev) => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white text-slate-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase tracking-wider block">Class / Category *</label>
                    <select
                      value={quickAccessForm.class}
                      onChange={(e) => setQuickAccessForm((prev) => ({ ...prev, class: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-semibold text-slate-600 focus:bg-white"
                    >
                      {classesOptions.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Checklist of all uploaded Study Materials */}
                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/60 text-left">
                  <h4 className="font-bold text-slate-600 uppercase tracking-wider text-xs">Unlock Study Materials / Notes</h4>
                  <p className="text-[10px] text-slate-400 font-semibold mb-2">Select the study materials to unlock for this student. The first note of each class is always free.</p>
                  
                  {studyMaterials.length === 0 ? (
                    <div className="text-slate-400 font-bold py-2">No study materials uploaded yet. Go back and upload materials first.</div>
                  ) : (
                    <div className="max-h-60 overflow-y-auto space-y-4 pr-2">
                      {Object.entries(
                        studyMaterials.reduce((acc, mat) => {
                          const targetClass = mat.targetClass || 'Other';
                          if (!acc[targetClass]) acc[targetClass] = [];
                          acc[targetClass].push(mat);
                          return acc;
                        }, {})
                      ).map(([className, mats]) => (
                        <div key={className} className="space-y-1.5">
                          <h5 className="font-bold text-primary text-[10px] uppercase border-b border-slate-200/50 pb-0.5">{className}</h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {mats.map((mat) => {
                              const isChecked = quickAccessForm.unlockedNotes?.some(id => (id._id || id) === mat._id);
                              return (
                                <label key={mat._id} className="flex items-start gap-2.5 p-2 bg-white rounded-lg border border-slate-100 hover:border-slate-250 hover:bg-slate-50/50 cursor-pointer select-none">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => {
                                      const updatedList = e.target.checked
                                        ? [...(quickAccessForm.unlockedNotes || []), mat._id]
                                        : (quickAccessForm.unlockedNotes || []).filter(id => (id._id || id) !== mat._id);
                                      setQuickAccessForm(prev => ({ ...prev, unlockedNotes: updatedList }));
                                    }}
                                    className="mt-0.5 w-3.5 h-3.5 border-slate-300 text-secondary focus:ring-secondary/20 rounded cursor-pointer"
                                  />
                                  <div className="text-left leading-tight">
                                    <span className="font-semibold text-slate-700 block text-[11px] truncate" title={mat.title}>{mat.title}</span>
                                    {mat.description && <span className="text-[9px] text-slate-400 line-clamp-1">{mat.description}</span>}
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsQuickAccessModalOpen(false)}
                    className="px-4 py-2 text-slate-500 hover:bg-slate-50 rounded-lg border border-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 text-white bg-secondary hover:bg-secondary-dark rounded-lg shadow font-semibold cursor-pointer"
                  >
                    Generate & Grant Access
                  </button>
                </div>
              </form>
            )}
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
      {/* ==================== ONLINE TEST MODAL FORM ================ */}
      {/* ========================================================== */}
      {isOnlineTestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
          <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform scale-100 transition-all duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 bg-slate-50 border-b border-slate-100">
              <h3 className="text-lg font-bold text-primary font-heading">
                {onlineTestForm._id ? 'Edit Online Test' : 'Create Online Test'}
              </h3>
              <button
                onClick={() => { setIsOnlineTestModalOpen(false); resetOnlineTestForm(); }}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveOnlineTest} className="p-6 space-y-6 text-left text-xs max-h-[75vh] overflow-y-auto">
              {/* Test Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wider block">Test Title *</label>
                  <input
                    type="text"
                    required
                    value={onlineTestForm.title}
                    onChange={(e) => setOnlineTestForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white text-slate-700 font-semibold"
                    placeholder="e.g. Mid-term Assessment"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wider block">Subject *</label>
                  <input
                    type="text"
                    required
                    value={onlineTestForm.subject}
                    onChange={(e) => setOnlineTestForm(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white text-slate-700 font-semibold"
                    placeholder="e.g. Physics"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wider block">Time Limit (Minutes) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={onlineTestForm.timeLimit}
                    onChange={(e) => setOnlineTestForm(prev => ({ ...prev, timeLimit: parseInt(e.target.value) || 15 }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white text-slate-700 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wider block">Select Classes (Multiple) *</label>
                  <div className="p-2 border border-slate-200 bg-slate-50 rounded-lg max-h-24 overflow-y-auto space-y-1">
                    {classesOptions.map((c) => {
                      const isChecked = onlineTestForm.classes.includes(c);
                      return (
                        <label key={c} className="flex items-center gap-2 cursor-pointer text-[11px] font-semibold text-slate-600 hover:text-primary">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              setOnlineTestForm(prev => {
                                const newClasses = isChecked
                                  ? prev.classes.filter(cls => cls !== c)
                                  : [...prev.classes, c];
                                return { ...prev, classes: newClasses };
                              });
                            }}
                            className="rounded text-primary focus:ring-primary border-slate-350"
                          />
                          {c}
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Questions Area */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-extrabold text-primary font-heading">Test Questions</h4>
                  <button
                    type="button"
                    onClick={() => {
                      setOnlineTestForm(prev => ({
                        ...prev,
                        questions: [...prev.questions, { questionText: '', options: ['', '', '', ''], correctOption: 0, marks: 1 }]
                      }));
                    }}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Question
                  </button>
                </div>

                <div className="space-y-6">
                  {onlineTestForm.questions.map((q, qIndex) => (
                    <div key={qIndex} className="p-4 border border-slate-150 bg-slate-50/50 rounded-2xl relative space-y-3">
                      {/* Delete Question */}
                      {onlineTestForm.questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setOnlineTestForm(prev => ({
                              ...prev,
                              questions: prev.questions.filter((_, idx) => idx !== qIndex)
                            }));
                          }}
                          className="absolute top-3 right-3 p-1.5 text-danger hover:bg-rose-50 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}

                      <div className="font-extrabold text-slate-700">Question {qIndex + 1}</div>

                      <div className="space-y-2">
                        <label className="font-bold text-slate-500 uppercase tracking-wider block">Question Text *</label>
                        <input
                          type="text"
                          required
                          value={q.questionText}
                          onChange={(e) => {
                            const newQs = [...onlineTestForm.questions];
                            newQs[qIndex].questionText = e.target.value;
                            setOnlineTestForm(prev => ({ ...prev, questions: newQs }));
                          }}
                          className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg outline-none text-slate-700 font-medium"
                          placeholder="Type your question here"
                        />
                      </div>

                      {/* Options */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {q.options.map((opt, optIdx) => (
                          <div key={optIdx} className="space-y-1">
                            <label className="font-bold text-slate-500 uppercase tracking-wider block">Option {optIdx + 1} *</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`correct-${qIndex}`}
                                checked={q.correctOption === optIdx}
                                onChange={() => {
                                  const newQs = [...onlineTestForm.questions];
                                  newQs[qIndex].correctOption = optIdx;
                                  setOnlineTestForm(prev => ({ ...prev, questions: newQs }));
                                }}
                                className="text-primary focus:ring-primary"
                                title="Mark as correct answer"
                              />
                              <input
                                type="text"
                                required
                                value={opt}
                                onChange={(e) => {
                                  const newQs = [...onlineTestForm.questions];
                                  newQs[qIndex].options[optIdx] = e.target.value;
                                  setOnlineTestForm(prev => ({ ...prev, questions: newQs }));
                                }}
                                className="w-full px-3 py-1.5 border border-slate-200 bg-white rounded-lg outline-none text-slate-700 font-medium"
                                placeholder={`Option ${optIdx + 1}`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Marks */}
                      <div className="w-32">
                        <label className="font-bold text-slate-500 uppercase tracking-wider block">Question Marks *</label>
                        <input
                          type="number"
                          required
                          min="1"
                          value={q.marks}
                          onChange={(e) => {
                            const newQs = [...onlineTestForm.questions];
                            newQs[qIndex].marks = parseInt(e.target.value) || 1;
                            setOnlineTestForm(prev => ({ ...prev, questions: newQs }));
                          }}
                          className="w-full px-3 py-1.5 border border-slate-200 bg-white rounded-lg outline-none text-slate-700 font-bold"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setIsOnlineTestModalOpen(false); resetOnlineTestForm(); }}
                  className="px-4 py-2 text-slate-500 hover:bg-slate-50 rounded-lg border border-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 text-white bg-primary hover:bg-primary-light rounded-lg shadow font-semibold cursor-pointer"
                >
                  {onlineTestForm._id ? 'Update Test' : 'Create Test'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* ==================== TEST ATTEMPTS LIST MODAL ============== */}
      {/* ========================================================== */}
      {isTestAttemptsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
          <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform scale-100 transition-all duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 bg-slate-50 border-b border-slate-100">
              <h3 className="text-lg font-bold text-primary font-heading">
                Attempts for "{selectedTestForAttempts?.title}"
              </h3>
              <button
                onClick={() => { setIsTestAttemptsModalOpen(false); setSelectedTestForAttempts(null); }}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
              {testAttempts.length === 0 ? (
                <div className="text-slate-400 py-12 text-center text-sm font-semibold">
                  No students have attempted this test yet.
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                  <table className="w-full border-collapse text-left text-xs text-slate-600">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider border-b border-slate-100">
                        <th className="px-6 py-3.5">Student ID</th>
                        <th className="px-6 py-3.5">Student Name</th>
                        <th className="px-6 py-3.5">Class</th>
                        <th className="px-6 py-3.5">Score</th>
                        <th className="px-6 py-3.5">Percentage</th>
                        <th className="px-6 py-3.5">Submission</th>
                        <th className="px-6 py-3.5">Attempt Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {testAttempts.map((att) => (
                        <tr key={att._id} className="hover:bg-slate-50/50">
                          <td className="px-6 py-4 font-bold text-slate-800">{att.student?.studentId || 'N/A'}</td>
                          <td className="px-6 py-4 font-bold text-slate-800">{att.student?.name || 'Deleted Student'}</td>
                          <td className="px-6 py-4">{att.studentClass}</td>
                          <td className="px-6 py-4 font-stats font-bold text-emerald-600">
                            {att.score} / {att.totalMarks}
                          </td>
                          <td className="px-6 py-4 font-stats">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              att.percentage >= 60
                                ? 'bg-emerald-50 text-emerald-700'
                                : att.percentage >= 33
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}>
                              {att.percentage}%
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {att.autoSubmitted ? (
                              <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md font-bold text-[10px] uppercase">
                                Auto ({att.autoSubmitReason || 'Exit'})
                              </span>
                            ) : (
                              <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-bold text-[10px] uppercase">
                                Manual
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-slate-400">
                            {new Date(att.createdAt).toLocaleString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
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
                {isAnnouncementMode ? 'Post Web Announcement' : 'Send WhatsApp Announcement'}
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
                <label className="font-bold text-slate-500 uppercase tracking-wider block">
                  {isAnnouncementMode ? 'Announcement Title * (Compulsory)' : 'Message Title * (Compulsory)'}
                </label>
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
                <label className="font-bold text-slate-500 uppercase tracking-wider block">
                  {isAnnouncementMode ? 'Announcement Description * (Compulsory)' : 'Message Description * (Compulsory)'}
                </label>
                <textarea
                  required
                  value={broadcastForm.description}
                  onChange={(e) => setBroadcastForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder={isAnnouncementMode ? 'Type announcement contents here...' : 'Type WhatsApp message contents here...'}
                  rows="4"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white text-slate-700"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase tracking-wider block">Attach Image or PDF (Optional)</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
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
                  {isAnnouncementMode ? 'Post Announcement' : 'Send Broadcast'}
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

      {/* Upload Study Material Modal */}
      {isStudyMaterialModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 transform scale-100 transition-all duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 bg-slate-50 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-primary font-heading font-sans uppercase tracking-wider">
                Upload New Study Material
              </h3>
              <button
                onClick={() => {
                  setIsStudyMaterialModalOpen(false);
                  setStudyMaterialTitle('');
                  setStudyMaterialDescription('');
                  setStudyMaterialClass('');
                  setStudyMaterialFile(null);
                }}
                className="p-1.5 hover:bg-slate-200 text-slate-500 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleCreateStudyMaterial} className="p-6 space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Material Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chapter 1 Practice Sheet"
                  value={studyMaterialTitle}
                  onChange={(e) => setStudyMaterialTitle(e.target.value)}
                  className="w-full py-2.5 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-primary transition-all font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Description (Optional)</label>
                <textarea
                  placeholder="Provide details about the sheet or instructions for students..."
                  rows="3"
                  value={studyMaterialDescription}
                  onChange={(e) => setStudyMaterialDescription(e.target.value)}
                  className="w-full py-2.5 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-primary transition-all font-semibold resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Target Class</label>
                <select
                  required
                  value={studyMaterialClass}
                  onChange={(e) => setStudyMaterialClass(e.target.value)}
                  className="w-full py-2.5 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-primary transition-all font-semibold"
                >
                  <option value="">Select Target Class</option>
                  <option value="All">All Classes</option>
                  {classesOptions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">PDF or Image File</label>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center bg-slate-50 hover:bg-slate-100/50 transition-colors relative">
                  <input
                    type="file"
                    required
                    accept=".pdf,image/*"
                    onChange={(e) => setStudyMaterialFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="space-y-1">
                    <FileText className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="text-xs font-bold text-slate-600">
                      {studyMaterialFile ? studyMaterialFile.name : 'Select or drop PDF / Image here'}
                    </p>
                    <p className="text-[10px] text-slate-400">Accepted formats: .pdf, .jpg, .png (Max: 10MB)</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsStudyMaterialModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingStudyMaterial}
                  className="px-5 py-2 bg-primary hover:bg-primary-light disabled:bg-slate-300 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {isUploadingStudyMaterial ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...
                    </>
                  ) : (
                    'Upload file'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Demo Class Modal */}
      {isDemoClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform scale-100 transition-all duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 bg-slate-50 border-b border-slate-100">
              <h3 className="text-lg font-bold text-primary font-heading">Add New Demo Class</h3>
              <button
                onClick={() => {
                  setIsDemoClassModalOpen(false);
                  setDemoClassForm({ title: '', videoUrl: '', description: '' });
                }}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddDemoClass} className="p-6 space-y-4 text-left text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase tracking-wider block">Video Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Class 10 Physics - Optics"
                  value={demoClassForm.title}
                  onChange={(e) => setDemoClassForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-primary text-slate-700 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase tracking-wider block">Video URL *</label>
                <input
                  type="url"
                  required
                  placeholder="e.g. https://www.youtube.com/watch?v=..."
                  value={demoClassForm.videoUrl}
                  onChange={(e) => setDemoClassForm(prev => ({ ...prev, videoUrl: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-primary text-slate-700 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase tracking-wider block">Description (Optional)</label>
                <textarea
                  placeholder="Write a brief description about the topics covered..."
                  rows="3"
                  value={demoClassForm.description}
                  onChange={(e) => setDemoClassForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-primary text-slate-700 font-semibold resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsDemoClassModalOpen(false);
                    setDemoClassForm({ title: '', videoUrl: '', description: '' });
                  }}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-primary hover:bg-primary-light disabled:bg-slate-300 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    'Add Video'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Offer Modal */}
      {isOfferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform scale-100 transition-all duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 bg-slate-50 border-b border-slate-100">
              <h3 className="text-lg font-bold text-primary font-heading">Upload Promo Offer Pop-up</h3>
              <button
                onClick={() => {
                  setIsOfferModalOpen(false);
                  setOfferTitle('');
                  setOfferFile(null);
                }}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddOffer} className="p-6 space-y-4 text-left text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase tracking-wider block">Offer Title / Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Monsoon Special 20% Discount"
                  value={offerTitle}
                  onChange={(e) => setOfferTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-primary text-slate-700 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Promo Image File *</label>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50 hover:bg-slate-100/50 transition-colors relative">
                  <input
                    type="file"
                    required
                    accept="image/*"
                    onChange={(e) => setOfferFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="space-y-2">
                    <ImageIcon className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="text-xs font-bold text-slate-600">
                      {offerFile ? offerFile.name : 'Select or drop promotional image here'}
                    </p>
                    <p className="text-[10px] text-slate-400">Accepted formats: JPG, PNG, WEBP (Max: 5MB)</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsOfferModalOpen(false);
                    setOfferTitle('');
                    setOfferFile(null);
                  }}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingOffer}
                  className="px-5 py-2 bg-primary hover:bg-primary-light disabled:bg-slate-300 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  {isUploadingOffer ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...
                    </>
                  ) : (
                    'Upload Offer'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isChangePasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform scale-100 transition-all duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 bg-slate-50 border-b border-slate-100">
              <h3 className="text-lg font-bold text-primary font-heading">Change Password</h3>
              <button
                onClick={() => {
                  setIsChangePasswordModalOpen(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleChangePassword} className="p-6 space-y-4 text-left text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase tracking-wider block">Current Password *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-primary text-slate-700 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase tracking-wider block">New Password *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-primary text-slate-700 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase tracking-wider block">Confirm New Password *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-primary text-slate-700 font-semibold"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsChangePasswordModalOpen(false);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="px-5 py-2 bg-primary hover:bg-primary-light disabled:bg-slate-300 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Updating...
                    </>
                  ) : (
                    'Change Password'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Course Block Modal */}
      {isAddBlockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform scale-100 transition-all duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 bg-slate-50 border-b border-slate-100">
              <h3 className="text-lg font-bold text-primary font-heading">Customize Content Block ({selectedCourseName})</h3>
              <button
                onClick={() => {
                  setIsAddBlockModalOpen(false);
                  setAddBlockTitle('');
                  setAddBlockContent('');
                  setAddBlockFile(null);
                }}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddBlockSubmit} className="p-6 space-y-4 text-left text-xs">
              
              {/* Block Type Selection */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setAddBlockType('paragraph');
                    setAddBlockFile(null);
                    setAddBlockTitle('');
                    setAddBlockContent('');
                  }}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl border font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                    addBlockType === 'paragraph'
                      ? 'bg-primary/5 text-primary border-primary'
                      : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100/50'
                  }`}
                >
                  <FileText className="w-5 h-5" />
                  <span>Upload Paragraph</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setAddBlockType('image');
                    setAddBlockTitle('');
                    setAddBlockContent('');
                    setAddBlockFile(null);
                  }}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl border font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                    addBlockType === 'image'
                      ? 'bg-primary/5 text-primary border-primary'
                      : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100/50'
                  }`}
                >
                  <ImageIcon className="w-5 h-5" />
                  <span>Upload Image</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAddBlockType('card');
                    setAddBlockTitle('');
                    setAddBlockContent('');
                    setAddBlockFile(null);
                  }}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl border font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                    addBlockType === 'card'
                      ? 'bg-primary/5 text-primary border-primary'
                      : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100/50'
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                  <span>Upload Card</span>
                </button>
              </div>

              {/* Title input (Visible for Card and Paragraph, Optional for Image) */}
              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase tracking-wider block">
                  {addBlockType === 'image' ? 'Image Label / Title (Optional)' : 'Block Title *'}
                </label>
                <input
                  type="text"
                  required={addBlockType !== 'image'}
                  placeholder={addBlockType === 'image' ? 'e.g. Batch Timings Graph' : 'e.g. Course Syllabus Overview'}
                  value={addBlockTitle}
                  onChange={(e) => setAddBlockTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-primary text-slate-700 font-semibold"
                />
              </div>

              {/* Content textarea (Visible for Card and Paragraph) */}
              {addBlockType !== 'image' && (
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wider block">Block Paragraph Content *</label>
                  <textarea
                    required
                    placeholder="Write detailed descriptions, timings, features..."
                    rows="5"
                    value={addBlockContent}
                    onChange={(e) => setAddBlockContent(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-primary text-slate-700 font-semibold resize-none"
                  />
                </div>
              )}

              {/* Image Upload Input (Visible for Image and Card) */}
              {addBlockType !== 'paragraph' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    {addBlockType === 'image' ? 'Upload Image *' : 'Card Image Cover (Optional)'}
                  </label>
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50 hover:bg-slate-100/50 transition-colors relative">
                    <input
                      type="file"
                      required={addBlockType === 'image'}
                      accept="image/*"
                      onChange={(e) => setAddBlockFile(e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="space-y-2">
                      <ImageIcon className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="text-xs font-bold text-slate-600">
                        {addBlockFile ? addBlockFile.name : 'Select or drop promotional image here'}
                      </p>
                      <p className="text-[10px] text-slate-400">Accepted formats: JPG, PNG, WEBP (Max: 5MB)</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddBlockModalOpen(false);
                    setAddBlockTitle('');
                    setAddBlockContent('');
                    setAddBlockFile(null);
                  }}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddingBlock}
                  className="px-5 py-2 bg-primary hover:bg-primary-light disabled:bg-slate-300 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  {isAddingBlock ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Adding...
                    </>
                  ) : (
                    'Add Block'
                  )}
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


    </div>
  );
};

export default AdminDashboard;
