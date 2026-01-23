# 🎯 Backend Supabase Dönüşümü - Yapılan Değişiklikler

## 📦 Değiştirilen Dosyalar

### 1. **package.json**
- ❌ Kaldırıldı: `pg` (PostgreSQL direct connection)
- ✅ Eklendi: `@supabase/supabase-js` (Supabase client)

### 2. **config/database.js → config/supabase.js**
- PostgreSQL pool bağlantısı tamamen kaldırıldı
- Supabase client ile değiştirildi
- Otomatik bağlantı testi eklendi
- Environment variable kontrolü eklendi

### 3. **routes/serviceRoutes.js**
**Değişiklikler:**
- `pool.query()` → `supabase.from().insert/select/update/delete()`
- SQL query'ler → Supabase query builder metodları
- `.rows[0]` → `.single()` veya direkt data kullanımı

**Öncesi:**
```javascript
const result = await pool.query(
    'INSERT INTO service_requests ... VALUES ($1, $2...)',
    [serviceId, fullName, ...]
);
const newRequest = result.rows[0];
```

**Sonrası:**
```javascript
const { data: newRequest, error } = await supabase
    .from('service_requests')
    .insert([{ service_id: serviceId, full_name: fullName, ... }])
    .select()
    .single();
```

### 4. **routes/rentalRoutes.js**
Aynı değişiklikler serviceRoutes.js ile

### 5. **routes/adminRoutes.js**
**Önemli Değişiklikler:**

**Stats endpoint:**
- PostgreSQL aggregate fonksiyonları → JavaScript filter/map
- UNION ALL sorguları → Ayrı sorgular + JavaScript birleştirme

**List/Search endpoints:**
- Parametreli SQL ($1, $2...) → Supabase query builder
- ILIKE sorguları → `.or()` ve `.ilike()` metodları
- LIMIT/OFFSET → `.range()` metodu

**CRUD işlemleri:**
- SQL UPDATE → `.update().eq()`
- SQL DELETE → `.delete().eq()`
- SQL SELECT → `.select().eq()`

### 6. **index.js**
- `import pool` → `import supabase`
- Health check endpoint'i Supabase ile test ediyor

## 🆕 Yeni Dosyalar

### 1. **SUPABASE_SETUP.md**
Eksiksiz kurulum rehberi:
- Supabase projesi oluşturma
- SQL schema çalıştırma
- API key alma
- .env yapılandırması
- Çalıştırma ve test

### 2. **database/supabase-schema.sql**
Supabase SQL Editor'da çalıştırılacak schema:
- Tüm tablolar
- Indexler
- Triggerlar
- RLS politika örnekleri (yorum satırında)

### 3. **.env.example**
Güncellenmiş environment variables:
```env
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
# (DATABASE_URL kaldırıldı)
```

## 🔄 Query Dönüşüm Örnekleri

### INSERT
**Önce:**
```javascript
await pool.query(
    'INSERT INTO table (col1, col2) VALUES ($1, $2) RETURNING *',
    [val1, val2]
);
```

**Sonra:**
```javascript
await supabase
    .from('table')
    .insert([{ col1: val1, col2: val2 }])
    .select()
    .single();
```

### SELECT with WHERE
**Önce:**
```javascript
await pool.query('SELECT * FROM table WHERE id = $1', [id]);
```

**Sonra:**
```javascript
await supabase
    .from('table')
    .select('*')
    .eq('id', id)
    .single();
```

### UPDATE
**Önce:**
```javascript
await pool.query(
    'UPDATE table SET col = $1 WHERE id = $2 RETURNING *',
    [value, id]
);
```

**Sonra:**
```javascript
await supabase
    .from('table')
    .update({ col: value })
    .eq('id', id)
    .select()
    .single();
```

### DELETE
**Önce:**
```javascript
await pool.query('DELETE FROM table WHERE id = $1', [id]);
```

**Sonra:**
```javascript
await supabase
    .from('table')
    .delete()
    .eq('id', id);
```

### SEARCH (ILIKE)
**Önce:**
```javascript
await pool.query(
    'SELECT * FROM table WHERE name ILIKE $1 OR email ILIKE $1',
    [`%${search}%`]
);
```

**Sonra:**
```javascript
await supabase
    .from('table')
    .select('*')
    .or(`name.ilike.%${search}%,email.ilike.%${search}%`);
```

### PAGINATION
**Önce:**
```javascript
await pool.query(
    'SELECT * FROM table LIMIT $1 OFFSET $2',
    [limit, offset]
);
```

**Sonra:**
```javascript
await supabase
    .from('table')
    .select('*')
    .range(offset, offset + limit - 1);
```

## ✅ Avantajlar

1. **Kolay Kurulum**: Local PostgreSQL kurulumu gereksiz
2. **Otomatik Yedekleme**: Supabase otomatik backup alıyor
3. **Gerçek Zamanlı**: Supabase realtime özelliği eklenebilir
4. **Admin Dashboard**: Supabase'de görsel veritabanı yönetimi
5. **Daha Az Kod**: Query builder daha okunabilir
6. **Type Safety**: TypeScript desteği hazır
7. **Ücretsiz**: Generous free tier

## 🚀 Nasıl Çalıştırılır

```bash
# 1. Bağımlılıkları yükle
npm install

# 2. .env dosyası oluştur
cp .env.example .env

# 3. Supabase bilgilerini .env'ye ekle
# (SUPABASE_SETUP.md'ye bakın)

# 4. Supabase'de SQL schema'yı çalıştır
# (database/supabase-schema.sql'i kopyala-yapıştır)

# 5. Uygulamayı başlat
npm run dev
```

## 📝 Dikkat Edilmesi Gerekenler

1. **Error Handling**: 
   - `result.rows` → `data` ve `error` kontrolü
   - Her Supabase çağrısında `error` kontrol edilmeli

2. **Response Yapısı**:
   - PostgreSQL: `{ rows: [...], rowCount: ... }`
   - Supabase: `{ data: [...], error: null, count: ... }`

3. **Null Handling**:
   - Supabase boş sonuçta `null` döner
   - Array bekliyorsanız `|| []` ekleyin

4. **Transactions**:
   - PostgreSQL gibi manuel transaction yok
   - Supabase RPCs kullanılabilir

## 🎉 Sonuç

Backend artık tamamen Supabase ile çalışıyor! Local PostgreSQL kurulumu gerekmeden direkt Supabase cloud veritabanınıza bağlanıyor.
