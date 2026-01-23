import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Trash2, Download, LogOut, RefreshCw, ChevronDown,
    Wrench, Package, Clock, CheckCircle, XCircle, Phone, Mail,
    AlertCircle, TrendingUp, Users, Calendar, Eye, X, MessageSquare, Copy,
    ShoppingBag, Image, CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const STATUS_CONFIG = {
    pending: { label: 'Yeni Talep', color: 'bg-yellow-500', icon: Clock },
    contacted: { label: 'İletişime Geçildi', color: 'bg-blue-500', icon: Phone },
    received: { label: 'Cihaz Teslim Alındı', color: 'bg-indigo-500', icon: Package },
    diagnosed: { label: 'Arıza Tespiti', color: 'bg-purple-500', icon: Search },
    quoted: { label: 'Fiyat Teklifi', color: 'bg-orange-500', icon: MessageSquare },
    approved: { label: 'Onaylandı', color: 'bg-cyan-500', icon: CheckCircle },
    repairing: { label: 'Onarım Sürecinde', color: 'bg-pink-500', icon: Wrench },
    repaired: { label: 'Onarım Tamamlandı', color: 'bg-emerald-500', icon: CheckCircle },
    shipped: { label: 'Kargoya Verildi', color: 'bg-teal-500', icon: Package },
    delivered: { label: 'Teslim Edildi', color: 'bg-green-600', icon: CheckCircle },
    cancelled: { label: 'İptal Edildi', color: 'bg-red-500', icon: XCircle },
    // Purchase statuses
    confirmed: { label: 'Ödeme Onaylandı', color: 'bg-green-500', icon: CreditCard },
    preparing: { label: 'Hazırlanıyor', color: 'bg-blue-500', icon: Package },
    active: { label: 'Aktif', color: 'bg-emerald-500', icon: CheckCircle },
    completed: { label: 'Tamamlandı', color: 'bg-green-600', icon: CheckCircle }
};

