// USMWORLD AI Assistant Service powered by Google Gemini
// Model: gemini-flash-latest

const GEMINI_API_KEY = "AQ.Ab8RN6IWGkXspVHZRRJfDu4vhOqUfHJfv1LiZJUv6yiYhR_0ZQ";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

// System Instructions with USMWORLD Travel Knowledge Base
const SYSTEM_PROMPT = `
Siz USMWORLD xalqaro sayohat agentligining rasmiy, yuqori malakali va samimiy AI Sayohat Maslahatchisisiz (AI Travel Consultant).
Sizning vazifangiz — foydalanuvchilarning tur paketlari, viza qoidalari, narxlar, parvozlar, mehmonxonalar, sug'urta, Face ID biometriyasi va bron qilish jarayoni bo'yicha barcha savollariga aniq, to'liq va xushmuomala javob berish.

USMWORLD AGENTLIGI HAQIDA MA'LUMOTLAR:
- Nomi: USMWORLD Travel (Smart Tourism Automation)
- Boshqaruvchi: Xurshid (Bosh Administrator)
- Aloqa telefoni: +998 99 073 88 59 (operator bilan to'g'ridan-to'g'ri bog'lanish)
- Telegram: @xusmnv (rasmiy shaxsiy profil)
- Baza: Dunyoning 50 dan ortiq mashhur yo'nalishlari (Umra safari, Dubay, Antaliya, Maldiv orollari, Bali, Parij, Rim, Misr, Gruziya, Tailand, Yaponiya, Samarqand, Buxoro va boshqalar).
- Narxlar: Har bir tur uchun qulay narxlar, maxsus chegirmalar (masalan, 10% dan 50% gacha vaqtinchalik aksiyalar).
- To'lov usullari: Payme, Click, Uzum Bank, Visa / MasterCard xalqaro kartalari va ofisda naqd to'lov (0% komissiya).
- Innovatsiyalar: 
  * Xalqaro telefon raqamlari orqali SMS tasdiqlash kodi yuboriladi;
  * Biometrik Face ID (yuz skaneri) orqali sayohatchining surati rasmiy QR chipta va vaucherga muhrlanadi;
  * Chipta va vaucher to'lovdan so'ng darhol elektron tarzda taqdim etiladi.

VIZA VA TALABLAR:
- Dubay (BAA): O'zbekiston fuqarolari uchun 30 kungacha vizasiz rejim.
- Turkiya (Antaliya, Istanbul): 90 kungacha vizasiz.
- Gruziya (Tbilisi, Batumi): 1 yilgacha vizasiz.
- Maldiv orollari: Aeroportda 30 kunga bepul sayyohlik vizasi beriladi.
- Tailand: eVisa yoki aeroportda viza.
- Umra safari: Umra vizasi to'liq agentlik tomonidan rasmiylashtiriladi.
- Yevropa (Parij, Rim, Praga): Shengen vizasi kerak (USMWORLD to'liq hujjatlar paketini tayyorlab beradi).

MULOQOT QOIDALARI:
1. Foydalanuvchi qaysi tilda yozsa (O'zbek, Rus yoki Ingliz), mutlaqo o'sha tilda javob bering!
2. Javoblaringiz samimiy, tushunarli, chiroyli formatlangan (punktlar, emojilar bilan) bo'lsin.
3. Foydalanuvchi tur bron qilishni xohlasa, ilovadagi "Turlar" bo'limidan kerakli yo'nalishni tanlab, "Bron qilish" tugmasini bosishi mumkinligini tushuntiring.
4. Agar qo'ng'iroq qilishni yoki shaxsan yozishni so'rashsa, yuqori paneldagi "Qo'ng'iroq" tugmasi yoki Telegram @xusmnv orqali bog'lanish mumkinligini ayting.
`;

/**
 * Send message to Gemini API with conversational context
 * @param {string} userMessage - User query
 * @param {Array} history - Previous messages [{ role: 'user'|'model', text: string }]
 * @param {string} language - Current UI language ('uz', 'ru', 'en')
 * @returns {Promise<string>}
 */
