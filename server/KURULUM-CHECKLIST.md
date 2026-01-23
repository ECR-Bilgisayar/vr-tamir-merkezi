# ✅ Supabase Backend Kurulum Checklist

Backend'inizi hızlıca çalıştırmak için bu adımları takip edin:

## 1️⃣ Supabase Hesabı ve Proje

- [ ] [supabase.com](https://supabase.com)'a git ve kayıt ol
- [ ] "New Project" ile yeni proje oluştur
- [ ] Proje adını belirle (örn: vr-tamir-merkezi)
- [ ] Database şifresi oluştur (kaydet!)
- [ ] Bölge seç (en yakın: Frankfurt)
- [ ] Projenin oluşmasını bekle (1-2 dakika)

## 2️⃣ Veritabanı Tablolarını Oluştur

- [ ] Supabase Dashboard'da sol menüden "SQL Editor" aç
- [ ] "New Query" butonuna tıkla
- [ ] `database/supabase-schema.sql` dosyasını aç
- [ ] Tüm SQL kodunu kopyala
- [ ] SQL Editor'a yapıştır
- [ ] "Run" butonuna bas (Ctrl+Enter)
- [ ] Başarılı mesajı gör ✅

**Kontrol:** Sol menüden "Table Editor" → 3 tablo görmelisin:
- service_requests
- rental_requests  
- status_history

## 3️⃣ API Anahtarlarını Al

- [ ] Sol menüden "Settings" (⚙️) → "API" aç
- [ ] **Project URL**'i kopyala
  - Şuna benzer: `https://xyzabc123.supabase.co`
- [ ] **anon public** key'i kopyala
  - Çok uzun bir string (eyJhbGc... ile başlar)

## 4️⃣ Backend Kurulumu

```bash
# Terminal'de backend klasörüne git
cd server

# Bağımlılıkları yükle
npm install

# .env dosyası oluştur
cp .env.example .env
```

## 5️⃣ .env Dosyasını Doldur

- [ ] `.env` dosyasını aç (VSCode, Notepad++ vs.)
- [ ] Şu satırları doldur:

```env
# Port ayarı
PORT=5000
NODE_ENV=development

# Supabase bilgilerini buraya yapıştır
SUPABASE_URL=https://xyzabc123.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Admin giriş bilgileri
ADMIN_USERNAME=admin
ADMIN_PASSWORD=GüçlüŞifre123!

# JWT için rastgele bir anahtar
JWT_SECRET=süper-gizli-jwt-key-12345

# Email (opsiyonel - şimdilik boş bırakabilirsin)
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=
SENDGRID_ADMIN_EMAIL=
```

## 6️⃣ Uygulamayı Başlat

```bash
# Development modunda çalıştır
npm run dev
```

**Beklenen çıktı:**
```
╔════════════════════════════════════════════╗
║     VR Tamir Merkezi Backend Server        ║
╠════════════════════════════════════════════╣
║  🚀 Server: http://localhost:5000          ║
║  📦 API: http://localhost:5000/api         ║
║  🔐 Admin: http://localhost:5000/api/admin ║
║  ✨ Database: Supabase                     ║
╚════════════════════════════════════════════╝
✅ Supabase bağlantısı başarılı
```

## 7️⃣ Test Et

- [ ] Tarayıcıda aç: `http://localhost:5000/api/health`

**Başarılı yanıt:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-23T...",
  "database": "connected",
  "message": "Supabase bağlantısı aktif"
}
```

## 8️⃣ Frontend'i Güncelle (Varsa)

Frontend .env dosyanızda backend URL'ini güncelleyin:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚨 Sorun mu Yaşıyorsun?

### Hata: "SUPABASE_URL ve SUPABASE_ANON_KEY .env dosyasında tanımlanmalı!"
✅ **Çözüm:** `.env` dosyasının olduğundan ve değerlerin doldurulduğundan emin ol

### Hata: "Supabase bağlantı hatası"
✅ **Çözüm:** 
- SUPABASE_URL doğru mu?
- SUPABASE_ANON_KEY doğru mu?
- İnternet bağlantın var mı?

### Hata: "Table 'service_requests' does not exist"
✅ **Çözüm:** Adım 2'yi tekrar yap - SQL schema'yı Supabase'de çalıştır

### Port 5000 zaten kullanımda
✅ **Çözüm:** `.env` dosyasında `PORT=5001` yap

---

## 🎉 Tamamlandı!

Hepsi bu kadar! Backend'iniz artık Supabase ile çalışıyor.

**Sonraki Adımlar:**
- Frontend uygulamanızı da backend'e bağlayın
- Admin paneline giriş yapın
- Test verisi oluşturun

**Faydalı Linkler:**
- Supabase Dashboard: https://supabase.com/dashboard
- API Docs: `SUPABASE_SETUP.md`
- Değişiklikler: `DEGISIKLIKLER.md`
