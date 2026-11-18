import { INITIAL_TOURS, INITIAL_ORDERS } from '../data/mockData';

const STORAGE_KEYS = {
  TOURS: 'usmworld_tours',
  ORDERS: 'usmworld_orders',
  FEEDBACKS: 'usmworld_feedbacks',
  EXPENSES: 'usmworld_expenses',
  SETTINGS: 'usmworld_settings'
};

const INITIAL_EXPENSES = [
  {
    id: 'exp-1',
    title: 'Uzbekistan Airways — Toshkent-Jidda charter blok depoziti',
    category: 'Aviachiptalar',
    amount: 14500,
    date: '2026-11-01',
    notes: '50 ta ziyoratchi uchun avans to\'lovi'
  },
  {
    id: 'exp-2',
    title: 'FlyDubai — Dubay qishki reyslar blok avansi',
    category: 'Aviachiptalar',
    amount: 8200,
    date: '2026-11-05',
    notes: 'Dubay turlari uchun avia blok'
  },
  {
    id: 'exp-3',
    title: 'Rixos & Hilton xalqaro mehmonxonalar bronlash to\'lovi',
    category: 'Mehmonxona',
    amount: 9800,
    date: '2026-11-08',
    notes: 'Dubay va Antaliya mehmonxona shartnomalari'
  },
  {
    id: 'exp-4',
    title: 'Apex Insurance xalqaro tibbiy sug\'urta to\'lovlari',
    category: 'Sug\'urta',
    amount: 1650,
    date: '2026-11-10',
    notes: 'Sayyohlar uchun xalqaro sug\'urta polislari'
  },
  {
    id: 'exp-5',
    title: 'Instagram, Telegram & Google Ads target marketing',
    category: 'Marketing',
    amount: 1400,
    date: '2026-11-12',
    notes: 'Chegirmali aksiyalar reklamasi'
  },
  {
    id: 'exp-6',
    title: 'Bosh ofis ijarasi va IT server ta\'minoti',
    category: 'Operatsion',
    amount: 1200,
    date: '2026-11-15',
    notes: 'Oylik ofis va xizmat xarajatlari'
  }
];

const INITIAL_FEEDBACKS = [
  {
    id: 'fb-1',
    name: 'Sardor Rahimiy',
    phone: '+998 93 111 22 33',
    type: 'Taklif',
    message: 'Dubay turiga qishki ta\'tillar uchun oilaviy chegirmalar qo\'shsangiz ajoyib bo\'lardi.',
    createdAt: '2026-11-16T10:30:00Z',
    status: 'new'
  },
  {
    id: 'fb-2',
    name: 'Ziyoda Karimova',
    phone: '+998 90 555 44 33',
    type: 'Shikoyat',
    message: 'Mehmonxonaga joylashishda transfer 15 daqiqa kechikdi, ammo keyin gid juda chiroyli xizmat ko\'rsatdi.',
    createdAt: '2026-11-17T08:15:00Z',
    status: 'new'
  }
];

// Initialize localStorage if empty or outdated (update to 50+ tours)
export const initializeDB = () => {
  try {
    const rawTours = localStorage.getItem(STORAGE_KEYS.TOURS);
    if (!rawTours) {
      localStorage.setItem(STORAGE_KEYS.TOURS, JSON.stringify(INITIAL_TOURS));
    } else {
      const parsed = JSON.parse(rawTours);
      // If old mock had only 8 tours, upgrade to 50+ tours automatically!
      if (!Array.isArray(parsed) || parsed.length < 20) {
        localStorage.setItem(STORAGE_KEYS.TOURS, JSON.stringify(INITIAL_TOURS));
      }
    }

    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
    }
  } catch (e) {
    localStorage.setItem(STORAGE_KEYS.TOURS, JSON.stringify(INITIAL_TOURS));
  }
};

// --- TOURS CRUD ---
export const getTours = () => {
  initializeDB();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TOURS);
    return data ? JSON.parse(data) : INITIAL_TOURS;
  } catch (err) {
    console.error("Error reading tours:", err);
    return INITIAL_TOURS;
  }
};

export const getTourById = (id) => {
  const tours = getTours();
  return tours.find(t => t.id === id);
};

