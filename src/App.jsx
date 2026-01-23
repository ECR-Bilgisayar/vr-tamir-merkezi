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
import AdminLoginPage from '@/pages/AdminLoginPage';
import AdminPanelPage from '@/pages/AdminPanelPage';
import KiralaPage from '@/pages/KiralaPage';
import ServisPage from '@/pages/ServisPage';
import TrackingPage from '@/pages/TrackingPage';
import PurchasePage from '@/pages/PurchasePage';
import { Toaster } from '@/components/ui/toaster';
import CheckoutPage from '@/pages/CheckoutPage';
import ScrollToTop from '@/components/ScrollToTop';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import KVKKPage from '@/pages/KVKKPage';
import TermsPage from '@/pages/TermsPage';


function App() {
  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Admin Routes - Without MainLayout */}
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/admin/panel" element={<AdminPanelPage />} />
          <Route path="/admin/leads" element={<AdminLeadsPage />} />

          {/* Main Site Routes - With MainLayout */}
          <Route path="/*" element={
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
                <Route path="/takip" element={<TrackingPage />} />
                <Route path="/siparis" element={<CheckoutPage />} />
                <Route path="/satin-al" element={<PurchasePage />} />
                <Route path="/gizlilik" element={<PrivacyPolicyPage />} />
                <Route path="/kvkk" element={<KVKKPage />} />
                <Route path="/kullanim-kosullari" element={<TermsPage />} />
              </Routes>
            </MainLayout>
          } />
        </Routes>
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}


export default App;