export async function sendChatMessageToGemini(userMessage, history = [], language = 'uz') {
  if (!userMessage || !userMessage.trim()) return '';

  // Language hint
  const langInstruction = 
    language === 'ru' ? "Отвечай строго на русском языке." :
    language === 'en' ? "Respond strictly in English." :
    "O'zbek tilida chiroyli va ravon javob ber.";

  // Build Gemini contents array
  const contents = [];

  // Inject system prompt as initial primer
  contents.push({
    role: 'user',
    parts: [{ text: `${SYSTEM_PROMPT}\n\nQo'shimcha til ko'rsatmasi: ${langInstruction}` }]
  });
  contents.push({
    role: 'model',
    parts: [{ text: language === 'ru' 
      ? "Здравствуйте! Я ваш официальный ИИ-консультант USMWORLD Travel. Чем могу помочь по вашему путешествию?" 
      : language === 'en'
      ? "Hello! I am your official USMWORLD Travel AI consultant. How can I assist you with your travels today?"
      : "Assalomu alaykum! Men USMWORLD Travel agentligining aqlli AI maslahatchisiman. Sizga qaysi sayohat bo'yicha yordam bera olaman?"
    }]
  });

  // Append history
  if (Array.isArray(history)) {
    history.slice(-8).forEach(msg => {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      });
    });
  }

  // Append current user query
  contents.push({
    role: 'user',
    parts: [{ text: userMessage }]
  });

  try {
    const response = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024
        }
      })
    });

    if (!response.ok) {
      const errData = await response.text();
      console.warn("Gemini API error, falling back to local smart assistant:", errData);
      return getSmartFallbackResponse(userMessage, language);
    }

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (reply && reply.trim()) {
      return reply.trim();
    }

    return getSmartFallbackResponse(userMessage, language);
  } catch (error) {
    console.error("Gemini network error:", error);
    return getSmartFallbackResponse(userMessage, language);
  }
}

/**
 * High-quality offline fallback consultant in case network or API is temporarily unavailable
 */
