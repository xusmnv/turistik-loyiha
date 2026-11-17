import { INITIAL_TOURS, INITIAL_ORDERS } from '../data/mockData';

const STORAGE_KEYS = {
  TOURS: 'usmworld_tours',
  ORDERS: 'usmworld_orders',
  FEEDBACKS: 'usmworld_feedbacks',
  SETTINGS: 'usmworld_settings'
};

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
