import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { API_BASE_URL } from '../../context/AuthContext';
import {
  ArrowLeft,
  Phone,
  User,
  Star,
  CheckCircle,
  HelpCircle,
  Loader2
} from 'lucide-react';
import logo from '../../assets/logo.png';

const EnquiryPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    studentName: '',
    fatherName: '',
    mobileNumber: '',
    title: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { studentName, fatherName, mobileNumber, title, description } = form;
    if (!studentName || !fatherName || !mobileNumber || !title || !description) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch(`${API_BASE_URL}/api/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const contentType = res.headers.get('content-type');
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        setIsSubmitting(false);
        throw new Error('Server returned a non-JSON response. Please verify if your local backend server is running and configured correctly.');
      }

      setIsSubmitting(false);

      if (!res.ok) {
        throw new Error(data.message || 'Submission failed');
      }

      showToast('Your Enquiry has been submitted successfully!', 'success');
      setForm({
        studentName: '',
        fatherName: '',
        mobileNumber: '',
        title: '',
        description: ''
      });
      // Redirect back to landing page after submission
      navigate('/');
    } catch (err) {
      setIsSubmitting(false);
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-bgLight flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm flex items-center justify-between px-6 h-20 shrink-0">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
          <img src={logo} alt="Vidyarthi Classes Logo" className="w-10 h-10 object-contain" />
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-primary font-heading leading-none block">
              Vidyarthi Classes Kota
            </h1>
            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest font-stats mt-0.5 block">
              Admission Enquiry
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-slate-550 hover:text-primary transition-colors text-xs font-semibold px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-grow flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
        {/* Background Decorative Blobs */}
        <div className="absolute top-1/4 right-0 -z-10 w-80 h-80 bg-gradient-to-bl from-secondary/10 via-primary/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 -z-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

        <div className="w-full max-w-5xl bg-white border border-slate-100 rounded-3xl shadow-premium overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch animate-fadeIn">
          {/* Info Side Panel */}
          <div className="lg:col-span-5 bg-primary text-white p-8 md:p-12 flex flex-col justify-between space-y-12 text-left relative overflow-hidden">
            {/* Background vector lines / details */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-bl-[100px] -z-10" />

            <div className="space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold tracking-wider text-secondary uppercase bg-white/10 rounded-full border border-white/20">
                <Star className="w-3.5 h-3.5 fill-current" /> Admission Open 2026
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-heading leading-tight">
                Empowering Students to Achieve Excellence
              </h2>
              <p className="text-slate-305 text-xs leading-relaxed">
                Connect with Kota's premium mentors. Fill out this simple enquiry form, and our counselor will call you within 24 hours to guide you.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-xs font-semibold">Personalized Mentorship Programs</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-xs font-semibold">Strong Concept-Building Approach</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-xs font-semibold">Regular Tests & Detailed Reports</span>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6 mt-8 text-xs text-slate-400">
              📞 Call Counselor: <strong className="text-white">+91 97030 40756</strong>
            </div>
          </div>

          {/* Form Side Panel */}
          <div className="lg:col-span-7 p-8 md:p-12 space-y-6 text-left">
            <div>
              <h3 className="text-xl font-extrabold text-primary font-heading">Enquiry Registry</h3>
              <p className="text-slate-400 text-xs">Enter candidate details and your query below.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wider block">Student Name *</label>
                  <input
                    type="text"
                    required
                    value={form.studentName}
                    onChange={(e) => setForm(prev => ({ ...prev, studentName: e.target.value }))}
                    placeholder="Enter student's full name"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-1 focus:ring-primary text-slate-700 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wider block">Father's Name *</label>
                  <input
                    type="text"
                    required
                    value={form.fatherName}
                    onChange={(e) => setForm(prev => ({ ...prev, fatherName: e.target.value }))}
                    placeholder="Enter father's name"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-1 focus:ring-primary text-slate-700 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wider block">Mobile Number *</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                      <Phone className="w-4 h-4" />
                    </span>
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      value={form.mobileNumber}
                      onChange={(e) => setForm(prev => ({ ...prev, mobileNumber: e.target.value }))}
                      placeholder="10-digit mobile number"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-1 focus:ring-primary text-slate-700 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wider block">Subject / Enquiry Title *</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Admission for Class 10 Batch"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-1 focus:ring-primary text-slate-700 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase tracking-wider block">Enquiry Details / Query *</label>
                <textarea
                  required
                  rows="4"
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Ask questions about syllabus, timings, fee discounts, class formats..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-1 focus:ring-primary text-slate-700 font-medium resize-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-secondary hover:bg-secondary-dark text-white py-4 px-4 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 mt-4"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting Your Enquiry...
                  </>
                ) : (
                  'Submit Enquiry Form'
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EnquiryPage;
