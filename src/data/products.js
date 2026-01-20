
export const products = [
  {
    id: 1,
    slug: 'meta-quest-3',
    name: 'Meta Quest 3',
    category: 'headset',
    price: 'Günlük kiralama ücreti için teklif alın',
    image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&q=80',
    shortDescription: 'En gelişmiş standalone VR başlığı',
    specs: {
      resolution: '2064 x 2208 per eye',
      refreshRate: '90Hz, 120Hz',
      storage: '128GB / 512GB',
      tracking: '6DoF inside-out tracking',
      controllers: 'Touch Plus Controllers',
      audio: 'Entegre spatial audio'
    },
    boxContents: [
      'Meta Quest 3 Başlığı',
      '2x Touch Plus Controller',
      'Şarj Kablosu ve Adaptör',
      'Silikon Yüz Pedi',
      'Kullanım Kılavuzu'
    ],
    requirements: {
      playArea: 'Minimum 2m x 2m alan',
      power: 'Şarj için standart elektrik prizine erişim',
      internet: 'Wi-Fi bağlantısı (oyun indirme için)'
    },
    suitableFor: [
      'Kurumsal etkinlikler',
      'Fuar standları',
      'AVM aktiviteleri',
      'Eğitim kurumları',
      'Teknoloji seminerleri'
    ]
  },
  {
    id: 2,
    slug: 'htc-vive-xr-elite',
    name: 'HTC Vive XR Elite',
    category: 'headset',
    price: 'Günlük kiralama ücreti için teklif alın',
    image: 'https://images.unsplash.com/photo-1617802690658-1173a812650d?w=800&q=80',
    shortDescription: 'Premium XR deneyimi sunan profesyonel başlık',
    specs: {
      resolution: '1920 x 1920 per eye',
      refreshRate: '90Hz',
      storage: '128GB',
      tracking: '6DoF inside-out tracking',
      controllers: 'Vive XR Controllers',
      audio: 'Hi-Res certified audio'
    },
    boxContents: [
      'HTC Vive XR Elite Başlığı',
      '2x Vive XR Controller',
      'USB-C Şarj Kablosu',
      'Yedek Yüz Pedleri',
      'Taşıma Çantası',
      'Kullanım Kılavuzu'
    ],
    requirements: {
      playArea: 'Minimum 2.5m x 2.5m alan',
      power: 'USB-C şarj için elektrik prizine erişim',
      internet: 'Wi-Fi veya Bluetooth bağlantısı'
    },
    suitableFor: [
      'Profesyonel eğitim simülasyonları',
      'Yüksek kaliteli VR deneyim gerektiren etkinlikler',
      'Kurumsal sunumlar',
      'Mimarlık ve tasarım gösterimleri'
    ]
  },
  {
    id: 3,
    slug: 'playstation-vr2',
    name: 'PlayStation VR2',
    category: 'headset',
    price: 'Günlük kiralama ücreti için teklif alın',
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80',
    shortDescription: 'PS5 ile premium VR oyun deneyimi',
    specs: {
      resolution: '2000 x 2040 per eye',
      refreshRate: '90Hz, 120Hz',
      fieldOfView: '110°',
      tracking: 'Inside-out tracking, Eye tracking',
      controllers: 'PlayStation VR2 Sense Controllers',
      audio: '3D Audio desteği'
    },
    boxContents: [
      'PlayStation VR2 Başlığı',
      '2x VR2 Sense Controller',
      'PlayStation 5 Konsolu',
      'Bağlantı Kabloları',
      'Stereo Kulaklıklar',
      'Kullanım Kılavuzu'
    ],
    requirements: {
      playArea: 'Minimum 2m x 2m alan',
      power: 'PlayStation 5 için elektrik bağlantısı',
      internet: 'PSN hesabı ve internet bağlantısı'
    },
    suitableFor: [
      'Oyun odaklı etkinlikler',
      'Gençlik festivalleri',
      'E-spor turnuvaları',
      'Eğlence merkezleri'
    ]
  },
  {
    id: 4,
    slug: 'samsung-gear-vr',
    name: 'Samsung Gear VR',
    category: 'headset',
    price: 'Günlük kiralama ücreti için teklif alın',
    image: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=800&q=80',
    shortDescription: 'Uygun maliyetli mobil VR deneyimi',
    specs: {
      resolution: 'Samsung telefon ekranı (2560 x 1440)',
      refreshRate: '60Hz',
      fieldOfView: '101°',
      tracking: '3DoF rotational tracking',
      controllers: 'Bluetooth Controller (dahil)',
      audio: 'Telefon audio çıkışı'
    },
    boxContents: [
      'Samsung Gear VR Başlığı',
      'Samsung Galaxy Telefon',
      'Bluetooth Controller',
      'USB Şarj Kablosu',
      'Yüz Pedi',
      'Kullanım Kılavuzu'
    ],
    requirements: {
      playArea: 'Minimum 1.5m x 1.5m alan',
      power: 'Telefon şarjı için elektrik prizine erişim',
      internet: 'Wi-Fi bağlantısı (içerik indirme için)'
    },
    suitableFor: [
      'Bütçe dostu toplu etkinlikler',
      '360° video gösterimleri',
      'Eğitim amaçlı basit simülasyonlar',
      'Tanıtım etkinlikleri'
    ]
  },
  {
    id: 5,
    slug: 'vr-controller-set',
    name: 'VR Controller Set',
    category: 'accessory',
    price: 'Günlük kiralama ücreti için teklif alın',
    image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&q=80',
    shortDescription: 'Yedek ve ekstra controller setleri',
    specs: {
      compatibility: 'Meta Quest, HTC Vive',
      battery: 'Rechargeable Li-ion',
      connectivity: 'Wireless Bluetooth',
      tracking: '6DoF precision tracking'
    },
    boxContents: [
      '2x VR Controller',
      'Şarj Doku',
      'Yedek Piller',
      'Bilek Kayışları'
    ],
    requirements: {
      playArea: 'N/A',
      power: 'USB şarj kablosu',
      internet: 'N/A'
    },
    suitableFor: [
      'Uzun süreli etkinlikler',
      'Çoklu kullanıcı rotasyonu',
      'Yedek ekipman ihtiyacı'
    ]
  },
  {
    id: 6,
    slug: 'vr-hygiene-kit',
    name: 'VR Hijyen Kiti',
    category: 'accessory',
    price: 'Günlük kiralama ücreti için teklif alın',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
    shortDescription: 'Tek kullanımlık hijyen malzemeleri',
    specs: {
      includes: 'Yüz pedleri, temizlik mendilleri, koruyucu kapaklar',
      quantity: '50 adet kullanımlık set',
      material: 'Antibakteriyel, hipoalerjenik'
    },
    boxContents: [
      '50x Tek Kullanımlık Yüz Pedi',
      '100x Antibakteriyel Temizlik Mendili',
      '50x Lens Koruma Örtüsü',
      'El Dezenfektanı (500ml)'
    ],
    requirements: {
      playArea: 'N/A',
      power: 'N/A',
      internet: 'N/A'
    },
    suitableFor: [
      'Tüm toplu kullanım etkinlikleri',
      'Hijyen standartlarına uygunluk',
      'Yüksek katılımlı fuarlar'
    ]
  },
  {
    id: 7,
    slug: 'vr-charging-station',
    name: 'VR Şarj İstasyonu',
    category: 'accessory',
    price: 'Günlük kiralama ücreti için teklif alın',
    image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800&q=80',
    shortDescription: 'Çoklu cihaz şarj çözümü',
    specs: {
      capacity: '4 VR başlık + 8 controller',
      chargingTime: '2-3 saat tam şarj',
      ports: '4x USB-C, 8x USB-A',
      power: '100W güç adaptörü dahil'
    },
    boxContents: [
      'Şarj İstasyonu',
      'Güç Adaptörü',
      '4x USB-C Kablo',
      '8x USB-A Kablo',
      'Kablo Organizatörü'
    ],
    requirements: {
      playArea: 'N/A',
      power: 'Standart 220V priz',
      internet: 'N/A'
    },
    suitableFor: [
      'Uzun süreli etkinlikler',
      'Çoklu cihaz kullanımı',
      'Kesintisiz operasyon gereklilikleri'
    ]
  },
  {
    id: 8,
    slug: 'vr-carry-case',
    name: 'VR Taşıma Çantası',
    category: 'accessory',
    price: 'Günlük kiralama ücreti için teklif alın',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    shortDescription: 'Profesyonel koruyucu taşıma çözümü',
    specs: {
      capacity: '2 VR başlık + aksesuar',
      material: 'Darbeye dayanıklı EVA foam',
      dimensions: '45cm x 35cm x 20cm',
      weight: '1.2kg (boş)'
    },
    boxContents: [
      'Hard Case Çanta',
      'Ayrılabilir Bölmeler',
      'Omuz Askısı',
      'Kilitlenebilir Fermuar'
    ],
    requirements: {
      playArea: 'N/A',
      power: 'N/A',
      internet: 'N/A'
    },
    suitableFor: [
      'Ekipman taşıma',
      'Güvenli depolama',
      'Çoklu lokasyon etkinlikleri'
    ]
  }
];
