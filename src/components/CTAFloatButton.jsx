
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Phone, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const CTAFloatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleWhatsApp = () => {
    toast({
      title: "WhatsApp Desteği",
      description: "🚧 WhatsApp entegrasyonu yakında eklenecek! Şimdilik iletişim formunu kullanabilirsiniz.",
    });
  };

  const handleCall = () => {
    toast({
      title: "Telefon Desteği",
      description: "🚧 Arama özelliği yakında aktif olacak! Şimdilik: +90 212 555 0123",
    });
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg shadow-purple-500/50 flex items-center justify-center text-white"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 z-50 flex flex-col space-y-3"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleWhatsApp}
              className="px-6 py-3 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-medium shadow-lg flex items-center space-x-2 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCall}
              className="px-6 py-3 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-medium shadow-lg flex items-center space-x-2 transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span>Arayın</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CTAFloatButton;
