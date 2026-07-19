import React, { useEffect, useState, useRef } from 'react';
import { X, Lock, FileText, Image } from 'lucide-react';

const PDFPageKeyed = ({ pdf, pageNumber }) => {
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    pdf.getPage(pageNumber).then((page) => {
      if (!active) return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext('2d');
      // Scale is set to 1.5 for crisp rendering on mobile screens
      const viewport = page.getViewport({ scale: 1.5 });

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      page.render(renderContext).promise.then(() => {
        if (active) setLoading(false);
      });
    });

    return () => {
      active = false;
    };
  }, [pdf, pageNumber]);

  return (
    <div className="bg-white p-1 rounded-xl shadow-md max-w-full relative flex items-center justify-center">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/5 rounded-lg">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <canvas ref={canvasRef} className="max-w-full h-auto rounded-lg shadow-sm" />
    </div>
  );
};

const CanvasPDFViewer = ({ fileUrl }) => {
  const [pdf, setPdf] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    const initPdfJs = (pdfjsLib) => {
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
      pdfjsLib.getDocument(fileUrl).promise.then(
        (loadedPdf) => {
          if (!active) return;
          setPdf(loadedPdf);
          setNumPages(loadedPdf.numPages);
          setLoading(false);
        },
        (err) => {
          if (!active) return;
          console.error('Error loading PDF:', err);
          setError('Failed to load PDF. Please try again.');
          setLoading(false);
        }
      );
    };

    if (window.pdfjsLib) {
      initPdfJs(window.pdfjsLib);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';
    script.onload = () => {
      if (window.pdfjsLib) {
        initPdfJs(window.pdfjsLib);
      }
    };
    script.onerror = () => {
      if (active) {
        setError('Failed to load PDF viewer scripts.');
        setLoading(false);
      }
    };
    document.body.appendChild(script);

    return () => {
      active = false;
    };
  }, [fileUrl]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400 gap-3">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold">Opening document inside website...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-rose-450 text-xs font-semibold gap-2">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full overflow-y-auto bg-slate-950 p-2 sm:p-4 space-y-4 flex flex-col items-center select-none pointer-events-auto">
      {pdf && Array.from({ length: numPages }, (_, i) => i + 1).map((pageNumber) => (
        <PDFPageKeyed key={pageNumber} pdf={pdf} pageNumber={pageNumber} />
      ))}
    </div>
  );
};

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
          
          {/* Watermark Overlay */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16 items-center justify-items-center p-8 z-20">
            {watermarks}
          </div>

          {/* Content Render */}
          <div className="w-full h-full flex items-center justify-center p-1 select-none pointer-events-auto">
            {isPdf ? (
              <CanvasPDFViewer fileUrl={fileUrl} />
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
