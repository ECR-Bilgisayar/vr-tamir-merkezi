import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Ana Sayfa', path: '/' },
    { name: 'Ürünler', path: '/urunler' },
    { name: 'Oyunlar', path: '/oyunlar' },
    { name: 'Kurumsal', path: '/kurumsal' },
    { name: 'İletişim', path: '/iletisim' }
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-[#0a0e27]/95 backdrop-blur-lg shadow-lg dark:shadow-purple-500/10' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center"
            >
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </motion.div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              VR Tamir Merkezi
            </span>
          </Link>

          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.path
                    ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-600 dark:text-purple-300'
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>

            <Link to="/kirala">
              <Button variant="outline" className="border-purple-500/50 text-purple-600 dark:text-white hover:bg-purple-500/10 font-semibold">
                Kirala
              </Button>
            </Link>
            <Link to="/servis">
              <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold shadow-lg shadow-purple-500/30">
                Servis & Onarım
              </Button>
            </Link>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-900 dark:text-white" />
            ) : (
              <Menu className="w-6 h-6 text-gray-900 dark:text-white" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/98 dark:bg-[#0a0e27]/98 backdrop-blur-lg border-t border-gray-200 dark:border-white/10"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === link.path
                      ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-600 dark:text-purple-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 space-y-3">
                {/* Mobile Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-5 h-5 text-yellow-500" />
                      <span className="text-gray-900 dark:text-white font-medium">Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-5 h-5 text-gray-700" />
                      <span className="text-gray-900 font-medium">Dark Mode</span>
                    </>
                  )}
                </button>

                <Link to="/kirala" onClick={() => setIsMobileMenuOpen(false)} className="block">
                  <Button variant="outline" className="w-full border-purple-500/50 text-purple-600 dark:text-white hover:bg-purple-500/10 font-semibold">
                    Kirala
                  </Button>
                </Link>
                <Link to="/servis" onClick={() => setIsMobileMenuOpen(false)} className="block">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold">
                    Servis & Onarım
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;