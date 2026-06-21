import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Plus } from 'lucide-react';
import { useData } from '../../context/DataContext';

const AlamatPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, lahan } = useData();

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const lahanSaya = lahan.filter(l => l.petaniId === currentUser.id);

  // Format Alamat Rumah
  const alamatRumahArr = [
    currentUser.alamat,
    currentUser.kecamatan,
    currentUser.kabupaten,
    currentUser.provinsi
  ].filter(Boolean);
  
  const alamatRumahString = alamatRumahArr.length > 0 
    ? alamatRumahArr.join(', ') 
    : 'Alamat rumah belum diisi';

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-50 rounded-full transition-colors"
            >
              <ChevronLeft size={24} className="text-gray-700" />
            </button>
            <h1 className="font-display font-bold text-lg text-gray-900">Alamat</h1>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Rekomendasi Alamat Lahan */}
        {lahanSaya.length > 0 ? (
          lahanSaya.map((item, index) => (
            <div key={item.id} className="bg-white rounded-2xl p-5 shadow-sm border border-emerald-100 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                <MapPin size={20} className="text-emerald-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-bold text-gray-800 mb-1">
                  {item.namaLahan} {index === 0 && '(Utama)'}
                </h2>
                <p className="text-xs text-gray-500 mb-3">
                  {item.lokasi.alamat || `${item.kecamatan}, ${item.kabupaten}`}
                </p>
                <div className="flex gap-2">
                  {index === 0 && (
                    <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-1 rounded font-medium border border-emerald-100">Utama</span>
                  )}
                  <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded font-medium border border-gray-200 capitalize">Lahan ({item.jenisLahan})</span>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                  <button 
                    onClick={() => navigate('/petani/data-lahan')}
                    className="flex-1 bg-white border border-gray-200 text-gray-700 py-2 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Ubah Alamat Lahan
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-dashed border-gray-300 text-center">
            <MapPin size={32} className="text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-700">Belum Ada Lahan Terdaftar</p>
            <p className="text-xs text-gray-400 mt-1 mb-4">Daftarkan lahan Anda terlebih dahulu untuk memantau lokasinya.</p>
            <button 
              onClick={() => navigate('/petani/data-lahan')}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors"
            >
              Daftarkan Lahan
            </button>
          </div>
        )}

        {/* Alamat Pengiriman */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <MapPin size={20} className="text-blue-500" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-bold text-gray-800 mb-1">Alamat Rumah (Profil)</h2>
            <p className="text-xs text-gray-500 mb-3">
              {alamatRumahString}
            </p>
            <div className="flex gap-2">
              <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded font-medium border border-gray-200">Pengiriman</span>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
              <button 
                onClick={() => navigate('/petani/edit-profile')}
                className="flex-1 bg-white border border-gray-200 text-gray-700 py-2 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors"
              >
                Ubah Alamat Profil
              </button>
            </div>
          </div>
        </div>

        {/* Tambah Alamat */}
        <button 
          onClick={() => navigate('/petani/data-lahan/tambah-lahan')}
          className="w-full bg-white border border-dashed border-gray-300 hover:border-primary-500 hover:bg-primary-50 text-primary-600 py-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Daftarkan Lahan Baru
        </button>
      </div>
    </div>
  );
};

export default AlamatPage;

