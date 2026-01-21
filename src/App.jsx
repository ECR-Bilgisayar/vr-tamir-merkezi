import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import MainLayout from '@/layouts/MainLayout';
import HomePage from '@/pages/HomePage';
import ProductsPage from '@/pages/ProductsPage';
import GamesPage from '@/pages/GamesPage';
import GameDetailPage from '@/pages/GameDetailPage';
import CorporatePage from '@/pages/CorporatePage';
import ContactPage from '@/pages/ContactPage';
import AdminLeadsPage from '@/pages/AdminLeadsPage';
import KiralaPage from '@/pages/KiralaPage';
import ServisPage from '@/pages/ServisPage';
import { Toaster } from '@/components/ui/toaster';
import CheckoutPage from '@/pages/CheckoutPage';


function App() {
  return (
    <ThemeProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/urunler" element={<ProductsPage />} />
            <Route path="/oyunlar" element={<GamesPage />} />
            <Route path="/oyunlar/:slug" element={<GameDetailPage />} />
            <Route path="/kurumsal" element={<CorporatePage />} />
            <Route path="/iletisim" element={<ContactPage />} />
            <Route path="/kirala" element={<KiralaPage />} />
            <Route path="/servis" element={<ServisPage />} />
            <Route path="/admin/leads" element={<AdminLeadsPage />} />
            <Route path="/siparis" element={<CheckoutPage />} />

          </Routes>
        </MainLayout>
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}

export default App;