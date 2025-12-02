import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Phone, Mail, MessageCircle, ArrowRight, Loader2 } from 'lucide-react';
import { useServiceStore } from '../store';
import { useCompanyStore } from '../store/useCompanyStore';
import type { Service } from '../types';

const ServiceDetailAPI: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { services, isLoading, error, fetchServices } = useServiceStore();
  const { companyContact, fetchCompanyContact } = useCompanyStore();
  const [service, setService] = useState<Service | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (services.length === 0) {
      fetchServices();
    }
    fetchCompanyContact();
  }, []);

  useEffect(() => {
    if (id && services.length > 0) {
      const foundService = services.find(s => s.id === parseInt(id));
      setService(foundService || null);
    }
  }, [id, services]);

  // Get base URL for images
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    return `${baseURL}${imagePath}`;
  };

  // Helper to get category ID
  const getCategoryId = (category: any): number | null => {
    if (typeof category === 'number') return category;
    if (typeof category === 'object' && category?.id) return category.id;
    return null;
  };

  // Helper to get category name
  const getCategoryName = (category: any): string => {
    if (typeof category === 'object' && category?.name) return category.name;
    return 'Service';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Loader2 className="w-8 h-8 animate-spin text-[#2d5016]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 p-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Service</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => fetchServices()}
          className="px-6 py-2.5 bg-[#2d5016] text-white rounded-full font-semibold hover:bg-[#3d6622] transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

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
          <h1 className="text-lg font-bold text-gray-900 truncate">{service.name}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Header & Description */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full mb-3">
                <span className="text-xs font-semibold text-[#2d5016] uppercase tracking-wider">
                  {getCategoryName(service.category)}
                </span>
              </div>
              <h1 className="text-2xl md:text-4xl font-bold text-[#2d5016] font-['Playfair_Display'] mb-2">
                {service.name}
              </h1>
            </div>
            <div className="text-left md:text-right">
              <div className="text-sm text-gray-500 mb-1">Starting from</div>
              <div className="text-3xl md:text-4xl font-bold text-[#2d5016]">
                ₹{parseFloat(service.price).toFixed(2)}
              </div>
            </div>
          </div>
          {service.description && (
            <p className="text-gray-600 leading-relaxed max-w-3xl text-sm md:text-base">
              {service.description}
            </p>
          )}
        </div>

        {/* Main Image */}
        <div className="relative w-full h-48 md:h-80 rounded-2xl overflow-hidden mb-8 md:mb-12 shadow-lg">
          <img 
            src={getImageUrl(service.image)} 
            alt={service.name} 
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
            {service.features.length > 0 && (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="text-[#2d5016]" size={24} />
                  Service Features
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {service.features.map((feature) => (
                    <div key={feature.uuid} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-2 h-2 rounded-full bg-[#d4af37] mt-2 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">{feature.name}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Contact Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg h-fit sticky top-24">
            <h3 className="font-bold text-lg text-gray-900 mb-4">Interested in this service?</h3>
            <div className="space-y-3">
              {companyContact?.company_phone && (
                <a href={`tel:${companyContact.company_phone}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-[#2d5016]">
                    <Phone size={18} />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Call Us</div>
                    <div className="font-semibold text-gray-900">{companyContact.company_phone}</div>
                  </div>
                </a>
              )}
              {companyContact?.company_email && (
                <a href={`mailto:${companyContact.company_email}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-[#2d5016]">
                    <Mail size={18} />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Email Us</div>
                    <div className="font-semibold text-gray-900">{companyContact.company_email}</div>
                  </div>
                </a>
              )}
              {companyContact?.whatsapp && (
                <a href={`https://wa.me/${companyContact.whatsapp.replace(/[^0-9]/g, '')}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-[#2d5016]">
                    <MessageCircle size={18} />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">WhatsApp</div>
                    <div className="font-semibold text-gray-900">Chat Now</div>
                  </div>
                </a>
              )}
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
        {service.images.length > 0 && (
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 font-['Playfair_Display']">
              Project Gallery
            </h2>
            {/* Grid Layout similar to Search Page */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {service.images
                .sort((a, b) => a.order_by - b.order_by)
                .map((image) => (
                  <div 
                    key={image.uuid} 
                    className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-zoom-in"
                  >
                    <img
                      src={getImageUrl(image.image)}
                      alt={`${service.name} gallery`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Related Services */}
        {services.filter(s => getCategoryId(s.category) === getCategoryId(service.category) && s.id !== service.id).length > 0 && (
          <div className="mt-12 md:mt-16">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 font-['Playfair_Display']">
              Related Services
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {services
                .filter(s => getCategoryId(s.category) === getCategoryId(service.category) && s.id !== service.id)
                .slice(0, 3)
                .map((relatedService) => (
                  <Link
                    key={relatedService.uuid}
                    to={`/services/${relatedService.id}`}
                    className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-[#2d5016]/20 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={getImageUrl(relatedService.image)}
                        alt={relatedService.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-white font-bold text-lg mb-1">{relatedService.name}</h3>
                        <div className="text-white/90 text-sm font-semibold">
                          ₹{parseFloat(relatedService.price).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceDetailAPI;