export const createTour = (newTour) => {
  const tours = getTours();
  const tour = {
    ...newTour,
    id: `tour-${Date.now()}`,
    rating: newTour.rating || 5.0,
    reviewsCount: 1,
    featured: newTour.featured || false,
    discountPercent: newTour.discountPercent || 0,
    currency: "USD",
    gallery: newTour.gallery && newTour.gallery.length ? newTour.gallery : [newTour.image]
  };
  const updated = [tour, ...tours];
  localStorage.setItem(STORAGE_KEYS.TOURS, JSON.stringify(updated));
  return tour;
};

// Update tour price directly (Admin privilege)
export const updateTourPrice = (tourId, newPrice) => {
  const tours = getTours();
  const priceNum = Number(newPrice);
  const updated = tours.map(t => {
    if (t.id === tourId) {
      return {
        ...t,
        price: priceNum,
        originalPrice: priceNum,
        oldPrice: t.price !== priceNum ? t.price : t.oldPrice
      };
    }
    return t;
  });
  localStorage.setItem(STORAGE_KEYS.TOURS, JSON.stringify(updated));
  return true;
};

// Apply custom discount to a specific tour (Admin privilege)
// e.g. 90% discount for 5 days. Even if app is modified in 3 days, discountUntil timestamp remains valid.
export const applyTourDiscount = (tourId, discountPercent, durationDays = 5) => {
  const tours = getTours();
  const pct = Number(discountPercent);
  const days = Number(durationDays) || 5;

  const updated = tours.map(t => {
    if (t.id === tourId) {
      const origPrice = t.originalPrice || t.oldPrice || t.price;
      const discounted = Math.max(1, Math.round(origPrice * (1 - pct / 100)));
      const discountUntil = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

      return {
        ...t,
        originalPrice: origPrice,
        oldPrice: origPrice,
        price: discounted,
        discountPercent: pct,
        discountUntil: discountUntil,
        discountDays: days,
        discountStartedAt: new Date().toISOString()
      };
    }
    return t;
  });

  localStorage.setItem(STORAGE_KEYS.TOURS, JSON.stringify(updated));
  return true;
};

// Remove discount and restore original tour price
export const removeTourDiscount = (tourId) => {
  const tours = getTours();
  const updated = tours.map(t => {
    if (t.id === tourId) {
      const origPrice = t.originalPrice || t.oldPrice || t.price;
      return {
        ...t,
        price: origPrice,
        oldPrice: null,
        originalPrice: origPrice,
        discountPercent: 0,
        discountUntil: null,
        discountDays: null,
        discountStartedAt: null
      };
    }
    return t;
  });

  localStorage.setItem(STORAGE_KEYS.TOURS, JSON.stringify(updated));
  return true;
};

// Update entire tour fields (Admin privilege)
export const updateTour = (id, updatedFields) => {
  const tours = getTours();
  const updated = tours.map(t => (t.id === id ? { ...t, ...updatedFields } : t));
  localStorage.setItem(STORAGE_KEYS.TOURS, JSON.stringify(updated));
  return updated.find(t => t.id === id);
};

export const deleteTour = (id) => {
  const tours = getTours();
  const updated = tours.filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEYS.TOURS, JSON.stringify(updated));
  return true;
};

// --- ORDERS CRUD ---
export const getOrders = () => {
  initializeDB();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return data ? JSON.parse(data) : INITIAL_ORDERS;
  } catch (err) {
    console.error("Error reading orders:", err);
    return INITIAL_ORDERS;
  }
};

export const createOrder = (orderData) => {
  const orders = getOrders();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const newOrder = {
    ...orderData,
    id: `ORD-${randomSuffix}`,
    orderNumber: `USM-${randomSuffix}`,
    ticketCode: `TKT-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${randomSuffix}`,
    createdAt: new Date().toISOString(),
    orderStatus: orderData.paymentStatus === 'paid' ? 'confirmed' : 'processing'
  };

  const updated = [newOrder, ...orders];
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));

  // Kamaytirib qo'yamiz tur o'rnini (seats)
  if (orderData.tourId) {
    const tours = getTours();
    const updatedTours = tours.map(t => {
      if (t.id === orderData.tourId && t.availableSeats > 0) {
        return {
          ...t,
          availableSeats: Math.max(0, t.availableSeats - (orderData.travelersCount || 1))
        };
      }
      return t;
    });
    localStorage.setItem(STORAGE_KEYS.TOURS, JSON.stringify(updatedTours));
  }

  return newOrder;
};

export const updateOrderStatus = (orderId, newStatus, newPaymentStatus = null) => {
  const orders = getOrders();
  const updated = orders.map(ord => {
    if (ord.id === orderId) {
      return {
        ...ord,
        orderStatus: newStatus,
        paymentStatus: newPaymentStatus || ord.paymentStatus
      };
    }
    return ord;
  });
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
  return true;
};

