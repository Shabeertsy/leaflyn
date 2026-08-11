import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Leaf, Sprout, Flower2, Droplets, ArrowRight } from 'lucide-react';
import { useCategoriesStore } from '../store/useCategoriesStore';
import { useProductCollectionStore } from '../store/useProductCollectionStore';
import { mapVariantToProduct } from '../lib/mappers';
import { useCartStore } from '../store/useCartStore';
import { useUIStore } from '../store/useUIStore';
import { useAuthStore } from '../store/useAuthStore';
import type { Product } from '../types';

const FeaturedPlantCard = ({ p, index, heroImages }: { p: Product, index: number, heroImages: string[] }) => {
  const { addToCart, isLoading: cartLoading } = useCartStore();
  const { setShowLoginPrompt, setPendingAction } = useUIStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  const [addedToCart, setAddedToCart] = React.useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (cartLoading) return;

    const addToCartAction = async () => {
      try {
        await addToCart(p, 1);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
      } catch (error) {
        console.error('Failed to add to cart:', error);
      }
    };

    if (!isAuthenticated) {
      setPendingAction(addToCartAction);
      setShowLoginPrompt(true);
    } else {
      await addToCartAction();
    }
  };

  return (
    <Link to={`/product/${p.id}`} className="group cursor-pointer flex flex-col h-full">
      <div className="bg-[#f3f4f6] aspect-[4/5] mb-4 overflow-hidden relative">
        <img src={p.image || heroImages[index]} alt={p.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700" />
        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <div className="flex justify-between items-start mb-4 px-1 gap-2">
        <h3 className="text-sm text-[#059669] font-semibold flex-1 min-w-0 truncate">{p.name}</h3>
        <span className="text-sm font-bold text-gray-900 shrink-0">₹{p.price}</span>
      </div>
      <div className="mt-auto px-1">
        <button 
          onClick={handleAddToCart}
          disabled={cartLoading}
          className={`w-full py-2.5 text-xs font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
            addedToCart 
              ? 'bg-[#059669] text-white' 
              : 'bg-gray-100 text-gray-900 hover:bg-[#059669] hover:text-white'
          }`}
        >
          {cartLoading ? 'Adding...' : addedToCart ? 'Added!' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  );
};

const Home: React.FC = () => {
  const { fetchCategories } = useCategoriesStore();
  const { featuredProducts, fetchProductCollections } = useProductCollectionStore();

  useEffect(() => {
    fetchCategories();
    fetchProductCollections();
  }, [fetchCategories, fetchProductCollections]);

  // Use the first 4 images from Unsplash for the hero
  const heroImages = [
    'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1497215848523-286a117b9662?auto=format&fit=crop&q=80&w=800'
  ];

  return (
    <div className="bg-white min-h-screen text-gray-900 pb-20 font-sans">
      
      {/* 1. Hero Section */}
      <section className="max-w-[1200px] mx-auto px-6 pt-12 pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="max-w-xl pr-8">
            <h1 className="text-5xl lg:text-[4rem] font-bold text-gray-900 leading-[1.15] mb-6 font-['Poppins']">
              Customize your place with the <span className="text-[#059669]">best</span> possible plant solutions!
            </h1>
            <p className="text-gray-500 mb-8 leading-relaxed text-[13px] lg:text-[14px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <div className="flex items-center gap-6">
              <Link 
                to="/search" 
                className="px-8 py-3 bg-[#059669] text-white rounded font-medium text-sm hover:bg-[#006638] transition-colors shadow-lg shadow-[#059669]/20"
              >
                Let's Shop Now
              </Link>
              <button className="flex items-center gap-3 text-gray-900 font-medium text-sm hover:text-[#059669] transition-colors group">
                <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-[#059669] transition-colors">
                  <Play size={16} className="text-gray-900 group-hover:text-[#059669] ml-1 fill-current" />
                </div>
                Know More About Us
              </button>
            </div>
          </div>

          {/* Right Images Grid */}
          <div className="grid grid-cols-2 gap-4 h-[400px] md:h-[500px]">
            <div className="grid grid-rows-2 gap-4 h-full">
              <div className="h-full w-full overflow-hidden relative">
                <img src={heroImages[0]} alt="Plant 1" className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div className="h-full w-full overflow-hidden relative">
                <img src={heroImages[1]} alt="Plant 2" className="absolute inset-0 w-full h-full object-cover" />
              </div>
            </div>
            <div className="grid grid-rows-2 gap-4 h-full">
              <div className="h-full w-full overflow-hidden relative">
                <img src={heroImages[2]} alt="Plant 3" className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div className="h-full w-full overflow-hidden relative bg-gray-100">
                <img src={heroImages[3]} alt="Plant 4" className="absolute inset-0 w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Plant */}
      <section className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-semibold text-[#059669] font-['Poppins']">Featured Plant</h2>
          <Link to="/search" className="text-gray-500 font-medium text-xs flex items-center gap-2 hover:text-[#059669] transition-colors group">
            view all <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
          {featuredProducts.slice(0, 4).map((variant, index) => {
            const p = mapVariantToProduct(variant);
            return <FeaturedPlantCard key={p.id} p={p} index={index} heroImages={heroImages} />;
          })}
        </div>
      </section>

      {/* 3. Features Section */}
      <section className="max-w-[1200px] mx-auto px-6 py-20 mt-12 border-y border-gray-100">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {[
            { icon: <Leaf size={32} strokeWidth={1.5} />, title: "Smart Plant & Tree Care", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut" },
            { icon: <Sprout size={32} strokeWidth={1.5} />, title: "Nursery Direct", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut" },
            { icon: <Flower2 size={32} strokeWidth={1.5} />, title: "Plant Sanny", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut" },
            { icon: <Droplets size={32} strokeWidth={1.5} />, title: "Plant Renovation", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut" }
          ].map((f, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-[#f0fdf4] flex items-center justify-center text-[#059669] mb-5">
                {f.icon}
              </div>
              <h4 className="text-[14px] font-semibold text-gray-900 mb-2.5 font-['Poppins']">{f.title}</h4>
              <p className="text-[11px] text-gray-400 max-w-[200px] leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Creating a Beautiful Balcony Garden */}
      <section className="max-w-[1200px] mx-auto px-6 py-24">
        <h2 className="text-2xl lg:text-[26px] font-semibold text-[#059669] text-center mb-16">Creating a Beautiful Balcony Garden</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column - Two Images */}
          <div className="flex flex-col gap-6">
            <div className="relative group overflow-hidden bg-gray-100 aspect-video md:aspect-[4/3] rounded-2xl">
              <img src="https://images.unsplash.com/photo-1416879598553-300fb2559a4b?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Indoor House Plants" />
              <div className="absolute inset-0 p-6 flex items-end">
                 <div className="bg-white px-6 py-4 w-[65%] rounded shadow-lg">
                    <h3 className="font-semibold text-gray-900 text-sm">Indoor<br/>House Plants</h3>
                 </div>
              </div>
            </div>
            <div className="relative group overflow-hidden bg-gray-100 aspect-video md:aspect-[4/3] rounded-2xl">
              <img src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Low Maintenance Gardening" />
              <div className="absolute inset-0 p-6 flex items-end">
                 <div className="bg-white px-6 py-4 w-[65%] rounded shadow-lg">
                    <h3 className="font-semibold text-gray-900 text-sm">Low Maintenance<br/>Gardening</h3>
                 </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - One Tall Image */}
          <div className="relative group overflow-hidden bg-gray-100 aspect-square md:aspect-auto md:h-full rounded-2xl">
            <img src="https://images.unsplash.com/photo-1497215848523-286a117b9662?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Air Purifying House Plants" />
            <div className="absolute inset-0 p-8 flex items-end justify-center">
               <div className="bg-white px-8 py-5 w-[80%] text-center rounded shadow-lg">
                  <h3 className="font-semibold text-gray-900 text-sm">Air Purifying House<br/>Plants</h3>
               </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
