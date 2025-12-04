export interface Product {
  id: string;
  uuid?: string; // Optional UUID for API products
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: 'indoor-plants' | 'outdoor-plants' | 'aquatics' | 'accessories' | 'fertilizers' | 'pots';
  subcategory?: string;
  image: string;
  images?: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stock?: number;
  featured?: boolean;
  bestseller?: boolean;
  newArrival?: boolean;
  tags?: string[];
  specifications?: {
    [key: string]: string;
  };
  careInstructions?: (string | { title: string; content: string })[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

// Backend API Cart Types
export interface APICartItem {
  uuid: string;
  variant: APIProductVariant;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface APICart {
  uuid: string;
  user: number;
  items: APICartItem[];
  coupon: string | null;
  total: number;
  created_at: string;
  updated_at: string;
}

export interface APIWishlistItem {
  uuid: string;
  user: number;
  variant: APIProductVariant;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  email: string;
  phone_number: string | null;
  first_name: string;
  last_name: string;
  avatar: string | null;
  bio: string;
  created_at: string;
  is_verified: boolean;
  user_type: string;
  addresses?: Address[];
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  discount?: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'cod' | 'card' | 'upi' | 'wallet';
  paymentStatus: 'pending' | 'paid' | 'failed';
  shippingAddress: Address;
  createdAt: Date;
  updatedAt: Date;
  deliveryDate?: Date;
}

// API Order Types
export interface APIOrderItem {
  uuid: string;
  variant: APIProductVariant;
  quantity: number;
  price: string;
  total: string;
}

export interface APIOrder {
  uuid: string;
  order_number: string;
  user: number;
  items: APIOrderItem[];
  total: string;
  subtotal: string;
  shipping: string;
  tax: string;
  discount?: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: 'cod' | 'card' | 'upi' | 'wallet';
  payment_status: 'pending' | 'paid' | 'failed';
  shipping_address: Address;
  created_at: string;
  updated_at: string;
  delivery_date?: string;
}

// Notification Types
export interface APINotification {
  uuid: string;
  id: number;
  user: number;
  title: string;
  message: string;
  type: 'order' | 'wishlist' | 'offer' | 'delivery' | 'general';
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  type: 'order' | 'wishlist' | 'offer' | 'delivery' | 'general';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface Category {
  id: string;
  category_name: string;
  slug: string;
  icon: string;
  image: string;
  description?: string;
  productCount?: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: Date;
  helpful?: number;
}

export interface WishlistItem {
  productId: string;
  addedAt: Date;
}

export interface SearchFilters {
  category?: string;
  priceRange?: [number, number];
  rating?: number;
  inStock?: boolean;
  sortBy?: 'price-low' | 'price-high' | 'rating' | 'newest' | 'popular';
}

export interface APIProduct {
  id: number;
  uuid: string;
  created_at: string;
  updated_at: string;
  active_status: boolean;
  deleted_at: string | null;
  name: string;
  title: string;
  description: string;
  base_price: string | null;
  category: number;
}

export interface APISize {
  id: number;
  uuid: string;
  created_at: string;
  updated_at: string;
  active_status: boolean;
  deleted_at: string | null;
  size: string;
  measurement: string | null;
}

export interface APICareGuide {
  uuid: string;
  title: string;
  content: string;
  is_active: boolean;
  order: number;
}

export interface APIProductVariant {
  uuid: string;
  product: APIProduct;
  description: string;
  color: string | null;
  size: APISize | null;
  stock: number;
  price: string;
  variant: string;
  offer_type: string;
  original_price: string;
  offer_symbol: string;
  offer_percentage: number;
  name: string;
  height: string | null;
  pot_size: string | null;
  light: string | null;
  water: string | null;
  growth_rate: string | null;
  care_guides: APICareGuide[];
  images: APIProductImage[];
  created_at: string;
  updated_at: string;
}

export interface APIProductImage {
  uuid: string;
  image: string;
  created_at: string;
  updated_at: string;
}

export interface ProductCollectionResponse {
  featured_products: APIProductVariant[];
  bestseller_products: APIProductVariant[];
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ContactUs {
  id?: string;
  name: string;
  email: string;
  subject: string;
  phone: string;
  content: string;
  created_at?: string;
  updated_at?: string;
}

export interface TermsCondition {
  id: string;
  uuid: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// Service-related types
export interface ServiceCategory {
  id: number;
  uuid: string;
  created_at: string;
  updated_at: string;
  active_status: boolean;
  deleted_at: string | null;
  name: string;
  icon: string | null;
}

export interface ServiceFeature {
  uuid: string;
  id: number;
  name: string;
}

export interface ServiceImage {
  uuid: string;
  id: number;
  image: string;
  order_by: number;
}

export interface Service {
  uuid: string;
  id: number;
  category: ServiceCategory | number; // Can be either full object or just ID
  name: string;
  description: string | null;
  price: string;
  image: string;
  features: ServiceFeature[];
  images: ServiceImage[];
  created_at: string;
  updated_at: string;
}

export * from './company';
