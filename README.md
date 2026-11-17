# 🌍 USMWORLD — Turistik Agentlik Faoliyatini Avtomatlashtirish Axborot Tizimi

Ushbu loyiha zamonaviy turizm agentliklari faoliyatini to'liq raqamlashtirish va avtomatlashtirish maqsadida ishlab chiqilgan. Tizim orqali mijozlar dunyo bo'ylab eng sara 50+ tur paketlarini tanlashlari, to'lovlarni onlayn amalga oshirishlari va bir zumda QR-kodli elektron vaucher (chipta)ga ega bo'lishlari mumkin.

---

## 🌟 Asosiy Imkoniyatlar va Funksionallik

### 1. 🧳 50 dan ortiq (52 ta) Keng Qamrovli Tur Paketlari
- **Ziyorat turlari**: Umra Safari 2026, Umra Ramazon (oxirgi 10 kunlik), Quddus va Al-Aqso, Madina VIP.
- **Yaqin Sharq & Ko'rfaz**: Dubay Premium, Abu Dabi Luvr, Doha (Qatar), Maskat (Ummon), Baku (Ozarbayjon).
- **Osiyo & Ekzotika**: Maldiv orollari VIP, Bali (Indoneziya), Phuket & Pattaya (Tailand), Kuala-Lumpur (Malayziya), Singapur, Tokio & Kioto (Yaponiya), Seul & Jeju (Janubiy Koreya), Xanoy & Halong Bay (Vyetnam), Shri-Lanka, Goa (Hindiston), Filippin Boracay.
- **Yevropa & Shaharlar**: Rim, Parij, Barselona, Madrid, Shveytsariya Alp tog'lari, Praga, Vena, Amsterdam lola bog'lari, Santorini (Gretsiya), Budapesht, London, Tbilisi & Kazbegi, Berlin, Milan & Komo ko'li.
- **Dengiz & Kurortlar**: Antaliya, Sharm ash-Shayx, Xurgada, Bodrum, Zanzibar (Tanzaniya), Seyshel orollari, Kipr Ayia Napa, Koh Samui.
- **O'zbekiston Ichki Turizmi**: Samarqand, Buxoro, Xiva Ichan Qal'a, Zomin tog' kurorti, Amirsoy chang'i bazasi, Mo'ynoq va Orol dengizi ekspeditsiyasi, Farg'ona vodiysi, Termiz, Navoiy Sarmishsoy, Shahrisabz.

---

### 2. 🔐 Animatsiyali Ro'yxatdan O'tish va Eslab Qolish (Auth)
- Dastur ochilganda birinchi bo'lib **Travel Boarding Pass** ko'rinishidagi ro'yxatdan o'tish ekrani chiqadi.
- Samolyot parvozi va interaktiv animatsiyalar bilan boyitilgan.
- Foydalanuvchi Gmail yoki Email bilan kirganda, uning akkaunti xotirada eslab qolinadi.
- Chiqish (**Logout**) va profil boshqaruvi mavjud.

---

### 3. 👑 Maxsus Yopiq Bosh Administrator Paneli (Private Security)
- Boshqaruv paneli to'liq himoyalangan bo'lib, admin ma'lumotlari tashqaridan ko'rinmaydi.
- Faqat tizim egasi maxsus admin hisobi bilan kirganda dastur uni Bosh Administrator deb taniydi va boshqaruv huquqlarini beradi.
- Oddiy foydalanuvchilar va mehmonlar uchun ushbu bo'lim yopiq hisoblanadi.

#### 🛠 Admin Huquqlari:
1. **Narxlarni to'g'ridan-to'g'ri o'zgartirish**: Istalgan turning narxini bir zumda yangilash (yangi narx kiritib «Saqlash» tugmasi bosiladi).
2. **Qurilmadan (Laptop / Telefon) Rasm Yuklash & Qirqish**: 
   - Kompyuter yoki telefon xotirasidan to'g'ridan-to'g'ri rasm yuklash.
   - **Interaktiv Qirqish (Crop & Zoom)**: Rasmni siljitib, 16:10 formatdagi kerakli qismini kesib olib, yangi turga biriktirish!
3. **Yangi tur qo'shish**: Tur nomi, toifasi, davlati, shahri, qulayliklari va davomiyligini kiritish.
4. **Turlarni o'chirish / arxivlash**.
5. **Kelib tushgan buyurtmalarni nazorat qilish** (To'lovni tasdiqlash, bekor qilish, elektron vaucherlarni ko'rish).
6. **Moliya tahlili**: Jami tushum, kutilayotgan to'lovlar, hisobotni JSON formatida yuklab olish.

---

### 4. 💳 To'lov Usullari va Elektron Chipta
- Payme, Click Up, Uzum Bank, Visa/Mastercard va Naqd to'lov simulyatsiyasi.
- SMS kod tasdiqlash va bayramona konfetti effekti.
- **QR-kodli rasmiy E-Vaucher (Chipta)**: Chop etish va PDF saqlash.

---

### 5. 📱 Mobil Moslashuv va APK / PWA
- Pastki suzuvchi boshqaruv paneli (**Bottom Navigation Bar**).
- **Telefon Simulyatori**: Kompyuterda ochganda iPhone ekrani ramkasida sinab ko'rish imkoniyati.
- **PWA / APK**: Telefonga bir bosishda ilova sifatida o'rnatish.

---

## 🏃‍♂️ Dasturni Ishga Tushirish

```bash
npm run dev
```
Brauzerda ochish: **http://localhost:3000**
