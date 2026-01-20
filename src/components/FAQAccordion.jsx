
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQAccordion = () => {
  const faqs = [
    {
      question: 'VR başlıklarını kaç gün önceden rezerve etmeliyim?',
      answer: 'Etkinliğinizden en az 1 hafta önce rezervasyon yapmanızı öneriyoriz. Ancak müsaitlik durumuna göre son dakika rezervasyonları da kabul edebiliyoruz.'
    },
    {
      question: 'Kurulum ve teknik destek dahil mi?',
      answer: 'Evet, tüm paketlerimizde profesyonel kurulum ve etkinlik süresince teknik destek dahildir. Teknik ekibimiz cihazların kurulumu, oyunların yüklenmesi ve sorunsuz çalışması için yerinde bulunur.'
    },
    {
      question: 'Kaç kişi aynı anda VR deneyimi yaşayabilir?',
      answer: 'Bu tamamen kiraladığınız VR başlık sayısına bağlıdır. Örneğin 4 başlık kiralarsanız, aynı anda 4 kişi oyun oynayabilir. Rotasyon sistemiyle tüm katılımcılarınızın deneyim yaşamasını sağlayabiliriz.'
    },
    {
      question: 'Hijyen standartlarınız nelerdir?',
      answer: 'Her kullanıcı için tek kullanımlık yüz pedleri kullanıyoruz. Cihazlar her kullanımdan sonra antibakteriyel solüsyonlarla temizleniyor. Paketlerimizde hijyen kitleri standart olarak yer alıyor.'
    },
    {
      question: 'Etkinlik alanında elektrik ve internet gerekli mi?',
      answer: 'Evet, VR başlıkların şarj edilmesi için elektrik prizine ihtiyaç vardır. Bazı cihazlar için oyun indirmek amacıyla Wi-Fi bağlantısı gerekebilir, ancak çoğu oyun önceden yüklenmiş olarak gelir.'
    },
    {
      question: 'Hangi şehirlere hizmet veriyorsunuz?',
      answer: 'İstanbul merkez olmak üzere tüm Türkiye\'ye hizmet veriyoruz. Şehir dışı etkinlikler için lojistik ve teknik personel maliyetleri ayrıca hesaplanır.'
    },
    {
      question: 'Cihazlarda hasar oluşursa ne olur?',
      answer: 'Normal kullanım koşullarında oluşan küçük aşınmalar ve hasarlar tarafımızca karşılanır. Ancak kasti hasar veya kayıp durumlarında hasar bedeli tahsil edilir. Bu nedenle etkinlik sigortası öneririz.'
    },
    {
      question: 'Fiyatlandırma nasıl yapılıyor?',
      answer: 'Fiyatlar; etkinlik süresi, kullanılacak cihaz sayısı, lokasyon ve özel taleplerinize göre değişiklik gösterir. Detaylı fiyat teklifi için bizimle iletişime geçebilirsiniz.'
    }
  ];

  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      {faqs.map((faq, index) => (
        <AccordionItem
          key={index}
          value={`item-${index}`}
          className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm px-6 data-[state=open]:border-purple-500/30"
        >
          <AccordionTrigger className="text-white hover:text-purple-400 text-left font-semibold py-4">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-gray-400 pb-4">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default FAQAccordion;
