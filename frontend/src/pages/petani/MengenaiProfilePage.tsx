import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Info, FileText, Shield, Bell } from 'lucide-react';

const MengenaiProfilePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center p-4 gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-50 rounded-full transition-colors"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="font-display font-bold text-lg text-gray-900">Mengenai Profile</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Info Tambahan */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold text-gray-800 mb-4">Informasi Akun</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-50 pb-3">
              <span className="text-xs text-gray-500">Tanggal Bergabung</span>
              <span className="text-sm font-medium text-gray-800">12 Agustus 2024</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-50 pb-3">
              <span className="text-xs text-gray-500">Status Verifikasi</span>
              <span className="text-xs font-semibold px-2.5 py-1 bg-green-50 text-green-600 rounded-lg">Verified</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Role Pengguna</span>
              <span className="text-sm font-medium text-gray-800">Petani Binaan</span>
            </div>
          </div>
        </div>

        {/* Preferensi */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-2">
          <h2 className="text-sm font-bold text-gray-800 mb-3">Preferensi & Notifikasi</h2>
          
          <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-500 flex items-center justify-center">
                <Bell size={16} />
              </div>
              <span className="text-sm font-medium text-gray-700">Notifikasi Push</span>
            </div>
            <div className="w-10 h-6 bg-primary-500 rounded-full relative">
              <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
            </div>
          </button>

          <button className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-500 flex items-center justify-center">
              <Info size={16} />
            </div>
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-700">Pusat Bantuan</span>
            </div>
          </button>
        </div>

        {/* Legal */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-2">
          <h2 className="text-sm font-bold text-gray-800 mb-3">Legal & Kebijakan</h2>
          
          <button className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-500 flex items-center justify-center">
              <FileText size={16} />
            </div>
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-700">Syarat dan Ketentuan</span>
            </div>
          </button>
          
          <button className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-500 flex items-center justify-center">
              <Shield size={16} />
            </div>
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-700">Kebijakan Privasi</span>
            </div>
          </button>
        </div>

        <div className="text-center pt-4 pb-2">
          <p className="text-xs text-gray-400">Aplikasi Agro Tani v1.2.0</p>
          <p className="text-[10px] text-gray-400 mt-1">© 2026 Agro Jabar. Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </div>
  );
};

export default MengenaiProfilePage;
