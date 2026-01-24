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
    { name: 'VR Dünyası', path: '/urunler' },
    { name: 'Kirala', path: '/kirala' },
    { name: 'Kurumsal', path: '/kurumsal' },
    { name: 'İletişim', path: '/iletisim' }
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-white/95 dark:bg-[#0a0e27]/95 backdrop-blur-lg shadow-lg dark:shadow-purple-500/10'
        : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link to="/" className="flex items-center group">
            {/* Desktop: Full Logo with Text */}
            <motion.div
              className="hidden sm:flex items-center"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {/* Light mode logo */}
              <img
                src="/logo.png"
                alt="VR Tamir Merkezi"
                className="h-12 md:h-14 lg:h-16 w-auto object-contain drop-shadow-lg dark:hidden"
              />
              {/* Dark mode logo */}
              <img
                src="/beyaz-logo.png"
                alt="VR Tamir Merkezi"
                className="h-12 md:h-14 lg:h-16 w-auto object-contain drop-shadow-lg hidden dark:block"
              />
            </motion.div>

            {/* Mobile: Only Logo Icon */}
            <motion.div
              className="sm:hidden flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {/* Light mode mobile logo */}
              <img
                src="/sadece-logo.png"
                alt="VR Tamir Merkezi"
                className="h-10 w-auto object-contain drop-shadow-lg dark:hidden"
              />
              {/* Dark mode mobile logo */}
              <img
                src="/beyaz-logo.png"
                alt="VR Tamir Merkezi"
                className="h-10 w-auto object-contain drop-shadow-lg hidden dark:block"
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center">
            <div className="flex items-center bg-gray-100/80 dark:bg-white/5 backdrop-blur-sm rounded-full p-1 border border-gray-200/50 dark:border-white/10">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${location.pathname === link.path
                    ? 'text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full shadow-lg shadow-purple-500/30"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Theme Toggle Button */}
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2.5 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-all duration-200 border border-gray-200/50 dark:border-white/10"
              aria-label="Toggle theme"
            >
              <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700" />
                )}
              </motion.div>
            </motion.button>

            {/* CTA Button */}
            <Link to="/servis">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button className="relative overflow-hidden bg-gradient-to-r from-purple-500 via-purple-600 to-blue-500 hover:from-purple-600 hover:via-purple-700 hover:to-blue-600 text-white font-semibold px-6 py-2.5 shadow-lg shadow-purple-500/30 border border-white/20">
                  <span className="relative z-10 flex items-center gap-2">
                    Servis & Onarım
                  </span>
                  {/* Shine effect */}
                  <div className="absolute inset-0 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                </Button>
              </motion.div>
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
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${location.pathname === link.path
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