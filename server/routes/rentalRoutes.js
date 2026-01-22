import express from 'express';
import pool from '../config/database.js';
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

        // Insert into database
        const result = await pool.query(
            `INSERT INTO rental_requests 
       (rental_id, full_name, company, email, phone, product_name, quantity, duration, message, callback_preference)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
            [rentalId, fullName, company, email, phone, productName, quantity, duration, message, callbackPreference || false]
        );

        const newRequest = result.rows[0];

        // Record initial status in history
        await pool.query(
            `INSERT INTO status_history (request_type, request_id, new_status, notes)
       VALUES ('rental', $1, 'pending', 'Talep oluşturuldu')`,
            [newRequest.id]
        );

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
