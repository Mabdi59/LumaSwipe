export interface Destination {
  id: string;
  name: string;
  country: string;
  tagline: string;
  description: string;
  bestSeason: string;
  vibe: string;
  budget: string;
  tripLength: string;
  highlights: string[];
  heroImage: string;
  gallery: string[];
  category: string[];
  rating: number;
}

export const destinations: Destination[] = [
  {
    id: '1',
    name: 'Santorini',
    country: 'Greece',
    tagline: 'Where cliffs kiss the Aegean sky',
    description:
      'Santorini is a volcanic island in the Cyclades group of the Greek islands. It is famous for its dramatic views, stunning sunsets, white-washed houses, and its own active volcano. The island sits in the southern Aegean Sea and captivates visitors with its iconic blue-domed churches and labyrinthine alleyways.',
    bestSeason: 'May – October',
    vibe: 'Romantic · Luxe · Scenic',
    budget: '$150–$300/day',
    tripLength: '4–7 days',
    highlights: [
      'Sunset from Oia village',
      'Caldera boat cruise',
      'Red & Black Sand Beaches',
      'Ancient Akrotiri ruins',
      'Wine tasting at local vineyards',
    ],
    heroImage: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1601581875039-e899893d520c?w=600&q=80',
      'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=600&q=80',
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&q=80',
    ],
    category: ['Romantic', 'Luxury', 'Beach'],
    rating: 4.9,
  },
  {
    id: '2',
    name: 'Kyoto',
    country: 'Japan',
    tagline: 'Ancient temples wrapped in cherry blossoms',
    description:
      'Kyoto, once the capital of Japan, is a city on the island of Honshu. It is famous for its numerous classical Buddhist temples, gardens, imperial palaces, Shinto shrines and traditional wooden houses. Every spring, the city transforms into a pink paradise as thousands of cherry blossom trees bloom simultaneously.',
    bestSeason: 'March – May',
    vibe: 'Serene · Cultural · Historic',
    budget: '$80–$180/day',
    tripLength: '5–8 days',
    highlights: [
      'Arashiyama Bamboo Grove',
      'Fushimi Inari Shrine',
      'Kinkaku-ji (Golden Pavilion)',
      'Geisha district in Gion',
      'Philosopher\'s Path walk',
    ],
    heroImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80',
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&q=80',
      'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=600&q=80',
    ],
    category: ['Cultural', 'Nature', 'City'],
    rating: 4.8,
  },
  {
    id: '3',
    name: 'Bali',
    country: 'Indonesia',
    tagline: 'The island of gods and endless beauty',
    description:
      'Bali is an Indonesian island known for its forested volcanic mountains, iconic rice paddies, beaches, and coral reefs. The island is home to religious sites such as cliffside Uluwatu Temple. To the south, the beachside suburb of Kuta has lively bars, while Seminyak, Sanur and Nusa Dua are popular resort towns.',
    bestSeason: 'April – October',
    vibe: 'Spiritual · Tropical · Adventurous',
    budget: '$50–$150/day',
    tripLength: '7–14 days',
    highlights: [
      'Tegallalang Rice Terraces',
      'Uluwatu Temple at sunset',
      'Mount Batur sunrise hike',
      'Ubud Monkey Forest',
      'Seminyak beach clubs',
    ],
    heroImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600&q=80',
      'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=600&q=80',
      'https://images.unsplash.com/photo-1583321500900-82807e458f3c?w=600&q=80',
    ],
    category: ['Beach', 'Nature', 'Spiritual'],
    rating: 4.7,
  },
  {
    id: '4',
    name: 'Machu Picchu',
    country: 'Peru',
    tagline: 'The lost city hidden in the clouds',
    description:
      'Machu Picchu is an Incan citadel set high in the Andes Mountains in Peru, above the Urubamba River valley. Built in the 15th century and later abandoned, it\'s renowned for its sophisticated dry-stone walls that fuse huge blocks without the use of mortar, intriguing buildings that play on astronomical alignments and panoramic views.',
    bestSeason: 'May – September',
    vibe: 'Adventurous · Historic · Mystical',
    budget: '$70–$150/day',
    tripLength: '4–6 days',
    highlights: [
      'Sun Gate (Inti Punku) hike',
      'Huayna Picchu mountain',
      'Inca Trail trek',
      'Aguas Calientes hot springs',
      'Archaeological site tour',
    ],
    heroImage: 'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=600&q=80',
      'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600&q=80',
      'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=600&q=80',
    ],
    category: ['Adventure', 'Cultural', 'Nature'],
    rating: 4.9,
  },
  {
    id: '5',
    name: 'Amalfi Coast',
    country: 'Italy',
    tagline: 'Pastel villages tumbling into turquoise waters',
    description:
      'The Amalfi Coast is a stretch of coastline along the southern edge of Italy\'s Sorrentine Peninsula. Its towns, including Amalfi and Positano, are known for their pastel buildings that cascade down seaside cliffs. This UNESCO World Heritage site offers some of the most dramatic scenery in the Mediterranean.',
    bestSeason: 'June – September',
    vibe: 'Romantic · Scenic · Luxe',
    budget: '$120–$250/day',
    tripLength: '5–7 days',
    highlights: [
      'Positano village walk',
      'Path of the Gods hike',
      'Ravello gardens and views',
      'Boat tours of sea caves',
      'Fresh local seafood',
    ],
    heroImage: 'https://images.unsplash.com/photo-1533606688076-b6683a5f59f1?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&q=80',
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80',
      'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=600&q=80',
    ],
    category: ['Romantic', 'Scenic', 'Luxury'],
    rating: 4.8,
  },
  {
    id: '6',
    name: 'Iceland',
    country: 'Iceland',
    tagline: 'Fire, ice, and auroras at the edge of the world',
    description:
      'Iceland is a Nordic island nation defined by its dramatic landscape with volcanoes, geysers, hot springs and lava fields. Massive glaciers are part of Vatnajökull National Park. Most of the population lives in the capital, Reykjavík, which runs on geothermal power and is the base for exploring the country\'s famous Northern Lights.',
    bestSeason: 'Sep – Mar (Aurora) / Jun – Aug (Midnight Sun)',
    vibe: 'Epic · Wild · Ethereal',
    budget: '$150–$350/day',
    tripLength: '7–10 days',
    highlights: [
      'Northern Lights viewing',
      'Golden Circle route',
      'Blue Lagoon geothermal spa',
      'Jökulsárlón Glacier Lagoon',
      'Midnight Sun experience',
    ],
    heroImage: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1504109586057-7a2ae83d1338?w=600&q=80',
      'https://images.unsplash.com/photo-1520769945061-0a448c463865?w=600&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=600&q=80',
    ],
    category: ['Adventure', 'Nature', 'Epic'],
    rating: 4.9,
  },
  {
    id: '7',
    name: 'Dubai',
    country: 'UAE',
    tagline: 'The future skyline where desert meets opulence',
    description:
      'Dubai is a city and emirate in the United Arab Emirates known for luxury shopping, ultramodern architecture, and a lively nightlife scene. The Burj Khalifa, an 830m-tall tower, dominates the skyscraper-filled skyline. At its foot, the dancing Dubai Fountain is choreographed to light and music shows.',
    bestSeason: 'November – April',
    vibe: 'Glamorous · Modern · Energetic',
    budget: '$200–$500/day',
    tripLength: '4–6 days',
    highlights: [
      'Burj Khalifa observation deck',
      'Desert safari with dune bashing',
      'Dubai Mall and Fountain show',
      'Old Dubai spice and gold souks',
      'Palm Jumeirah beach clubs',
    ],
    heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=600&q=80',
      'https://images.unsplash.com/photo-1534531173927-aeb928d54385?w=600&q=80',
      'https://images.unsplash.com/photo-1539445496393-a769d08fd05c?w=600&q=80',
    ],
    category: ['Luxury', 'City', 'Modern'],
    rating: 4.6,
  },
  {
    id: '8',
    name: 'Maldives',
    country: 'Maldives',
    tagline: 'Crystal lagoons and overwater paradise',
    description:
      'The Maldives is a tropical nation in the Indian Ocean composed of 26 ring-shaped atolls, which are made up of more than 1,000 coral islands. It\'s known for its beaches, blue lagoons and extensive reefs. The capital, Malé, has a busy fish market, restaurants and shops on Majeedhee Magu.',
    bestSeason: 'November – April',
    vibe: 'Tranquil · Luxe · Tropical',
    budget: '$300–$800/day',
    tripLength: '5–10 days',
    highlights: [
      'Overwater bungalow stay',
      'Snorkeling with manta rays',
      'Underwater restaurant dining',
      'Sandbank sunset picnic',
      'Bioluminescent beach nights',
    ],
    heroImage: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1540202404-1b927e27fa8b?w=600&q=80',
      'https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?w=600&q=80',
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600&q=80',
    ],
    category: ['Beach', 'Luxury', 'Romantic'],
    rating: 5.0,
  },
  {
    id: '9',
    name: 'Patagonia',
    country: 'Argentina & Chile',
    tagline: 'Raw wilderness at the end of the world',
    description:
      'Patagonia is a sparsely populated region at the southern end of South America. The region encompasses the southern section of the Andes mountains, as well as the deserts, pampas, and grasslands to the east. This dramatic landscape features some of the world\'s most awe-inspiring wilderness.',
    bestSeason: 'November – March',
    vibe: 'Wild · Epic · Remote',
    budget: '$80–$200/day',
    tripLength: '10–21 days',
    highlights: [
      'Torres del Paine National Park',
      'Perito Moreno Glacier walk',
      'W-Circuit trekking',
      'Los Glaciares Park',
      'Tierra del Fuego',
    ],
    heroImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80',
      'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=600&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    ],
    category: ['Adventure', 'Nature', 'Epic'],
    rating: 4.8,
  },
  {
    id: '10',
    name: 'Marrakech',
    country: 'Morocco',
    tagline: 'Labyrinthine souks and rose-hued medinas',
    description:
      'Marrakech is a former imperial city in western Morocco, a major economic center and home to mosques, palaces and gardens. The medina is a densely packed, walled medieval city dating to the Berber Empire, with meandering souks selling traditional textiles, pottery and jewelry.',
    bestSeason: 'March – May · September – November',
    vibe: 'Vibrant · Exotic · Sensory',
    budget: '$40–$120/day',
    tripLength: '4–7 days',
    highlights: [
      'Jemaa el-Fna square',
      'Majorelle Garden',
      'Bahia Palace',
      'Cooking class in the medina',
      'Hammam spa experience',
    ],
    heroImage: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1563177978-4c98ce2c04a3?w=600&q=80',
      'https://images.unsplash.com/photo-1524492914791-8a4a4e6a38e6?w=600&q=80',
      'https://images.unsplash.com/photo-1597212618440-806262de4f8b?w=600&q=80',
    ],
    category: ['Cultural', 'City', 'Exotic'],
    rating: 4.6,
  },
  {
    id: '11',
    name: 'New Zealand',
    country: 'New Zealand',
    tagline: 'Middle-earth landscapes and endless adventure',
    description:
      'New Zealand is an island country in the southwestern Pacific Ocean. It has dramatic landscapes, from the fjords of Milford Sound to the thermal pools of Rotorua and the volcanic peaks of Tongariro. It\'s the setting for the Lord of the Rings trilogy and offers world-class adventure activities.',
    bestSeason: 'December – March',
    vibe: 'Adventurous · Pristine · Cinematic',
    budget: '$100–$220/day',
    tripLength: '10–21 days',
    highlights: [
      'Fiordland National Park',
      'Tongariro Alpine Crossing',
      'Hobbiton movie set',
      'Rotorua geothermal region',
      'Milford Sound cruise',
    ],
    heroImage: 'https://images.unsplash.com/photo-1469521669194-babb45599def?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=600&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    ],
    category: ['Adventure', 'Nature', 'Scenic'],
    rating: 4.9,
  },
  {
    id: '12',
    name: 'Tuscany',
    country: 'Italy',
    tagline: 'Rolling hills, golden sunflowers, and timeless wine',
    description:
      'Tuscany is a region in central Italy with an area of about 23,000 square kilometres. The regional capital is Florence. Tuscany is known for its landscapes, history, artistic legacy, and its influence on high culture. It is regarded as the birthplace of the Italian Renaissance.',
    bestSeason: 'April – June · September – October',
    vibe: 'Romantic · Culinary · Peaceful',
    budget: '$100–$200/day',
    tripLength: '7–10 days',
    highlights: [
      'Val d\'Orcia rolling hills',
      'Florence art museums',
      'Chianti wine tasting',
      'Siena medieval center',
      'San Gimignano towers',
    ],
    heroImage: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1482192505345-5852310bcd4c?w=600&q=80',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
      'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=600&q=80',
    ],
    category: ['Romantic', 'Culinary', 'Cultural'],
    rating: 4.7,
  },
];

export const categories = ['All', 'Beach', 'City', 'Nature', 'Adventure', 'Luxury', 'Romantic', 'Cultural'];
