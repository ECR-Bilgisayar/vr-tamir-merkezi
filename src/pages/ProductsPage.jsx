
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowRight, Package, Check, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionHeading from '@/components/SectionHeading';
import { products } from '@/data/products';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const ProductsPage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const openModal = (product) => {
    setSelectedProduct(product);
  };

  return (
    <>
      <Helmet>
        <title>VR Ürünleri - VR Başlık ve Aksesuar Kiralama | VR Kiralama</title>
        <meta name="description" content="Meta Quest 3, HTC Vive XR Elite, PlayStation VR2 ve Samsung Gear VR başlıkları ile aksesuarlarını kiralayın." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-[#0a0e27] via-black to-[#0a0e27] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Tüm VR Ekipmanları"
            description="Etkinliğiniz için en son teknoloji VR başlıkları ve aksesuarları"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => openModal(product)}
                className="group cursor-pointer rounded-2xl overflow-hidden bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm hover:border-purple-500/30 transition-all"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 rounded-full bg-purple-500/90 backdrop-blur-sm text-white text-xs font-semibold">
                      {product.category === 'headset' ? 'VR Başlık' : 'Aksesuar'}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-purple-400 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {product.shortDescription}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-purple-400 font-semibold text-sm">
                      İncele
                    </span>
                    <Button variant="ghost" size="sm" className="text-white hover:text-purple-300">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="max-w-4xl bg-[#0a0e27] border-white/10 text-white overflow-y-auto max-h-[90vh]">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold mb-2">{selectedProduct.name}</DialogTitle>
                <DialogDescription className="text-gray-400">
                  {selectedProduct.shortDescription}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                <div className="rounded-xl overflow-hidden border border-white/10">
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="space-y-6">
                   <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <h4 className="font-semibold mb-2 flex items-center text-purple-400"><Package className="w-4 h-4 mr-2"/> Teknik Özellikler</h4>
                    <ul className="text-sm space-y-1 text-gray-300">
                      {Object.entries(selectedProduct.specs).map(([key, value]) => (
                        <li key={key} className="flex justify-between">
                          <span className="capitalize text-gray-500">{key}:</span>
                          <span>{value}</span>
                        </li>
                      ))}
                    </ul>
                   </div>

                   <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <h4 className="font-semibold mb-2 flex items-center text-purple-400"><Check className="w-4 h-4 mr-2"/> Kutu İçeriği</h4>
                    <ul className="text-sm space-y-1 text-gray-300 list-disc list-inside">
                      {selectedProduct.boxContents.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                   </div>

                   <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <h4 className="font-semibold mb-2 flex items-center text-purple-400"><Users className="w-4 h-4 mr-2"/> Uygunluk</h4>
                    <p className="text-sm text-gray-300">{selectedProduct.suitableFor.join(', ')}</p>
                   </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Link to="/kirala" className="w-full md:w-auto">
                  <Button className="w-full md:w-auto bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold">
                    Bu Ürünü Kirala
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductsPage;
