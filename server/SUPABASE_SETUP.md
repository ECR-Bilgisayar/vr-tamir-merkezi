# VR Tamir Merkezi Backend - Supabase Kurulum Rehberi

## 📋 Gereksinimler

- Node.js (v18 veya üzeri)
- Supabase hesabı (ücretsiz)

## 🚀 Hızlı Başlangıç

### 1. Supabase Projesi Oluşturma

1. [Supabase](https://supabase.com) hesabınıza giriş yapın
2. "New Project" butonuna tıklayın
3. Proje adı, veritabanı şifresi belirleyin
4. Bölge seçin (en yakın: Frankfurt veya Amsterdam)
5. "Create Project" butonuna tıklayın

### 2. Veritabanı Tablolarını Oluşturma

Projeniz oluştuktan sonra:

1. Sol menüden **"SQL Editor"** sekmesine gidin
2. **"New Query"** butonuna tıklayın
3. `database/supabase-schema.sql` dosyasındaki tüm SQL kodunu kopyalayıp yapıştırın
4. **"Run"** butonuna tıklayın veya `Ctrl+Enter` basın

### 3. Supabase API Anahtarlarını Alma

1. Sol menüden **"Settings"** (⚙️) → **"API"** sekmesine gidin
2. Şu bilgileri kopyalayın:
   - **Project URL**: `https://xxxxxxxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 4. Backend Kurulumu

```bash
# Bağımlılıkları yükle
npm install

# .env dosyası oluştur
cp .env.example .env

# .env dosyasını düzenle ve bilgilerini doldur
nano .env  # veya herhangi bir editör
```

### 5. .env Dosyası Yapılandırması

`.env` dosyanızı açın ve şu bilgileri güncelleyin:

```env
# Supabase bilgilerinizi buraya yazın
SUPABASE_URL=https://xxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Admin kullanıcı bilgileri
ADMIN_USERNAME=admin
ADMIN_PASSWORD=güçlü-bir-şifre-123

# JWT için güvenli bir anahtar
JWT_SECRET=süper-gizli-jwt-anahtarı-buraya

# SendGrid (opsiyonel - email göndermek için)
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=info@vrtalamimerkezi.com
SENDGRID_ADMIN_EMAIL=admin@vrtalamimerkezi.com
```

### 6. Uygulamayı Çalıştırma

```bash
# Development modunda çalıştır
npm run dev

# Veya production modunda
npm start
```

Uygulama başarıyla çalıştığında şu çıktıyı göreceksiniz:

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

### 7. Test Etme

Tarayıcınızda şu adresi açın:
```
http://localhost:5000/api/health
```

Başarılı yanıt:
```json
{
  "status": "ok",
  "timestamp": "2025-01-23T...",
  "database": "connected",
  "message": "Supabase bağlantısı aktif"
}
```

## 🔧 Supabase Dashboard

Verilerinizi görüntülemek için:

1. Supabase Dashboard → **"Table Editor"** sekmesine gidin
2. Şu tabloları göreceksiniz:
   - `service_requests` - Servis talepleri
   - `rental_requests` - Kiralama talepleri
   - `status_history` - Durum geçmişi

## 📡 API Endpoints

### Public Endpoints
- `POST /api/service-requests` - Yeni servis talebi
- `POST /api/rental-requests` - Yeni kiralama talebi
- `GET /api/service-requests/track/:serviceId` - Takip

### Admin Endpoints (Authentication Required)
- `POST /api/admin/login` - Admin girişi
- `GET /api/admin/stats` - Dashboard istatistikleri
- `GET /api/admin/service-requests` - Tüm servis talepleri
- `PATCH /api/admin/service-requests/:id/status` - Durum güncelleme
- `DELETE /api/admin/service-requests/:id` - Talep silme

## 🔒 Güvenlik Notları

1. **Production'da mutlaka:**
   - Güçlü şifreler kullanın
   - JWT_SECRET'i değiştirin
   - CORS ayarlarını düzenleyin

2. **Supabase RLS (Row Level Security):**
   - Supabase'de RLS politikaları ekleyerek ekstra güvenlik sağlayabilirsiniz
   - Şu an backend üzerinden tüm erişim kontrolü yapılıyor

## 🐛 Sorun Giderme

### "SUPABASE_URL ve SUPABASE_ANON_KEY .env dosyasında tanımlanmalı!"
- `.env` dosyanızın olduğundan emin olun
- Supabase bilgilerini doğru kopyaladığınızı kontrol edin

### "Supabase bağlantı hatası"
- Supabase URL'inin doğru olduğunu kontrol edin
- API key'in doğru olduğunu kontrol edin
- İnternet bağlantınızı kontrol edin

### Tablolar görünmüyor
- SQL schema'yı Supabase SQL Editor'da çalıştırdığınızdan emin olun
- Hata mesajları varsa düzeltin ve tekrar çalıştırın

## 📦 Paket Bilgileri

Artık kullanılan paketler:
- ✅ `@supabase/supabase-js` - Supabase client
- ❌ `pg` - Kaldırıldı (artık PostgreSQL'e direkt bağlanmıyoruz)

## 🎉 Tamamdır!

Backend'iniz artık Supabase ile çalışıyor. Frontend uygulamanızı da güncelleyerek API'ye bağlayabilirsiniz.
