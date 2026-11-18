import React, { useState, useEffect } from 'react';
import { 
  Search, Compass, Flame, ShieldCheck, CreditCard, Sparkles, 
  MapPin, Clock, Star, ArrowRight, Plane, Filter, Ticket, 
  CheckCircle2, Users, HeartHandshake, Award, HelpCircle, Crown
} from 'lucide-react';

import Header from './components/Header';
import BottomNav from './components/BottomNav';
import TourCard from './components/TourCard';
import TourDetailModal from './components/TourDetailModal';
import BookingModal from './components/BookingModal';
import TicketVoucherModal from './components/TicketVoucherModal';
import AdminCRM from './components/AdminCRM';
import InstallAppModal from './components/InstallAppModal';
import ContactConsultModal from './components/ContactConsultModal';
import AuthModal from './components/AuthModal';
import MobileFrame from './components/MobileFrame';
import UpdateNotificationModal from './components/UpdateNotificationModal';
import AIAssistantModal from './components/AIAssistantModal';
import AIAssistantFloatingButton from './components/AIAssistantFloatingButton';
import OfflineModal from './components/OfflineModal';

import { getTours, getOrders, initializeDB } from './services/db';
import { getCurrentUser, logoutUser, isUserAdmin } from './services/auth';
import { useLanguage } from './context/LanguageContext';

