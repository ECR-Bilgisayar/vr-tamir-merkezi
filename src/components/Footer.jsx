import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Package, ShoppingBag } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-100 to-gray-200 dark:from-[#0a0e27] dark:to-black border-t border-gray-300 dark:border-white/5">
      {/* Tracking Banner - Subtle banner matching site theme */}
      <div className="bg-purple-500/10 dark:bg-purple-500/5 border-b border-purple-500/20 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/takip"
            className="flex items-center justify-center gap-2 text-purple-700 dark:text-purple-400 font-medium hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
          >
            <Package className="w-5 h-5" />
            <span>📦 Sipariş / Servis Takip</span>
            <span className="text-purple-500 dark:text-purple-500/70">— Durumunuzu buradan sorgulayın →</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <Link to="/" className="flex items-center space-x-3 mb-4 group">
              <img
                src="/sadece-logo.png"
                alt="VR Tamir Merkezi Logo"
                className="w-10 h-10 rounded-lg group-hover:scale-105 transition-transform duration-300"
              />
              <img
                src="/sadece-yazi.png"
                alt="VR Tamir Merkezi"
                className="h-7 object-contain group-hover:opacity-90 transition-opacity duration-300"
              />
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Türkiye'nin lider VR Tamir ve kiralama platformu. Kurumsal etkinlikler, fuarlar ve özel organizasyonlar için profesyonel VR çözümleri.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://www.facebook.com/vrtamirmerkezi"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-white/5 hover:bg-purple-100 dark:hover:bg-purple-500/20 flex items-center justify-center transition-all"
              >
                <Facebook className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </a>
              <a
                href="https://x.com/vrtamirmerkezi"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-white/5 hover:bg-purple-100 dark:hover:bg-purple-500/20 flex items-center justify-center transition-all"
              >
                <Twitter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </a>
              <a
                href="https://www.instagram.com/vrtamirmerkezi"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-white/5 hover:bg-purple-100 dark:hover:bg-purple-500/20 flex items-center justify-center transition-all"
              >
                <Instagram className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4">Hızlı Linkler</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link to="/urunler" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors">
                  Ürünler
                </Link>
              </li>
              <li>
                <Link to="/oyunlar" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors">
                  Oyunlar
                </Link>
              </li>
              <li>
                <Link to="/kurumsal" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors">
                  Kurumsal
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4">Hizmetler</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/takip" className="text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 text-sm font-medium transition-colors">
                  Servis Takip
                </Link>
              </li>
              <li>
                <Link to="/servis" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors">
                  VR Servis & Onarım
                </Link>
              </li>
              <li>
                <Link to="/kirala" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors">
                  VR Gözlük Kiralama
                </Link>
              </li>
              <li>
                <Link to="/satin-al" className="text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300 text-sm font-medium transition-colors flex items-center gap-1">
                  🛒 VR Hijyen Gözlük Bandı Satın Al
                </Link>
              </li>
              <li>
                <span className="text-gray-600 dark:text-gray-400 text-sm">Fuar & Etkinlik Desteği</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4">İletişim</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-400 text-sm">İstoç, 32. Ada No:78-80, Bağcılar, İstanbul</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400 text-sm">+90 850 228 7574</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400 text-sm">vr@vrtamirmerkezi.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-300 dark:border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 dark:text-gray-500 text-sm">
              © {currentYear} VR Tamir Merkezi. Tüm hakları saklıdır.
            </p>
            <div className="flex space-x-6">
              <Link to="/gizlilik" className="text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors">
                Gizlilik Politikası
              </Link>
              <Link to="/kullanim-kosullari" className="text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors">
                Kullanım Koşulları
              </Link>
              <Link to="/kvkk" className="text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors">
                KVKK
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
