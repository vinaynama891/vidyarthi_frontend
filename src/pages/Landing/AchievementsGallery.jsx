import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { API_BASE_URL } from '../../context/AuthContext';

const AchievementsGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/gallery`);
        if (response.ok) {
          const data = await response.json();
          setPhotos(data);
        }
      } catch (err) {
        console.error('Error fetching gallery:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans">
      
      {/* Header */}
      <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-secondary" />
            <h1 className="text-lg sm:text-xl font-bold font-heading">Achievements Gallery</h1>
          </div>
          <div className="w-20" /> {/* Spacer */}
        </div>
      </header>

      {/* Main Gallery Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : photos.length === 0 ? (
          <div className="text-slate-400 text-center py-32 flex flex-col items-center gap-3">
            <ImageIcon className="w-12 h-12 text-slate-600" />
            <p>No gallery images uploaded yet by administrator.</p>
          </div>
        ) : (
          /* Masonry Grid */
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
            {photos.map((photo) => {
              const src = photo.photoUrl.startsWith('http')
                ? photo.photoUrl
                : `${API_BASE_URL}${photo.photoUrl}`;

              return (
                <div
                  key={photo._id}
                  className="break-inside-avoid bg-slate-950 rounded-xl overflow-hidden shadow-2xl border border-slate-800 hover:border-slate-700 transition-all duration-300 group"
                >
                  <img
                    src={src}
                    alt="Vidyarthi Classes Achiever"
                    className="w-full h-auto object-contain max-h-[85vh] block transition-transform duration-500 group-hover:scale-[1.01]"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600';
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Mini Footer */}
      <footer className="bg-slate-950 text-slate-500 text-center py-6 text-xs border-t border-slate-900">
        © 2026 Vidyarthi Classes Kota. Photo Gallery.
      </footer>

    </div>
  );
};

export default AchievementsGallery;
