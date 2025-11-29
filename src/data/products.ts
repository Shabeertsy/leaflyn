import type { Product, Category } from '../types';

export const categories: Category[] = [
  {
    id: '1',
    category_name: 'Indoor Plants',
    slug: 'indoor-plants',
    icon: '🌿',
    image: '/categories/indoor.jpg',
    description: 'Beautiful plants for your home',
    productCount: 45
  },
  {
    id: '2',
    category_name: 'Outdoor Plants',
    slug: 'outdoor-plants',
    icon: '🌳',
    image: '/categories/outdoor.jpg',
    description: 'Hardy plants for gardens',
    productCount: 38
  },
  {
    id: '3',
    category_name: 'Aquatics',
    slug: 'aquatics',
    icon: '🐠',
    image: '/categories/aquatics.jpg',
    description: 'Aquarium plants & supplies',
    productCount: 52
  },
  {
    id: '4',
    category_name: 'Accessories',
    slug: 'accessories',
    icon: '🛠️',
    image: '/categories/accessories.jpg',
    description: 'Gardening tools & accessories',
    productCount: 67
  },
  {
    id: '5',
    category_name: 'Fertilizers',
    slug: 'fertilizers',
    icon: '🌱',
    image: '/categories/fertilizers.jpg',
    description: 'Organic & chemical fertilizers',
    productCount: 28
  },
  {
    id: '6',
    category_name: 'Pots & Planters',
    slug: 'pots',
    icon: '🏺',
    image: '/categories/pots.jpg',
    description: 'Stylish pots for every plant',
    productCount: 41
  }
];

