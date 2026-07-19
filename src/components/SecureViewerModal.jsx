import React, { useEffect, useState } from 'react';
import { X, Lock, FileText, Image, ShieldAlert } from 'lucide-react';

const SecureViewerModal = ({ isOpen, onClose, fileUrl, title, student }) => {

  useEffect(() => {
    if (!isOpen) return;

    // Print prevention style
    const style = document.createElement('style');
    style.id = 'secure-viewer-print-styles';
    style.innerHTML = `
      @media print {
        body, #root, .secure-viewer-modal-overlay {
          display: none !important;
        }
      }
      .no-select {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
    `;
    document.head.appendChild(style);

    // Prevent copy/right-click globally while open
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    const handleKeyDown = (e) => {
      // Disable Ctrl+S, Ctrl+P, Ctrl+C, Ctrl+X, Ctrl+U, PrintScreen, F12
      if (
        (e.ctrlKey && (e.key === 's' || e.key === 'p' || e.key === 'u' || e.key === 'c' || e.key === 'x')) ||
        e.key === 'PrintScreen' ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'C' || e.key === 'c' || e.key === 'J' || e.key === 'j'))
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      const el = document.getElementById('secure-viewer-print-styles');
      if (el) el.remove();

      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isPdf = fileUrl && fileUrl.toLowerCase().split('?')[0].endsWith('.pdf');
  
  // Format watermark details
  const watermarkText = student && student.name
    ? `${student.name} (${student.studentId || 'STUDENT'}) - ${student.phone} - Vidyarthi Classes`
    : 'Public Preview - Vidyarthi Classes';

  // Generate 24 watermarks for a grid layout
  const watermarks = Array.from({ length: 24 }).map((_, index) => (
    <div
      key={index}
      className="select-none font-extrabold text-slate-500/10 text-[9px] md:text-[11px] transform -rotate-30 whitespace-nowrap pointer-events-none no-select uppercase tracking-wider"
    >
      {watermarkText}
    </div>
  ));

  return (
    <div 
      className="fixed inset-0 z-[200] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fadeIn no-select"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="relative w-full max-w-5xl h-[92vh] bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800 z-30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
              {isPdf ? <FileText className="w-5 h-5" /> : <Image className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-snug line-clamp-1">{title}</h3>
              <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-500" /> Protected Learning Environment
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all duration-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Viewer Viewport */}
        <div className="flex-grow relative flex items-center justify-center bg-slate-950 overflow-hidden z-20">
          
          {/* Watermark Overlay (Pointer events none allows scroll/clicks to pass through) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16 items-center justify-items-center p-8 z-20">
            {watermarks}
          </div>

          {/* Content Render */}
          <div className="w-full h-full flex items-center justify-center p-1 select-none pointer-events-auto">
            {isPdf ? (
              <iframe
                src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                className="w-full h-full border-none select-none"
                title={title}
              />
            ) : (
              <div 
                className="w-full h-full flex items-center justify-center p-4 bg-slate-900/40"
                onDragStart={(e) => e.preventDefault()}
              >
                <img
                  src={fileUrl}
                  alt={title}
                  className="max-w-full max-h-full object-contain rounded-lg select-none pointer-events-none shadow-lg"
                  draggable="false"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecureViewerModal;
