import React, { useState, useRef, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AIAssistantFloatingButton({ onClick }) {
  const { effectiveLanguage } = useLanguage();

  // Button position state (defaults to bottom-right above bottom navigation)
  const [position, setPosition] = useState(() => {
    // Initial safe default on right side
    const defaultX = typeof window !== 'undefined' ? Math.max(16, window.innerWidth - 180) : 200;
    const defaultY = typeof window !== 'undefined' ? Math.max(100, window.innerHeight - 150) : 500;
    return { x: defaultX, y: defaultY };
  });

  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef(null);
  const dragData = useRef({
    startX: 0,
    startY: 0,
    elemStartX: 0,
    elemStartY: 0,
    hasMoved: false
  });

  const label = 
    effectiveLanguage === 'ru' ? "AI Помощник" :
    effectiveLanguage === 'en' ? "AI Assistant" :
    "AI Yordamchi";

  // Clamp position within screen bounds
  const clampPosition = (x, y) => {
    const btnWidth = dragRef.current ? dragRef.current.offsetWidth : 160;
    const btnHeight = dragRef.current ? dragRef.current.offsetHeight : 54;
    const minX = 10;
    const maxX = Math.max(10, window.innerWidth - btnWidth - 10);
    const minY = 60; // Below header
    const maxY = Math.max(60, window.innerHeight - btnHeight - 80); // Above bottom nav
    return {
      x: Math.min(Math.max(x, minX), maxX),
      y: Math.min(Math.max(y, minY), maxY)
    };
  };

  // Adjust on screen resize
  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => clampPosition(prev.x, prev.y));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // TOUCH EVENTS (Mobile)
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    dragData.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      elemStartX: position.x,
      elemStartY: position.y,
      hasMoved: false
    };
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragData.current.startX;
    const deltaY = touch.clientY - dragData.current.startY;

    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      dragData.current.hasMoved = true;
    }

    const nextX = dragData.current.elemStartX + deltaX;
    const nextY = dragData.current.elemStartY + deltaY;
    setPosition(clampPosition(nextX, nextY));
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (!dragData.current.hasMoved) {
      onClick?.();
    }
  };

  // MOUSE EVENTS (Desktop)
  const handleMouseDown = (e) => {
    e.preventDefault();
    dragData.current = {
      startX: e.clientX,
      startY: e.clientY,
      elemStartX: position.x,
      elemStartY: position.y,
      hasMoved: false
    };
    setIsDragging(true);

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - dragData.current.startX;
      const deltaY = moveEvent.clientY - dragData.current.startY;

      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        dragData.current.hasMoved = true;
      }

      const nextX = dragData.current.elemStartX + deltaX;
      const nextY = dragData.current.elemStartY + deltaY;
      setPosition(clampPosition(nextX, nextY));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);

      if (!dragData.current.hasMoved) {
        onClick?.();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={dragRef}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        touchAction: 'none',
        zIndex: 45
      }}
      className={`select-none transition-shadow ${isDragging ? 'scale-105 opacity-90' : 'animate-fade-in'}`}
    >
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        className="group relative cursor-grab active:cursor-grabbing flex items-center gap-2.5 pl-2.5 pr-3.5 py-2 bg-gradient-to-r from-blue-700 via-indigo-700 to-teal-600 hover:from-blue-600 hover:to-teal-500 text-white rounded-full shadow-2xl shadow-blue-500/40 border-2 border-teal-300/40 backdrop-blur-md transition-transform active:scale-95"
        title="USMWORLD AI Yordamchi (Istalgan joyga surishingiz mumkin)"
      >
        {/* Pulsing online status ring */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 pointer-events-none">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-slate-900"></span>
        </span>

        {/* CUTE ANIMATED AI ROBOT SMILE AVATAR */}
        <div className="relative w-10 h-10 rounded-full bg-slate-950/80 border border-teal-400/40 p-1 flex items-center justify-center shrink-0 shadow-inner overflow-hidden">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full transform transition-transform group-hover:scale-110"
          >
            {/* Robot Head Outer */}
            <defs>
              <linearGradient id="robotHeadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#14b8a6" />
              </linearGradient>
              <linearGradient id="eyeGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>
            </defs>

            {/* Antenna with pulsing light */}
            <line x1="50" y1="20" x2="50" y2="8" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
            <circle cx="50" cy="8" r="5" fill="#facc15" className="animate-pulse" />

            {/* Ears / Head bolts */}
            <rect x="12" y="42" width="6" height="18" rx="3" fill="#0284c7" />
            <rect x="82" y="42" width="6" height="18" rx="3" fill="#0284c7" />

            {/* Robot Head Box */}
            <rect x="18" y="20" width="64" height="60" rx="18" fill="url(#robotHeadGrad)" stroke="#e0f2fe" strokeWidth="2.5" />

            {/* Robot Face Screen (Dark) */}
            <rect x="25" y="29" width="50" height="42" rx="12" fill="#090d16" />

            {/* Smiling / Happy Eyes (Arches) */}
            <path
              d="M 32 46 Q 38 38 44 46"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M 56 46 Q 62 38 68 46"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Sweet Happy Smile Mouth */}
            <path
              d="M 40 56 Q 50 67 60 56"
              fill="none"
              stroke="#4ade80"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Cute Rosy Cheeks */}
            <circle cx="31" cy="54" r="3" fill="#f43f5e" opacity="0.8" />
            <circle cx="69" cy="54" r="3" fill="#f43f5e" opacity="0.8" />
          </svg>
        </div>

        {/* Text Info */}
        <div className="text-left pointer-events-none">
          <div className="text-[9px] font-black uppercase tracking-wider text-teal-200 leading-none flex items-center gap-1">
            <span>Gemini AI</span>
            <Sparkles className="w-2.5 h-2.5 text-amber-300 animate-pulse" />
          </div>
          <div className="text-xs font-black tracking-tight text-white leading-tight mt-0.5 whitespace-nowrap">
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}
