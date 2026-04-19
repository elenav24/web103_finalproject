const giftIdeaData = [
  // Gifts for Mom (Linda) - Alex's contact
  {
    id: 1,
    contact_id: 1,
    event_id: 1,
    name: 'Herb Garden Starter Kit',
    description: 'Indoor herb garden with basil, rosemary, and thyme. She mentioned wanting fresh herbs for cooking.',
    url: 'https://example.com/herb-garden-kit',
    price: 45.99,
    status: 'purchased'
  },
  {
    id: 2,
    contact_id: 1,
    event_id: 3,
    name: 'Mystery Novel Box Set',
    description: 'Agatha Christie collection she doesn\'t have yet.',
    url: 'https://example.com/christie-box-set',
    price: 32.00,
    status: 'idea'
  },
  {
    id: 3,
    contact_id: 1,
    event_id: 1,
    name: 'Personalized Cutting Board',
    description: 'Engraved with family name. Maple wood.',
    url: 'https://example.com/custom-cutting-board',
    price: 55.00,
    status: 'idea'
  },

  // Gifts for Dad (Robert) - Alex's contact
  {
    id: 4,
    contact_id: 2,
    event_id: 2,
    name: 'Woodworking Chisel Set',
    description: 'Professional grade chisel set. His old ones are beat up.',
    url: 'https://example.com/chisel-set',
    price: 89.99,
    status: 'idea'
  },
  {
    id: 5,
    contact_id: 2,
    event_id: 2,
    name: 'Classic Rock Vinyl - Led Zeppelin IV',
    description: 'Remastered pressing. He lost his original copy years ago.',
    url: 'https://example.com/led-zep-iv-vinyl',
    price: 34.99,
    status: 'purchased'
  },
  {
    id: 6,
    contact_id: 2,
    event_id: 3,
    name: 'Flannel Shirt',
    description: 'Size L, red and black plaid. Good for the workshop.',
    url: null,
    price: 40.00,
    status: 'idea'
  },

  // Gifts for Emily - Alex's contact
  {
    id: 7,
    contact_id: 3,
    event_id: 6,
    name: 'Leather Portfolio',
    description: 'Professional portfolio for her new MBA career. Monogrammed.',
    url: 'https://example.com/leather-portfolio',
    price: 120.00,
    status: 'purchased'
  },
  {
    id: 8,
    contact_id: 3,
    event_id: 6,
    name: 'Spa Gift Card',
    description: 'She\'ll need to decompress after finals.',
    url: null,
    price: 100.00,
    status: 'idea'
  },
  {
    id: 9,
    contact_id: 3,
    event_id: 3,
    name: 'Yoga Mat - Premium',
    description: 'Cork yoga mat, eco-friendly. Her current one is falling apart.',
    url: 'https://example.com/cork-yoga-mat',
    price: 65.00,
    status: 'idea'
  },

  // Gifts for Marcus - Alex's contact
  {
    id: 10,
    contact_id: 4,
    event_id: 5,
    name: 'Elden Ring DLC',
    description: 'Shadow of the Erdtree. He hasn\'t picked it up yet.',
    url: 'https://example.com/elden-ring-dlc',
    price: 39.99,
    status: 'given'
  },
  {
    id: 11,
    contact_id: 4,
    event_id: 3,
    name: 'Vinyl Record - Kendrick Lamar',
    description: 'Good Kid, M.A.A.D City on vinyl. Would fit his collection.',
    url: 'https://example.com/kendrick-vinyl',
    price: 28.99,
    status: 'idea'
  },
  {
    id: 12,
    contact_id: 4,
    event_id: null,
    name: 'Board Game - Twilight Imperium',
    description: 'The ultimate strategy board game. He\'d love it but it\'s pricey. Maybe for a big occasion.',
    url: 'https://example.com/twilight-imperium',
    price: 119.99,
    status: 'idea'
  },

  // Gifts for Priya - Alex's contact
  {
    id: 13,
    contact_id: 5,
    event_id: 4,
    name: 'Star Map Print',
    description: 'Custom star map of the night sky from the date we started dating.',
    url: 'https://example.com/custom-star-map',
    price: 45.00,
    status: 'purchased'
  },
  {
    id: 14,
    contact_id: 5,
    event_id: 4,
    name: 'Portable Telescope',
    description: 'Compact travel telescope for the stargazing date.',
    url: 'https://example.com/travel-telescope',
    price: 55.00,
    status: 'idea'
  },
  {
    id: 15,
    contact_id: 5,
    event_id: 3,
    name: 'Camera Lens Filter Set',
    description: 'ND filter set for her photography hobby.',
    url: 'https://example.com/nd-filter-set',
    price: 38.00,
    status: 'idea'
  },

  // Gifts for Abuela (Rosa) - Jordan's contact
  {
    id: 16,
    contact_id: 6,
    event_id: 7,
    name: 'Rose Bush - David Austin',
    description: 'A beautiful English rose bush for her garden.',
    url: 'https://example.com/david-austin-rose',
    price: 35.00,
    status: 'idea'
  },
  {
    id: 17,
    contact_id: 6,
    event_id: 9,
    name: 'Heated Blanket',
    description: 'She\'s always cold. Good quality one that\'s machine washable.',
    url: null,
    price: 45.00,
    status: 'idea'
  },

  // Gifts for Carlos - Jordan's contact
  {
    id: 18,
    contact_id: 7,
    event_id: 8,
    name: 'Nike Dunk Low',
    description: 'Size 11. The panda colorway he\'s been wanting.',
    url: 'https://example.com/nike-dunk-panda',
    price: 110.00,
    status: 'idea'
  },
  {
    id: 19,
    contact_id: 7,
    event_id: 9,
    name: 'Basketball - Official Size',
    description: 'Spalding indoor/outdoor. His current one is worn smooth.',
    url: null,
    price: 30.00,
    status: 'purchased'
  },

  // Gifts for Nadia - Jordan's contact
  {
    id: 20,
    contact_id: 8,
    event_id: 10,
    name: 'Bookshelf Bookends',
    description: 'Decorative metal bookends shaped like mountains. Good housewarming gift.',
    url: 'https://example.com/mountain-bookends',
    price: 28.00,
    status: 'purchased'
  },
  {
    id: 21,
    contact_id: 8,
    event_id: 9,
    name: 'Wingspan Board Game',
    description: 'Beautiful bird-themed strategy game. Right up her alley.',
    url: 'https://example.com/wingspan',
    price: 42.00,
    status: 'idea'
  },

  // Gifts for Wei - Sam's contact
  {
    id: 22,
    contact_id: 9,
    event_id: 11,
    name: 'Yixing Clay Teapot',
    description: 'Traditional Chinese teapot for his tea collection.',
    url: 'https://example.com/yixing-teapot',
    price: 65.00,
    status: 'idea'
  },
  {
    id: 23,
    contact_id: 9,
    event_id: 11,
    name: 'Calligraphy Brush Set',
    description: 'Professional set with multiple brush sizes and ink stone.',
    url: 'https://example.com/calligraphy-set',
    price: 48.00,
    status: 'idea'
  },

  // Gifts for Lily - Sam's contact
  {
    id: 24,
    contact_id: 10,
    event_id: 13,
    name: 'Pottery Class Voucher',
    description: 'Six-week ceramics course at the local studio. She\'s been hinting hard.',
    url: 'https://example.com/pottery-class',
    price: 135.00,
    status: 'purchased'
  },
  {
    id: 25,
    contact_id: 10,
    event_id: 12,
    name: 'Watercolor Paint Set - Artist Grade',
    description: 'Winsor & Newton professional set. Major upgrade from her student paints.',
    url: 'https://example.com/watercolor-set',
    price: 85.00,
    status: 'idea'
  },
  {
    id: 26,
    contact_id: 10,
    event_id: 12,
    name: 'Peony Bouquet Subscription',
    description: 'Monthly peony delivery for 3 months. Her favorite flower.',
    url: 'https://example.com/peony-subscription',
    price: 90.00,
    status: 'idea'
  },
  {
    id: 27,
    contact_id: 10,
    event_id: null,
    name: 'Art Supply Tote Bag',
    description: 'Canvas tote with compartments for brushes and supplies. Saw it and thought of her.',
    url: 'https://example.com/art-tote',
    price: 25.00,
    status: 'idea'
  }
]

export default giftIdeaData
