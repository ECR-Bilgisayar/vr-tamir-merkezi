import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY (veya ANON_KEY) .env dosyasında tanımlanmalı!');
    process.exit(1);
}

// Supabase client oluştur
const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

// Bağlantıyı test et
(async () => {
    try {
        const { data, error } = await supabase.from('service_requests').select('count').limit(1);
        if (error && error.code !== 'PGRST116') { // PGRST116 = tablo yok hatası
            console.error('❌ Supabase bağlantı hatası:', error.message);
        } else {
            console.log('✅ Supabase bağlantısı başarılı');
        }
    } catch (err) {
        console.error('❌ Supabase bağlantı testi hatası:', err.message);
    }
})();

export default supabase;