export default function App() {
  const { t, effectiveLanguage } = useLanguage();

  // User Authentication state
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'catalog', 'orders', 'admin', 'contact'

  // Data states
  const [tours, setTours] = useState([]);
  const [orders, setOrders] = useState([]);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Barchasi');
  const [sortBy, setSortBy] = useState('popular'); // 'popular', 'price-low', 'price-high'

  // Active modals
  const [selectedTourForDetail, setSelectedTourForDetail] = useState(null);
  const [selectedTourForBooking, setSelectedTourForBooking] = useState(null);
  const [selectedOrderForVoucher, setSelectedOrderForVoucher] = useState(null);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);

  // Load data and authenticate on mount
  useEffect(() => {
    initializeDB();
    setTours(getTours());
    setOrders(getOrders());

    const loggedUser = getCurrentUser();
    if (loggedUser) {
      setCurrentUser(loggedUser);
    } else {
      // Dastur ishga tushganda birinchi ro'yxatdan o'tishni so'raydi!
      setShowAuthModal(true);
    }
  }, []);

  const refreshData = () => {
    setTours(getTours());
    setOrders(getOrders());
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setShowAuthModal(true);
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setShowAuthModal(false);
  };

  const categoryList = [
    { id: 'Barchasi', label: t('catAll') },
    { id: 'Ziyorat', label: t('catZiyorat') },
    { id: 'Dengiz', label: t('catDengiz') },
    { id: 'Ekzotika', label: t('catEkzotika') },
    { id: 'Shahar', label: t('catShahar') },
    { id: 'Ichki', label: t('catIchki') },
  ];

  // Filtered & Sorted tours among 50+ tours
  const filteredTours = tours
    .filter(t => {
      const matchCat = selectedCategory === 'Barchasi' || t.category === selectedCategory;
      const matchSearch = 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.country.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return b.rating - a.rating;
    });

  const featuredTours = tours.filter(t => t.featured || t.discountPercent > 0);
  const isAdmin = isUserAdmin(currentUser);

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="flex flex-col min-h-full bg-slate-950 text-slate-100 pb-32 sm:pb-28 selection:bg-blue-600 selection:text-white">
        
        {/* Main Header with User state */}
        <Header 
          onOpenContact={() => setShowContactModal(true)}
          currentUser={currentUser}
          onOpenAuth={() => setShowAuthModal(true)}
          onLogout={handleLogout}
          onOpenAi={() => setShowAiModal(true)}
        />

        {/* Dynamic Views based on Tab */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 py-4">

          {/* TAB 1: HOME PAGE */}
          {activeTab === 'home' && (
            <div className="space-y-6 animate-fade-in">
              {/* Hero Banner with User Greeting */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-blue-500/20 p-5 sm:p-8 shadow-2xl">
                <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
                
                <div className="relative z-10 max-w-xl space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
                    {isAdmin ? (
                      <>
                        <Crown className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-amber-300">{t('superAdmin')}: {currentUser.name}</span>
                      </>
                    ) : currentUser ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                        <span>{t('welcomeGreeting')}, {currentUser.name}!</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                        <span>USMWORLD Smart Tourism</span>
                      </>
                    )}
                  </div>

                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                    {t('heroTitle')}
                  </h1>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {t('heroSubtitle')}
                  </p>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={() => setActiveTab('catalog')}
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 transition active:scale-95"
                    >
                      <Compass className="w-4 h-4" />
                      <span>{t('viewAllTours')}</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('admin')}
                      className={`px-4 py-2.5 font-semibold text-xs sm:text-sm rounded-xl border transition flex items-center gap-1.5 ${
                        isAdmin
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                          : 'bg-slate-800/80 text-blue-300 border-slate-700 hover:bg-slate-700/80'
                      }`}
                    >
                      {isAdmin && <Crown className="w-3.5 h-3.5 text-amber-400" />}
                      <span>{isAdmin ? t('adminCRMTitle') : t('agencyCRMTitle')}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Search Bar */}
              <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800 shadow-lg flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    placeholder={t('searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700/60 focus:border-blue-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{t('searchToursBtn')}</span>
                </button>
              </div>

              {/* Categories Horizontal Scroll */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">{t('allDestinations')}</h3>
                  <button 
                    onClick={() => setActiveTab('catalog')} 
                    className="text-xs text-blue-400 font-semibold hover:underline"
                  >
                    {t('catAll')} ({tours.length} {t('toursCount')})
                  </button>
                </div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {categoryList.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition active:scale-95 ${
                        selectedCategory === cat.id
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                          : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/60'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hot Deals Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-rose-500 fill-rose-500" />
                    <h3 className="text-base font-extrabold text-white">{t('heroSpecialOffers')}</h3>
                  </div>
                  <span className="text-xs text-rose-400 font-semibold">{t('discountUpTo')}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {featuredTours.slice(0, 6).map((tour) => (
                    <TourCard
                      key={tour.id}
                      tour={tour}
                      onSelect={(t) => setSelectedTourForDetail(t)}
                      onBook={(t) => setSelectedTourForBooking(t)}
                    />
                  ))}
                </div>
              </div>

              {/* Why USMWORLD Features */}
              <div className="bg-slate-900/60 p-5 rounded-3xl border border-slate-800 space-y-4">
                <h3 className="text-base font-extrabold text-white text-center">
                  {t('whyChooseUs')}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 text-center space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 mx-auto flex items-center justify-center">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <h4 className="text-xs font-bold text-white">{t('featurePayment')}</h4>
                    <p className="text-[11px] text-slate-400">{t('featurePaymentDesc')}</p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 text-center space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center">
                      <Ticket className="w-5 h-5" />
                    </div>
                    <h4 className="text-xs font-bold text-white">{t('featureVoucher')}</h4>
                    <p className="text-[11px] text-slate-400">{t('featureVoucherDesc')}</p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 text-center space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 mx-auto flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h4 className="text-xs font-bold text-white">{t('featureLicense')}</h4>
                    <p className="text-[11px] text-slate-400">{t('featureLicenseDesc')}</p>
                  </div>
                </div>
              </div>

              {/* All Tours Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-white">{t('filterPopular')} ({tours.length})</h3>
                  <button
                    onClick={() => setActiveTab('catalog')}
                    className="text-xs text-blue-400 font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>{t('fullCatalog')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTours.slice(0, 9).map((tour) => (
                    <TourCard
                      key={tour.id}
                      tour={tour}
                      onSelect={(t) => setSelectedTourForDetail(t)}
                      onBook={(t) => setSelectedTourForBooking(t)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CATALOG PAGE (50+ TOURS) */}
          {activeTab === 'catalog' && (
            <div className="space-y-5 animate-fade-in">
              <div className="bg-slate-900/90 p-4 rounded-3xl border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="text"
                      placeholder={t('searchPlaceholder')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 focus:border-blue-500 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 shrink-0">{t('sortBy')}</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    >
                      <option value="popular">{t('filterPopular')}</option>
                      <option value="price-low">{t('filterPriceLow')}</option>
                      <option value="price-high">{t('filterPriceHigh')}</option>
                    </select>
                  </div>
                </div>

                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pt-1">
                  {categoryList.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                        selectedCategory === cat.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Counter */}
              <div className="text-xs text-slate-400 flex items-center justify-between px-1">
                <span>{t('foundToursPrefix')} <b className="text-white">{filteredTours.length} {t('toursCount')}</b> ({t('toursInDatabase')} {tours.length}+)</span>
                {selectedCategory !== 'Barchasi' && (
                  <button 
                    onClick={() => setSelectedCategory('Barchasi')}
                    className="text-blue-400 hover:underline"
                  >
                    {t('clearFilter')}
                  </button>
                )}
              </div>

              {/* 50+ Tours Grid */}
              {filteredTours.length === 0 ? (
                <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800">
                  <Compass className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-white">{t('notFoundTours')}</h4>
                  <p className="text-xs text-slate-400 mt-1">{t('notFoundDesc')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTours.map((tour) => (
                    <TourCard
                      key={tour.id}
                      tour={tour}
                      onSelect={(t) => setSelectedTourForDetail(t)}
                      onBook={(t) => setSelectedTourForBooking(t)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MY ORDERS & TICKETS */}
          {activeTab === 'orders' && (
            <div className="space-y-4 animate-fade-in max-w-2xl mx-auto">
              <div className="bg-slate-900/90 p-4 rounded-3xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">{t('myBookings')}</h2>
                  <p className="text-xs text-slate-400">{t('myBookingsSub')}</p>
                </div>
                <div className="px-3 py-1 bg-blue-600/20 text-blue-400 font-bold text-xs rounded-xl border border-blue-500/30">
                  {orders.length} {t('ordersCountLabel')}
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800 space-y-3">
                  <Ticket className="w-12 h-12 text-slate-600 mx-auto" />
                  <h4 className="text-base font-bold text-white">{t('noOrdersYet')}</h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    {t('noOrdersDesc')}
                  </p>
                  <button
                    onClick={() => setActiveTab('catalog')}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition"
                  >
                    {t('exploreToursBtn')}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((ord) => {
                    const isPaid = ord.paymentStatus === 'paid';
                    return (
                      <div
                        key={ord.id}
                        className="bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-md space-y-3"
                      >
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                              #{ord.orderNumber}
                            </span>
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                              isPaid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                            }`}>
                              {isPaid ? t('orderStatusPaid') : t('orderStatusPending')}
                            </span>
                          </div>
                          <span className="text-[11px] font-mono text-slate-400">
                            {ord.ticketCode}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-white">{ord.tourTitle}</h4>
                          <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 mt-2">
                            <div>
                              <span className="text-slate-500 text-[10px] block">{t('travelerLabel')}</span>
                              <span className="font-semibold">{ord.customerName}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 text-[10px] block">{t('passportLabel')}</span>
                              <span className="font-mono text-blue-300">{ord.passportNumber}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 text-[10px] block">{t('travelDateLabel')}</span>
                              <span>{ord.travelDate}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 text-[10px] block">{t('totalPaymentLabel')}</span>
                              <span className="font-bold text-emerald-400">${ord.totalPrice} ({ord.paymentMethod?.toUpperCase()})</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-1 border-t border-slate-800">
                          <button
                            onClick={() => setSelectedOrderForVoucher(ord)}
                            className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow flex items-center justify-center gap-1.5 transition active:scale-95"
                          >
                            <Ticket className="w-3.5 h-3.5" />
                            <span>{t('viewVoucher')}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ADMIN / CRM AUTOMATION */}
          {activeTab === 'admin' && (
            <AdminCRM
              onViewVoucher={(ord) => setSelectedOrderForVoucher(ord)}
              onDataChanged={refreshData}
              currentUser={currentUser}
              onAuthSuccess={handleAuthSuccess}
            />
          )}

          {/* TAB 5: CONTACT & SUPPORT */}
          {activeTab === 'contact' && (
            <div className="max-w-xl mx-auto space-y-4 animate-fade-in">
              <ContactConsultModal onClose={() => setActiveTab('home')} />
            </div>
          )}
        </main>

        {/* Bottom Navigation for mobile-first experience */}
        <BottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          ordersCount={orders.length}
        />

        {/* Global Modals */}
        {selectedTourForDetail && (
          <TourDetailModal
            tour={selectedTourForDetail}
            onClose={() => setSelectedTourForDetail(null)}
            onBook={(tour) => {
              setSelectedTourForDetail(null);
              setSelectedTourForBooking(tour);
            }}
          />
        )}

        {selectedTourForBooking && (
          <BookingModal
            tour={selectedTourForBooking}
            onClose={() => setSelectedTourForBooking(null)}
            onSuccessOrder={(newOrder) => {
              refreshData();
            }}
          />
        )}

        {selectedOrderForVoucher && (
          <TicketVoucherModal
            order={selectedOrderForVoucher}
            onClose={() => setSelectedOrderForVoucher(null)}
          />
        )}

        {showInstallModal && (
          <InstallAppModal onClose={() => setShowInstallModal(false)} />
        )}

        {showContactModal && (
          <ContactConsultModal onClose={() => setShowContactModal(false)} />
        )}

        {/* Auth / Register Boarding Pass Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
          forceAuth={!currentUser}
        />

        {/* In-App Auto Update Checker Modal */}
        <UpdateNotificationModal />

        {/* Global Offline Network Guard Modal */}
        <OfflineModal />

        {/* Gemini AI Bot Floating Button & Assistant Modal */}
        <AIAssistantFloatingButton onClick={() => setShowAiModal(true)} />
        <AIAssistantModal 
          isOpen={showAiModal} 
          onClose={() => setShowAiModal(false)} 
        />

      </div>
    </div>
  );
}
