import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Sparkles, Send, X, Trash2, ArrowRight, 
  HelpCircle, MessageSquare, ShieldCheck, Globe, Loader2 
} from 'lucide-react';
import { sendChatMessageToGemini } from '../services/aiBot';
import { useLanguage } from '../context/LanguageContext';

export default function AIAssistantModal({ isOpen, onClose }) {
  const { t, effectiveLanguage } = useLanguage();

  // Welcome message based on language
  const getInitialMessage = (lang) => {
    if (lang === 'ru') {
      return "Здравствуйте! Я официальный ИИ-консультант **USMWORLD Travel** 🌍.\n\nЗадайте любой вопрос о наших 50+ турах, визах, скидках, Face ID или онлайн-бронировании. Чем могу помочь?";
    }
    if (lang === 'en') {
      return "Hello! I am the official **USMWORLD Travel AI Assistant** 🌍.\n\nAsk me anything about our 50+ tours, visas, hot discounts, biometric Face ID or online booking. How may I assist you?";
    }
    return "Assalomu alaykum! Men **USMWORLD Travel** sayohat agentligining rasmiy aqlli AI maslahatchisiman 🌍.\n\n50 dan ortiq turlarimiz, viza qoidalari, qaynoq chegirmalar, Face ID yoki to'lov haqida istalgan savolingizni bering. Sizga qanday yordam bera olaman?";
  };

  const [messages, setMessages] = useState(() => [
    {
      id: 'welcome',
      role: 'model',
      text: getInitialMessage(effectiveLanguage),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  // Update initial message when language changes if only welcome message exists
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].id === 'welcome') {
        return [{
          id: 'welcome',
          role: 'model',
          text: getInitialMessage(effectiveLanguage),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }];
      }
      return prev;
    });
  }, [effectiveLanguage]);

  // Suggested prompt chips
  const suggestedChips = effectiveLanguage === 'ru' ? [
    "Нужна ли виза в Дубай гражданам Узбекистана?",
    "Какие туры сейчас идут со скидкой?",
    "Что входит в программу Умра 2026?",
    "Как работает верификация по Face ID?"
  ] : effectiveLanguage === 'en' ? [
    "Do Uzbekistan citizens need a visa to Dubai?",
    "Which tours have active discounts right now?",
    "What is included in the Umrah 2026 package?",
    "How does biometric Face ID verification work?"
  ] : [
    "Dubayga borish uchun viza kerakmi?",
    "Hozir qaysi turlarga chegirmalar bor?",
    "Umra safari 2026 narxi va shartlari?",
    "Face ID orqali bilet olish qanday ishlaydi?"
  ];

  const handleSend = async (textToSend) => {
    const query = (textToSend || inputVal).trim();
    if (!query || loading) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputVal('');
    setLoading(true);

    try {
      const reply = await sendChatMessageToGemini(query, newHistory, effectiveLanguage);
      const botMsg = {
        id: `bot-${Date.now()}`,
        role: 'model',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        text: getInitialMessage(effectiveLanguage),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="relative bg-slate-900 w-full sm:max-w-xl sm:rounded-3xl border border-blue-500/30 shadow-2xl h-[92vh] sm:h-[650px] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border-b border-blue-500/20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-teal-500 p-0.5 shadow-md flex items-center justify-center">
                <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-blue-400 animate-pulse" />
                </div>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-white text-sm tracking-tight flex items-center gap-1">
                  USMWORLD AI Yordamchi
                </h3>
                <span className="px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-blue-500/20 to-teal-500/20 text-teal-300 border border-teal-500/30 rounded-md">
                  Gemini AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {effectiveLanguage === 'ru' 
                  ? "Интеллектуальный онлайн-консультант 24/7" 
                  : effectiveLanguage === 'en' 
                  ? "24/7 Intelligent Travel Consultant" 
                  : "24/7 Aqlli sayohat maslahatchisi"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleClear}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
              title={effectiveLanguage === 'ru' ? "Очистить чат" : effectiveLanguage === 'en' ? "Clear chat" : "Chatni tozalash"}
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-950/40">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-3 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-xs shadow-md shadow-blue-600/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-xs shadow-md'
                }`}>
                  <div className="whitespace-pre-line break-words">
                    {msg.text}
                  </div>
                  <div className={`text-[9px] mt-1.5 ${isUser ? 'text-blue-200 text-right' : 'text-slate-500'}`}>
                    {msg.time}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Loading indicator */}
          {loading && (
            <div className="flex gap-2.5 justify-start animate-fade-in">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-xs p-3 text-xs text-slate-400 flex items-center gap-2">
                <span>{effectiveLanguage === 'ru' ? "AI думает и готовит ответ..." : effectiveLanguage === 'en' ? "AI is analyzing your request..." : "AI tahlil qilmoqda..."}</span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggested Chips (show when few messages) */}
        {messages.length <= 3 && !loading && (
          <div className="px-3 py-2 bg-slate-900/90 border-t border-slate-800/80 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {suggestedChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip)}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-blue-600/20 text-slate-300 hover:text-blue-300 border border-slate-700/60 text-[11px] whitespace-nowrap transition active:scale-95 text-left"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* Input Form */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={
                effectiveLanguage === 'ru'
                  ? "Напишите ваш вопрос (туры, визы, скидки)..."
                  : effectiveLanguage === 'en'
                  ? "Type your question (tours, visas, booking)..."
                  : "Savolingizni yozing (turlar, viza, narxlar)..."
              }
              className="flex-1 bg-slate-800/90 border border-slate-700 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none"
            />

            <button
              type="submit"
              disabled={!inputVal.trim() || loading}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
            >
              <span>{effectiveLanguage === 'ru' ? "Отправить" : effectiveLanguage === 'en' ? "Send" : "Yuborish"}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
