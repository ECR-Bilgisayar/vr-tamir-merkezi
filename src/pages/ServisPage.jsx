
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Wrench, ArrowRight, ArrowLeft, CheckCircle, Truck, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionHeading from '@/components/SectionHeading';
import StepProcess from '@/components/StepProcess';
import { useToast } from '@/components/ui/use-toast';

const ServisPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    device: '',
    faultType: '',
    deliveryMethod: ''
  });
  const [serviceId, setServiceId] = useState(null);
  const { toast } = useToast();

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSelect = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    nextStep();
  };

  const handleSubmit = () => {
    const newServiceId = `SRV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000000)}`;
    setServiceId(newServiceId);
    
    const requestData = {
      ...formData,
      id: newServiceId,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    const existingRequests = JSON.parse(localStorage.getItem('serviceRequests') || '[]');
    localStorage.setItem('serviceRequests', JSON.stringify([...existingRequests, requestData]));

    toast({
      title: "Talep Oluşturuldu! 🛠️",
      description: `Servis talebiniz alındı. Takip No: ${newServiceId}`,
    });
  };

  if (serviceId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0e27] via-black to-[#0a0e27] py-20 flex items-center justify-center">
        <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-3xl p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Talep Başarılı!</h2>
          <p className="text-gray-400 mb-6">Servis talebiniz başarıyla oluşturuldu.</p>
          <div className="bg-black/30 p-4 rounded-xl mb-6">
            <span className="text-sm text-gray-500 block mb-1">Takip Numaranız</span>
            <span className="text-xl font-mono font-bold text-purple-400">{serviceId}</span>
          </div>
          
          {formData.deliveryMethod === 'elden' && (
             <div className="text-left bg-white/5 p-4 rounded-xl mb-6 space-y-2">
               <h4 className="font-semibold text-white flex items-center"><MapPin className="w-4 h-4 mr-2"/> Teslimat Noktası</h4>
               <p className="text-sm text-gray-300">İstoç, 32. Ada No:76-78, Bağcılar, İstanbul</p>
               <p className="text-sm text-gray-400">09:00 - 18:00 (Hafta içi)</p>
             </div>
          )}

          <Button onClick={() => window.location.href = '/'} className="w-full bg-purple-600 hover:bg-purple-700">Ana Sayfaya Dön</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Servis & Onarım - VR Kiralama</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-[#0a0e27] via-black to-[#0a0e27] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="VR Onarım & Bakım"
            description="Cihazınızdaki sorunu belirtin, hemen çözelim"
          />

          <StepProcess steps={['Cihaz Seçimi', 'Arıza Tipi', 'Teslimat', 'Onay']} currentStep={currentStep} />

          <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-8 min-h-[400px]">
            {currentStep === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                 <h3 className="text-xl font-bold text-white mb-6 text-center">Hangi cihaz için servis istiyorsunuz?</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   {['Meta Quest 2', 'Meta Quest 3', 'HTC Vive', 'PlayStation VR2', 'Diğer'].map(device => (
                     <button
                       key={device}
                       onClick={() => handleSelect('device', device)}
                       className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500 hover:bg-purple-500/10 transition-all text-left text-white font-semibold flex justify-between group"
                     >
                       {device}
                       <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-purple-400"/>
                     </button>
                   ))}
                 </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-6 text-center">Arıza türü nedir?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   {['Cihaz Açılmıyor', 'Görüntü/Lens Sorunu', 'Sensör/Takip Hatası', 'Yazılım Problemi', 'Kırık/Hasar', 'Diğer'].map(fault => (
                     <button
                       key={fault}
                       onClick={() => handleSelect('faultType', fault)}
                       className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500 hover:bg-purple-500/10 transition-all text-left text-white font-semibold flex justify-between group"
                     >
                       {fault}
                       <Wrench className="w-5 h-5 text-gray-500 group-hover:text-purple-400"/>
                     </button>
                   ))}
                 </div>
                 <div className="flex justify-center mt-6">
                    <Button variant="outline" onClick={prevStep} className="text-white border-white/20">Geri Dön</Button>
                 </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-6 text-center">Teslimat Yöntemi</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button
                     onClick={() => handleSelect('deliveryMethod', 'kargo')}
                     className="p-8 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500 hover:bg-purple-500/10 transition-all text-center group"
                  >
                    <Truck className="w-12 h-12 text-blue-400 mx-auto mb-4"/>
                    <h4 className="text-lg font-bold text-white mb-2">Kargo ile Gönderim</h4>
                    <p className="text-sm text-gray-400">Kargo ücretleri müşteri tarafından karşılanacaktır.</p>
                  </button>
                  
                  <button
                     onClick={() => handleSelect('deliveryMethod', 'elden')}
                     className="p-8 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500 hover:bg-purple-500/10 transition-all text-center group"
                  >
                    <MapPin className="w-12 h-12 text-green-400 mx-auto mb-4"/>
                    <h4 className="text-lg font-bold text-white mb-2">Elden Teslim</h4>
                    <p className="text-sm text-gray-400">Ofisimize gelerek cihazı teslim edebilirsiniz.</p>
                  </button>
                </div>
                <div className="flex justify-center mt-6">
                    <Button variant="outline" onClick={prevStep} className="text-white border-white/20">Geri Dön</Button>
                 </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 text-center">
                 <h3 className="text-2xl font-bold text-white">Onaylıyor musunuz?</h3>
                 <div className="bg-white/5 p-6 rounded-xl max-w-md mx-auto space-y-4 border border-white/10 text-left">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Cihaz:</span>
                      <span className="text-white font-semibold">{formData.device}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Arıza:</span>
                      <span className="text-white font-semibold">{formData.faultType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Yöntem:</span>
                      <span className="text-white font-semibold">{formData.deliveryMethod === 'kargo' ? 'Kargo' : 'Elden Teslim'}</span>
                    </div>
                 </div>
                 
                 <div className="flex items-center justify-center space-x-4">
                  <Button variant="outline" onClick={prevStep} className="text-white border-white/20">Geri</Button>
                  <Button onClick={handleSubmit} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 px-8">
                    Tamir Talebi Oluştur
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
