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