// --- STATS & AUTOMATION ---
export const getAgencyStats = () => {
  const tours = getTours();
  const orders = getOrders();

  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0);

  const pendingRevenue = orders
    .filter(o => o.paymentStatus === 'pending')
    .reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0);

  const totalTravelers = orders
    .filter(o => o.orderStatus !== 'cancelled')
    .reduce((sum, o) => sum + (Number(o.travelersCount) || 1), 0);

  const activeToursCount = tours.length;
  const paidOrdersCount = orders.filter(o => o.paymentStatus === 'paid').length;
  const pendingOrdersCount = orders.filter(o => o.paymentStatus === 'pending').length;

  return {
    totalRevenue,
    pendingRevenue,
    totalTravelers,
    activeToursCount,
    paidOrdersCount,
    pendingOrdersCount,
    totalOrdersCount: orders.length
  };
};

// Reset database to initial values
export const resetDatabase = () => {
  localStorage.setItem(STORAGE_KEYS.TOURS, JSON.stringify(INITIAL_TOURS));
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
  localStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(INITIAL_FEEDBACKS));
};

// --- FEEDBACKS & COMPLAINTS (SHIKOYAT VA TAKLIFLAR) ---
export const getFeedbacks = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FEEDBACKS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(INITIAL_FEEDBACKS));
      return INITIAL_FEEDBACKS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_FEEDBACKS;
  }
};

export const createFeedback = ({ name, phone, type = 'Taklif', message }) => {
  const feedbacks = getFeedbacks();
  const newFeedback = {
    id: `fb-${Date.now()}`,
    name: name || 'Anonim foydalanuvchi',
    phone: phone || '',
    type: type || 'Taklif', // 'Taklif', 'Shikoyat', 'Savol'
    message: message || '',
    createdAt: new Date().toISOString(),
    status: 'new'
  };
  const updated = [newFeedback, ...feedbacks];
  localStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(updated));
  return newFeedback;
};

export const deleteFeedback = (id) => {
  const feedbacks = getFeedbacks();
  const updated = feedbacks.filter(f => f.id !== id);
  localStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(updated));
  return true;
};

export const updateFeedbackStatus = (id, status = 'read') => {
  const feedbacks = getFeedbacks();
  const updated = feedbacks.map(f => f.id === id ? { ...f, status } : f);
  localStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(updated));
  return true;
};

// --- EXPENSES & FINANCIAL ACCOUNTING (KIRIM-CHIQIM HISOBOTLARI) ---
export const getExpenses = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(INITIAL_EXPENSES));
      return INITIAL_EXPENSES;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_EXPENSES;
  }
};

export const createExpense = ({ title, category = 'Operatsion', amount, date, notes = '' }) => {
  const expenses = getExpenses();
  const newExp = {
    id: `exp-${Date.now()}`,
    title: title || 'Noma\'lum xarajat',
    category: category || 'Operatsion',
    amount: Number(amount) || 0,
    date: date || new Date().toISOString().split('T')[0],
    notes: notes || ''
  };
  const updated = [newExp, ...expenses];
  localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(updated));
  return newExp;
};

export const deleteExpense = (id) => {
  const expenses = getExpenses();
  const updated = expenses.filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(updated));
  return true;
};

export const getFinancialAccounting = () => {
  const orders = getOrders();
  const expenses = getExpenses();

  // Total Gross Income from bookings
  const totalIncome = orders.reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0);
  const paidIncome = orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0);
  const pendingIncome = orders.filter(o => o.paymentStatus === 'pending').reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0);

  // Total Expenses
  const totalExpenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  // Net Profit
  const netProfit = totalIncome - totalExpenses;
  const netPaidProfit = paidIncome - totalExpenses;
  const profitMargin = totalIncome > 0 ? Math.round((netProfit / totalIncome) * 100) : 0;

  return {
    totalIncome,
    paidIncome,
    pendingIncome,
    totalExpenses,
    netProfit,
    netPaidProfit,
    profitMargin,
    ordersCount: orders.length,
    expensesCount: expenses.length,
    orders,
    expenses
  };
};

/**
 * Export official Financial Report as CSV file with UTF-8 BOM
 */
