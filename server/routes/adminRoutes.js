import express from 'express';
import bcrypt from 'bcryptjs';
import supabase from '../config/supabase.js';
import { authenticateToken, generateToken } from '../middleware/auth.js';
import { sendDeviceReceivedEmail, sendPriceQuoteEmail } from '../services/emailService.js';
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
        const { data: serviceRequests } = await supabase
            .from('service_requests')
            .select('status');

        const servicePending = serviceRequests?.filter(r => r.status === 'pending').length || 0;
        const serviceInProgress = serviceRequests?.filter(r =>
            ['contacted', 'received', 'diagnosed', 'quoted', 'approved', 'repairing'].includes(r.status)
        ).length || 0;
        const serviceCompleted = serviceRequests?.filter(r =>
            ['repaired', 'shipped', 'delivered'].includes(r.status)
        ).length || 0;

        // Rental request stats
        const { data: rentalRequests } = await supabase
            .from('rental_requests')
            .select('status');

        const rentalPending = rentalRequests?.filter(r => r.status === 'pending').length || 0;
        const rentalInProgress = rentalRequests?.filter(r =>
            ['contacted', 'quoted', 'approved', 'active'].includes(r.status)
        ).length || 0;
        const rentalCompleted = rentalRequests?.filter(r => r.status === 'completed').length || 0;

        // Recent activity - Service requests
        const { data: recentServices } = await supabase
            .from('service_requests')
            .select('service_id, full_name, status, created_at')
            .order('created_at', { ascending: false })
            .limit(5);

        // Recent activity - Rental requests
        const { data: recentRentals } = await supabase
            .from('rental_requests')
            .select('rental_id, full_name, status, created_at')
            .order('created_at', { ascending: false })
            .limit(5);

        // Combine and sort recent activity
        const recentActivity = [
            ...(recentServices || []).map(r => ({ type: 'service', ref_id: r.service_id, ...r })),
            ...(recentRentals || []).map(r => ({ type: 'rental', ref_id: r.rental_id, ...r }))
        ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 10);

        res.json({
            service: {
                pending: servicePending,
                in_progress: serviceInProgress,
                completed: serviceCompleted,
                total: serviceRequests?.length || 0
            },
            rental: {
                pending: rentalPending,
                in_progress: rentalInProgress,
                completed: rentalCompleted,
                total: rentalRequests?.length || 0
            },
            recentActivity
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

        let query = supabase
            .from('service_requests')
            .select('*', { count: 'exact' });

        if (status && status !== 'all') {
            query = query.eq('status', status);
        }

        if (search) {
            query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,service_id.ilike.%${search}%,phone.ilike.%${search}%`);
        }

        const { data: requests, error, count } = await query
            .order('created_at', { ascending: false })
            .range(offset, offset + parseInt(limit) - 1);

        if (error) {
            console.error('Supabase error:', error);
            return res.status(500).json({ error: 'Veriler alınamadı' });
        }

        res.json({
            requests: requests || [],
            total: count || 0,
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

        const { data: request, error } = await supabase
            .from('service_requests')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !request) {
            return res.status(404).json({ error: 'Talep bulunamadı' });
        }

        // Get status history
        const { data: history } = await supabase
            .from('status_history')
            .select('*')
            .eq('request_type', 'service')
            .eq('request_id', id)
            .order('created_at', { ascending: false });

        res.json({
            request,
            history: history || [],
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

        // Get current request with customer info for email
        const { data: currentRequest } = await supabase
            .from('service_requests')
            .select('*')
            .eq('id', id)
            .single();

        if (!currentRequest) {
            return res.status(404).json({ error: 'Talep bulunamadı' });
        }

        const oldStatus = currentRequest.status;

        // Update status
        const updateData = { status };
        if (notes) updateData.admin_notes = notes;
        if (priceQuote) updateData.price_quote = priceQuote;

        const { data: updatedRequest, error } = await supabase
            .from('service_requests')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Update error:', error);
            return res.status(500).json({ error: 'Güncelleme başarısız' });
        }

        // Record status change in history
        await supabase
            .from('status_history')
            .insert([{
                request_type: 'service',
                request_id: parseInt(id),
                old_status: oldStatus,
                new_status: status,
                notes: notes || null,
                changed_by: req.user.username
            }]);

        // Send notification emails for specific status changes
        const emailData = {
            email: currentRequest.email,
            fullName: currentRequest.full_name,
            serviceId: currentRequest.service_id,
            device: currentRequest.device,
            faultType: currentRequest.fault_type,
            priceQuote: priceQuote || currentRequest.price_quote,
            notes: notes
        };

        // Send device received email
        if (status === 'received' && oldStatus !== 'received') {
            sendDeviceReceivedEmail(emailData).catch(err =>
                console.error('Device received email failed:', err)
            );
        }

        // Send price quote email
        if (status === 'quoted' && oldStatus !== 'quoted') {
            sendPriceQuoteEmail(emailData).catch(err =>
                console.error('Price quote email failed:', err)
            );
        }

        res.json({
            success: true,
            message: 'Durum güncellendi',
            request: updatedRequest
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

        let query = supabase
            .from('rental_requests')
            .select('*');

        if (status && status !== 'all') {
            query = query.eq('status', status);
        }

        if (search) {
            query = query.or(`full_name.ilike.%${search}%,company.ilike.%${search}%,email.ilike.%${search}%,rental_id.ilike.%${search}%`);
        }

        const { data: requests, error } = await query
            .order('created_at', { ascending: false })
            .range(offset, offset + parseInt(limit) - 1);

        if (error) {
            console.error('Supabase error:', error);
            return res.status(500).json({ error: 'Veriler alınamadı' });
        }

        res.json({
            requests: requests || [],
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

        const { data: currentRequest } = await supabase
            .from('rental_requests')
            .select('status')
            .eq('id', id)
            .single();

        if (!currentRequest) {
            return res.status(404).json({ error: 'Talep bulunamadı' });
        }

        const oldStatus = currentRequest.status;

        const updateData = { status };
        if (notes) updateData.admin_notes = notes;

        const { data: updatedRequest, error } = await supabase
            .from('rental_requests')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return res.status(500).json({ error: 'Güncelleme başarısız' });
        }

        await supabase
            .from('status_history')
            .insert([{
                request_type: 'rental',
                request_id: parseInt(id),
                old_status: oldStatus,
                new_status: status,
                notes: notes || null,
                changed_by: req.user.username
            }]);

        res.json({
            success: true,
            message: 'Durum güncellendi',
            request: updatedRequest
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

        await supabase
            .from('status_history')
            .delete()
            .eq('request_type', 'service')
            .eq('request_id', id);

        await supabase
            .from('service_requests')
            .delete()
            .eq('id', id);

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

        await supabase
            .from('status_history')
            .delete()
            .eq('request_type', 'rental')
            .eq('request_id', id);

        await supabase
            .from('rental_requests')
            .delete()
            .eq('id', id);

        res.json({ success: true, message: 'Talep silindi' });

    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'Silme işlemi başarısız' });
    }
});

// =====================
// PURCHASE REQUESTS
// =====================

const PURCHASE_STATUS_LABELS = {
    pending: 'Ödeme Bekleniyor',
    confirmed: 'Ödeme Onaylandı',
    preparing: 'Hazırlanıyor',
    shipped: 'Kargoya Verildi',
    delivered: 'Teslim Edildi',
    cancelled: 'İptal Edildi'
};

// Get all purchase requests
router.get('/purchase-requests', authenticateToken, async (req, res) => {
    try {
        const { status, search, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        let query = supabase
            .from('purchase_requests')
            .select('*', { count: 'exact' });

        if (status && status !== 'all') {
            query = query.eq('status', status);
        }

        if (search) {
            query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,purchase_id.ilike.%${search}%,phone.ilike.%${search}%`);
        }

        const { data: requests, error, count } = await query
            .order('created_at', { ascending: false })
            .range(offset, offset + parseInt(limit) - 1);

        if (error) {
            console.error('Supabase error:', error);
            return res.status(500).json({ error: 'Veriler alınamadı' });
        }

        res.json({
            requests: requests || [],
            total: count || 0,
            page: parseInt(page),
            limit: parseInt(limit),
            statusLabels: PURCHASE_STATUS_LABELS
        });

    } catch (error) {
        console.error('Get purchase requests error:', error);
        res.status(500).json({ error: 'Veriler alınamadı' });
    }
});

