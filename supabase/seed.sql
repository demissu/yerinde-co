-- Seed data generated from src/data/places.ts.
-- Run supabase/schema.sql first, then this file.

create temporary table yerinde_seed_places (
  sort_order integer not null,
  data jsonb not null
) on commit drop;

insert into yerinde_seed_places (sort_order, data) values
  (1, '{"id":"place_als_leone","name":"Leone Patisserie & Boulangerie","city":"İzmir","district":"Alsancak","category":"Dessert","priceLevel":"₺₺₺","rating":4.8,"reviewCount":312,"atmosphereTags":["French Bakery","Aesthetic","Fresh Croissant","Pastel Tones"],"editorialDescription":"A delicate French getaway in the heart of İzmir, known for flaky warm croissants and perfect tarts.","longDescription":"In Leone, every detail is styled to recreate a classic Parisian bistro. From the pastel-coloured tea cups to the marble-top tables and the fragrance of freshly baked sourdough croissants spreading down Alsancak’s backstreets, this patisserie delivers an exceptional sensory experience.","image":"https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=800&q=80","address":"Kültür Mh., Şevket Özçelik Sk. No:2, 35220 Konak/İzmir","coordinates":{"lat":38.4357,"lng":27.1423,"x":28,"y":52},"attributes":{"coffeeRating":4.5,"designFactor":4.9,"quietScore":3.5,"seaView":false,"affordable":false,"premium":true,"workFriendly":true,"dateSpot":true,"photogenic":true},"features":["Outdoor seating","Exceptional pastries","Free Wi-Fi","Pet friendly","Wheelchair accessibility"]}'::jsonb),
  (2, '{"id":"place_als_awake","name":"Awake Coffee & Espresso","city":"İzmir","district":"Alsancak","category":"Coffee","priceLevel":"₺₺","rating":4.7,"reviewCount":184,"atmosphereTags":["Specialty Coffee","Minimalist","Quiet Zone","Wabi-Sabi"],"editorialDescription":"A minimal sanctuary designed for coffee purists and creative focus, featuring artisanal third-wave brewing.","longDescription":"Awake brings the strict minimalist aesthetic of Japanese and Nordic coffee shops to İzmir. Utilizing beautiful raw concrete surfaces, blonde oak woods, and high-quality brewing gear, it provides a quiet sanctuary away from the hustle of Alsancak.","image":"https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=800&q=80","address":"Kültür Mh., 1378. Sk. No:4/A, 35220 Konak/İzmir","coordinates":{"lat":38.4346,"lng":27.1435,"x":29,"y":56},"attributes":{"coffeeRating":5,"designFactor":4.8,"quietScore":4.6,"seaView":false,"affordable":true,"premium":false,"workFriendly":true,"dateSpot":false,"photogenic":true},"features":["V60 Brewing","High speed Wi-Fi","Lots of wall plugs","Comfortable chairs","Roastery beans"]}'::jsonb),
  (3, '{"id":"place_als_lapuerta","name":"La Puerta","city":"İzmir","district":"Alsancak","category":"Bar","priceLevel":"₺₺","rating":4.6,"reviewCount":520,"atmosphereTags":["Craft Beer","Cosmopolitan","Intimate Patio","Traveler’s Hub"],"editorialDescription":"A colorful, globe-trotting bar featuring an impressive international beer selection and antique library decor.","longDescription":"Housed in an old, authentic İzmir stone mansion, La Puerta is structured around travel memories. Shelves stacked with globes, maps, and ancient dictionaries frame a cozy courtyard filled with conversations, soft string lighting, and the best gastropub menu in the district.","image":"https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80","address":"Alsancak Mh., 1469. Sk. No:6, 35220 Konak/İzmir","coordinates":{"lat":38.4411,"lng":27.1462,"x":31,"y":45},"attributes":{"coffeeRating":3,"designFactor":4.7,"quietScore":2.2,"seaView":false,"affordable":true,"premium":false,"workFriendly":false,"dateSpot":true,"photogenic":true},"features":["Heated courtyard","100+ beer varieties","Good music","Tasty burgers","Vegetarian options"]}'::jsonb),
  (4, '{"id":"place_bos_saporito","name":"Saporito Artisan Bakery","city":"İzmir","district":"Bostanlı","category":"Breakfast","priceLevel":"₺₺","rating":4.5,"reviewCount":95,"atmosphereTags":["Sourdough","Bostanlı Vibe","Cozy Patio","Locals Favorite"],"editorialDescription":"The perfect spot in Bostanlı for hand-rolled pastries, organic sourdough, and relaxed weekend morning plates.","longDescription":"Saporito captures the slow and tranquil essence of Bostanlı neighborhood living. Famous for their local olive breakfast bowls and perfectly hydrated sourdough toasts, the bakery offers a leafy sidewalk patio that instantly makes you feel at ease.","image":"https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=800&q=80","address":"Bostanlı Mh., Cemal Gürsel Cd. No: 422, Karşıyaka/İzmir","coordinates":{"lat":38.4552,"lng":27.1118,"x":18,"y":25},"attributes":{"coffeeRating":4.2,"designFactor":4.4,"quietScore":4,"seaView":false,"affordable":true,"premium":false,"workFriendly":true,"dateSpot":false,"photogenic":false},"features":["Sourdough artisan breads","Pet friendly","Outdoor patio","Homemade jams"]}'::jsonb),
  (5, '{"id":"place_bos_punta","name":"Punta Coffee Roasters","city":"İzmir","district":"Bostanlı","category":"Coffee","priceLevel":"₺₺","rating":4.8,"reviewCount":142,"atmosphereTags":["Micro Roasters","Laptop Friendly","Industrial Edge","Excellent Chemex"],"editorialDescription":"A dynamic micro-roastery where remote workers and coffee enthusiasts mingle, styled with iron and green foliage.","longDescription":"Punta Roasters roast their beans right in the shop. It serves as Bostanlı’s unofficial collaborative workspace, equipped with wide shared oak tables, custom warm spot lighting, and high-frequency jazz playlists playing softly in the background.","image":"https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?auto=format&fit=crop&w=800&q=80","address":"Bostanlı Mh., 1807. Sk. No:16/A, Karşıyaka/İzmir","coordinates":{"lat":38.4565,"lng":27.1129,"x":20,"y":22},"attributes":{"coffeeRating":4.9,"designFactor":4.5,"quietScore":3.8,"seaView":false,"affordable":true,"premium":false,"workFriendly":true,"dateSpot":false,"photogenic":true},"features":["In-house coffee roaster","Gigabit Wi-Fi","Spacious tables","Organic milk options","Air conditioning"]}'::jsonb),
  (6, '{"id":"place_bos_bake","name":"Bake & More Co.","city":"İzmir","district":"Bostanlı","category":"Dessert","priceLevel":"₺₺","rating":4.6,"reviewCount":112,"atmosphereTags":["San Sebastian","Scandinavian Interior","Cream Colors","Hygge"],"editorialDescription":"Elegant, Scandinavian-inspired dessert house featuring a legendary Basque cheesecake cooked daily.","longDescription":"Combining soft cream surfaces, warm-coloured wool fabrics, and organic pottery, Bake & More Co. offers a tranquil hygge environment. Their Basque cheesecake is gooey in the center and carries a perfectly caramelized obsidian crust.","image":"https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80","address":"Bostanlı Mh., 1792. Sk. No: 6, Karşıyaka/İzmir","coordinates":{"lat":38.4548,"lng":27.1139,"x":22,"y":27},"attributes":{"coffeeRating":4.1,"designFactor":4.8,"quietScore":4.2,"seaView":false,"affordable":true,"premium":false,"workFriendly":true,"dateSpot":true,"photogenic":true},"features":["Fresh baked goods daily","Quiet ambient sound","Great herbal tea menu","Minimal porcelain"]}'::jsonb),
  (7, '{"id":"place_url_hic","name":"Hiç Tadım Atölyesi","city":"İzmir","district":"Urla","category":"Food","priceLevel":"₺₺₺₺","rating":4.9,"reviewCount":289,"atmosphereTags":["Farm-to-Table","Organic Olive Oil","Stone Mansion","Gastronomic Art"],"editorialDescription":"A Michelin-style gastronomic studio nestled inside an 150-year-old stone house, using their own forest harvest.","longDescription":"Hiç Tadım Atölyesi is pioneers of the Urla Gastronomy Route. They harvest wild olives, herbs, and truffles directly from their private Urla Olive Forest and turn them into incredible Aegean-Mediterranean fusion dishes. Dine with premium home-crafted wines under beautiful dim pendant lamps and high wooden arches.","image":"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80","address":"Yenice Mh., Sanat Sokağı, 54. Sk. No:2, 35430 Urla/İzmir","coordinates":{"lat":38.3242,"lng":26.7645,"x":42,"y":78},"attributes":{"coffeeRating":4.4,"designFactor":5,"quietScore":4.5,"seaView":false,"affordable":false,"premium":true,"workFriendly":false,"dateSpot":true,"photogenic":true},"features":["Wine tasting cellar","Organic garden ingredients","Romantic candlelight","Stunning stone design","Reservations required"]}'::jsonb),
  (8, '{"id":"place_url_liman","name":"Liman Cafe Urla","city":"İzmir","district":"Urla","category":"Breakfast","priceLevel":"₺₺","rating":4.4,"reviewCount":310,"atmosphereTags":["Sea Breeze","Harbor View","Fisherman Vibe","Traditional Breakfast"],"editorialDescription":"Watch the slow fishing boats go by while enjoying traditional Boyoz, Aegean olives, and steep Turkish tea.","longDescription":"Located directly on the Urla Harbor quay, Liman Cafe provides a timeless Aegean fishing village feel. Enjoy rustic wooden benches right next to the saltwater, warm afternoon breezes, and rich, uncomplicated local breakfast platters.","image":"https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=800&q=80","address":"İskele Mh., İskele Cd. No:44, 35430 Urla/İzmir","coordinates":{"lat":38.3562,"lng":26.7728,"x":45,"y":72},"attributes":{"coffeeRating":3.5,"designFactor":4,"quietScore":3.2,"seaView":true,"affordable":true,"premium":false,"workFriendly":false,"dateSpot":true,"photogenic":true},"features":["Direct waterfront tables","Heated outdoor seating","Traditional Turkish tea","Fresh Aegean boyoz"]}'::jsonb),
  (9, '{"id":"place_url_dam","name":"Urla Dam Cafe & Art","city":"İzmir","district":"Urla","category":"Work-friendly","priceLevel":"₺₺","rating":4.8,"reviewCount":156,"atmosphereTags":["Modern Architecture","Creative Hub","Pine Woods","Tranquil Grounds"],"editorialDescription":"An inspiring creative incubator situated in the hills of Urla, blending brutalist design with olive grove landscape.","longDescription":"Urla Dam is a cultural institution and design reserve. Its open-concept workspace cafe sits amidst structural concrete columns and glass screens that let natural forest light stream in, making it a stellar hideout for focus, quiet writing, or contemplating contemporary sculpture.","image":"https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80","address":"Gülbahçe Mh., Urla Dam Cd. No:34, Urla/İzmir","coordinates":{"lat":38.3112,"lng":26.7512,"x":40,"y":82},"attributes":{"coffeeRating":4.6,"designFactor":5,"quietScore":4.9,"seaView":false,"affordable":true,"premium":true,"workFriendly":true,"dateSpot":false,"photogenic":true},"features":["Amphitheater view","Quiet workstations","Art exhibitions","Premium barista drinks","Design bookstore"]}'::jsonb),
  (10, '{"id":"place_ala_imren","name":"İmren Tatlıcısı Alaçatı","city":"İzmir","district":"Alaçatı","category":"Breakfast","priceLevel":"₺₺","rating":4.6,"reviewCount":840,"atmosphereTags":["Mastic Flavour","Vintage Interior","Historic Cafe","Aegean Heritage"],"editorialDescription":"Continuing a sweet mastic-scented legacy since 1941 on Alaçatı’s historic cobblestone path.","longDescription":"Stepping into İmren feels like traveling back in time to authentic early-republic Alaçatı. Framed by tall stone arches and vintage pastel display cabinets, it is famous for its slow-cooked mastic pudding, legendary traditional local pastries, and thick Turkish coffee served with real mineral water.","image":"https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80","address":"Alaçatı Mh., Kemalpaşa Cd. No:65/A, Çeşme/İzmir","coordinates":{"lat":38.2811,"lng":26.3745,"x":12,"y":88},"attributes":{"coffeeRating":4,"designFactor":4.5,"quietScore":2.5,"seaView":false,"affordable":true,"premium":false,"workFriendly":false,"dateSpot":true,"photogenic":true},"features":["Outdoor street-watching seating","World-famous mastic desserts","Deep historic atmosphere","Kid friendly"]}'::jsonb),
  (11, '{"id":"place_ala_fiko","name":"Fiko Alaçatı Bistro","city":"İzmir","district":"Alaçatı","category":"Bar","priceLevel":"₺₺₺₺","rating":4.7,"reviewCount":215,"atmosphereTags":["Courtyard Garden","Cosy Bistro","Dim Lighting","Artisanal Cocktails"],"editorialDescription":"A glowing, beautiful sanctuary that pairs local wine varieties with exceptional contemporary tapas and light acoustic tunes.","longDescription":"Fiko retreats from the crowded tourist paths of Alaçatı into an oasis of wild ivy and stone. It is highly regarded for its boutique wine selections, warm amber fairy lights cascading from age-old olive trees, and their local fig-infused signature cocktails.","image":"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80","address":"Alaçatı Mh., Tokoğlu Sk. No: 12, Çeşme/İzmir","coordinates":{"lat":38.2825,"lng":26.3722,"x":11,"y":85},"attributes":{"coffeeRating":3.8,"designFactor":4.9,"quietScore":3.6,"seaView":false,"affordable":false,"premium":true,"workFriendly":false,"dateSpot":true,"photogenic":true},"features":["Idyllic garden courtyard","Jazz & soul sets","Artisanal menu items","Sophisticated mixologist","Advanced booking recommeded"]}'::jsonb),
  (12, '{"id":"place_ala_windmill","name":"The Windmill Cafe & Lounge","city":"İzmir","district":"Alaçatı","category":"Photogenic","priceLevel":"₺₺₺","rating":4.5,"reviewCount":340,"atmosphereTags":["Sunset View","Windmills","Open Air Patio","Elegant Design"],"editorialDescription":"Enjoy curated afternoon frozen mixes directly beneath the iconic 150-year-old stone windmills of Çeşme.","longDescription":"Sitting at the highest vantage point of old Alaçatı, The Windmill boasts expansive views over the tiled terracotta rooftops and out to the Çeşme bay. Styled with rattan furniture, dry floral setups, and off-white linens, it is built for watching sunsets.","image":"https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=800&q=80","address":"Alaçatı Mh., Yel değirmenleri Parkı Yanı, Çeşme/İzmir","coordinates":{"lat":38.2855,"lng":26.3711,"x":10,"y":80},"attributes":{"coffeeRating":4.2,"designFactor":4.7,"quietScore":3,"seaView":true,"affordable":false,"premium":true,"workFriendly":false,"dateSpot":true,"photogenic":true},"features":["Panoramic view","Great sunset photography","Aura outdoor bar","Small plates"]}'::jsonb),
  (13, '{"id":"place_cun_taskahve","name":"Cunda Tarihi Taş Kahve","city":"Cunda","district":"Alibey Adası","category":"Breakfast","priceLevel":"₺₺","rating":4.8,"reviewCount":1450,"atmosphereTags":["Stained Glass","Aegean Sea","Historic Tavern","Traditional Brewing"],"editorialDescription":"The crown jewel of Cunda harbor, where light filters through stained glass onto high-arched yellow-stone walls.","longDescription":"Built in the late 19th century as a social hall, Cunda Tas Kahve continues the genuine lifestyle of Ayvalık fishermen and sea captains. Watch waves hit the shoreline through towering stained glass windows, and enjoy Turkish coffee ground by hand in an iron mortar with a dash of native mastic.","image":"https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=800&q=80","address":"Mithatpaşa Mh., Sahil Yolu Cd., 10405 Cunda/Ayvalık","coordinates":{"lat":39.3361,"lng":26.6578,"x":62,"y":18},"attributes":{"coffeeRating":4.6,"designFactor":4.9,"quietScore":2.4,"seaView":true,"affordable":true,"premium":false,"workFriendly":false,"dateSpot":true,"photogenic":true},"features":["Direct coast line","Centuries old stone structure","Hand mortar ground coffee","Mouthwatering traditional toast"]}'::jsonb),
  (14, '{"id":"place_cun_ayna","name":"Ayna Cunda Bistro","city":"Cunda","district":"Alibey Adası","category":"Food","priceLevel":"₺₺₺","rating":4.8,"reviewCount":198,"atmosphereTags":["Aegean Cuisine","Curated Interiors","Off-white Linen","Slow Food"],"editorialDescription":"A minimal, airy kitchen and bistro celebrating pristine olive oil, wild herbs, and fresh sea catch in Cunda.","longDescription":"Ayna (“Mirror”) is a family-run project that mirrors the clean, soft aesthetic of classical island culture. Large glass arch windows illuminate off-white linen drapes, hand-drawn ceramic wares, and exquisite local cuisine like sea bass in olive oil and wild Cretan herbs with lemon foam.","image":"https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=800&q=80","address":"Mithatpaşa Mh., Çarşı Cd. No:22, Cunda Island/Ayvalık","coordinates":{"lat":39.3352,"lng":26.6582,"x":64,"y":22},"attributes":{"coffeeRating":4.3,"designFactor":5,"quietScore":4.2,"seaView":false,"affordable":false,"premium":true,"workFriendly":false,"dateSpot":true,"photogenic":true},"features":["Stunning boutique tableware","Curated wine list","Michelin-guide style dishes","Air-conditioned design room"]}'::jsonb),
  (15, '{"id":"place_man_sultan","name":"Sultan Kahvesi","city":"Manisa","district":"Şehzadeler","category":"Coffee","priceLevel":"₺","rating":4.5,"reviewCount":220,"atmosphereTags":["Historic Mosque Garden","Centennial Trees","Calming Oasis","Traditional Tea"],"editorialDescription":"Sit in the tranquil shadow of Sinans ancient Muradiye Mosque, enjoying tea among birdhouses and plane trees.","longDescription":"Sultan Kahvesi occupies the quiet inner courtyard adjacent to Mimar Sinan’s masterpiece, the Muradiye Mosque. Surrounded by tall, 400-year-old plane trees, it is a serene oasis where elders, travelers, and students sip traditional Turkish tea from glass cups while sparrows flutter nearby.","image":"https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80","address":"Muradiye Mh., 2208. Sk. No:5, Şehzadeler/Manisa","coordinates":{"lat":38.6112,"lng":27.4285,"x":88,"y":48},"attributes":{"coffeeRating":4,"designFactor":4.2,"quietScore":4.7,"seaView":false,"affordable":true,"premium":false,"workFriendly":false,"dateSpot":false,"photogenic":true},"features":["Centennial tree shadow","Extremely budget friendly","Historic location","Serene acoustic atmosphere"]}'::jsonb),
  (16, '{"id":"place_man_spil","name":"Spil Mountain Lodge Cafe","city":"Manisa","district":"Spil Dağı","category":"Photogenic","priceLevel":"₺₺","rating":4.7,"reviewCount":165,"atmosphereTags":["Pine Forests","Valley View","Cozy Wooden Lodge","Alpine Air"],"editorialDescription":"An alpine mountain retreat situated high up in Spil National Park, offering sweeping views and cozy fireplaces.","longDescription":"High above the clouds at 1200 meters, this wooden chalet cafe treats visitors to crisp forest air, misty pine vistas, and hot Turkish tea or spiced winter coffee beside a roaring brick fireplace. In spring, wild horses are known to roam around the grassy clearings right outside.","image":"https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80","address":"Spil Dağı Milli Parkı, 45400 Horozköy/Manisa","coordinates":{"lat":38.5684,"lng":27.4522,"x":92,"y":55},"attributes":{"coffeeRating":3.8,"designFactor":4.4,"quietScore":4.5,"seaView":false,"affordable":true,"premium":false,"workFriendly":false,"dateSpot":true,"photogenic":true},"features":["Active wooden fireplace","High panoramic view deck","National park hikes","Local herbal honey tea"]}'::jsonb);

