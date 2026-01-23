import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Search, Check, Wrench, X, ShoppingCart, ArrowRight, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import SectionHeading from '@/components/SectionHeading';
import { products } from '@/data/products';
import { Link, useNavigate } from 'react-router-dom';
import GameCard from '@/components/GameCard';
import GameVideoDialog from '@/components/GameVideoDialog';
import { games } from '@/data/games';


const ProductsPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // Tamir hizmeti verilen ürün ID'leri
  const repairSupportedIds = [1, 2, 4, 5, 6, 7];

  // Ürün teknik detayları
  const productSpecs = {
    8: { // HTC Vive XR Elite
      resolution: '3840 x 1920 piksel',
      refreshRate: '90 Hz',
      fov: '110°',
      weight: '625g',
      tracking: '6DoF Inside-Out',
      audio: 'Dahili hoparlörler'
    },
    9: { // PlayStation VR2
      resolution: '4000 x 2040 piksel',
      refreshRate: '90/120 Hz',
      fov: '110°',
      weight: '560g',
      tracking: 'Inside-Out + Göz takibi',
      audio: 'Dahili kulaklık'
    },
    3: { // PlayStation VR2
      resolution: '4000 x 2040 piksel',
      refreshRate: '90/120 Hz',
      fov: '110°',
      weight: '560g',
      tracking: 'Inside-Out + Göz takibi',
      audio: 'Dahili kulaklık'
    },
    10: { // Apple Vision Pro
      resolution: '23 milyon piksel',
      refreshRate: '90/96/100 Hz',
      fov: '100°+',
      weight: '600-650g',
      tracking: 'Inside-Out + El ve Göz takibi',
      audio: 'Spatial Audio hoparlörler'
    }
  };

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

  const handleBuyClick = (product) => {
    setIsDialogOpen(false);
    navigate('/satin-al', { state: { product } });
  };

  const handleGameVideoClick = (game) => {
    setSelectedGame(game);
    setIsVideoOpen(true);
  };

  const isRepairSupported = (product) => repairSupportedIds.includes(product?.id);

  // Tamir hizmetleri listesi
  const repairServices = [
    { title: 'Ekran Onarımı' },
    { title: 'Pil Değişimi' },
    { title: 'Controller Tamiri' },
    { title: 'Bağlantı Sorunları' },
    { title: 'Ses Onarımı' },
    { title: 'Yazılım Onarımı' }
  ];


  return (
    <>
      <Helmet>
        <title>VR Cihaz Tamir Hizmetleri - VR Tamir Merkezi</title>
        <meta name="description" content="Meta Quest, Oculus, HTC Vive tamir hizmetleri. Profesyonel VR cihaz onarımı." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-[#0a0e27] dark:via-black dark:to-[#0a0e27] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="VR Dünyası"
            description="VR Dünyası ve oyunları ile ilgili detaylı bilgi için aşağı kaydırabilirsiniz."
          />

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={`${product.id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => handleProductClick(product)}
                className={`group cursor-pointer rounded-2xl overflow-hidden 
                  bg-white dark:bg-[#0d1229]
                  border ${product.purchasable ? 'border-green-300 dark:border-green-500/30' : 'border-gray-200 dark:border-white/10'}
                  hover:border-purple-500/50 
                  transition-all hover:scale-105 
                  shadow-sm dark:shadow-none
                  ${product.purchasable ? 'ring-2 ring-green-500/20' : ''}`}
              >
                <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-white/5 flex items-center justify-center p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                  {product.purchasable && (
                    <div className="absolute top-3 right-3 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                      Satılık
                    </div>
                  )}
                  {!product.purchasable && isRepairSupported(product) && (
                    <div className="absolute top-3 right-3 px-3 py-1 bg-purple-500 text-white text-xs font-bold rounded-full">
                      Tamir Desteği
                    </div>
                  )}

                </div>

                <div className="p-5 bg-white dark:bg-transparent">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    {product.purchasable ? (
                      <>
                        <span className="text-green-600 dark:text-green-400 font-bold text-lg">{product.price?.toLocaleString('tr-TR')} ₺</span>
                        <ShoppingCart className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </>
                    ) : isRepairSupported(product) ? (
                      <>
                        <span className="text-purple-600 dark:text-purple-400 font-semibold text-sm">Tamir Hizmeti</span>
                        <Wrench className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </>
                    ) : (
                      <>
                        <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">Detaylar</span>
                        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-600 dark:text-gray-400 text-lg">Aradığınız kriterlere uygun ürün bulunamadı.</p>
            </div>
          )}
        </div>
      </div>

      {/* Oyunlar */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-black dark:to-[#0a0e27]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="100+ VR Oyunu ve Deneyim" description="Her yaşa ve ilgi alanına uygun zengin içerik" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {games.slice(0, 6).map((game, index) => (
              <GameCard key={game.id} game={game} index={index} onVideoClick={handleGameVideoClick} />
            ))}
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

      {/* Product Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white dark:bg-[#0a0e27] border border-gray-200 dark:border-purple-500/30 p-0 max-w-4xl max-h-[90vh] overflow-y-auto">
          <VisuallyHidden>
            <DialogTitle>{selectedProduct?.name || 'Ürün Detayı'}</DialogTitle>
          </VisuallyHidden>

          {selectedProduct && (
            <>
              {/* SATILIK ÜRÜNLER */}
              {selectedProduct.purchasable && (
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="relative h-full min-h-[300px] md:min-h-[400px] bg-gray-100 dark:bg-white/5 flex items-center justify-center p-8">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="max-w-full max-h-full object-contain"
                    />
                    <button
                      onClick={() => setIsDialogOpen(false)}
                      className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-200 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-gray-300 dark:hover:bg-black/70 transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-700 dark:text-white" />
                    </button>
                    <div className="absolute top-4 left-4 px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-full">
                      Satılık
                    </div>
                  </div>

                  <div className="p-8 flex flex-col bg-white dark:bg-transparent">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {selectedProduct.name}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{selectedProduct.description}</p>

                      <div className="mt-4 p-4 bg-green-50 dark:bg-green-500/10 rounded-xl border border-green-200 dark:border-green-500/20">
                        <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                          {selectedProduct.price?.toLocaleString('tr-TR')} ₺
                        </span>
                        <span className="text-sm text-green-600 dark:text-green-400 ml-2">KDV Dahil</span>
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        <Check className="w-5 h-5 mr-2 text-green-500" />
                        Ürün Özellikleri
                      </h3>
                      <div className="space-y-3">
                        {selectedProduct.features.map((feature, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-500" />
                            <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8">
                      <Button
                        size="lg"
                        onClick={() => handleBuyClick(selectedProduct)}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold"
                      >
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Satın Al
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAMİR DESTEKLİ ÜRÜNLER */}
              {!selectedProduct.purchasable && isRepairSupported(selectedProduct) && (
                <div className="p-0">
                  <div className="relative">
                    <button
                      onClick={() => setIsDialogOpen(false)}
                      className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-gray-200 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-gray-300 dark:hover:bg-black/70 transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-700 dark:text-white" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                      <div className="bg-gray-100 dark:bg-white/5 flex items-center justify-center p-6 md:p-8">
                        <img
                          src={selectedProduct.image}
                          alt={selectedProduct.name}
                          className="max-w-full max-h-48 md:max-h-64 object-contain"
                        />
                      </div>

                      <div className="md:col-span-2 p-6 md:p-8 bg-white dark:bg-transparent">
                        <span className="inline-block px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 text-xs font-medium mb-3">
                          Tamir Hizmeti
                        </span>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                          {selectedProduct.name}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{selectedProduct.description}</p>

                        <Link to="/servis" onClick={() => setIsDialogOpen(false)}>
                          <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold">
                            <Wrench className="w-4 h-4 mr-2" />
                            Tamir Talebi Oluştur
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 md:p-8 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Wrench className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                      Sunduğumuz Tamir Hizmetleri
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {repairServices.map((service, index) => (
                        <div
                          key={index}
                          className="p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10"
                        >
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{service.title}</h4>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Destek Verdiğimiz Sorunlar</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.features.map((feature, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs"
                          >
                            <Check className="w-3 h-3 mr-1" />
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAMİR DESTEĞİ OLMAYAN ÜRÜNLER (Cihaz Bilgisi) */}
              {!selectedProduct.purchasable && !isRepairSupported(selectedProduct) && (
                <div className="p-0">
                  <div className="relative">
                    <button
                      onClick={() => setIsDialogOpen(false)}
                      className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-gray-200 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-gray-300 dark:hover:bg-black/70 transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-700 dark:text-white" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                      <div className="bg-gray-100 dark:bg-white/5 flex items-center justify-center p-6 md:p-8">
                        <img
                          src={selectedProduct.image}
                          alt={selectedProduct.name}
                          className="max-w-full max-h-48 md:max-h-64 object-contain"
                        />
                      </div>

                      <div className="md:col-span-2 p-6 md:p-8 bg-white dark:bg-transparent">
                        <span className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 text-xs font-medium mb-3">
                          Cihaz Bilgisi
                        </span>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                          {selectedProduct.name}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{selectedProduct.description}</p>

                        <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
                          <div className="flex items-center space-x-2">
                            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                            <p className="text-amber-700 dark:text-amber-300 text-xs">Bu cihaza şu an tamir hizmeti vermiyoruz.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 md:p-8 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Info className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                      Teknik Özellikler
                    </h3>

                    {productSpecs[selectedProduct.id] ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {Object.entries(productSpecs[selectedProduct.id]).map(([key, value], index) => (
                          <div
                            key={index}
                            className="p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10"
                          >
                            <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
                              {key === 'resolution' && 'Çözünürlük'}
                              {key === 'refreshRate' && 'Yenileme Hızı'}
                              {key === 'fov' && 'Görüş Alanı'}
                              {key === 'weight' && 'Ağırlık'}
                              {key === 'tracking' && 'Takip Sistemi'}
                              {key === 'audio' && 'Ses Sistemi'}
                            </span>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{value}</h4>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {selectedProduct.features.map((feature, index) => (
                          <div
                            key={index}
                            className="p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10"
                          >
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{feature}</h4>
                          </div>
                        ))}
                      </div>
                    )}


                  </div>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Game Video Dialog */}
      <GameVideoDialog game={selectedGame} open={isVideoOpen} onOpenChange={setIsVideoOpen} />
    </>
  );
};


export default ProductsPage;
