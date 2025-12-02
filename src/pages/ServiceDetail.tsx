import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Phone, Mail, MessageCircle, ArrowRight } from 'lucide-react';
import { serviceCategories } from '../data/services';

const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find the service across all categories
  const service = serviceCategories
    .flatMap(category => category.services)
    .find(s => s.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 p-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Not Found</h2>
        <p className="text-gray-600 mb-6">The service you are looking for does not exist.</p>
        <Link 
          to="/services" 
          className="px-6 py-2.5 bg-[#2d5016] text-white rounded-full font-semibold hover:bg-[#3d6622] transition-colors"
        >
          Back to Services
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Header / Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-900 truncate">{service.title}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Header & Description */}
        <div className="mb-6 md:mb-8 text-center md:text-left">
          <h1 className="text-2xl md:text-4xl font-bold text-[#2d5016] font-['Playfair_Display'] mb-3">
            {service.title}
          </h1>
          <p className="text-gray-600 leading-relaxed max-w-3xl text-sm md:text-base">
            {service.description}
          </p>
        </div>

        {/* Banner */}
        <div className="relative w-full h-48 md:h-80 rounded-2xl overflow-hidden mb-8 md:mb-12 shadow-lg">
          <img 
            src={service.banner} 
            alt={service.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 mb-2">
              <span className="text-xs font-semibold tracking-wider uppercase">Premium Service</span>
            </div>
          </div>
        </div>

        {/* Features & Details */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="text-[#2d5016]" size={24} />
              Service Features
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {service.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-2 h-2 rounded-full bg-[#d4af37] mt-2 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg h-fit sticky top-24">
            <h3 className="font-bold text-lg text-gray-900 mb-4">Interested in this service?</h3>
            <div className="space-y-3">
              <a href="tel:+1234567890" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-[#2d5016]">
                  <Phone size={18} />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Call Us</div>
                  <div className="font-semibold text-gray-900">+123 456 7890</div>
                </div>
              </a>
              <a href="mailto:info@leafin.com" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-[#2d5016]">
                  <Mail size={18} />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Email Us</div>
                  <div className="font-semibold text-gray-900">info@leafin.com</div>
                </div>
              </a>
              <a href="https://wa.me/1234567890" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-[#2d5016]">
                  <MessageCircle size={18} />
                </div>
                <div>
                  <div className="text-xs text-gray-500">WhatsApp</div>
                  <div className="font-semibold text-gray-900">Chat Now</div>
                </div>
              </a>
            </div>
            <Link 
              to="/contact-us"
              className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#2d5016] text-white rounded-xl font-bold hover:bg-[#3d6622] transition-colors"
            >
              <span>Get a Quote</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Gallery Grid */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 font-['Playfair_Display']">
            Project Gallery
          </h2>
          {/* Grid Layout similar to Search Page */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {service.gallery.map((image, idx) => (
              <div 
                key={idx} 
                className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-zoom-in"
              >
                <img
                  src={image}
                  alt={`${service.title} gallery ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
            ))}
            {/* Add some placeholder images if gallery is small to show grid effect better */}
            {service.gallery.length < 8 && Array.from({ length: 8 - service.gallery.length }).map((_, i) => (
               <div 
                key={`placeholder-${i}`} 
                className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100"
              >
                <img
                  src={`https://source.unsplash.com/random/800x800?plant,garden&sig=${i + service.id}`}
                  alt="Gallery placeholder"
                  className="w-full h-full object-cover opacity-80 grayscale hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
