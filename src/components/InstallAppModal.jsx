import React, { useState, useEffect } from 'react';
import { X, Smartphone, Download, CheckCircle2, ShieldCheck, Play, ArrowRight, Share2, Layers, Cpu, AlertTriangle } from 'lucide-react';

export default function InstallAppModal({ onClose }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [activeTab, setActiveTab] = useState('direct'); // 'direct', 'android-studio'

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert("Ilovani mobil telefonga xatosiz o'rnatish uchun:\n\n1. Telefoningizda Google Chrome yoki Safari brauzerini oching\n2. Sayt manziliga kiring\n3. Brauzer menyusidagi 3 ta nuqta (⋮) yoki 'Ulashish' tugmasini bosing\n4. 'Ilovani o'rnatish' yoki 'Bosh ekranga qo'shish' (Add to Home screen) bandini tanlang.\n\nShunda Android tizimi avtomatik tarzda rasmiy WebAPK yaratib, telefonga o'rnatadi!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative bg-slate-900 w-full sm:max-w-lg rounded-3xl border border-emerald-500/40 shadow-2xl p-5 space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-0.5 overflow-hidden flex items-center justify-center">
              <img 
                src="/USMWORLD.png" 
                alt="USMWORLD" 
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = "/USMWORLD.jpg"; }}
              />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">USMWORLD Mobil Dasturi</h3>
              <p className="text-[11px] text-emerald-400">Android & iOS uchun to'liq moslashtirilgan</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('direct')}
            className={`py-2 rounded-lg transition ${
              activeTab === 'direct' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            📱 1. Telefonga O'rnatish (WebAPK)
          </button>
          <button
            onClick={() => setActiveTab('android-studio')}
            className={`py-2 rounded-lg transition ${
              activeTab === 'android-studio' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            📦 2. Android Studio orqali APK
          </button>
        </div>

        {/* TAB 1: Direct WebAPK Install on Mobile */}
        {activeTab === 'direct' && (
          <div className="space-y-3.5">
            <div className="bg-emerald-950/30 border border-emerald-500/30 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-200">
              <Smartphone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Nima uchun WebAPK eng yaxshi yechim?</span>
                Google Chrome WebAPK texnologiyasida hech qanday "There was a problem parsing the package" xatosi chiqmaydi. Chunki u aynan sizning telefoningiz modeliga va Android versiyasiga moslab rasmiy sertifikat bilan o'rnatiladi!
              </div>
            </div>

            {/* Direct Install Button */}
            <button
              onClick={handleInstallPWA}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition active:scale-95"
            >
              <Download className="w-4 h-4 animate-bounce-soft" />
              <span>Telefonga Ilova Qilib O'rnatish</span>
            </button>

            {/* Instructions */}
            <div className="bg-slate-800/50 p-3.5 rounded-2xl border border-slate-700/60 space-y-2 text-xs text-slate-300">
              <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Telefonda qadamma-qadam o'rnatish:
              </h4>
              <div className="space-y-1.5 text-[11px] text-slate-300">
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                  <span>Telefoningizda Google Chrome brauzerida saytni oching.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                  <span>Brauzerning o'ng yuqori qismidagi <b>(⋮) 3 ta nuqta</b> menyusini bosing.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
                  <span><b>«Ilovani o'rnatish»</b> yoki <b>«Bosh ekranga qo'shish»</b> bandini tanlang.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">4</span>
                  <span>Telefon ishchi stolida USMWORLD ilovasi paydo bo'ladi va mustaqil dasturdek ochiladi!</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Native Android Studio APK */}
        {activeTab === 'android-studio' && (
          <div className="space-y-3 text-xs text-slate-300">
            <div className="bg-blue-950/40 border border-blue-500/40 p-3.5 rounded-2xl space-y-1">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-blue-400" />
                Loyiha ichida Native Android loyihasi tayyor!
              </span>
              <p className="text-[11px] text-slate-300">
                Loyiha papkasida <b><code>android/</code></b> katalogi to'liq shakllantirilgan. Android Studio orqali 1 daqiqada rasmiy .APK fayl yig'ib olishingiz mumkin.
              </p>
            </div>

            <div className="bg-slate-800/50 p-3.5 rounded-2xl border border-slate-700/60 space-y-2 text-[11px]">
              <h4 className="font-bold text-white text-xs">Android Studio orqali APK chiqarish:</h4>
              <ol className="list-decimal pl-4 space-y-1 text-slate-300">
                <li>Android Studio dasturini oching.</li>
                <li><code>File -&gt; Open</code> qilib <b>Turistik loyiha/android</b> papkasini tanlang.</li>
                <li>Menyudan <b>Build -&gt; Build Bundle(s) / APK(s) -&gt; Build APK(s)</b> tugmasini bosing.</li>
                <li>Android Studio rasmiy kompilyatsiya qilingan, to'liq ishlaydigan <code>app-debug.apk</code> faylini chiqarib beradi!</li>
              </ol>
            </div>
          </div>
        )}

        {/* Footer */}
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition"
        >
          Yopish
        </button>
      </div>
    </div>
  );
}
