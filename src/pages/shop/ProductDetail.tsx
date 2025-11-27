import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Heart, Share2, Star, ShoppingCart, Truck, Shield, 
  RefreshCw, ChevronRight, Leaf, Droplet, Sun, ThermometerSun,
  Package, Award, CheckCircle, Minus, Plus
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { products } from '../../data/products';
import ProductCard from '../../components/features/ProductCard';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);
  const { addToWishlist, removeFromWishlist, wishlist } = useWishlistStore();
  
  const product = products.find((p) => p.id === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'care'>('description');
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  if (!product) {
    return (
      <div className="pb-20 lg:pb-0 px-6 py-16 text-center max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
        <Link to="/" className="text-[#2d5016] font-semibold">
          Go back to home
        </Link>
      </div>
    );
  }

  const inWishlist = wishlist.some(item => item.productId === product.id);
  const images = product.images || [product.image];
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }
  };

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && selectedImage < images.length - 1) {
      setSelectedImage(selectedImage + 1);
    }
    if (isRightSwipe && selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
    }
  };

  return (
    <div className="pb-32 lg:pb-0 bg-neutral-50">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-200 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleWishlistToggle}
              className={`p-2 rounded-full transition-all ${
                inWishlist 
                  ? 'bg-red-50 text-red-500' 
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <Heart size={24} fill={inWishlist ? 'currentColor' : 'none'} />
            </button>
            <button 
              onClick={handleShare}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-700"
            >
              <Share2 size={24} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Image Gallery Section */}
        <div className="bg-white">
          <div 
            className="relative aspect-square lg:aspect-[16/10] bg-gradient-to-br from-neutral-50 to-white overflow-hidden"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div 
              className="flex transition-transform duration-300 ease-out h-full"
              style={{ transform: `translateX(-${selectedImage * 100}%)` }}
            >
              {images.map((image, index) => (
                <div key={index} className="w-full h-full flex-shrink-0">
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-contain p-8 lg:p-16"
                  />
                </div>
              ))}
            </div>
            
            {product.discount && (
              <div className="absolute top-6 left-6 bg-gradient-to-r from-[#2d5016] to-[#3d6622] text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg z-10">
                {product.discount}% OFF
              </div>
            )}
            {!product.inStock && (
              <div className="absolute top-6 right-6 bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg z-10">
                Out of Stock
              </div>
            )}
            
            {/* Dot Indicators for Mobile */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10 lg:hidden">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`transition-all ${
                      selectedImage === index
                        ? 'w-8 h-2 bg-[#2d5016]'
                        : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                    } rounded-full`}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="flex gap-3 p-4 lg:p-6 overflow-x-auto no-scrollbar">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? 'border-[#2d5016] scale-105 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info Section */}
        <div className="px-6 py-8 bg-white mt-2">
          {/* Category Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#2d5016]/10 rounded-full mb-4">
            <Leaf size={14} className="text-[#2d5016]" />
            <span className="text-sm text-[#2d5016] font-bold uppercase tracking-wide">
              {product.category.replace('-', ' ')}
            </span>
          </div>

          {/* Product Name */}
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 font-['Playfair_Display'] leading-tight">
            {product.name}
          </h1>

          {/* Rating & Reviews */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i < Math.floor(product.rating) ? 'fill-[#d4af37] text-[#d4af37]' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-lg font-bold text-gray-900">{product.rating}</span>
            </div>
            <span className="text-gray-400">|</span>
            <Link to="#reviews" className="text-sm text-gray-600 hover:text-[#2d5016] font-medium">
              {product.reviewCount} Reviews
            </Link>
          </div>

          {/* Price Section */}
          <div className="mb-8">
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-4xl lg:text-5xl font-bold text-[#2d5016]">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-gray-400 line-through">₹{product.originalPrice}</span>
                  <span className="px-3 py-1 bg-green-50 text-green-700 text-sm font-bold rounded-full">
                    Save ₹{product.originalPrice - product.price}
                  </span>
                </>
              )}
            </div>
            <p className="text-sm text-gray-500">Inclusive of all taxes</p>
          </div>

          {/* Quick Features */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { icon: Truck, label: 'Free Delivery', color: 'text-blue-600', bg: 'bg-blue-50' },
              { icon: Shield, label: 'Quality Assured', color: 'text-green-600', bg: 'bg-green-50' },
              { icon: RefreshCw, label: '7 Day Return', color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map((feature, index) => (
              <div key={index} className={`${feature.bg} rounded-xl p-4 text-center transition-transform hover:scale-105`}>
                <feature.icon className={`mx-auto mb-2 ${feature.color}`} size={24} />
                <p className="text-xs font-bold text-gray-700">{feature.label}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex gap-6">
              {[
                { id: 'description', label: 'Description' },
                { id: 'specs', label: 'Specifications' },
                { id: 'care', label: 'Care Guide' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-4 px-2 font-bold text-sm transition-colors relative ${
                    activeTab === tab.id
                      ? 'text-[#2d5016]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2d5016]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="mb-8">
            {activeTab === 'description' && (
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-4">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-neutral-100 text-gray-700 text-sm font-medium rounded-full hover:bg-neutral-200 transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'specs' && product.specifications && (
              <div className="bg-neutral-50 rounded-2xl p-6 space-y-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
                    <span className="text-gray-600 font-medium flex items-center gap-2">
                      {key === 'Light' && <Sun size={16} className="text-yellow-500" />}
                      {key === 'Water' && <Droplet size={16} className="text-blue-500" />}
                      {key === 'Temperature' && <ThermometerSun size={16} className="text-orange-500" />}
                      {key}
                    </span>
                    <span className="font-bold text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'care' && product.careInstructions && (
              <div className="space-y-3">
                {product.careInstructions.map((instruction, index) => (
                  <div key={index} className="flex gap-3 p-4 bg-green-50 rounded-xl">
                    <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{instruction}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Additional Info Cards */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gradient-to-br from-[#2d5016]/5 to-[#2d5016]/10 rounded-2xl p-4 border border-[#2d5016]/20">
              <Package size={24} className="text-[#2d5016] mb-2" />
              <h4 className="font-bold text-gray-900 mb-1">Premium Packaging</h4>
              <p className="text-xs text-gray-600">Carefully packed to ensure safe delivery</p>
            </div>
            <div className="bg-gradient-to-br from-[#d4af37]/5 to-[#d4af37]/10 rounded-2xl p-4 border border-[#d4af37]/20">
              <Award size={24} className="text-[#d4af37] mb-2" />
              <h4 className="font-bold text-gray-900 mb-1">Quality Guarantee</h4>
              <p className="text-xs text-gray-600">100% healthy plants guaranteed</p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="px-6 py-12 bg-white mt-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 font-['Playfair_Display']">You May Also Like</h3>
              <Link
                to={`/category/${product.category}`}
                className="text-[#2d5016] font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all"
              >
                See All <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-16 lg:bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 lg:p-4 z-20 shadow-2xl">
        <div className="flex gap-2 lg:gap-3 max-w-7xl mx-auto">
          {/* Quantity Selector */}
          <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 lg:px-4 py-3 hover:bg-gray-50 transition-colors active:bg-gray-100"
            >
              <Minus size={16} className="text-gray-700" />
            </button>
            <span className="px-4 lg:px-6 py-3 font-bold text-gray-900 min-w-[50px] lg:min-w-[60px] text-center border-x-2 border-gray-200">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 lg:px-4 py-3 hover:bg-gray-50 transition-colors active:bg-gray-100"
            >
              <Plus size={16} className="text-gray-700" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`flex-1 py-3 lg:py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg text-sm lg:text-base ${
              addedToCart
                ? 'bg-green-600'
                : product.inStock
                ? 'bg-gradient-to-r from-[#2d5016] to-[#3d6622] hover:shadow-xl hover:-translate-y-0.5 active:scale-95'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {addedToCart ? (
              <>
                <CheckCircle size={18} />
                <span className="hidden sm:inline">Added to Cart</span>
                <span className="sm:hidden">Added</span>
              </>
            ) : (
              <>
                <ShoppingCart size={18} />
                {product.inStock ? (
                  <>
                    <span className="hidden sm:inline">Add to Cart</span>
                    <span className="sm:hidden">Add</span>
                  </>
                ) : (
                  'Out of Stock'
                )}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
