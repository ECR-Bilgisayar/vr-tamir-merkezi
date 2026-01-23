import express from 'express';
import supabase from '../config/supabase.js';
import { sendPurchaseCreatedEmail, sendPurchaseStatusEmail } from '../services/emailService.js';

const router = express.Router();

// Generate unique purchase ID
const generatePurchaseId = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return `PUR-${year}-${random}`;
};

// Upload receipt to Supabase Storage
const uploadReceipt = async (base64Data, purchaseId) => {
    try {
        // Base64'ten dosya olustur
        const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            throw new Error('Invalid base64 data');
        }

        const contentType = matches[1];
        const base64 = matches[2];
        const buffer = Buffer.from(base64, 'base64');

        // Dosya uzantisini belirle
        const extension = contentType.includes('pdf') ? 'pdf' :
            contentType.includes('png') ? 'png' : 'jpg';

        const fileName = `${purchaseId}.${extension}`;

        // Supabase Storage'a yukle
        const { data, error } = await supabase.storage
            .from('receipts')
            .upload(fileName, buffer, {
                contentType: contentType,
                upsert: true
            });

        if (error) {
            console.error('Storage upload error:', error);
            throw error;
        }

        // Signed URL olustur (1 yil gecerli)
        const { data: urlData } = await supabase.storage
            .from('receipts')
            .createSignedUrl(fileName, 60 * 60 * 24 * 365);

        return urlData?.signedUrl || null;
    } catch (error) {
        console.error('Receipt upload error:', error);
        return null;
    }
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
            receiptBase64,
            quantity,
            invoiceType,
            tcNo,
            companyName,
            taxOffice,
            taxNo
        } = req.body;

        // Validate required fields
        if (!fullName || !email || !phone) {
            return res.status(400).json({ error: 'Gerekli alanlar eksik' });
        }

        if (!receiptBase64) {
            return res.status(400).json({ error: 'Dekont yuklenmedi' });
        }

        const purchaseId = generatePurchaseId();

        // Upload receipt to storage
        const receiptUrl = await uploadReceipt(receiptBase64, purchaseId);

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
                receipt_url: receiptUrl,
                status: 'pending',
                quantity: quantity || 1,
                invoice_type: invoiceType || 'individual',
                tc_no: tcNo,
                company_name: companyName,
                tax_office: taxOffice,
                tax_no: taxNo
            }])
            .select()
            .single();

        if (insertError) {
            console.error('Supabase insert error details:', JSON.stringify(insertError, null, 2));
            return res.status(500).json({ error: 'Veritabani hatasi: Sipariş kaydedilemedi.' });
        }

        // Record initial status in history
        const { error: historyError } = await supabase
            .from('status_history')
            .insert([{
                request_type: 'purchase',
                request_id: newRequest.id,
                new_status: 'pending',
                notes: 'Siparis olusturuldu, dekont bekleniyor'
            }]);

        if (historyError) {
            console.error('Status history insert error:', historyError);
        }

        // Send confirmation emails
        try {
            const emailResult = await sendPurchaseCreatedEmail({
                purchaseId,
                fullName,
                email,
                phone,
                address,
                deliveryMethod,
                totalPrice,
                quantity: quantity || 1,
                invoiceType,
                tcNo,
                companyName,
                taxOffice,
                taxNo
            });

            if (!emailResult.success) {
                console.error('Email sending failed but order created:', emailResult.error);
            }
        } catch (emailErr) {
            console.error('Unexpected email error:', emailErr);
        }

        res.status(201).json({
            success: true,
            message: 'Siparisimiz basariyla olusturuldu',
            data: {
                purchaseId,
                id: newRequest.id
            }
        });

    } catch (error) {
        console.error('Purchase request critical error:', error);
        res.status(500).json({ error: 'Sunucu hatasi. Lutfen tekrar deneyin.' });
    }
});

// Track purchase by purchase_id (public)
router.get('/track/:purchaseId', async (req, res) => {
    try {
        const { purchaseId } = req.params;

        const { data: request, error } = await supabase
            .from('purchase_requests')
            .select('id, purchase_id, full_name, delivery_method, total_price, status, created_at, updated_at, quantity')
            .eq('purchase_id', purchaseId.toUpperCase())
            .single();

        if (error || !request) {
            return res.status(404).json({ error: 'Siparis bulunamadi' });
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
        res.status(500).json({ error: 'Sunucu hatasi' });
    }
});

export default router;