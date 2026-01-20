
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Package, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { products } from '@/data/products';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const product = products.find(p => p.slug === slug);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ürün Bulunamadı</h2>
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
        <title>{product.name} - VR Kiralama | Profesyonel VR Ekipman</title>
        <meta name="description" content={product.shortDescription} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-[#0a0e27] via-black to-[#0a0e27] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/urunler">
            <Button variant="ghost" className="mb-8 text-purple-400 hover:text-purple-300">
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
              <div className="rounded-3xl overflow-hidden border border-white/10">
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
                <span className="inline-block px-4 py-1.5 rounded-full bg-purple-500/20 text-purple-300 text-sm font-medium mb-4">
                  {product.category === 'headset' ? 'VR Başlık' : 'Aksesuar'}
                </span>
                <h1 className="text-4xl font-bold text-white mb-4">{product.name}</h1>
                <p className="text-gray-300 text-lg mb-6">{product.shortDescription}</p>
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {product.price}
                </div>
              </div>

              <Link to="/iletisim">
                <Button size="lg" className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold">
                  Teklif Al
                </Button>
              </Link>
            </motion.div>
          </div>

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Package className="w-6 h-6 mr-2 text-purple-400" />
                Teknik Özellikler
              </h2>
              <div className="space-y-3">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-white font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Package className="w-6 h-6 mr-2 text-purple-400" />
                Kutu İçeriği
              </h2>
              <ul className="space-y-3">
                {product.boxContents.map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Gereksinimler</h2>
              <div className="space-y-3">
                {Object.entries(product.requirements).map(([key, value]) => (
                  <div key={key}>
                    <h3 className="text-purple-400 font-semibold mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1')}</h3>
                    <p className="text-gray-300">{value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Users className="w-6 h-6 mr-2 text-purple-400" />
                Kimler İçin Uygun?
              </h2>
              <ul className="space-y-3">
                {product.suitableFor.map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
