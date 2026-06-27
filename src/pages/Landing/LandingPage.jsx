import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Award,
  BookOpen,
  Users,
  Clock,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ArrowRight,
  ShieldCheck,
  Star,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { API_BASE_URL, useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Eye, EyeOff, Lock, X, Loader2 } from 'lucide-react';
import logo from '../../assets/logo.png';
import heroImage from '../../assets/Hero_Image.png';



const LandingPage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState({ totalStudents: 1500, years: '10+', rate: '98%' });
  const [loading, setLoading] = useState(true);
  const [expandedCard, setExpandedCard] = useState(null);

  const { login } = useAuth();
  const { showToast } = useToast();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [emailOrId, setEmailOrId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);





  const handlePopupLogin = async (e) => {
    e.preventDefault();
    if (!emailOrId || !password) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    setIsSubmitting(true);
    const result = await login(emailOrId, password);
    setIsSubmitting(false);

    if (result.success) {
      showToast('Login successful!', 'success');
      setIsLoginModalOpen(false);
      setEmailOrId('');
      setPassword('');
      
      // Redirect according to role
      if (result.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (result.role === 'teacher') {
        navigate('/teacher/dashboard');
      } else if (result.role === 'student') {
        navigate('/student/dashboard');
      }
    } else {
      showToast(result.message || 'Invalid credentials', 'error');
    }
  };






  useEffect(() => {
    // Fetch courses and achievements from backend
    const fetchData = async () => {
      try {
        // Fetch fee structures (courses)
        const coursesRes = await fetch(`${API_BASE_URL}/api/fees/structure`);
        if (coursesRes.ok) {
          const coursesData = await coursesRes.json();
          setCourses(coursesData);
        }

        // Fetch achievements
        const achRes = await fetch(`${API_BASE_URL}/api/achievements`);
        if (achRes.ok) {
          const achData = await achRes.json();
          // Take only first 6
          setAchievements(achData.slice(0, 6));
        }
      } catch (err) {
        console.error('Error fetching landing data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const coursesList = [
    {
      name: 'Class 1 to 8',
      desc: 'Comprehensive coaching laying a strong academic foundation for primary & middle school.',
      icon: BookOpen,
      details: [
        'Learning Through Fun Activities',
        'Strong Academic Foundation',
        'Value-Based Education'
      ]
    },
    {
      name: 'Class 9 to 10',
      desc: 'Secondary school preparation focusing on board exams and core concepts.',
      icon: BookOpen,
      details: [
        'Hindi & English Medium',
        'In-depth Preparation in Every Subject'
      ]
    },
    {
      name: 'Class 11 to 12',
      desc: 'Higher secondary coaching for science, commerce & arts streams.',
      icon: GraduationCap,
      sections: [
        {
          name: 'Arts',
          items: [
            'All Arts Subject Available',
            'Guidance by Experienced Faculty'
          ]
        },
        {
          name: 'Science',
          items: [
            'Board Exam Preparation',
            'Strong Concept-Building Approach'
          ]
        }
      ]
    },
    {
      name: 'BSTC',
      desc: ' राजस्थान बीएसटीसी प्रवेश परीक्षा की सर्वोत्तम तैयारी।',
      icon: Award,
      details: [
        'Complete Syllabus Coverage',
        'Previous Year Paper Analysis',
        'Daily GK Quizzes & Mock Tests'
      ]
    },
    {
      name: 'Rajasthan GK',
      desc: 'राजस्थान सामान्य ज्ञान - RPSC, RSMSSB व अन्य प्रतियोगी परीक्षाओं हेतु।',
      icon: ShieldCheck,
      details: [
        'History, Art & Culture of Rajasthan',
        'Targeted Content for RPSC/RSMSSB Exams',
        'Interactive Map-Based Learning'
      ]
    },
    {
      name: 'Hindi Literature',
      desc: 'हिंदी साहित्य - कक्षा 11-12 व प्रतियोगी परीक्षाओं के लिए गहन अध्ययन।',
      icon: GraduationCap,
      details: [
        'Detailed Prose & Poetry Analysis',
        'Grammar & Writing Skills',
        'Answer Writing Practice'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-bgLight flex flex-col font-sans">
      
      {/* 1. NAVBAR */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img src={logo} alt="Vidyarthi Classes Logo" className="w-12 h-12 object-contain" />
              <div>
                <span className="text-xl sm:text-2xl font-bold font-heading text-primary leading-none block">
                  Vidyarthi Classes
                </span>
                <span className="text-xs font-semibold tracking-widest text-secondary uppercase font-stats mt-0.5 block">
                  Kota
                </span>
              </div>
            </div>

            {/* Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-slate-600 hover:text-primary font-medium transition-colors text-sm">Home</a>
              <a href="#about" className="text-slate-600 hover:text-primary font-medium transition-colors text-sm">About</a>
              <a href="#courses" className="text-slate-600 hover:text-primary font-medium transition-colors text-sm">Courses</a>
              <a href="#achievements" className="text-slate-600 hover:text-primary font-medium transition-colors text-sm">Achievements</a>
              <a href="#contact" className="text-slate-600 hover:text-primary font-medium transition-colors text-sm">Contact</a>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/enquiry')}
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-secondary hover:bg-secondary-dark rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                Enquiry
              </button>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-light rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section id="home" className="relative pt-2 pb-12 md:pt-4 md:pb-20 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-bgLight">
        {/* Background Gradients & Decorations */}
        <div className="absolute top-0 right-0 -z-10 w-2/3 h-2/3 bg-gradient-to-bl from-secondary/10 via-primary/5 to-transparent rounded-bl-[200px]" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Text details */}
            <div className="text-left space-y-6 max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold tracking-wider text-secondary uppercase bg-secondary/10 rounded-full border border-secondary/20">
                <Star className="w-3.5 h-3.5 fill-current" /> Kota's Premier Coaching Institute
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-primary leading-tight">
                Shaping Futures, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-orange-500">
                  Building Champions
                </span>
              </h1>
              <p className="text-slate-600 text-lg leading-relaxed font-sans">
                Kota's Most Trusted Coaching for Class 1–12 | BSTC | Rajasthan GK | Hindi Literature. Empowering students with excellence.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="#courses"
                  className="px-8 py-4 text-sm font-bold text-white bg-secondary hover:bg-secondary-dark rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
                >
                  Explore Courses <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#contact"
                  className="px-8 py-4 text-sm font-bold text-primary bg-white border border-slate-200 hover:border-primary/30 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  Contact
                </a>
              </div>
            </div>

            {/* Visual Student Illustration */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-lg aspect-[4/3] sm:aspect-square rounded-3xl overflow-hidden shadow-2xl border border-slate-100/50 bg-white/40 backdrop-blur-xs p-2 hover:scale-[1.02] transition-transform duration-500">
                <img
                  src={heroImage}
                  alt="Kota's Premier Coaching Institute"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ABOUT SECTION */}
      <section id="about" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left side: YouTube Embed */}
            <div className="lg:col-span-6 space-y-6">
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-premium border border-slate-100 bg-slate-950 group">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/wculPF1wpiA"
                  title="Vidyarthi Classes Kota - Classroom Tour"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-5 bg-bgLight rounded-2xl border border-slate-100 flex items-center gap-3">
                <div className="bg-red-50 p-2 rounded-xl text-red-600 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <p className="text-slate-500 text-xs leading-relaxed text-left">
                  Watch our digital classroom facility, library access, and interaction with expert faculties in Kota.
                </p>
              </div>
            </div>

            {/* Right side: Online + Offline Coaching info */}
            <div className="lg:col-span-6 space-y-8 text-left">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-secondary font-stats block">
                  Know Our Methodology
                </span>
                <h2 className="text-3xl sm:text-4xl font-black font-heading text-primary relative inline-block">
                  About Vidyarthi Classes Kota
                  <span className="block h-1.5 w-24 bg-secondary mt-2 rounded-full" />
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed mt-4">
                  At **Vidyarthi Classes Kota**, we bridge the gap between traditional classroom attention and modern online flexibility. Whether you prefer the energy of physical classrooms or the comfort of remote studying, we deliver an uncompromised learning experience.
                </p>
              </div>

              {/* OFFLINE SECTION */}
              <div className="flex gap-4 items-start">
                <div className="bg-primary/5 p-3 rounded-2xl text-primary shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-extrabold text-primary font-heading">
                    Premium Offline Coaching
                  </h4>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Our offline center located in Rajeev Gandhi Nagar, Kota features smart classrooms, air-conditioned lecture corridors, and a physical doubt clearing chamber. Students receive printed worksheet booklets, structured weekly review sheets, and premium items (bags, t-shirts, and textbooks). We prioritize teacher-to-student eye contact for deep understanding.
                  </p>
                </div>
              </div>

              {/* ONLINE SECTION */}
              <div className="flex gap-4 items-start">
                <div className="bg-secondary/10 p-3 rounded-2xl text-secondary shrink-0">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-extrabold text-primary font-heading">
                    Next-Gen Online Coaching
                  </h4>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    For students studying remotely across Rajasthan, we deliver high-definition live lectures via our digital portal. Students have access to recorded session archives, direct online doubt-clearing panels, e-book worksheets, and real-time scorecard dashboards. Our online courses for Rajasthan GK and Hindi Literature are highly sought after by state-exam aspirants.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-slate-100">
            {/* Stat Card 1 */}
            <div className="bg-gradient-to-br from-primary to-primary-light p-6 rounded-2xl shadow-md text-white text-center hover:scale-[1.03] transition-all duration-300">
              <Users className="w-8 h-8 mx-auto text-secondary mb-3" />
              <div className="text-3xl font-extrabold font-stats">1000+</div>
              <div className="text-xs uppercase tracking-wider text-slate-200 mt-1">Total Students</div>
            </div>

            {/* Stat Card 2 */}
            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-premium text-center hover:scale-[1.03] transition-all duration-300">
              <Clock className="w-8 h-8 mx-auto text-secondary mb-3" />
              <div className="text-3xl font-extrabold font-stats text-primary">10+ Years</div>
              <div className="text-xs uppercase tracking-wider text-slate-500 mt-1">Excellence</div>
            </div>

            {/* Stat Card 3 */}
            <div className="bg-gradient-to-br from-secondary to-orange-500 p-6 rounded-2xl shadow-md text-white text-center hover:scale-[1.03] transition-all duration-300">
              <Award className="w-8 h-8 mx-auto text-white mb-3" />
              <div className="text-3xl font-extrabold font-stats">98%</div>
              <div className="text-xs uppercase tracking-wider text-slate-100 mt-1">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. COURSES / CLASSES SECTION */}
      <section id="courses" className="py-24 bg-bgLight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-primary">
              Our Offered Courses & Classes
            </h2>
            <div className="h-1.5 w-20 bg-secondary mx-auto rounded-full" />
            <p className="text-slate-500 text-sm">
              We provide structured course fee plans that are customizable and affordable. Learn from the best minds in the region.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
            {coursesList.map((course, idx) => {
              const matchedFee = courses.find(
                (c) => c.class.toLowerCase() === course.name.toLowerCase()
              );
              const IconComponent = course.icon;
              const isExpanded = expandedCard === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setExpandedCard(isExpanded ? null : idx)}
                  className="bg-white border border-slate-100 rounded-2xl shadow-premium hover:shadow-premiumHover p-6 hover:-translate-y-1.5 transition-all duration-300 text-left flex flex-col justify-between cursor-pointer select-none"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-primary/5 text-primary p-3 rounded-xl inline-block">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-secondary' : ''}`} />
                    </div>
                    <h3 className="text-lg font-bold font-heading text-primary mb-2">
                      {course.name}
                    </h3>
                    <p className="text-slate-500 text-xs mb-4 leading-relaxed">
                      {course.desc}
                    </p>
                    
                    {/* Expanded details container */}
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-60 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                      <div className="border-t border-slate-50 pt-3 space-y-3">
                        {course.sections ? (
                          course.sections.map((sec, sIdx) => (
                            <div key={sIdx} className="space-y-1">
                              <span className="text-[10px] font-extrabold uppercase text-secondary tracking-wider block">
                                {sec.name} Stream
                              </span>
                              <div className="space-y-1 pl-1">
                                {sec.items.map((item, iIdx) => (
                                  <div key={iIdx} className="flex items-start gap-1.5 text-slate-650 text-xs font-semibold leading-relaxed">
                                    <span className="text-primary font-black shrink-0">•</span>
                                    <span>{item}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))
                        ) : (
                          course.details && course.details.map((detail, dIdx) => (
                            <div key={dIdx} className="flex items-start gap-2 text-slate-600 text-xs font-semibold leading-relaxed">
                              <span className="text-secondary font-black shrink-0 mt-0.5">•</span>
                              <span>{detail}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-slate-100 pt-2 mt-4 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {isExpanded ? 'Click to hide info' : 'Click to view info'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE US SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-primary">
              Why Choose Vidyarthi Classes?
            </h2>
            <div className="h-1.5 w-20 bg-secondary mx-auto rounded-full" />
            <p className="text-slate-500 text-sm">
              We stand apart through our unique teaching methodologies and dedication to individual student needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-2xl text-left border border-slate-100 space-y-4 hover:bg-slate-100/50 transition-colors">
              <div className="bg-white p-3 rounded-xl inline-block shadow-sm text-secondary">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-primary font-heading">Expert Teachers</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Our faculty consists of veteran educators from Kota with decades of classroom instruction experience.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl text-left border border-slate-100 space-y-4 hover:bg-slate-100/50 transition-colors">
              <div className="bg-white p-3 rounded-xl inline-block shadow-sm text-emerald-600">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-primary font-heading">Affordable Fees</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Quality education shouldn't break the bank. We offer highly competitive fee structures with monthly installments.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl text-left border border-slate-100 space-y-4 hover:bg-slate-100/50 transition-colors">
              <div className="bg-white p-3 rounded-xl inline-block shadow-sm text-blue-600">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-primary font-heading">Regular Test Series</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Weekly mock tests and chapter exams configured according to boards and competitive exam patterns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. ACHIEVEMENTS SECTION */}
      <section id="achievements" className="py-24 bg-bgLight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-primary">
              Our Achievers
            </h2>
            <div className="h-1.5 w-20 bg-secondary mx-auto rounded-full" />
            <p className="text-slate-500 text-sm">
              Meet some of our brightest minds who turned their hard work into stellar scores and rankings.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : achievements.length === 0 ? (
            <div className="text-slate-500 text-center py-10">No achievements published yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {achievements.map((ach) => {
                const photoSrc = ach.photoUrl.startsWith('http')
                  ? ach.photoUrl
                  : `${API_BASE_URL}${ach.photoUrl}`;

                return (
                  <div
                    key={ach._id}
                    className="bg-white rounded-2xl shadow-premium overflow-hidden border border-slate-100 hover:shadow-premiumHover hover:-translate-y-1.5 transition-all duration-300 flex flex-col text-left"
                  >
                    <div className="aspect-[4/3] w-full bg-slate-100 overflow-hidden relative">
                      <img
                        src={photoSrc}
                        alt={ach.studentName}
                        className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=300';
                        }}
                      />
                      <div className="absolute top-4 right-4 bg-secondary text-white font-bold font-stats text-xs px-3 py-1 rounded-full shadow-sm">
                        {ach.class}
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h4 className="text-lg font-bold text-primary font-heading">{ach.studentName}</h4>
                        <div className="text-xs text-slate-400 font-medium">S/O: {ach.fatherName}</div>
                        <p className="text-slate-600 text-xs mt-3 leading-relaxed">
                          {ach.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* See More Link */}
          <div className="text-center mt-12">
            <Link
              to="/achievements"
              className="inline-flex items-center gap-2 font-bold text-primary hover:text-secondary transition-colors group"
            >
              See More Achievements
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-primary">
              Success Stories & Testimonials
            </h2>
            <div className="h-1.5 w-20 bg-secondary mx-auto rounded-full" />
            <p className="text-slate-500 text-sm">
              Hear from our past students and their parents about their learning journey at Vidyarthi Classes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-slate-50 p-8 rounded-2xl text-left border border-slate-100 flex flex-col justify-between">
              <p className="text-slate-600 text-xs italic leading-relaxed">
                "Vidyarthi Classes changed my entire perspective towards mathematics. The tricks taught for class 12 boards helped me score 95% easily. Best coaching in Talwandi area."
              </p>
              <div className="flex items-center gap-3 mt-6">
                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" className="object-cover w-full h-full" alt="student" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-primary font-heading">Kavita Gurjar</h5>
                  <span className="text-xs text-slate-400">Class 12 Alumna</span>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-slate-50 p-8 rounded-2xl text-left border border-slate-100 flex flex-col justify-between">
              <p className="text-slate-600 text-xs italic leading-relaxed">
                "For BSTC preparation in Kota, there is no better coaching than Vidyarthi Classes. The faculty is highly structured, and Rajasthan GK notes are absolute gold."
              </p>
              <div className="flex items-center gap-3 mt-6">
                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100" className="object-cover w-full h-full" alt="student" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-primary font-heading">Rajesh Gurjar</h5>
                  <span className="text-xs text-slate-400">BSTC Rank Holder</span>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-slate-50 p-8 rounded-2xl text-left border border-slate-100 flex flex-col justify-between">
              <p className="text-slate-600 text-xs italic leading-relaxed">
                "The class timings, regular test series, and constant updates regarding pending fees and results to parents kept us stress-free. Truly personalized attention."
              </p>
              <div className="flex items-center gap-3 mt-6">
                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100" className="object-cover w-full h-full" alt="student" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-primary font-heading">Sunita Choudhary</h5>
                  <span className="text-xs text-slate-400">Parent (Class 10 Student)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CONTACT / FOOTER SECTION */}
      <footer id="contact" className="bg-primary text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-left border-b border-white/10 pb-12 mb-8">
            
            {/* Logo and Intro */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <img src={logo} alt="Vidyarthi Classes Logo" className="w-10 h-10 object-contain bg-white rounded-lg p-0.5" />
                <span className="text-xl font-bold font-heading">Vidyarthi Classes</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Kota's most reliable and comprehensive educational classes for academic and vocational preparation.
              </p>
              <div className="flex gap-4">
                <a href="https://www.facebook.com/share/1XUH8C7hK9/" className="p-2 bg-white/5 hover:bg-secondary hover:text-primary rounded-lg transition-colors"><Facebook className="w-4 h-4" /></a>
                <a href="https://www.instagram.com/vdyarthiclasseskota?igsh=MW9ueTRwdXVwZDhkMQ==" className="p-2 bg-white/5 hover:bg-secondary hover:text-primary rounded-lg transition-colors"><Instagram className="w-4 h-4" /></a>
                <a href="https://youtube.com/@vidyarthiclasseskota-m5z?si=m2VbO9T3olhVxkoC" className="p-2 bg-white/5 hover:bg-secondary hover:text-primary rounded-lg transition-colors"><Youtube className="w-4 h-4" /></a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-md font-bold font-heading text-secondary">Quick Links</h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#courses" className="hover:text-white transition-colors">Courses Offered</a></li>
                <li><a href="#achievements" className="hover:text-white transition-colors">Achievers</a></li>
              </ul>
            </div>

            {/* Courses Info */}
            <div className="space-y-4">
              <h4 className="text-md font-bold font-heading text-secondary">Our Classes</h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li>Class 1 to 8</li>
                <li>Class 9 to 10</li>
                <li>Class 11 to 12</li>
                <li>BSTC Entrance Exam</li>
                <li>Rajasthan GK</li>
                <li>Hindi Literature</li>
              </ul>
            </div>

            {/* Contact details */}
            <div className="space-y-4">
              <h4 className="text-md font-bold font-heading text-secondary">Get In Touch</h4>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 shrink-0 text-secondary" />
                  <span>45-A, Rajeev Gandhi Nagar, near Talwandi Circle, Kota (Raj.) - 324005</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 shrink-0 text-secondary" />
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 shrink-0 text-secondary" />
                  <span>info@vidyarthiclasseskota.com</span>
                </li>
              </ul>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
            <p>© 2026 Vidyarthi Classes Kota. All Rights Reserved.</p>
            <p className="mt-2 sm:mt-0">Designed for student success.</p>
          </div>
        </div>
      </footer>

      {/* 9. LOGIN POPUP MODAL */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 sm:p-10 relative transform scale-100 transition-all duration-300">
            
            {/* Close Button */}
            <button
              onClick={() => {
                setIsLoginModalOpen(false);
                setEmailOrId('');
                setPassword('');
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-50 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center space-y-2 mb-8">
              <img src={logo} alt="Vidyarthi Classes Logo" className="w-16 h-16 object-contain mx-auto" />
              <h3 className="text-xl font-extrabold text-primary font-heading">Login Portal</h3>
              <p className="text-slate-400 text-xs">Enter credentials to access your dashboard</p>
            </div>

            {/* Form */}
            <form onSubmit={handlePopupLogin} className="space-y-5 text-left text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wider block">Email or User ID *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={emailOrId}
                    onChange={(e) => setEmailOrId(e.target.value)}
                    placeholder="admin@vidyarthi.com, student ID or teacher ID"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-1 focus:ring-primary text-slate-700 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wider block">Password *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-1 focus:ring-primary text-slate-700 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary-light text-white py-3.5 px-4 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100 text-center text-[10px] text-slate-400 leading-relaxed">
              Admins log in using email.<br />
              Teachers/Students log in using ID (e.g. VK5A1 / TK101) & password.
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default LandingPage;
