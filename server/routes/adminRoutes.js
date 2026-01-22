import express from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/database.js';
import { authenticateToken, generateToken } from '../middleware/auth.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Status labels in Turkish
const SERVICE_STATUS_LABELS = {
    pending: 'Yeni Talep',
    contacted: 'İletişime Geçildi',
    received: 'Cihaz Teslim Alındı',
    diagnosed: 'Arıza Tespiti Yapıldı',
    quoted: 'Fiyat Teklifi Sunuldu',
    approved: 'Müşteri Onayladı',
    repairing: 'Onarım Sürecinde',
    repaired: 'Onarım Tamamlandı',
    shipped: 'Kargoya Verildi',
    delivered: 'Teslim Edildi',
    cancelled: 'İptal Edildi'
};

const RENTAL_STATUS_LABELS = {
    pending: 'Yeni Talep',
    contacted: 'İletişime Geçildi',
    quoted: 'Teklif Gönderildi',
    approved: 'Onaylandı',
    active: 'Kiralama Aktif',
    completed: 'Tamamlandı',
    cancelled: 'İptal Edildi'
};

// Admin Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check against environment variables (single admin)
        if (username !== process.env.ADMIN_USERNAME) {
            return res.status(401).json({ error: 'Geçersiz kullanıcı adı veya şifre' });
        }

        // Compare password (plain text comparison for simplicity with env var)
        if (password !== process.env.ADMIN_PASSWORD) {
            return res.status(401).json({ error: 'Geçersiz kullanıcı adı veya şifre' });
        }

        // Generate JWT token
        const token = generateToken({ username, role: 'admin' });

        res.json({
            success: true,
            token,
            user: { username, role: 'admin' }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Giriş işlemi başarısız' });
    }
});

// Verify token
router.get('/verify', authenticateToken, (req, res) => {
    res.json({ valid: true, user: req.user });
});

// Get dashboard stats
router.get('/stats', authenticateToken, async (req, res) => {
    try {
        // Service request stats
        const serviceStats = await pool.query(`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'pending') as pending,
        COUNT(*) FILTER (WHERE status IN ('contacted', 'received', 'diagnosed', 'quoted', 'approved', 'repairing')) as in_progress,
        COUNT(*) FILTER (WHERE status IN ('repaired', 'shipped', 'delivered')) as completed,
        COUNT(*) as total
      FROM service_requests
    `);

        // Rental request stats
        const rentalStats = await pool.query(`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'pending') as pending,
        COUNT(*) FILTER (WHERE status IN ('contacted', 'quoted', 'approved', 'active')) as in_progress,
        COUNT(*) FILTER (WHERE status = 'completed') as completed,
        COUNT(*) as total
      FROM rental_requests
    `);

        // Recent activity
        const recentActivity = await pool.query(`
      (SELECT 'service' as type, service_id as ref_id, full_name, status, created_at 
       FROM service_requests ORDER BY created_at DESC LIMIT 5)
      UNION ALL
      (SELECT 'rental' as type, rental_id as ref_id, full_name, status, created_at 
       FROM rental_requests ORDER BY created_at DESC LIMIT 5)
      ORDER BY created_at DESC LIMIT 10
    `);

        res.json({
            service: serviceStats.rows[0],
            rental: rentalStats.rows[0],
            recentActivity: recentActivity.rows
        });

    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'İstatistikler alınamadı' });
    }
});

// Get all service requests
router.get('/service-requests', authenticateToken, async (req, res) => {
    try {
        const { status, search, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        let query = 'SELECT * FROM service_requests WHERE 1=1';
        const params = [];
        let paramIndex = 1;

        if (status && status !== 'all') {
            query += ` AND status = $${paramIndex++}`;
            params.push(status);
        }

        if (search) {
            query += ` AND (full_name ILIKE $${paramIndex} OR email ILIKE $${paramIndex} OR service_id ILIKE $${paramIndex} OR phone ILIKE $${paramIndex})`;
            params.push(`%${search}%`);
            paramIndex++;
        }

        query += ' ORDER BY created_at DESC';
        query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
        params.push(parseInt(limit), parseInt(offset));

        const result = await pool.query(query, params);

        // Get total count
        let countQuery = 'SELECT COUNT(*) FROM service_requests WHERE 1=1';
        const countParams = [];
        let countIndex = 1;

        if (status && status !== 'all') {
            countQuery += ` AND status = $${countIndex++}`;
            countParams.push(status);
        }
        if (search) {
            countQuery += ` AND (full_name ILIKE $${countIndex} OR email ILIKE $${countIndex} OR service_id ILIKE $${countIndex})`;
            countParams.push(`%${search}%`);
        }

        const countResult = await pool.query(countQuery, countParams);

        res.json({
            requests: result.rows,
            total: parseInt(countResult.rows[0].count),
            page: parseInt(page),
            limit: parseInt(limit),
            statusLabels: SERVICE_STATUS_LABELS
        });

    } catch (error) {
        console.error('Get service requests error:', error);
        res.status(500).json({ error: 'Veriler alınamadı' });
    }
});

// Get single service request
router.get('/service-requests/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'SELECT * FROM service_requests WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Talep bulunamadı' });
        }

        // Get status history
        const historyResult = await pool.query(
            `SELECT * FROM status_history 
       WHERE request_type = 'service' AND request_id = $1 
       ORDER BY created_at DESC`,
            [id]
        );

        res.json({
            request: result.rows[0],
            history: historyResult.rows,
            statusLabels: SERVICE_STATUS_LABELS
        });

    } catch (error) {
        console.error('Get service request error:', error);
        res.status(500).json({ error: 'Veri alınamadı' });
    }
});

