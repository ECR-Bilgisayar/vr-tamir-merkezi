import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Trash2, Download, LogOut, RefreshCw, ChevronDown,
    Wrench, Package, Clock, CheckCircle, XCircle, Phone, Mail,
    AlertCircle, TrendingUp, Users, Calendar, Eye, X, MessageSquare, Copy,
    ShoppingBag, Image, CreditCard, FileText, ExternalLink, Truck, Building,
    User, MapPin, Receipt, Filter, MoreVertical, Edit2, Printer, Save, Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

// ==================== STATUS CONFIG ====================
const STATUS_CONFIG = {
    pending: { label: 'Yeni Talep', color: 'bg-yellow-500', textColor: 'text-yellow-500', icon: Clock },
    contacted: { label: 'İletişime Geçildi', color: 'bg-blue-500', textColor: 'text-blue-500', icon: Phone },
    received: { label: 'Cihaz Teslim Alındı', color: 'bg-indigo-500', textColor: 'text-indigo-500', icon: Package },
    diagnosed: { label: 'Arıza Tespiti', color: 'bg-purple-500', textColor: 'text-purple-500', icon: Search },
    quoted: { label: 'Fiyat Teklifi', color: 'bg-orange-500', textColor: 'text-orange-500', icon: MessageSquare },
    approved: { label: 'Onaylandı', color: 'bg-cyan-500', textColor: 'text-cyan-500', icon: CheckCircle },
    repairing: { label: 'Onarım Sürecinde', color: 'bg-pink-500', textColor: 'text-pink-500', icon: Wrench },
    repaired: { label: 'Onarım Tamamlandı', color: 'bg-emerald-500', textColor: 'text-emerald-500', icon: CheckCircle },
    shipped: { label: 'Kargoya Verildi', color: 'bg-teal-500', textColor: 'text-teal-500', icon: Truck },
    delivered: { label: 'Teslim Edildi', color: 'bg-green-600', textColor: 'text-green-600', icon: CheckCircle },
    cancelled: { label: 'İptal Edildi', color: 'bg-red-500', textColor: 'text-red-500', icon: XCircle },
    confirmed: { label: 'Ödeme Onaylandı', color: 'bg-green-500', textColor: 'text-green-500', icon: CreditCard },
    preparing: { label: 'Hazırlanıyor', color: 'bg-blue-500', textColor: 'text-blue-500', icon: Package },
    active: { label: 'Aktif', color: 'bg-emerald-500', textColor: 'text-emerald-500', icon: CheckCircle },
    completed: { label: 'Tamamlandı', color: 'bg-green-600', textColor: 'text-green-600', icon: CheckCircle }
};

const PURCHASE_STATUSES = ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled'];
const SERVICE_STATUSES = ['pending', 'contacted', 'received', 'diagnosed', 'quoted', 'approved', 'repairing', 'repaired', 'shipped', 'delivered', 'cancelled'];
const RENTAL_STATUSES = ['pending', 'contacted', 'quoted', 'approved', 'active', 'completed', 'cancelled'];

// ==================== MANUAL ENTRY OPTIONS ====================
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

