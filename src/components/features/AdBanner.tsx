import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../lib/axios';



interface CustomAd {
  id: number;
  title: string;
  description: string;
  image: string;
  link?: string;
  is_active: boolean;
  created_at: string;
}

interface BannerSlide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  color: string;
  link?: string;
}

interface AdBannerProps {
  fixedIndex?: number;
  className?: string;
  variant?: 'hero' | 'banner';
}



const AdBanner: React.FC<AdBannerProps> = ({ fixedIndex, className = '', variant = 'banner' }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<BannerSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const gradientColors = [
    'from-emerald-500 to-teal-600',
    'from-blue-500 to-cyan-600',
    'from-amber-500 to-orange-600',
    'from-purple-500 to-pink-600',
    'from-rose-500 to-red-600',
  ];

  useEffect(() => {
    const fetchCustomAds = async () => {
      try {
        const response = await api.get<CustomAd[]>('/api/custom-ads/');
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        
        const transformedSlides: BannerSlide[] = response.data
          .filter(ad => ad.is_active)
          .map((ad, index) => {
            // Check if image URL is relative and prepend base URL
            const imageUrl = ad.image.startsWith('http') 
              ? ad.image 
              : `${baseURL}${ad.image.startsWith('/') ? ad.image : '/' + ad.image}`;
            
            return {
              id: ad.id,
              title: ad.title,
              subtitle: ad.description,
              image: imageUrl,
              color: gradientColors[index % gradientColors.length],
              link: ad.link,
            };
          });

        if (transformedSlides.length > 0) {
          setSlides(transformedSlides);
        } else {
          setSlides([
            {
              id: 1,
              title: variant === 'hero' ? 'Bring Nature Home' : 'New Arrivals',
              subtitle: variant === 'hero' ? 'Curated for style & wellness' : 'Fresh plants just for you',
              image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=800',
              color: 'from-emerald-900 to-teal-900', // Darker for hero text readability
              link: '/search'
            },
            {
              id: 2,
              title: 'Urban Jungle',
              subtitle: 'Transform your space',
              image: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&q=80&w=800',
              color: 'from-green-900 to-emerald-900'
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching custom ads:', error);
        setSlides([
          {
            id: 1,
            title: variant === 'hero' ? 'Bring Nature Home' : 'New Arrivals',
            subtitle: variant === 'hero' ? 'Curated for style & wellness' : 'Fresh plants just for you',
            image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=800',
            color: 'from-emerald-900 to-teal-900',
            link: '/search'
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomAds();
  }, []);


  useEffect(() => {
    if (fixedIndex !== undefined) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length, fixedIndex]);

  const nextSlide = () => {
    if (fixedIndex !== undefined) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    if (fixedIndex !== undefined) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Touch handling for mobile slide swipe
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (fixedIndex !== undefined) return;
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (fixedIndex !== undefined) return;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (fixedIndex !== undefined) return;
    if (touchStartX.current === null || touchEndX.current === null) return;
    const difference = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50; // px

    if (difference > minSwipeDistance) {
      nextSlide();
    } else if (difference < -minSwipeDistance) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const displaySlides = fixedIndex !== undefined && slides[fixedIndex] 
    ? [slides[fixedIndex]] 
    : slides;
    
  

  return (
    <section className={`relative overflow-hidden ${className}`}>
      {/* Loading State */}
      {loading && (
        <div className="animate-pulse">
          <div className="hidden md:block h-64 lg:h-80 bg-gray-200 rounded-lg" />
          <div className="md:hidden h-32 bg-gray-200 rounded-2xl mx-4" />
        </div>
      )}

      {/* Show banner only when loaded and has slides */}
      {!loading && slides.length > 0 && (
        <>
          {/* Desktop Banner */}
          <div className="hidden md:block relative h-64 lg:h-80">
            <div className="relative h-full">
              {displaySlides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                    index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
                  }`}
                >
                  <div className={`relative h-full bg-gradient-to-r ${slide.color} overflow-hidden`}>
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0">
                      <img 
                        src={slide.image} 
                        alt={slide.title}
                        className="w-full h-full object-cover opacity-30"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="relative h-full max-w-7xl mx-auto px-6 flex items-center">
                      <div className="text-white max-w-2xl">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-3 font-['Playfair_Display'] animate-slide-up">
                          {slide.title}
                        </h2>
                        <p className="text-xl lg:text-2xl font-light mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                          {slide.subtitle}
                        </p>
                        {slide.link ? (
                          <a 
                            href={slide.link}
                            className="inline-block px-8 py-3 bg-white text-gray-900 rounded-full font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 animate-slide-up" 
                            style={{ animationDelay: '0.2s' }}
                          >
                            Shop Now
                          </a>
                        ) : (
                          <button className="px-8 py-3 bg-white text-gray-900 rounded-full font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            Shop Now
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows - Hide if fixedIndex is set */}
            {fixedIndex === undefined && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full flex items-center justify-center transition-all group"
                >
                  <ChevronLeft size={24} className="text-white group-hover:scale-110 transition-transform" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full flex items-center justify-center transition-all group"
                >
                  <ChevronRight size={24} className="text-white group-hover:scale-110 transition-transform" />
                </button>

                {/* Dots Indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`transition-all duration-300 rounded-full ${
                        index === currentSlide 
                          ? 'w-8 h-2 bg-white' 
                          : 'w-2 h-2 bg-white/50 hover:bg-white/75'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Mobile Banner - App-like compact design */}
          <div className="md:hidden">
            <div
              className={`relative overflow-hidden ${variant === 'hero' ? 'h-[220px]' : 'h-40'}`}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {displaySlides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                    index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
                  }`}
                >
                  <div className={`relative h-full w-full bg-gray-900`}>
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <img 
                        src={slide.image} 
                        alt={slide.title}
                        className="w-full h-full object-cover opacity-80"
                      />
                      {/* Gradient overlay for text readability */}
                      <div className={`absolute inset-0 bg-gradient-to-t ${variant === 'hero' ? 'from-black/80 via-black/20 to-transparent' : 'from-black/60 to-transparent'}`} />
                    </div>

                    {/* Content */}
                    <div className={`relative h-full px-6 flex flex-col ${variant === 'hero' ? 'justify-end pb-12' : 'justify-center items-start'}`}>
                      <div className="text-white w-full">
                        <h3 className={`${variant === 'hero' ? 'text-4xl leading-tight mb-2' : 'text-xl'} font-bold font-['Playfair_Display'] drop-shadow-lg`}>
                          {slide.title}
                        </h3>
                        <p className={`${variant === 'hero' ? 'text-base mb-6 opacity-90' : 'text-xs opacity-90'}`}>
                          {slide.subtitle}
                        </p>
                        
                        {variant === 'hero' && (
                          slide.link ? (
                            <a 
                              href={slide.link}
                              className="inline-block px-8 py-3 bg-[#2d5016] text-white rounded-full text-base font-bold shadow-lg hover:bg-[#3d6622] transition-colors"
                            >
                              Shop Collection
                            </a>
                          ) : (
                            <button className="px-8 py-3 bg-[#2d5016] text-white rounded-full text-base font-bold shadow-lg hover:bg-[#3d6622] transition-colors">
                              Shop Collection
                            </button>
                          )
                        )}
                      </div>
                      
                      {/* Small button for non-hero banner */}
                      {variant !== 'hero' && (
                        <div className="mt-2">
                           {slide.link ? (
                            <a href={slide.link} className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-white border border-white/40 rounded-full text-xs font-semibold hover:bg-white/30 transition-colors">Shop Now</a>
                           ) : (
                            <button className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-white border border-white/40 rounded-full text-xs font-semibold hover:bg-white/30 transition-colors">Shop Now</button>
                           )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Dots - Smaller and positioned inside */}
            {fixedIndex === undefined && (
              <div className="flex justify-center gap-1.5 mt-3">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`transition-all duration-300 rounded-full ${
                      index === currentSlide 
                        ? 'w-6 h-1.5 bg-[#2d5016]' 
                        : 'w-1.5 h-1.5 bg-gray-300'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default AdBanner;
