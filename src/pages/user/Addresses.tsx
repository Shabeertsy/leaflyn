import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, MapPin, Trash2, Edit2, Loader } from 'lucide-react';
import { useAddressStore } from '../../store/useAddressStore';
import Toast from '../../components/ui/Toast';

const Addresses: React.FC = () => {
  const navigate = useNavigate();
  const { addresses, fetchAddresses, isLoading, deleteAddress, setDefaultAddress } = useAddressStore();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleDelete = async (uuid: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        setDeletingId(uuid);
        await deleteAddress(uuid);
        setToast({ message: 'Address deleted successfully', type: 'success' });
      } catch (error) {
        setToast({ message: 'Failed to delete address', type: 'error' });
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleSetDefault = async (uuid: string) => {
    try {
      await setDefaultAddress(uuid);
      setToast({ message: 'Default address updated', type: 'success' });
    } catch (error) {
      setToast({ message: 'Failed to update default address', type: 'error' });
    }
  };

  if (isLoading && addresses.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-neutral-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2d5016]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex items-center gap-4 border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-[#2d5016] font-['Playfair_Display']">Saved Addresses</h1>
        <button 
          onClick={() => navigate('/addresses/add')} // We might need to create this route/page too, or use a modal
          className="ml-auto p-2 bg-[#2d5016]/10 text-[#2d5016] rounded-full hover:bg-[#2d5016]/20 transition-colors"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {addresses.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No addresses found</h3>
            <p className="text-gray-500 mb-6">Add a new address to speed up checkout</p>
            <button
              onClick={() => navigate('/addresses/add')}
              className="px-6 py-3 bg-[#2d5016] text-white rounded-xl font-bold hover:bg-[#3d6622] transition-colors shadow-lg"
            >
              Add New Address
            </button>
          </div>
        ) : (
          addresses.map((address) => (
            <div 
              key={address.uuid}
              className={`bg-white rounded-2xl p-6 shadow-sm border transition-all ${
                address.isDefault ? 'border-[#2d5016] ring-1 ring-[#2d5016]' : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    address.isDefault ? 'bg-[#2d5016] text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{address.name}</h3>
                    <p className="text-sm text-gray-500">{address.phone}</p>
                  </div>
                </div>
                {address.isDefault && (
                  <span className="bg-[#2d5016]/10 text-[#2d5016] text-xs font-bold px-3 py-1 rounded-full">
                    Default
                  </span>
                )}
              </div>

              <div className="pl-[52px] space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  {address.addressLine1}
                  {address.addressLine2 && <>, {address.addressLine2}</>}
                  <br />
                  {address.city}, {address.state} - {address.pincode}
                </p>

                <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
                  <button 
                    onClick={() => navigate(`/addresses/edit/${address.uuid}`)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(address.uuid)}
                    disabled={deletingId === address.uuid}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {deletingId === address.uuid ? (
                      <Loader size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                    Delete
                  </button>
                  {!address.isDefault && (
                    <button 
                      onClick={() => handleSetDefault(address.uuid)}
                      className="ml-auto text-sm font-medium text-[#2d5016] hover:underline"
                    >
                      Set as Default
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
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

export default Addresses;
