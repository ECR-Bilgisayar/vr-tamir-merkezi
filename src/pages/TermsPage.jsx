import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ScrollText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsPage = () => {
    return (
        <>
            <Helmet>
                <title>Kullanım Koşulları - VR Tamir Merkezi</title>
                <meta name="description" content="VR Tamir Merkezi kullanım koşulları ve hizmet şartları." />
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
                                <ScrollText className="w-7 h-7 text-white" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                                Kullanım Koşulları
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
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">1. Genel Hükümler</h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Bu web sitesini kullanarak, aşağıda belirtilen kullanım koşullarını kabul etmiş sayılırsınız.
                                    VR Tamir Merkezi, bu koşulları önceden haber vermeksizin değiştirme hakkını saklı tutar.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">2. Servis Hizmetleri</h2>
                                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                                    <li>Servis talepleri değerlendirmeye alınır ve müşteri ile iletişime geçilir.</li>
                                    <li>Arıza tespiti sonrası fiyat teklifi sunulur, onarım müşteri onayı ile başlar.</li>
                                    <li>Onarım süreleri cihaz ve arıza durumuna göre değişkenlik gösterebilir.</li>
                                    <li>Onarım garantisi, yapılan işleme göre 1-6 ay arasında değişir.</li>
                                    <li>Müşteri tarafından 30 gün içinde teslim alınmayan cihazlar için saklama ücreti uygulanabilir.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">3. Kiralama Hizmetleri</h2>
                                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                                    <li>Kiralama talepleri kurumsal müşterilere yöneliktir.</li>
                                    <li>Kiralama süresi ve ücretleri talep edilen ürün ve süreye göre belirlenir.</li>
                                    <li>Kiralanan cihazların hasarı veya kaybı durumunda müşteri sorumludur.</li>
                                    <li>Kiralama başlangıcında depozito talep edilebilir.</li>
                                    <li>Cihazların teslim ve iade koşulları sözleşmede belirtilir.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">4. Ödeme Koşulları</h2>
                                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                                    <li>Servis ücretleri peşin veya cihaz tesliminde ödenir.</li>
                                    <li>Kurumsal müşteriler için fatura ile ödeme seçeneği mevcuttur.</li>
                                    <li>Kiralama ödemeleri belirlenen vadelerde yapılmalıdır.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">5. Sorumluluk Sınırları</h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    VR Tamir Merkezi, mücbir sebeplerden kaynaklanan gecikmelerden ve internet bağlantısı
                                    sorunları, doğal afetler, salgın hastalıklar gibi kontrolü dışındaki olaylardan
                                    sorumlu tutulamaz.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">6. Fikri Mülkiyet</h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Bu web sitesindeki tüm içerik, tasarım, logo ve görseller VR Tamir Merkezi'ne aittir.
                                    İzinsiz kullanımı yasaktır.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">7. Uyuşmazlıkların Çözümü</h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Bu koşullardan doğan uyuşmazlıklarda İstanbul Mahkemeleri ve İcra Daireleri yetkilidir.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">8. İletişim</h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Kullanım koşulları hakkında sorularınız için:
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

export default TermsPage;
