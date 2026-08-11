import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import axios from '../lib/axios';
import type { ContactUs } from '../types';
import { useCompanyStore } from '../store/useCompanyStore';

const ContactUsPage: React.FC = () => {
  const { companyContact, fetchCompanyContact } = useCompanyStore();
  const [formData, setFormData] = useState<ContactUs>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    content: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchCompanyContact();
  }, [fetchCompanyContact]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      await axios.post('/contact-us/', formData);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        content: '',
      });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } catch (error: any) {
      setSubmitStatus('error');
      setErrorMessage(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white pb-20 lg:pb-8">
      {/* Hero Section */}
      <section className="bg-neutral-50 border-b border-gray-100">
        <div className="px-6 py-20 lg:py-24 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2.5 bg-[#059669]/10 px-5 py-2.5 rounded-full border border-[#059669]/20 mb-6">
            <div className="w-1.5 h-1.5 bg-[#059669] rounded-full" />
            <span className="text-[#059669] font-semibold tracking-widest uppercase text-xs">We're Here to Help</span>
          </div>

          <h1 className="text-4xl lg:text-6xl font-bold leading-tight font-['Poppins'] mb-6 text-gray-900">
            Get in <span className="text-[#059669]">Touch</span>
          </h1>

          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Have questions about our plants or services? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 font-['Poppins']">
                Contact Information
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Reach out to us through any of the following channels. Our team is available Monday through Saturday, 9 AM to 6 PM IST.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-4">
              <div className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#059669]/20 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#059669] rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Phone className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Phone</h3>
                    <p className="text-gray-600 text-sm mb-2">Mon-Sat from 9am to 6pm</p>
                    <a href={`tel:${companyContact?.company_phone}`} className="text-[#059669] font-semibold hover:text-[#059669] transition-colors">
                      {companyContact?.company_phone || '+91 98765 43210'}
                    </a>
                  </div>
                </div>
              </div>

              <div className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#059669]/20 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#059669] rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Mail className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600 text-sm mb-2">Our friendly team is here to help</p>
                    <a href={`mailto:${companyContact?.company_email}`} className="text-[#059669] font-semibold hover:text-[#059669] transition-colors">
                      {companyContact?.company_email || 'hello@catsclaw.com'}
                    </a>
                  </div>
                </div>
              </div>

              <div className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#059669]/20 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#059669] rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <MapPin className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Office</h3>
                    <p className="text-gray-600 text-sm mb-2">Come say hello at our office</p>
                    <p className="text-gray-700">
                      {companyContact?.company_address || '123 Green Street, Eco Valley'}<br />
                      {companyContact?.company_city}, {companyContact?.company_state} {companyContact?.company_zip}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-[#059669] rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-3 font-['Poppins']">Need Immediate Help?</h3>
              <p className="text-white/80 mb-4 leading-relaxed">
                For urgent plant care questions or order issues, our support team is ready to assist you immediately.
              </p>
              <a
                href={`tel:${companyContact?.company_phone}`}
                className="inline-flex items-center gap-2 bg-white text-[#059669] px-6 py-3 rounded-full font-bold hover:bg-[#059669] hover:text-white transition-all duration-300"
              >
                <Phone size={18} />
                Call Now
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-3xl p-8 lg:p-10 border border-gray-100 shadow-xl">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 font-['Poppins']">
              Send us a Message
            </h2>

            {submitStatus === 'success' && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                <CheckCircle className="text-green-600 shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="font-bold text-green-900 mb-1">Message Sent Successfully!</h4>
                  <p className="text-green-700 text-sm">We'll get back to you as soon as possible.</p>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-700 text-sm">{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-transparent transition-all"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-bold text-gray-700 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-transparent transition-all"
                  placeholder="Subject"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-transparent transition-all"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-transparent transition-all"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-bold text-gray-700 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-transparent transition-all resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#059669] text-white py-4 rounded-xl font-bold hover:bg-[#006638] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#059669]/20"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 bg-white rounded-3xl border border-gray-100">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 font-['Poppins']">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Quick answers to common questions. Can't find what you're looking for? Contact us directly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {[
            {
              question: 'What are your delivery times?',
              answer: 'We deliver nationwide within 3-7 business days. Express delivery is available in select cities.',
            },
            {
              question: 'Do you offer plant care support?',
              answer: 'Yes! We provide lifetime care support for all our plants. Reach out anytime for expert advice.',
            },
            {
              question: 'What is your return policy?',
              answer: 'We offer a 7-day guarantee on all plants. If you\'re not satisfied, we\'ll replace or refund your order.',
            },
            {
              question: 'Can I track my order?',
              answer: 'Absolutely! You\'ll receive tracking information via email and SMS once your order ships.',
            },
          ].map((faq, index) => (
            <div key={index} className="bg-neutral-50 rounded-xl p-6 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-gray-900 mb-2">{faq.question}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ContactUsPage;
