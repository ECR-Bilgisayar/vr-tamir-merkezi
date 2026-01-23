import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Trash2, Download, LogOut, RefreshCw, ChevronDown,
    Wrench, Package, Clock, CheckCircle, XCircle, Phone, Mail,
    AlertCircle, TrendingUp, Users, Calendar, Eye, X, MessageSquare, Copy,
    ShoppingBag, Image, CreditCard, FileText, ExternalLink, Truck, Building,
    User, MapPin, Receipt, Filter, MoreVertical, Edit2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const STATUS_CONFIG = {
    pending: { label: 'Yeni Talep', color: 'bg-yellow-500', textColor: 'text-yellow-500', icon: Clock },
    contacted: { label: 'Iletisime Gecildi', color: 'bg-blue-500', textColor: 'text-blue-500', icon: Phone },
    received: { label: 'Cihaz Teslim Alindi', color: 'bg-indigo-500', textColor: 'text-indigo-500', icon: Package },
    diagnosed: { label: 'Ariza Tespiti', color: 'bg-purple-500', textColor: 'text-purple-500', icon: Search },
    quoted: { label: 'Fiyat Teklifi', color: 'bg-orange-500', textColor: 'text-orange-500', icon: MessageSquare },
    approved: { label: 'Onaylandi', color: 'bg-cyan-500', textColor: 'text-cyan-500', icon: CheckCircle },
    repairing: { label: 'Onarim Surecinde', color: 'bg-pink-500', textColor: 'text-pink-500', icon: Wrench },
    repaired: { label: 'Onarim Tamamlandi', color: 'bg-emerald-500', textColor: 'text-emerald-500', icon: CheckCircle },
    shipped: { label: 'Kargoya Verildi', color: 'bg-teal-500', textColor: 'text-teal-500', icon: Truck },
    delivered: { label: 'Teslim Edildi', color: 'bg-green-600', textColor: 'text-green-600', icon: CheckCircle },
    cancelled: { label: 'Iptal Edildi', color: 'bg-red-500', textColor: 'text-red-500', icon: XCircle },
    confirmed: { label: 'Odeme Onaylandi', color: 'bg-green-500', textColor: 'text-green-500', icon: CreditCard },
    preparing: { label: 'Hazirlaniyor', color: 'bg-blue-500', textColor: 'text-blue-500', icon: Package },
    active: { label: 'Aktif', color: 'bg-emerald-500', textColor: 'text-emerald-500', icon: CheckCircle },
    completed: { label: 'Tamamlandi', color: 'bg-green-600', textColor: 'text-green-600', icon: CheckCircle }
};

