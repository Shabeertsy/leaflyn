import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight } from 'lucide-react';
import ProductCard from '../components/features/ProductCard';
import AdBanner from '../components/features/AdBanner';
import { useCategoriesStore } from '../store/useCategoriesStore';
import { useProductCollectionStore } from '../store/useProductCollectionStore';
import { mapVariantToProduct } from '../lib/mappers';

const MOBILE_HERO_HEIGHT = 200; 

// Get base URL for images
const getImageUrl = (imagePath: string) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  return `${baseURL}${imagePath}`;
}; 

const Home: React.FC = () => {
  const { categories, fetchCategories } = useCategoriesStore();
  const { featuredProducts, bestsellerProducts, fetchProductCollections } = useProductCollectionStore();

  // Carousel state for Hero Banner (mobile only)
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const heroImages = [
    {
      image:
        'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&q=80&w=800',
      heading: "Premium House Plants",
      subline: "Professional e-commerce selection"
    },
    {
      image:
        'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=800',
      heading: "Unique Aquatic Life",
      subline: "Vivid Nature Arrives Home"
    },
    {
      image:
        'https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?auto=format&fit=crop&q=80&w=800',
      heading: "Create Your Green Space",
      subline: "Curated for Style & Wellness"
    }
  ];

  useEffect(() => {
    fetchCategories();
    fetchProductCollections();
  }, [fetchCategories, fetchProductCollections]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div className="pb-20 lg:pb-0 bg-neutral-50 min-h-[100vh]">
      {/* HERO SECTION */}
      {/* MOBILE: App-like hero with more height and image filled exactly like pro-app */}
      <section className="relative w-full mx-auto overflow-hidden">
        <div className="block md:hidden">
          {/* Outer app-like container */}
          {/* Add pt-X here to maintain spacing below navbar */}
          <div className="relative w-full shadow bg-white/95 overflow-hidden pt-3">
            {/* Banner + text */}
            <div className="flex flex-col w-full">
              <div
                className="relative w-full flex items-center justify-center"
                style={{
                  height: MOBILE_HERO_HEIGHT,
                  minHeight: MOBILE_HERO_HEIGHT,
                }}
              >
                {/* Slide images with animations */}
                {heroImages.map((slide, i) => (
                  <div
                    key={i}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-700
                      ${i === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}
                    `}
                  >
                    <img
                      className="object-cover w-full h-full pointer-events-none select-none"
                      src={slide.image}
                      alt={slide.heading}
                      draggable={false}
                      style={{
                        minHeight: MOBILE_HERO_HEIGHT,
                        maxHeight: MOBILE_HERO_HEIGHT,
                        height: MOBILE_HERO_HEIGHT,
                        width: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        border: 'none', // Remove any border visually
                        boxShadow: 'none', // Remove box-shadow if any
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-transparent" />
                  </div>
                ))}

                {/* Carousel dots */}
                <div className="absolute bottom-3 w-full flex justify-center items-center z-20 pointer-events-auto">
                  <div className="flex gap-1.5">
                    {heroImages.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        aria-label={`Go to slide ${idx + 1}`}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`
                          h-2 transition-all duration-200 rounded-full
                          ${idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/50 w-2'}
                        `}
                        tabIndex={0}
                        style={{
                          outline: 'none',
                          border: 'none',
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Banner text OVER image (centered, down, without pointer events) */}
                <div className="absolute left-0 right-0 bottom-7 flex flex-col items-center px-3 pointer-events-none z-20">
                  <h1 className="text-white text-lg font-bold font-['Playfair_Display'] drop-shadow-md text-center leading-tight max-w-[260px]">
                    {heroImages[currentImageIndex].heading}
                  </h1>
                  <span className="mt-1 text-sm text-white/90 drop-shadow font-normal text-center leading-snug max-w-[225px]">
                    {heroImages[currentImageIndex].subline}
                  </span>
                </div>
              </div>
              {/* App-like CTA & stats row, separate and visually bold */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-white/99 border-t border-neutral-200 z-20" style={{ minHeight: 44 }}>
                <Link
                  to="/search"
                  className="inline-flex items-center px-5 py-2.5 rounded-[999px] bg-[#2d5016] text-white font-bold text-[15px] shadow hover:bg-[#263c11] active:scale-95 transition-all"
                >
                  Shop Now
                  <ArrowRight size={16} className="ml-1" />
                </Link>
                <div className="flex gap-4 items-center text-sm text-[#2d5016] font-semibold ml-2">
                  <div className="flex items-center gap-0.5">
                    <span className="font-bold text-[#d4af37] text-lg">500+</span>
                    <span className="ml-0.5">Plants</span>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 inline-block mx-1" />
                  <div className="flex items-center gap-0.5">
                    <span className="font-bold text-[#d4af37] text-lg">4.9</span>
                    <span className="ml-0.5">★</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* DESKTOP: Keep original hero section */}
        <div className="hidden md:block">
          <section className="relative min-h-[500px] lg:min-h-[550px] bg-gradient-to-br from-[#1a3a0f] via-[#2d5016] to-[#1f4412] text-white overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-[#d4af37]/30 to-transparent rounded-full blur-3xl animate-pulse"
                style={{
                  animationDuration: '8s',
                  transform: 'translateZ(0)',
                  boxShadow: '0 25px 50px -12px rgba(212, 175, 55, 0.25)'
                }}
              />
              <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-gradient-to-tl from-[#8b7355]/20 to-transparent rounded-full blur-3xl animate-pulse"
                style={{
                  animationDuration: '10s',
                  animationDelay: '2s',
                  transform: 'translateZ(0)',
                  boxShadow: '0 25px 50px -12px rgba(139, 115, 85, 0.15)'
                }}
              />
              <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-full blur-3xl animate-pulse"
                style={{
                  animationDuration: '12s',
                  animationDelay: '4s',
                  transform: 'translateZ(0)'
                }}
              />
              <div className="absolute top-40 right-1/4 w-32 h-32 border-2 border-[#d4af37]/20 rounded-2xl rotate-45 animate-float"
                style={{
                  animation: 'float 6s ease-in-out infinite',
                  boxShadow: '0 10px 30px rgba(212, 175, 55, 0.1)'
                }}
              />
              <div className="absolute bottom-40 left-1/4 w-24 h-24 border-2 border-white/10 rounded-full animate-float"
                style={{
                  animation: 'float 8s ease-in-out infinite',
                  animationDelay: '1s'
                }}
              />
              <div className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)',
                  backgroundSize: '50px 50px'
                }}
              />
            </div>
            <div className="relative px-6 py-16 lg:py-20 max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <div className="space-y-6 animate-slide-up">
                  {/* Premium Badge */}
                  <div className="inline-flex items-center gap-2.5 bg-gradient-to-r from-white/15 to-white/5 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/30 shadow-lg">
                    <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full animate-pulse shadow-lg shadow-[#d4af37]/50" />
                    <span className="text-white/90 font-semibold tracking-[0.2em] uppercase text-[10px] letter-spacing-wide">Premium Collection 2024</span>
                  </div>
                  <h1 className="text-4xl lg:text-6xl font-bold leading-[1.1] font-['Playfair_Display']"
                    style={{
                      textShadow: '0 4px 20px rgba(0,0,0,0.4), 0 0 40px rgba(212,175,55,0.15)',
                      letterSpacing: '-0.02em'
                    }}
                  >
                    <span className="text-white">Elevate Your Space</span>
                    <br />
                    <span className="text-white">with</span>
                    <span className="block mt-1 bg-gradient-to-r from-[#f4d03f] via-[#d4af37] to-[#c9a961] bg-clip-text text-transparent"
                      style={{
                        backgroundSize: '200% auto',
                        animation: 'shimmer 4s linear infinite'
                      }}
                    >
                      Nature's Finest
                    </span>
                  </h1>
                  <p className="text-base lg:text-lg text-white/70 leading-relaxed max-w-xl font-light">
                    Curated selection of premium plants and aquatic life for the discerning collector. Transform your environment into a living masterpiece.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Link
                      to="/search"
                      className="group relative inline-flex items-center gap-2.5 px-8 py-3.5 bg-white text-[#2d5016] rounded-full font-bold overflow-hidden transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02]"
                    >
                      <span className="relative z-10">Explore Collection</span>
                      <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>
                    <button className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white/5 backdrop-blur-xl text-white rounded-full font-semibold hover:bg-white/10 transition-all duration-300 border border-white/20 hover:border-white/30">
                      <span>Watch Video</span>
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                        <div className="w-0 h-0 border-l-[6px] border-l-white border-y-[4px] border-y-transparent ml-0.5" />
                      </div>
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10">
                    {[
                      { value: '500+', label: 'Premium Plants' },
                      { value: '50k+', label: 'Happy Customers' },
                      { value: '4.9', label: 'Average Rating', icon: '★' }
                    ].map((stat, index) => (
                      <div key={index} className="text-center lg:text-left">
                        <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-br from-[#f4d03f] to-[#d4af37] bg-clip-text text-transparent mb-1">
                          {stat.value}{stat.icon}
                        </div>
                        <div className="text-[11px] text-white/50 uppercase tracking-wider font-medium">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Right - 3D image */}
                <div className="relative hidden lg:block animate-slide-up" style={{ animationDelay: '0.2s' }}>
                  <div className="relative">
                    <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-[2rem] p-6 border border-white/20 shadow-2xl overflow-hidden"
                      style={{
                        transform: 'perspective(1000px) rotateY(-5deg) rotateX(5deg)',
                        boxShadow: '0 50px 100px rgba(0,0,0,0.4), 0 0 80px rgba(212,175,55,0.15), inset 0 1px 0 rgba(255,255,255,0.1)'
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/5 via-transparent to-transparent" />
                      <div className="relative aspect-square bg-gradient-to-br from-white/10 to-transparent rounded-2xl overflow-hidden border border-white/10">
                        <div className="relative w-full h-full">
                          {heroImages.map((item, index) => (
                            <div
                              key={index}
                              className={`absolute inset-0 transition-opacity duration-1000 ${
                                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                              }`}
                            >
                              <img
                                src={item.image}
                                alt={`Plant ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                            </div>
                          ))}
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                            {heroImages.map((_, idx) => (
                              <button
                                key={idx}
                                onClick={() => setCurrentImageIndex(idx)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                  idx === currentImageIndex
                                    ? 'bg-white w-6'
                                    : 'bg-white/50 hover:bg-white/75'
                                }`}
                                aria-label={`Go to image ${idx + 1}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-3.5 shadow-2xl border border-gray-100 z-10">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#2d5016] to-[#3d6622] rounded-xl flex items-center justify-center shadow-lg">
                          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Quality</div>
                          <div className="font-bold text-gray-900 text-sm">Guaranteed</div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute -bottom-4 -left-4 bg-gradient-to-br from-[#d4af37] to-[#c9a961] rounded-2xl p-3.5 shadow-2xl z-10">
                      <div className="flex items-center gap-2.5">
                        <div className="text-2xl">🚚</div>
                        <div className="text-white">
                          <div className="text-[10px] opacity-90 uppercase tracking-wider font-medium">Free Delivery</div>
                          <div className="font-bold text-sm">Nationwide</div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-white/5 rounded-full animate-spin-slow" />
                    <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-white/5 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '30s' }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0">
              <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#fafaf9"/>
              </svg>
            </div>
          </section>
        </div>
      </section>

      {/* Ad Banner Section */}
      <div className="py-8 bg-white">
        <AdBanner />
      </div>

      {/* Categories Section */}
      <section className="py-12 md:py-16 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-8 gap-3">
            <div className="max-w-2xl">
              <span className="text-[#d4af37] font-bold tracking-widest uppercase text-xs mb-1.5 block">Collections</span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#2d5016] font-['Playfair_Display'] mb-2">
                Explore Our <span className="italic text-gray-400 font-light">Categories</span>
              </h2>
              <p className="text-gray-500 text-sm md:text-base font-light leading-relaxed hidden md:block">
                Discover curated selections tailored to your unique style
              </p>
            </div>
            <Link
              to="/categories"
              className="group inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-100 hover:bg-[#2d5016] text-[#2d5016] hover:text-white rounded-full transition-all duration-300 font-semibold text-sm self-start md:self-auto"
            >
              <span>View All</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Mobile: Compact modern cards */}
          <div className="md:hidden grid grid-cols-3 gap-3">
            {categories.slice(0, 6).map((category, index) => (
              <Link
                key={category.id}
                to={`/search/${category.slug || category.id}`}
                className="group flex flex-col items-center gap-2 p-3 bg-white rounded-2xl hover:shadow-lg transition-all duration-300 active:scale-95"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md ${
                  index % 3 === 0 ? 'bg-gradient-to-br from-green-50 to-emerald-100' :
                  index % 3 === 1 ? 'bg-gradient-to-br from-teal-50 to-cyan-100' :
                  'bg-gradient-to-br from-amber-50 to-orange-100'
                }`}>
                  {category.icon ? (
                    <img 
                      src={getImageUrl(category.icon)} 
                      alt="" 
                      className="w-6 h-6 object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <span className="text-2xl">🌿</span>
                  )}
                </div>
                <div className="text-center w-full">
                  <span className="text-xs font-bold text-gray-800 leading-tight line-clamp-2 block group-hover:text-[#2d5016] transition-colors">
                    {category.category_name}
                  </span>
                  {category.productCount !== undefined && (
                    <span className="text-[10px] text-gray-400 block mt-0.5">
                      {category.productCount} items
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Desktop: Horizontal card design */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                to={`/search/${category.slug || category.id}`}
                className="group relative h-32 rounded-2xl overflow-hidden cursor-pointer border border-gray-200 hover:border-[#2d5016]/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className="absolute inset-0 transition-all duration-300" style={{
                  background: index % 4 === 0 ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' :
                              index % 4 === 1 ? 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)' :
                              index % 4 === 2 ? 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)' :
                              'linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%)'
                }}>
                </div>
                <div className="absolute inset-0 p-5 flex flex-col justify-between">
                  {/* Icon at top left */}
                  <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                    {category.icon ? (
                      <img 
                        src={getImageUrl(category.icon)} 
                        alt="" 
                        className="w-6 h-6 object-contain"
                      />
                    ) : (
                      <span className="text-2xl">🌿</span>
                    )}
                  </div>
                  
                  {/* Text at bottom */}
                  <div>
                    <h3 className="text-base font-bold text-gray-900 uppercase tracking-wide mb-1 group-hover:text-[#2d5016] transition-colors line-clamp-1">
                      {category.category_name}
                    </h3>
                    {category.productCount !== undefined && (
                      <p className="text-xs text-gray-500">
                        {category.productCount} items
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-3 md:px-6 py-8 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-4 md:mb-8">
            <div>
              <h2 className="text-lg md:text-4xl font-bold text-gray-900 mb-1 md:mb-2 font-['Playfair_Display']">Featured Collection</h2>
              <p className="text-gray-600 text-xs md:text-base">Handpicked premium selections</p>
            </div>
            <Link to="/featured" className="text-[#2d5016] font-semibold flex items-center gap-1 text-xs md:text-base hover:gap-2 transition-all">
              View All <ChevronRight size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-5">
            {featuredProducts.length > 0 ? (
              featuredProducts.slice(0, 8).map((variant) => (
                <ProductCard key={variant.uuid} product={mapVariantToProduct(variant)} />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500 text-sm">
                No featured products available at the moment.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="px-3 md:px-6 py-8 md:py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-4 md:mb-8">
            <div>
              <h2 className="text-lg md:text-4xl font-bold text-gray-900 mb-1 md:mb-2 font-['Playfair_Display']">Bestsellers</h2>
              <p className="text-gray-600 text-xs md:text-base">Most loved by our customers</p>
            </div>
            <Link to="/bestsellers" className="text-[#2d5016] font-semibold flex items-center gap-1 text-xs md:text-base hover:gap-2 transition-all">
              View All <ChevronRight size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-5">
            {bestsellerProducts.length > 0 ? (
              bestsellerProducts.slice(0, 8).map((variant) => (
                <ProductCard key={variant.uuid} product={mapVariantToProduct(variant)} />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500 text-sm">
                No bestseller products available at the moment.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
