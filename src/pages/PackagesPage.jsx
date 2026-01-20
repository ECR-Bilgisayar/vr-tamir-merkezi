
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Check, Info, Rocket, Briefcase, Building2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionHeading from '@/components/SectionHeading';
import ComparisonTable from '@/components/ComparisonTable';
import { packages } from '@/data/packages';

const iconMap = {
  Rocket, Briefcase, Building2, Package
};

const PackagesPage = () => {
  return (
    <>
      <Helmet>
        <title>VR Kiralama Paketleri - Fiyatlar ve Özellikler | VR Kiralama</title>
        <meta name="description" content="Starter, Professional ve Enterprise VR kiralama paketlerimiz. Etkinliğinize özel esnek çözümler ve uygun fiyatlandırma seçenekleri." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-[#0a0e27] via-black to-[#0a0e27] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            subtitle="Kiralama Paketleri"
            title="Size Özel VR Çözümleri"
            description="Etkinliğinizin büyüklüğüne ve ihtiyaçlarınıza göre tasarlanmış paketler"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {packages.map((pkg, index) => {
              const Icon = iconMap[pkg.icon] || Package;
              
              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative p-8 rounded-3xl border backdrop-blur-sm ${
                    pkg.popular
                      ? 'bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/50 shadow-2xl shadow-purple-500/20'
                      : 'bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-semibold shadow-lg">
                        🌟 En Popüler
                      </span>
                    </div>
                  )}

                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${pkg.color} flex items-center justify-center mb-6`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>

                  <h3 className="text-3xl font-bold mb-2 text-white">{pkg.name}</h3>
                  <p className="text-gray-400 mb-4">{pkg.subtitle}</p>
                  <div className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    {pkg.price}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to="/kirala">
                    <Button className={`w-full ${
                      pkg.popular
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
                        : 'bg-white/10 hover:bg-white/20'
                    } text-white font-semibold`}>
                      Hemen Kirala
                    </Button>
                  </Link>

                  <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-xs text-gray-400 text-center">{pkg.pricingNote}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Paket Karşılaştırması</h2>
            <ComparisonTable />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 backdrop-blur-sm"
          >
            <div className="flex items-start space-x-4">
              <Info className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Fiyatlandırma Hakkında</h3>
                <p className="text-gray-300 mb-4">
                  Paket fiyatları; etkinlik süresi, lokasyon, özel talepler ve sezon durumuna göre değişiklik gösterebilir. 
                  Size en uygun fiyat teklifini almak için lütfen bizimle iletişime geçin.
                </p>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Kurumsal müşteriler için özel indirimler</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Uzun süreli kiralama avantajları</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Esnek ödeme seçenekleri</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          <div className="mt-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block"
            >
              <Link to="/iletisim">
                <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold text-lg px-12 py-6">
                  Özel Teklif İsteyin
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PackagesPage;
