import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Wrench, ArrowRight, ArrowLeft, CheckCircle, Truck, MapPin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import SectionHeading from '@/components/SectionHeading';
import StepProcess from '@/components/StepProcess';
import { useToast } from '@/components/ui/use-toast';

const formSchema = z.object({
  fullName: z.string().min(2, 'Ad Soyad en az 2 karakter olmalıdır'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  phone: z.string().min(10, 'Geçerli bir telefon numarası giriniz'),
  faultDescription: z.string().min(20, 'Arıza açıklaması en az 20 karakter olmalıdır'),
  callbackPreference: z.boolean().default(false)
});

const ServisPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    device: '',
    customDevice: '',
    faultType: '',
    deliveryMethod: ''
  });
  const [serviceId, setServiceId] = useState(null);
  const [submittedData, setSubmittedData] = useState(null);
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors }, reset, getValues } = useForm({
    resolver: zodResolver(formSchema)
  });

  const devices = [
    'Meta Quest 3',
    'Meta Quest Go',
    'Meta Quest 3S',
    'Meta Quest 2',
    'HTC Vive Pro',
    'HTC Vive',
    'Diğer'
  ];

  const faultTypes = [
    'Cihaz Açılmıyor',
    'Görüntü/Lens Sorunu',
    'Sensör/Takip Hatası',
    'Ses Sorunu',
    'Pil/Şarj Problemi',
    'Kontrol Cihazı Arızası',
    'Bağlantı Sorunu',
    'Yazılım Problemi',
    'Fiziksel Hasar',
    'Diğer'
  ];

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleDeviceSelect = (device) => {
    if (device === 'Diğer') {
      setFormData(prev => ({ ...prev, device: 'Diğer', customDevice: '' }));
    } else {
      setFormData(prev => ({ ...prev, device, customDevice: '' }));
      nextStep();
    }
  };

  const handleCustomDeviceSubmit = () => {
    if (formData.customDevice.trim().length >= 2) {
      nextStep();
    }
  };

  const handleFaultSelect = (fault) => {
    setFormData(prev => ({ ...prev, faultType: fault }));
    nextStep();
  };

  const handleDeliverySelect = (method) => {
    setFormData(prev => ({ ...prev, deliveryMethod: method }));
    nextStep();
  };

  const onFormSubmit = (data) => {
    setSubmittedData(data);
    nextStep();
  };

  const handleFinalSubmit = async () => {
    try {
      const requestData = {
        fullName: submittedData.fullName,
        email: submittedData.email,
        phone: submittedData.phone,
        device: formData.device,
        customDevice: formData.customDevice,
        faultType: formData.faultType,
        faultDescription: submittedData.faultDescription,
        deliveryMethod: formData.deliveryMethod,
        callbackPreference: submittedData.callbackPreference || false
      };

      const API_URL = import.meta.env.VITE_API_URL || '';
      // ✅ DÜZELTİLDİ: /api/ fazladan eklenmemeli
      const response = await fetch(`${API_URL}/service-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Bir hata oluştu');
      }

      setServiceId(result.data.serviceId);

      toast({
        title: "Talep Oluşturuldu! 🛠️",
        description: `Servis talebiniz alındı. Takip No: ${result.data.serviceId}`,
      });

    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "Hata!",
        description: error.message || "Talep oluşturulamadı. Lütfen tekrar deneyin.",
        variant: "destructive"
      });
    }
  };

  const getDeviceName = () => {
    return formData.device === 'Diğer' ? formData.customDevice : formData.device;
  };

  // Başarı Ekranı
  if (serviceId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-[#0a0e27] dark:via-black dark:to-[#0a0e27] py-20 flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white dark:bg-[#0d1229] border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none rounded-3xl p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-500/20 text-green-500 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Talep Başarılı!</h2>
            <p className="text-gray-600 dark:text-gray-400">Servis talebiniz başarıyla oluşturuldu.</p>
          </div>

          <div className="bg-gray-100 dark:bg-black/30 p-4 rounded-xl mb-6 text-center">
            <span className="text-sm text-gray-500 dark:text-gray-500 block mb-1">Takip Numaranız</span>
            <span className="text-2xl font-mono font-bold text-purple-600 dark:text-purple-400">{serviceId}</span>
          </div>

          {/* Talep Detayları */}
          <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-xl space-y-4 border border-gray-200 dark:border-white/10 mb-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Talep Detayları</h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400 block">Ad Soyad</span>
                <span className="text-gray-900 dark:text-white font-medium">{submittedData?.fullName}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 block">Telefon</span>
                <span className="text-gray-900 dark:text-white font-medium">{submittedData?.phone}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500 dark:text-gray-400 block">E-posta</span>
                <span className="text-gray-900 dark:text-white font-medium">{submittedData?.email}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-white/10 pt-4 mt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Cihaz:</span>
                <span className="text-gray-900 dark:text-white font-semibold">{getDeviceName()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Arıza Tipi:</span>
                <span className="text-gray-900 dark:text-white font-semibold">{formData.faultType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Teslimat:</span>
                <span className="text-gray-900 dark:text-white font-semibold">
                  {formData.deliveryMethod === 'kargo' ? 'Kargo ile Gönderim' : 'Elden Teslim'}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-white/10 pt-4 mt-4">
              <span className="text-gray-500 dark:text-gray-400 block mb-2">Arıza Açıklaması:</span>
              <p className="text-gray-900 dark:text-white text-sm bg-white dark:bg-black/20 p-3 rounded-lg">
                {submittedData?.faultDescription}
              </p>
            </div>
          </div>

          {formData.deliveryMethod === 'elden' && (
            <div className="bg-blue-50 dark:bg-blue-500/10 p-4 rounded-xl mb-6 border border-blue-200 dark:border-blue-500/20">
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 flex items-center mb-2">
                <MapPin className="w-4 h-4 mr-2" /> Teslimat Noktası
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">İstoç, 32. Ada No:76-78, Bağcılar, İstanbul</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">09:00 - 18:00 (Hafta içi)</p>
            </div>
          )}

          {formData.deliveryMethod === 'kargo' && (
            <div className="bg-amber-50 dark:bg-amber-500/10 p-4 rounded-xl mb-6 border border-amber-200 dark:border-amber-500/20">
              <h4 className="font-semibold text-amber-800 dark:text-amber-300 flex items-center mb-2">
                <Truck className="w-4 h-4 mr-2" /> Kargo Bilgileri
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300">Kargo adresimiz e-posta ile tarafınıza iletilecektir.</p>
              <p className="text-sm text-amber-600 dark:text-amber-400">Kargo ücretleri alıcı ödemeli gönderilmelidir.</p>
            </div>
          )}

          <Button onClick={() => window.location.href = '/'} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            Ana Sayfaya Dön
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Servis & Onarım - VR Tamir Merkezi</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-[#0a0e27] dark:via-black dark:to-[#0a0e27] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="VR Onarım & Bakım"
            description="Cihazınızdaki sorunu belirtin, hemen çözelim"
          />

          <StepProcess steps={['Cihaz', 'Arıza', 'Bilgiler', 'Teslimat', 'Onay']} currentStep={currentStep} />

          <div className="mt-8 bg-white dark:bg-[#0d1229] border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none rounded-2xl p-8 min-h-[400px]">

            {/* Step 1: Cihaz Seçimi */}
            {currentStep === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">Hangi cihaz için servis istiyorsunuz?</h3>

                {formData.device !== 'Diğer' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {devices.map(device => (
                      <button
                        key={device}
                        onClick={() => handleDeviceSelect(device)}
                        className={`p-4 rounded-xl border transition-all text-left font-semibold flex justify-between items-center group ${formData.device === device
                          ? 'bg-purple-100 dark:bg-purple-500/20 border-purple-500 text-purple-700 dark:text-purple-300'
                          : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-500/10 text-gray-900 dark:text-white'
                          }`}
                      >
                        {device}
                        <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-purple-500 dark:text-purple-400" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="max-w-md mx-auto space-y-4">
                    <div>
                      <Label className="text-gray-900 dark:text-white mb-2 block">Cihaz Model Adı *</Label>
                      <input
                        type="text"
                        value={formData.customDevice}
                        onChange={(e) => setFormData(prev => ({ ...prev, customDevice: e.target.value }))}
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-black/20 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white focus:border-purple-500 outline-none placeholder:text-gray-500"
                        placeholder="Örn: Pico 4, Valve Index..."
                      />
                    </div>
                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        onClick={() => setFormData(prev => ({ ...prev, device: '', customDevice: '' }))}
                        className="flex-1 text-gray-700 dark:text-white border-gray-300 dark:border-white/20"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Geri
                      </Button>
                      <Button
                        onClick={handleCustomDeviceSubmit}
                        disabled={formData.customDevice.trim().length < 2}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
                      >
                        Devam Et <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 2: Arıza Tipi */}
            {currentStep === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">Arıza türü nedir?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {faultTypes.map(fault => (
                    <button
                      key={fault}
                      onClick={() => handleFaultSelect(fault)}
                      className="p-5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-500/10 transition-all text-left text-gray-900 dark:text-white font-semibold flex justify-between items-center group"
                    >
                      {fault}
                      <Wrench className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-purple-500 dark:group-hover:text-purple-400" />
                    </button>
                  ))}
                </div>
                <div className="flex justify-center mt-6">
                  <Button variant="outline" onClick={prevStep} className="text-gray-700 dark:text-white border-gray-300 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/5">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Geri Dön
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: İletişim Bilgileri ve Arıza Detayı */}
            {currentStep === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">İletişim Bilgileri</h3>

                {/* Seçilen Cihaz ve Arıza */}
                <div className="bg-purple-50 dark:bg-purple-500/10 p-4 rounded-xl border border-purple-200 dark:border-purple-500/20 mb-6">
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div>
                      <span className="text-purple-600 dark:text-purple-400">Cihaz:</span>
                      <span className="ml-2 font-semibold text-purple-800 dark:text-purple-300">{getDeviceName()}</span>
                    </div>
                    <div>
                      <span className="text-purple-600 dark:text-purple-400">Arıza:</span>
                      <span className="ml-2 font-semibold text-purple-800 dark:text-purple-300">{formData.faultType}</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="fullName" className="text-gray-900 dark:text-white mb-2 block">Ad Soyad *</Label>
                      <input
                        id="fullName"
                        {...register('fullName')}
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-black/20 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white focus:border-purple-500 outline-none placeholder:text-gray-500"
                        placeholder="Adınız Soyadınız"
                      />
                      {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-gray-900 dark:text-white mb-2 block">Telefon *</Label>
                      <input
                        id="phone"
                        {...register('phone')}
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-black/20 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white focus:border-purple-500 outline-none placeholder:text-gray-500"
                        placeholder="0555 555 55 55"
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-gray-900 dark:text-white mb-2 block">E-posta *</Label>
                    <input
                      id="email"
                      type="email"
                      {...register('email')}
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-black/20 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white focus:border-purple-500 outline-none placeholder:text-gray-500"
                      placeholder="ornek@email.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="faultDescription" className="text-gray-900 dark:text-white mb-2 block">Arıza Detayı *</Label>
                    <textarea
                      id="faultDescription"
                      {...register('faultDescription')}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-black/20 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white focus:border-purple-500 outline-none resize-none placeholder:text-gray-500"
                      placeholder="Cihazınızdaki arızayı detaylı bir şekilde açıklayınız. Ne zaman başladı? Hangi durumlarda oluşuyor?"
                    />
                    {errors.faultDescription && <p className="text-red-500 text-sm mt-1">{errors.faultDescription.message}</p>}
                  </div>

                  {/* E-posta Bilgilendirme */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      <p className="text-blue-700 dark:text-blue-300 text-sm">
                        E-posta ile tarafınıza dönüş yapılacaktır. Lütfen e-postanızı kontrol etmeyi unutmayınız.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="callbackPreference"
                      {...register('callbackPreference')}
                      className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <Label htmlFor="callbackPreference" className="text-gray-700 dark:text-white">
                      Beni telefonla arayarak bilgilendirin
                    </Label>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="flex-1 text-gray-700 dark:text-white border-gray-300 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/5"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> Geri
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Devam Et <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Step 4: Teslimat Yöntemi */}
            {currentStep === 4 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">Teslimat Yöntemi</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button
                    onClick={() => handleDeliverySelect('kargo')}
                    className="p-8 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-500/10 transition-all text-center group"
                  >
                    <Truck className="w-12 h-12 text-blue-500 dark:text-blue-400 mx-auto mb-4" />
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Kargo ile Gönderim</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Kargo ücretleri müşteri tarafından karşılanacaktır.</p>
                  </button>

                  <button
                    onClick={() => handleDeliverySelect('elden')}
                    className="p-8 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-500/10 transition-all text-center group"
                  >
                    <MapPin className="w-12 h-12 text-green-500 dark:text-green-400 mx-auto mb-4" />
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Elden Teslim</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Ofisimize gelerek cihazı teslim edebilirsiniz.</p>
                  </button>
                </div>
                <div className="flex justify-center mt-6">
                  <Button variant="outline" onClick={prevStep} className="text-gray-700 dark:text-white border-gray-300 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/5">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Geri Dön
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Onay */}
            {currentStep === 5 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center">Talebinizi Onaylayın</h3>

                <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-xl space-y-4 border border-gray-200 dark:border-white/10">
                  <h4 className="font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/10 pb-2">Kişisel Bilgiler</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 block">Ad Soyad</span>
                      <span className="text-gray-900 dark:text-white font-medium">{submittedData?.fullName}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 block">Telefon</span>
                      <span className="text-gray-900 dark:text-white font-medium">{submittedData?.phone}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-gray-500 dark:text-gray-400 block">E-posta</span>
                      <span className="text-gray-900 dark:text-white font-medium">{submittedData?.email}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-xl space-y-4 border border-gray-200 dark:border-white/10">
                  <h4 className="font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/10 pb-2">Servis Detayları</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Cihaz:</span>
                      <span className="text-gray-900 dark:text-white font-semibold">{getDeviceName()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Arıza Tipi:</span>
                      <span className="text-gray-900 dark:text-white font-semibold">{formData.faultType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Teslimat:</span>
                      <span className="text-gray-900 dark:text-white font-semibold">
                        {formData.deliveryMethod === 'kargo' ? 'Kargo ile Gönderim' : 'Elden Teslim'}
                      </span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-200 dark:border-white/10">
                    <span className="text-gray-500 dark:text-gray-400 block mb-2">Arıza Açıklaması:</span>
                    <p className="text-gray-900 dark:text-white text-sm bg-white dark:bg-black/20 p-3 rounded-lg">
                      {submittedData?.faultDescription}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-4">
                  <Button variant="outline" onClick={prevStep} className="text-gray-700 dark:text-white border-gray-300 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/5">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Geri
                  </Button>
                  <Button onClick={handleFinalSubmit} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 px-8">
                    Tamir Talebi Oluştur <CheckCircle className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ServisPage;