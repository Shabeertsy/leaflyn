import React, { useEffect, useState } from 'react';
import { X, FileText, Shield, Clock } from 'lucide-react';
import axios from '../../lib/axios';
import type { TermsCondition } from '../../types';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  const [termsData, setTermsData] = useState<TermsCondition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
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
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white rounded-t-2xl sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2d5016]/10 rounded-xl flex items-center justify-center">
              <Shield className="text-[#2d5016]" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 font-['Playfair_Display']">Terms & Conditions</h2>
              <p className="text-xs text-gray-500">Please read carefully before proceeding</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-[#2d5016]/20 border-t-[#2d5016] rounded-full animate-spin mb-4" />
              <p className="text-gray-500 text-sm">Loading terms...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center my-10">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="text-red-600" size={24} />
              </div>
              <h3 className="font-bold text-red-900 mb-1">Unable to Load Terms</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          ) : termsData.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500">No terms and conditions available.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Last Updated Badge */}
              <div className="inline-flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-100 text-sm text-gray-600">
                <Clock size={14} />
                <span>Last Updated: {formatDate(termsData[0].updated_at)}</span>
              </div>

              <div className="space-y-8">
                {termsData.map((term, index) => (
                  <div key={term.uuid} className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-[#2d5016] text-white rounded-full flex items-center justify-center text-xs font-bold mt-1">
                        {index + 1}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900">
                        {term.title}
                      </h3>
                    </div>
                    <div 
                      className="prose prose-sm max-w-none text-gray-600 leading-relaxed pl-9"
                      dangerouslySetInnerHTML={{ __html: term.content.replace(/\n/g, '<br />') }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#2d5016] text-white font-semibold rounded-xl hover:bg-[#3d6622] transition-colors shadow-lg shadow-[#2d5016]/20"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
