import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  MapPin, 
  CreditCard, 
  Upload, 
  CheckCircle, 
  Plus, 
  Minus, 
  Trash2,
  ArrowLeft,
  ArrowRight,
  Copy,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useLocation, useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [copied, setCopied] = useState(false);
  const [orderId, setOrderId] = useState(null);
  
  // Sepet state
  const [cartItems, setCartItems] = useState([]);
  
  // Adres state
  const [addressData, setAddressData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    postalCode: '',
    invoiceType: 'personal', // personal veya corporate
    companyName: '',
    taxNumber: '',
    taxOffice: ''
  });
  
  // Dekont state
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);

  // URL'den gelen ürünü sepete ekle
  useEffect(() => {
    if (location.state?.product) {
      const product = location.state.product;
      setCartItems([{
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image
      }]);
    }
  }, [location.state]);

  const steps = [
    { id: 1, name: 'Sepet', icon: ShoppingCart },
    { id: 2, name: 'Adres', icon: MapPin },
    { id: 3, name: 'Ödeme', icon: CreditCard },
    { id: 4, name: 'Dekont', icon: Upload },
    { id: 5, name: 'Onay', icon: CheckCircle }
  ];

  // Sepet işlemleri
  const updateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const kdv = subtotal * 0.20; // %20 KDV dahil olduğu için hesaplama farklı
  const total = subtotal; // Fiyat zaten KDV dahil

  // Adres form handler
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressData(prev => ({ ...prev, [name]: value }));
  };

  // Dekont yükleme
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // IBAN kopyalama
  const copyIban = () => {
    navigator.clipboard.writeText('TR00 0000 0000 0000 0000 0000 00');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "IBAN Kopyalandı",
      description: "IBAN numarası panoya kopyalandı.",
    });
  };

  // Sipariş tamamla
  const completeOrder = () => {
    const newOrderId = `ORD-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
    
    const orderData = {
      id: newOrderId,
      items: cartItems,
      address: addressData,
      total: total,
      receiptUploaded: !!receiptFile,
      status: 'pending_confirmation',
      createdAt: new Date().toISOString()
    };

    // LocalStorage'a kaydet
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    localStorage.setItem('orders', JSON.stringify([...existingOrders, orderData]));

    setOrderId(newOrderId);
    setCurrentStep(5);

    toast({
      title: "Sipariş Oluşturuldu! 🎉",
      description: `Sipariş numaranız: ${newOrderId}`,
    });
  };

  // Adım validasyonu
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return cartItems.length > 0;
      case 2:
        return addressData.fullName && addressData.email && addressData.phone && 
               addressData.address && addressData.city && addressData.district;
      case 3:
        return true; // Ödeme bilgisi gösterildi
      case 4:
        return receiptFile !== null;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (canProceed()) {
      if (currentStep === 4) {
        completeOrder();
      } else {
        setCurrentStep(prev => Math.min(prev + 1, 5));
      }
    } else {
      toast({
        title: "Eksik Bilgi",
        description: "Lütfen tüm gerekli alanları doldurun.",
        variant: "destructive"
      });
    }
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  // Sepet boşsa
  if (cartItems.length === 0 && currentStep === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-[#0a0e27] dark:via-black dark:to-[#0a0e27] py-20 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Sepetiniz Boş</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Henüz sepetinize ürün eklemediniz.</p>
          <Button onClick={() => navigate('/urunler')} className="bg-purple-600 hover:bg-purple-700 text-white">
            Ürünlere Dön
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Sipariş - VR Tamir Merkezi</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-[#0a0e27] dark:via-black dark:to-[#0a0e27] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Stepper */}
          {currentStep < 5 && (
            <div className="mb-12">
              <div className="flex items-center justify-between">
                {steps.slice(0, 4).map((step, index) => (
                  <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        currentStep >= step.id 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400'
                      }`}>
                        <step.icon className="w-5 h-5" />
                      </div>
                      <span className={`mt-2 text-sm font-medium ${
                        currentStep >= step.id 
                          ? 'text-purple-600 dark:text-purple-400' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {step.name}
                      </span>
                    </div>
                    {index < 3 && (
                      <div className={`flex-1 h-1 mx-4 rounded ${
                        currentStep > step.id 
                          ? 'bg-purple-600' 
                          : 'bg-gray-200 dark:bg-white/10'
                      }`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {/* Step Content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-[#0d1229] border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none rounded-2xl p-8"
          >
            {/* Step 1: Sepet */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Sepetim</h2>
                
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-contain rounded-lg bg-white dark:bg-white/10 p-2" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                      <p className="text-purple-600 dark:text-purple-400 font-bold">{item.price.toLocaleString('tr-TR')} ₺</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-white/10 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-white/20 transition-colors"
                      >
                        <Minus className="w-4 h-4 text-gray-700 dark:text-white" />
                      </button>
                      <span className="w-8 text-center font-semibold text-gray-900 dark:text-white">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-white/10 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-white/20 transition-colors"
                      >
                        <Plus className="w-4 h-4 text-gray-700 dark:text-white" />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}

                {/* Toplam */}
                <div className="border-t border-gray-200 dark:border-white/10 pt-6 space-y-3">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Ara Toplam</span>
                    <span>{(total / 1.20).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>KDV (%20)</span>
                    <span>{(total - total / 1.20).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white pt-3 border-t border-gray-200 dark:border-white/10">
                    <span>Toplam (KDV Dahil)</span>
                    <span className="text-purple-600 dark:text-purple-400">{total.toLocaleString('tr-TR')} ₺</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Adres */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Fatura & Teslimat Bilgileri</h2>
                
                {/* Fatura Tipi */}
                <div className="flex gap-4 mb-6">
                  <button
                    onClick={() => setAddressData(prev => ({ ...prev, invoiceType: 'personal' }))}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                      addressData.invoiceType === 'personal'
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-500/10'
                        : 'border-gray-200 dark:border-white/10 hover:border-purple-300'
                    }`}
                  >
                    <span className={`font-semibold ${addressData.invoiceType === 'personal' ? 'text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300'}`}>
                      Bireysel Fatura
                    </span>
                  </button>
                  <button
                    onClick={() => setAddressData(prev => ({ ...prev, invoiceType: 'corporate' }))}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                      addressData.invoiceType === 'corporate'
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-500/10'
                        : 'border-gray-200 dark:border-white/10 hover:border-purple-300'
                    }`}
                  >
                    <span className={`font-semibold ${addressData.invoiceType === 'corporate' ? 'text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300'}`}>
                      Kurumsal Fatura
                    </span>
                  </button>
                </div>

                {/* Kurumsal Fatura Alanları */}
                {addressData.invoiceType === 'corporate' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-xl mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Firma Adı *</label>
                      <input
                        type="text"
                        name="companyName"
                        value={addressData.companyName}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Vergi Numarası *</label>
                      <input
                        type="text"
                        name="taxNumber"
                        value={addressData.taxNumber}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Vergi Dairesi *</label>
                      <input
                        type="text"
                        name="taxOffice"
                        value={addressData.taxOffice}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ad Soyad *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={addressData.fullName}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Adınız Soyadınız"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">E-posta *</label>
                    <input
                      type="email"
                      name="email"
                      value={addressData.email}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="ornek@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Telefon *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={addressData.phone}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="05XX XXX XX XX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Posta Kodu</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={addressData.postalCode}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="34000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">İl *</label>
                    <input
                      type="text"
                      name="city"
                      value={addressData.city}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="İstanbul"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">İlçe *</label>
                    <input
                      type="text"
                      name="district"
                      value={addressData.district}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Kadıköy"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Adres *</label>
                  <textarea
                    name="address"
                    value={addressData.address}
                    onChange={handleAddressChange}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="Mahalle, Sokak, Bina No, Daire No"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Ödeme */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Ödeme Bilgileri</h2>
                
                <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-500/10 dark:to-blue-500/10 rounded-2xl border border-purple-200 dark:border-purple-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <CreditCard className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Havale / EFT ile Ödeme</h3>
                  </div>
                  
                  <div className="bg-white dark:bg-black/20 rounded-xl p-6 space-y-4">
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Hesap Sahibi</span>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">Emre Cansever</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Banka</span>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">Örnek Banka</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">IBAN</span>
                      <div className="flex items-center gap-3">
                        <p className="text-lg font-mono font-semibold text-gray-900 dark:text-white">TR00 0000 0000 0000 0000 0000 00</p>
                        <button
                          onClick={copyIban}
                          className="p-2 rounded-lg bg-purple-100 dark:bg-purple-500/20 hover:bg-purple-200 dark:hover:bg-purple-500/30 transition-colors"
                        >
                          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                        </button>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-200 dark:border-white/10">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Ödenecek Tutar</span>
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{total.toLocaleString('tr-TR')} ₺</p>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-500/10 rounded-xl border border-yellow-200 dark:border-yellow-500/20">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      ⚠️ Lütfen açıklama kısmına <strong>ad soyadınızı</strong> yazmayı unutmayın.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Dekont */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dekont Yükleme</h2>
                
                <div className="text-center">
                  <label className="cursor-pointer">
                    <div className={`border-2 border-dashed rounded-2xl p-12 transition-all ${
                      receiptPreview 
                        ? 'border-green-500 bg-green-50 dark:bg-green-500/10' 
                        : 'border-gray-300 dark:border-white/20 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-500/10'
                    }`}>
                      {receiptPreview ? (
                        <div className="space-y-4">
                          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center mx-auto">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                          </div>
                          <p className="text-green-600 dark:text-green-400 font-semibold">Dekont Yüklendi!</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{receiptFile?.name}</p>
                          {receiptPreview && (
                            <img src={receiptPreview} alt="Dekont" className="max-w-xs mx-auto rounded-lg shadow-lg" />
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Upload className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto" />
                          <div>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">Dekontunuzu Yükleyin</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">PNG, JPG veya PDF (max 5MB)</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Step 5: Onay */}
            {currentStep === 5 && (
              <div className="text-center space-y-6 py-8">
                <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Siparişiniz Alındı!</h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  Ödemeniz onaylandıktan sonra siparişiniz hazırlanacak ve kargoya verilecektir.
                </p>
                
                <div className="inline-block bg-gray-100 dark:bg-white/5 rounded-2xl p-6">
                  <span className="text-sm text-gray-500 dark:text-gray-400 block mb-2">Sipariş Numaranız</span>
                  <span className="text-2xl font-mono font-bold text-purple-600 dark:text-purple-400">{orderId}</span>
                </div>

                <div className="pt-6">
                  <Button onClick={() => navigate('/')} className="bg-purple-600 hover:bg-purple-700 text-white px-8">
                    Ana Sayfaya Dön
                  </Button>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {currentStep < 5 && (
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-white/10">
                {currentStep > 1 ? (
                  <Button variant="outline" onClick={prevStep} className="text-gray-700 dark:text-white border-gray-300 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/5">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Geri
                  </Button>
                ) : (
                  <div />
                )}
                <Button onClick={nextStep} className="bg-purple-600 hover:bg-purple-700 text-white">
                  {currentStep === 4 ? 'Siparişi Tamamla' : 'Devam Et'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;