export function getSmartFallbackResponse(query, language = 'uz') {
  const q = (query || '').toLowerCase();

  // Russian fallback answers
  if (language === 'ru') {
    if (q.includes('виз') || q.includes('дубай') || q.includes('турци') || q.includes('паспорт')) {
      return "✈️ **Визовые правила USMWORLD:**\n\n• **Дубай (ОАЭ):** Для граждан Узбекистана действует **безвизовый режим** до 30 дней!\n• **Турция (Анталья, Стамбул):** Без визы до 90 дней.\n• **Мальдивы:** Бесплатная виза по прибытии на 30 дней.\n• **Европа (Шенген):** Мы готовим полный пакет документов.\n\nНужен только загранпаспорт со сроком действия не менее 6 месяцев.";
    }
    if (q.includes('оплат') || q.includes('купить') || q.includes('бронир') || q.includes('цена') || q.includes('скидк')) {
      return "💳 **Бронирование и Оплата в USMWORLD:**\n\n1. Выберите тур в разделе **«Туры»**.\n2. Нажмите **«Забронировать»**.\n3. Пройдите быструю верификацию по СМС и **Face ID**.\n4. Оплатите через **Payme, Click, Uzum, Visa** или выберите наличный расчет в офисе (0% комиссии).\n5. Сразу после этого вы получите официальный электронный ваучер с QR-кодом!";
    }
    if (q.includes('умр') || q.includes('паломнич') || q.includes('мекк')) {
      return "🕋 **Программа «Умра 2026»:**\n\n• Прямой авиаперелет Ташкент – Джидда / Медина.\n• Отели 4★-5★ в пешей доступности от мечети аль-Харам.\n• Трехразовое питание, опытные гиды-элликбоши.\n• Полный пакет документов, страховка и виза включены в стоимость!";
    }
    return "Здравствуйте! Я официальный ИИ-помощник **USMWORLD Travel** 🌍.\n\nВы можете спросить меня о:\n• Актуальных ценах и горящих скидках на 50+ туров;\n• Визовых требованиях (Дубай, Турция, Мальдивы, Европа);\n• Процессе онлайн-бронирования с Face ID и способах оплаты.\n\nЧем я могу вам помочь?";
  }

  // English fallback answers
  if (language === 'en') {
    if (q.includes('visa') || q.includes('dubai') || q.includes('turkey') || q.includes('passport')) {
      return "✈️ **USMWORLD Visa Guidelines:**\n\n• **Dubai (UAE):** Visa-free entry for up to 30 days for Uzbekistan citizens!\n• **Turkey (Antalya, Istanbul):** Visa-free up to 90 days.\n• **Maldives:** Free 30-day visa on arrival.\n• **Europe (Schengen):** Full visa application support.\n\nAll you need is a valid passport with at least 6 months validity.";
    }
    if (q.includes('pay') || q.includes('book') || q.includes('price') || q.includes('discount')) {
      return "💳 **Booking & Payment at USMWORLD:**\n\n1. Select any tour from the **Tours** catalog.\n2. Click **Book Now**.\n3. Complete quick SMS and **Face ID** verification.\n4. Pay seamlessly via **Payme, Click, Uzum, Visa/MasterCard** or choose Cash at office.\n5. Download your official QR-stamped flight ticket & hotel voucher immediately!";
    }
    return "Hello! I am your official **USMWORLD Travel AI Assistant** 🌍.\n\nFeel free to ask about:\n• Over 50 international and domestic tour packages;\n• Visa requirements and travel documents;\n• Instant booking and biometric Face ID verification.\n\nHow can I help you today?";
  }

  // Uzbek fallback answers (default)
  if (q.includes('viza') || q.includes('dubay') || q.includes('turkiya') || q.includes('hujjat') || q.includes('pasport')) {
    return "✈️ **USMWORLD Viza Ma'lumotlari:**\n\n• **Dubay (BAA):** O‘zbekiston fuqarolari uchun 30 kungacha **vizasiz rejim** amal qiladi!\n• **Turkiya (Antaliya, Istanbul):** 90 kungacha vizasiz.\n• **Maldiv orollari:** Yetib borganda 30 kunga bepul sayyohlik vizasi beriladi.\n• **Gruziya:** 1 yilgacha vizasiz.\n• **Yevropa (Shengen):** USMWORLD to‘liq hujjatlar paketini tayyorlab beradi.\n\nSizdan faqat kamida 6 oy amal qiluvchi xorijga chiqish pasporti (qizil pasport) talab qilinadi.";
  }
  if (q.includes('tolov') || q.includes('to\'lov') || q.includes('bron') || q.includes('narx') || q.includes('chegirma')) {
    return "💳 **Turni Bron Qilish va To'lash Tartibi:**\n\n1. **Turlar** bo'limidan o'zingizga yoqqan yo'nalishni tanlang.\n2. **«Bron qilish»** tugmasini bosing.\n3. Telefoningizga kelgan 4 xonali SMS kodni kiriting.\n4. **Face ID** orqali yuzingizni skanerlang (bu chipta soxtalashtirilmasligi uchun vaucherga muhrlanadi).\n5. **Payme, Click, Uzum, Visa** yoki ofisda naqd to'lashni tanlang.\n6. To'lovdan so'ng darhol rasmiy QR-kodli bilet va vaucher beriladi!";
  }
  if (q.includes('umra') || q.includes('ziyorat') || q.includes('makka')) {
    return "🕋 **«Umra 2026» Maxsus Ziyorat Paketi:**\n\n• Toshkent – Jidda / Madina to‘g‘ridan-to‘g‘ri parvozlar.\n• Haram masjidiga yaqin 4★ va 5★ lyuks mehmonxonalar.\n• 3 mahal issiq taomlar va tajribali ellikboshi xizmati.\n• Viza, tibbiy sug'urta va qulay transferlar narx ichida!";
  }

  return "Assalomu alaykum! Men **USMWORLD Travel** agentligining rasmiy aqlli AI maslahatchisiman 🌍.\n\nMen sizga quyidagilarda yordam bera olaman:\n• 50 dan ortiq xalqaro va ichki turlar, narxlar va qaynoq chegirmalar;\n• Viza talablari (Dubay, Turkiya, Yevropa, Maldiv);\n• Online bron qilish, Face ID va xavfsiz to'lov usullari.\n\nQanday savolingiz bor?";
}
