import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Search, Package, Clock, CheckCircle, Phone, Wrench, Truck, MapPin, AlertCircle, MessageSquare, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Service request statuses
const SERVICE_STATUS_CONFIG = {
    pending: { label: 'Yeni Talep', color: 'bg-yellow-500', icon: Clock, description: 'Talebiniz alındı, inceleniyor.' },
    contacted: { label: 'İletişime Geçildi', color: 'bg-blue-500', icon: Phone, description: 'Sizinle iletişime geçildi.' },
    received: { label: 'Cihaz Teslim Alındı', color: 'bg-indigo-500', icon: Package, description: 'Cihazınız teslim alındı.' },
    diagnosed: { label: 'Arıza Tespiti Yapıldı', color: 'bg-purple-500', icon: Search, description: 'Arıza tespit edildi.' },
    quoted: { label: 'Fiyat Teklifi Sunuldu', color: 'bg-orange-500', icon: MessageSquare, description: 'Size fiyat teklifi sunuldu.' },
    approved: { label: 'Onaylandı', color: 'bg-cyan-500', icon: CheckCircle, description: 'Onarım onaylandı.' },
    repairing: { label: 'Onarım Sürecinde', color: 'bg-pink-500', icon: Wrench, description: 'Cihazınız onarılıyor.' },
    repaired: { label: 'Onarım Tamamlandı', color: 'bg-emerald-500', icon: CheckCircle, description: 'Onarım tamamlandı!' },
    shipped: { label: 'Kargoya Verildi', color: 'bg-teal-500', icon: Truck, description: 'Cihazınız kargoya verildi.' },
    delivered: { label: 'Teslim Edildi', color: 'bg-green-600', icon: MapPin, description: 'Cihazınız teslim edildi.' },
    cancelled: { label: 'İptal Edildi', color: 'bg-red-500', icon: AlertCircle, description: 'Talep iptal edildi.' }
};

// Rental request statuses - simpler flow without repair stages
const RENTAL_STATUS_CONFIG = {
    pending: { label: 'Yeni Talep', color: 'bg-yellow-500', icon: Clock, description: 'Kiralama talebiniz alındı.' },
    contacted: { label: 'İletişime Geçildi', color: 'bg-blue-500', icon: Phone, description: 'Sizinle iletişime geçildi.' },
    quoted: { label: 'Teklif Gönderildi', color: 'bg-orange-500', icon: MessageSquare, description: 'Fiyat teklifi gönderildi.' },
    approved: { label: 'Onaylandı', color: 'bg-cyan-500', icon: CheckCircle, description: 'Kiralama onaylandı.' },
    active: { label: 'Kiralama Aktif', color: 'bg-emerald-500', icon: Package, description: 'Cihazlar kullanımınızda.' },
    completed: { label: 'Tamamlandı', color: 'bg-green-600', icon: CheckCircle, description: 'Kiralama tamamlandı.' },
    cancelled: { label: 'İptal Edildi', color: 'bg-red-500', icon: AlertCircle, description: 'Talep iptal edildi.' }
};

const SERVICE_STATUSES = ['pending', 'contacted', 'received', 'diagnosed', 'quoted', 'approved', 'repairing', 'repaired', 'shipped', 'delivered'];
const RENTAL_STATUSES = ['pending', 'contacted', 'quoted', 'approved', 'active', 'completed'];