export const downloadFinancialReportCSV = (language = 'uz') => {
  const fin = getFinancialAccounting();
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];

  const uzHeader = [
    `"USMWORLD Sayohat Agentligi - Moliyaviy Kirim-Chiqim Hisoboti"`,
    `"Hisobot sanasi: ${dateStr}"`,
    `"Jami Tushum (Kirim) ($):","${fin.totalIncome}"`,
    `"To'langan Tushum ($):","${fin.paidIncome}"`,
    `"Kutilayotgan To'lov ($):","${fin.pendingIncome}"`,
    `"Jami Xarajatlar (Chiqim) ($):","${fin.totalExpenses}"`,
    `"Sof Foyda ($):","${fin.netProfit}"`,
    `"Rentabellik (Margin):","${fin.profitMargin}%"`,
    ``,
    `"--- KIM QAYSI TURNI SOTIB OLGAN (SOTUVLAR RO'YXATI) ---"`,
    `"T/r","Xaridor (F.I.SH)","Pasport","Telefon","Tur Nomi","Jo'nash Sanasi","Sayyohlar Soni","Summa ($)","To'lov Usuli","Holati","Chipta Kodi"`,
  ];

  const ruHeader = [
    `"USMWORLD Travel - Финансовый отчет о доходах и расходах"`,
    `"Дата отчета: ${dateStr}"`,
    `"Общий доход ($):","${fin.totalIncome}"`,
    `"Оплаченный доход ($):","${fin.paidIncome}"`,
    `"В ожидании оплаты ($):","${fin.pendingIncome}"`,
    `"Общие расходы ($):","${fin.totalExpenses}"`,
    `"Чистая прибыль ($):","${fin.netProfit}"`,
    `"Рентабельность (%):","${fin.profitMargin}%"`,
    ``,
    `"--- КТО КАКОЙ ТУР КУПИЛ (СПИСОК ПРОДАЖ) ---"`,
    `"№","Покупатель (Ф.И.О)","Паспорт","Телефон","Название Тура","Дата вылета","Туристов","Сумма ($)","Способ оплаты","Статус","Код билета"`,
  ];

  const enHeader = [
    `"USMWORLD Travel - Financial Income & Expense Report"`,
    `"Report Date: ${dateStr}"`,
    `"Total Revenue ($):","${fin.totalIncome}"`,
    `"Paid Revenue ($):","${fin.paidIncome}"`,
    `"Pending Revenue ($):","${fin.pendingIncome}"`,
    `"Total Expenses ($):","${fin.totalExpenses}"`,
    `"Net Profit ($):","${fin.netProfit}"`,
    `"Profit Margin (%):","${fin.profitMargin}%"`,
    ``,
    `"--- TOUR PURCHASES & CUSTOMERS LIST ---"`,
    `"No","Customer Name","Passport","Phone","Tour Title","Departure Date","Travelers","Total ($)","Payment Method","Status","Ticket Code"`,
  ];

  const headers = language === 'ru' ? ruHeader : language === 'en' ? enHeader : uzHeader;
  const rows = [...headers];

  // Sales rows
  fin.orders.forEach((o, idx) => {
    rows.push(
      `"${idx + 1}","${(o.customerName || '').replace(/"/g, '""')}","${o.passportNumber || ''}","${o.phone || ''}","${(o.tourTitle || '').replace(/"/g, '""')}","${o.travelDate || ''}","${o.travelersCount || 1}","${o.totalPrice || 0}","${o.paymentMethod || ''}","${o.paymentStatus || ''}","${o.ticketCode || ''}"`
    );
  });

  // Expense section
  rows.push(``);
  rows.push(language === 'ru' ? `"--- РАСХОДЫ АГЕНТСТВА ---"` : language === 'en' ? `"--- AGENCY EXPENSES ---"` : `"--- AGENTLIK XARAJATLARI (CHIQIMLAR) ---"`);
  rows.push(
    language === 'ru'
      ? `"№","Наименование расхода","Категория","Сумма ($)","Дата","Примечание"`
      : language === 'en'
      ? `"No","Expense Title","Category","Amount ($)","Date","Notes"`
      : `"T/r","Xarajat Nomi","Kategoriya","Summa ($)","Sana","Izoh"`
  );

  fin.expenses.forEach((e, idx) => {
    rows.push(
      `"${idx + 1}","${(e.title || '').replace(/"/g, '""')}","${e.category || ''}","${e.amount || 0}","${e.date || ''}","${(e.notes || '').replace(/"/g, '""')}"`
    );
  });

  const csvContent = '\uFEFF' + rows.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `USMWORLD_Kirim_Chiqim_Hisoboti_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