export const products: Product[] = [
  // Indoor Plants
  {
    id: '1',
    name: 'Monstera Deliciosa',
    description: 'The iconic Swiss Cheese Plant with stunning split leaves. Perfect for bright, indirect light.',
    price: 899,
    originalPrice: 1299,
    discount: 31,
    category: 'indoor-plants',
    subcategory: 'Foliage Plants',
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500',
    images: [
      'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500',
      'https://images.unsplash.com/photo-1614594895304-fe7116ac3b58?w=500'
    ],
    rating: 4.8,
    reviewCount: 234,
    inStock: true,
    stock: 45,
    featured: true,
    bestseller: true,
    tags: ['Low Maintenance', 'Air Purifying', 'Pet Friendly'],
    specifications: {
      'Height': '30-40 cm',
      'Pot Size': '6 inch',
      'Light': 'Bright Indirect',
      'Water': 'Moderate',
      'Growth Rate': 'Fast'
    },
    careInstructions: [
      'Water when top 2 inches of soil is dry',
      'Provide bright, indirect sunlight',
      'Mist leaves regularly for humidity',
      'Fertilize monthly during growing season'
    ]
  },
  {
    id: '2',
    name: 'Snake Plant (Sansevieria)',
    description: 'Virtually indestructible plant that thrives on neglect. Perfect for beginners and low-light spaces.',
    price: 499,
    originalPrice: 699,
    discount: 29,
    category: 'indoor-plants',
    subcategory: 'Succulents',
    image: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bb8?w=500',
    rating: 4.9,
    reviewCount: 456,
    inStock: true,
    stock: 78,
    bestseller: true,
    tags: ['Low Maintenance', 'Air Purifying', 'Low Light'],
    specifications: {
      'Height': '25-35 cm',
      'Pot Size': '5 inch',
      'Light': 'Low to Bright',
      'Water': 'Low',
      'Growth Rate': 'Slow'
    }
  },
  {
    id: '3',
    name: 'Pothos Golden',
    description: 'Trailing vine with heart-shaped golden-green leaves. Excellent air purifier and easy to grow.',
    price: 349,
    category: 'indoor-plants',
    subcategory: 'Hanging Plants',
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500',
    rating: 4.7,
    reviewCount: 189,
    inStock: true,
    stock: 92,
    featured: true,
    tags: ['Air Purifying', 'Hanging', 'Fast Growing'],
    specifications: {
      'Height': '15-20 cm (trailing)',
      'Pot Size': '5 inch',
      'Light': 'Low to Bright Indirect',
      'Water': 'Moderate',
      'Growth Rate': 'Fast'
    }
  },
  {
    id: '4',
    name: 'Peace Lily',
    description: 'Elegant white blooms and glossy leaves. Excellent for removing toxins from indoor air.',
    price: 599,
    originalPrice: 799,
    discount: 25,
    category: 'indoor-plants',
    subcategory: 'Flowering Plants',
    image: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bb8?w=500',
    rating: 4.6,
    reviewCount: 312,
    inStock: true,
    stock: 34,
    newArrival: true,
    tags: ['Flowering', 'Air Purifying', 'Low Light'],
    specifications: {
      'Height': '30-40 cm',
      'Pot Size': '6 inch',
      'Light': 'Low to Medium',
      'Water': 'Moderate to High',
      'Growth Rate': 'Medium'
    }
  },
  {
    id: '5',
    name: 'Fiddle Leaf Fig',
    description: 'Statement plant with large, violin-shaped leaves. A favorite among interior designers.',
    price: 1299,
    originalPrice: 1799,
    discount: 28,
    category: 'indoor-plants',
    subcategory: 'Foliage Plants',
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500',
    rating: 4.5,
    reviewCount: 167,
    inStock: true,
    stock: 23,
    featured: true,
    tags: ['Statement Plant', 'Bright Light', 'Trending'],
    specifications: {
      'Height': '60-80 cm',
      'Pot Size': '8 inch',
      'Light': 'Bright Indirect',
      'Water': 'Moderate',
      'Growth Rate': 'Medium'
    }
  },

  // Outdoor Plants
  {
    id: '6',
    name: 'Hibiscus Plant',
    description: 'Vibrant flowering shrub with large, colorful blooms. Perfect for tropical gardens.',
    price: 449,
    category: 'outdoor-plants',
    subcategory: 'Flowering Shrubs',
    image: 'https://images.unsplash.com/photo-1597868165956-03a6827955b1?w=500',
    rating: 4.7,
    reviewCount: 198,
    inStock: true,
    stock: 56,
    bestseller: true,
    tags: ['Flowering', 'Colorful', 'Attracts Butterflies'],
    specifications: {
      'Height': '40-50 cm',
      'Pot Size': '8 inch',
      'Light': 'Full Sun',
      'Water': 'High',
      'Bloom Season': 'Year Round'
    }
  },
  {
    id: '7',
    name: 'Bougainvillea',
    description: 'Stunning climbing plant with vibrant bracts in pink, purple, or orange.',
    price: 549,
    originalPrice: 749,
    discount: 27,
    category: 'outdoor-plants',
    subcategory: 'Climbers',
    image: 'https://images.unsplash.com/photo-1597868165956-03a6827955b1?w=500',
    rating: 4.8,
    reviewCount: 223,
    inStock: true,
    stock: 41,
    featured: true,
    tags: ['Climber', 'Colorful', 'Drought Tolerant'],
    specifications: {
      'Height': '30-40 cm',
      'Pot Size': '7 inch',
      'Light': 'Full Sun',
      'Water': 'Low to Moderate',
      'Bloom Season': 'Spring to Fall'
    }
  },

  // Aquatics
  {
    id: '8',
    name: 'Java Fern',
    description: 'Hardy aquarium plant perfect for beginners. Thrives in low light conditions.',
    price: 199,
    category: 'aquatics',
    subcategory: 'Aquarium Plants',
    image: 'https://images.unsplash.com/photo-1520990682747-6e0c9e6b5c1d?w=500',
    rating: 4.6,
    reviewCount: 145,
    inStock: true,
    stock: 120,
    bestseller: true,
    tags: ['Low Light', 'Easy Care', 'Freshwater'],
    specifications: {
      'Size': 'Medium',
      'Light Requirement': 'Low to Medium',
      'Growth Rate': 'Slow',
      'Placement': 'Mid to Background',
      'Water Type': 'Freshwater'
    }
  },
  {
    id: '9',
    name: 'Anubias Nana',
    description: 'Compact aquatic plant with dark green leaves. Excellent for nano tanks.',
    price: 249,
    category: 'aquatics',
    subcategory: 'Aquarium Plants',
    image: 'https://images.unsplash.com/photo-1520990682747-6e0c9e6b5c1d?w=500',
    rating: 4.8,
    reviewCount: 178,
    inStock: true,
    stock: 95,
    featured: true,
    tags: ['Nano Tank', 'Low Light', 'Slow Growing'],
    specifications: {
      'Size': 'Small',
      'Light Requirement': 'Low',
      'Growth Rate': 'Very Slow',
      'Placement': 'Foreground to Mid',
      'Water Type': 'Freshwater'
    }
  },
  {
    id: '10',
    name: 'Amazon Sword',
    description: 'Popular background plant with long, sword-like leaves. Great for larger aquariums.',
    price: 299,
    originalPrice: 399,
    discount: 25,
    category: 'aquatics',
    subcategory: 'Aquarium Plants',
    image: 'https://images.unsplash.com/photo-1520990682747-6e0c9e6b5c1d?w=500',
    rating: 4.5,
    reviewCount: 134,
    inStock: true,
    stock: 67,
    tags: ['Background Plant', 'Fast Growing', 'Nutrient Rich'],
    specifications: {
      'Size': 'Large',
      'Light Requirement': 'Medium to High',
      'Growth Rate': 'Fast',
      'Placement': 'Background',
      'Water Type': 'Freshwater'
    }
  },

  // Accessories
  {
    id: '11',
    name: 'Gardening Tool Set (5 Pieces)',
    description: 'Complete set of essential gardening tools including trowel, fork, pruner, and more.',
    price: 799,
    originalPrice: 1199,
    discount: 33,
    category: 'accessories',
    subcategory: 'Tools',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500',
    rating: 4.7,
    reviewCount: 267,
    inStock: true,
    stock: 88,
    bestseller: true,
    tags: ['Tool Set', 'Stainless Steel', 'Ergonomic'],
    specifications: {
      'Material': 'Stainless Steel',
      'Handle': 'Wooden',
      'Pieces': '5',
      'Warranty': '1 Year'
    }
  },
  {
    id: '12',
    name: 'Automatic Drip Irrigation Kit',
    description: 'Smart watering system for up to 20 plants. Save time and water efficiently.',
    price: 1499,
    originalPrice: 2199,
    discount: 32,
    category: 'accessories',
    subcategory: 'Watering Systems',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500',
    rating: 4.6,
    reviewCount: 189,
    inStock: true,
    stock: 34,
    newArrival: true,
    tags: ['Automatic', 'Water Saving', 'Smart'],
    specifications: {
      'Coverage': 'Up to 20 plants',
      'Timer': 'Included',
      'Hose Length': '10 meters',
      'Power': 'Battery Operated'
    }
  },

  // Fertilizers
  {
    id: '13',
    name: 'Organic Vermicompost (5kg)',
    description: 'Premium quality vermicompost rich in nutrients. Perfect for all types of plants.',
    price: 349,
    category: 'fertilizers',
    subcategory: 'Organic',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=500',
    rating: 4.8,
    reviewCount: 412,
    inStock: true,
    stock: 156,
    bestseller: true,
    tags: ['Organic', '100% Natural', 'All Purpose'],
    specifications: {
      'Weight': '5 kg',
      'Type': 'Organic',
      'NPK Ratio': 'Natural',
      'Usage': 'All Plants'
    }
  },
  {
    id: '14',
    name: 'NPK Fertilizer 19:19:19',
    description: 'Balanced fertilizer for healthy growth, flowering, and fruiting.',
    price: 249,
    category: 'fertilizers',
    subcategory: 'Chemical',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=500',
    rating: 4.5,
    reviewCount: 298,
    inStock: true,
    stock: 203,
    tags: ['Balanced', 'Fast Acting', 'All Purpose'],
    specifications: {
      'Weight': '1 kg',
      'Type': 'Chemical',
      'NPK Ratio': '19:19:19',
      'Solubility': 'Water Soluble'
    }
  },

  // Pots & Planters
  {
    id: '15',
    name: 'Ceramic Planter Set (3 Pieces)',
    description: 'Elegant white ceramic planters with drainage holes. Perfect for indoor plants.',
    price: 899,
    originalPrice: 1299,
    discount: 31,
    category: 'pots',
    subcategory: 'Ceramic',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500',
    rating: 4.7,
    reviewCount: 234,
    inStock: true,
    stock: 67,
    featured: true,
    tags: ['Ceramic', 'Drainage', 'Modern Design'],
    specifications: {
      'Material': 'Ceramic',
      'Sizes': '4", 5", 6"',
      'Color': 'White',
      'Drainage': 'Yes'
    }
  },
  {
    id: '16',
    name: 'Hanging Macrame Planter',
    description: 'Handcrafted macrame plant hanger. Adds bohemian charm to any space.',
    price: 449,
    category: 'pots',
    subcategory: 'Hanging',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500',
    rating: 4.6,
    reviewCount: 156,
    inStock: true,
    stock: 89,
    newArrival: true,
    tags: ['Handmade', 'Bohemian', 'Hanging'],
    specifications: {
      'Material': 'Cotton Rope',
      'Length': '100 cm',
      'Pot Size': 'Fits 6-8 inch',
      'Style': 'Macrame'
    }
  }
];

export const featuredProducts = products.filter(p => p.featured);
export const bestsellerProducts = products.filter(p => p.bestseller);
export const newArrivalProducts = products.filter(p => p.newArrival);
