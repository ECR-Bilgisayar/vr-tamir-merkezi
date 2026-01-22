import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Check, ArrowRight, ArrowLeft, AlertCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionHeading from '@/components/SectionHeading';
import StepProcess from '@/components/StepProcess';
import { products } from '@/data/products';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  fullName: z.string().min(2, 'Ad Soyad en az 2 karakter olmalıdır'),
  company: z.string().min(2, 'Firma adı en az 2 karakter olmalıdır'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  phone: z.string().min(10, 'Geçerli bir telefon numarası giriniz'),
  callbackPreference: z.boolean().default(false),
  message: z.string().min(10, 'Mesajınız en az 10 karakter olmalıdır')
});

const KiralaPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selections, setSelections] = useState({
    product: null,
    quantity: null,
    duration: null
  });
  const formRef = useRef(null);
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(formSchema)
  });

  const quantityOptions = ['1-3', '4-6', '7-10', '10-15', '15+'];
  const durationOptions = ['1-3', '3-5', '5-7', '7-10', '10+'];

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleProductSelect = (product) => {
    setSelections(prev => ({ ...prev, product }));
    nextStep();
  };

  const handleQuantitySelect = (qty) => {
    setSelections(prev => ({ ...prev, quantity: qty }));
    nextStep();
  };

  const handleDurationSelect = (days) => {
    setSelections(prev => ({ ...prev, duration: days }));
    nextStep();
  };

  const handleConfirm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const onSubmit = async (data) => {
    try {
      const requestData = {
        fullName: data.fullName,
        company: data.company,
        email: data.email,
        phone: data.phone,
        productName: selections.product?.name || '',
        quantity: selections.quantity,
        duration: selections.duration,
        message: data.message,
        callbackPreference: data.callbackPreference || false
      };

      const API_URL = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${API_URL}/api/rental-requests`, {
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

      toast({
        title: "Talep Alındı! 🚀",
        description: `Kiralama talebiniz başarıyla oluşturuldu. Talep No: ${result.data.rentalId}`,
      });

      reset();
      setCurrentStep(1);
      setSelections({ product: null, quantity: null, duration: null });

    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "Hata!",
        description: error.message || "Talep oluşturulamadı. Lütfen tekrar deneyin.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Hemen Kirala - VR Kiralama</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-[#0a0e27] dark:via-black dark:to-[#0a0e27] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Adım Adım Kiralama"
            description="İhtiyacınıza uygun paketi oluşturun"
          />

          {/* Kurumsal Uyarı */}
          <div className="mb-8 p-6 bg-amber-50 dark:bg-amber-500/10 border-2 border-amber-300 dark:border-amber-500/30 rounded-2xl">
            <div className="flex items-start space-x-4">
              <AlertCircle className="w-8 h-8 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-amber-800 dark:text-amber-300 mb-2">
                  Bireysel Kiralama Yapılmamaktadır
                </h3>
                <p className="text-amber-700 dark:text-amber-400 text-lg">
                  Sadece kurumsal müşterilerimize hizmet vermekteyiz. Kurumsal kiralama için aşağıdaki adımları izleyebilirsiniz.
                </p>
              </div>
            </div>
          </div>

          <StepProcess steps={['Ürün Seçimi', 'Adet', 'Süre', 'Onay']} currentStep={currentStep} />

          <div className="mt-8 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 min-h-[400px] shadow-sm dark:shadow-none">
            {currentStep === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Kiralamak istediğiniz ürünü seçin</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {products.filter(p => !p.purchasable).map(product => (
                    <div
                      key={product.id}
                      onClick={() => handleProductSelect(product)}
                      className={`cursor-pointer p-4 rounded-xl border transition-all ${selections.product?.id === product.id
                        ? 'bg-purple-100 dark:bg-purple-500/20 border-purple-500'
                        : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-purple-500/50'
                        }`}
                    >
                      <div className="flex items-center space-x-4">
                        <img src={product.image} alt={product.name} className="w-16 h-16 object-contain rounded-lg bg-white dark:bg-white/10 p-1" />
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{product.name}</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{product.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Kaç adet kiralamak istiyorsunuz?</h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {quantityOptions.map(qty => (
                    <button
                      key={qty}
                      onClick={() => handleQuantitySelect(qty)}
                      className={`px-6 py-4 rounded-xl font-bold text-lg transition-all min-w-[100px] ${selections.quantity === qty
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20'
                        }`}
                    >
                      {qty} Adet
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-center space-x-4 mt-8">
                  <Button variant="outline" onClick={prevStep} className="text-gray-700 dark:text-white border-gray-300 dark:border-white/20">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Geri
                  </Button>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Kaç gün kiralamak istiyorsunuz?</h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {durationOptions.map(day => (
                    <button
                      key={day}
                      onClick={() => handleDurationSelect(day)}
                      className={`px-6 py-4 rounded-xl font-bold text-lg transition-all min-w-[100px] ${selections.duration === day
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20'
                        }`}
                    >
                      {day} Gün
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-center space-x-4 mt-8">
                  <Button variant="outline" onClick={prevStep} className="text-gray-700 dark:text-white border-gray-300 dark:border-white/20">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Geri
                  </Button>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">Seçimlerinizi Onaylayın</h3>
                <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-xl space-y-4 border border-gray-200 dark:border-white/10">
                  <div className="flex justify-between border-b border-gray-200 dark:border-white/10 pb-2">
                    <span className="text-gray-600 dark:text-gray-400">Ürün:</span>
                    <span className="text-gray-900 dark:text-white font-semibold">{selections.product?.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 dark:border-white/10 pb-2">
                    <span className="text-gray-600 dark:text-gray-400">Adet:</span>
                    <span className="text-gray-900 dark:text-white font-semibold">{selections.quantity} Adet</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 dark:border-white/10 pb-2">
                    <span className="text-gray-600 dark:text-gray-400">Süre:</span>
                    <span className="text-gray-900 dark:text-white font-semibold">{selections.duration} Gün</span>
                  </div>
                </div>
                <div className="flex items-center justify-center space-x-4 mt-8">
                  <Button variant="outline" onClick={prevStep} className="text-gray-700 dark:text-white border-gray-300 dark:border-white/20">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Geri
                  </Button>
                  <Button onClick={handleConfirm} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700">
                    Hemen Kiralamaya Devam Et <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Form Section */}
          <div ref={formRef} className="mt-16 pt-16 border-t border-gray-200 dark:border-white/10">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">İletişim Bilgileri</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-white/5 p-8 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fullName" className="text-gray-900 dark:text-white mb-2 block">Ad Soyad *</Label>
                  <input
                    id="fullName"
                    {...register('fullName')}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-black/20 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white focus:border-purple-500 outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    placeholder="Adınız Soyadınız"
                  />
                  {errors.fullName && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.fullName.message}</p>}
                </div>
                <div>
                  <Label htmlFor="company" className="text-gray-900 dark:text-white mb-2 block">Firma Adı *</Label>
                  <input
                    id="company"
                    {...register('company')}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-black/20 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white focus:border-purple-500 outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    placeholder="Firma Adınız"
                  />
                  {errors.company && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.company.message}</p>}
                </div>
                <div>
                  <Label htmlFor="email" className="text-gray-900 dark:text-white mb-2 block">E-posta *</Label>
                  <input
                    id="email"
                    type="email"
                    {...register('email')}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-black/20 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white focus:border-purple-500 outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    placeholder="ornek@email.com"
                  />
                  {errors.email && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <Label htmlFor="phone" className="text-gray-900 dark:text-white mb-2 block">Telefon *</Label>
                  <input
                    id="phone"
                    {...register('phone')}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-black/20 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white focus:border-purple-500 outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    placeholder="0555 555 55 55"
                  />
                  {errors.phone && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.phone.message}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="message" className="text-gray-900 dark:text-white mb-2 block">Mesajınız *</Label>
                <textarea
                  id="message"
                  {...register('message')}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-black/20 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white focus:border-purple-500 outline-none resize-none placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  placeholder="Etkinlik detayları, tarih, lokasyon vb. bilgileri yazınız..."
                />
                {errors.message && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.message.message}</p>}
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
                <Label htmlFor="callbackPreference" className="text-gray-700 dark:text-white">Beni telefonla arayarak bilgilendirin</Label>
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-4 text-lg">
                Talebi Gönder
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default KiralaPage;