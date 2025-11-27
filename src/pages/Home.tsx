import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight } from 'lucide-react';
import ProductCard from '../components/features/ProductCard';
import { categories, featuredProducts, bestsellerProducts } from '../data/products';

const Home: React.FC = () => {
  // Carousel state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const carouselImages = [
    'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1466781783364-36c955e42a7f?auto=format&fit=crop&q=80&w=800',
  ];

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  return (
    <div className="pb-20 lg:pb-0 bg-neutral-50">
      {/* Hero Section */}
      <section className="relative min-h-[500px] lg:min-h-[550px] bg-gradient-to-br from-[#1a3a0f] via-[#2d5016] to-[#1f4412] text-white overflow-hidden">
        {/* Animated 3D Background Elements */}
        <div className="absolute inset-0">
          {/* Large floating orbs with 3D effect */}
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
          
          {/* Floating geometric shapes */}
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
          
          {/* Grid pattern overlay */}
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
              
              {/* Main Heading with 3D effect */}
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
              
              {/* Subtitle */}
              <p className="text-base lg:text-lg text-white/70 leading-relaxed max-w-xl font-light">
                Curated selection of premium plants and aquatic life for the discerning collector. Transform your environment into a living masterpiece.
              </p>
              
              {/* CTA Buttons */}
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
              
              {/* Stats */}
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
            
            {/* Right - 3D Visual Element */}
            <div className="relative hidden lg:block animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="relative">
                {/* Main card with 3D effect */}
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-[2rem] p-6 border border-white/20 shadow-2xl overflow-hidden"
                  style={{
                    transform: 'perspective(1000px) rotateY(-5deg) rotateX(5deg)',
                    boxShadow: '0 50px 100px rgba(0,0,0,0.4), 0 0 80px rgba(212,175,55,0.15), inset 0 1px 0 rgba(255,255,255,0.1)'
                  }}
                >
                  {/* Inner glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/5 via-transparent to-transparent" />
                  
                  <div className="relative aspect-square bg-gradient-to-br from-white/10 to-transparent rounded-2xl overflow-hidden border border-white/10">
                    {/* Carousel Images */}
                    <div className="relative w-full h-full">
                      {carouselImages.map((image, index) => (
                        <div
                          key={index}
                          className={`absolute inset-0 transition-opacity duration-1000 ${
                            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`Plant ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {/* Gradient overlay for better text visibility */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                        </div>
                      ))}
                      
                      {/* Carousel Dots */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {carouselImages.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              index === currentImageIndex 
                                ? 'bg-white w-6' 
                                : 'bg-white/50 hover:bg-white/75'
                            }`}
                            aria-label={`Go to image ${index + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating info cards - Outside container */}
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
                
                {/* Decorative circles - More subtle */}
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-white/5 rounded-full animate-spin-slow" />
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-white/5 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '30s' }} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#fafaf9"/>
          </svg>
        </div>
      </section>

      {/* Categories */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#2d5016] mb-3 font-['Playfair_Display']">Shop by Category</h2>
            <p className="text-gray-500 font-light tracking-wide">Curated collections for every space</p>
          </div>
          <Link to="/categories" className="group flex items-center gap-2 text-[#2d5016] font-semibold hover:text-[#d4af37] transition-colors">
            <span className="relative">
              View All
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#d4af37] transition-all duration-300 group-hover:w-full"></span>
            </span>
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        {/* Desktop Grid View */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className="group relative"
            >
              <div className="relative aspect-[4/5] bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 group-hover:-translate-y-2 border border-gray-100">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 group-hover:to-black/20 transition-colors duration-500" />
                
                {/* Icon Container */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <div className="w-16 h-16 bg-[#f5f5f0] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#2d5016] transition-all duration-500 shadow-sm">
                    <span className="text-3xl group-hover:text-white transition-colors duration-500">{category.icon}</span>
                  </div>
                  
                  <h3 className="text-base font-bold text-gray-900 text-center group-hover:text-[#2d5016] transition-colors duration-300 font-['Playfair_Display']">
                    {category.name}
                  </h3>
                  <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                    Explore
                  </p>
                </div>
                
                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-12 h-12 bg-[#2d5016]/5 rounded-bl-[2rem] -mr-6 -mt-6 transition-all duration-500 group-hover:bg-[#d4af37]/20 group-hover:scale-150" />
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile Horizontal Scroll View */}
        <div className="md:hidden flex overflow-x-auto gap-4 pb-4 -mx-6 px-6 no-scrollbar snap-x snap-mandatory">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className="flex-shrink-0 w-32 snap-start"
            >
              <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-2">
                <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                  <div className="w-12 h-12 bg-[#f5f5f0] rounded-full flex items-center justify-center mb-2">
                    <span className="text-2xl">{category.icon}</span>
                  </div>
                </div>
              </div>
              <h3 className="text-xs font-bold text-gray-900 text-center font-['Playfair_Display']">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2 font-['Playfair_Display']">Featured Collection</h2>
              <p className="text-gray-600">Handpicked premium selections</p>
            </div>
            <Link to="/featured" className="text-[#2d5016] font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              View All <ChevronRight size={20} />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="px-6 py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2 font-['Playfair_Display']">Bestsellers</h2>
              <p className="text-gray-600">Most loved by our customers</p>
            </div>
            <Link to="/bestsellers" className="text-[#2d5016] font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              View All <ChevronRight size={20} />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {bestsellerProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
