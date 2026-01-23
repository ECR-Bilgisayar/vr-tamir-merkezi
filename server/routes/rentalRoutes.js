import express from 'express';
import supabase from '../config/supabase.js';
import { sendRentalRequestEmails } from '../services/emailService.js';

const router = express.Router();

// Generate unique rental ID
const generateRentalId = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return `RNT-${year}-${random}`;
};

// Track rental request by rental_id (public endpoint)
router.get('/track/:rentalId', async (req, res) => {
    try {
        const { rentalId } = req.params;

        // Get rental request
        const { data: request, error } = await supabase
            .from('rental_requests')
            .select('*')
            .eq('rental_id', rentalId.toUpperCase())
            .single();

        if (error || !request) {
            return res.status(404).json({ error: 'Talep bulunamadı. Takip numaranızı kontrol edin.' });
        }

        // Get status history
        const { data: history } = await supabase
            .from('status_history')
            .select('*')
            .eq('request_type', 'rental')
            .eq('request_id', request.id)
            .order('created_at', { ascending: false });

        res.json({
            request: {
                rental_id: request.rental_id,
                status: request.status,
                company: request.company,
                full_name: request.full_name,
                product_name: request.product_name,
                quantity: request.quantity,
                duration: request.duration,
                created_at: request.created_at,
                updated_at: request.updated_at
            },
            history: history || []
        });

    } catch (error) {
        console.error('Track rental error:', error);
        res.status(500).json({ error: 'Sorgulama sırasında bir hata oluştu' });
    }
});

// Create new rental request
router.post('/', async (req, res) => {
    try {
        const {
            fullName,
            company,
            email,
            phone,
            productName,
            quantity,
            duration,
            message,
            callbackPreference
        } = req.body;

        // Validate required fields
        if (!fullName || !email || !phone) {
            return res.status(400).json({ error: 'Gerekli alanlar eksik' });
        }

        const rentalId = generateRentalId();

        // Insert into Supabase
        const { data: newRequest, error: insertError } = await supabase
            .from('rental_requests')
            .insert([{
                rental_id: rentalId,
                full_name: fullName,
                company,
                email,
                phone,
                product_name: productName,
                quantity,
                duration,
                message,
                callback_preference: callbackPreference || false
            }])
            .select()
            .single();

        if (insertError) {
            console.error('Supabase insert error:', insertError);
            return res.status(500).json({ error: 'Veritabanı hatası' });
        }

        // Record initial status in history
        await supabase
            .from('status_history')
            .insert([{
                request_type: 'rental',
                request_id: newRequest.id,
                new_status: 'pending',
                notes: 'Talep oluşturuldu'
            }]);

        // Send emails
        sendRentalRequestEmails({
            rentalId,
            fullName,
            company,
            email,
            phone,
            productName,
            quantity,
            duration,
            message,
            callbackPreference
        });

        res.status(201).json({
            success: true,
            message: 'Kiralama talebiniz başarıyla oluşturuldu',
            data: {
                rentalId,
                id: newRequest.id
            }
        });

    } catch (error) {
        console.error('Rental request error:', error);
        res.status(500).json({ error: 'Sunucu hatası. Lütfen tekrar deneyin.' });
    }
});

export default router;