// Update purchase request status
router.patch('/purchase-requests/:id/status', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        // Get current status
        const { data: currentRequest } = await supabase
            .from('purchase_requests')
            .select('*')
            .eq('id', id)
            .single();

        if (!currentRequest) {
            return res.status(404).json({ error: 'Sipariş bulunamadı' });
        }

        const oldStatus = currentRequest.status;

        // Update status
        const updateData = { status };
        if (notes) updateData.admin_notes = notes;

        const { data: updatedRequest, error } = await supabase
            .from('purchase_requests')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Update error:', error);
            return res.status(500).json({ error: 'Güncelleme başarısız' });
        }

        // Record status change in history
        await supabase
            .from('status_history')
            .insert([{
                request_type: 'purchase',
                request_id: parseInt(id),
                old_status: oldStatus,
                new_status: status,
                notes: notes || null,
                changed_by: req.user.username
            }]);

        res.json({
            success: true,
            message: 'Durum güncellendi',
            request: updatedRequest
        });

    } catch (error) {
        console.error('Update purchase status error:', error);
        res.status(500).json({ error: 'Güncelleme başarısız' });
    }
});

// Delete purchase request
router.delete('/purchase-requests/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        await supabase
            .from('status_history')
            .delete()
            .eq('request_type', 'purchase')
            .eq('request_id', id);

        await supabase
            .from('purchase_requests')
            .delete()
            .eq('id', id);

        res.json({ success: true, message: 'Sipariş silindi' });

    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'Silme işlemi başarısız' });
    }
});

