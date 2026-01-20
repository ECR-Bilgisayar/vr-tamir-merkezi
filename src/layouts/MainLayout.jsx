
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CTAFloatButton from '@/components/CTAFloatButton';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0a0e27] text-white">
      <Navbar />
      <main className="pt-16 sm:pt-20">
        {children}
      </main>
      <Footer />
      <CTAFloatButton />
    </div>
  );
};

export default MainLayout;
