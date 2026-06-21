export type EditorialRouteStop = {
  placeId?: string;
  title: string;
  note: string;
  time?: string;
};

export type EditorialRoute = {
  id: string;
  title: string;
  area: string;
  coverImage: string;
  description: string;
  duration: string;
  moodTags: string[];
  stops: EditorialRouteStop[];
};

export const EDITORIAL_ROUTES: EditorialRoute[] = [
  {
    id: 'urla-bir-gun',
    title: 'Urla’da Bir Gün',
    area: 'Urla / Ege',
    coverImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80',
    description: 'Bağ hissi, sakin kıyı ve uzun öğle masası etrafında kurulan yavaş bir gün.',
    duration: '1 gün',
    moodTags: ['yavaş', 'sofra', 'kıyı'],
    stops: [
      { placeId: 'place_url_hic', title: 'Hiç Tadım Atölyesi', note: 'Günün ana masası için rafine bir başlangıç.', time: '12:30' },
      { placeId: 'place_url_dam', title: 'Urla Dam', note: 'Öğleden sonra kısa bir tasarım molası.', time: '15:00' },
      { placeId: 'place_url_liman', title: 'Liman Cafe Urla', note: 'Günü deniz kenarında sade bir kapanışla bitirin.', time: '17:30' },
    ],
  },
  {
    id: 'kadikoy-kahve-rotasi',
    title: 'Kadıköy Kahve Rotası',
    area: 'Kadıköy / İstanbul',
    coverImage: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=900&q=80',
    description: 'Nitelikli kahve, yürünebilir sokaklar ve küçük masa notlarıyla hafif bir şehir rotası.',
    duration: 'Yarım gün',
    moodTags: ['kahve', 'şehir', 'odak'],
    stops: [
      { placeId: 'place_petra_mqnn9pn7', title: 'Petra', note: 'Rotanın nitelikli kahve omurgası.', time: '10:30' },
      { title: 'Moda yürüyüşü', note: 'Kahve sonrası kısa sokak ve sahil arası geçiş.', time: '12:00' },
      { title: 'Akşamüstü ikinci fincan', note: 'Yoğun olmayan bir masada günü yavaşlatın.', time: '15:30' },
    ],
  },
  {
    id: 'karakoy-date-night',
    title: 'Karaköy Date Night',
    area: 'Karaköy / İstanbul',
    coverImage: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=80',
    description: 'Loş ışık, iyi tabak ve yürüyüşle tamamlanan şehirli bir akşam planı.',
    duration: '1 akşam',
    moodTags: ['romantik', 'akşam', 'bar'],
    stops: [
      { placeId: 'place_mangerie_mqno9ynq', title: 'Mangerie', note: 'Akşamın uzun masası için.', time: '19:30' },
      { title: 'Karaköy ara sokakları', note: 'Yemek sonrası kısa ve sakin bir yürüyüş.', time: '21:00' },
      { title: 'Kapanış içkisi', note: 'Gürültüsüz, sohbeti taşıyan bir bar seçin.', time: '22:00' },
    ],
  },
  {
    id: 'cunda-gun-batimi',
    title: 'Cunda Gün Batımı',
    area: 'Cunda / Marmara',
    coverImage: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=900&q=80',
    description: 'Taş sokaklar, ada kahvesi ve gün batımı ışığıyla kurulan kısa bir kaçış.',
    duration: 'Yarım gün',
    moodTags: ['ada', 'gün batımı', 'taş'],
    stops: [
      { placeId: 'place_cun_taskahve', title: 'Taş Kahve', note: 'Adaya varış ritüeli gibi klasik bir mola.', time: '16:00' },
      { placeId: 'place_cun_ayna', title: 'Ayna Cunda', note: 'Işık yumuşarken fotojenik bir ikinci durak.', time: '17:30' },
      { title: 'Sahil kapanışı', note: 'Günü kıyıda kısa bir yürüyüşle bitirin.', time: '19:00' },
    ],
  },
  {
    id: 'alacati-hafta-sonu',
    title: 'Alaçatı Hafta Sonu',
    area: 'Alaçatı / Ege',
    coverImage: 'https://images.unsplash.com/photo-1567996603104-4b98a8e475bb?auto=format&fit=crop&w=900&q=80',
    description: 'Taş sokaklar, fırın kokusu ve rüzgarlı akşamlarla iki güne yayılan seçki.',
    duration: '2 gün',
    moodTags: ['hafta sonu', 'taş sokak', 'rüzgar'],
    stops: [
      { placeId: 'place_ala_imren', title: 'İmren Alaçatı', note: 'Tatlı ve kahveyle hafif bir başlangıç.', time: '11:00' },
      { placeId: 'place_ala_windmill', title: 'Alaçatı Windmill', note: 'Günün fotojenik durağı.', time: '16:30' },
      { placeId: 'place_ala_fiko', title: 'Fiko', note: 'Akşamı daha uzun bir masaya bağlayın.', time: '20:00' },
    ],
  },
  {
    id: 'yagmurlu-gun-izmir',
    title: 'Yağmurlu Gün İzmir',
    area: 'İzmir / Ege',
    coverImage: 'https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?auto=format&fit=crop&w=900&q=80',
    description: 'Kapalı havaya yakışan sıcak içecekler, sakin masalar ve iyi ışık.',
    duration: '1 gün',
    moodTags: ['yağmur', 'sıcak', 'sakin'],
    stops: [
      { placeId: 'place_als_awake', title: 'Awake Coffee & Espresso', note: 'Yağmurlu sabah için net bir kahve başlangıcı.', time: '10:00' },
      { placeId: 'place_bos_bake', title: 'Bake & More Co.', note: 'Tatlı ve yumuşak iç mekan molası.', time: '14:00' },
      { placeId: 'place_bos_punta', title: 'Punta Coffee Roasters', note: 'Günü laptop ya da kitapla kapatmak için.', time: '16:30' },
    ],
  },
];
