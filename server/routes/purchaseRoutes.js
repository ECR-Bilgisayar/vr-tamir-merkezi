import express from 'express';
import supabase from '../config/supabase.js';

const router = express.Router();

// Generate unique purchase ID
const generatePurchaseId = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return `PUR-${year}-${random}`;
};

// Create new purchase request
router.post('/', async (req, res) => {
    try {
        const {
            fullName,
            email,
            phone,
            address,
            deliveryMethod,
            productPrice,
            shippingPrice,
            totalPrice,
            receiptBase64
        } = req.body;

        // Validate required fields
        if (!fullName || !email || !phone) {
            return res.status(400).json({ error: 'Gerekli alanlar eksik' });
        }

        if (!receiptBase64) {
            return res.status(400).json({ error: 'Dekont yüklenmedi' });
        }

        const purchaseId = generatePurchaseId();

        // Insert into Supabase
        const { data: newRequest, error: insertError } = await supabase
            .from('purchase_requests')
            .insert([{
                purchase_id: purchaseId,
                full_name: fullName,
                email,
                phone,
                address,
                delivery_method: deliveryMethod,
                product_price: productPrice,
                shipping_price: shippingPrice,
                total_price: totalPrice,
                receipt_data: receiptBase64,
                status: 'pending'
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
                request_type: 'purchase',
                request_id: newRequest.id,
                new_status: 'pending',
                notes: 'Sipariş oluşturuldu, dekont bekleniyor'
            }]);

        res.status(201).json({
            success: true,
            message: 'Siparişiniz başarıyla oluşturuldu',
            data: {
                purchaseId,
                id: newRequest.id
            }
        });

    } catch (error) {
        console.error('Purchase request error:', error);
        res.status(500).json({ error: 'Sunucu hatası. Lütfen tekrar deneyin.' });
    }
});

// Track purchase by purchase_id (public)
router.get('/track/:purchaseId', async (req, res) => {
    try {
        const { purchaseId } = req.params;

        const { data: request, error } = await supabase
            .from('purchase_requests')
            .select('purchase_id, full_name, delivery_method, total_price, status, created_at, updated_at')
            .eq('purchase_id', purchaseId.toUpperCase())
            .single();

        if (error || !request) {
            return res.status(404).json({ error: 'Sipariş bulunamadı' });
        }

        // Get status history
        const { data: history } = await supabase
            .from('status_history')
            .select('new_status, notes, created_at')
            .eq('request_type', 'purchase')
            .eq('request_id', request.id)
            .order('created_at', { ascending: false });

        res.json({
            request,
            history: history || []
        });

    } catch (error) {
        console.error('Track purchase error:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

export default router;
