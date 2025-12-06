import React, { useEffect, useState, useRef, useCallback, useLayoutEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Filter } from 'lucide-react';
import ProductCard from '../../components/features/ProductCard';
import { useCategoriesStore } from '../../store/useCategoriesStore';
import { useProductStore } from '../../store/useProductStore';
import { mapVariantToProduct } from '../../lib/mappers';
import type { Product } from '../../types';
import { useCategoryUIStore } from '../../store/useCategoryUIStore';

// Get base URL for images
const getImageUrl = (imagePath: string) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  return `${baseURL}${imagePath}`;
};

const CategoryProducts: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const { categories, fetchCategories } = useCategoriesStore();
  const { products, fetchProducts, isLoading, nextPage, totalCount } = useProductStore();
  
  // Persistent Store
  const { 
    categoryId: storedCategoryId, 
    products: storedProducts, 
    page: storedPage, 
    hasMore: storedHasMore,
    scrollPosition: storedScrollPosition,
    setCategoryState,
    setScrollPosition
  } = useCategoryUIStore();
  
  const [currentCategory, setCurrentCategory] = useState<any>(null);
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const observerTarget = useRef<HTMLDivElement>(null);
  const isRestoredRef = useRef(false);

  // 1. Fetch Categories if not available
  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [categories.length, fetchCategories]);

  // 2. Identify Current Category from Slug
  useEffect(() => {
    if (categories.length > 0 && slug) {
      const normalizedSlug = slug.toLowerCase().trim();
      const foundCategory = categories.find(cat => 
        (cat.slug && cat.slug.toLowerCase() === normalizedSlug) || 
        String(cat.id) === normalizedSlug
      );
      
      if (foundCategory) {
        setCurrentCategory(foundCategory);
      }
    }
  }, [categories, slug]);

  // 3. Initialize: Restore or Fetch
  useEffect(() => {
    if (currentCategory) {
      const categoryIdStr = String(currentCategory.id);
      
      // Check if we have stored state for this category
      if (storedCategoryId === categoryIdStr && storedProducts.length > 0) {
         console.log('♻️ Restoring category state for:', categoryIdStr);
         setDisplayProducts(storedProducts);
         setPage(storedPage);
         setHasMore(storedHasMore);
         isRestoredRef.current = true;
      } else {
         console.log('🆕 New category or no state, fetching:', categoryIdStr);
         setPage(1);
         setDisplayProducts([]);
         setHasMore(true);
         isRestoredRef.current = false;
         
         fetchProducts({
           category_id: categoryIdStr,
           page: 1
         });
      }
    }
  }, [currentCategory]); // Intentionally exclude stored* deps to prevent loops

  // 4. Accumulate Products (Only if not just restored, or if new data came in)
  useEffect(() => {
    // If we are in "restored" mode, we strictly ignore updates from the global store
    // unless we are explicitly loading more data. This prevents stale data from 
    // overwriting our restored state during the initial render.
    if (isRestoredRef.current && !isLoadingMore) {
        return; 
    }

    if (products.length > 0 && currentCategory) {
      const mappedProducts = products.map(mapVariantToProduct);
      
      setDisplayProducts(prev => {
        if (page === 1) return mappedProducts;
        
        // Dedup logic
        const existingIds = new Set(prev.map(p => p.id));
        const uniqueNew = mappedProducts.filter(p => !existingIds.has(p.id));
        return [...prev, ...uniqueNew];
      });
      
      // Update hasMore based on whether we received a nextPage url from API
      setHasMore(!!nextPage);
      
      setIsLoadingMore(false);
      // Reset restored flag once we process new data
      if (isLoadingMore) isRestoredRef.current = false;
    } else if (products.length === 0 && page === 1 && !isLoading && !isRestoredRef.current) {
       setDisplayProducts([]);
       setHasMore(false);
    }
  }, [products, page, currentCategory, isLoading, isLoadingMore, storedPage, nextPage]);

  // 5. Sync State to Store
  useEffect(() => {
    if (currentCategory && displayProducts.length > 0) {
       setCategoryState(String(currentCategory.id), displayProducts, page, hasMore);
    }
  }, [displayProducts, page, currentCategory, hasMore, setCategoryState]);

  // 6. Save Scroll Position on Unmount
  useEffect(() => {
    return () => {
       const pos = window.scrollY;
       console.log('💾 Saving scroll position:', pos);
       setScrollPosition(pos);
    };
  }, [setScrollPosition]);

  // 7. Restore Scroll Position
  useLayoutEffect(() => {
     // Disable browser's native scroll restoration to prevent fighting
     if ('scrollRestoration' in window.history) {
       window.history.scrollRestoration = 'manual';
     }

     if (isRestoredRef.current && storedScrollPosition > 0 && displayProducts.length > 0) {
        const restore = () => {
           console.log('📍 Attempting scroll restore to:', storedScrollPosition);
           window.scrollTo({ top: storedScrollPosition, behavior: 'instant' });
        };

        // Attempt 1: Immediate
        restore();
        
        // Attempt 2: Next Frame (after paint)
        requestAnimationFrame(() => {
           restore();
           // Attempt 3: Small delay (for images/layout shifts)
           setTimeout(restore, 50);
           
           // Final attempt & Cleanup min-height hack
           setTimeout(() => {
             restore();
             // We don't need to explicitly reset the style here because the component will re-render 
             // eventually, but to be safe we could force a re-render or just rely on the fact 
             // that once user interacts, it doesn't matter. 
             // Actually, let's keep the min-height until the user navigates away or refreshes.
             // It prevents scroll jumping if images load late.
           }, 150);
        });
     }
     
     return () => {
        // Re-enable auto restoration when leaving (optional, but good citizenship)
        if ('scrollRestoration' in window.history) {
          window.history.scrollRestoration = 'auto';
        }
     };
  }, [displayProducts.length, storedScrollPosition]);

  // 8. Load More Logic
  const loadMore = useCallback(() => {
    if (hasMore && !isLoading && !isLoadingMore && currentCategory) {
      setIsLoadingMore(true);
      isRestoredRef.current = false; // We are fetching new data
      const nextPageNum = page + 1;
      setPage(nextPageNum);
      
      fetchProducts({
        category_id: String(currentCategory.id),
        page: nextPageNum
      });
    }
  }, [hasMore, isLoading, isLoadingMore, page, currentCategory, fetchProducts]);

  // Intersection Observer for Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMore]);

  if (!currentCategory && categories.length > 0 && slug) {
     // Category not found state
     return (
        <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
           <h2 className="text-2xl font-bold text-gray-900 mb-2">Category Not Found</h2>
           <p className="text-gray-500 mb-6">We couldn't find the category you're looking for.</p>
           <Link to="/" className="px-6 py-3 bg-[#2d5016] text-white rounded-full font-bold">
              Back to Home
           </Link>
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-20 md:pb-0">
      {/* Mobile Header (Sticky) */}
      <div className="md:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 safe-area-top">
        <div className="flex items-center justify-between px-4 h-14">
          <Link to="/" className="p-2 -ml-2 text-gray-800 active:scale-95 transition-transform">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-lg font-bold text-gray-900 truncate max-w-[200px]">
            {currentCategory?.category_name || 'Loading...'}
          </h1>
          <button className="p-2 -mr-2 text-gray-800">
             <Filter size={20} />
          </button>
        </div>
        {/* Mobile Filter Tabs (Horizontal Scroll) */}
        <div className="flex items-center gap-2 px-4 pb-3 overflow-x-auto no-scrollbar">
           <button className="flex-shrink-0 px-4 py-1.5 bg-[#2d5016] text-white text-xs font-bold rounded-full shadow-sm">
             All
           </button>
           <button className="flex-shrink-0 px-4 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-medium rounded-full">
             Popular
           </button>
           <button className="flex-shrink-0 px-4 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-medium rounded-full">
             Newest
           </button>
           <button className="flex-shrink-0 px-4 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-medium rounded-full">
             Price
           </button>
        </div>
      </div>

      {/* Desktop Hero Header (Hidden on Mobile) */}
      <div className="hidden md:block relative bg-[#2d5016] text-white overflow-hidden">
        {/* Background Pattern/Image */}
        <div className="absolute inset-0 opacity-20">
            {currentCategory?.icon ? (
                <img 
                  src={getImageUrl(currentCategory.icon)} 
                  alt="" 
                  className="w-full h-full object-cover blur-sm scale-110"
                />
            ) : (
                <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            )}
            <div className="absolute inset-0 bg-[#2d5016]/80 mix-blend-multiply"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Home</span>
          </Link>
          
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold tracking-widest uppercase mb-4 border border-white/10">
              Collection
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-['Playfair_Display'] mb-4 leading-tight">
              {currentCategory?.category_name || 'Loading...'}
            </h1>
            <p className="text-lg text-white/80 font-light leading-relaxed max-w-2xl">
              {currentCategory?.description || `Explore our premium selection of ${currentCategory?.category_name || 'products'}.`}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div 
        className="max-w-7xl mx-auto px-3 md:px-6 py-4 md:py-8 md:-mt-8 relative z-10"
        style={{ minHeight: isRestoredRef.current ? storedScrollPosition + 800 : 'auto' }}
      >
        {/* Desktop Stats / Filter Bar */}
        <div className="hidden md:flex bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-8 flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-gray-500 text-sm">
              Showing <span className="font-bold text-[#2d5016]">{totalCount}</span> products
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
             <Filter size={16} />
             <span>Default Sorting</span>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading && page === 1 ? (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2d5016]"></div>
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
             <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🍃</span>
             </div>
             <h3 className="text-xl font-bold text-gray-900 mb-2">No Products Found</h3>
             <p className="text-gray-500">We couldn't find any products in this category yet.</p>
          </div>
        ) : (
          <>
            {/* Mobile Grid: 2 columns, tighter gap */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-x-6 md:gap-y-10">
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Infinite Scroll Loader */}
            {(isLoadingMore || isLoading) && (
              <div ref={observerTarget} className="mt-8 md:mt-12 flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 md:h-10 md:w-10 border-b-2 border-[#2d5016]"></div>
              </div>
            )}
            
            {/* Observer Target */}
            {!isLoading && !isLoadingMore && hasMore && <div ref={observerTarget} className="h-10" />}

            {/* End of Results */}
            {!hasMore && displayProducts.length > 0 && (
              <div className="mt-8 md:mt-12 text-center py-8 border-t border-gray-100">
                <p className="text-gray-400 text-xs md:text-sm font-medium uppercase tracking-widest">End of Collection</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
