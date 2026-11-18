import React from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AIAssistantFloatingButton({ onClick }) {
  const { effectiveLanguage } = useLanguage();

  const label = 
    effectiveLanguage === 'ru' ? "AI Помощник" :
    effectiveLanguage === 'en' ? "AI Assistant" :
    "AI Yordamchi";

  return (
    <div className="fixed bottom-18 right-4 z-40 animate-fade-in">
      <button
        onClick={onClick}
        className="group relative flex items-center gap-2 pl-3 pr-4 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white rounded-2xl shadow-xl shadow-blue-600/30 hover:shadow-blue-500/50 transition-all duration-300 active:scale-95 border border-white/20"
        title="USMWORLD Gemini AI Yordamchi"
      >
        {/* Glowing aura ping */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-300"></span>
        </span>

        <div className="w-7 h-7 rounded-xl bg-slate-900/60 backdrop-blur-sm flex items-center justify-center shrink-0">
          <Bot className="w-4 h-4 text-teal-300 group-hover:rotate-12 transition-transform" />
        </div>

        <div className="text-left">
          <div className="text-[9px] font-black uppercase tracking-wider text-teal-200 leading-none flex items-center gap-1">
            <span>Gemini AI</span>
            <Sparkles className="w-2.5 h-2.5 text-amber-300 animate-pulse" />
          </div>
          <div className="text-xs font-black tracking-tight text-white leading-tight">
            {label}
          </div>
        </div>
      </button>
    </div>
  );
}
