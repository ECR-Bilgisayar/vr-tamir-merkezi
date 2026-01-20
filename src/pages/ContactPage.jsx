
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';

const ContactPage = () => {
  return (
    <>
      <Helmet>
        <title>İletişim - VR Kiralama</title>
        <meta name="description" content="İletişim bilgilerimiz ve çalışma saatlerimiz." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-[#0a0e27] via-black to-[#0a0e27] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="İletişim Bilgileri"
            description="Sorularınız için bizimle iletişime geçebilirsiniz"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
            
            {/* Contact Info */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                 <h3 className="text-2xl font-bold text-white mb-6">Merkez Ofis</h3>
                 <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                       <MapPin className="w-6 h-6 text-purple-500 mt-1" />
                       <div>
                         <span className="block text-white font-medium">Adres</span>
                         <span className="text-gray-400">İstoç, 32. Ada No:76-78,<br/>Bağcılar, İstanbul</span>
                       </div>
                    </div>
                    <div className="flex items-start space-x-4">
                       <Phone className="w-6 h-6 text-purple-500 mt-1" />
                       <div>
                         <span className="block text-white font-medium">Telefon</span>
                         <span className="text-gray-400">+90 850 228 7574</span>
                       </div>
                    </div>
                    <div className="flex items-start space-x-4">
                       <Mail className="w-6 h-6 text-purple-500 mt-1" />
                       <div>
                         <span className="block text-white font-medium">E-posta</span>
                         <span className="text-gray-400">vr@vrtamirmerkezi.com</span>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Map Placeholder */}
              <div className="h-64 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10" />
                 <MapPin className="w-12 h-12 text-gray-500 group-hover:text-purple-400 transition-colors z-10" />
                 <span className="ml-2 text-gray-500 z-10">Harita Yükleniyor...</span>
              </div>
            </motion.div>

            {/* Working Hours */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm h-full"
            >
              <div className="flex items-center space-x-3 mb-8">
                 <Clock className="w-8 h-8 text-blue-500" />
                 <h3 className="text-2xl font-bold text-white">Çalışma Saatleri</h3>
              </div>
              
              <div className="space-y-4">
                {[
                  { day: "Pazartesi", hours: "09:00 - 18:00" },
                  { day: "Salı", hours: "09:00 - 18:00" },
                  { day: "Çarşamba", hours: "09:00 - 18:00" },
                  { day: "Perşembe", hours: "09:00 - 18:00" },
                  { day: "Cuma", hours: "09:00 - 18:00" },
                  { day: "Cumartesi", hours: "10:00 - 13:00", highlight: true },
                  { day: "Pazar", hours: "Kapalı", closed: true }
                ].map((schedule, i) => (
                  <div key={i} className={`flex justify-between items-center p-4 rounded-xl ${schedule.highlight ? 'bg-white/10' : 'border-b border-white/5 last:border-0'}`}>
                    <span className="text-white font-medium">{schedule.day}</span>
                    <span className={`font-mono ${schedule.closed ? 'text-red-400' : 'text-gray-300'}`}>{schedule.hours}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                <p className="text-sm text-purple-200 text-center">
                  * Resmi tatillerde çalışma saatlerimiz değişiklik gösterebilir.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
