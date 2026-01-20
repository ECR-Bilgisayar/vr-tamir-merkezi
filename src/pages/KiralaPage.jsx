
import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionHeading from '@/components/SectionHeading';
import StepProcess from '@/components/StepProcess';
import { products } from '@/data/products';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  fullName: z.string().min(2, 'Ad Soyad en az 2 karakter olmalıdır'),
  company: z.string().optional(),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  phone: z.string().min(10, 'Geçerli bir telefon numarası giriniz'),
  callbackPreference: z.boolean().default(false),
  message: z.string().optional()
});

const KiralaPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selections, setSelections] = useState({
    product: null,
    quantity: 1,
    duration: 1
  });
  const formRef = useRef(null);
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(formSchema)
  });

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

  const onSubmit = (data) => {
    const leadData = {
      ...data,
      rentalDetails: selections,
      type: 'rental_request',
      createdAt: new Date().toISOString()
    };
    
    console.log('Rental Request:', leadData);
    
    // Save to localStorage
    const existingLeads = JSON.parse(localStorage.getItem('leads') || '[]');
    localStorage.setItem('leads', JSON.stringify([...existingLeads, leadData]));

    toast({
      title: "Talep Alındı! 🚀",
      description: "Kiralama talebiniz başarıyla oluşturuldu. En kısa sürede dönüş yapacağız.",
    });

    reset();
    setCurrentStep(1);
    setSelections({ product: null, quantity: 1, duration: 1 });
  };

  return (
    <>
      <Helmet>
        <title>Hemen Kirala - VR Kiralama</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-[#0a0e27] via-black to-[#0a0e27] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Adım Adım Kiralama"
            description="İhtiyacınıza uygun paketi oluşturun"
          />

          <StepProcess steps={['Ürün Seçimi', 'Adet', 'Süre', 'Onay']} currentStep={currentStep} />

          <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6 min-h-[400px]">
            {currentStep === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <h3 className="text-xl font-bold text-white mb-4">Kiralamak istediğiniz ürünü seçin</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {products.filter(p => p.category === 'headset').map(product => (
                    <div 
                      key={product.id}
                      onClick={() => handleProductSelect(product)}
                      className={`cursor-pointer p-4 rounded-xl border transition-all ${selections.product?.id === product.id ? 'bg-purple-500/20 border-purple-500' : 'bg-white/5 border-white/10 hover:border-purple-500/50'}`}
                    >
                      <div className="flex items-center space-x-4">
                        <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
                        <div>
                          <h4 className="font-semibold text-white">{product.name}</h4>
                          <p className="text-xs text-gray-400">{product.shortDescription}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 text-center">
                <h3 className="text-xl font-bold text-white mb-4">Kaç adet kiralamak istiyorsunuz?</h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {[1, 2, 3, 4, 5, 10, 20, 50].map(num => (
                    <button
                      key={num}
                      onClick={() => handleQuantitySelect(num)}
                      className={`w-16 h-16 rounded-xl font-bold text-lg transition-all ${selections.quantity === num ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-center space-x-4 mt-8">
                  <Button variant="outline" onClick={prevStep} className="text-white border-white/20"><ArrowLeft className="mr-2 h-4 w-4"/> Geri</Button>
                  <Button onClick={nextStep} className="bg-purple-600 hover:bg-purple-700">Devam Et <ArrowRight className="ml-2 h-4 w-4"/></Button>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 text-center">
                <h3 className="text-xl font-bold text-white mb-4">Kaç gün kiralamak istiyorsunuz?</h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {[1, 2, 3, 5, 7, 14, 30].map(day => (
                    <button
                      key={day}
                      onClick={() => handleDurationSelect(day)}
                      className={`px-6 py-4 rounded-xl font-bold text-lg transition-all ${selections.duration === day ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
                    >
                      {day} Gün
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-center space-x-4 mt-8">
                  <Button variant="outline" onClick={prevStep} className="text-white border-white/20"><ArrowLeft className="mr-2 h-4 w-4"/> Geri</Button>
                  <Button onClick={nextStep} className="bg-purple-600 hover:bg-purple-700">Devam Et <ArrowRight className="ml-2 h-4 w-4"/></Button>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-4 text-center">Seçimlerinizi Onaylayın</h3>
                <div className="bg-white/5 p-6 rounded-xl space-y-4 border border-white/10">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-400">Ürün:</span>
                    <span className="text-white font-semibold">{selections.product?.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-400">Adet:</span>
                    <span className="text-white font-semibold">{selections.quantity} Adet</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-400">Süre:</span>
                    <span className="text-white font-semibold">{selections.duration} Gün</span>
                  </div>
                </div>
                <div className="flex items-center justify-center space-x-4 mt-8">
                  <Button variant="outline" onClick={prevStep} className="text-white border-white/20"><ArrowLeft className="mr-2 h-4 w-4"/> Geri</Button>
                  <Button onClick={handleConfirm} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700">
                    Hemen Kiralamaya Devam Et <ArrowRight className="ml-2 h-4 w-4"/>
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Form Section */}
          <div ref={formRef} className="mt-16 pt-16 border-t border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6">İletişim Bilgileri</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white/5 p-8 rounded-2xl border border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fullName" className="text-white mb-2 block">Ad Soyad *</Label>
                  <input id="fullName" {...register('fullName')} className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 text-white focus:border-purple-500 outline-none" placeholder="Adınız Soyadınız" />
                  {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName.message}</p>}
                </div>
                <div>
                  <Label htmlFor="company" className="text-white mb-2 block">Firma Adı</Label>
                  <input id="company" {...register('company')} className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 text-white focus:border-purple-500 outline-none" placeholder="Firma Adınız (Opsiyonel)" />
                </div>
                <div>
                  <Label htmlFor="email" className="text-white mb-2 block">E-posta *</Label>
                  <input id="email" type="email" {...register('email')} className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 text-white focus:border-purple-500 outline-none" placeholder="ornek@email.com" />
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <Label htmlFor="phone" className="text-white mb-2 block">Telefon *</Label>
                  <input id="phone" {...register('phone')} className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 text-white focus:border-purple-500 outline-none" placeholder="0555 555 55 55" />
                  {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="callbackPreference" {...register('callbackPreference')} className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                <Label htmlFor="callbackPreference" className="text-white">Beni telefonla arayarak bilgilendirin</Label>
              </div>

              <div>
                <Label htmlFor="message" className="text-white mb-2 block">Mesajınız (Opsiyonel)</Label>
                <textarea id="message" {...register('message')} rows={4} className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 text-white focus:border-purple-500 outline-none resize-none" placeholder="Eklemek istediğiniz notlar..." />
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