insert into public.places (
  id,
  name,
  city,
  district,
  category,
  price_level,
  rating,
  review_count,
  editorial_description,
  long_description,
  image_url,
  address,
  lat,
  lng,
  map_x,
  map_y,
  attributes,
  features,
  published,
  sort_order
)
select
  data->>'id' as id,
  data->>'name' as name,
  data->>'city' as city,
  data->>'district' as district,
  data->>'category' as category,
  data->>'priceLevel' as price_level,
  (data->>'rating')::numeric(2, 1) as rating,
  (data->>'reviewCount')::integer as review_count,
  data->>'editorialDescription' as editorial_description,
  data->>'longDescription' as long_description,
  data->>'image' as image_url,
  data->>'address' as address,
  (data->'coordinates'->>'lat')::numeric(9, 6) as lat,
  (data->'coordinates'->>'lng')::numeric(9, 6) as lng,
  (data->'coordinates'->>'x')::numeric(5, 2) as map_x,
  (data->'coordinates'->>'y')::numeric(5, 2) as map_y,
  data->'attributes' as attributes,
  array(
    select jsonb_array_elements_text(data->'features')
  ) as features,
  true as published,
  sort_order
from yerinde_seed_places
on conflict (id) do update set
  name = excluded.name,
  city = excluded.city,
  district = excluded.district,
  category = excluded.category,
  price_level = excluded.price_level,
  rating = excluded.rating,
  review_count = excluded.review_count,
  editorial_description = excluded.editorial_description,
  long_description = excluded.long_description,
  image_url = excluded.image_url,
  address = excluded.address,
  lat = excluded.lat,
  lng = excluded.lng,
  map_x = excluded.map_x,
  map_y = excluded.map_y,
  attributes = excluded.attributes,
  features = excluded.features,
  published = excluded.published,
  sort_order = excluded.sort_order,
  updated_at = now();

insert into public.tags (slug, name, type)
select distinct
  regexp_replace(
    lower(
      translate(tag_name, 'ÇĞİÖŞÜçğıöşü’', 'CGIOSUcgiosu-')
    ),
    '[^a-z0-9]+',
    '-',
    'g'
  ) as slug,
  tag_name as name,
  'atmosphere' as type
from yerinde_seed_places
cross join lateral jsonb_array_elements_text(data->'atmosphereTags') as tag_name
on conflict (slug) do update set
  name = excluded.name,
  type = excluded.type;

insert into public.place_tags (place_id, tag_id)
select
  seed.data->>'id' as place_id,
  tags.id as tag_id
from yerinde_seed_places as seed
cross join lateral jsonb_array_elements_text(seed.data->'atmosphereTags') as tag_name
join public.tags
  on tags.slug = regexp_replace(
    lower(
      translate(tag_name, 'ÇĞİÖŞÜçğıöşü’', 'CGIOSUcgiosu-')
    ),
    '[^a-z0-9]+',
    '-',
    'g'
  )
on conflict (place_id, tag_id) do nothing;
