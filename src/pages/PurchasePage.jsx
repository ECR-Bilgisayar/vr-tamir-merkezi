import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ShoppingBag, Package, MapPin, Upload, CheckCircle, Copy, CreditCard, Truck, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const PRODUCT = {
    name: 'VR Hijyen Gözlük Bandı',
    price: 769,
    image: '/products/vr-band.jpg',
    description: 'Premium kalite, tek kullanımlık VR hijyen bandı. 100 adet paket.'
};

const SHIPPING_OPTIONS = [
    { id: 'kargo', label: 'Kargo ile Teslimat', price: 69.99, icon: Truck, description: '2-3 iş günü içinde teslim' },
    { id: 'elden', label: 'Elden Teslim', price: 0, icon: Building, description: 'İstoç, 32. Ada No:78-80, Bağcılar, İstanbul' }
];

const BANK_INFO = {
    name: 'ECR ETKİNLİK BİLGİSAYAR TEKNOLOJİLERİ A.Ş.',
    iban: 'TR30 0004 6006 3088 8000 1966 32',
    bank: 'Akbank'
};

const PurchasePage = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        deliveryMethod: 'kargo'
    });
    const [receipt, setReceipt] = useState(null);
    const [receiptPreview, setReceiptPreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [purchaseId, setPurchaseId] = useState('');
    const { toast } = useToast();

    const selectedShipping = SHIPPING_OPTIONS.find(o => o.id === formData.deliveryMethod);
    const totalPrice = PRODUCT.price + (selectedShipping?.price || 0);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleReceiptUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast({ title: 'Hata', description: 'Dosya boyutu 5MB\'dan küçük olmalıdır', variant: 'destructive' });
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setReceipt(reader.result);
                setReceiptPreview(URL.createObjectURL(file));
            };
            reader.readAsDataURL(file);
        }
    };

    const copyToClipboard = async (text) => {
        await navigator.clipboard.writeText(text);
        toast({ title: 'Kopyalandı!', description: 'IBAN panoya kopyalandı.' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.fullName || !formData.email || !formData.phone) {
            toast({ title: 'Hata', description: 'Lütfen tüm zorunlu alanları doldurun', variant: 'destructive' });
            return;
        }

        if (!receipt) {
            toast({ title: 'Hata', description: 'Lütfen dekont yükleyin', variant: 'destructive' });
            return;
        }

        setLoading(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || '';
            const response = await fetch(`${API_URL}/api/purchases`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    productPrice: PRODUCT.price,
                    shippingPrice: selectedShipping.price,
                    totalPrice,
                    receiptBase64: receipt
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Sipariş oluşturulamadı');
            }

            setSuccess(true);
            setPurchaseId(data.data.purchaseId);
            toast({ title: 'Başarılı!', description: 'Siparişiniz alındı.' });

        } catch (error) {
            toast({ title: 'Hata', description: error.message, variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <>
                <Helmet>
                    <title>Sipariş Tamamlandı | VR Kiralama</title>
                </Helmet>
                <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-[#0a0e27] dark:via-black dark:to-[#0a0e27] py-16 px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-lg mx-auto text-center"
                    >
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Siparişiniz Alındı!
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Dekontunuz incelendikten sonra siparişiniz onaylanacak ve kargoya verilecektir.
                        </p>
                        <div className="p-4 bg-purple-50 dark:bg-purple-500/10 rounded-xl border border-purple-200 dark:border-purple-500/20 mb-6">
                            <p className="text-sm text-purple-600 dark:text-purple-400">Takip Numaranız</p>
                            <p className="text-2xl font-mono font-bold text-purple-700 dark:text-purple-300">{purchaseId}</p>
                        </div>
                        <Button
                            onClick={() => window.location.href = '/takip'}
                            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                        >
                            Siparişimi Takip Et
                        </Button>
                    </motion.div>
                </div>
            </>
        );
    }

    return (
        <>
            <Helmet>
                <title>VR Hijyen Gözlük Bandı Satın Al | VR Kiralama</title>
                <meta name="description" content="VR Hijyen Gözlük Bandı satın alın. Hızlı kargo veya elden teslim seçenekleri." />
            </Helmet>

            <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-[#0a0e27] dark:via-black dark:to-[#0a0e27] py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-10"
                    >
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                            <ShoppingBag className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            Sipariş Oluştur
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            VR Hijyen Gözlük Bandı - Premium Kalite
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Product & Payment Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="space-y-6"
                        >
                            {/* Product Card */}
                            <div className="p-6 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🛒 Sepetiniz</h3>
                                <div className="flex gap-4 items-center p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                                        <Package className="w-8 h-8 text-purple-500" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900 dark:text-white">{PRODUCT.name}</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{PRODUCT.description}</p>
                                    </div>
                                    <p className="text-xl font-bold text-purple-600 dark:text-purple-400">₺{PRODUCT.price}</p>
                                </div>
                            </div>

                            {/* Shipping Options */}
                            <div className="p-6 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🚚 Teslimat Seçeneği</h3>
                                <div className="space-y-3">
                                    {SHIPPING_OPTIONS.map((option) => {
                                        const Icon = option.icon;
                                        return (
                                            <label
                                                key={option.id}
                                                className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${formData.deliveryMethod === option.id
                                                        ? 'bg-purple-50 dark:bg-purple-500/10 border-2 border-purple-500'
                                                        : 'bg-gray-50 dark:bg-white/5 border-2 border-transparent hover:border-purple-300'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="deliveryMethod"
                                                    value={option.id}
                                                    checked={formData.deliveryMethod === option.id}
                                                    onChange={handleInputChange}
                                                    className="sr-only"
                                                />
                                                <Icon className={`w-6 h-6 ${formData.deliveryMethod === option.id ? 'text-purple-500' : 'text-gray-400'}`} />
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900 dark:text-white">{option.label}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{option.description}</p>
                                                </div>
                                                <p className={`font-bold ${option.price === 0 ? 'text-green-500' : 'text-gray-700 dark:text-gray-300'}`}>
                                                    {option.price === 0 ? 'Ücretsiz' : `+₺${option.price}`}
                                                </p>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Bank Info */}
                            <div className="p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl border border-purple-500/20">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🏦 Havale/EFT Bilgileri</h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Hesap Sahibi</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{BANK_INFO.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">IBAN</p>
                                        <div className="flex items-center gap-2">
                                            <p className="font-mono font-medium text-gray-900 dark:text-white">{BANK_INFO.iban}</p>
                                            <button
                                                onClick={() => copyToClipboard(BANK_INFO.iban.replace(/\s/g, ''))}
                                                className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
                                            >
                                                <Copy className="w-4 h-4 text-purple-500" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="mt-4 pt-4 border-t border-purple-500/20">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400">Ürün</span>
                                        <span className="text-gray-900 dark:text-white">₺{PRODUCT.price}</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-gray-600 dark:text-gray-400">Kargo</span>
                                        <span className={selectedShipping?.price === 0 ? 'text-green-500' : 'text-gray-900 dark:text-white'}>
                                            {selectedShipping?.price === 0 ? 'Ücretsiz' : `₺${selectedShipping?.price}`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-purple-500/20">
                                        <span className="text-lg font-semibold text-gray-900 dark:text-white">Toplam</span>
                                        <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">₺{totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Order Form */}
                        <motion.form
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >
                            {/* Contact Info */}
                            <div className="p-6 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">👤 İletişim Bilgileri</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ad Soyad *</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:border-purple-500 outline-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-posta *</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:border-purple-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telefon *</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:border-purple-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                    {formData.deliveryMethod === 'kargo' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teslimat Adresi *</label>
                                            <textarea
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                required
                                                rows={3}
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:border-purple-500 outline-none resize-none"
                                                placeholder="Açık adresinizi giriniz..."
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Receipt Upload */}
                            <div className="p-6 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📎 Dekont Yükle</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                    Havale/EFT yaptıktan sonra dekont görselini yükleyin.
                                </p>

                                <label className={`block w-full p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all ${receipt
                                        ? 'border-green-500 bg-green-50 dark:bg-green-500/10'
                                        : 'border-gray-300 dark:border-white/20 hover:border-purple-500'
                                    }`}>
                                    <input
                                        type="file"
                                        accept="image/*,.pdf"
                                        onChange={handleReceiptUpload}
                                        className="hidden"
                                    />
                                    {receipt ? (
                                        <div className="text-center">
                                            {receiptPreview && (
                                                <img
                                                    src={receiptPreview}
                                                    alt="Dekont"
                                                    className="max-h-32 mx-auto mb-3 rounded-lg"
                                                />
                                            )}
                                            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                            <p className="text-green-600 dark:text-green-400 font-medium">Dekont Yüklendi</p>
                                            <p className="text-sm text-gray-500">Değiştirmek için tıklayın</p>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                                            <p className="text-gray-600 dark:text-gray-400 font-medium">Dekont yüklemek için tıklayın</p>
                                            <p className="text-sm text-gray-400">PNG, JPG veya PDF (Max 5MB)</p>
                                        </div>
                                    )}
                                </label>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={loading || !receipt}
                                className="w-full py-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold text-lg rounded-xl disabled:opacity-50"
                            >
                                {loading ? 'Gönderiliyor...' : `Siparişi Tamamla - ₺${totalPrice.toFixed(2)}`}
                            </Button>

                            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                                Siparişiniz, dekontunuz onaylandıktan sonra işleme alınacaktır.
                            </p>
                        </motion.form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PurchasePage;
