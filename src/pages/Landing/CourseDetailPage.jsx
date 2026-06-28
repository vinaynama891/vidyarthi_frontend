import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BookOpen, Image as ImageIcon, FileText, ArrowLeft, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

const CourseDetailPage = () => {
  const { courseName } = useParams();
  const decodedCourseName = decodeURIComponent(courseName);
  const navigate = useNavigate();

  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoursePageData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/courses/${courseName}`);
        if (!response.ok) {
          throw new Error('Failed to fetch course details');
        }
        const data = await response.json();
        setPageData(data);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Error loading course details');
      } finally {
        setLoading(false);
      }
    };
    fetchCoursePageData();
  }, [courseName]);

  // Group contiguous blocks of same type for layout rendering
  const groupBlocks = (blocks) => {
    if (!blocks || blocks.length === 0) return [];
    
    const groups = [];
    let currentGroup = null;

    blocks.forEach((block) => {
      if (!currentGroup) {
        currentGroup = {
          type: block.type,
          items: [block]
        };
      } else if (block.type === currentGroup.type && (block.type === 'card' || block.type === 'image')) {
        currentGroup.items.push(block);
      } else {
        groups.push(currentGroup);
        currentGroup = {
          type: block.type,
          items: [block]
        };
      }
    });

    if (currentGroup) {
      groups.push(currentGroup);
    }

    return groups;
  };

  const blockGroups = pageData ? groupBlocks(pageData.blocks) : [];

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
      <section className="relative py-12 md:py-16 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-bgLight text-center border-b border-slate-100">
        <div className="absolute top-0 right-0 -z-10 w-2/3 h-2/3 bg-gradient-to-bl from-secondary/5 via-primary/5 to-transparent rounded-bl-[200px]" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold tracking-wider text-secondary uppercase bg-secondary/10 rounded-full border border-secondary/20">
            <BookOpen className="w-3.5 h-3.5" /> Premium Course Curriculum
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-primary leading-tight">
            {decodedCourseName}
          </h1>
          <p className="text-slate-500 text-sm max-w-xl mx-auto">
            Explore the structured coursework, study materials, and key facilities available for {decodedCourseName} at Vidyarthi Classes Kota.
          </p>
        </div>
      </section>

      {/* 3. DYNAMIC CONTENT BLOCKS */}
      <main className="flex-grow max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 text-left">
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-700 max-w-md mx-auto">
            <p className="font-bold">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-650 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all"
            >
              Retry loading
            </button>
          </div>
        ) : !pageData || pageData.blocks.length === 0 ? (
          <div className="text-slate-455 py-24 text-center text-sm font-semibold border border-dashed border-slate-200 bg-white rounded-3xl flex flex-col items-center justify-center gap-3">
            <BookOpen className="w-12 h-12 text-slate-350" />
            <p className="text-slate-500 text-base">Course syllabus details are currently being customized by the Admin.</p>
            <p className="text-xs text-slate-400">Please check back soon for timings, details, and schedules.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {blockGroups.map((group, gIdx) => {
              if (group.type === 'paragraph') {
                return (
                  <div key={gIdx} className="space-y-6">
                    {group.items.map((block) => (
                      <div key={block._id} className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-premium hover:shadow-premiumHover transition-all duration-300 space-y-3">
                        {block.title && (
                          <h3 className="text-xl font-extrabold text-primary font-heading border-b border-slate-50 pb-2">
                            {block.title}
                          </h3>
                        )}
                        {block.content && (
                          <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                            {block.content}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                );
              }

              if (group.type === 'image') {
                return (
                  <div key={gIdx} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {group.items.map((block) => {
                      const imageUrl = block.photoUrl 
                        ? (block.photoUrl.startsWith('http') ? block.photoUrl : `${API_BASE_URL}${block.photoUrl}`)
                        : null;
                      return (
                        <div key={block._id} className="bg-white border border-slate-100 rounded-3xl p-4 shadow-premium hover:shadow-premiumHover transition-all duration-300 flex flex-col items-center justify-between group overflow-hidden">
                          {imageUrl && (
                            <div className="w-full h-48 rounded-2xl overflow-hidden bg-slate-50 border border-slate-150">
                              <img
                                src={imageUrl}
                                alt={block.title || 'Course Image'}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                          {block.title && (
                            <p className="mt-3 text-xs font-bold text-slate-500 uppercase tracking-wide text-center truncate w-full">
                              {block.title}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              }

              if (group.type === 'card') {
                return (
                  <div key={gIdx} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {group.items.map((block) => {
                      const imageUrl = block.photoUrl 
                        ? (block.photoUrl.startsWith('http') ? block.photoUrl : `${API_BASE_URL}${block.photoUrl}`)
                        : null;
                      return (
                        <div key={block._id} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-premium hover:shadow-premiumHover transition-all duration-300 flex flex-col justify-between min-h-[240px]">
                          <div className="space-y-4">
                            {imageUrl && (
                              <div className="w-full h-36 rounded-2xl overflow-hidden border border-slate-150 bg-slate-50 shrink-0">
                                <img
                                  src={imageUrl}
                                  alt={block.title || 'Card Cover'}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="space-y-1.5">
                              {block.title && (
                                <h4 className="text-sm font-extrabold text-primary font-heading line-clamp-1">
                                  {block.title}
                                </h4>
                              )}
                              {block.content && (
                                <p className="text-slate-500 text-[11px] leading-relaxed whitespace-pre-wrap line-clamp-4">
                                  {block.content}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              }

              return null;
            })}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 mt-12 text-center text-xs">
        <p>© 2026 Vidyarthi Classes Kota. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default CourseDetailPage;
