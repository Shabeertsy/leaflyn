import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone, ArrowRight, CheckCircle, Package, Clock, Heart, Linkedin } from 'lucide-react';
import { useCompanyStore } from '../../store/useCompanyStore';

const Footer: React.FC = () => {
  const { companyContact, fetchCompanyContact } = useCompanyStore();

  useEffect(() => {
    fetchCompanyContact();
  }, [fetchCompanyContact]);

  const socialLinks = [
    { icon: Facebook, url: companyContact?.facebook, show: !!companyContact?.facebook },
    { icon: Instagram, url: companyContact?.instagram, show: !!companyContact?.instagram },
    { icon: Twitter, url: companyContact?.twitter, show: !!companyContact?.twitter },
    { icon: Youtube, url: companyContact?.youtube, show: !!companyContact?.youtube },
    { icon: Linkedin, url: companyContact?.linkedin, show: !!companyContact?.linkedin },
  ].filter(link => link.show);

  return (
    <footer className="bg-[#1a3a0f] text-white">
      {/* Features Strip */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: CheckCircle, title: 'Premium Quality', desc: 'Hand-selected for optimal health' },
              { icon: Package, title: 'Secure Packaging', desc: 'Safe arrival guaranteed' },
              { icon: Clock, title: 'Lifetime Support', desc: 'Expert care advice always available' },
              { icon: Heart, title: '7-Day Guarantee', desc: 'Hassle-free replacements' },
            ].map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <feature.icon size={18} className="text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white mb-0.5">{feature.title}</h4>
                  <p className="text-xs text-white/50">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-24 lg:pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-[#1a3a0f] text-xl font-bold">L</span>
              </div>
              <span className="text-2xl font-bold font-['Playfair_Display']">{companyContact?.company_name || 'Leaflyn'}</span>
            </Link>
            <p className="text-white/60 leading-relaxed text-sm max-w-xs">
              Bringing nature closer to you with our premium collection of plants, aquatics, and accessories.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#d4af37] hover:text-[#1a3a0f] transition-all duration-300"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold font-['Playfair_Display'] mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/search" className="text-white/60 hover:text-[#d4af37] transition-colors text-sm">
                  Shop Collection
                </Link>
              </li>
              <li>
                <Link to="/bestsellers" className="text-white/60 hover:text-[#d4af37] transition-colors text-sm">
                  Bestsellers
                </Link>
              </li>
              <li>
                <Link to="/care-guide" className="text-white/60 hover:text-[#d4af37] transition-colors text-sm">
                  Plant Care Guide
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="text-white/60 hover:text-[#d4af37] transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>


          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold font-['Playfair_Display'] mb-6">Get in Touch</h3>
            <ul className="space-y-4 mb-6">
              <li className="flex items-start gap-3 text-white/60 text-sm">
                <MapPin size={18} className="text-[#d4af37] shrink-0 mt-0.5" />
                <span>
                  {companyContact?.company_address || '123 Green Street, Eco Valley'}<br />
                  {companyContact?.company_city}, {companyContact?.company_state} {companyContact?.company_zip}
                </span>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <Phone size={18} className="text-[#d4af37] shrink-0" />
                <a href={`tel:${companyContact?.company_phone}`} className="hover:text-[#d4af37] transition-colors">
                  {companyContact?.company_phone || '+91 98765 43210'}
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <Mail size={18} className="text-[#d4af37] shrink-0" />
                <a href={`mailto:${companyContact?.company_email}`} className="hover:text-[#d4af37] transition-colors">
                  {companyContact?.company_email || 'hello@leaflyn.com'}
                </a>
              </li>
            </ul>
            <Link to="/contact-us" className="inline-flex items-center gap-2 bg-[#d4af37] text-[#1a3a0f] px-5 py-2.5 rounded-full text-sm font-bold hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl">
              <Mail size={16} />
              Contact Us
            </Link>
          </div>

          {/* Newsletter */}
          {/* <div>
            <h3 className="text-lg font-bold font-['Playfair_Display'] mb-6">Newsletter</h3>
            <p className="text-white/60 text-sm mb-4">
              Subscribe to get special offers and updates.
            </p>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all text-sm"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#d4af37] text-[#1a3a0f] rounded-md hover:bg-white transition-colors">
                <ArrowRight size={16} />
              </button>
            </div>
          </div> */}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} {companyContact?.company_name || 'Leaflyn'}. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-white/50">
            <Link to="/privacy" className="hover:text-[#d4af37] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#d4af37] transition-colors">Terms of Service</Link>
            <Link to="/shipping" className="hover:text-[#d4af37] transition-colors">Shipping Info</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
