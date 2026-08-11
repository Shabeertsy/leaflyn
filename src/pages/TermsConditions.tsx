import React, { useEffect, useState } from 'react';
import { FileText, Clock, Shield } from 'lucide-react';
import axios from '../lib/axios';
import type { TermsCondition } from '../types';

const TermsConditionsPage: React.FC = () => {
  const [termsData, setTermsData] = useState<TermsCondition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/api/terms-condition/');
        setTermsData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load terms and conditions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTerms();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white pb-20 lg:pb-8">
      {/* Hero Section */}
      <section className="bg-neutral-50 border-b border-gray-100">
        <div className="px-6 py-20 lg:py-24 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2.5 bg-[#059669]/10 px-5 py-2.5 rounded-full border border-[#059669]/20 mb-6">
            <Shield className="w-4 h-4 text-[#059669]" />
            <span className="text-[#059669] font-semibold tracking-widest uppercase text-xs">Legal Information</span>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold leading-tight font-['Poppins'] mb-6 text-gray-900">
            Terms & <span className="text-[#059669]">Conditions</span>
          </h1>
          
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Please read these terms and conditions carefully before using our service.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-6 py-16 lg:py-20">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-[#059669]/20 border-t-[#059669] rounded-full animate-spin mb-4" />
            <p className="text-gray-600">Loading terms and conditions...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="text-red-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-red-900 mb-2">Unable to Load Terms</h3>
            <p className="text-red-700">{error}</p>
          </div>
        ) : termsData.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Terms Available</h3>
            <p className="text-gray-600">Terms and conditions will be available soon.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Info Banner */}
            <div className="bg-[#059669] rounded-2xl p-6 text-white">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                  <Clock className="text-[#059669]" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Last Updated</h3>
                  <p className="text-white/80">
                    {termsData.length > 0 && formatDate(termsData[0].updated_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Terms Content */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden">
              <div className="p-8 lg:p-12 space-y-10">
                {termsData.map((term, index) => (
                  <div key={term.uuid} className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-[#059669] rounded-xl flex items-center justify-center shrink-0 text-white font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 font-['Poppins']">
                          {term.title}
                        </h2>
                        <div 
                          className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: term.content.replace(/\n/g, '<br />') }}
                        />
                      </div>
                    </div>
                    
                    {index < termsData.length - 1 && (
                      <div className="border-t border-gray-100 mt-8" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                    <Shield className="text-white" size={20} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">Your Privacy Matters</h3>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  We are committed to protecting your personal information. Read our Privacy Policy to learn more.
                </p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center shrink-0">
                    <FileText className="text-white" size={20} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">Questions?</h3>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  If you have any questions about these terms, please don't hesitate to contact our support team.
                </p>
              </div>
            </div>

            {/* Contact CTA */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Need Clarification?</h3>
              <p className="text-gray-600 mb-6">
                Our team is here to help you understand our terms and answer any questions.
              </p>
              <a 
                href="/contact-us" 
                className="inline-flex items-center gap-2 bg-[#059669] text-white px-8 py-3 rounded-full font-bold hover:bg-[#006638] transition-all duration-300 shadow-lg shadow-[#059669]/20"
              >
                Contact Support
              </a>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default TermsConditionsPage;
