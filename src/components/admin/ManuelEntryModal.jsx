import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Printer, Save, User, Phone, Mail, MapPin, Wrench, Package, ShoppingBag, FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DEVICE_OPTIONS = [
    'Meta Quest 3',
    'Meta Quest 3S',
    'Meta Quest 2',
    'Meta Quest Pro',
    'Apple Vision Pro',
    'PlayStation VR2',
    'Valve Index',
    'HTC Vive Pro 2',
    'HP Reverb G2',
    'Pico 4',
    'Diğer'
];

const FAULT_OPTIONS = [
    'Ekran Sorunu',
    'Controller Sorunu',
    'Şarj Sorunu',
    'Ses Sorunu',
    'Tracking Sorunu',
    'Lens Sorunu',
    'Yazılım Sorunu',
    'Fiziksel Hasar',
    'Batarya Sorunu',
    'Diğer'
];

const ACCESSORY_OPTIONS = [
    { id: 'kutu', label: 'Orijinal Kutu' },
    { id: 'sarj', label: 'Şarj Adaptörü' },
    { id: 'kablo', label: 'Şarj Kablosu' },
    { id: 'controller_left', label: 'Sol Controller' },
    { id: 'controller_right', label: 'Sağ Controller' },
    { id: 'headstrap', label: 'Head Strap' },
    { id: 'case', label: 'Taşıma Çantası' }
];

