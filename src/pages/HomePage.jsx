import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Users, Shield, Headphones, Package, TrendingUp, Building2, School, Store, Award } from 'lucide-react';
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
  return <>
      <Helmet>
        <title>VR Kiralama - Türkiye'nin Lider VR Ekipman Kiralama Platformu</title>
        <meta name="description" content="Meta Quest 3, HTC Vive, PlayStation VR2 kiralama hizmeti. Fuar, etkinlik ve kurumsal organizasyonlar için profesyonel VR çözümleri." />
      </Helmet>

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1698084068220-856ded06c1a4?w=1920&q=80" alt="VR Experience" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e27]/90 via-[#0a0e27]/80 to-[#0a0e27]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8
        }}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">VR Servis ve Onarım Merkezi</h1>
            <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">Onarım, bakım ve ihtiyaç halinde kiralama — tek merkezden profesyonel hizmet.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/servis">
                <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold text-lg px-8 py-6">
                  Servis & Onarım
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/kirala">
                <Button size="lg" variant="outline" className="border-2 border-white/20 hover:bg-white/10 text-white font-semibold text-lg px-8 py-6">Kirala</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-[#0a0e27] to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Desteklenen VR Sistemleri" description="En güncel VR teknolojileri ile donatılmış geniş ekipman parkuru" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {platformCards.map((platform, index) => <motion.div key={index} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5,
            delay: index * 0.1
          }} whileHover={{
            y: -10
          }} className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm hover:border-purple-500/30 transition-all text-center">
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${platform.color} flex items-center justify-center mb-4`}>
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">{platform.name}</h3>
                <p className="text-gray-400 text-sm">{platform.description}</p>
              </motion.div>)}
          </div>
        </div>
      </section>

      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Neden Biz?" description="Müşteri memnuniyeti odaklı, profesyonel VR kiralama hizmeti" />
          <FeatureGrid features={whyUsFeatures} />
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-black to-[#0a0e27]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="100+ VR Oyunu ve Deneyim" description="Her yaşa ve ilgi alanına uygun zengin içerik" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {games.slice(0, 6).map((game, index) => <GameCard key={game.id} game={game} index={index} onVideoClick={handleGameVideoClick} />)}
          </div>
          <div className="text-center">
            <Link to="/oyunlar">
              <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold">
                Tüm Oyunları Görüntüle
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-[#0a0e27] to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Hangi Etkinlikler İçin Uygun?" description="VR kiralama hizmetimizin ideal kullanım alanları" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {usageScenarios.map((scenario, index) => {
            const Icon = eval(scenario.icon);
            return <motion.div key={index} initial={{
              opacity: 0,
              scale: 0.9
            }} whileInView={{
              opacity: 1,
              scale: 1
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.5,
              delay: index * 0.1
            }} whileHover={{
              scale: 1.05
            }} className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm hover:border-purple-500/30 transition-all text-center">
                  <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${scenario.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-white">{scenario.title}</h3>
                  <p className="text-gray-400 text-sm">{scenario.description}</p>
                </motion.div>;
          })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Müşterilerimiz Ne Diyor?" description="Binlerce başarılı etkinliğin ardından aldığımız geri bildirimler" />
          <Testimonials />
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-black to-[#0a0e27]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Merak Ettikleriniz" description="VR kiralama hizmeti hakkında en çok sorulan sorular" />
          <FAQAccordion />
        </div>
      </section>

      <section className="py-16 bg-[#0a0e27]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="p-12 rounded-3xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 backdrop-blur-sm">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
              Etkinliğiniz İçin Teklif Alın
            </h2>
            <p className="text-gray-300 mb-8 text-lg">
              Ücretsiz danışmanlık ve özel fiyat teklifi için hemen iletişime geçin
            </p>
            <Link to="/iletisim">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold text-lg px-8 py-6">
                Hemen Teklif Al
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <GameVideoDialog game={selectedGame} open={isVideoOpen} onOpenChange={setIsVideoOpen} />
    </>;
};
export default HomePage;