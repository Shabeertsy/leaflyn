import type { APIProductVariant, Product } from '../types';

const toTitleCase = (text: string): string => {
  if (!text) return text;
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Helper to capitalize first letter of sentence
const toSentenceCase = (text: string): string => {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const mapVariantToProduct = (variant: APIProductVariant): Product => {
  const price = parseFloat(variant.price);
  

  // Map category ID to string (mock mapping)
  const categoryMap: Record<number, Product['category']> = {
    1: 'indoor-plants',
    2: 'outdoor-plants',
    3: 'aquatics',
    4: 'accessories',
    5: 'fertilizers',
    6: 'pots',
  };

  // Helper to get absolute image URL
  const getAbsoluteImageUrl = (path: string | null | undefined) => {
    if (!path) return 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=800';
    if (path.startsWith('http')) return path;
    
    // Get base URL from env or default
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';
    try {
      // If apiBase is a full URL, extract origin
      const url = new URL(apiBase);
      return `${url.origin}${path}`;
    } catch {
      // Fallback if URL parsing fails
      return `http://localhost:8000${path}`;
    }
  };

  const images = variant.images?.map(img => getAbsoluteImageUrl(img.image)) || [];
  const mainImage = images.length > 0 ? images[0] : getAbsoluteImageUrl(null);

  return {
    id: variant.uuid,
    name: toTitleCase(variant.name),
    description: toSentenceCase(variant.product.description),
    price: price,
    originalPrice:parseFloat(variant.original_price),
    discount: variant.offer_percentage,
    category: categoryMap[variant.product.category] || 'indoor-plants',
    image: mainImage,
    images: images,
    rating: 4.5, // Mock
    reviewCount: 0,
    inStock: variant.stock > 0,
    stock: variant.stock,
    featured: true, // Since it's from featured collection
    tags: variant.care_guides.map(g => g.title),
    careInstructions: variant.care_guides.sort((a, b) => a.order - b.order),
    specifications: {
      ...(variant.height && { 'Height': variant.height }),
      ...(variant.pot_size && { 'Pot Size': variant.pot_size }),
      ...(variant.light && { 'Light': variant.light }),
      ...(variant.water && { 'Water': variant.water }),
      ...(variant.growth_rate && { 'Growth Rate': variant.growth_rate }),
    },
  };
};
