
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Shield, Target, Users, Zap, Award } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';

const CorporatePage = () => {
  return (
    <>
      <Helmet>
        <title>Kurumsal - VR Kiralama</title>
        <meta name="description" content="Kurumsal vizyonumuz, teknolojimiz ve iş ortaklarımız." />
      </Helmet>

      <div className="min-h-screen bg-[#0a0e27] text-white">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent z-0" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
             <motion.h1 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-gray-400 bg-clip-text text-transparent"
             >
               Geleceğin Teknolojisi,<br/>Bugünün Çözümleri
             </motion.h1>
             <motion.p 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.2 }}
               className="text-xl text-gray-400 max-w-2xl mx-auto"
             >
               Kurumsal dünyayı sanal gerçekliğin sınırsız imkanlarıyla buluşturuyoruz.
             </motion.p>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-20 bg-black/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <motion.div 
                 initial={{ opacity: 0, x: -20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm"
               >
                 <Target className="w-12 h-12 text-purple-500 mb-6" />
                 <h2 className="text-3xl font-bold mb-4">Vizyonumuz</h2>
                 <p className="text-gray-300 leading-relaxed">
                   Türkiye'nin en kapsamlı VR ve AR teknoloji sağlayıcısı olarak, dijital dönüşümde öncü rol oynamak ve işletmelerin potansiyelini sanal dünyada en üst seviyeye çıkarmak.
                 </p>
               </motion.div>

               <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm"
               >
                 <Zap className="w-12 h-12 text-blue-500 mb-6" />
                 <h2 className="text-3xl font-bold mb-4">Misyonumuz</h2>
                 <p className="text-gray-300 leading-relaxed">
                   En son teknolojiyi erişilebilir kılarak, eğitimden eğlenceye, pazarlamadan simülasyona kadar her alanda katma değer yaratan, güvenilir ve yenilikçi çözümler sunmak.
                 </p>
               </motion.div>
            </div>
          </div>
        </section>

        {/* Why Us */}
        <section className="py-24">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <SectionHeading title="Neden Biz?" description="İş ortaklarımıza sunduğumuz değerler" />
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { icon: Shield, title: "Güven & Kalite", desc: "Sektör standartlarının üzerinde donanım ve hizmet kalitesi." },
                  { icon: Users, title: "Uzman Kadro", desc: "Alanında deneyimli teknik ekip ve operasyon yönetimi." },
                  { icon: Award, title: "Yenilikçi Çözümler", desc: "Sürekli güncellenen envanter ve yazılım desteği." }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-8 text-center rounded-2xl bg-gradient-to-b from-white/5 to-transparent hover:bg-white/10 transition-colors border border-white/5"
                  >
                    <item.icon className="w-16 h-16 mx-auto mb-6 text-gray-400" />
                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-gray-500">{item.desc}</p>
                  </motion.div>
                ))}
             </div>
           </div>
        </section>
      </div>
    </>
  );
};

export default CorporatePage;
