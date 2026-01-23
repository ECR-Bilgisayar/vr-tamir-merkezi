-- VR Tamir Merkezi - Supabase Database Schema
-- Bu SQL kodunu Supabase Dashboard > SQL Editor'da çalıştırın

-- Service Requests Table (Servis Talepleri)
CREATE TABLE IF NOT EXISTS service_requests (
    id BIGSERIAL PRIMARY KEY,
    service_id VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    device VARCHAR(100) NOT NULL,
    custom_device VARCHAR(100),
    fault_type VARCHAR(100) NOT NULL,
    fault_description TEXT,
    delivery_method VARCHAR(20) CHECK (delivery_method IN ('kargo', 'elden')),
    callback_preference BOOLEAN DEFAULT false,
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN (
        'pending',      -- Yeni Talep
        'contacted',    -- İletişime Geçildi
        'received',     -- Cihaz Teslim Alındı
        'diagnosed',    -- Arıza Tespiti Yapıldı
        'quoted',       -- Fiyat Teklifi Sunuldu
        'approved',     -- Müşteri Onayladı
        'repairing',    -- Onarım Sürecinde
        'repaired',     -- Onarım Tamamlandı
        'shipped',      -- Kargoya Verildi
        'delivered',    -- Müşteriye Teslim Edildi
        'cancelled'     -- İptal Edildi
    )),
    admin_notes TEXT,
    price_quote DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rental Requests Table (Kiralama Talepleri)
CREATE TABLE IF NOT EXISTS rental_requests (
    id BIGSERIAL PRIMARY KEY,
    rental_id VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    company VARCHAR(100),
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    product_name VARCHAR(100),
    quantity VARCHAR(20),
    duration VARCHAR(20),
    message TEXT,
    callback_preference BOOLEAN DEFAULT false,
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN (
        'pending',      -- Yeni Talep
        'contacted',    -- İletişime Geçildi
        'quoted',       -- Teklif Gönderildi
        'approved',     -- Onaylandı
        'active',       -- Kiralama Aktif
        'completed',    -- Tamamlandı
        'cancelled'     -- İptal Edildi
    )),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Status History Table (Durum Geçmişi)
CREATE TABLE IF NOT EXISTS status_history (
    id BIGSERIAL PRIMARY KEY,
    request_type VARCHAR(20) NOT NULL CHECK (request_type IN ('service', 'rental')),
    request_id BIGINT NOT NULL,
    old_status VARCHAR(30),
    new_status VARCHAR(30) NOT NULL,
    notes TEXT,
    changed_by VARCHAR(100) DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON service_requests(status);
CREATE INDEX IF NOT EXISTS idx_service_requests_created_at ON service_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_service_requests_service_id ON service_requests(service_id);
CREATE INDEX IF NOT EXISTS idx_rental_requests_status ON rental_requests(status);
CREATE INDEX IF NOT EXISTS idx_rental_requests_created_at ON rental_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rental_requests_rental_id ON rental_requests(rental_id);
CREATE INDEX IF NOT EXISTS idx_status_history_request ON status_history(request_type, request_id);

-- Function to automatically update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
DROP TRIGGER IF EXISTS update_service_requests_updated_at ON service_requests;
CREATE TRIGGER update_service_requests_updated_at
    BEFORE UPDATE ON service_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_rental_requests_updated_at ON rental_requests;
CREATE TRIGGER update_rental_requests_updated_at
    BEFORE UPDATE ON rental_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) - Opsiyonel
-- Bu özelliği aktif etmek isterseniz, aşağıdaki komutların yorumunu kaldırın:

-- ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE rental_requests ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE status_history ENABLE ROW LEVEL SECURITY;

-- Public read access for service tracking
-- CREATE POLICY "Anyone can view service requests by service_id"
--   ON service_requests FOR SELECT
--   USING (true);

-- Admin full access (API key ile kontrol edilecek)
-- CREATE POLICY "Service role can do everything"
--   ON service_requests
--   USING (auth.role() = 'service_role');

-- Başarılı! Tablolarınız oluşturuldu ✅
