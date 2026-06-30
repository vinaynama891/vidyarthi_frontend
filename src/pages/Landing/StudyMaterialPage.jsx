import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Lock, Unlock, Download, ArrowLeft, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../context/AuthContext';
import logo from '../../assets/logo.png';
import SecureViewerModal from '../../components/SecureViewerModal';

const StudyMaterialPage = () => {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    const fetchPublicMaterials = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/study-materials/public`);
        if (!response.ok) {
          throw new Error('Failed to fetch study materials');
        }
        const data = await response.json();
        setMaterials(data);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Error loading study materials');
      } finally {
        setLoading(false);
      }
    };
    fetchPublicMaterials();
  }, []);

  // Group classes to populate tabs/filters
  const classesList = ['All Classes', ...new Set(materials.map(m => m.targetClass))].filter(c => c !== 'All');

  // Filter materials based on selected class
  const filteredMaterials = selectedClass === 'All Classes'
    ? materials
    : materials.filter(m => m.targetClass === selectedClass || m.targetClass === 'All');

  // Group materials by targetClass for class-wise display
  const materialsByClass = filteredMaterials.reduce((groups, material) => {
    const groupKey = material.targetClass;
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(material);
    return groups;
  }, {});

  const handleLockedClick = (material) => {
    const whatsappNumber = '919703040756';
    const text = `Hi, I want to Buy the study material "${material.title}" for class "${material.targetClass}". Please guide me on payment.`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-bgLight flex flex-col font-sans">
      {/* 1. NAVBAR */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 cursor-pointer">
              <img src={logo} alt="Vidyarthi Classes Logo" className="w-12 h-12 object-contain" />
              <div>
                <span className="text-xl sm:text-2xl font-bold font-heading text-primary leading-none block">
                  Vidyarthi Classes
                </span>
                <span className="text-xs font-semibold tracking-widest text-secondary uppercase font-stats mt-0.5 block">
                  Kota
                </span>
              </div>
            </Link>

            {/* Back Button */}
            <div>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-primary bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. HERO HEADER */}
      <section className="relative py-12 md:py-16 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-bgLight text-center">
        <div className="absolute top-0 right-0 -z-10 w-2/3 h-2/3 bg-gradient-to-bl from-secondary/5 via-primary/5 to-transparent rounded-bl-[200px]" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold tracking-wider text-secondary uppercase bg-secondary/10 rounded-full border border-secondary/20">
            <BookOpen className="w-3.5 h-3.5" /> High-Quality Notes & Study Materials
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-primary leading-tight">
            Class-Wise Study Material
          </h1>
          <p className="text-slate-500 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Get access to Kota's best notes compiled by expert educators. Check out our free preview notes and unlock more!
          </p>
        </div>
      </section>

      {/* 3. MAIN SECTION */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-slate-400 font-semibold text-sm">Loading study materials...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 space-y-4">
            <p className="text-danger font-bold text-lg">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-light rounded-xl transition-all"
            >
              Retry Loading
            </button>
          </div>
        ) : Object.keys(materialsByClass).length === 0 ? (
          <div className="text-center py-20 text-slate-400 font-semibold">
            No study materials are uploaded yet. Please check back later.
          </div>
        ) : (
          <div className="space-y-12">
            {/* Class tabs / filters */}
            {classesList.length > 1 && (
              <div className="flex flex-wrap gap-2 justify-center pb-4 border-b border-slate-100">
                {classesList.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedClass(c)}
                    className={`px-5 py-2 text-sm font-semibold rounded-xl border transition-all duration-200 cursor-pointer ${
                      selectedClass === c
                        ? 'bg-primary text-white border-primary shadow-md'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-350 hover:bg-slate-50'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}

            {/* Display grouped materials */}
            {Object.keys(materialsByClass).map((className) => (
              <div key={className} className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-150 pb-2.5">
                  <div className="w-2.5 h-6 bg-secondary rounded-full" />
                  <h2 className="text-xl sm:text-2xl font-black text-primary font-heading uppercase tracking-wide">
                    {className}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {materialsByClass[className].map((item) => (
                    <div
                      key={item._id}
                      className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
                    >
                      <div className="p-6 space-y-4">
                        <div className="flex justify-between items-start gap-2">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              item.isFree
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                : 'bg-slate-100 text-slate-500 border border-slate-200'
                            }`}
                          >
                            {item.isFree ? (
                              <>
                                <Unlock className="w-3 h-3" /> Free Notes
                              </>
                            ) : (
                              <>
                                <Lock className="w-3 h-3 text-slate-400" /> Locked Notes
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
                        {item.isFree ? (
                          <button
                            onClick={() => setSelectedNote(item)}
                            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                          >
                            <BookOpen className="w-4 h-4" /> View Material
                          </button>
                        ) : (
                          <button
                            onClick={() => handleLockedClick(item)}
                            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-white bg-primary hover:bg-primary-light rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                          >
                            <Lock className="w-4 h-4" /> Buy Notes (WhatsApp)
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Secure Viewer Modal */}
      {selectedNote && (
        <SecureViewerModal
          isOpen={!!selectedNote}
          onClose={() => setSelectedNote(null)}
          fileUrl={selectedNote.fileUrl.startsWith('http') ? selectedNote.fileUrl : `${API_BASE_URL}${selectedNote.fileUrl}`}
          title={selectedNote.title}
          student={null}
        />
      )}

      {/* 4. FOOTER */}
      <footer className="bg-primary text-white py-8 border-t border-slate-800 text-center text-xs mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-slate-400 font-medium">
            &copy; {new Date().getFullYear()} Vidyarthi Classes, Kota. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default StudyMaterialPage;
