import type { APIProductVariant, Product } from '../types';

export const mapVariantToProduct = (variant: APIProductVariant): Product => {
  // Calculate original price if there is a percentage offer
  let originalPrice: number | undefined;
  const price = parseFloat(variant.price);
  
  if (variant.offer && variant.offer_type === 'percentage') {
    // Assuming 'price' is the final price after discount
    // original_price = price / (1 - offer/100)
    // But sometimes APIs send the original price in 'price' and we calculate the discounted one.
    // Let's assume 'price' is the selling price for now.
    // Actually, usually if 'offer' is present, we want to show "was X, now Y".
    // If 23 is the final price, original was higher.
    originalPrice = price / (1 - variant.offer / 100);
  }

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
    name: variant.product.name,
    description: variant.product.description,
    price: price,
    originalPrice: originalPrice ? parseFloat(originalPrice.toFixed(2)) : undefined,
    discount: variant.offer,
    category: categoryMap[variant.product.category] || 'indoor-plants',
    image: mainImage,
    images: images,
    rating: 4.5, // Mock
    reviewCount: 0,
    inStock: variant.stock > 0,
    stock: variant.stock,
    featured: true, // Since it's from featured collection
    tags: variant.care_guides,
    careInstructions: variant.care_guides,
  };
};
