import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Users, Shield, Headphones, Package, TrendingUp, Building2, School, Store, Award, Wrench, Mail, Truck, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionHeading from '@/components/SectionHeading';
import FeatureGrid from '@/components/FeatureGrid';
import GameCard from '@/components/GameCard';
import GameVideoDialog from '@/components/GameVideoDialog';
import Testimonials from '@/components/Testimonials';
import FAQAccordion from '@/components/FAQAccordion';
import { games } from '@/data/games';



const HomePage = () => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const platformCards = [{
    name: 'Apple Vision Pro',
    icon: 'Sparkles',
    color: 'from-purple-500 to-pink-500',
    description: 'Spatial computing'
  }, {
    name: 'Meta Quest 3',
    icon: 'Box',
    color: 'from-blue-500 to-cyan-500',
    description: 'Mixed reality VR'
  }, {
    name: 'PlayStation VR2',
    icon: 'Gamepad2',
    color: 'from-indigo-500 to-purple-500',
    description: 'PS5 exclusive VR'
  }, {
    name: 'HTC Vive XR Elite',
    icon: 'Zap',
    color: 'from-green-500 to-emerald-500',
    description: 'Profesyonel XR'
  }];

  const whyUsFeatures = [{
    icon: 'Zap',
    title: 'Hızlı Kurulum',
    description: 'Profesyonel ekibimiz tüm ekipmanı hızlıca kurar ve test eder'
  }, {
    icon: 'Users',
    title: 'Teknik Ekip Desteği',
    description: 'Etkinlik boyunca deneyimli teknik personel desteği'
  }, {
    icon: 'Shield',
    title: 'Hijyen Garantisi',
    description: 'Medikal standartlarda temizlik ve tek kullanımlık pedler'
  }, {
    icon: 'Headphones',
    title: 'Geniş Oyun Kütüphanesi',
    description: '100+ farklı VR oyunu ve deneyim seçeneği'
  }, {
    icon: 'Package',
    title: 'Kurumsal Fatura',
    description: 'Tüm yasal evraklarla kurumsal hizmet anlayışı'
  }, {
    icon: 'TrendingUp',
    title: 'Etkinlik Destek',
    description: 'Alan tasarımı ve organizasyon danışmanlığı'
  }];

  const usageScenarios = [{
    icon: 'Award',
    title: 'Fuar Standları',
    description: 'Ziyaretçi çekmek ve marka bilinirliği artırmak için ideal',
    color: 'from-blue-500 to-cyan-500'
  }, {
    icon: 'Store',
    title: 'AVM Etkinlikleri',
    description: 'Alışveriş merkezlerinde müşteri deneyimi zenginleştirme',
    color: 'from-purple-500 to-pink-500'
  }, {
    icon: 'Building2',
    title: 'Kurumsal Organizasyonlar',
    description: 'Team building, lansman ve özel etkinlikler',
    color: 'from-green-500 to-emerald-500'
  }, {
    icon: 'School',
    title: 'Eğitim Kurumları',
    description: 'İnteraktif eğitim ve öğrenci aktiviteleri',
    color: 'from-orange-500 to-red-500'
  }];

  const handleGameVideoClick = game => {
    setSelectedGame(game);
    setIsVideoOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>VR Kiralama - Türkiye'nin Lider VR Ekipman Kiralama Platformu</title>
        <meta name="description" content="Meta Quest 3, HTC Vive, PlayStation VR2 kiralama hizmeti. Fuar, etkinlik ve kurumsal organizasyonlar için profesyonel VR çözümleri." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1698084068220-856ded06c1a4?w=1920&q=80" alt="VR Experience" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50/95 via-gray-100/90 to-gray-50 dark:from-[#0a0e27]/90 dark:via-[#0a0e27]/80 dark:to-[#0a0e27]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              VR Servis ve Onarım Merkezi
            </h1>
            <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Onarım, bakım ve ihtiyaç halinde kiralama — tek merkezden profesyonel hizmet.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/servis">
                <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold text-lg px-8 py-6 shadow-lg">
                  Servis & Onarım
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Hizmet Verdiğimiz VR Ürünleri */}
      <section className="py-24 relative overflow-hidden">
        {/* Premium Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-[#0a0e27] dark:via-[#0d1235] dark:to-black" />
        <div className="absolute inset-0 opacity-30 dark:opacity-50">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Premium Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              Profesyonel Servis Hizmeti
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-purple-800 to-gray-900 dark:from-white dark:via-purple-300 dark:to-white bg-clip-text text-transparent">
              Hizmet Verdiğimiz VR Modelleri
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Uzman ekibimiz ile tüm VR cihazlarınız için hızlı, güvenilir ve kaliteli servis çözümleri sunuyoruz.
            </p>
          </motion.div>

          {/* VR Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Meta Quest 2",
                tagline: "Standalone VR",
                color: "from-gray-500 via-gray-600 to-gray-700",
                glowColor: "gray",
                image: "/meta-quest-2.jpg"
              },
              {
                name: "Meta Quest 3",
                tagline: "Mixed Reality",
                color: "from-purple-500 via-purple-600 to-purple-700",
                glowColor: "purple",
                image: "/meta-quest-3.jpg"
              },
              {
                name: "Meta Quest 3S",
                tagline: "Next-Gen MR",
                color: "from-violet-500 via-violet-600 to-violet-700",
                glowColor: "violet",
                image: "/meta-quest-3s.jpg"
              },
              {
                name: "Meta Quest Pro",
                tagline: "Profesyonel VR",
                color: "from-pink-500 via-pink-600 to-pink-700",
                glowColor: "pink",
                image: "/meta-quest-pro.png"
              },
              {
                name: "HTC Vive Pro",
                tagline: "Enterprise VR",
                color: "from-blue-500 via-blue-600 to-blue-700",
                glowColor: "blue",
                image: "/htc-vive-pro.png"
              },
              {
                name: "HTC Vive",
                tagline: "Room-Scale VR",
                color: "from-cyan-500 via-cyan-600 to-cyan-700",
                glowColor: "cyan",
                image: "/htc-vive.jpg"
              },
              {
                name: "Oculus Rift",
                tagline: "PC VR Classic",
                color: "from-indigo-500 via-indigo-600 to-indigo-700",
                glowColor: "indigo",
                image: "/oculus-rift.jpg"
              },
            ].map((platform, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                whileHover={{ y: -12, scale: 1.02 }}
                className="group relative"
              >
                {/* Card Glow Effect */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${platform.color} rounded-3xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500`} />

                {/* Card Content */}
                <div className="relative h-full p-6 rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 shadow-xl dark:shadow-2xl shadow-gray-200/50 dark:shadow-black/20 group-hover:border-purple-500/30 dark:group-hover:border-purple-500/30 transition-all duration-300 overflow-hidden">

                  {/* Shine Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  </div>

                  {/* Top Gradient Line */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${platform.color} opacity-60 group-hover:opacity-100 transition-opacity`} />

                  {/* Image Container - Premium Frame */}
                  <div className="relative mb-5">
                    {/* Outer Gradient Frame */}
                    <div className={`absolute -inset-1 bg-gradient-to-br ${platform.color} rounded-2xl opacity-50 group-hover:opacity-80 blur-sm transition-all duration-300`} />

                    {/* Main Image Container */}
                    <div className="relative w-full h-44 rounded-xl overflow-hidden border border-white/20 dark:border-white/10">
                      {/* Background Gradient - matches the product theme */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${platform.color} opacity-20`} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

                      {/* Product Image - Full Cover */}
                      <motion.img
                        src={platform.image}
                        alt={platform.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      />

                      {/* Glass Overlay on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Shine Effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden">
                        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                      </div>
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="text-center space-y-2">
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${platform.color} text-white shadow-lg`}>
                      {platform.tagline}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                      {platform.name}
                    </h3>
                  </div>

                  {/* Hover Action Hint */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="mt-4 pt-4 border-t border-gray-200/50 dark:border-white/10"
                  >
                    <Link
                      to="/servis"
                      className="flex items-center justify-center gap-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                    >
                      <Wrench className="w-4 h-4" />
                      Servis Talebi Oluştur
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Stats/Trust Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { value: "1000+", label: "Cihaz Onarıldı", icon: Wrench },
              { value: "%98", label: "Müşteri Memnuniyeti", icon: Users },
              { value: "24-48", label: "Saat Onarım Süresi", icon: Zap },
              { value: "6 Ay", label: "Garanti Süresi", icon: Shield },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative text-center p-6 rounded-xl bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-gray-200/50 dark:border-white/10">
                  <stat.icon className="w-6 h-6 mx-auto mb-3 text-purple-600 dark:text-purple-400" />
                  <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tamir Süreci */}
      <section className="py-16 bg-gradient-to-b from-gray-100 to-gray-50 dark:from-black dark:to-[#0a0e27]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Tamir Süreci Nasıl İşler?"
            description="4 kolay adımda cihazınızı tamir ettirin"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {[
              {
                step: 1,
                icon: Wrench,
                title: "Cihaz & Arıza Seçimi",
                description: "VR cihazınızı ve yaşadığınız arıza türünü seçin",
                color: "from-blue-500 to-blue-600"
              },
              {
                step: 2,
                icon: Mail,
                title: "Bilgilerinizi Girin",
                description: "İletişim bilgilerinizi ve arıza detaylarını paylaşın",
                color: "from-purple-500 to-purple-600"
              },
              {
                step: 3,
                icon: Truck,
                title: "Teslimat Yöntemi",
                description: "Kargo veya elden teslim seçeneklerinden birini tercih edin",
                color: "from-amber-500 to-amber-600"
              },
              {
                step: 4,
                icon: CheckCircle,
                title: "Onay & Takip",
                description: "Talebinizi onaylayın ve takip numaranızı alın",
                color: "from-green-500 to-green-600"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative p-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-purple-500/30 transition-all"
              >
                {/* Step Number Badge */}
                <div className={`absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                  {item.step}
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{item.description}</p>

                {/* Connector Line (hidden on last item and mobile) */}
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-gray-300 to-transparent dark:from-white/20" />
                )}
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Button
              onClick={() => window.location.href = '/servis'}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg rounded-xl"
            >
              Hemen Tamir Talebi Oluştur
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>



      {/* Neden Biz */}
      <section className="py-16 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Neden Biz?" description="Müşteri memnuniyeti odaklı, profesyonel VR kiralama hizmeti" />
          <FeatureGrid features={whyUsFeatures} />
        </div>
      </section>


      {/* Müşteri Yorumları */}
      <section className="py-16 bg-gray-50 dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Müşterilerimiz Ne Diyor?" description="Binlerce başarılı etkinliğin ardından aldığımız geri bildirimler" />
          <Testimonials />
        </div>
      </section>

      {/* SSS */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-[#0a0e27]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Merak Ettikleriniz" description="VR kiralama hizmeti hakkında en çok sorulan sorular" />
          <FAQAccordion />
        </div>
      </section>



      <GameVideoDialog game={selectedGame} open={isVideoOpen} onOpenChange={setIsVideoOpen} />
    </>
  );
};

export default HomePage;