// Get receipt signed URL for admin
router.get('/purchase-requests/:id/receipt', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const { data: request, error } = await supabase
            .from('purchase_requests')
            .select('purchase_id, receipt_url')
            .eq('id', id)
            .single();

        if (error || !request) {
            return res.status(404).json({ error: 'Siparis bulunamadi' });
        }

        // NOT: Veritabanindaki URL (receipt_url) public bucket gerektirdigi icin
        // eger bucket public degilse calismiyor ("Bucket not found").
        // Bu yuzden her zaman Signed URL olusturmayi deniyoruz.

        /* 
        if (request.receipt_url) {
            return res.json({ url: request.receipt_url });
        } 
        */

        // Create priority list of possible file names
        // 1. Exact match with extension from DB if possible (we don't store ext separately, so we try common ones)
        // 2. Try signed URLs for each type
        const possibleExtensions = ['jpg', 'png', 'pdf', 'jpeg'];

        for (const ext of possibleExtensions) {
            const { data } = await supabase.storage
                .from('receipts')
                .createSignedUrl(`${request.purchase_id}.${ext}`, 60 * 60);

            if (data?.signedUrl) {
                // Verify if the file actually exists by making a HEAD request or relying on Supabase (createSignedUrl doesn't check existence usually)
                // Better approach: list files in bucket with prefix? No, simple try-error on frontend is messy.
                // Supabase createSignedUrl DOES NOT return 404 if file missing, it just gives a link that 404s.
                // So we should ideally list the file to see which one exists.

                const { data: listData } = await supabase.storage
                    .from('receipts')
                    .list('', {
                        limit: 1,
                        search: `${request.purchase_id}.${ext}`
                    });

                if (listData && listData.length > 0) {
                    return res.json({ url: data.signedUrl });
                }
            }
        }

        // If no file found in storage list
        return res.status(404).json({ error: 'Dekont dosyası bulunamadı' });

    } catch (error) {
        console.error('Get receipt error:', error);
        res.status(500).json({ error: 'Dekont alinamadi' });
    }
});

export default router;

