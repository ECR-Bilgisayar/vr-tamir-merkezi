import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Search, Check, Wrench, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import SectionHeading from '@/components/SectionHeading';
import { products } from '@/data/products';
import { Link } from 'react-router-dom';

const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const categories = [
    { id: 'all', name: 'Tümü' },
    { id: 'meta', name: 'Meta Quest' },
    { id: 'oculus', name: 'Oculus' },
    { id: 'htc', name: 'HTC Vive' },
    { id: 'playstation', name: 'PlayStation' },
    { id: 'apple', name: 'Apple' }
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>VR Cihaz Tamir Hizmetleri - VR Tamir Merkezi</title>
        <meta name="description" content="Meta Quest, Oculus, HTC Vive tamir hizmetleri. Profesyonel VR cihaz onarımı." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-[#0a0e27] via-black to-[#0a0e27] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Tamir Hizmetlerimiz"
            description="Tüm VR cihazlarınız için profesyonel onarım hizmeti"
          />

         

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => handleProductClick(product)}
                className="group cursor-pointer rounded-2xl overflow-hidden bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-purple-500/50 transition-all hover:scale-105"
              >
                <div className="relative h-48 overflow-hidden bg-white/5 flex items-center justify-center p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-purple-400 font-semibold text-sm">Detaylar</span>
                    <Wrench className="w-5 h-5 text-purple-400" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">Aradığınız kriterlere uygun ürün bulunamadı.</p>
            </div>
          )}
        </div>
      </div>

      {/* Product Detail Dialog (POPUP) */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl bg-[#0a0e27] border border-purple-500/30 p-0">
          {selectedProduct && (
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Sol: Görsel */}
              <div className="relative h-full min-h-[300px] md:min-h-[400px] bg-white/5 flex items-center justify-center p-8">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="max-w-full max-h-full object-contain"
                />
                <button
                  onClick={() => setIsDialogOpen(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Sağ: İçerik */}
              <div className="p-8 flex flex-col">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {selectedProduct.name}
                  </h2>
                  <p className="text-gray-400 text-sm">{selectedProduct.description}</p>
                </div>

                {/* Hizmet Verdiğimiz Sorunlar */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                    <Wrench className="w-5 h-5 mr-2 text-purple-400" />
                    Hizmet Verdiğimiz Sorunlar
                  </h3>
                  <div className="space-y-3">
                    {selectedProduct.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <div className="mt-8">
                  <Link to="/servis" onClick={() => setIsDialogOpen(false)}>
                    <Button size="lg" className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold">
                      Tamir Talebi Oluştur
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductsPage;