export type TurkeyRegionName =
  | 'Marmara'
  | 'Ege'
  | 'Akdeniz'
  | 'İç Anadolu'
  | 'Karadeniz'
  | 'Doğu Anadolu'
  | 'Güneydoğu Anadolu';

export type TurkeyCity = {
  plateCode: string;
  name: string;
  region: TurkeyRegionName;
  coverImage: string;
  why: string;
  tags: string[];
};

export const TURKEY_REGION_FILTERS: ('Tümü' | TurkeyRegionName)[] = [
  'Tümü',
  'Marmara',
  'Ege',
  'Akdeniz',
  'İç Anadolu',
  'Karadeniz',
  'Doğu Anadolu',
  'Güneydoğu Anadolu',
];

export const regionCoverImages: Record<TurkeyRegionName, string> = {
  Marmara: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=900&q=80',
  Ege: 'https://images.unsplash.com/photo-1567996603104-4b98a8e475bb?auto=format&fit=crop&w=900&q=80',
  Akdeniz: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=900&q=80',
  'İç Anadolu': 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?auto=format&fit=crop&w=900&q=80',
  Karadeniz: 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?auto=format&fit=crop&w=900&q=80',
  'Doğu Anadolu': 'https://images.unsplash.com/photo-1606046604972-77cc76aee944?auto=format&fit=crop&w=900&q=80',
  'Güneydoğu Anadolu': 'https://images.unsplash.com/photo-1574192324001-ee41e18ed679?auto=format&fit=crop&w=900&q=80',
};

const city = (
  plateCode: string,
  name: string,
  region: TurkeyRegionName,
  why = `${name} çevresinde editör seçkileri ve yerel keşifler.`,
  tags: string[] = []
): TurkeyCity => ({
  plateCode,
  name,
  region,
  coverImage: regionCoverImages[region],
  why,
  tags: tags.length > 0 ? tags : [region.toLowerCase(), 'şehir', 'keşif'],
});

export const TURKEY_CITIES: TurkeyCity[] = [
  city('01', 'Adana', 'Akdeniz'),
  city('02', 'Adıyaman', 'Güneydoğu Anadolu'),
  city('03', 'Afyonkarahisar', 'Ege'),
  city('04', 'Ağrı', 'Doğu Anadolu'),
  city('05', 'Amasya', 'Karadeniz'),
  city('06', 'Ankara', 'İç Anadolu', 'Sakin kafeler, müzeler ve yalın şehir ritmi için iyi bir merkez.', ['müze', 'sakin', 'şehir']),
  city('07', 'Antalya', 'Akdeniz', 'Kaleiçi sokakları, koylar ve güneşli uzun gün planları.', ['deniz', 'tarih', 'gün batımı']),
  city('08', 'Artvin', 'Karadeniz'),
  city('09', 'Aydın', 'Ege'),
  city('10', 'Balıkesir', 'Marmara', 'Cunda, Ayvalık ve ada ruhuyla kuzey Ege geçişi.', ['ada', 'zeytin', 'kahve']),
  city('11', 'Bilecik', 'Marmara'),
  city('12', 'Bingöl', 'Doğu Anadolu'),
  city('13', 'Bitlis', 'Doğu Anadolu'),
  city('14', 'Bolu', 'Karadeniz'),
  city('15', 'Burdur', 'Akdeniz'),
  city('16', 'Bursa', 'Marmara'),
  city('17', 'Çanakkale', 'Marmara', 'Bozcaada ve kıyı kasabalarıyla hafif, rüzgarlı bir kaçış.', ['ada', 'şarap', 'rüzgar']),
  city('18', 'Çankırı', 'İç Anadolu'),
  city('19', 'Çorum', 'Karadeniz'),
  city('20', 'Denizli', 'Ege'),
  city('21', 'Diyarbakır', 'Güneydoğu Anadolu'),
  city('22', 'Edirne', 'Marmara'),
  city('23', 'Elazığ', 'Doğu Anadolu'),
  city('24', 'Erzincan', 'Doğu Anadolu'),
  city('25', 'Erzurum', 'Doğu Anadolu'),
  city('26', 'Eskişehir', 'İç Anadolu', 'Genç şehir enerjisi, yürünebilir sokaklar ve kahve molaları.', ['kahve', 'nehir', 'şehir']),
  city('27', 'Gaziantep', 'Güneydoğu Anadolu', 'Sofra kültürü, bakır çarşısı ve yoğun lezzet hafızası.', ['sofra', 'baharat', 'çarşı']),
  city('28', 'Giresun', 'Karadeniz'),
  city('29', 'Gümüşhane', 'Karadeniz'),
  city('30', 'Hakkari', 'Doğu Anadolu'),
  city('31', 'Hatay', 'Akdeniz'),
  city('32', 'Isparta', 'Akdeniz'),
  city('33', 'Mersin', 'Akdeniz'),
  city('34', 'İstanbul', 'Marmara', 'Mahalle mahalle değişen kültür, yemek ve çağdaş şehir enerjisi.', ['şehir', 'galeri', 'sofra']),
  city('35', 'İzmir', 'Ege', 'Kahve, sahil, tasarım ve gastronomi arasında dengeli bir başlangıç.', ['kahve', 'kıyı', 'tasarım']),
  city('36', 'Kars', 'Doğu Anadolu'),
  city('37', 'Kastamonu', 'Karadeniz'),
  city('38', 'Kayseri', 'İç Anadolu'),
  city('39', 'Kırklareli', 'Marmara'),
  city('40', 'Kırşehir', 'İç Anadolu'),
  city('41', 'Kocaeli', 'Marmara'),
  city('42', 'Konya', 'İç Anadolu'),
  city('43', 'Kütahya', 'Ege'),
  city('44', 'Malatya', 'Doğu Anadolu'),
  city('45', 'Manisa', 'Ege'),
  city('46', 'Kahramanmaraş', 'Akdeniz'),
  city('47', 'Mardin', 'Güneydoğu Anadolu', 'Taş teraslar, dar sokaklar ve altın saat yürüyüşleri.', ['taş', 'teras', 'tarih']),
  city('48', 'Muğla', 'Ege', 'Datça, Göcek ve kıyı kasabalarıyla yavaş rota omurgası.', ['koy', 'tekne', 'yavaş']),
  city('49', 'Muş', 'Doğu Anadolu'),
  city('50', 'Nevşehir', 'İç Anadolu', 'Kapadokya deneyiminin vadiler, taş oteller ve gün doğumuyla merkezi.', ['vadi', 'taş', 'balon']),
  city('51', 'Niğde', 'İç Anadolu'),
  city('52', 'Ordu', 'Karadeniz'),
  city('53', 'Rize', 'Karadeniz'),
  city('54', 'Sakarya', 'Marmara'),
  city('55', 'Samsun', 'Karadeniz'),
  city('56', 'Siirt', 'Güneydoğu Anadolu'),
  city('57', 'Sinop', 'Karadeniz'),
  city('58', 'Sivas', 'İç Anadolu'),
  city('59', 'Tekirdağ', 'Marmara'),
  city('60', 'Tokat', 'Karadeniz'),
  city('61', 'Trabzon', 'Karadeniz', 'Yağmur, yayla hissi ve Karadeniz kıyısında sıcak molalar.', ['yağmur', 'yayla', 'çay']),
  city('62', 'Tunceli', 'Doğu Anadolu'),
  city('63', 'Şanlıurfa', 'Güneydoğu Anadolu'),
  city('64', 'Uşak', 'Ege'),
  city('65', 'Van', 'Doğu Anadolu'),
  city('66', 'Yozgat', 'İç Anadolu'),
  city('67', 'Zonguldak', 'Karadeniz'),
  city('68', 'Aksaray', 'İç Anadolu'),
  city('69', 'Bayburt', 'Karadeniz'),
  city('70', 'Karaman', 'İç Anadolu'),
  city('71', 'Kırıkkale', 'İç Anadolu'),
  city('72', 'Batman', 'Güneydoğu Anadolu'),
  city('73', 'Şırnak', 'Güneydoğu Anadolu'),
  city('74', 'Bartın', 'Karadeniz'),
  city('75', 'Ardahan', 'Doğu Anadolu'),
  city('76', 'Iğdır', 'Doğu Anadolu'),
  city('77', 'Yalova', 'Marmara'),
  city('78', 'Karabük', 'Karadeniz'),
  city('79', 'Kilis', 'Güneydoğu Anadolu'),
  city('80', 'Osmaniye', 'Akdeniz'),
  city('81', 'Düzce', 'Karadeniz'),
];

export const cityRegionByName = TURKEY_CITIES.reduce<Record<string, TurkeyRegionName>>((acc, item) => {
  acc[item.name] = item.region;
  return acc;
}, {});