const PURCHASE_STATUSES = ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled'];
const SERVICE_STATUSES = ['pending', 'contacted', 'received', 'diagnosed', 'quoted', 'approved', 'repairing', 'repaired', 'shipped', 'delivered', 'cancelled'];
const RENTAL_STATUSES = ['pending', 'contacted', 'quoted', 'approved', 'active', 'completed', 'cancelled'];

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
            toast({ title: 'Hata', description: 'Dekont yuklenemedi', variant: 'destructive' });
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

            if (!response.ok) throw new Error('Guncelleme basarisiz');

            toast({ title: 'Basarili', description: 'Durum guncellendi' });
            setShowStatusModal(false);
            fetchData();

        } catch (error) {
            toast({ title: 'Hata', description: error.message, variant: 'destructive' });
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Bu kaydi silmek istediginizden emin misiniz?')) return;

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

            toast({ title: 'Silindi', description: 'Kayit basariyla silindi' });
            fetchData();

        } catch (error) {
            toast({ title: 'Hata', description: 'Silme basarisiz', variant: 'destructive' });
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast({ title: 'Kopyalandi', description: text });
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
                    <p className="text-gray-400">Yukleniyor...</p>
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
                                    Cikis
                                </Button>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="max-w-7xl mx-auto px-4 py-6">
                    {/* Stats Cards */}
                    {stats && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="p-4 bg-gradient-to-br from-yellow-500/20 to-orange-500/10 rounded-xl border border-yellow-500/20">
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
                            <div className="p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 rounded-xl border border-blue-500/20">
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
                            <div className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/10 rounded-xl border border-purple-500/20">
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
                            <div className="p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/10 rounded-xl border border-green-500/20">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-500/20 rounded-lg">
                                        <ShoppingBag className="w-5 h-5 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">{purchaseRequests.length}</p>
                                        <p className="text-sm text-gray-400">Siparis</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-xl w-fit">
                        {[
                            { id: 'purchase', label: 'Siparisler', icon: ShoppingBag, count: purchaseRequests.length },
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
                            <option value="all">Tum Durumlar</option>
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
                                        <th className="text-left p-4 text-gray-400 font-medium">Musteri</th>
                                        <th className="text-left p-4 text-gray-400 font-medium">Durum</th>
                                        {activeTab === 'purchase' && (
                                            <th className="text-left p-4 text-gray-400 font-medium">Tutar</th>
                                        )}
                                        <th className="text-left p-4 text-gray-400 font-medium">Tarih</th>
                                        <th className="text-right p-4 text-gray-400 font-medium">Islemler</th>
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
                                    <p className="text-gray-500">Kayit bulunamadi</p>
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
                                            <User className="w-4 h-4" /> Musteri Bilgileri
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

                                    {/* Purchase Specific */}
                                    {activeTab === 'purchase' && (
                                        <>
                                            {/* Invoice Info */}
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
                                                                <p className="text-gray-500 text-sm">Firma Adi</p>
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

                                            {/* Order Info */}
                                            <div className="p-4 bg-white/5 rounded-xl">
                                                <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                                                    <ShoppingBag className="w-4 h-4" /> Siparis Detaylari
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
                                                        <p className="text-gray-500 text-sm">Urun Tutari</p>
                                                        <p className="text-white">{formatPrice(selectedRequest.product_price)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500 text-sm">Kargo Ucreti</p>
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
                                                    <div className="space-y-3">
                                                        <img
                                                            src={receiptUrl}
                                                            alt="Dekont"
                                                            className="max-h-64 rounded-lg mx-auto border border-white/10"
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                            }}
                                                        />
                                                        <a
                                                            href={receiptUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                            Tam Boyut Goruntule
                                                        </a>
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-500 text-center py-4">Dekont bulunamadi</p>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    {/* Service Specific */}
                                    {activeTab === 'service' && (
                                        <div className="p-4 bg-white/5 rounded-xl">
                                            <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                                                <Wrench className="w-4 h-4" /> Servis Detaylari
                                            </h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-gray-500 text-sm">Cihaz</p>
                                                    <p className="text-white font-medium">{selectedRequest.device}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-sm">Ariza Tipi</p>
                                                    <p className="text-white">{selectedRequest.fault_type}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-sm">Teslimat</p>
                                                    <p className="text-white">
                                                        {selectedRequest.delivery_method === 'kargo' ? 'Kargo' : 'Elden Teslim'}
                                                    </p>
                                                </div>
                                                {selectedRequest.price_quote && (
                                                    <div>
                                                        <p className="text-gray-500 text-sm">Fiyat Teklifi</p>
                                                        <p className="text-orange-400 font-bold">{formatPrice(selectedRequest.price_quote)}</p>
                                                    </div>
                                                )}
                                            </div>
                                            {selectedRequest.fault_description && (
                                                <div className="mt-4 pt-4 border-t border-white/10">
                                                    <p className="text-gray-500 text-sm">Ariza Aciklamasi</p>
                                                    <p className="text-white mt-1">{selectedRequest.fault_description}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Rental Specific */}
                                    {activeTab === 'rental' && (
                                        <div className="p-4 bg-white/5 rounded-xl">
                                            <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                                                <Package className="w-4 h-4" /> Kiralama Detaylari
                                            </h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-gray-500 text-sm">Urun</p>
                                                    <p className="text-white font-medium">{selectedRequest.product_name || '-'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-sm">Adet</p>
                                                    <p className="text-white">{selectedRequest.quantity || '-'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-sm">Sure</p>
                                                    <p className="text-white">{selectedRequest.duration || '-'}</p>
                                                </div>
                                            </div>
                                            {selectedRequest.message && (
                                                <div className="mt-4 pt-4 border-t border-white/10">
                                                    <p className="text-gray-500 text-sm">Mesaj</p>
                                                    <p className="text-white mt-1">{selectedRequest.message}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Admin Notes */}
                                    {selectedRequest.admin_notes && (
                                        <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                                            <p className="text-purple-400 text-sm font-medium mb-1">Admin Notu</p>
                                            <p className="text-gray-200">{selectedRequest.admin_notes}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 border-t border-white/10 flex gap-3">
                                    <Button
                                        variant="ghost"
                                        onClick={() => setShowDetailModal(false)}
                                        className="flex-1 bg-white/5 hover:bg-white/10 text-white"
                                    >
                                        Kapat
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setShowDetailModal(false);
                                            openStatusModal(selectedRequest);
                                        }}
                                        className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                                    >
                                        Durum Guncelle
                                    </Button>
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
                                    <h2 className="text-xl font-bold text-white">Durum Guncelle</h2>
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
                                                placeholder="0.00"
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-purple-500 outline-none"
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <label className="text-sm text-gray-400 block mb-2">Not (Opsiyonel)</label>
                                        <textarea
                                            value={statusNote}
                                            onChange={(e) => setStatusNote(e.target.value)}
                                            placeholder="Durum degisikligi hakkinda not..."
                                            rows={3}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-purple-500 outline-none resize-none"
                                        />
                                    </div>
                                </div>

                                <div className="p-6 border-t border-white/10 flex gap-3">
                                    <Button
                                        variant="ghost"
                                        onClick={() => setShowStatusModal(false)}
                                        className="flex-1 bg-white/5 hover:bg-white/10 text-white"
                                    >
                                        Iptal
                                    </Button>
                                    <Button
                                        onClick={handleStatusUpdate}
                                        className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                                    >
                                        Guncelle
                                    </Button>
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