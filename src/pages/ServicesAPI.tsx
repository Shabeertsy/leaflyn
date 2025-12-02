import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { useServiceStore } from '../store';

const MOBILE_HERO_HEIGHT = 200;

const ServicesAPI: React.FC = () => {
  const { services, categories, isLoading, error, fetchServices } = useServiceStore();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const serviceHeroImages = [
    {
      image: 'https://images.unsplash.com/photo-1466781783364-36c955e42a7f?auto=format&fit=crop&q=80&w=800',
      heading: "Professional Plant Care",
      subline: "Expert maintenance for your green friends"
    },
    {
      image: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80&w=800',
      heading: "Landscape Design",
      subline: "Transform your outdoor space"
    },
    {
      image: 'https://images.unsplash.com/photo-1520990269108-4f2d8f1a0c6b?auto=format&fit=crop&q=80&w=800',
      heading: "Aquarium Services",
      subline: "Complete setup and maintenance"
    }
  ];

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % serviceHeroImages.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [serviceHeroImages.length]);

  // Filter services by selected category
  const filteredServices = selectedCategoryId
    ? services.filter(service => {
        // Handle both cases: category as object or category as ID
        const categoryId = typeof service.category === 'object' 
          ? service.category?.id 
          : service.category;
        return categoryId === selectedCategoryId;
      })
    : services;

  // Get current category details
  const currentCategory = categories.find(cat => cat.id === selectedCategoryId);

  // Get base URL for images
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    return `${baseURL}${imagePath}`;
  };

  return (
    <div className="pb-20 lg:pb-0 bg-neutral-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full mx-auto overflow-hidden">
        {/* MOBILE: App-like hero with carousel */}
        <div className="block md:hidden">
          <div className="relative w-full shadow bg-white/95 overflow-hidden pt-3">
            <div className="flex flex-col w-full">
              <div
                className="relative w-full flex items-center justify-center"
                style={{
                  height: MOBILE_HERO_HEIGHT,
                  minHeight: MOBILE_HERO_HEIGHT,
                }}
              >
                {/* Slide images */}
                {serviceHeroImages.map((slide, i) => (
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
                        border: 'none',
                        boxShadow: 'none',
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-transparent" />
                  </div>
                ))}

                {/* Carousel dots */}
                <div className="absolute bottom-3 w-full flex justify-center items-center z-20 pointer-events-auto">
                  <div className="flex gap-1.5">
                    {serviceHeroImages.map((_, idx) => (
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
                        style={{ outline: 'none', border: 'none' }}
                      />
                    ))}
                  </div>
                </div>

                {/* Banner text */}
                <div className="absolute left-0 right-0 bottom-7 flex flex-col items-center px-3 pointer-events-none z-20">
                  <h1 className="text-white text-lg font-bold font-['Playfair_Display'] drop-shadow-md text-center leading-tight max-w-[260px]">
                    {serviceHeroImages[currentImageIndex].heading}
                  </h1>
                  <span className="mt-1 text-sm text-white/90 drop-shadow font-normal text-center leading-snug max-w-[225px]">
                    {serviceHeroImages[currentImageIndex].subline}
                  </span>
                </div>
              </div>

              {/* App-like CTA & stats row */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-white/99 border-t border-neutral-200 z-20" style={{ minHeight: 44 }}>
                <a
                  href="#contact"
                  className="inline-flex items-center px-5 py-2.5 rounded-[999px] bg-[#2d5016] text-white font-bold text-[15px] shadow hover:bg-[#263c11] active:scale-95 transition-all"
                >
                  Book Now
                  <ArrowRight size={16} className="ml-1" />
                </a>
                <div className="flex gap-4 items-center text-sm text-[#2d5016] font-semibold ml-2">
                  <div className="flex items-center gap-0.5">
                    <span className="font-bold text-[#d4af37] text-lg">500+</span>
                    <span className="ml-0.5">Clients</span>
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

        {/* DESKTOP: Original Hero Section */}
        <div className="hidden md:block">
          <div className="relative bg-gradient-to-br from-[#1a3a0f] via-[#2d5016] to-[#1f4412] text-white overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)',
                backgroundSize: '50px 50px'
              }} />
            </div>
            
            <div className="relative px-4 md:px-6 py-12 md:py-20 max-w-7xl mx-auto">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20 mb-6">
                  <div className="w-2 h-2 bg-[#d4af37] rounded-full animate-pulse" />
                  <span className="text-white/90 font-semibold tracking-wider uppercase text-xs">Professional Services</span>
                </div>
                
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight font-['Playfair_Display'] mb-4">
                  <span className="text-white">Expert Care for Your</span>
                  <br />
                  <span className="bg-gradient-to-r from-[#f4d03f] via-[#d4af37] to-[#c9a961] bg-clip-text text-transparent">
                    Green Spaces
                  </span>
                </h1>
                
                <p className="text-base md:text-lg text-white/70 leading-relaxed mb-8">
                  From plant maintenance to complete landscaping solutions, our professional services ensure your plants thrive and your spaces flourish.
                </p>
                
                <div className="flex flex-wrap gap-3">
                  <a 
                    href="#contact" 
                    className="group inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-3.5 bg-white text-[#2d5016] rounded-full font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
                  >
                    <span>Get Started</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                  <a 
                    href="#categories" 
                    className="inline-flex items-center gap-2 px-6 md:px-7 py-3 md:py-3.5 bg-white/5 backdrop-blur-xl text-white rounded-full font-semibold hover:bg-white/10 transition-all duration-300 border border-white/20"
                  >
                    <span>View Services</span>
                  </a>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0">
              <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#fafaf9"/>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section id="categories" className="py-8 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-8 md:mb-12">
            <span className="text-[#d4af37] font-bold tracking-widest uppercase text-xs mb-2 block">Our Services</span>
            <h2 className="text-2xl md:text-4xl font-bold text-[#2d5016] font-['Playfair_Display'] mb-3">
              Service Categories
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose from our comprehensive range of professional services
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#2d5016]" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <p className="text-red-600 font-semibold mb-2">Error loading services</p>
              <p className="text-red-500 text-sm">{error}</p>
              <button
                onClick={() => fetchServices()}
                className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Category Tabs */}
          {!isLoading && !error && categories.length > 0 && (
            <>
              <div className="mb-8">
                {/* Mobile */}
                <div className="md:hidden overflow-x-auto pb-3 -mx-4 px-4">
                  <div className="flex gap-3 min-w-max">
                    <button
                      onClick={() => setSelectedCategoryId(null)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 whitespace-nowrap ${
                        selectedCategoryId === null
                          ? 'bg-gradient-to-r from-[#2d5016] to-[#3d6622] text-white shadow-lg scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span className="font-semibold text-sm">All Services</span>
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategoryId(category.id)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 whitespace-nowrap ${
                          selectedCategoryId === category.id
                            ? 'bg-gradient-to-r from-[#2d5016] to-[#3d6622] text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <span className="font-semibold text-sm capitalize">{category.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Desktop */}
                <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-4">
                  <button
                    onClick={() => setSelectedCategoryId(null)}
                    className={`group p-6 rounded-2xl transition-all duration-300 ${
                      selectedCategoryId === null
                        ? 'bg-gradient-to-br from-[#2d5016] to-[#3d6622] text-white shadow-xl scale-105'
                        : 'bg-gradient-to-br from-gray-50 to-white text-gray-700 hover:shadow-lg border border-gray-200'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all ${
                      selectedCategoryId === null
                        ? 'bg-white/20'
                        : 'bg-gradient-to-br from-emerald-50 to-green-100'
                    }`}>
                      <CheckCircle2 size={24} />
                    </div>
                    <h3 className="font-bold mb-1">All Services</h3>
                    <p className={`text-xs ${
                      selectedCategoryId === null ? 'text-white/80' : 'text-gray-500'
                    }`}>
                      {services.length} services
                    </p>
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategoryId(category.id)}
                      className={`group p-6 rounded-2xl transition-all duration-300 ${
                        selectedCategoryId === category.id
                          ? 'bg-gradient-to-br from-[#2d5016] to-[#3d6622] text-white shadow-xl scale-105'
                          : 'bg-gradient-to-br from-gray-50 to-white text-gray-700 hover:shadow-lg border border-gray-200'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all ${
                        selectedCategoryId === category.id
                          ? 'bg-white/20'
                          : 'bg-gradient-to-br from-emerald-50 to-green-100'
                      }`}>
                        {category.icon ? (
                          <img src={getImageUrl(category.icon)} alt={category.name} className="w-6 h-6" />
                        ) : (
                          <CheckCircle2 size={24} />
                        )}
                      </div>
                       <h3 className="font-bold mb-1 capitalize">{category.name}</h3>
                      <p className={`text-xs ${
                        selectedCategoryId === category.id ? 'text-white/80' : 'text-gray-500'
                      }`}>
                        {services.filter(s => {
                          const catId = typeof s.category === 'object' ? s.category?.id : s.category;
                          return catId === category.id;
                        }).length} services
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Description */}
              {currentCategory && (
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 mb-8 border border-emerald-100">
                  <p className="text-gray-700 text-center md:text-left">
                    <span className="font-bold text-[#2d5016] capitalize">{currentCategory.name}:</span> Professional {currentCategory.name} services
                  </p>
                </div>
              )}

              {/* Services Grid */}
              {filteredServices.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredServices.map((service) => (
                    <div
                      key={service.uuid}
                      className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-[#2d5016]/20 hover:shadow-xl transition-all duration-300"
                    >
                      {/* Service Banner */}
                      <div className="relative h-48 md:h-56 overflow-hidden">
                        <img
                          src={getImageUrl(service.image)}
                          alt={service.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-xl md:text-2xl font-bold text-white font-['Playfair_Display'] mb-1">
                            {service.name}
                          </h3>
                          <div className="text-white/90 font-semibold text-lg">
                            ₹{parseFloat(service.price).toFixed(2)}
                          </div>
                        </div>
                      </div>

                      {/* Service Content */}
                      <div className="p-6">
                        {service.description && (
                          <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2">
                            {service.description}
                          </p>
                        )}

                        {/* Features */}
                        {service.features.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                              <CheckCircle2 size={18} className="text-[#2d5016]" />
                              What's Included
                            </h4>
                            <ul className="space-y-2">
                              {service.features.slice(0, 3).map((feature) => (
                                <li key={feature.uuid} className="flex items-start gap-2 text-sm text-gray-600">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37] mt-1.5 flex-shrink-0" />
                                  <span>{feature.name}</span>
                                </li>
                              ))}
                              {service.features.length > 3 && (
                                <li className="text-sm text-[#2d5016] font-semibold">
                                  +{service.features.length - 3} more features
                                </li>
                              )}
                            </ul>
                          </div>
                        )}

                        {/* Action Button */}
                        <Link
                          to={`/services/${service.id}`}
                          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2d5016] to-[#3d6622] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 group/btn"
                        >
                          <span>View Details</span>
                          <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No services found in this category</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-emerald-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-emerald-100">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#2d5016] font-['Playfair_Display'] mb-4">
                  Need Expert Advice?
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Our team of plant care specialists is ready to help you choose the perfect service for your needs. Get in touch today for a free consultation.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/contact-us"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2d5016] to-[#3d6622] text-white rounded-full font-bold hover:shadow-lg transition-all duration-300"
                  >
                    <span>Contact Us</span>
                    <ArrowRight size={18} />
                  </Link>
                  <Link
                    to="/search"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition-all duration-300"
                  >
                    <span>Browse Products</span>
                  </Link>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl p-6 text-center">
                  <div className="text-4xl font-bold text-[#2d5016] mb-2">500+</div>
                  <div className="text-sm text-gray-600">Happy Clients</div>
                </div>
                <div className="bg-gradient-to-br from-teal-50 to-cyan-100 rounded-2xl p-6 text-center">
                  <div className="text-4xl font-bold text-[#2d5016] mb-2">15+</div>
                  <div className="text-sm text-gray-600">Years Experience</div>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl p-6 text-center">
                  <div className="text-4xl font-bold text-[#2d5016] mb-2">4.9</div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>
                <div className="bg-gradient-to-br from-pink-50 to-rose-100 rounded-2xl p-6 text-center">
                  <div className="text-4xl font-bold text-[#2d5016] mb-2">24/7</div>
                  <div className="text-sm text-gray-600">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesAPI;
