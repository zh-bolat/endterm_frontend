/*
  Forma — project data
  All products and gallery photos live in these arrays.
  The pages build their cards, tables and photo grid from them with JavaScript,
  so a new product only has to be added here once.
*/

// Array 1: every product in the catalog
const products = [
  {
    id: 'nord-sofa',
    name: 'Nord sofa',
    category: 'Sofa',
    room: 'living',
    material: 'Velvet, oak legs',
    size: '214 × 92 × 84',
    deliveryDays: 7,
    price: 1490,
    tag: 'Bestseller',
    featured: true,
    image: 'images/product-nord-sofa.jpg',
    alt: 'Three-seat sofa in dark green velvet with wooden legs against a white wall',
    description: 'Deep three-seater in soft velvet on solid oak legs.'
  },
  {
    id: 'terra-sofa',
    name: 'Terra sofa',
    category: 'Sofa',
    room: 'living',
    material: 'Leather, oak legs',
    size: '220 × 95 × 82',
    deliveryDays: 7,
    price: 1890,
    tag: 'New',
    featured: false,
    image: 'images/product-terra-sofa.jpg',
    alt: 'Three-seat sofa in tan leather with angled wooden legs in front of a white wall',
    description: 'Full-grain leather that gets softer with every year.'
  },
  {
    id: 'sunny-armchair',
    name: 'Sunny armchair',
    category: 'Armchair',
    room: 'living',
    material: 'Wool, ash legs',
    size: '76 × 82 × 88',
    deliveryDays: 3,
    price: 640,
    tag: '',
    featured: true,
    image: 'images/product-sunny-armchair.jpg',
    alt: 'Mustard yellow armchair next to a brass floor lamp in a living room',
    description: 'A compact reading chair in warm mustard wool.'
  },
  {
    id: 'mila-armchair',
    name: 'Mila armchair',
    category: 'Armchair',
    room: 'bedroom',
    material: 'Velvet, ash legs',
    size: '70 × 68 × 78',
    deliveryDays: 3,
    price: 460,
    tag: '',
    featured: false,
    image: 'images/product-mila-armchair.jpg',
    alt: 'Small cream velvet armchair with a buttoned back and white turned legs',
    description: 'A small buttoned chair for bedrooms and hallways.'
  },
  {
    id: 'arc-lounge-chair',
    name: 'Arc lounge chair',
    category: 'Lounge chair',
    room: 'workspace',
    material: 'Plywood, cotton',
    size: '92 × 82 × 72',
    deliveryDays: 3,
    price: 520,
    tag: '',
    featured: true,
    image: 'images/product-arc-lounge-chair.jpg',
    alt: 'White curved lounge chair with a bent wood frame beside a palm plant',
    description: 'Bent plywood frame with a soft white cushion.'
  },
  {
    id: 'kai-dining-chair',
    name: 'Kai dining chair',
    category: 'Dining chair',
    room: 'dining',
    material: 'Recycled plastic, ash legs',
    size: '49 × 54 × 83',
    deliveryDays: 3,
    price: 190,
    tag: 'New',
    featured: false,
    image: 'images/product-kai-dining-chair.jpg',
    alt: 'Black moulded dining chair with a seat cushion and light wooden legs on a teal background',
    description: 'Moulded seat with a padded cushion on ash legs.'
  }
];

// Array 2: rooms used by the catalog filter and the Home category tiles
const rooms = [
  { value: 'all', label: 'All rooms' },
  { value: 'living', label: 'Living' },
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'dining', label: 'Dining' },
  { value: 'workspace', label: 'Workspace' }
];