// ==================== MANUAL ENTRY MODAL ====================
const ManualEntryModal = ({ isOpen, onClose, onSave, entryType, toast }) => {
    const [formData, setFormData] = useState({
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
        const siteUrl = window.location.origin;

        const getFormTitle = () => {
            if (entryType === 'service') return 'CİHAZ TESLİM FORMU';
            if (entryType === 'rental') return 'KİRALAMA FORMU';
            return 'SİPARİŞ FORMU';
        };

        const getFormContent = () => {
            if (entryType === 'service') {
                return `
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
                `;
            } else if (entryType === 'rental') {
                return `
                    <div class="section">
                        <div class="section-title">📦 Kiralama Bilgileri</div>
                        <div class="grid">
                            <div class="field">
                                <div class="field-label">Firma</div>
                                <div class="field-value">${data.company || '-'}</div>
                            </div>
                            <div class="field">
                                <div class="field-label">Ürün</div>
                                <div class="field-value">${data.product_name || '-'}</div>
                            </div>
                            <div class="field">
                                <div class="field-label">Adet</div>
                                <div class="field-value">${data.quantity || 1}</div>
                            </div>
                            <div class="field">
                                <div class="field-label">Süre</div>
                                <div class="field-value">${data.duration || '-'}</div>
                            </div>
                            <div class="field">
                                <div class="field-label">Etkinlik Tarihi</div>
                                <div class="field-value">${data.event_date || '-'}</div>
                            </div>
                            <div class="field full-width">
                                <div class="field-label">Notlar</div>
                                <div class="field-value">${data.message || '-'}</div>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                return `
                    <div class="section">
                        <div class="section-title">🛒 Sipariş Bilgileri</div>
                        <div class="grid">
                            <div class="field">
                                <div class="field-label">Ürün Tutarı</div>
                                <div class="field-value">${data.product_price ? data.product_price + ' TL' : '-'}</div>
                            </div>
                            <div class="field">
                                <div class="field-label">Kargo Ücreti</div>
                                <div class="field-value">${data.shipping_price || 0} TL</div>
                            </div>
                            <div class="field">
                                <div class="field-label">Toplam</div>
                                <div class="field-value total">${(parseFloat(data.product_price || 0) + parseFloat(data.shipping_price || 0)).toFixed(2)} TL</div>
                            </div>
                            <div class="field">
                                <div class="field-label">Fatura Tipi</div>
                                <div class="field-value">${data.invoice_type === 'corporate' ? 'Kurumsal' : 'Bireysel'}</div>
                            </div>
                            ${data.invoice_type === 'corporate' ? `
                                <div class="field">
                                    <div class="field-label">Firma Adı</div>
                                    <div class="field-value">${data.company_name || '-'}</div>
                                </div>
                                <div class="field">
                                    <div class="field-label">Vergi Dairesi / No</div>
                                    <div class="field-value">${data.tax_office || '-'} / ${data.tax_no || '-'}</div>
                                </div>
                            ` : `
                                <div class="field">
                                    <div class="field-label">T.C. Kimlik No</div>
                                    <div class="field-value">${data.tc_no || '-'}</div>
                                </div>
                            `}
                        </div>
                    </div>
                `;
            }
        };

        const getTerms = () => {
            if (entryType === 'service') {
                return `
                    <li>Onarım süreci arıza tespiti sonrası bildirilecektir.</li>
                    <li>Fiyat teklifi onayınız alındıktan sonra işleme başlanacaktır.</li>
                    <li>Teslim edilen aksesuarların sorumluluğu firmamıza aittir.</li>
                    <li>Cihazlar 30 gün içinde teslim alınmalıdır. Onarım 6 ay garantilidir.</li>
                `;
            } else if (entryType === 'rental') {
                return `
                    <li>Ürünler eksiksiz ve çalışır durumda teslim edilmiştir.</li>
                    <li>Hasarsız iade edilmesi gerekmektedir. Hasar durumunda bedel yansıtılır.</li>
                    <li>Süre aşımında günlük ek ücret uygulanır.</li>
                `;
            } else {
                return `
                    <li>Ödeme onayı sonrası sipariş hazırlanacaktır.</li>
                    <li>Kargo takip numarası paylaşılacaktır.</li>
                    <li>Teslimde kontrol ediniz. 14 gün içinde iade hakkınız bulunmaktadır.</li>
                `;
            }
        };

        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${getFormTitle()} - ${trackingId}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @page { size: A4; margin: 10mm; }
        body { 
            font-family: 'Segoe UI', Arial, sans-serif; 
            padding: 10mm; 
            font-size: 9pt;
            color: #1a1a1a;
            line-height: 1.3;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #7c3aed;
            padding-bottom: 8px;
            margin-bottom: 12px;
        }
        .logo-section {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .logo-section img.logo-icon {
            height: 45px;
            width: auto;
        }
        .company-info {
            display: flex;
            flex-direction: column;
        }
        .company-info img.logo-text {
            height: 22px;
            width: auto;
            margin-bottom: 2px;
        }
        .company-info p {
            font-size: 7pt;
            color: #666;
        }
        .form-title {
            text-align: right;
        }
        .form-title h2 {
            font-size: 11pt;
            color: #7c3aed;
            margin-bottom: 4px;
        }
        .form-title .tracking {
            font-family: monospace;
            font-size: 10pt;
            color: #1a1a1a;
            background: #f3f0ff;
            padding: 3px 8px;
            border-radius: 4px;
            font-weight: bold;
        }
        .form-title .date {
            font-size: 8pt;
            color: #666;
            margin-top: 3px;
        }
        .section {
            margin-bottom: 10px;
        }
        .section-title {
            font-size: 9pt;
            font-weight: 600;
            color: #7c3aed;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 3px;
            margin-bottom: 6px;
        }
        .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 6px;
        }
        .field { margin-bottom: 2px; }
        .field-label {
            font-size: 7pt;
            color: #666;
            margin-bottom: 1px;
        }
        .field-value {
            font-size: 9pt;
            color: #1a1a1a;
            padding: 4px 8px;
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 3px;
            min-height: 20px;
        }
        .field-value.empty { color: #999; font-style: italic; }
        .field-value.total { font-weight: bold; color: #16a34a; }
        .full-width { grid-column: 1 / -1; }
        .accessories-list {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
        }
        .accessory-item {
            padding: 2px 8px;
            background: #f3f0ff;
            border: 1px solid #7c3aed;
            border-radius: 3px;
            font-size: 8pt;
            color: #7c3aed;
        }
        .terms {
            margin-top: 10px;
            padding: 8px;
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            font-size: 7pt;
            color: #666;
        }
        .terms h4 {
            font-size: 8pt;
            color: #1a1a1a;
            margin-bottom: 4px;
        }
        .terms ul {
            padding-left: 12px;
            margin: 0;
        }
        .terms li { margin-bottom: 1px; }
        .signatures {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-top: 12px;
            padding-top: 10px;
            border-top: 1px solid #e5e7eb;
        }
        .signature-box { text-align: center; }
        .signature-box p {
            font-size: 7pt;
            color: #666;
            margin-bottom: 25px;
        }
        .signature-line {
            border-top: 1px solid #1a1a1a;
            padding-top: 3px;
            font-size: 8pt;
        }
        .footer {
            margin-top: 8px;
            text-align: center;
            font-size: 7pt;
            color: #999;
            border-top: 1px solid #e5e7eb;
            padding-top: 5px;
        }
        @media print {
            body { padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo-section">
            <img src="${siteUrl}/sadece-logo.png" alt="Logo" class="logo-icon" />
            <div class="company-info">
                <img src="${siteUrl}/sadece-yazi.png" alt="VR Tamir Merkezi" class="logo-text" />
                <p>Profesyonel VR Cihaz Servis Hizmetleri</p>
                <p>vrtamirmerkezi.com | info@vrtamirmerkezi.com</p>
            </div>
        </div>
        <div class="form-title">
            <h2>${getFormTitle()}</h2>
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
                <div class="field-label">Teslimat</div>
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

    ${getFormContent()}

    <div class="terms">
        <h4>📋 Şartlar ve Koşullar</h4>
        <ul>${getTerms()}</ul>
    </div>

    <div class="signatures">
        <div class="signature-box">
            <p>Bilgilerin doğruluğunu ve şartları kabul ediyorum.</p>
            <div class="signature-line">
                <strong>Müşteri:</strong> ${data.full_name}
            </div>
        </div>
        <div class="signature-box">
            <p>İşlem tarafımca gerçekleştirilmiştir.</p>
            <div class="signature-line">
                <strong>Yetkili:</strong> VR Tamir Merkezi
            </div>
        </div>
    </div>

    <div class="footer">
        Bu form 2 nüsha düzenlenmiştir. | VR Tamir Merkezi | vrtamirmerkezi.com | ${today}
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

// ==================== ADMIN PANEL PAGE ====================
const AdminPanelPage = () => {
    const [activeTab, setActiveTab] = useState('purchase');
    const [serviceRequests, setServiceRequests] = useState([]);
    const [rentalRequests, setRentalRequests] = useState([]);
    const [purchaseRequests, setPurchaseRequests] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showManualEntry, setShowManualEntry] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [statusNote, setStatusNote] = useState('');
    const [priceQuote, setPriceQuote] = useState('');
    const [receiptUrl, setReceiptUrl] = useState(null);
    const [loadingReceipt, setLoadingReceipt] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const API_URL = import.meta.env.VITE_API_URL || '';
    const token = localStorage.getItem('adminToken');

    useEffect(() => {
        if (!token) {
            navigate('/admin');
            return;
        }
        fetchData();
    }, [token, navigate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const headers = { Authorization: `Bearer ${token}` };

            const [statsRes, serviceRes, rentalRes, purchaseRes] = await Promise.all([
                fetch(`${API_URL}/api/admin/stats`, { headers }),
                fetch(`${API_URL}/api/admin/service-requests`, { headers }),
                fetch(`${API_URL}/api/admin/rental-requests`, { headers }),
                fetch(`${API_URL}/api/admin/purchase-requests`, { headers })
            ]);

            if (!statsRes.ok || !serviceRes.ok || !rentalRes.ok) {
                if (statsRes.status === 401 || serviceRes.status === 401 || rentalRes.status === 401) {
                    throw new Error('Auth Error');
                }
            }

            const [statsData, serviceData, rentalData, purchaseData] = await Promise.all([
                statsRes.json(),
                serviceRes.json(),
                rentalRes.json(),
                purchaseRes.ok ? purchaseRes.json() : { requests: [] }
            ]);

            setStats(statsData);
            setServiceRequests(serviceData.requests || []);
            setRentalRequests(rentalData.requests || []);
            setPurchaseRequests(purchaseData.requests || []);

        } catch (error) {
            console.error('Fetch error:', error);
            if (error.message === 'Auth Error') {
                localStorage.removeItem('adminToken');
                navigate('/admin');
                return;
            }
            toast({ title: 'Hata', description: error.message, variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin');
    };

    const handleManualSave = async (data, type) => {
        try {
            let endpoint = '';
            if (type === 'service') endpoint = `${API_URL}/api/service-requests`;
            else if (type === 'rental') endpoint = `${API_URL}/api/rental-requests`;
            else endpoint = `${API_URL}/api/purchases`;

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error('Kayıt başarısız');

            fetchData();
        } catch (error) {
            throw error;
        }
    };

    const fetchReceipt = async (requestId) => {
        setLoadingReceipt(true);
        try {
            const response = await fetch(`${API_URL}/api/admin/purchase-requests/${requestId}/receipt`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            setReceiptUrl(data.url);
        } catch (error) {
            console.error('Receipt fetch error:', error);
            toast({ title: 'Hata', description: 'Dekont yüklenemedi', variant: 'destructive' });
        } finally {
            setLoadingReceipt(false);
        }
    };

    const openDetailModal = (request) => {
        setSelectedRequest(request);
        setReceiptUrl(null);
        setShowDetailModal(true);

        if (activeTab === 'purchase' && request.id) {
            fetchReceipt(request.id);
        }
    };

    const openStatusModal = (request) => {
        setSelectedRequest(request);
        setNewStatus(request.status);
        setStatusNote('');
        setPriceQuote('');
        setShowStatusModal(true);
    };

    const handleStatusUpdate = async () => {
        if (!selectedRequest || !newStatus) return;

        try {
            let endpoint = '';
            if (activeTab === 'service') {
                endpoint = `${API_URL}/api/admin/service-requests/${selectedRequest.id}/status`;
            } else if (activeTab === 'rental') {
                endpoint = `${API_URL}/api/admin/rental-requests/${selectedRequest.id}/status`;
            } else if (activeTab === 'purchase') {
                endpoint = `${API_URL}/api/admin/purchase-requests/${selectedRequest.id}/status`;
            }

            const response = await fetch(endpoint, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    status: newStatus,
                    notes: statusNote,
                    priceQuote: priceQuote ? parseFloat(priceQuote) : undefined
                })
            });

            if (!response.ok) throw new Error('Güncelleme başarısız');

            toast({ title: 'Başarılı', description: 'Durum güncellendi' });
            setShowStatusModal(false);
            fetchData();

        } catch (error) {
            toast({ title: 'Hata', description: error.message, variant: 'destructive' });
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Bu kaydı silmek istediğinizden emin misiniz?')) return;

        try {
            let endpoint = '';
            if (activeTab === 'service') {
                endpoint = `${API_URL}/api/admin/service-requests/${id}`;
            } else if (activeTab === 'rental') {
                endpoint = `${API_URL}/api/admin/rental-requests/${id}`;
            } else if (activeTab === 'purchase') {
                endpoint = `${API_URL}/api/admin/purchase-requests/${id}`;
            }

            await fetch(endpoint, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            toast({ title: 'Silindi', description: 'Kayıt başarıyla silindi' });
            fetchData();

        } catch (error) {
            toast({ title: 'Hata', description: 'Silme başarısız', variant: 'destructive' });
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast({ title: 'Kopyalandı', description: text });
    };

    const getCurrentRequests = () => {
        let requests = [];
        if (activeTab === 'service') requests = serviceRequests;
        else if (activeTab === 'rental') requests = rentalRequests;
        else if (activeTab === 'purchase') requests = purchaseRequests;

        return requests.filter(r => {
            const matchesSearch = !searchTerm ||
                r.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.phone?.includes(searchTerm) ||
                (r.service_id || r.rental_id || r.purchase_id)?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'all' || r.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    };

    const getStatusOptions = () => {
        if (activeTab === 'service') return SERVICE_STATUSES;
        if (activeTab === 'rental') return RENTAL_STATUSES;
        return PURCHASE_STATUSES;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(price);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Admin Panel | VR Tamir Merkezi</title>
            </Helmet>

            <div className="min-h-screen bg-gray-900">
                {/* Header */}
                <header className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-xl border-b border-white/10">
                    <div className="max-w-7xl mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full">
                                    v2.0
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowManualEntry(true)}
                                    className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Manuel Giriş
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={fetchData}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Yenile
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleLogout}
                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Çıkış
                                </Button>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="max-w-7xl mx-auto px-4 py-6">
                    {/* Stats Cards */}
                    {stats && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div
                                onClick={() => setStatusFilter('pending')}
                                className="p-4 bg-gradient-to-br from-yellow-500/20 to-orange-500/10 rounded-xl border border-yellow-500/20 cursor-pointer hover:border-yellow-500/40 transition-all active:scale-95"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-yellow-500/20 rounded-lg">
                                        <Clock className="w-5 h-5 text-yellow-500" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">
                                            {(stats.service?.pending || 0) + (stats.rental?.pending || 0) + (purchaseRequests.filter(p => p.status === 'pending').length)}
                                        </p>
                                        <p className="text-sm text-gray-400">Bekleyen</p>
                                    </div>
                                </div>
                            </div>
                            <div
                                onClick={() => { setActiveTab('service'); setStatusFilter('all'); }}
                                className="p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 rounded-xl border border-blue-500/20 cursor-pointer hover:border-blue-500/40 transition-all active:scale-95"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/20 rounded-lg">
                                        <Wrench className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">{stats.service?.total || 0}</p>
                                        <p className="text-sm text-gray-400">Servis</p>
                                    </div>
                                </div>
                            </div>
                            <div
                                onClick={() => { setActiveTab('rental'); setStatusFilter('all'); }}
                                className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/10 rounded-xl border border-purple-500/20 cursor-pointer hover:border-purple-500/40 transition-all active:scale-95"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-500/20 rounded-lg">
                                        <Package className="w-5 h-5 text-purple-500" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">{stats.rental?.total || 0}</p>
                                        <p className="text-sm text-gray-400">Kiralama</p>
                                    </div>
                                </div>
                            </div>
                            <div
                                onClick={() => { setActiveTab('purchase'); setStatusFilter('all'); }}
                                className="p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/10 rounded-xl border border-green-500/20 cursor-pointer hover:border-green-500/40 transition-all active:scale-95"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-500/20 rounded-lg">
                                        <ShoppingBag className="w-5 h-5 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">{purchaseRequests.length}</p>
                                        <p className="text-sm text-gray-400">Sipariş</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-xl w-fit">
                        {[
                            { id: 'purchase', label: 'Siparişler', icon: ShoppingBag, count: purchaseRequests.length },
                            { id: 'service', label: 'Servis', icon: Wrench, count: serviceRequests.length },
                            { id: 'rental', label: 'Kiralama', icon: Package, count: rentalRequests.length }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => { setActiveTab(tab.id); setStatusFilter('all'); }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === tab.id
                                    ? 'bg-purple-500 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                <span>{tab.label}</span>
                                <span className={`px-2 py-0.5 text-xs rounded-full ${activeTab === tab.id ? 'bg-white/20' : 'bg-white/10'
                                    }`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Ara... (isim, email, telefon, takip no)"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 outline-none"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-purple-500 outline-none min-w-[180px]"
                            style={{ colorScheme: 'dark' }}
                        >
                            <option value="all">Tüm Durumlar</option>
                            {getStatusOptions().map(status => (
                                <option key={status} value={status}>
                                    {STATUS_CONFIG[status]?.label || status}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Table */}
                    <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="text-left p-4 text-gray-400 font-medium">Takip No</th>
                                        <th className="text-left p-4 text-gray-400 font-medium">Müşteri</th>
                                        <th className="text-left p-4 text-gray-400 font-medium">Durum</th>
                                        {activeTab === 'purchase' && (
                                            <th className="text-left p-4 text-gray-400 font-medium">Tutar</th>
                                        )}
                                        <th className="text-left p-4 text-gray-400 font-medium">Tarih</th>
                                        <th className="text-right p-4 text-gray-400 font-medium">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getCurrentRequests().map((request) => {
                                        const trackingId = request.service_id || request.rental_id || request.purchase_id;
                                        const statusConfig = STATUS_CONFIG[request.status] || STATUS_CONFIG.pending;
                                        const StatusIcon = statusConfig.icon;

                                        return (
                                            <tr
                                                key={request.id}
                                                className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                            >
                                                <td className="p-4">
                                                    <button
                                                        onClick={() => copyToClipboard(trackingId)}
                                                        className="flex items-center gap-2 text-purple-400 hover:text-purple-300"
                                                    >
                                                        <span className="font-mono text-sm">{trackingId}</span>
                                                        <Copy className="w-3 h-3" />
                                                    </button>
                                                </td>
                                                <td className="p-4">
                                                    <div>
                                                        <p className="text-white font-medium">{request.full_name}</p>
                                                        <p className="text-gray-500 text-sm">{request.email}</p>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${statusConfig.color} text-white`}>
                                                        <StatusIcon className="w-3.5 h-3.5" />
                                                        {statusConfig.label}
                                                    </span>
                                                </td>
                                                {activeTab === 'purchase' && (
                                                    <td className="p-4">
                                                        <span className="text-green-400 font-semibold">
                                                            {formatPrice(request.total_price)}
                                                        </span>
                                                    </td>
                                                )}
                                                <td className="p-4 text-gray-400 text-sm">
                                                    {formatDate(request.created_at)}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => openDetailModal(request)}
                                                            className="text-gray-400 hover:text-white hover:bg-white/10"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => openStatusModal(request)}
                                                            className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDelete(request.id)}
                                                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            {getCurrentRequests().length === 0 && (
                                <div className="text-center py-12">
                                    <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                    <p className="text-gray-500">Kayıt bulunamadı</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Detail Modal */}
                <AnimatePresence>
                    {showDetailModal && selectedRequest && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                            onClick={() => setShowDetailModal(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-gray-900 rounded-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                            >
                                <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-gray-900 z-10">
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Detaylar</h2>
                                        <p className="text-gray-400 text-sm mt-1">
                                            {selectedRequest.service_id || selectedRequest.rental_id || selectedRequest.purchase_id}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowDetailModal(false)}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5 text-gray-400" />
                                    </button>
                                </div>

                                <div className="p-6 space-y-6">
                                    {/* Customer Info */}
                                    <div className="p-4 bg-white/5 rounded-xl">
                                        <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                                            <User className="w-4 h-4" /> Müşteri Bilgileri
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-gray-500 text-sm">Ad Soyad</p>
                                                <p className="text-white font-medium">{selectedRequest.full_name}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-sm">E-posta</p>
                                                <p className="text-white">{selectedRequest.email}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-sm">Telefon</p>
                                                <a href={`tel:${selectedRequest.phone}`} className="text-purple-400 hover:text-purple-300">
                                                    {selectedRequest.phone}
                                                </a>
                                            </div>
                                            {selectedRequest.company && (
                                                <div>
                                                    <p className="text-gray-500 text-sm">Firma</p>
                                                    <p className="text-white">{selectedRequest.company}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Service Specific */}
                                    {activeTab === 'service' && (
                                        <div className="p-4 bg-white/5 rounded-xl">
                                            <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                                                <Wrench className="w-4 h-4" /> Cihaz Bilgileri
                                            </h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-gray-500 text-sm">Cihaz</p>
                                                    <p className="text-white">{selectedRequest.device}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-sm">Arıza Tipi</p>
                                                    <p className="text-white">{selectedRequest.fault_type}</p>
                                                </div>
                                                {selectedRequest.fault_description && (
                                                    <div className="col-span-2">
                                                        <p className="text-gray-500 text-sm">Arıza Açıklaması</p>
                                                        <p className="text-white">{selectedRequest.fault_description}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Purchase Specific */}
                                    {activeTab === 'purchase' && (
                                        <>
                                            <div className="p-4 bg-white/5 rounded-xl">
                                                <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                                                    <FileText className="w-4 h-4" /> Fatura Bilgileri
                                                </h3>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-gray-500 text-sm">Fatura Tipi</p>
                                                        <p className="text-white">{selectedRequest.invoice_type === 'corporate' ? 'Kurumsal' : 'Bireysel'}</p>
                                                    </div>
                                                    {selectedRequest.invoice_type === 'corporate' ? (
                                                        <>
                                                            <div>
                                                                <p className="text-gray-500 text-sm">Firma Adı</p>
                                                                <p className="text-white">{selectedRequest.company_name || '-'}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-gray-500 text-sm">Vergi Dairesi</p>
                                                                <p className="text-white">{selectedRequest.tax_office || '-'}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-gray-500 text-sm">Vergi No</p>
                                                                <p className="text-white">{selectedRequest.tax_no || '-'}</p>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div>
                                                            <p className="text-gray-500 text-sm">T.C. Kimlik No</p>
                                                            <p className="text-white">{selectedRequest.tc_no || '-'}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="p-4 bg-white/5 rounded-xl">
                                                <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                                                    <ShoppingBag className="w-4 h-4" /> Sipariş Detayları
                                                </h3>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-gray-500 text-sm">Adet</p>
                                                        <p className="text-white font-medium">{selectedRequest.quantity || 1}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500 text-sm">Teslimat</p>
                                                        <p className="text-white">
                                                            {selectedRequest.delivery_method === 'kargo' ? 'Kargo' : 'Elden Teslim'}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500 text-sm">Ürün Tutarı</p>
                                                        <p className="text-white">{formatPrice(selectedRequest.product_price)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500 text-sm">Kargo Ücreti</p>
                                                        <p className="text-white">{formatPrice(selectedRequest.shipping_price)}</p>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <p className="text-gray-500 text-sm">Toplam Tutar</p>
                                                        <p className="text-2xl font-bold text-green-400">{formatPrice(selectedRequest.total_price)}</p>
                                                    </div>
                                                </div>
                                                {selectedRequest.address && (
                                                    <div className="mt-4 pt-4 border-t border-white/10">
                                                        <p className="text-gray-500 text-sm flex items-center gap-2">
                                                            <MapPin className="w-4 h-4" /> Teslimat Adresi
                                                        </p>
                                                        <p className="text-white mt-1">{selectedRequest.address}</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Receipt */}
                                            <div className="p-4 bg-white/5 rounded-xl">
                                                <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                                                    <Receipt className="w-4 h-4" /> Dekont
                                                </h3>
                                                {loadingReceipt ? (
                                                    <div className="flex items-center justify-center py-8">
                                                        <RefreshCw className="w-6 h-6 text-purple-500 animate-spin" />
                                                    </div>
                                                ) : receiptUrl ? (
                                                    <a
                                                        href={receiptUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 text-purple-400 hover:text-purple-300"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                        Dekontu Görüntüle
                                                    </a>
                                                ) : (
                                                    <p className="text-gray-500">Dekont yüklenmemiş</p>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    {/* Rental Specific */}
                                    {activeTab === 'rental' && (
                                        <div className="p-4 bg-white/5 rounded-xl">
                                            <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                                                <Package className="w-4 h-4" /> Kiralama Detayları
                                            </h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-gray-500 text-sm">Ürün</p>
                                                    <p className="text-white">{selectedRequest.product_name || '-'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-sm">Adet</p>
                                                    <p className="text-white">{selectedRequest.quantity || 1}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-sm">Süre</p>
                                                    <p className="text-white">{selectedRequest.duration || '-'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-sm">Etkinlik Tarihi</p>
                                                    <p className="text-white">{selectedRequest.event_date || '-'}</p>
                                                </div>
                                                {selectedRequest.message && (
                                                    <div className="col-span-2">
                                                        <p className="text-gray-500 text-sm">Mesaj</p>
                                                        <p className="text-white">{selectedRequest.message}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Status Update Modal */}
                <AnimatePresence>
                    {showStatusModal && selectedRequest && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                            onClick={() => setShowStatusModal(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-gray-900 rounded-2xl border border-white/10 w-full max-w-md"
                            >
                                <div className="p-6 border-b border-white/10">
                                    <h2 className="text-xl font-bold text-white">Durum Güncelle</h2>
                                    <p className="text-gray-400 text-sm mt-1">
                                        {selectedRequest.service_id || selectedRequest.rental_id || selectedRequest.purchase_id}
                                    </p>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-400 block mb-2">Yeni Durum</label>
                                        <select
                                            value={newStatus}
                                            onChange={(e) => setNewStatus(e.target.value)}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-purple-500 outline-none"
                                            style={{ colorScheme: 'dark' }}
                                        >
                                            {getStatusOptions().map(status => (
                                                <option key={status} value={status}>
                                                    {STATUS_CONFIG[status]?.label || status}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {activeTab === 'service' && newStatus === 'quoted' && (
                                        <div>
                                            <label className="text-sm text-gray-400 block mb-2">Fiyat Teklifi (TL)</label>
                                            <input
                                                type="number"
                                                value={priceQuote}
                                                onChange={(e) => setPriceQuote(e.target.value)}
                                                placeholder="Örn: 500"
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 outline-none"
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <label className="text-sm text-gray-400 block mb-2">Not (Opsiyonel)</label>
                                        <textarea
                                            value={statusNote}
                                            onChange={(e) => setStatusNote(e.target.value)}
                                            rows={3}
                                            placeholder="Durum ile ilgili not ekleyin..."
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 outline-none resize-none"
                                        />
                                    </div>
                                </div>

                                <div className="p-6 border-t border-white/10 flex gap-3">
                                    <Button
                                        variant="ghost"
                                        onClick={() => setShowStatusModal(false)}
                                        className="flex-1 bg-white/5 hover:bg-white/10 text-white"
                                    >
                                        İptal
                                    </Button>
                                    <Button
                                        onClick={handleStatusUpdate}
                                        className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                                    >
                                        Güncelle
                                    </Button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Manual Entry Modal */}
                <ManualEntryModal
                    isOpen={showManualEntry}
                    onClose={() => setShowManualEntry(false)}
                    onSave={handleManualSave}
                    entryType={activeTab}
                    toast={toast}
                />
            </div>
        </>
    );
};

export default AdminPanelPage;
