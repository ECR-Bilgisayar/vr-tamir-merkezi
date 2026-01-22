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


      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-[#0a0e27] dark:via-black dark:to-[#0a0e27] py-16">
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
              <div className="p-8 rounded-3xl bg-white dark:bg-[#0d1229] border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
                 <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Merkez Ofis</h3>
                 <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                       <MapPin className="w-6 h-6 text-purple-500 mt-1" />
                       <div>
                         <span className="block text-gray-900 dark:text-white font-medium">Adres</span>
                         <span className="text-gray-600 dark:text-gray-400">İstoç, 32. Ada No:78-80,<br/>Bağcılar, İstanbul</span>
                       </div>
                    </div>
                    <div className="flex items-start space-x-4">
                       <Phone className="w-6 h-6 text-purple-500 mt-1" />
                       <div>
                         <span className="block text-gray-900 dark:text-white font-medium">Telefon</span>
                         <span className="text-gray-600 dark:text-gray-400">+90 850 228 7574</span>
                       </div>
                    </div>
                    <div className="flex items-start space-x-4">
                       <Mail className="w-6 h-6 text-purple-500 mt-1" />
                       <div>
                         <span className="block text-gray-900 dark:text-white font-medium">E-posta</span>
                         <span className="text-gray-600 dark:text-gray-400">vr@vrtamirmerkezi.com</span>
                       </div>
                    </div>
                 </div>
              </div>


              {/* Map */}
              <div className="h-64 rounded-3xl bg-white dark:bg-[#0d1229] border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.1295429871757!2d28.815236011547885!3d41.066160915739346!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caa5707d5dea65%3A0x666cd2100159dab3!2sEtkinlik%20Bilgisayar!5e0!3m2!1str!2str!4v1769072713327!5m2!1str!2str"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="VR Tamir Merkezi Konum"
                />
              </div>
            </motion.div>


            {/* Working Hours */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-8 rounded-3xl bg-white dark:bg-[#0d1229] border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none h-fit"
            >
              <div className="flex items-center space-x-3 mb-8">
                 <Clock className="w-8 h-8 text-blue-500" />
                 <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Çalışma Saatleri</h3>
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
                  <div key={i} className={`flex justify-between items-center p-4 rounded-xl ${schedule.highlight ? 'bg-purple-50 dark:bg-white/10' : 'border-b border-gray-100 dark:border-white/5 last:border-0'}`}>
                    <span className="text-gray-900 dark:text-white font-medium">{schedule.day}</span>
                    <span className={`font-mono ${schedule.closed ? 'text-red-500 dark:text-red-400' : 'text-gray-600 dark:text-gray-300'}`}>{schedule.hours}</span>
                  </div>
                ))}
              </div>


              <div className="mt-8 p-4 bg-purple-50 dark:bg-purple-500/10 rounded-xl border border-purple-200 dark:border-purple-500/20">
                <p className="text-sm text-purple-700 dark:text-purple-200 text-center">
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