const AdminPanelPage = () => {
    const [activeTab, setActiveTab] = useState('service');
    const [serviceRequests, setServiceRequests] = useState([]);
    const [rentalRequests, setRentalRequests] = useState([]);
    const [purchaseRequests, setPurchaseRequests] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [statusNote, setStatusNote] = useState('');
    const [priceQuote, setPriceQuote] = useState('');
    const navigate = useNavigate();
    const { toast } = useToast();

    // ✅ API URL eklendi
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

            // Sequential fetch to avoid concurrency issues and for better debugging
            console.log('Fetching stats...');
            const statsRes = await fetch(`${API_URL}/api/admin/stats`, { headers });
            if (!statsRes.ok) throw new Error(statsRes.status === 401 ? 'Auth Error' : 'Stats Failed');
            const statsData = await statsRes.json();

            console.log('Fetching service requests...');
            const serviceRes = await fetch(`${API_URL}/api/admin/service-requests`, { headers });
            if (!serviceRes.ok) throw new Error(serviceRes.status === 401 ? 'Auth Error' : 'Service Failed');
            const serviceData = await serviceRes.json();

            console.log('Fetching rental requests...');
            const rentalRes = await fetch(`${API_URL}/api/admin/rental-requests`, { headers });
            if (!rentalRes.ok) throw new Error(rentalRes.status === 401 ? 'Auth Error' : 'Rental Failed');
            const rentalData = await rentalRes.json();

            console.log('Fetching purchase requests...');
            console.log('Using headers:', headers);
            const purchaseRes = await fetch(`${API_URL}/api/admin/purchase-requests`, { headers });

            if (!purchaseRes.ok) {
                console.error('Purchase fetch failed:', purchaseRes.status, await purchaseRes.text());
                if (purchaseRes.status === 401) throw new Error('Auth Error');
            }

            const purchaseData = purchaseRes.ok ? await purchaseRes.json() : { requests: [] };

            setStats(statsData);
            setServiceRequests(serviceData.requests || []);
            setRentalRequests(rentalData.requests || []);
            setPurchaseRequests(purchaseData.requests || []);

        } catch (error) {
            console.error('Fetch error:', error);
            if (error.message === 'Auth Error' || error.message.includes('401')) {
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

    const handleStatusUpdate = async () => {
        if (!selectedRequest || !newStatus) return;

        try {
            const endpoint = activeTab === 'service'
                ? `${API_URL}/api/admin/service-requests/${selectedRequest.id}/status`
                : `${API_URL}/api/admin/rental-requests/${selectedRequest.id}/status`;

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
            setSelectedRequest(null);
            setNewStatus('');
            setStatusNote('');
            setPriceQuote('');
            fetchData();

        } catch (error) {
            toast({ title: 'Hata', description: error.message, variant: 'destructive' });
        }
    };

    const handleDelete = async (id, type) => {
        if (!confirm('Bu kaydı silmek istediğinize emin misiniz?')) return;

        try {
            let endpoint;
            if (type === 'service') {
                endpoint = `${API_URL}/api/admin/service-requests/${id}`;
            } else if (type === 'rental') {
                endpoint = `${API_URL}/api/admin/rental-requests/${id}`;
            } else {
                endpoint = `${API_URL}/api/admin/purchase-requests/${id}`;
            }

            const response = await fetch(endpoint, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Silme başarısız');

            toast({ title: 'Silindi', description: 'Kayıt başarıyla silindi' });
            fetchData();

        } catch (error) {
            toast({ title: 'Hata', description: error.message, variant: 'destructive' });
        }
    };

    const getRequestsList = () => {
        if (activeTab === 'service') return serviceRequests;
        if (activeTab === 'rental') return rentalRequests;
        return purchaseRequests;
    };

    const filteredRequests = getRequestsList()
        .filter(req => {
            const matchesSearch = searchTerm === '' ||
                req.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                req.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                req.service_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                req.rental_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                req.purchase_id?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'all' || req.status === statusFilter;

            return matchesSearch && matchesStatus;
        });

    const openStatusModal = (request) => {
        setSelectedRequest(request);
        setNewStatus(request.status);
        setStatusNote('');
        setPriceQuote(request.price_quote || '');
        setShowStatusModal(true);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('tr-TR', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            toast({ title: 'Kopyalandı!', description: `${text} panoya kopyalandı.` });
        } catch (err) {
            toast({ title: 'Hata', description: 'Kopyalama başarısız', variant: 'destructive' });
        }
    };

    const handleStatCardClick = (filterType) => {
        setActiveTab('service');
        if (filterType === 'pending') {
            setStatusFilter('pending');
        } else if (filterType === 'in_progress') {
            setStatusFilter('all');
            // Filter manually for in-progress statuses
            const inProgressStatuses = ['contacted', 'received', 'diagnosed', 'quoted', 'approved', 'repairing'];
            setSearchTerm('');
        } else if (filterType === 'completed') {
            setStatusFilter('delivered');
        } else {
            setStatusFilter('all');
        }
    };

    return (
        <>
            <Helmet>
                <title>Admin Panel | VR Tamir Merkezi</title>
            </Helmet>

            <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
                {/* Header */}
                <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-lg border-b border-white/10">
                    <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                                <Wrench className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                                <p className="text-xs text-gray-400">VR Tamir Merkezi</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="sm" onClick={fetchData} className="text-gray-400 hover:text-white">
                                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                Yenile
                            </Button>
                            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                                <LogOut className="w-4 h-4 mr-2" />
                                Çıkış
                            </Button>
                        </div>
                    </div>
                </header>

                <div className="max-w-7xl mx-auto px-4 py-6">
                    {/* Stats Cards */}
                    {stats && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                onClick={() => handleStatCardClick('pending')}
                                className="p-4 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border border-yellow-500/20 cursor-pointer hover:scale-105 hover:border-yellow-500/50 transition-all">
                                <div className="flex items-center gap-3">
                                    <Clock className="w-8 h-8 text-yellow-500" />
                                    <div>
                                        <p className="text-2xl font-bold text-white">{stats.service?.pending || 0}</p>
                                        <p className="text-xs text-yellow-400">Bekleyen Servis</p>
                                    </div>
                                </div>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                                onClick={() => handleStatCardClick('in_progress')}
                                className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20 cursor-pointer hover:scale-105 hover:border-blue-500/50 transition-all">
                                <div className="flex items-center gap-3">
                                    <Wrench className="w-8 h-8 text-blue-500" />
                                    <div>
                                        <p className="text-2xl font-bold text-white">{stats.service?.in_progress || 0}</p>
                                        <p className="text-xs text-blue-400">Devam Eden</p>
                                    </div>
                                </div>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                onClick={() => handleStatCardClick('completed')}
                                className="p-4 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/20 cursor-pointer hover:scale-105 hover:border-green-500/50 transition-all">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-8 h-8 text-green-500" />
                                    <div>
                                        <p className="text-2xl font-bold text-white">{stats.service?.completed || 0}</p>
                                        <p className="text-xs text-green-400">Tamamlanan</p>
                                    </div>
                                </div>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                                onClick={() => handleStatCardClick('all')}
                                className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/20 cursor-pointer hover:scale-105 hover:border-purple-500/50 transition-all">
                                <div className="flex items-center gap-3">
                                    <TrendingUp className="w-8 h-8 text-purple-500" />
                                    <div>
                                        <p className="text-2xl font-bold text-white">{stats.service?.total || 0}</p>
                                        <p className="text-xs text-purple-400">Toplam Servis</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6 flex-wrap">
                        <button
                            onClick={() => setActiveTab('service')}
                            className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'service'
                                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            <Wrench className="w-4 h-4 inline mr-2" />
                            Servis ({serviceRequests.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('purchase')}
                            className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'purchase'
                                ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            <ShoppingBag className="w-4 h-4 inline mr-2" />
                            Satın Alma ({purchaseRequests.length})
                        </button>

                        <button
                            onClick={() => setActiveTab('rental')}
                            className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'rental'
                                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            <Package className="w-4 h-4 inline mr-2" />
                            Kiralama ({rentalRequests.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('purchase')}
                            className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'purchase'
                                ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            <ShoppingBag className="w-4 h-4 inline mr-2" />
                            Satın Alma ({purchaseRequests.length})
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="text"
                                placeholder="İsim, email veya takip no ile ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:border-purple-500 outline-none"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-3 bg-gray-800 border border-white/10 rounded-xl text-white focus:border-purple-500 outline-none appearance-none cursor-pointer"
                            style={{ colorScheme: 'dark' }}
                        >
                            <option value="all" className="bg-gray-800 text-white">Tüm Durumlar</option>
                            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                                <option key={key} value={key} className="bg-gray-800 text-white">{config.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Request List */}
                    {loading ? (
                        <div className="text-center py-20">
                            <RefreshCw className="w-8 h-8 text-purple-500 animate-spin mx-auto mb-4" />
                            <p className="text-gray-400">Yükleniyor...</p>
                        </div>
                    ) : filteredRequests.length === 0 ? (
                        <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                            <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                            <p className="text-gray-400">Kayıt bulunamadı</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredRequests.map((request, index) => {
                                const statusConfig = STATUS_CONFIG[request.status] || STATUS_CONFIG.pending;
                                const StatusIcon = statusConfig.icon;

                                return (
                                    <motion.div
                                        key={request.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="p-4 sm:p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all"
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                            {/* Main Info */}
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <button
                                                        onClick={() => copyToClipboard(request.service_id || request.rental_id || request.purchase_id)}
                                                        className="text-sm font-mono text-purple-400 hover:text-purple-300 flex items-center gap-1 hover:bg-purple-500/10 px-2 py-1 rounded-lg transition-all"
                                                        title="Tıkla ve kopyala"
                                                    >
                                                        {request.service_id || request.rental_id || request.purchase_id}
                                                        <Copy className="w-3 h-3" />
                                                    </button>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${statusConfig.color}`}>
                                                        <StatusIcon className="w-3 h-3 inline mr-1" />
                                                        {statusConfig.label}
                                                    </span>
                                                    {/* Callback Badge */}
                                                    {request.callback_preference && (
                                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 animate-pulse">
                                                            📞 Geri Ara
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="text-lg font-semibold text-white">{request.full_name}</h3>
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                                    <span className="flex items-center gap-1">
                                                        <Mail className="w-4 h-4" />
                                                        {request.email}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Phone className="w-4 h-4" />
                                                        {request.phone}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        {formatDate(request.created_at)}
                                                    </span>
                                                </div>
                                                {/* Service specific info */}
                                                {activeTab === 'service' && (
                                                    <div className="space-y-1">
                                                        <p className="text-sm text-gray-300">
                                                            <strong>Cihaz:</strong> {request.device} | <strong>Arıza:</strong> {request.fault_type}
                                                        </p>
                                                        {request.fault_description && (
                                                            <p className="text-xs text-gray-500 truncate max-w-md" title={request.fault_description}>
                                                                📝 {request.fault_description.substring(0, 80)}{request.fault_description.length > 80 ? '...' : ''}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                                {/* Rental specific info */}
                                                {activeTab === 'rental' && request.company && (
                                                    <p className="text-sm text-gray-300">
                                                        <strong>Firma:</strong> {request.company}
                                                    </p>
                                                )}
                                                {/* Purchase specific info */}
                                                {activeTab === 'purchase' && (
                                                    <div className="flex flex-wrap gap-3 text-sm">
                                                        <span className="text-green-400 font-bold">₺{request.total_price?.toLocaleString('tr-TR')}</span>
                                                        <span className="text-gray-400">{request.delivery_method === 'kargo' ? '📦 Kargo' : '🏢 Elden'}</span>
                                                        {request.receipt_data && (
                                                            <button
                                                                onClick={() => window.open(request.receipt_data, '_blank')}
                                                                className="text-purple-400 hover:text-purple-300 flex items-center gap-1"
                                                            >
                                                                <Image className="w-4 h-4" />
                                                                Dekont
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    onClick={() => openStatusModal(request)}
                                                    className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 hover:text-purple-300"
                                                >
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    Durum Güncelle
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(request.id, activeTab)}
                                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Status Update Modal */}
                <AnimatePresence>
                    {showStatusModal && selectedRequest && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                            onClick={() => setShowStatusModal(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full max-w-lg bg-gray-900 rounded-2xl border border-white/10 p-6 shadow-2xl"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-white">Durum Güncelle</h2>
                                    <button onClick={() => setShowStatusModal(false)} className="text-gray-400 hover:text-white">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                                    {/* Header Info */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-400 mb-1">Takip No</p>
                                            <p className="text-purple-400 font-mono text-lg">{selectedRequest.service_id || selectedRequest.rental_id}</p>
                                        </div>
                                        {selectedRequest.callback_preference && (
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 animate-pulse">
                                                📞 Geri Arama İstedi
                                            </span>
                                        )}
                                    </div>

                                    {/* Customer Info */}
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                        <h4 className="text-sm font-semibold text-white mb-3">👤 Müşteri Bilgileri</h4>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div>
                                                <p className="text-gray-400">Ad Soyad</p>
                                                <p className="text-white font-medium">{selectedRequest.full_name}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400">Telefon</p>
                                                <p className="text-white font-medium">{selectedRequest.phone}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-gray-400">E-posta</p>
                                                <p className="text-white font-medium">{selectedRequest.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Request Details */}
                                    {activeTab === 'service' && (
                                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                            <h4 className="text-sm font-semibold text-white mb-3">🔧 Servis Detayları</h4>
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div>
                                                    <p className="text-gray-400">Cihaz</p>
                                                    <p className="text-white font-medium">{selectedRequest.device}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400">Arıza Tipi</p>
                                                    <p className="text-white font-medium">{selectedRequest.fault_type}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400">Teslim Yöntemi</p>
                                                    <p className="text-white font-medium">
                                                        {selectedRequest.delivery_method === 'kargo' ? '📦 Kargo' : '🏢 Elden Teslim'}
                                                    </p>
                                                </div>
                                                {selectedRequest.price_quote && (
                                                    <div>
                                                        <p className="text-gray-400">Mevcut Teklif</p>
                                                        <p className="text-orange-400 font-bold">₺{selectedRequest.price_quote.toLocaleString('tr-TR')}</p>
                                                    </div>
                                                )}
                                            </div>
                                            {selectedRequest.fault_description && (
                                                <div className="mt-3 pt-3 border-t border-white/10">
                                                    <p className="text-gray-400 text-sm mb-1">📝 Müşteri Arıza Açıklaması</p>
                                                    <p className="text-gray-200 text-sm bg-gray-800/50 p-3 rounded-lg">{selectedRequest.fault_description}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Rental Details */}
                                    {activeTab === 'rental' && selectedRequest.company && (
                                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                            <h4 className="text-sm font-semibold text-white mb-3">🏢 Kiralama Detayları</h4>
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div>
                                                    <p className="text-gray-400">Firma</p>
                                                    <p className="text-white font-medium">{selectedRequest.company}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400">Ürün</p>
                                                    <p className="text-white font-medium">{selectedRequest.product_name || '-'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400">Adet</p>
                                                    <p className="text-white font-medium">{selectedRequest.quantity || '-'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400">Süre</p>
                                                    <p className="text-white font-medium">{selectedRequest.duration ? `${selectedRequest.duration} Gün` : '-'}</p>
                                                </div>
                                            </div>
                                            {selectedRequest.message && (
                                                <div className="mt-3 pt-3 border-t border-white/10">
                                                    <p className="text-gray-400 text-sm mb-1">📝 Müşteri Mesajı</p>
                                                    <p className="text-gray-200 text-sm bg-gray-800/50 p-3 rounded-lg">{selectedRequest.message}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Existing Admin Notes */}
                                    {selectedRequest.admin_notes && (
                                        <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                                            <p className="text-purple-400 text-sm font-medium mb-1">💬 Mevcut Admin Notu</p>
                                            <p className="text-gray-200 text-sm">{selectedRequest.admin_notes}</p>
                                        </div>
                                    )}

                                    {/* Status Update Section */}
                                    <div className="pt-4 border-t border-white/10">
                                        <h4 className="text-sm font-semibold text-white mb-3">🔄 Durum Güncelle</h4>

                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-sm text-gray-400 block mb-2">Yeni Durum</label>
                                                <select
                                                    value={newStatus}
                                                    onChange={(e) => setNewStatus(e.target.value)}
                                                    className="w-full px-4 py-3 bg-gray-800 border border-white/10 rounded-xl text-white focus:border-purple-500 outline-none"
                                                    style={{ colorScheme: 'dark' }}
                                                >
                                                    {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                                                        <option key={key} value={key} className="bg-gray-800 text-white">{config.label}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            {activeTab === 'service' && newStatus === 'quoted' && (
                                                <div>
                                                    <label className="text-sm text-gray-400 block mb-2">Fiyat Teklifi (₺)</label>
                                                    <input
                                                        type="number"
                                                        value={priceQuote}
                                                        onChange={(e) => setPriceQuote(e.target.value)}
                                                        placeholder="0.00"
                                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-purple-500 outline-none"
                                                    />
                                                </div>
                                            )}

                                            <div>
                                                <label className="text-sm text-gray-400 block mb-2">Not Ekle (Müşteri görebilir)</label>
                                                <textarea
                                                    value={statusNote}
                                                    onChange={(e) => setStatusNote(e.target.value)}
                                                    placeholder="Durum değişikliği hakkında not..."
                                                    rows={3}
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-purple-500 outline-none resize-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4">
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
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

export default AdminPanelPage;