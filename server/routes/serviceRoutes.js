import express from 'express';
import pool from '../config/database.js';
import { sendServiceRequestEmails } from '../services/emailService.js';

const router = express.Router();

// Generate unique service ID
const generateServiceId = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return `SRV-${year}-${random}`;
};

// Create new service request
router.post('/', async (req, res) => {
    try {
        const {
            fullName,
            email,
            phone,
            device,
            customDevice,
            faultType,
            faultDescription,
            deliveryMethod,
            callbackPreference
        } = req.body;

        // Validate required fields
        if (!fullName || !email || !phone || !device || !faultType) {
            return res.status(400).json({ error: 'Gerekli alanlar eksik' });
        }

        const serviceId = generateServiceId();
        const finalDevice = device === 'Diğer' ? customDevice : device;

        // Insert into database
        const result = await pool.query(
            `INSERT INTO service_requests 
       (service_id, full_name, email, phone, device, custom_device, fault_type, fault_description, delivery_method, callback_preference)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
            [serviceId, fullName, email, phone, finalDevice, customDevice, faultType, faultDescription, deliveryMethod, callbackPreference || false]
        );

        const newRequest = result.rows[0];

        // Record initial status in history
        await pool.query(
            `INSERT INTO status_history (request_type, request_id, new_status, notes)
       VALUES ('service', $1, 'pending', 'Talep oluşturuldu')`,
            [newRequest.id]
        );

        // Send emails (async, don't wait)
        sendServiceRequestEmails({
            serviceId,
            fullName,
            email,
            phone,
            device: finalDevice,
            faultType,
            faultDescription,
            deliveryMethod,
            callbackPreference
        });

        res.status(201).json({
            success: true,
            message: 'Servis talebiniz başarıyla oluşturuldu',
            data: {
                serviceId,
                id: newRequest.id
            }
        });

    } catch (error) {
        console.error('Service request error:', error);
        res.status(500).json({ error: 'Sunucu hatası. Lütfen tekrar deneyin.' });
    }
});

// Get service request by tracking ID (public)
router.get('/track/:serviceId', async (req, res) => {
    try {
        const { serviceId } = req.params;

        const result = await pool.query(
            `SELECT service_id, device, fault_type, status, created_at, updated_at 
       FROM service_requests WHERE service_id = $1`,
            [serviceId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Talep bulunamadı' });
        }

        // Get status history
        const historyResult = await pool.query(
            `SELECT new_status, notes, created_at 
       FROM status_history 
       WHERE request_type = 'service' AND request_id = (
         SELECT id FROM service_requests WHERE service_id = $1
       )
       ORDER BY created_at DESC`,
            [serviceId]
        );

        res.json({
            request: result.rows[0],
            history: historyResult.rows
        });

    } catch (error) {
        console.error('Track service error:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

export default router;
