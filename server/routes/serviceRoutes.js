import express from 'express';
import supabase from '../config/supabase.js';
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

        // Insert into Supabase
        const { data: newRequest, error: insertError } = await supabase
            .from('service_requests')
            .insert([{
                service_id: serviceId,
                full_name: fullName,
                email,
                phone,
                device: finalDevice,
                custom_device: customDevice,
                fault_type: faultType,
                fault_description: faultDescription,
                delivery_method: deliveryMethod,
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
                request_type: 'service',
                request_id: newRequest.id,
                new_status: 'pending',
                notes: 'Talep oluşturuldu'
            }]);

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

        // Get request with id for history lookup
        const { data: fullRequest, error: requestError } = await supabase
            .from('service_requests')
            .select('*')
            .eq('service_id', serviceId.toUpperCase())
            .single();

        if (requestError || !fullRequest) {
            return res.status(404).json({ error: 'Talep bulunamadı. Takip numaranızı kontrol edin.' });
        }

        // Get status history
        const { data: history } = await supabase
            .from('status_history')
            .select('new_status, notes, created_at')
            .eq('request_type', 'service')
            .eq('request_id', fullRequest.id)
            .order('created_at', { ascending: false });

        // Return comprehensive request info
        res.json({
            request: {
                service_id: fullRequest.service_id,
                device: fullRequest.device,
                fault_type: fullRequest.fault_type,
                fault_description: fullRequest.fault_description,
                delivery_method: fullRequest.delivery_method,
                callback_preference: fullRequest.callback_preference,
                status: fullRequest.status,
                price_quote: fullRequest.price_quote,
                admin_notes: fullRequest.admin_notes,
                created_at: fullRequest.created_at,
                updated_at: fullRequest.updated_at
            },
            history: history || []
        });

    } catch (error) {
        console.error('Track service error:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

export default router;
