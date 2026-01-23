import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicyPage = () => {
    return (
        <>
            <Helmet>
                <title>Gizlilik Politikası - VR Tamir Merkezi</title>
                <meta name="description" content="VR Tamir Merkezi gizlilik politikası. Kişisel verilerinizin nasıl korunduğunu öğrenin." />
            </Helmet>

            <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-[#0a0e27] dark:via-black dark:to-[#0a0e27] py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <Link to="/" className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:underline mb-6">
                            <ArrowLeft className="w-4 h-4" />
                            Ana Sayfaya Dön
                        </Link>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                                <Shield className="w-7 h-7 text-white" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                                Gizlilik Politikası
                            </h1>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">
                            Son güncelleme: Ocak 2026
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="prose prose-lg dark:prose-invert max-w-none"
                    >
                        <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 p-8 space-y-8">
                            <section>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">1. Giriş</h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    VR Tamir Merkezi olarak, müşterilerimizin gizliliğine büyük önem veriyoruz. Bu Gizlilik Politikası,
                                    web sitemizi ziyaret ettiğinizde ve hizmetlerimizi kullandığınızda kişisel verilerinizin nasıl
                                    toplandığını, kullanıldığını ve korunduğunu açıklamaktadır.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">2. Toplanan Veriler</h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    Hizmetlerimizi sunabilmek için aşağıdaki kişisel verileri toplayabiliriz:
                                </p>
                                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                                    <li>Ad ve soyad</li>
                                    <li>E-posta adresi</li>
                                    <li>Telefon numarası</li>
                                    <li>Şirket/kurum bilgileri</li>
                                    <li>Servis talep bilgileri (cihaz türü, arıza açıklaması)</li>
                                    <li>IP adresi ve tarayıcı bilgileri</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">3. Verilerin Kullanım Amacı</h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    Topladığımız veriler aşağıdaki amaçlarla kullanılmaktadır:
                                </p>
                                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                                    <li>Servis ve kiralama taleplerinin işlenmesi</li>
                                    <li>Müşteri ile iletişim kurulması</li>
                                    <li>Hizmet kalitesinin artırılması</li>
                                    <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                                    <li>İstatistiksel analizler</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">4. Veri Güvenliği</h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Kişisel verilerinizi korumak için endüstri standartlarında güvenlik önlemleri uyguluyoruz.
                                    SSL şifreleme, güvenli sunucular ve düzenli güvenlik güncellemeleri ile verilerinizin
                                    güvenliğini sağlıyoruz.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">5. Çerezler</h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Web sitemiz, kullanıcı deneyimini geliştirmek için çerezler kullanmaktadır. Çerezler,
                                    tercihlerinizi hatırlamamıza ve site kullanımını analiz etmemize yardımcı olur.
                                    Tarayıcı ayarlarınızdan çerezleri kontrol edebilirsiniz.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">6. Üçüncü Taraflarla Paylaşım</h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Kişisel verileriniz, yasal zorunluluklar dışında üçüncü taraflarla paylaşılmaz.
                                    Hizmet sağlayıcılarımız (kargo, e-posta servisleri) ile yalnızca hizmet sunumu için
                                    gerekli minimum veri paylaşılır.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">7. İletişim</h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Gizlilik politikamız hakkında sorularınız için bizimle iletişime geçebilirsiniz:
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 mt-2">
                                    <strong>E-posta:</strong> vr@vrtamirmerkezi.com<br />
                                    <strong>Telefon:</strong> +90 850 228 7574<br />
                                    <strong>Adres:</strong> İstoç, 32. Ada No:78-80, Bağcılar, İstanbul
                                </p>
                            </section>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default PrivacyPolicyPage;
