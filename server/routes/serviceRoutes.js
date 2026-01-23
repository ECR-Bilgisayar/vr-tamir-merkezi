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

        const { data: request, error } = await supabase
            .from('service_requests')
            .select('service_id, device, fault_type, status, created_at, updated_at')
            .eq('service_id', serviceId)
            .single();

        if (error || !request) {
            return res.status(404).json({ error: 'Talep bulunamadı' });
        }

        // Get status history
        const { data: history } = await supabase
            .from('status_history')
            .select('new_status, notes, created_at')
            .eq('request_type', 'service')
            .eq('request_id', request.id)
            .order('created_at', { ascending: false });

        res.json({
            request,
            history: history || []
        });

    } catch (error) {
        console.error('Track service error:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

export default router;
