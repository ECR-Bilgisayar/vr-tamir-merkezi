import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CTAFloatButton from '@/components/CTAFloatButton';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
      <Navbar />
      <main className="pt-16 sm:pt-20">
        {children}
      </main>
      <Footer />
      
    </div>
  );
};

export default MainLayout;