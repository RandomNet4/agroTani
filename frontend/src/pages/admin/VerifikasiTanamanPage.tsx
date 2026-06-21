// =====================================================
// ADMIN: VERIFIKASI TANAMAN AKTIF
// =====================================================

import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Sprout, Check, X, Eye, Camera, User, MapPin, Calendar, Info, Scale} from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import { formatTanggal } from '../../data/adminDummy';

const VerifikasiTanamanPage: React.FC = () => {
  const { tanamanAktif: dummyTanamanAktif, petani: dummyPetani, lahan: dummyLahan, inspectTanaman } = useData();
  const [filterStatus, setFilterStatus] = useState('semua');
  const [selected, setSelected] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filtered = filterStatus === 'semua'
    ? dummyTanamanAktif
    : dummyTanamanAktif.filter(t => t.statusVerifikasi === filterStatus);

  const detail = dummyTanamanAktif.find(t => t.id === selected);

  const handleVerify = async (id: string, status: 'approved' | 'rejected', catatan?: string) => {
    setLoadingId(id);
    await inspectTanaman(id, { statusVerifikasi: status, catatanInspeksi: catatan || '' });
    setLoadingId(null);
    setSelected(null);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title flex items-center gap-2"><Sprout size={24} /> Verifikasi Tanaman</h1>
          <p className="text-sm text-gray-500 mt-1">Verifikasi data tanaman aktif petani</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-amber-50 rounded-xl px-3 py-2 text-center">
            <p className="text-xl font-bold text-amber-700">{dummyTanamanAktif.filter(t => t.statusVerifikasi === 'pending').length}</p>
            <p className="text-[10px] text-amber-600">Pending</p>
          </div>
          <div className="bg-emerald-50 rounded-xl px-3 py-2 text-center">
            <p className="text-xl font-bold text-emerald-700">{dummyTanamanAktif.filter(t => t.statusVerifikasi === 'approved').length}</p>
            <p className="text-[10px] text-emerald-600">Verified</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {['semua', 'pending', 'approved', 'rejected'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${filterStatus === s ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
            {s === 'semua' ? 'Semua' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Tanaman</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Petani</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Lahan</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Tgl Tanam</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Est. Panen</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Est. Hasil</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => {
                const petani = dummyPetani.find(p => p.id === t.petaniId);
                const lahan = dummyLahan.find(l => l.id === t.lahanId);
                const isLoading = loadingId === t.id;
                return (
                  <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{t.fotoTanaman}</span>
                        <span className="font-medium">{t.komoditasNama}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{petani?.nama || '-'}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{lahan?.namaLahan || '-'}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{formatTanggal(t.tanggalTanam)}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{formatTanggal(t.estimasiPanen)}</td>
                    <td className="px-4 py-3 font-semibold text-xs">{t.estimasiHasilKg.toLocaleString()} kg</td>
                    <td className="px-4 py-3"><StatusBadge status={t.statusVerifikasi} size="sm" /></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => setSelected(t.id)} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Eye size={16} /></button>
                        {t.statusVerifikasi === 'pending' && (
                          <>
                            <button
                              disabled={isLoading}
                              className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 disabled:opacity-50"
                              onClick={() => handleVerify(t.id, 'approved')}
                              title="Setujui"
                            ><Check size={16} /></button>
                            <button
                              disabled={isLoading}
                              className="p-1.5 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 disabled:opacity-50"
                              title="Detail & Inspeksi"
                              onClick={() => setSelected(t.id)}
                            ><Camera size={16} /></button>
                            <button
                              disabled={isLoading}
                              className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 disabled:opacity-50"
                              onClick={() => handleVerify(t.id, 'rejected')}
                              title="Tolak"
                            ><X size={16} /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl transition-all" onClick={e => e.stopPropagation()}>
            <div className="bg-emerald-600 p-6 text-white flex justify-between items-start">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl shadow-inner border border-white/10">
                  {detail.fotoTanaman}
                </div>
                <div>
                  <h2 className="font-display font-bold text-2xl">{detail.komoditasNama}</h2>
                  <p className="text-emerald-100 text-sm flex items-center gap-1 opacity-80 mt-1">
                    <Sprout size={14} /> ID: {detail.id}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-white/10 rounded-xl"><X size={24} /></button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <User size={14} className="text-emerald-500" /> Informasi Petani
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">
                        {dummyPetani.find(p => p.id === detail.petaniId)?.nama.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{dummyPetani.find(p => p.id === detail.petaniId)?.nama}</p>
                        <p className="text-xs text-gray-500">{dummyPetani.find(p => p.id === detail.petaniId)?.noHp}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <MapPin size={14} className="text-emerald-500" /> Lokasi Lahan
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <p className="font-bold text-gray-800 text-sm">{dummyLahan.find(l => l.id === detail.lahanId)?.namaLahan}</p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <MapPin size={10} /> {dummyLahan.find(l => l.id === detail.lahanId)?.kecamatan}, {dummyLahan.find(l => l.id === detail.lahanId)?.kabupaten}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Calendar size={14} className="text-emerald-500" /> Jadwal Penanaman
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Tgl Tanam</p>
                      <p className="font-bold text-gray-800 text-xs">{formatTanggal(detail.tanggalTanam)}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Est. Panen</p>
                      <p className="font-bold text-gray-800 text-xs">{formatTanggal(detail.estimasiPanen)}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Scale size={14} className="text-emerald-500" /> Estimasi Hasil
                  </h3>
                  <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 shadow-inner">
                    <p className="text-2xl font-display font-bold text-emerald-700">{detail.estimasiHasilKg.toLocaleString()} <span className="text-sm font-sans font-medium text-emerald-600 uppercase">Kg</span></p>
                    <p className="text-[10px] text-emerald-600 mt-1 flex items-center gap-1">
                      <Info size={10} /> Berdasarkan luas lahan {dummyLahan.find(l => l.id === detail.lahanId)?.luasHektar} Ha
                    </p>
                  </div>
                </div>

                {detail.luasLahanDigunakan !== undefined && detail.luasLahanDigunakan !== null && detail.luasLahanDigunakan > 0 && (
                  <div className="md:col-span-2">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                      Detail Kebutuhan Bibit
                    </h3>
                    <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 grid grid-cols-3 gap-2 text-center text-xs">
                      <div>
                        <p className="text-[9px] text-emerald-600 font-bold uppercase">Luas Terpakai</p>
                        <p className="font-bold text-emerald-800 mt-0.5">{detail.luasLahanDigunakan.toLocaleString()} m²</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-emerald-600 font-bold uppercase">Jarak Tanam</p>
                        <p className="font-bold text-emerald-800 mt-0.5">{detail.jarakTanam} cm</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-emerald-600 font-bold uppercase">Kebutuhan Bibit</p>
                        <p className="font-bold text-emerald-800 mt-0.5">{detail.kebutuhanBibit?.toLocaleString()} Pcs</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 bg-gray-50/80 border-t border-gray-100 flex gap-3">
              {detail.statusVerifikasi === 'pending' ? (
                <>
                  <button
                    onClick={() => handleVerify(detail.id, 'rejected', 'Data tidak valid atau perlu perbaikan')}
                    disabled={loadingId === detail.id}
                    className="px-6 py-3 bg-white border border-red-200 text-red-600 rounded-xl font-bold text-sm hover:bg-red-50 transition-all shadow-sm disabled:opacity-50"
                  >
                    Tolak
                  </button>
                  <button
                    onClick={() => handleVerify(detail.id, 'approved', 'Sudah diinspeksi lapangan')}
                    disabled={loadingId === detail.id}
                    className="flex-1 py-3 bg-white border border-amber-200 text-amber-700 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-amber-50 transition-all shadow-sm disabled:opacity-50"
                  >
                    <Camera size={18} /> Approve + Inspeksi
                  </button>
                  <button
                    onClick={() => handleVerify(detail.id, 'approved')}
                    disabled={loadingId === detail.id}
                    className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 disabled:opacity-50"
                  >
                    <Check size={18} /> {loadingId === detail.id ? 'Memproses...' : 'Approve'}
                  </button>
                </>
              ) : (
                <div className="w-full text-center py-2 flex flex-col items-center gap-2">
                  <StatusBadge status={detail.statusVerifikasi} />
                  <p className="text-[10px] text-gray-400">Data telah diverifikasi pada {formatTanggal(new Date().toISOString())}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifikasiTanamanPage;
