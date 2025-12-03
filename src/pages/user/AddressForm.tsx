import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader } from 'lucide-react';
import { useAddressStore } from '../../store/useAddressStore';
import Toast from '../../components/ui/Toast';

const AddressForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { addAddress, updateAddress, addresses, fetchAddresses } = useAddressStore();
  
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    country: 'India', // Default to India
    pin_code: '',
    is_default: false
  });

  useEffect(() => {
    if (id) {
      // If editing, populate form with existing address
      const address = addresses.find(a => a.uuid === id);
      if (address) {
        setFormData({
          name: address.name,
          phone: address.phone,
          address_line_1: address.addressLine1,
          address_line_2: address.addressLine2 || '',
          city: address.city,
          state: address.state,
          country: address.country || 'India',
          pin_code: address.pincode,
          is_default: address.isDefault
        });
      } else {
        // If address not found in store (e.g. direct link), fetch them
        fetchAddresses();
      }
    }
  }, [id, addresses, fetchAddresses]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        await updateAddress(id, formData);
        setToast({ message: 'Address updated successfully', type: 'success' });
      } else {
        await addAddress(formData);
        setToast({ message: 'Address added successfully', type: 'success' });
      }
      
      // Navigate back after short delay
      setTimeout(() => {
        navigate('/addresses');
      }, 1000);
    } catch (error) {
      setToast({ message: id ? 'Failed to update address' : 'Failed to add address', type: 'error' });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex items-center gap-4 border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-[#2d5016] font-['Playfair_Display']">
          {id ? 'Edit Address' : 'Add New Address'}
        </h1>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#2d5016] focus:ring-0 transition-colors outline-none font-medium"
                placeholder="John Doe"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#2d5016] focus:ring-0 transition-colors outline-none font-medium"
                placeholder="+91 98765 43210"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Address Line 1</label>
              <input
                type="text"
                value={formData.address_line_1}
                onChange={(e) => setFormData({ ...formData, address_line_1: e.target.value })}
                className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#2d5016] focus:ring-0 transition-colors outline-none font-medium"
                placeholder="House No, Building Name"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Address Line 2 (Optional)</label>
              <input
                type="text"
                value={formData.address_line_2}
                onChange={(e) => setFormData({ ...formData, address_line_2: e.target.value })}
                className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#2d5016] focus:ring-0 transition-colors outline-none font-medium"
                placeholder="Street, Area"
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#2d5016] focus:ring-0 transition-colors outline-none font-medium"
                  placeholder="City"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#2d5016] focus:ring-0 transition-colors outline-none font-medium"
                  placeholder="State"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#2d5016] focus:ring-0 transition-colors outline-none font-medium"
                  placeholder="Country"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Pincode</label>
                <input
                  type="text"
                  value={formData.pin_code}
                  onChange={(e) => setFormData({ ...formData, pin_code: e.target.value })}
                  className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#2d5016] focus:ring-0 transition-colors outline-none font-medium"
                  placeholder="Pincode"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="is_default"
                checked={formData.is_default}
                onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                className="w-5 h-5 text-[#2d5016] border-gray-300 rounded focus:ring-[#2d5016]"
              />
              <label htmlFor="is_default" className="text-sm font-medium text-gray-700">
                Set as default address
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#2d5016] text-white rounded-xl font-bold text-lg hover:bg-[#3d6622] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader size={20} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Address
              </>
            )}
          </button>
        </form>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default AddressForm;
