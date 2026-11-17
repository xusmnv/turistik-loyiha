// Internationalization (i18n) Engine for USMWORLD
// Supports 4 modes: 'uz' (O'zbek), 'en' (English), 'ru' (Русский), and 'auto' (Qurilma tili / Device language)

export const SUPPORTED_LANGUAGES = [
  { id: 'uz', code: 'uz', label: "O'zbekcha", flag: '🇺🇿' },
  { id: 'en', code: 'en', label: 'English', flag: '🇬🇧' },
  { id: 'ru', code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { id: 'auto', code: 'auto', label: 'Qurilma tili', flag: '📱' },
];

// Detect device language
export function getDeviceLanguage() {
  try {
    const raw = (navigator.language || navigator.userLanguage || 'uz').toLowerCase();
    if (raw.startsWith('ru')) return 'ru';
    if (raw.startsWith('en')) return 'en';
    if (raw.startsWith('uz')) return 'uz';
    return 'uz';
  } catch (e) {
    return 'uz';
  }
}

// Get saved language preference (defaults to 'auto')
export function getSavedLanguage() {
  try {
    return localStorage.getItem('usmworld_lang') || 'auto';
  } catch (e) {
    return 'auto';
  }
}

// Set language
export function saveLanguage(lang) {
  try {
    localStorage.setItem('usmworld_lang', lang);
  } catch (e) {}
}

// Get active effective language code ('uz', 'en', or 'ru')
export function resolveEffectiveLanguage(langSetting) {
  if (langSetting === 'auto' || !langSetting) {
    return getDeviceLanguage();
  }
  return langSetting;
}

export const TRANSLATIONS = {
  uz: {
    // Navigation
    navHome: "Asosiy",
    navTours: "Turlar",
    navTickets: "Chiptalar",
    navCrm: "Agentlik CRM",
    navContact: "Aloqa",

    // Header
    crmTitle: "USMWORLD CRM",
    crmSubtitle: "Turizm agentligi faoliyatini avtomatlashtirish tizimi",
    superAdmin: "Bosh Administrator",
    login: "Kirish",
    logout: "Chiqish",
    call: "Qo'ng'iroq",
    callNow: "Qo'ng'iroq qilish",
    deviceLang: "Qurilma tili",
    langSelectTitle: "Tilni tanlang",

    // Categories
    catAll: "Barchasi",
    catZiyorat: "Ziyorat",
    catDengiz: "Dengiz",
    catEkzotika: "Ekzotika",
    catShahar: "Shahar",
    catIchki: "Ichki",

    // Search & Filter
    searchPlaceholder: "Qayerga sayohat qilmoqchisiz? (Mamlakat, shahar...)",
    filterPopular: "Eng ommabop",
    filterPriceLow: "Narxi: Arzondan",
    filterPriceHigh: "Narxi: Qimmatdan",
    toursCount: "ta tur topildi",

    // Hero
    heroGreeting: "Assalomu alaykum",
    heroTitle: "Orzuyingizdagi Sayohatni Biz Bilan Kashing!",
    heroSubtitle: "Dunyoning 50 dan ortiq mashhur yo'nalishlari, qaynoq chegirmalar va xavfsiz Face ID bilan bron qilish tizimi.",
    heroToursBtn: "Barcha Turlarni Ko'rish",
    heroSpecialOffers: "Qaynoq Chegirmalar & Maxsus Takliflar",
    heroSpecialOffersSubtitle: "Cheklangan muddatli chegirmali narxlar bilan tanishing",

    // Tour Card
    days: "kun",
    nights: "kecha",
    perPerson: "/ kishi",
    allInclusive: "Barchasi kiritilgan",
    details: "Batafsil",
    bookNow: "Bron qilish",
    discount: "Chegirma",
    until: "gacha",
    discountActiveUntil: "Chegirma muddati",
    soldOut: "Joy qolmadi",
    seatsLeft: "ta joy qoldi",

    // Auth Modal
    authWelcome: "USMWORLD Sayohat Tizimi",
    tabLogin: "Kirish (Login)",
    tabRegister: "Ro'yxatdan O'tish",
    emailLabel: "Elektron pochta (Gmail / Email):",
    passwordLabel: "Maxfiy parol:",
    rememberMe: "Meni eslab qol",
    loginBtn: "Tizimga Kirish",
    checking: "Tekshirilmoqda...",
    fullNameLabel: "To'liq ism-familiyangiz:",
    phoneLabel: "Telefon raqam (butun dunyo):",
    newPasswordLabel: "Yangi parol o'ylab toping:",
    registerBtn: "Akkaunt Ochish va Kirish",
    creating: "Yaratilmoqda...",
    guestMode: "Hozircha ro'yxatdan o'tmasdan ko'rish (Mehmon rejimi)",
    errShortPass: "Parol kamida 6 ta belgidan iborat bo'lishi kerak!",
    errFillAll: "Iltimos, barcha maydonlarni to'ldiring!",

    // Booking Modal
    bookingTitle: "Sayohatni Bron Qilish",
    step1Title: "Tur parametrlari",
    step2Title: "Sayohatchi ma'lumotlari",
    step3Title: "SMS tasdiqlash",
    step4Title: "Biometrik Face ID",
    step5Title: "To'lov usuli",
    departureDate: "Sayohat boshlanish sanasi:",
    travelersCount: "Sayohatchilar soni:",
    insurance: "Tibbiy Sug'urta",
    insuranceDesc: "Xorijda kutilmagan holatlar va shoshilinch tibbiy yordam",
    vipTransfer: "VIP Alohida Transfer",
    vipTransferDesc: "Aeroportdan mehmonxonagacha alohida biznes klass avtomobil",
    travelerName: "Sayohatchining to'liq ismi (F.I.SH):",
    travelerPhone: "Telefon raqam (SMS kod yuboriladi):",
    passportNumber: "Xorijga chiqish pasporti seriya va raqami:",
    next: "Davom etish",
    back: "Orqaga",
    smsVerificationTitle: "SMS Tasdiqlash Kodi",
    smsSentDesc: "raqamingizga 4 xonali tasdiqlash kodi yuborildi:",
    enterSmsCode: "SMS tasdiqlash kodini kiriting:",
    verifyCodeBtn: "Kodni Tasdiqlash",
    faceIdTitle: "Biometrik Yuzni Tasdiqlash (Face ID)",
    faceIdDesc: "Chipta va vaucherga yuzingizni muhrlash uchun kameraga qarang.",
    faceVerified: "Yuz muvaffaqiyatli tasdiqlandi!",
    proceedToPayment: "To'lovga O'tish",
    selectPayment: "To'lov usulini tanlang",
    payCash: "Ofisda naqd to'lash",
    payCard: "Karta orqali to'lov (Payme / Click / Uzum / Visa)",
    totalAmount: "Jami to'lov miqdori:",
    confirmBooking: "Buyurtmani Tasdiqlash",

    // Contact modal
    contactTitle: "USMWORLD Aloqa & Yordam",
    contactSubtitle: "Shikoyat, taklif va to'g'ridan-to'g'ri aloqa",
    directCall: "Qo'ng'iroq qilish",
    directTelegram: "Telegram Lichka",
    suggestion: "Taklif",
    complaint: "Shikoyat",
    question: "Savol",
    yourName: "Ismingiz:",
    yourPhone: "Telefon raqamingiz:",
    yourMessage: "Murojaat matni:",
    sendBtn: "Yuborish",
    feedbackSuccessTitle: "Murojaatingiz Yuborildi!",
    feedbackSuccessDesc: "Xabaringiz Bosh Administrator paneliga yetkazildi. Tez orada ko'rib chiqiladi.",
    close: "Yopish",

    // Orders tab
    myBookings: "Mening Bronlarim & Chiptalarim",
    noOrdersYet: "Hozircha bron qilingan turlaringiz yo'q",
    viewVoucher: "Vaucher va Chiptani Ko'rish",
    orderStatusPaid: "To'langan (Tasdiqlangan)",
    orderStatusPending: "Kutilmoqda (Naqd to'lov)",
  },

  en: {
    // Navigation
    navHome: "Home",
    navTours: "Tours",
    navTickets: "Tickets",
    navCrm: "Agency CRM",
    navContact: "Contact",

    // Header
    crmTitle: "USMWORLD CRM",
    crmSubtitle: "Tourism Agency Automation System",
    superAdmin: "Super Admin",
    login: "Sign In",
    logout: "Log Out",
    call: "Call",
    callNow: "Call Us",
    deviceLang: "Device Language",
    langSelectTitle: "Select Language",

    // Categories
    catAll: "All",
    catZiyorat: "Pilgrimage",
    catDengiz: "Beach & Sea",
    catEkzotika: "Exotic",
    catShahar: "City Tour",
    catIchki: "Domestic",

    // Search & Filter
    searchPlaceholder: "Where do you want to travel? (Country, city...)",
    filterPopular: "Most Popular",
    filterPriceLow: "Price: Low to High",
    filterPriceHigh: "Price: High to Low",
    toursCount: "tours found",

    // Hero
    heroGreeting: "Welcome",
    heroTitle: "Discover Your Dream Vacation With Us!",
    heroSubtitle: "Over 50 world-famous destinations, hot discounts, and secure biometric Face ID booking.",
    heroToursBtn: "Explore All Tours",
    heroSpecialOffers: "Hot Discounts & Special Offers",
    heroSpecialOffersSubtitle: "Explore exclusive limited-time travel discounts",

    // Tour Card
    days: "days",
    nights: "nights",
    perPerson: "/ person",
    allInclusive: "All inclusive",
    details: "Details",
    bookNow: "Book Now",
    discount: "Discount",
    until: "until",
    discountActiveUntil: "Discount valid until",
    soldOut: "Sold Out",
    seatsLeft: "seats left",

    // Auth Modal
    authWelcome: "USMWORLD Travel System",
    tabLogin: "Sign In",
    tabRegister: "Register",
    emailLabel: "Email address:",
    passwordLabel: "Password:",
    rememberMe: "Remember me",
    loginBtn: "Sign In",
    checking: "Checking...",
    fullNameLabel: "Full Name:",
    phoneLabel: "Phone number (worldwide):",
    newPasswordLabel: "Create a password:",
    registerBtn: "Create Account & Sign In",
    creating: "Creating...",
    guestMode: "Continue as guest without sign in",
    errShortPass: "Password must be at least 6 characters!",
    errFillAll: "Please fill in all fields!",

    // Booking Modal
    bookingTitle: "Tour Booking",
    step1Title: "Tour Parameters",
    step2Title: "Traveler Details",
    step3Title: "SMS Verification",
    step4Title: "Biometric Face ID",
    step5Title: "Payment Method",
    departureDate: "Departure Date:",
    travelersCount: "Travelers count:",
    insurance: "Medical Insurance",
    insuranceDesc: "Emergency medical insurance during the trip",
    vipTransfer: "VIP Private Transfer",
    vipTransferDesc: "Business-class car transfer from airport to hotel",
    travelerName: "Traveler Full Name:",
    travelerPhone: "Phone number (SMS code will be sent):",
    passportNumber: "International Passport Number:",
    next: "Continue",
    back: "Back",
    smsVerificationTitle: "SMS Verification Code",
    smsSentDesc: "A 4-digit verification code has been sent to:",
    enterSmsCode: "Enter SMS verification code:",
    verifyCodeBtn: "Verify Code",
    faceIdTitle: "Biometric Face ID Verification",
    faceIdDesc: "Look at the camera to stamp your biometric verification to the ticket.",
    faceVerified: "Face ID successfully verified!",
    proceedToPayment: "Proceed to Payment",
    selectPayment: "Choose payment method",
    payCash: "Pay cash at the office",
    payCard: "Credit / Debit Card (Visa, MasterCard, Payme)",
    totalAmount: "Total Amount:",
    confirmBooking: "Confirm Booking",

    // Contact modal
    contactTitle: "USMWORLD Contact & Support",
    contactSubtitle: "Inquiries, suggestions & direct contact",
    directCall: "Direct Call",
    directTelegram: "Direct Telegram",
    suggestion: "Suggestion",
    complaint: "Complaint",
    question: "Question",
    yourName: "Your Name:",
    yourPhone: "Your Phone:",
    yourMessage: "Message:",
    sendBtn: "Send Message",
    feedbackSuccessTitle: "Message Delivered!",
    feedbackSuccessDesc: "Your feedback has been sent to the Super Admin panel. We will get back to you shortly.",
    close: "Close",

    // Orders tab
    myBookings: "My Bookings & Tickets",
    noOrdersYet: "You haven't booked any tours yet",
    viewVoucher: "View Voucher & Ticket",
    orderStatusPaid: "Paid (Confirmed)",
    orderStatusPending: "Pending (Cash at office)",
  },

  ru: {
    // Navigation
    navHome: "Главная",
    navTours: "Туры",
    navTickets: "Билеты",
    navCrm: "CRM Агентства",
    navContact: "Связь",

    // Header
    crmTitle: "USMWORLD CRM",
    crmSubtitle: "Система автоматизации туристического агентства",
    superAdmin: "Главный Администратор",
    login: "Войти",
    logout: "Выйти",
    call: "Звонок",
    callNow: "Позвонить",
    deviceLang: "Язык устройства",
    langSelectTitle: "Выберите язык",

    // Categories
    catAll: "Все",
    catZiyorat: "Паломничество",
    catDengiz: "Пляж и Море",
    catEkzotika: "Экзотика",
    catShahar: "Городской тур",
    catIchki: "Внутренний туризм",

    // Search & Filter
    searchPlaceholder: "Куда хотите поехать? (Страна, город...)",
    filterPopular: "Популярные",
    filterPriceLow: "Сначала дешевые",
    filterPriceHigh: "Сначала дорогие",
    toursCount: "туров найдено",

    // Hero
    heroGreeting: "Здравствуйте",
    heroTitle: "Откройте Путешествие Вашей Мечты С Нами!",
    heroSubtitle: "Более 50 популярных направлений мира, горящие скидки и безопасное бронирование с Face ID.",
    heroToursBtn: "Смотреть Все Туры",
    heroSpecialOffers: "Горящие Скидки & Спецпредложения",
    heroSpecialOffersSubtitle: "Выгодные скидочные предложения с ограниченным сроком действия",

    // Tour Card
    days: "дней",
    nights: "ночей",
    perPerson: "/ чел",
    allInclusive: "Всё включено",
    details: "Подробнее",
    bookNow: "Забронировать",
    discount: "Скидка",
    until: "до",
    discountActiveUntil: "Скидка действует до",
    soldOut: "Мест нет",
    seatsLeft: "мест осталось",

    // Auth Modal
    authWelcome: "Система туризма USMWORLD",
    tabLogin: "Войти (Login)",
    tabRegister: "Регистрация",
    emailLabel: "Электронная почта (Gmail / Email):",
    passwordLabel: "Пароль:",
    rememberMe: "Запомнить меня",
    loginBtn: "Войти в систему",
    checking: "Проверка...",
    fullNameLabel: "Ваше Ф.И.О:",
    phoneLabel: "Номер телефона (все страны):",
    newPasswordLabel: "Придумайте новый пароль:",
    registerBtn: "Создать аккаунт и войти",
    creating: "Создание...",
    guestMode: "Продолжить без регистрации (Гостевой режим)",
    errShortPass: "Пароль должен состоять минимум из 6 символов!",
    errFillAll: "Пожалуйста, заполните все поля!",

    // Booking Modal
    bookingTitle: "Бронирование Тура",
    step1Title: "Параметры тура",
    step2Title: "Данные туриста",
    step3Title: "СМС верификация",
    step4Title: "Биометрия Face ID",
    step5Title: "Способ оплаты",
    departureDate: "Дата начала путешествия:",
    travelersCount: "Количество туристов:",
    insurance: "Медицинская страховка",
    insuranceDesc: "Экстренная медицинская помощь за рубежом",
    vipTransfer: "VIP Индивидуальный трансфер",
    vipTransferDesc: "Автомобиль бизнес-класса из аэропорта в отель",
    travelerName: "Ф.И.О. туриста:",
    travelerPhone: "Номер телефона (для отправки СМС):",
    passportNumber: "Серия и номер загранпаспорта:",
    next: "Продолжить",
    back: "Назад",
    smsVerificationTitle: "СМС Код Подтверждения",
    smsSentDesc: "на ваш номер отправлен 4-значный проверочный код:",
    enterSmsCode: "Введите СМС код:",
    verifyCodeBtn: "Подтвердить код",
    faceIdTitle: "Биометрическая верификация (Face ID)",
    faceIdDesc: "Посмотрите в камеру, чтобы зафиксировать ваше фото в билете.",
    faceVerified: "Лицо успешно подтверждено!",
    proceedToPayment: "Перейти к оплате",
    selectPayment: "Выберите способ оплаты",
    payCash: "Оплата наличными в офисе",
    payCard: "Банковской картой (Payme / Click / Visa)",
    totalAmount: "Итого к оплате:",
    confirmBooking: "Подтвердить бронирование",

    // Contact modal
    contactTitle: "Связь и Поддержка USMWORLD",
    contactSubtitle: "Жалобы, предложения и прямая связь",
    directCall: "Позвонить",
    directTelegram: "Telegram Личка",
    suggestion: "Предложение",
    complaint: "Жалоба",
    question: "Вопрос",
    yourName: "Ваше имя:",
    yourPhone: "Номер телефона:",
    yourMessage: "Текст сообщения:",
    sendBtn: "Отправить",
    feedbackSuccessTitle: "Обращение Отправлено!",
    feedbackSuccessDesc: "Ваше сообщение передано Главному Администратору. Скоро с вами свяжутся.",
    close: "Закрыть",

    // Orders tab
    myBookings: "Мои Бронирования & Билеты",
    noOrdersYet: "У вас пока нет забронированных туров",
    viewVoucher: "Посмотреть Ваучер и Билет",
    orderStatusPaid: "Оплачено (Подтверждено)",
    orderStatusPending: "В ожидании (Оплата в офисе)",
  }
};

// Global translation accessor
export function getTranslation(key, langSetting) {
  const eff = resolveEffectiveLanguage(langSetting);
  const dict = TRANSLATIONS[eff] || TRANSLATIONS['uz'];
  return dict[key] || TRANSLATIONS['uz'][key] || key;
}
