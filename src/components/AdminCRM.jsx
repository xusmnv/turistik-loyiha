import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, DollarSign, PackageCheck, AlertCircle, Plus, 
  Trash2, CheckCircle2, XCircle, Clock, RefreshCw, Download, Search,
  Eye, Plane, ShieldAlert, Sparkles, Filter, Edit3, Save, Lock, Crown, ArrowRight,
  Upload, Scissors, Camera, UserCheck, Check, X, Flame, MessageSquare, Tag, Calendar, Phone, Send
} from 'lucide-react';
import { 
  getOrders, getTours, getAgencyStats, updateOrderStatus, 
  createTour, deleteTour, updateTourPrice, resetDatabase,
  getFeedbacks, deleteFeedback, updateFeedbackStatus,
  applyTourDiscount, removeTourDiscount
} from '../services/db';
import { isUserAdmin, loginUser } from '../services/auth';
import ImageUploadCropper from './ImageUploadCropper';

export default function AdminCRM({ onViewVoucher, onDataChanged, currentUser, onAuthSuccess }) {
  const isAdmin = isUserAdmin(currentUser);

  // If not admin, show dedicated Admin Security Login
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Admin Dashboard states
  const [activeTab, setActiveTab] = useState('tours'); // 'tours', 'orders', 'buyers', 'feedbacks', 'addTour'
  const [orders, setOrders] = useState(getOrders());
  const [tours, setTours] = useState(getTours());
  const [feedbacks, setFeedbacks] = useState(getFeedbacks());
  const [stats, setStats] = useState(getAgencyStats());
  const [searchQuery, setSearchQuery] = useState('');
  const [tourSearchQuery, setTourSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [feedbackFilter, setFeedbackFilter] = useState('all');
  const [previewPhoto, setPreviewPhoto] = useState(null);

  // Tour Discount Modal state
  const [discountModalTour, setDiscountModalTour] = useState(null);
  const [discountPercent, setDiscountPercent] = useState('90');
  const [discountDays, setDiscountDays] = useState('5');

  // Buyers calculations
  const totalPaidOrders = orders.filter(o => o.paymentStatus === 'paid');
  const totalPeopleBought = totalPaidOrders.reduce((sum, o) => sum + (Number(o.travelersCount) || 1), 0);
  const totalAllOrdersTravelers = orders.reduce((sum, o) => sum + (Number(o.travelersCount) || 1), 0);

  // Editing price state
  const [editingPriceTourId, setEditingPriceTourId] = useState(null);
  const [tempPrice, setTempPrice] = useState('');

  // Form for adding new tour
  const [newTour, setNewTour] = useState({
    title: '',
    country: '',
    city: '',
    category: 'Ekzotika',
    price: '',
    duration: '7 kun / 6 kecha',
    hotelStars: 5,
    hotelName: '',
    foodType: 'All Inclusive',
    availableSeats: 20,
    flightInfo: 'Toshkent - To\'g\'ridan-to\'g\'ri reys',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    description: '',
    departureDates: ['2026-12-15', '2027-01-10']
  });

  const refreshAllData = () => {
    setOrders(getOrders());
    setTours(getTours());
    setStats(getAgencyStats());
    setFeedbacks(getFeedbacks());
    if (onDataChanged) onDataChanged();
  };

  // Admin login handler (private & secure)
  const handleAdminLogin = (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    setTimeout(() => {
      const res = loginUser(adminEmail, adminPassword);
      setAuthLoading(false);
      if (res.success && res.isAdmin) {
        onAuthSuccess(res.user);
      } else {
        setAuthError("Faqat maxsus Bosh Administrator hisobi orqali kirish mumkin!");
      }
    }, 500);
  };

  // Start editing price
  const handleStartEditPrice = (tour) => {
    setEditingPriceTourId(tour.id);
    setTempPrice(tour.price);
  };

  // Save updated price
  const handleSavePrice = (tourId) => {
    if (!tempPrice || Number(tempPrice) <= 0) {
      alert("Narx musbat son bo'lishi kerak!");
      return;
    }
    updateTourPrice(tourId, Number(tempPrice));
    setEditingPriceTourId(null);
    refreshAllData();
  };

  // Discount modal open
  const handleOpenDiscountModal = (tour) => {
    setDiscountModalTour(tour);
    setDiscountPercent(tour.discountPercent > 0 ? String(tour.discountPercent) : '90');
    setDiscountDays(tour.discountDays ? String(tour.discountDays) : '5');
  };

  // Save tour discount (e.g. 90% discount for 5 days)
  const handleApplyDiscount = (e) => {
    e.preventDefault();
    if (!discountModalTour) return;
    const pct = Number(discountPercent);
    const days = Number(discountDays);
    if (!pct || pct <= 0 || pct >= 100) {
      alert("Chegirma foizi 1 dan 99 gacha bo'lishi kerak!");
      return;
    }
    if (!days || days <= 0) {
      alert("Amal qilish muddati kamida 1 kun bo'lishi kerak!");
      return;
    }

    applyTourDiscount(discountModalTour.id, pct, days);
    setDiscountModalTour(null);
    refreshAllData();
    alert(`"${discountModalTour.title}" turiga ${pct}% chegirma ${days} kunga muvaffaqiyatli belgilandi!`);
  };

  // Remove discount from tour
  const handleRemoveDiscount = (tourId) => {
    if (window.confirm("Haqiqatan ham chegirmani olib tashlab, asl narxini tiklamoqchimisiz?")) {
      removeTourDiscount(tourId);
      setDiscountModalTour(null);
      refreshAllData();
    }
  };

  // Feedback actions
  const handleDeleteFeedback = (id) => {
    if (window.confirm("Ushbu murojaatni o'chirmoqchimisiz?")) {
      deleteFeedback(id);
      setFeedbacks(getFeedbacks());
    }
  };

  const handleMarkFeedbackRead = (id) => {
    updateFeedbackStatus(id, 'read');
    setFeedbacks(getFeedbacks());
  };

  // Status changes
  const handleUpdateStatus = (orderId, newStatus, newPaymentStatus) => {
    updateOrderStatus(orderId, newStatus, newPaymentStatus);
    refreshAllData();
  };

  // Add tour submit
  const handleAddTourSubmit = (e) => {
    e.preventDefault();
    if (!newTour.title || !newTour.price) {
      alert("Iltimos, tur nomi va narxini to'liq kiriting!");
      return;
    }

    createTour({
      ...newTour,
      price: Number(newTour.price),
      availableSeats: Number(newTour.availableSeats)
    });

    alert("Yangi tur paketi muvaffaqiyatli qo'shildi!");
    setActiveTab('tours');
    refreshAllData();
    // Reset form
    setNewTour({
      title: '',
      country: '',
      city: '',
      category: 'Ekzotika',
      price: '',
      duration: '7 kun / 6 kecha',
      hotelStars: 5,
      hotelName: '',
      foodType: 'All Inclusive',
      availableSeats: 20,
      flightInfo: 'Toshkent - To\'g\'ridan-to\'g\'ri reys',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      description: '',
      departureDates: ['2026-12-15', '2027-01-10']
    });
  };

  // Delete tour
  const handleDeleteTour = (id, title) => {
    if (window.confirm(`Haqiqatan ham "${title}" turini bazadan o'chirmoqchimisiz?`)) {
      deleteTour(id);
      refreshAllData();
    }
  };

  // Reset demo data
  const handleResetData = () => {
    if (window.confirm("Barcha ma'lumotlarni 50+ boshlang'ich turlarga qaytarishni xohlaysizmi?")) {
      resetDatabase();
      refreshAllData();
      alert("Ma'lumotlar bazasi muvaffaqiyatli tiklandi!");
    }
  };

  // Export JSON Report
  const handleExportData = () => {
    const data = {
      agency: "USMWORLD Travel Agency",
      exportedAt: new Date().toISOString(),
      stats,
      orders,
      toursCount: tours.length,
      tours
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `USMWORLD_CRM_Report_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  // Filtered orders
  const filteredOrders = orders.filter(ord => {
    const matchesSearch = 
      ord.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.tourTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.phone?.includes(searchQuery);

    if (statusFilter === 'all') return matchesSearch;
    if (statusFilter === 'paid') return matchesSearch && ord.paymentStatus === 'paid';
    if (statusFilter === 'pending') return matchesSearch && ord.paymentStatus === 'pending';
    return matchesSearch;
  });

  // Filtered tours for price editor
  const filteredTours = tours.filter(t => 
    t.title.toLowerCase().includes(tourSearchQuery.toLowerCase()) ||
    t.country.toLowerCase().includes(tourSearchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(tourSearchQuery.toLowerCase())
  );

  // --- ACCESS CONTROL: If not admin, show Private Secure Login screen (No exposed credentials) ---
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-8 bg-slate-900/90 rounded-3xl border border-amber-500/30 p-6 shadow-2xl text-center space-y-4 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <span className="px-3 py-1 bg-amber-500/20 text-amber-300 font-bold text-[11px] rounded-full uppercase tracking-wider">
            Yopiq Xizmat Hududi
          </span>
          <h2 className="text-xl font-extrabold text-white mt-2">
            Bosh Administrator Paneli
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Ushbu bo'lim faqat tizim ma'muri (Bosh Administrator) uchun himoyalangan. Davom etish uchun admin hisob ma'lumotlarini kiriting:
          </p>
        </div>

        {authError && (
          <div className="bg-rose-950/40 border border-rose-500/50 p-2.5 rounded-xl text-xs text-rose-300 text-left">
            {authError}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-3 text-left">
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Elektron Pochta:
            </label>
            <input
              type="email"
              required
              placeholder="admin@pochta.uz"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Maxfiy Parol:
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg transition active:scale-95 flex items-center justify-center gap-2 mt-2"
          >
            <span>{authLoading ? "Tekshirilmoqda..." : "Admin Sifatida Kirish"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    );
  }

  // --- LOGGED IN AS ADMIN ---
  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Title & Action Banner */}
      <div className="bg-gradient-to-r from-blue-900/60 via-slate-900 to-indigo-900/50 p-4 sm:p-6 rounded-3xl border border-amber-500/30 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                Bosh Administrator: {currentUser.name}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                To'liq Huquqlar Faol
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
              USMWORLD CRM & Inventar Boshqaruvi
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              50+ tur paketlari narxlarini onlayn o'zgartirish, qurilmadan rasm qirqib yangi turlar qo'shish va buyurtmalarni nazorat qilish markazi.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleExportData}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl border border-slate-700 flex items-center gap-1.5 transition"
              title="Hisobotni yuklab olish"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Hisobot (JSON)</span>
            </button>
            <button
              onClick={handleResetData}
              className="px-3 py-2 bg-slate-800 hover:bg-rose-950/40 text-xs font-semibold text-rose-300 rounded-xl border border-slate-700 hover:border-rose-700/60 flex items-center gap-1.5 transition"
              title="50+ turlarni qayta tiklash"
            >
              <RefreshCw className="w-3.5 h-3.5 text-rose-400" />
              <span>Bazani Tiklash</span>
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Revenue */}
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800/80 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Jami Tushum:</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white mt-2">
            ${stats.totalRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400 font-semibold mt-1">
            To'langan buyurtmalardan
          </div>
        </div>

        {/* Pending Revenue */}
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800/80 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Kutilayotgan To'lov:</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-300 mt-2">
            ${stats.pendingRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-amber-400 font-semibold mt-1">
            {stats.pendingOrdersCount} ta to'lanmagan bron
          </div>
        </div>

        {/* Active Tours */}
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800/80 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Mavjud Tur Paketlar:</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <PackageCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white mt-2">
            {tours.length} ta
          </div>
          <div className="text-[11px] text-indigo-300 font-semibold mt-1">
            50+ tur paketi bazada
          </div>
        </div>

        {/* Travelers & Buyers Count */}
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800/80 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Sotib Olganlar:</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white mt-2">
            {totalPeopleBought} kishi
          </div>
          <div className="text-[11px] text-emerald-400 font-semibold mt-1">
            {totalPaidOrders.length} ta tasdiqlangan to'lov ({totalAllOrdersTravelers} jami)
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('tours')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'tours'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md'
              : 'bg-slate-800/60 text-slate-400 hover:text-white'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Turlar va Narxlar ({tours.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'orders'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'bg-slate-800/60 text-slate-400 hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Buyurtmalar ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('buyers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'buyers'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'bg-slate-800/60 text-slate-400 hover:text-white'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Xaridorlar & Face ID ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('feedbacks')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'feedbacks'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
              : 'bg-slate-800/60 text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Shikoyat & Takliflar ({feedbacks.length})</span>
          {feedbacks.filter(f => f.status === 'new').length > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('addTour')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'addTour'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-800/60 text-slate-400 hover:text-white'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Yangi Tur Qo'shish</span>
        </button>
      </div>

      {/* TAB 1: TOURS & PRICE EDITING */}
      {activeTab === 'tours' && (
        <div className="space-y-4">
          <div className="bg-amber-950/20 border border-amber-500/30 p-3.5 rounded-2xl flex items-center justify-between gap-3 text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <b>Admin Huquqi:</b> Istalgan turning narxini to'g'ridan-to'g'ri o'zgartirishingiz mumkin. O'zgarishlar darhol saytda aks etadi!
              </span>
            </div>
            <button
              onClick={() => setActiveTab('addTour')}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Yangi tur qo'shish</span>
            </button>
          </div>

          {/* Search among 50+ tours */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Tur nomi, davlat yoki kategoriya bo'yicha qidirish..."
              value={tourSearchQuery}
              onChange={(e) => setTourSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-amber-400 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          {/* Tours List with Direct Price Editor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredTours.map((t) => {
              const isEditing = editingPriceTourId === t.id;

              return (
                <div
                  key={t.id}
                  className="bg-slate-900 rounded-2xl p-3.5 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between gap-3 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <img src={t.image} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" />
                    <div className="truncate flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">
                          {t.category}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {t.country}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white truncate mt-0.5" title={t.title}>
                        {t.title}
                      </h4>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {t.duration} • Bo'sh joylar: <b className="text-white">{t.availableSeats}</b>
                      </div>
                    </div>
                  </div>

                  {/* PRICE CONTROLS */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Narxi:</span>
                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-emerald-400">$</span>
                          <input
                            type="number"
                            value={tempPrice}
                            onChange={(e) => setTempPrice(e.target.value)}
                            className="w-20 bg-slate-800 border border-amber-400 rounded-lg px-2 py-1 text-xs text-white font-bold focus:outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSavePrice(t.id)}
                            className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition"
                            title="Saqlash"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base font-black text-emerald-400">${t.price}</span>
                          {t.oldPrice && (
                            <span className="text-[10px] text-slate-500 line-through">${t.oldPrice}</span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Chegirma Button */}
                      <button
                        onClick={() => handleOpenDiscountModal(t)}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                          t.discountPercent > 0
                            ? 'bg-rose-500/25 text-rose-300 border border-rose-500/40 hover:bg-rose-500/40'
                            : 'bg-slate-800 text-slate-300 hover:text-rose-400 border border-slate-700'
                        }`}
                        title="Chegirma belgilash / muddati"
                      >
                        <Flame className="w-3.5 h-3.5 text-rose-400" />
                        <span>{t.discountPercent > 0 ? `-${t.discountPercent}%` : "Chegirma"}</span>
                      </button>

                      {!isEditing && (
                        <button
                          onClick={() => handleStartEditPrice(t)}
                          className="px-2.5 py-1.5 bg-slate-800 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-700 hover:border-amber-500/40 rounded-xl text-xs font-semibold transition flex items-center gap-1"
                          title="Narxni o'zgartirish"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                          <span>Narx</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteTour(t.id, t.title)}
                        className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl transition"
                        title="Turni o'chirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="Mijoz ismi, raqam yoki buyurtma kodi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  statusFilter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Barchasi ({orders.length})
              </button>
              <button
                onClick={() => setStatusFilter('paid')}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  statusFilter === 'paid' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                To'langan ({orders.filter(o => o.paymentStatus === 'paid').length})
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  statusFilter === 'pending' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Kutilmoqda ({orders.filter(o => o.paymentStatus === 'pending').length})
              </button>
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800">
              <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-sm text-slate-400">Hech qanday buyurtma topilmadi</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((order) => {
                const isPaid = order.paymentStatus === 'paid';
                const isCancelled = order.orderStatus === 'cancelled';

                return (
                  <div
                    key={order.id}
                    className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 hover:border-slate-700 transition flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
                  >
                    {/* Face ID Photo Thumbnail */}
                    <div className="shrink-0 flex items-center gap-3">
                      <div 
                        onClick={() => order.facePhoto && setPreviewPhoto(order.facePhoto)}
                        className={`w-14 h-16 rounded-xl border overflow-hidden bg-slate-800 flex flex-col items-center justify-center relative cursor-pointer group shadow-md ${
                          order.facePhoto ? 'border-purple-500/60 hover:border-purple-400' : 'border-slate-700'
                        }`}
                        title={order.facePhoto ? "Face ID suratini kattalashtirish" : "Face ID olinmagan"}
                      >
                        {order.facePhoto ? (
                          <>
                            <img src={order.facePhoto} alt="Face ID" className="w-full h-full object-cover group-hover:scale-105 transition" />
                            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                              <Eye className="w-4 h-4 text-white" />
                            </div>
                            <span className="absolute bottom-0 inset-x-0 text-[7px] font-black bg-purple-700/90 text-white text-center">FACE ID</span>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center p-1 text-slate-500">
                            <Camera className="w-5 h-5 mb-0.5" />
                            <span className="text-[7px]">Yo'q</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                          #{order.orderNumber}
                        </span>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                          isPaid ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
                          isCancelled ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                          'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {isPaid ? "To'langan" : isCancelled ? "Bekor qilingan" : "To'lov kutilmoqda"}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" /> SMS Tasdiqlangan
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white leading-tight">
                        {order.tourTitle}
                      </h4>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-300 pt-1">
                        <div>
                          <span className="text-slate-500 text-[10px] block">Mijoz:</span>
                          <span className="font-semibold text-white">{order.customerName}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] block">Telefon:</span>
                          <span className="font-mono text-emerald-300 font-semibold">{order.phone}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] block">Pasport:</span>
                          <span className="font-mono text-blue-300 font-semibold">{order.passportNumber}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] block">To'lov & Yo'lovchilar:</span>
                          <span className="font-bold text-emerald-400">${order.totalPrice} ({order.travelersCount} kishi)</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 border-t md:border-t-0 pt-2 md:pt-0 border-slate-800 shrink-0">
                      <button
                        onClick={() => onViewVoucher(order)}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl border border-slate-700 flex items-center gap-1 transition"
                        title="Elektron vaucher"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-400" />
                        <span>Vaucher</span>
                      </button>

                      {!isPaid && !isCancelled && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'confirmed', 'paid')}
                          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white rounded-xl shadow flex items-center gap-1 transition active:scale-95"
                          title="To'lovni tasdiqlash"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>To'landi</span>
                        </button>
                      )}

                      {!isCancelled && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'cancelled', 'cancelled')}
                          className="p-2 bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 rounded-xl border border-slate-700 transition"
                          title="Buyurtmani bekor qilish"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: BUYERS & FACE ID GALLERY */}
      {activeTab === 'buyers' && (
        <div className="space-y-4">
          {/* Summary Box */}
          <div className="bg-gradient-to-r from-purple-950/40 to-blue-950/40 border border-purple-500/30 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-300 font-bold rounded-full uppercase text-[10px] tracking-wider">
                Mijozlar & Biometriya Bazasi
              </span>
              <h3 className="text-base font-extrabold text-white mt-1">
                Jami Sotib Olganlar: <span className="text-emerald-400">{totalPeopleBought} kishi</span> ({totalPaidOrders.length} ta xarid)
              </h3>
              <p className="text-slate-400 text-xs mt-0.5">
                Har bir mijoz bron qilganda telefon raqami SMS orqali tasdiqlanib, yuz fotosurati (Face ID) olingan.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold text-purple-300 bg-purple-900/40 px-3 py-1.5 rounded-xl border border-purple-700/50">
                Jami tushum: ${stats.totalRevenue.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Buyers Grid */}
          {orders.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800">
              <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-sm text-slate-400">Hozircha xaridorlar mavjud emas</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {orders.map((order) => {
                const isPaid = order.paymentStatus === 'paid';

                return (
                  <div
                    key={order.id}
                    className="bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-purple-500/40 p-4 space-y-3 transition shadow-lg relative flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                          #{order.orderNumber}
                        </span>
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase ${
                          isPaid ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {isPaid ? "To'langan" : "To'lov kutilmoqda"}
                        </span>
                      </div>

                      {/* Photo + Identity */}
                      <div className="flex items-center gap-3">
                        <div
                          onClick={() => order.facePhoto && setPreviewPhoto(order.facePhoto)}
                          className={`w-16 h-20 rounded-xl overflow-hidden bg-slate-800 border-2 flex items-center justify-center shrink-0 cursor-pointer relative group shadow-md ${
                            order.facePhoto ? 'border-purple-500 hover:border-purple-400' : 'border-slate-700'
                          }`}
                          title="Suratni to'liq ko'rish"
                        >
                          {order.facePhoto ? (
                            <>
                              <img src={order.facePhoto} alt={order.customerName} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                                <Eye className="w-4 h-4 text-white" />
                              </div>
                              <span className="absolute bottom-0 inset-x-0 text-[7px] font-black bg-purple-700 text-white text-center py-0.2">
                                FACE ID
                              </span>
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center text-slate-500 text-center p-1">
                              <Camera className="w-6 h-6 mb-1" />
                              <span className="text-[8px]">Rasm yo'q</span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-1 min-w-0 flex-1">
                          <h4 className="text-sm font-bold text-white truncate">
                            {order.customerName}
                          </h4>
                          <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1 font-mono">
                            <span>{order.phone}</span>
                            <span className="text-[9px] bg-emerald-500/20 px-1 py-0.2 rounded font-sans">SMS ✓</span>
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            Pasport: <span className="text-blue-300 font-bold">{order.passportNumber}</span>
                          </div>
                        </div>
                      </div>

                      {/* Tour details */}
                      <div className="mt-3 p-2.5 bg-slate-800/50 rounded-xl border border-slate-700/50 text-xs space-y-1">
                        <div className="font-semibold text-slate-200 line-clamp-1">
                          {order.tourTitle}
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                          <span>Sana: <b className="text-slate-300">{order.travelDate}</b></span>
                          <span>Xaridor: <b className="text-blue-400">{order.travelersCount} kishi</b></span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-700/50">
                          <span className="text-slate-400">Summa:</span>
                          <span className="font-bold text-emerald-400">${order.totalPrice} ({order.paymentMethod?.toUpperCase()})</span>
                        </div>
                      </div>
                    </div>

                    {/* Voucher button */}
                    <button
                      onClick={() => onViewVoucher(order)}
                      className="w-full py-2 bg-slate-800 hover:bg-purple-950/50 text-slate-200 hover:text-purple-300 text-xs font-semibold rounded-xl border border-slate-700 hover:border-purple-600/50 flex items-center justify-center gap-1.5 transition mt-2"
                    >
                      <Eye className="w-3.5 h-3.5 text-purple-400" />
                      <span>Vaucher & Face ID ko'rish</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB: SHIKOYAT VA TAKLIFLAR (FEEDBACKS & COMPLAINTS) */}
      {activeTab === 'feedbacks' && (
        <div className="space-y-4">
          <div className="bg-amber-950/20 border border-amber-500/30 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 font-bold rounded-full uppercase text-[10px] tracking-wider">
                Mijozlar Fikrlari & Murojaatlari
              </span>
              <h3 className="text-base font-extrabold text-white mt-1">
                Shikoyat, Taklif va Savollar Bazasi ({feedbacks.length} ta)
              </h3>
              <p className="text-slate-400 text-xs mt-0.5">
                Mijozlar dastur orqali yozib qoldirgan barcha fikrlar, shikoyatlar va takliflar ushbu bo'limda yig'iladi.
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0 text-xs">
              <button
                onClick={() => setFeedbackFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                  feedbackFilter === 'all' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Barchasi ({feedbacks.length})
              </button>
              <button
                onClick={() => setFeedbackFilter('new')}
                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                  feedbackFilter === 'new' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Yangi ({feedbacks.filter(f => f.status === 'new').length})
              </button>
            </div>
          </div>

          {feedbacks.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800">
              <MessageSquare className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-sm text-slate-400">Hozircha shikoyat yoki takliflar kelib tushmagan</p>
            </div>
          ) : (
            <div className="space-y-3">
              {feedbacks
                .filter(f => feedbackFilter === 'all' || f.status === feedbackFilter)
                .map((item) => (
                  <div
                    key={item.id}
                    className={`bg-slate-900/90 rounded-2xl p-4 border transition flex flex-col sm:flex-row sm:items-start justify-between gap-4 shadow-sm ${
                      item.status === 'new' ? 'border-amber-500/40 bg-slate-900' : 'border-slate-800'
                    }`}
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-lg uppercase tracking-wider ${
                          item.type === 'Shikoyat'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : item.type === 'Taklif'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {item.type}
                        </span>

                        {item.status === 'new' ? (
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg animate-pulse">
                            Yangi
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[10px] font-medium bg-slate-800 text-slate-400 rounded-lg">
                            O'qilgan
                          </span>
                        )}

                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(item.createdAt).toLocaleString('uz-UZ')}
                        </span>
                      </div>

                      <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50 text-xs text-slate-200 leading-relaxed font-sans">
                        "{item.message}"
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <div>
                          Mijoz: <b className="text-white">{item.name}</b>
                        </div>
                        {item.phone && (
                          <a
                            href={`tel:${item.phone.replace(/\s+/g, '')}`}
                            className="text-emerald-400 hover:underline flex items-center gap-1 font-mono font-bold"
                            title="Mijozga qo'ng'iroq qilish"
                          >
                            <Phone className="w-3 h-3" />
                            {item.phone}
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                      {item.status === 'new' && (
                        <button
                          onClick={() => handleMarkFeedbackRead(item.id)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1 transition"
                          title="O'qildi deb belgilash"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>O'qildi</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteFeedback(item.id)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-rose-950/50 text-slate-400 hover:text-rose-300 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center gap-1"
                        title="O'chirish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>O'chirish</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: ADD NEW TOUR FORM WITH DEVICE IMAGE UPLOAD & CROP */}
      {activeTab === 'addTour' && (
        <form onSubmit={handleAddTourSubmit} className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-4 max-w-2xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-400" />
            Yangi Tur Paketi Yaratish (Admin inventariga qo'shish)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tur nomi:</label>
              <input
                type="text"
                required
                placeholder="Masalan: Rim & Milan Sayohati"
                value={newTour.title}
                onChange={(e) => setNewTour({ ...newTour, title: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Kategoriya:</label>
              <select
                value={newTour.category}
                onChange={(e) => setNewTour({ ...newTour, category: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
              >
                <option value="Ziyorat">Ziyorat (Umra/Haj)</option>
                <option value="Dengiz">Dengiz & Plyaj</option>
                <option value="Ekzotika">Ekzotika & Orollar</option>
                <option value="Shahar">Shahar & Yevropa</option>
                <option value="Ichki">Ichki Turizm (O'zbekiston)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Davlat:</label>
              <input
                type="text"
                placeholder="Italiya"
                value={newTour.country}
                onChange={(e) => setNewTour({ ...newTour, country: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Shahar:</label>
              <input
                type="text"
                placeholder="Rim"
                value={newTour.city}
                onChange={(e) => setNewTour({ ...newTour, city: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Narxi ($ USD):</label>
              <input
                type="number"
                required
                placeholder="850"
                value={newTour.price}
                onChange={(e) => setNewTour({ ...newTour, price: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-bold text-emerald-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Davomiyligi:</label>
              <input
                type="text"
                placeholder="7 kun / 6 kecha"
                value={newTour.duration}
                onChange={(e) => setNewTour({ ...newTour, duration: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Mavjud bo'sh o'rinlar:</label>
              <input
                type="number"
                value={newTour.availableSeats}
                onChange={(e) => setNewTour({ ...newTour, availableSeats: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          {/* DEVICE IMAGE UPLOAD & CROP SECTION */}
          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/60 space-y-2.5">
            <label className="block text-xs font-bold text-white flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-blue-400" />
              Tur rasmini yuklash (Laptop yoki Telefon xotirasidan):
            </label>

            <ImageUploadCropper
              currentImage={newTour.image}
              onImageSelected={(croppedDataUrl) => {
                setNewTour({ ...newTour, image: croppedDataUrl });
              }}
            />

            <div className="pt-1">
              <span className="text-[10px] text-slate-400 block mb-1">Yoki internetdagi rasm havolasini kiriting (URL):</span>
              <input
                type="url"
                value={newTour.image}
                onChange={(e) => setNewTour({ ...newTour, image: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none font-mono text-[11px]"
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Qisqacha ta'rif:</label>
            <textarea
              rows="3"
              placeholder="Tur haqida asosiy ma'lumotlar, qulayliklar..."
              value={newTour.description}
              onChange={(e) => setNewTour({ ...newTour, description: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition"
            >
              Turni Saqlash va E'lon Qilish
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tours')}
              className="px-4 py-3 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
            >
              Bekor qilish
            </button>
          </div>
        </form>
      )}

      {/* Face ID Large Photo Preview Modal */}
      {previewPhoto && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="relative bg-slate-900 border border-purple-500/50 rounded-3xl p-5 max-w-sm w-full text-center shadow-2xl">
            <button
              onClick={() => setPreviewPhoto(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 mx-auto flex items-center justify-center mb-3">
              <Camera className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-1">Mijoz Yuz Shakli (Face ID)</h4>
            <p className="text-xs text-slate-400 mb-4">Bron qilish vaqtida olingan biometrik fotosurat</p>
            <div className="w-56 h-64 mx-auto rounded-2xl overflow-hidden border-2 border-purple-500/50 shadow-xl bg-black">
              <img src={previewPhoto} alt="Face ID" className="w-full h-full object-cover" />
            </div>
            <button
              onClick={() => setPreviewPhoto(null)}
              className="mt-5 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white rounded-xl"
            >
              Yopish
            </button>
          </div>
        </div>
      )}

      {/* Tour Discount Management Modal */}
      {discountModalTour && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="relative bg-slate-900 border border-rose-500/50 rounded-3xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <button
              onClick={() => setDiscountModalTour(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-base font-bold text-white leading-tight">Turga Chegirma Belgilash</h4>
                <p className="text-xs text-slate-400 truncate max-w-xs">{discountModalTour.title}</p>
              </div>
            </div>

            <form onSubmit={handleApplyDiscount} className="space-y-3.5">
              {/* Tour current pricing info */}
              <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Asl narxi:</span>
                  <span className="text-sm font-bold text-white">${discountModalTour.originalPrice || discountModalTour.oldPrice || discountModalTour.price}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">Hozirgi narxi:</span>
                  <span className="text-sm font-bold text-emerald-400">${discountModalTour.price}</span>
                </div>
              </div>

              {/* Discount Percentage */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Chegirma foizi (%):</span>
                  <span className="text-rose-400 font-bold">-{discountPercent}%</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="99"
                    required
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    className="w-20 bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-bold text-center focus:outline-none focus:border-rose-500"
                  />
                  {/* Preset quick buttons */}
                  <div className="flex items-center gap-1.5 flex-1 overflow-x-auto no-scrollbar">
                    {['20', '30', '50', '70', '90'].map((p) => (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setDiscountPercent(p)}
                        className={`px-2 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
                          discountPercent === p
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                        }`}
                      >
                        -{p}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Duration in Days */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Amal qilish muddati (kun):</span>
                  <span className="text-amber-400 font-bold">{discountDays} kun davomida</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="365"
                    required
                    value={discountDays}
                    onChange={(e) => setDiscountDays(e.target.value)}
                    className="w-20 bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-bold text-center focus:outline-none focus:border-rose-500"
                  />
                  {/* Preset quick days */}
                  <div className="flex items-center gap-1.5 flex-1">
                    {['3', '5', '7', '14', '30'].map((d) => (
                      <button
                        type="button"
                        key={d}
                        onClick={() => setDiscountDays(d)}
                        className={`px-2 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
                          discountDays === d
                            ? 'bg-amber-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                        }`}
                      >
                        {d}k
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Preview Box */}
              {(() => {
                const orig = discountModalTour.originalPrice || discountModalTour.oldPrice || discountModalTour.price;
                const pct = Number(discountPercent) || 0;
                const discounted = Math.max(1, Math.round(orig * (1 - pct / 100)));
                const save = orig - discounted;
                const days = Number(discountDays) || 5;
                const d = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
                const months = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'];
                const expiryDate = `${d.getDate()}-${months[d.getMonth()] || ''} ${d.getFullYear()}-yil`;

                return (
                  <div className="bg-rose-950/30 border border-rose-500/40 p-3 rounded-2xl space-y-1 text-xs text-rose-200">
                    <div className="flex items-center justify-between">
                      <span>Mijozlar ko'radigan yangi narx:</span>
                      <span className="text-base font-black text-emerald-400">${discounted}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-300">
                      <span>Asl narxdan tejamkorlik:</span>
                      <span className="font-bold text-rose-400">-${save} ({pct}%)</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-amber-300 pt-1 border-t border-rose-900/40">
                      <span>Tugash sanasi:</span>
                      <span className="font-bold">{expiryDate}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 pt-0.5 leading-tight">
                      ℹ️ Chegirma muddati server/kod yangilansa ham to'xtamaydi, saqlanadi.
                    </p>
                  </div>
                );
              })()}

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-900/40 transition active:scale-95"
                >
                  Chegirmani E'lon Qilish
                </button>

                {discountModalTour.discountPercent > 0 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveDiscount(discountModalTour.id)}
                    className="px-3 py-2.5 bg-slate-800 hover:bg-rose-950/60 text-rose-300 text-xs font-bold rounded-xl border border-slate-700 transition"
                  >
                    Chegirmani O'chirish
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
