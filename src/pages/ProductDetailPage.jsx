import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Wrench, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { products } from '@/data/products';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const product = products.find(p => p.id === parseInt(slug) || p.slug === slug);

  if (!product) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0e27] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ürün Bulunamadı</h2>
          <Link to="/urunler">
            <Button>Ürünlere Dön</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{product.name} Tamir - VR Tamir Merkezi</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-[#0a0e27] dark:via-black dark:to-[#0a0e27] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/urunler">
            <Button variant="ghost" className="mb-8 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Ürünlere Dön
            </Button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-transparent">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-96 object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div>
                <span className="inline-block px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 text-sm font-medium mb-4">
                  {product.category.toUpperCase()} Tamir
                </span>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{product.name}</h1>
                <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">{product.description}</p>
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                  {product.price}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-blue-800 dark:text-blue-200 text-sm font-medium">Ücretsiz Ön Değerlendirme</p>
                    <p className="text-blue-600 dark:text-blue-300/80 text-xs mt-1">Cihazınızı getirin, arızayı tespit edelim, fiyat teklifi sunalım.</p>
                  </div>
                </div>
              </div>

              <Link to="/servis">
                <Button size="lg" className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold">
                  Tamir Talebi Oluştur
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Tamir Hizmetleri */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
              <Wrench className="w-8 h-8 mr-3 text-purple-600 dark:text-purple-400" />
              Tamir Hizmetlerimiz
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.repairTypes?.map((repair, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-xl bg-white dark:bg-gradient-to-br dark:from-white/5 dark:to-white/[0.02] border border-gray-200 dark:border-white/10 hover:border-purple-500/50 transition-all group shadow-sm dark:shadow-none"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                      {repair.title}
                    </h3>
                    <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{repair.description}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-white/5">
                    <span className="text-xs text-gray-500">Teslim Süresi</span>
                    <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">{repair.duration}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Özellikler */}
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-white/5 dark:to-white/[0.02] border border-gray-200 dark:border-white/10 backdrop-blur-sm shadow-sm dark:shadow-none"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Destek Verdiğimiz Sorunlar</h2>
              <ul className="space-y-3">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-white/5 dark:to-white/[0.02] border border-gray-200 dark:border-white/10 backdrop-blur-sm shadow-sm dark:shadow-none"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Tamir Süreci</h2>
              <div className="space-y-4">
                {[
                  { step: '1', title: 'Ön Değerlendirme', desc: 'Cihazınızı getirin, arızayı tespit edelim' },
                  { step: '2', title: 'Fiyat Teklifi', desc: 'Ücretsiz fiyat teklifi sunuyoruz' },
                  { step: '3', title: 'Onarım', desc: 'Profesyonel ekibimiz tamir işlemini gerçekleştirir' },
                  { step: '4', title: 'Test & Teslim', desc: 'Cihazınızı test edip size teslim ediyoruz' }
                ].map((item) => (
                  <div key={item.step} className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-600 dark:text-purple-300 font-bold text-sm">{item.step}</span>
                    </div>
                    <div>
                      <h3 className="text-gray-900 dark:text-white font-semibold mb-1">{item.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 p-12 rounded-3xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-500/20 dark:to-blue-500/20 border border-purple-200 dark:border-purple-500/30 backdrop-blur-sm text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {product.name} Tamiri İçin Hemen Başvurun
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
              Profesyonel ekibimiz cihazınızı en kısa sürede onarır ve size teslim eder.
            </p>
            <Link to="/servis">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold text-lg px-8 py-6">
                Tamir Formu Doldur
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
