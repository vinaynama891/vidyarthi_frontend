import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  BookOpen,
  Wifi,
  Users,
  Video,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ArrowRight,
  MonitorPlay,
  MapPinOff
} from 'lucide-react';

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bgLight flex flex-col font-sans text-left">
      
      {/* 1. NAVBAR (Reusable Header) */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 cursor-pointer">
              <div className="bg-gradient-to-tr from-primary to-secondary p-2.5 rounded-xl shadow-md">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-bold font-heading text-primary leading-none block">
                  Vidyarthi Classes
                </span>
                <span className="text-xs font-semibold tracking-widest text-secondary uppercase font-stats mt-0.5 block">
                  Kota
                </span>
              </div>
            </Link>

            {/* Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-slate-600 hover:text-primary font-medium transition-colors text-sm">Home</Link>
              <Link to="/about" className="text-primary font-bold transition-colors text-sm">About</Link>
              <a href="/#courses" className="text-slate-600 hover:text-primary font-medium transition-colors text-sm">Courses</a>
              <a href="/#achievements" className="text-slate-600 hover:text-primary font-medium transition-colors text-sm">Achievements</a>
              <Link to="/study-material" className="text-slate-600 hover:text-primary font-medium transition-colors text-sm">Study Material</Link>
            </div>

            {/* Back Button */}
            <div>
              <Link
                to="/"
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-primary bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-all duration-200"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. ABOUT US CONTENT SECTION */}
      <main className="flex-1 py-16 md:py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section title */}
          <div className="space-y-3 mb-16 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-secondary font-stats block">
              Know Our Methodology
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading text-primary relative inline-block">
              About Vidyarthi Classes Kota
              <span className="block h-1.5 w-32 bg-secondary mt-2.5 rounded-full mx-auto md:mx-0" />
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left side: YouTube Link / Image Embed */}
            <div className="lg:col-span-6 space-y-6">
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-premium border border-slate-100 bg-slate-950 group">
                {/* YouTube Video Player Embed */}
                {/* NOTE: You can replace 'y8yvQ5V3V3s' with your exact video code */}
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/y8yvQ5V3V3s?si=education-channel"
                  title="Vidyarthi Classes Kota - Classroom Tour"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-5 bg-bgLight rounded-2xl border border-slate-100 flex items-center gap-3">
                <Youtube className="w-6 h-6 text-red-650 shrink-0" />
                <p className="text-slate-500 text-[11px] font-semibold leading-relaxed">
                  Watch our digital classroom facility, library access, and interaction with expert faculties in Kota.
                </p>
              </div>
            </div>

            {/* Right side: Online + Offline Coaching info */}
            <div className="lg:col-span-6 space-y-8">
              {/* Introduction */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-primary font-heading">
                  Kota's Hybrid Learning Revolution
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  At **Vidyarthi Classes Kota**, we bridge the gap between traditional classroom attention and modern online flexibility. Whether you prefer the energy of physical classrooms or the comfort of remote studying, we deliver an uncompromised learning experience.
                </p>
              </div>

              {/* OFFLINE SECTION */}
              <div className="flex gap-4 items-start">
                <div className="bg-primary/5 p-3 rounded-2xl text-primary shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div className="space-y-2">
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
                  <Wifi className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-base font-extrabold text-primary font-heading">
                    Next-Gen Online Coaching
                  </h4>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    For students studying remotely across Rajasthan, we deliver high-definition live lectures via our digital portal. Students have access to recorded session archives, direct online doubt-clearing panels, e-book worksheets, and real-time scorecard dashboards. Our online courses for Rajasthan GK and Hindi Literature are highly sought after by state-exam aspirants.
                  </p>
                </div>
              </div>

              {/* Success list */}
              <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Interactive Smartboards</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Kota Faculty Notes</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Doubt Portal Support</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Mock Scorecards</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>

      {/* 3. REUSABLE FOOTER */}
      <footer id="contact" className="bg-primary text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-left border-b border-white/10 pb-12 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="bg-secondary p-2 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xl font-bold font-heading">Vidyarthi Classes</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Kota's most reliable and comprehensive educational classes for academic and vocational preparation.
              </p>
              <div className="flex gap-4">
                <a href="#" className="p-2 bg-white/5 hover:bg-secondary hover:text-primary rounded-lg transition-colors"><Facebook className="w-4 h-4" /></a>
                <a href="#" className="p-2 bg-white/5 hover:bg-secondary hover:text-primary rounded-lg transition-colors"><Twitter className="w-4 h-4" /></a>
                <a href="#" className="p-2 bg-white/5 hover:bg-secondary hover:text-primary rounded-lg transition-colors"><Instagram className="w-4 h-4" /></a>
                <a href="#" className="p-2 bg-white/5 hover:bg-secondary hover:text-primary rounded-lg transition-colors"><Youtube className="w-4 h-4" /></a>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-md font-bold font-heading text-secondary">Quick Links</h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><a href="/#courses" className="hover:text-white transition-colors">Courses Offered</a></li>
                <li><a href="/#achievements" className="hover:text-white transition-colors">Achievers</a></li>
              </ul>
            </div>

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

    </div>
  );
};

export default AboutPage;