// Update service request status
router.patch('/service-requests/:id/status', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes, priceQuote } = req.body;

        // Get current status
        const currentResult = await pool.query(
            'SELECT status FROM service_requests WHERE id = $1',
            [id]
        );

        if (currentResult.rows.length === 0) {
            return res.status(404).json({ error: 'Talep bulunamadı' });
        }

        const oldStatus = currentResult.rows[0].status;

        // Update status
        let updateQuery = 'UPDATE service_requests SET status = $1';
        const updateParams = [status];
        let paramIndex = 2;

        if (notes) {
            updateQuery += `, admin_notes = $${paramIndex++}`;
            updateParams.push(notes);
        }

        if (priceQuote) {
            updateQuery += `, price_quote = $${paramIndex++}`;
            updateParams.push(priceQuote);
        }

        updateQuery += ` WHERE id = $${paramIndex} RETURNING *`;
        updateParams.push(id);

        const result = await pool.query(updateQuery, updateParams);

        // Record status change in history
        await pool.query(
            `INSERT INTO status_history (request_type, request_id, old_status, new_status, notes, changed_by)
       VALUES ('service', $1, $2, $3, $4, $5)`,
            [id, oldStatus, status, notes || null, req.user.username]
        );

        res.json({
            success: true,
            message: 'Durum güncellendi',
            request: result.rows[0]
        });

    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ error: 'Güncelleme başarısız' });
    }
});

// Get all rental requests
router.get('/rental-requests', authenticateToken, async (req, res) => {
    try {
        const { status, search, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        let query = 'SELECT * FROM rental_requests WHERE 1=1';
        const params = [];
        let paramIndex = 1;

        if (status && status !== 'all') {
            query += ` AND status = $${paramIndex++}`;
            params.push(status);
        }

        if (search) {
            query += ` AND (full_name ILIKE $${paramIndex} OR company ILIKE $${paramIndex} OR email ILIKE $${paramIndex} OR rental_id ILIKE $${paramIndex})`;
            params.push(`%${search}%`);
            paramIndex++;
        }

        query += ' ORDER BY created_at DESC';
        query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
        params.push(parseInt(limit), parseInt(offset));

        const result = await pool.query(query, params);

        res.json({
            requests: result.rows,
            statusLabels: RENTAL_STATUS_LABELS
        });

    } catch (error) {
        console.error('Get rental requests error:', error);
        res.status(500).json({ error: 'Veriler alınamadı' });
    }
});

// Update rental request status
router.patch('/rental-requests/:id/status', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        const currentResult = await pool.query(
            'SELECT status FROM rental_requests WHERE id = $1',
            [id]
        );

        if (currentResult.rows.length === 0) {
            return res.status(404).json({ error: 'Talep bulunamadı' });
        }

        const oldStatus = currentResult.rows[0].status;

        const result = await pool.query(
            'UPDATE rental_requests SET status = $1, admin_notes = COALESCE($2, admin_notes) WHERE id = $3 RETURNING *',
            [status, notes, id]
        );

        await pool.query(
            `INSERT INTO status_history (request_type, request_id, old_status, new_status, notes, changed_by)
       VALUES ('rental', $1, $2, $3, $4, $5)`,
            [id, oldStatus, status, notes || null, req.user.username]
        );

        res.json({
            success: true,
            message: 'Durum güncellendi',
            request: result.rows[0]
        });

    } catch (error) {
        console.error('Update rental status error:', error);
        res.status(500).json({ error: 'Güncelleme başarısız' });
    }
});

// Delete service request
router.delete('/service-requests/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query('DELETE FROM status_history WHERE request_type = $1 AND request_id = $2', ['service', id]);
        await pool.query('DELETE FROM service_requests WHERE id = $1', [id]);

        res.json({ success: true, message: 'Talep silindi' });

    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'Silme işlemi başarısız' });
    }
});

// Delete rental request
router.delete('/rental-requests/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query('DELETE FROM status_history WHERE request_type = $1 AND request_id = $2', ['rental', id]);
        await pool.query('DELETE FROM rental_requests WHERE id = $1', [id]);

        res.json({ success: true, message: 'Talep silindi' });

    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'Silme işlemi başarısız' });
    }
});

export default router;
