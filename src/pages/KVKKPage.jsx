import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const KVKKPage = () => {
    return (
        <>
            <Helmet>
                <title>KVKK Aydınlatma Metni - VR Tamir Merkezi</title>
                <meta name="description" content="VR Tamir Merkezi KVKK aydınlatma metni. 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında haklarınız." />
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
                                <FileText className="w-7 h-7 text-white" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                                KVKK Aydınlatma Metni
                            </h1>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">
                            6698 Sayılı Kişisel Verilerin Korunması Kanunu Kapsamında
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
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">1. Veri Sorumlusu</h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verileriniz;
                                    veri sorumlusu olarak VR Tamir Merkezi tarafından aşağıda açıklanan kapsamda işlenebilecektir.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">2. Kişisel Verilerin İşlenme Amacı</h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:
                                </p>
                                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                                    <li>Servis ve onarım hizmetlerinin yürütülmesi</li>
                                    <li>Kiralama taleplerinin değerlendirilmesi ve işlenmesi</li>
                                    <li>Müşteri ilişkileri yönetimi</li>
                                    <li>Fatura ve ödeme işlemlerinin gerçekleştirilmesi</li>
                                    <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                                    <li>Hizmet kalitesinin artırılması</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">3. Kişisel Verilerin Aktarımı</h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Kişisel verileriniz, KVKK'nın 8. ve 9. maddelerinde belirtilen kişisel veri işleme şartları
                                    çerçevesinde; iş ortaklarımıza, tedarikçilerimize, kanunen yetkili kamu kurumlarına ve
                                    hizmet aldığımız üçüncü kişilere aktarılabilecektir.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">4. Kişisel Veri Toplamanın Yöntemi ve Hukuki Sebebi</h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Kişisel verileriniz; web sitemiz, e-posta, telefon ve fiziksel formlar aracılığıyla
                                    elektronik ve fiziksel ortamda toplanmaktadır. Bu veriler KVKK'nın 5. maddesinde belirtilen;
                                    sözleşmenin kurulması ve ifası, hukuki yükümlülüklerin yerine getirilmesi ve meşru menfaat
                                    hukuki sebeplerine dayanılarak işlenmektedir.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">5. Kişisel Veri Sahibinin Hakları</h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:
                                </p>
                                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                                    <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                                    <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme</li>
                                    <li>Kişisel verilerin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
                                    <li>Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme</li>
                                    <li>Kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme</li>
                                    <li>KVKK'nın 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerin silinmesini veya yok edilmesini isteme</li>
                                    <li>Kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğraması hâlinde zararın giderilmesini talep etme</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">6. Başvuru Yöntemi</h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Yukarıda belirtilen haklarınızı kullanmak için aşağıdaki iletişim bilgilerinden bize ulaşabilirsiniz:
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 mt-2">
                                    <strong>E-posta:</strong> vr@vrtamirmerkezi.com<br />
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

export default KVKKPage;
