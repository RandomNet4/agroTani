// =====================================================
// PROFIL PETANI (HALAMAN MENU)
// =====================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, LogOut, Leaf, Settings, HelpCircle, Warehouse, MapPin, User, Map } from 'lucide-react';
import { useData } from '../../context/DataContext';
import StatusBadge from '../../components/StatusBadge';

const ProfilPage: React.FC = () => {
  const { currentUser, logoutPetani } = useData();
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const petani = currentUser;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-700 to-primary-800 text-white px-4 py-8 rounded-b-3xl">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-4xl overflow-hidden">
            {petani.fotoProfil && (petani.fotoProfil.startsWith('data:image/') || petani.fotoProfil.startsWith('http') || petani.fotoProfil.includes('.')) ? (
              <img src={petani.fotoProfil} alt="Foto Profil" className="w-full h-full object-cover" />
            ) : (
              petani.fotoProfil || '👨‍🌾'
            )}
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl mb-1">{petani.nama}</h1>
            <p className="text-green-100 text-sm mb-2">{petani.kecamatan}, {petani.kabupaten}</p>
            <div className="flex flex-wrap items-center gap-1.5">
              <StatusBadge status={petani.statusVerifikasi} size="sm" />
              {petani.role === 'kepala_petani' && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-sm">
                  Koordinator Lapangan
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pt-6 pb-6 space-y-4 -mt-2">
        {/* Menu Koordinator */}
        {petani.role === 'kepala_petani' && (
          <div>
            <p className="text-xs font-semibold text-primary-600 uppercase tracking-wider px-1 mb-2">Fungsi Koordinator</p>
            <div className="space-y-2">
              <button 
                onClick={() => navigate('/petani/kelompok')}
                className="w-full flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all text-left"
              >
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <User size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm font-semibold">Kelompok Tani Saya</p>
                  <p className="text-xs text-gray-400">Pantau data lahan & tanaman anggota</p>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
              </button>

              <button 
                onClick={() => navigate('/petani/inspeksi')}
                className="w-full flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all text-left"
              >
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <MapPin size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm font-semibold">Inspeksi Lapangan</p>
                  <p className="text-xs text-gray-400">Verifikasi GPS & foto tanaman anggota</p>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
              </button>
            </div>
          </div>
        )}

        {/* Info Gudang Card Separated */}
        {petani.gudangTujuanNama && (
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                <Warehouse size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <p className="text-[11px] font-medium text-emerald-600 uppercase tracking-wide">Terkoneksi logistik</p>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm truncate">{petani.gudangTujuanNama}</h3>
              </div>
            </div>
            
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              Hasil panen Anda akan otomatis terhubung ke cabang ini.
            </p>
            
            <button
              onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(petani.gudangTujuanNama ?? '')}`, '_blank')}
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              <Map size={16} className="text-gray-400" />
              Buka di Maps
            </button>
          </div>
        )}

        {/* Pengaturan Akun */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1 mb-2">Akun Saya</p>
          <div className="space-y-2">
            <button 
              onClick={() => navigate('/petani/edit-profile')}
              className="w-full flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all text-left"
            >
              <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                <User size={20} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Edit Profile</p>
                <p className="text-xs text-gray-400">Ubah informasi pribadi Anda</p>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </button>

            <button 
              onClick={() => navigate('/petani/alamat')}
              className="w-full flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all text-left"
            >
              <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                <MapPin size={20} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Alamat</p>
                <p className="text-xs text-gray-400">Atur alamat pengiriman & lokasi lahan</p>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </button>

            <button 
              onClick={() => navigate('/petani/mengenai')}
              className="w-full flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all text-left"
            >
              <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                <Settings size={20} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Mengenai Profile</p>
                <p className="text-xs text-gray-400">Informasi tambahan dan preferensi</p>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </button>
          </div>
        </div>

        {/* Lainnya */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1 mb-2 mt-2">Lainnya</p>
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all text-left">
              <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                <HelpCircle size={20} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Bantuan</p>
                <p className="text-xs text-gray-400">FAQ & hubungi kami</p>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </button>
            <button
              onClick={() => {
                logoutPetani();
                navigate('/');
              }}
              className="w-full flex items-center gap-3 p-3 bg-red-50 rounded-xl border border-red-100 hover:shadow-md transition-all text-left"
            >
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-500">
                <LogOut size={20} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm text-red-600">Keluar</p>
                <p className="text-xs text-red-400">Logout dari akun</p>
              </div>
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className="text-center pt-6">
          <div className="flex items-center justify-center gap-2 text-gray-400 mb-1">
            <Leaf size={16} />
            <span className="font-display font-semibold text-sm">Agro Jabar</span>
          </div>
          <p className="text-[10px] text-gray-400">v1.0.0 • Pemberdayaan Petani Jawa Barat</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilPage;