const TrackingPage = () => {
    const [trackingId, setTrackingId] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [requestType, setRequestType] = useState('service'); // 'service' or 'rental'

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!trackingId.trim()) return;

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const API_URL = import.meta.env.VITE_API_URL || '';

            // Determine if it's a service or rental request based on prefix
            const isRental = trackingId.trim().toUpperCase().startsWith('RNT');
            const endpoint = isRental
                ? `${API_URL}/api/rental-requests/track/${trackingId.trim()}`
                : `${API_URL}/api/service-requests/track/${trackingId.trim()}`;

            const response = await fetch(endpoint);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Talep bulunamadı');
            }

            setResult(data);
            setRequestType(isRental ? 'rental' : 'service');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusConfig = () => requestType === 'rental' ? RENTAL_STATUS_CONFIG : SERVICE_STATUS_CONFIG;
    const getAllStatuses = () => requestType === 'rental' ? RENTAL_STATUSES : SERVICE_STATUSES;

    const getCurrentStatusIndex = () => {
        if (!result) return -1;
        const statuses = getAllStatuses();
        return statuses.indexOf(result.request.status);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const statusConfig = getStatusConfig();
    const allStatuses = getAllStatuses();

    return (
        <>
            <Helmet>
                <title>Sipariş / Servis Takip - VR Tamir Merkezi</title>
                <meta name="description" content="Servis veya kiralama talebinizin durumunu takip numaranızla sorgulayın." />
            </Helmet>

            <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-[#0a0e27] dark:via-black dark:to-[#0a0e27] py-16 px-4">
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                            <Package className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Sipariş / Servis Takip
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                            Takip numaranızı girerek servis veya kiralama talebinizin durumunu sorgulayabilirsiniz.
                        </p>
                    </motion.div>

                    {/* Search Form */}
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        onSubmit={handleSearch}
                        className="mb-8"
                    >
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={trackingId}
                                    onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                                    placeholder="SRV-2026-XXXXXX veya RNT-2026-XXXXXX"
                                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none text-lg font-mono"
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={loading || !trackingId.trim()}
                                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-xl disabled:opacity-50"
                            >
                                {loading ? 'Sorgulanıyor...' : 'Sorgula'}
                            </Button>
                        </div>
                    </motion.form>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl mb-8"
                        >
                            <div className="flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-red-500" />
                                <p className="text-red-700 dark:text-red-400">{error}</p>
                            </div>
                        </motion.div>
                    )}

                    {/* Result */}
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {/* Status Card */}
                            <div className="p-6 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Takip No</p>
                                        <p className="text-xl font-mono font-bold text-purple-600 dark:text-purple-400">
                                            {result.request.service_id || result.request.rental_id}
                                        </p>
                                    </div>
                                    <div className={`px-4 py-2 rounded-full text-white font-medium ${statusConfig[result.request.status]?.color || 'bg-gray-500'}`}>
                                        {statusConfig[result.request.status]?.label || result.request.status}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    {requestType === 'service' ? (
                                        <>
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400">Cihaz</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">{result.request.device}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400">Arıza Tipi</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">{result.request.fault_type}</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400">Firma</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">{result.request.company || '-'}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400">Talep Türü</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">Kiralama</p>
                                            </div>
                                        </>
                                    )}
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400">Oluşturma Tarihi</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{formatDate(result.request.created_at)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400">Son Güncelleme</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{formatDate(result.request.updated_at)}</p>
                                    </div>
                                </div>

                                {/* Price Quote if available */}
                                {result.request.price_quote && (
                                    <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-500/10 rounded-xl border border-orange-200 dark:border-orange-500/20">
                                        <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">💰 Fiyat Teklifi</p>
                                        <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">₺{result.request.price_quote.toLocaleString('tr-TR')}</p>
                                    </div>
                                )}
                            </div>

                            {/* Progress Timeline */}
                            <div className="p-6 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Süreç Durumu</h3>
                                <div className="relative">
                                    {/* Progress Bar */}
                                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-white/10" />
                                    <div
                                        className="absolute left-4 top-0 w-0.5 bg-gradient-to-b from-purple-500 to-blue-500 transition-all duration-500"
                                        style={{ height: `${Math.max(0, (getCurrentStatusIndex() / (allStatuses.length - 1)) * 100)}%` }}
                                    />

                                    <div className="space-y-6">
                                        {allStatuses.map((status, index) => {
                                            const config = statusConfig[status];
                                            const isActive = index <= getCurrentStatusIndex();
                                            const isCurrent = status === result.request.status;
                                            const Icon = config.icon;

                                            return (
                                                <div key={status} className="relative flex items-start gap-4 pl-10">
                                                    <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isCurrent
                                                        ? `${config.color} ring-4 ring-purple-500/30`
                                                        : isActive
                                                            ? config.color
                                                            : 'bg-gray-200 dark:bg-white/10'
                                                        }`}>
                                                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                                                    </div>
                                                    <div className={`pt-1 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                                                        <p className={`font-semibold ${isCurrent ? 'text-purple-600 dark:text-purple-400' : 'text-gray-900 dark:text-white'}`}>
                                                            {config.label}
                                                        </p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">{config.description}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* History with Notes */}
                            {result.history && result.history.length > 0 && (
                                <div className="p-6 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Durum Geçmişi</h3>
                                    <div className="space-y-4">
                                        {result.history.map((item, index) => (
                                            <div key={index} className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-3 h-3 rounded-full ${statusConfig[item.new_status]?.color || 'bg-gray-400'}`} />
                                                        <span className="font-medium text-gray-900 dark:text-white">
                                                            {statusConfig[item.new_status]?.label || item.new_status}
                                                        </span>
                                                    </div>
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                                        {formatDate(item.created_at)}
                                                    </span>
                                                </div>
                                                {item.notes && (
                                                    <div className="mt-2 pl-6 flex items-start gap-2">
                                                        <FileText className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                                                            {item.notes}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Help Text */}
                    {!result && !error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-center text-gray-500 dark:text-gray-400 text-sm space-y-2"
                        >
                            <p>Takip numaranızı talebinizi oluşturduktan sonra aldığınız e-postada bulabilirsiniz.</p>
                            <p>
                                Servis: <span className="font-mono text-purple-600 dark:text-purple-400">SRV-2026-123456</span>
                                <span className="mx-2">|</span>
                                Kiralama: <span className="font-mono text-blue-600 dark:text-blue-400">RNT-2026-123456</span>
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>
        </>
    );
};

export default TrackingPage;