import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ClipboardCheck, User, Calendar, MapPin, ChevronRight, CheckCircle2, AlertTriangle, History } from 'lucide-react';
import { useData } from '../../context/DataContext';
import StatusBadge from '../../components/StatusBadge';

const InspeksiPage: React.FC = () => {
  const navigate = useNavigate();
  const { petani: allPetani, lahan: allLahan, tanamanAktif: allTanaman, currentUser } = useData();

  const [activeTab, setActiveTab] = useState<'pending' | 'selesai'>('pending');

  // Anggota kelompok
  const anggotaList = allPetani.filter(p => p.kepalaPetaniId === currentUser?.id);
  const anggotaIds = anggotaList.map(a => a.id);

  // Tanaman milik anggota kelompok
  const tanamanKelompok = allTanaman.filter(t => anggotaIds.includes(t.petaniId));

  // Filter berdasarkan tab
  const listPending = tanamanKelompok.filter(
    t => t.statusVerifikasi === 'pending' || t.statusVerifikasi === 'survey'
  );
  
  const listSelesai = tanamanKelompok.filter(
    t => t.statusVerifikasi === 'approved' || t.statusVerifikasi === 'rejected'
  );

  const displayList = activeTab === 'pending' ? listPending : listSelesai;

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-gradient-to-b from-emerald-800 to-emerald-700 text-white px-4 pt-12 pb-6 rounded-b-3xl shadow-lg relative">
        <div className="flex items-center gap-3 mb-2">
          <button 
            onClick={() => navigate('/petani/dashboard')} 
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-display font-bold text-lg">Inspeksi Lahan & Tanaman</h1>
        </div>
        <p className="text-emerald-100 text-xs ml-11 flex items-center gap-1.5">
          <ClipboardCheck size={12} />
          Validasi fisik & koordinat GPS mitra tani
        </p>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-4">
        <div className="bg-white p-1 rounded-xl border border-gray-100 flex shadow-sm">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'pending'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <AlertTriangle size={14} />
            Perlu Inspeksi ({listPending.length})
          </button>
          <button
            onClick={() => setActiveTab('selesai')}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'selesai'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <History size={14} />
            Selesai ({listSelesai.length})
          </button>
        </div>
      </div>

      {/* List content */}
      <div className="px-4 mt-5 space-y-3">
        {displayList.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 border border-gray-200 text-center text-gray-400">
            <CheckCircle2 size={36} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm">Tidak ada tugas inspeksi dalam daftar ini.</p>
          </div>
        ) : (
          displayList.map((crop) => {
            const owner = anggotaList.find(a => a.id === crop.petaniId);
            const land = allLahan.find(l => l.id === crop.lahanId);
            
            return (
              <div
                key={crop.id}
                className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-4 hover:border-emerald-200 transition-colors relative"
              >
                {/* Header card */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl leading-none">{crop.fotoTanaman || '🥕'}</span>
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm">{crop.komoditasNama}</h3>
                      <p className="text-[10px] text-gray-400">ID Siklus: {crop.id}</p>
                    </div>
                  </div>
                  <StatusBadge status={crop.statusVerifikasi} size="sm" />
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs py-3 border-y border-gray-50">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <User size={13} className="text-gray-400 shrink-0" />
                    <span className="truncate">Petani: <b>{owner?.nama || 'N/A'}</b></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <MapPin size={13} className="text-gray-400 shrink-0" />
                    <span className="truncate">Lahan: <b>{land?.namaLahan || 'N/A'}</b></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500 col-span-2">
                    <Calendar size={13} className="text-gray-400 shrink-0" />
                    <span>Tgl Tanam: <b>{crop.tanggalTanam}</b> • Est. Panen: <b>{crop.estimasiPanen}</b></span>
                  </div>
                </div>

                {/* Area Details & Button */}
                <div className="flex items-center justify-between pt-1">
                  <div className="text-[10px] text-gray-400">
                    <span>Keb. Bibit: </span>
                    <span className="font-bold text-emerald-600 text-xs">
                      {crop.kebutuhanBibit ? `${crop.kebutuhanBibit.toLocaleString()} pcs` : '-'}
                    </span>
                  </div>
                  {activeTab === 'pending' ? (
                    <button
                      onClick={() => navigate(`/petani/inspeksi/${crop.id}`)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl active:scale-95 transition-all flex items-center gap-1"
                    >
                      Mulai Inspeksi <ChevronRight size={13} />
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate(`/petani/inspeksi/${crop.id}`)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs px-4 py-2 rounded-xl active:scale-95 transition-all flex items-center gap-1"
                    >
                      Lihat Hasil <ChevronRight size={13} />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default InspeksiPage;