const ManualEntryModal = ({ isOpen, onClose, onSave, entryType, toast }) => {
    const [formData, setFormData] = useState({
        // Ortak alanlar
        full_name: '',
        email: '',
        phone: '',
        address: '',
        // Servis alanları
        device: '',
        device_other: '',
        serial_number: '',
        fault_type: '',
        fault_other: '',
        fault_description: '',
        accessories: [],
        delivery_method: 'elden',
        // Kiralama alanları
        company: '',
        product_name: '',
        quantity: 1,
        duration: '',
        event_date: '',
        message: '',
        // Satın alma alanları
        product_price: '',
        shipping_price: 0,
        invoice_type: 'individual',
        company_name: '',
        tax_office: '',
        tax_no: '',
        tc_no: ''
    });

    const [saving, setSaving] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                accessories: checked
                    ? [...prev.accessories, value]
                    : prev.accessories.filter(a => a !== value)
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const generateTrackingId = () => {
        const prefix = entryType === 'service' ? 'SRV' : entryType === 'rental' ? 'RNT' : 'PUR';
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `${prefix}-${timestamp}-${random}`;
    };

    const handleSave = async (shouldPrint = false) => {
        // Validasyon
        if (!formData.full_name || !formData.phone) {
            toast({ title: 'Hata', description: 'Ad Soyad ve Telefon zorunludur', variant: 'destructive' });
            return;
        }

        setSaving(true);

        const trackingId = generateTrackingId();
        const dataToSave = {
            ...formData,
            [`${entryType}_id`]: trackingId,
            device: formData.device === 'Diğer' ? formData.device_other : formData.device,
            fault_type: formData.fault_type === 'Diğer' ? formData.fault_other : formData.fault_type,
            status: 'pending',
            created_at: new Date().toISOString()
        };

        try {
            if (onSave) {
                await onSave(dataToSave, entryType);
            }

            if (shouldPrint) {
                printForm(dataToSave, trackingId);
            }

            toast({ title: 'Başarılı', description: `Kayıt oluşturuldu: ${trackingId}` });
            onClose();
            resetForm();
        } catch (error) {
            toast({ title: 'Hata', description: error.message, variant: 'destructive' });
        } finally {
            setSaving(false);
        }
    };

    const handlePrintOnly = () => {
        if (!formData.full_name || !formData.phone) {
            toast({ title: 'Hata', description: 'Ad Soyad ve Telefon zorunludur', variant: 'destructive' });
            return;
        }

        const trackingId = generateTrackingId();
        const dataToSave = {
            ...formData,
            device: formData.device === 'Diğer' ? formData.device_other : formData.device,
            fault_type: formData.fault_type === 'Diğer' ? formData.fault_other : formData.fault_type,
        };
        printForm(dataToSave, trackingId);
    };

    const printForm = (data, trackingId) => {
        const printWindow = window.open('', '_blank');
        const today = new Date().toLocaleDateString('tr-TR');

        const accessoriesText = data.accessories?.length > 0
            ? ACCESSORY_OPTIONS.filter(a => data.accessories.includes(a.id)).map(a => a.label).join(', ')
            : 'Aksesuar teslim edilmedi';

        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Cihaz Teslim Formu - ${trackingId}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Arial, sans-serif; 
            padding: 20mm; 
            font-size: 11pt;
            color: #1a1a1a;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 3px solid #7c3aed;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }
        .logo-section {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .logo {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 24px;
        }
        .company-info h1 {
            font-size: 20pt;
            color: #7c3aed;
            margin-bottom: 4px;
        }
        .company-info p {
            font-size: 9pt;
            color: #666;
        }
        .form-title {
            text-align: right;
        }
        .form-title h2 {
            font-size: 14pt;
            color: #1a1a1a;
            margin-bottom: 5px;
        }
        .form-title .tracking {
            font-family: monospace;
            font-size: 12pt;
            color: #7c3aed;
            background: #f3f0ff;
            padding: 5px 10px;
            border-radius: 5px;
        }
        .form-title .date {
            font-size: 9pt;
            color: #666;
            margin-top: 5px;
        }
        .section {
            margin-bottom: 20px;
        }
        .section-title {
            font-size: 11pt;
            font-weight: 600;
            color: #7c3aed;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 5px;
            margin-bottom: 10px;
        }
        .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }
        .field {
            margin-bottom: 8px;
        }
        .field-label {
            font-size: 9pt;
            color: #666;
            margin-bottom: 2px;
        }
        .field-value {
            font-size: 10pt;
            color: #1a1a1a;
            padding: 6px 10px;
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 4px;
            min-height: 28px;
        }
        .field-value.empty {
            color: #999;
            font-style: italic;
        }
        .full-width {
            grid-column: 1 / -1;
        }
        .accessories-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        .accessory-item {
            padding: 4px 10px;
            background: #f3f0ff;
            border: 1px solid #7c3aed;
            border-radius: 4px;
            font-size: 9pt;
            color: #7c3aed;
        }
        .terms {
            margin-top: 20px;
            padding: 15px;
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            font-size: 8pt;
            color: #666;
        }
        .terms h4 {
            font-size: 9pt;
            color: #1a1a1a;
            margin-bottom: 8px;
        }
        .terms ul {
            padding-left: 15px;
        }
        .terms li {
            margin-bottom: 3px;
        }
        .signatures {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
        }
        .signature-box {
            text-align: center;
        }
        .signature-box p {
            font-size: 9pt;
            color: #666;
            margin-bottom: 50px;
        }
        .signature-line {
            border-top: 1px solid #1a1a1a;
            padding-top: 5px;
            font-size: 10pt;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 8pt;
            color: #999;
            border-top: 1px solid #e5e7eb;
            padding-top: 10px;
        }
        @media print {
            body { padding: 10mm; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo-section">
            <div class="logo">VR</div>
            <div class="company-info">
                <h1>VR Tamir Merkezi</h1>
                <p>Profesyonel VR Cihaz Servis Hizmetleri</p>
                <p>vrtamirmerkezi.com | info@vrtamirmerkezi.com</p>
            </div>
        </div>
        <div class="form-title">
            <h2>CİHAZ TESLİM FORMU</h2>
            <div class="tracking">${trackingId}</div>
            <div class="date">${today}</div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">👤 Müşteri Bilgileri</div>
        <div class="grid">
            <div class="field">
                <div class="field-label">Ad Soyad</div>
                <div class="field-value">${data.full_name || '-'}</div>
            </div>
            <div class="field">
                <div class="field-label">Telefon</div>
                <div class="field-value">${data.phone || '-'}</div>
            </div>
            <div class="field">
                <div class="field-label">E-posta</div>
                <div class="field-value">${data.email || '-'}</div>
            </div>
            <div class="field">
                <div class="field-label">Teslimat Yöntemi</div>
                <div class="field-value">${data.delivery_method === 'kargo' ? 'Kargo' : 'Elden Teslim'}</div>
            </div>
            ${data.address ? `
            <div class="field full-width">
                <div class="field-label">Adres</div>
                <div class="field-value">${data.address}</div>
            </div>
            ` : ''}
        </div>
    </div>

    <div class="section">
        <div class="section-title">🎮 Cihaz Bilgileri</div>
        <div class="grid">
            <div class="field">
                <div class="field-label">Cihaz Modeli</div>
                <div class="field-value">${data.device || '-'}</div>
            </div>
            <div class="field">
                <div class="field-label">Seri Numarası</div>
                <div class="field-value ${!data.serial_number ? 'empty' : ''}">${data.serial_number || 'Belirtilmedi'}</div>
            </div>
            <div class="field">
                <div class="field-label">Arıza Tipi</div>
                <div class="field-value">${data.fault_type || '-'}</div>
            </div>
            <div class="field full-width">
                <div class="field-label">Arıza Açıklaması</div>
                <div class="field-value">${data.fault_description || '-'}</div>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">📦 Teslim Edilen Aksesuarlar</div>
        <div class="accessories-list">
            ${data.accessories?.length > 0
                ? ACCESSORY_OPTIONS.filter(a => data.accessories.includes(a.id)).map(a => `<span class="accessory-item">✓ ${a.label}</span>`).join('')
                : '<span class="field-value empty">Aksesuar teslim edilmedi</span>'
            }
        </div>
    </div>

    <div class="terms">
        <h4>📋 Teslim Şartları ve Koşulları</h4>
        <ul>
            <li>Cihazın onarım süreci, arıza tespiti yapıldıktan sonra müşteriye bildirilecektir.</li>
            <li>Onarım işlemine başlanmadan önce fiyat teklifi sunulacak ve müşteri onayı alınacaktır.</li>
            <li>Onarım sırasında tespit edilen ek arızalar için ayrıca bilgilendirme yapılacaktır.</li>
            <li>Teslim edilen aksesuarların sorumluluğu firmamıza aittir.</li>
            <li>Onarımı tamamlanan cihazlar 30 gün içinde teslim alınmalıdır.</li>
            <li>Onarım işlemi 6 ay garanti kapsamındadır (kullanıcı kaynaklı arızalar hariç).</li>
        </ul>
    </div>

    <div class="signatures">
        <div class="signature-box">
            <p>Yukarıdaki bilgilerin doğruluğunu ve teslim şartlarını kabul ediyorum.</p>
            <div class="signature-line">
                <strong>Müşteri İmzası</strong><br>
                ${data.full_name}
            </div>
        </div>
        <div class="signature-box">
            <p>Cihaz ve aksesuarları eksiksiz teslim aldım.</p>
            <div class="signature-line">
                <strong>Yetkili İmzası</strong><br>
                VR Tamir Merkezi
            </div>
        </div>
    </div>

    <div class="footer">
        Bu form 2 nüsha olarak düzenlenmiştir. Bir nüsha müşteride, bir nüsha firmada kalacaktır.<br>
        VR Tamir Merkezi | vrtamirmerkezi.com | ${today}
    </div>
</body>
</html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.onload = () => {
            printWindow.print();
        };
    };

    const resetForm = () => {
        setFormData({
            full_name: '',
            email: '',
            phone: '',
            address: '',
            device: '',
            device_other: '',
            serial_number: '',
            fault_type: '',
            fault_other: '',
            fault_description: '',
            accessories: [],
            delivery_method: 'elden',
            company: '',
            product_name: '',
            quantity: 1,
            duration: '',
            event_date: '',
            message: '',
            product_price: '',
            shipping_price: 0,
            invoice_type: 'individual',
            company_name: '',
            tax_office: '',
            tax_no: '',
            tc_no: ''
        });
    };

    const getTitle = () => {
        if (entryType === 'service') return 'Servis Kaydı';
        if (entryType === 'rental') return 'Kiralama Kaydı';
        return 'Sipariş Kaydı';
    };

    const getIcon = () => {
        if (entryType === 'service') return <Wrench className="w-5 h-5" />;
        if (entryType === 'rental') return <Package className="w-5 h-5" />;
        return <ShoppingBag className="w-5 h-5" />;
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-gray-900 rounded-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-gray-900 z-10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                                {getIcon()}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Manuel {getTitle()}</h2>
                                <p className="text-gray-400 text-sm">Yeni kayıt oluştur</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    {/* Form */}
                    <div className="p-6 space-y-6">
                        {/* Müşteri Bilgileri */}
                        <div className="p-4 bg-white/5 rounded-xl">
                            <h3 className="text-sm font-semibold text-gray-400 mb-4 flex items-center gap-2">
                                <User className="w-4 h-4" /> Müşteri Bilgileri
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-400 block mb-1">Ad Soyad *</label>
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 outline-none"
                                        placeholder="Müşteri adı"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400 block mb-1">Telefon *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 outline-none"
                                        placeholder="05XX XXX XXXX"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400 block mb-1">E-posta</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 outline-none"
                                        placeholder="ornek@mail.com"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400 block mb-1">Teslimat Yöntemi</label>
                                    <select
                                        name="delivery_method"
                                        value={formData.delivery_method}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 outline-none"
                                        style={{ colorScheme: 'dark' }}
                                    >
                                        <option value="elden">Elden Teslim</option>
                                        <option value="kargo">Kargo</option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-sm text-gray-400 block mb-1">Adres</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        rows={2}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 outline-none resize-none"
                                        placeholder="Teslimat adresi (opsiyonel)"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Servis Form */}
                        {entryType === 'service' && (
                            <>
                                <div className="p-4 bg-white/5 rounded-xl">
                                    <h3 className="text-sm font-semibold text-gray-400 mb-4 flex items-center gap-2">
                                        <Wrench className="w-4 h-4" /> Cihaz Bilgileri
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm text-gray-400 block mb-1">Cihaz Modeli *</label>
                                            <select
                                                name="device"
                                                value={formData.device}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 outline-none"
                                                style={{ colorScheme: 'dark' }}
                                            >
                                                <option value="">Seçiniz</option>
                                                {DEVICE_OPTIONS.map(d => (
                                                    <option key={d} value={d}>{d}</option>
                                                ))}
                                            </select>
                                        </div>
                                        {formData.device === 'Diğer' && (
                                            <div>
                                                <label className="text-sm text-gray-400 block mb-1">Diğer Cihaz</label>
                                                <input
                                                    type="text"
                                                    name="device_other"
                                                    value={formData.device_other}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 outline-none"
                                                    placeholder="Cihaz adı"
                                                />
                                            </div>
                                        )}
                                        <div>
                                            <label className="text-sm text-gray-400 block mb-1">Seri Numarası</label>
                                            <input
                                                type="text"
                                                name="serial_number"
                                                value={formData.serial_number}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 outline-none"
                                                placeholder="Varsa seri numarası"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-400 block mb-1">Arıza Tipi *</label>
                                            <select
                                                name="fault_type"
                                                value={formData.fault_type}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 outline-none"
                                                style={{ colorScheme: 'dark' }}
                                            >
                                                <option value="">Seçiniz</option>
                                                {FAULT_OPTIONS.map(f => (
                                                    <option key={f} value={f}>{f}</option>
                                                ))}
                                            </select>
                                        </div>
                                        {formData.fault_type === 'Diğer' && (
                                            <div>
                                                <label className="text-sm text-gray-400 block mb-1">Diğer Arıza</label>
                                                <input
                                                    type="text"
                                                    name="fault_other"
                                                    value={formData.fault_other}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 outline-none"
                                                    placeholder="Arıza açıklaması"
                                                />
                                            </div>
                                        )}
                                        <div className="col-span-2">
                                            <label className="text-sm text-gray-400 block mb-1">Arıza Açıklaması</label>
                                            <textarea
                                                name="fault_description"
                                                value={formData.fault_description}
                                                onChange={handleChange}
                                                rows={3}
                                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 outline-none resize-none"
                                                placeholder="Müşterinin anlattığı arıza detayları..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-white/5 rounded-xl">
                                    <h3 className="text-sm font-semibold text-gray-400 mb-4 flex items-center gap-2">
                                        <Package className="w-4 h-4" /> Teslim Edilen Aksesuarlar
                                    </h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {ACCESSORY_OPTIONS.map(acc => (
                                            <label
                                                key={acc.id}
                                                className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all ${formData.accessories.includes(acc.id)
                                                        ? 'bg-purple-500/20 border-purple-500'
                                                        : 'bg-white/5 border-white/10'
                                                    } border`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    name="accessories"
                                                    value={acc.id}
                                                    checked={formData.accessories.includes(acc.id)}
                                                    onChange={handleChange}
                                                    className="accent-purple-500"
                                                />
                                                <span className="text-sm text-white">{acc.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Kiralama Form */}
                        {entryType === 'rental' && (
                            <div className="p-4 bg-white/5 rounded-xl">
                                <h3 className="text-sm font-semibold text-gray-400 mb-4 flex items-center gap-2">
                                    <Package className="w-4 h-4" /> Kiralama Bilgileri
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-400 block mb-1">Firma Adı</label>
                                        <input
                                            type="text"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 outline-none"
                                            placeholder="Firma adı (varsa)"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400 block mb-1">Ürün</label>
                                        <select
                                            name="product_name"
                                            value={formData.product_name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 outline-none"
                                            style={{ colorScheme: 'dark' }}
                                        >
                                            <option value="">Seçiniz</option>
                                            {DEVICE_OPTIONS.slice(0, -1).map(d => (
                                                <option key={d} value={d}>{d}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400 block mb-1">Adet</label>
                                        <input
                                            type="number"
                                            name="quantity"
                                            value={formData.quantity}
                                            onChange={handleChange}
                                            min="1"
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400 block mb-1">Süre</label>
                                        <input
                                            type="text"
                                            name="duration"
                                            value={formData.duration}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 outline-none"
                                            placeholder="Örn: 3 gün, 1 hafta"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400 block mb-1">Etkinlik Tarihi</label>
                                        <input
                                            type="date"
                                            name="event_date"
                                            value={formData.event_date}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 outline-none"
                                            style={{ colorScheme: 'dark' }}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-sm text-gray-400 block mb-1">Mesaj / Notlar</label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows={3}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 outline-none resize-none"
                                            placeholder="Ek notlar..."
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Satın Alma Form */}
                        {entryType === 'purchase' && (
                            <div className="p-4 bg-white/5 rounded-xl">
                                <h3 className="text-sm font-semibold text-gray-400 mb-4 flex items-center gap-2">
                                    <ShoppingBag className="w-4 h-4" /> Sipariş Bilgileri
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-400 block mb-1">Ürün Tutarı (TL)</label>
                                        <input
                                            type="number"
                                            name="product_price"
                                            value={formData.product_price}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 outline-none"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400 block mb-1">Kargo Ücreti (TL)</label>
                                        <input
                                            type="number"
                                            name="shipping_price"
                                            value={formData.shipping_price}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 outline-none"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400 block mb-1">Fatura Tipi</label>
                                        <select
                                            name="invoice_type"
                                            value={formData.invoice_type}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 outline-none"
                                            style={{ colorScheme: 'dark' }}
                                        >
                                            <option value="individual">Bireysel</option>
                                            <option value="corporate">Kurumsal</option>
                                        </select>
                                    </div>
                                    {formData.invoice_type === 'individual' && (
                                        <div>
                                            <label className="text-sm text-gray-400 block mb-1">T.C. Kimlik No</label>
                                            <input
                                                type="text"
                                                name="tc_no"
                                                value={formData.tc_no}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 outline-none"
                                                placeholder="11 haneli T.C. No"
                                            />
                                        </div>
                                    )}
                                    {formData.invoice_type === 'corporate' && (
                                        <>
                                            <div>
                                                <label className="text-sm text-gray-400 block mb-1">Firma Adı</label>
                                                <input
                                                    type="text"
                                                    name="company_name"
                                                    value={formData.company_name}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-400 block mb-1">Vergi Dairesi</label>
                                                <input
                                                    type="text"
                                                    name="tax_office"
                                                    value={formData.tax_office}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-400 block mb-1">Vergi No</label>
                                                <input
                                                    type="text"
                                                    name="tax_no"
                                                    value={formData.tax_no}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 outline-none"
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Buttons */}
                    <div className="p-6 border-t border-white/10 flex flex-wrap gap-3">
                        <Button
                            variant="ghost"
                            onClick={handlePrintOnly}
                            className="flex-1 bg-white/5 hover:bg-white/10 text-white"
                        >
                            <Printer className="w-4 h-4 mr-2" />
                            Sadece Yazdır
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => handleSave(false)}
                            disabled={saving}
                            className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Kaydet
                        </Button>
                        <Button
                            onClick={() => handleSave(true)}
                            disabled={saving}
                            className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            Kaydet + Yazdır
                        </Button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ManualEntryModal;
