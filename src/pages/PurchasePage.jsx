import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ShoppingBag, Package, MapPin, Upload, CheckCircle, Copy, CreditCard, Truck, Building, User, Mail, Phone, FileText, Shield, ArrowRight, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const PRODUCT = {
    name: 'VR Hijyen Gozluk Bandi',
    price: 769,
    image: '/hijyen-bandi.png',
    description: 'Premium kalite, tek kullanimlik VR hijyen bandi. 100 adet paket.'
};

const SHIPPING_OPTIONS = [
    { id: 'kargo', label: 'Kargo ile Teslimat', price: 69.99, icon: Truck, description: '2-3 is gunu icinde teslim' },
    { id: 'elden', label: 'Elden Teslim', price: 0, icon: Building, description: 'Istoc, 32. Ada No:78-80, Bagcilar, Istanbul' }
];

const BANK_INFO = {
    name: 'ECR ETKINLIK BILGISAYAR TEKNOLOJILERI A.S.',
    iban: 'TR30 0004 6006 3088 8000 1966 32',
    bank: 'Akbank'
};

const PurchasePage = () => {
    const [quantity, setQuantity] = useState(1);
    const [formData, setFormData] = useState({
        fullName: '',
        invoiceType: 'individual',
        tcNo: '',
        companyName: '',
        taxOffice: '',
        taxNo: '',
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
    const totalPrice = (PRODUCT.price * quantity) + (selectedShipping?.price || 0);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleReceiptUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast({ title: 'Hata', description: 'Dosya boyutu 5MB\'dan kucuk olmalidir', variant: 'destructive' });
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
        toast({ title: 'Kopyalandi!', description: 'IBAN panoya kopyalandi.' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.fullName || !formData.email || !formData.phone) {
            toast({ title: 'Hata', description: 'Lutfen temel bilgileri doldurun', variant: 'destructive' });
            return;
        }

        if (formData.invoiceType === 'individual' && !formData.tcNo) {
            toast({ title: 'Hata', description: 'Lutfen T.C. Kimlik numaranizi girin', variant: 'destructive' });
            return;
        }

        if (formData.invoiceType === 'corporate' && (!formData.companyName || !formData.taxOffice || !formData.taxNo)) {
            toast({ title: 'Hata', description: 'Lutfen firma ve vergi bilgelerini doldurun', variant: 'destructive' });
            return;
        }

        if (formData.deliveryMethod === 'kargo' && !formData.address) {
            toast({ title: 'Hata', description: 'Lutfen teslimat adresini girin', variant: 'destructive' });
            return;
        }

        if (!receipt) {
            toast({ title: 'Hata', description: 'Lutfen dekont yukleyin', variant: 'destructive' });
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
                    quantity,
                    productPrice: PRODUCT.price,
                    shippingPrice: selectedShipping.price,
                    totalPrice,
                    receiptBase64: receipt
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Siparis olusturulamadi');
            }

            setSuccess(true);
            setPurchaseId(data.data.purchaseId);
            toast({ title: 'Basarili!', description: 'Siparisimiz alindi.' });

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
                    <title>Siparis Tamamlandi | VR Kiralama</title>
                </Helmet>
                <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-[#0a0e27] dark:via-black dark:to-[#0a0e27] py-16 px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-lg mx-auto text-center"
                    >
                        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                            <CheckCircle className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Siparisimiz Alindi
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            Dekontunuz kontrol edildikten sonra siparisimiz onaylanacak ve size bilgilendirme e-postasi gonderilecektir.
                        </p>

                        <div className="p-6 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 mb-8">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Siparis Numaraniz</p>
                            <div className="flex items-center justify-center gap-3">
                                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400 font-mono">
                                    {purchaseId}
                                </span>
                                <button
                                    onClick={() => copyToClipboard(purchaseId)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <Copy className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                onClick={() => window.location.href = '/'}
                                variant="outline"
                                className="border-gray-300 dark:border-white/20"
                            >
                                Ana Sayfaya Don
                            </Button>
                            <Button
                                onClick={() => window.location.href = '/takip'}
                                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                            >
                                Siparis Takibi
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </>
        );
    }

    return (
        <>
            <Helmet>
                <title>VR Hijyen Bandi Satin Al | VR Kiralama</title>
                <meta name="description" content="Premium kalite VR hijyen bandi satin al. Hizli teslimat, uygun fiyat." />
            </Helmet>

            <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-[#0a0e27] dark:via-black dark:to-[#0a0e27]">
                {/* Hero Section */}
                <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10" />
                    <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center max-w-2xl mx-auto"
                        >
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-600 dark:text-purple-400 text-sm font-medium mb-6">
                                <Shield className="w-4 h-4" />
                                Guvenli Alisveris
                            </span>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                                VR Hijyen Gozluk Bandi
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-400">
                                Premium kalite, tek kullanimlik hijyen bandi ile VR deneyimizi daha hijyenik hale getirin.
                            </p>
                        </motion.div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 pb-16 -mt-4">
                    <div className="grid lg:grid-cols-5 gap-8">
                        {/* Product Card - Sticky */}
                        <div className="lg:col-span-2">
                            <div className="lg:sticky lg:top-24">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-white dark:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-none"
                                >
                                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 p-8 flex items-center justify-center">
                                        <img
                                            src={PRODUCT.image}
                                            alt={PRODUCT.name}
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                            {PRODUCT.name}
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                                            {PRODUCT.description}
                                        </p>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-white/10">
                                            <div>
                                                <p className="text-sm text-gray-500">Birim Fiyat</p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    {PRODUCT.price.toLocaleString('tr-TR')} TL
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3 bg-gray-100 dark:bg-white/10 rounded-xl p-1">
                                                <button
                                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                    className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-white/10 transition-colors"
                                                >
                                                    <Minus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                                </button>
                                                <span className="w-12 text-center text-lg font-semibold text-gray-900 dark:text-white">
                                                    {quantity}
                                                </span>
                                                <button
                                                    onClick={() => setQuantity(quantity + 1)}
                                                    className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-white/10 transition-colors"
                                                >
                                                    <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Summary */}
                                        <div className="mt-6 p-4 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/20">
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-gray-600 dark:text-gray-400">Urun Tutari</span>
                                                <span className="text-gray-900 dark:text-white">{(PRODUCT.price * quantity).toLocaleString('tr-TR')} TL</span>
                                            </div>
                                            <div className="flex justify-between text-sm mb-3">
                                                <span className="text-gray-600 dark:text-gray-400">Kargo</span>
                                                <span className="text-gray-900 dark:text-white">
                                                    {selectedShipping?.price ? `${selectedShipping.price.toLocaleString('tr-TR')} TL` : 'Ucretsiz'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between pt-3 border-t border-purple-500/20">
                                                <span className="font-semibold text-gray-900 dark:text-white">Toplam</span>
                                                <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                                                    {totalPrice.toLocaleString('tr-TR')} TL
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Form */}
                        <motion.form
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onSubmit={handleSubmit}
                            className="lg:col-span-3 space-y-6"
                        >
                            {/* Shipping Method */}
                            <div className="p-6 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Truck className="w-5 h-5 text-purple-500" />
                                    Teslimat Yontemi
                                </h3>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {SHIPPING_OPTIONS.map(option => (
                                        <label
                                            key={option.id}
                                            className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.deliveryMethod === option.id
                                                ? 'border-purple-500 bg-purple-500/5'
                                                : 'border-gray-200 dark:border-white/10 hover:border-purple-500/50'
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
                                            <div className="flex items-start gap-3">
                                                <div className={`p-2 rounded-lg ${formData.deliveryMethod === option.id
                                                    ? 'bg-purple-500 text-white'
                                                    : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400'
                                                    }`}>
                                                    <option.icon className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-medium text-gray-900 dark:text-white">{option.label}</span>
                                                        <span className={`text-sm font-semibold ${option.price === 0 ? 'text-green-500' : 'text-gray-900 dark:text-white'
                                                            }`}>
                                                            {option.price === 0 ? 'Ucretsiz' : `${option.price} TL`}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{option.description}</p>
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Bank Info */}
                            <div className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl border border-blue-500/20">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-blue-500" />
                                    Odeme Bilgileri
                                </h3>
                                <div className="space-y-3">
                                    <div className="p-4 bg-white dark:bg-black/20 rounded-xl">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Hesap Sahibi</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{BANK_INFO.name}</p>
                                    </div>
                                    <div className="p-4 bg-white dark:bg-black/20 rounded-xl">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Banka</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{BANK_INFO.bank}</p>
                                    </div>
                                    <div className="p-4 bg-white dark:bg-black/20 rounded-xl">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">IBAN</p>
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="font-mono font-medium text-gray-900 dark:text-white">{BANK_INFO.iban}</p>
                                            <button
                                                type="button"
                                                onClick={() => copyToClipboard(BANK_INFO.iban.replace(/\s/g, ''))}
                                                className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                                            >
                                                <Copy className="w-4 h-4 text-gray-400" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <p className="mt-4 text-sm text-blue-600 dark:text-blue-400">
                                    Lutfen odemeyi yaptiktan sonra dekont gorselini asagiya yukleyin.
                                </p>
                            </div>

                            {/* Invoice Type */}
                            <div className="p-6 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-purple-500" />
                                    Fatura Bilgileri
                                </h3>

                                <div className="flex gap-3 mb-6">
                                    {[
                                        { id: 'individual', label: 'Bireysel' },
                                        { id: 'corporate', label: 'Kurumsal' }
                                    ].map(type => (
                                        <button
                                            key={type.id}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, invoiceType: type.id }))}
                                            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${formData.invoiceType === type.id
                                                ? 'bg-purple-500 text-white'
                                                : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/20'
                                                }`}
                                        >
                                            {type.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Ad Soyad
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="Adiniz ve soyadiniz"
                                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    {formData.invoiceType === 'individual' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                T.C. Kimlik No
                                            </label>
                                            <input
                                                type="text"
                                                name="tcNo"
                                                value={formData.tcNo}
                                                onChange={handleInputChange}
                                                required
                                                maxLength={11}
                                                placeholder="11 haneli T.C. kimlik numaraniz"
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                                            />
                                        </div>
                                    )}

                                    {formData.invoiceType === 'corporate' && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Firma Adi
                                                </label>
                                                <input
                                                    type="text"
                                                    name="companyName"
                                                    value={formData.companyName}
                                                    onChange={handleInputChange}
                                                    required
                                                    placeholder="Firma unvani"
                                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Vergi Dairesi
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="taxOffice"
                                                        value={formData.taxOffice}
                                                        onChange={handleInputChange}
                                                        required
                                                        placeholder="Vergi dairesi"
                                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Vergi No
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="taxNo"
                                                        value={formData.taxNo}
                                                        onChange={handleInputChange}
                                                        required
                                                        placeholder="Vergi numarasi"
                                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                E-posta
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    required
                                                    placeholder="ornek@email.com"
                                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Telefon
                                            </label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    required
                                                    placeholder="05XX XXX XXXX"
                                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {formData.deliveryMethod === 'kargo' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Teslimat Adresi
                                            </label>
                                            <div className="relative">
                                                <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                                                <textarea
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    required
                                                    rows={3}
                                                    placeholder="Acik adresinizi giriniz (il, ilce, mahalle, sokak, bina no, daire no)"
                                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all resize-none"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Receipt Upload */}
                            <div className="p-6 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Upload className="w-5 h-5 text-purple-500" />
                                    Dekont Yukle
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                    Havale/EFT yaptiktan sonra dekont gorselini yukleyin.
                                </p>

                                <label className={`block w-full p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${receipt
                                    ? 'border-green-500 bg-green-50 dark:bg-green-500/10'
                                    : 'border-gray-300 dark:border-white/20 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-500/5'
                                    }`}>
                                    <input
                                        type="file"
                                        accept="image/*,.pdf"
                                        onChange={handleReceiptUpload}
                                        className="hidden"
                                    />
                                    {receipt ? (
                                        <div className="text-center">
                                            {receiptPreview && !receiptPreview.includes('.pdf') && (
                                                <img
                                                    src={receiptPreview}
                                                    alt="Dekont"
                                                    className="max-h-40 mx-auto mb-4 rounded-lg shadow-lg"
                                                />
                                            )}
                                            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <CheckCircle className="w-6 h-6 text-white" />
                                            </div>
                                            <p className="text-green-600 dark:text-green-400 font-semibold">Dekont Yuklendi</p>
                                            <p className="text-sm text-gray-500 mt-1">Degistirmek icin tiklayin</p>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <div className="w-16 h-16 bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Upload className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-300 font-medium mb-1">Dekont yuklemek icin tiklayin</p>
                                            <p className="text-sm text-gray-400">PNG, JPG veya PDF (Max 5MB)</p>
                                        </div>
                                    )}
                                </label>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={loading || !receipt}
                                className="w-full py-4 h-auto bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold text-lg rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Gonderiliyor...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        Siparisi Tamamla - {totalPrice.toLocaleString('tr-TR')} TL
                                        <ArrowRight className="w-5 h-5" />
                                    </span>
                                )}
                            </Button>

                            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                                Siparisimiz, dekontunuz onaylandiktan sonra isleme alinacaktir.
                                Sorulariniz icin bize ulasin: info@etkinlikbilgisayar.com
                            </p>
                        </motion.form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PurchasePage;