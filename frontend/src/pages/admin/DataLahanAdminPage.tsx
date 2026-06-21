import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Map, List, MapPin, Search, Eye, Check, X, Camera, Info, User, FileText } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';

const DataLahanAdminPage: React.FC = () => {
  const { lahan: dummyLahan, petani: dummyPetani, verifyLahan } = useData();
  const [view, setView] = useState<'list' | 'map'>('list');
  const [search, setSearch] = useState('');
  const [selectedLahanId, setSelectedLahanId] = useState<string | null>(null);

  const handleVerifyLahan = async (id: string, status: string, name: string) => {
    const success = await verifyLahan(id, status);
    if (success) {
      alert(`Status lahan "${name}" berhasil diubah menjadi: ${status}`);
      setSelectedLahanId(null);
    } else {
      alert(`Gagal mengubah status lahan "${name}".`);
    }
  };

  const filtered = dummyLahan.filter(l => {
    const petani = dummyPetani.find(p => p.id === l.petaniId);
    return l.namaLahan.toLowerCase().includes(search.toLowerCase()) ||
      petani?.nama.toLowerCase().includes(search.toLowerCase()) ||
      l.kecamatan.toLowerCase().includes(search.toLowerCase());
  });

  const selectedLahan = dummyLahan.find(l => l.id === selectedLahanId);
  const selectedPetani = selectedLahan ? dummyPetani.find(p => p.id === selectedLahan.petaniId) : null;

  const totalLuas = dummyLahan.reduce((sum, l) => sum + l.luasHektar, 0);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title flex items-center gap-2"><Map size={24} /> Data Lahan Petani</h1>
          <p className="text-sm text-gray-500 mt-1">Total {dummyLahan.length} Lahan • {totalLuas.toFixed(1)} Ha</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView('list')} className={`p-2.5 rounded-xl transition-all ${view === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
            <List size={18} />
          </button>
          <button onClick={() => setView('map')} className={`p-2.5 rounded-xl transition-all ${view === 'map' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
            <Map size={18} />
          </button>
        </div>
      </div>

      <div className="relative mb-4">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Cari lahan, petani, atau kecamatan..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" />
      </div>

      {view === 'list' && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Lahan</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Petani</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Luas</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Jenis</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Wilayah</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">GPS</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(l => {
                  const petani = dummyPetani.find(p => p.id === l.petaniId);
                  return (
                    <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {l.fotoLahan && (l.fotoLahan.startsWith('data:image/') || l.fotoLahan.startsWith('http') || l.fotoLahan.includes('.')) ? (
                            <img src={l.fotoLahan} alt="Foto Lahan" className="w-8 h-8 rounded-lg object-cover shrink-0 border border-gray-100" />
                          ) : (
                            <span className="text-xl">{l.fotoLahan}</span>
                          )}
                          <span className="font-medium">{l.namaLahan}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{petani?.nama || '-'}</td>
                      <td className="px-4 py-3 font-semibold text-xs">{l.luasHektar} Ha</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] capitalize font-medium">{l.jenisLahan}</span></td>
                      <td className="px-4 py-3 text-[10px] text-gray-600">{l.kecamatan}, {l.kabupaten}</td>
                      <td className="px-4 py-3 text-[10px] font-mono text-gray-500">{l.lokasi.lat.toFixed(4)}, {l.lokasi.lng.toFixed(4)}</td>
                      <td className="px-4 py-3"><StatusBadge status={l.statusVerifikasi} size="sm" /></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button 
                            onClick={() => setSelectedLahanId(l.id)}
                            className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                            title="Detail"
                          >
                            <Eye size={16} />
                          </button>
                          {l.statusVerifikasi === 'pending' && (
                            <>
                              <button 
                                onClick={() => handleVerifyLahan(l.id, 'approved', l.namaLahan)}
                                className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                                title="Approve"
                              >
                                <Check size={16} />
                              </button>
                              <button 
                                onClick={() => handleVerifyLahan(l.id, 'survey', l.namaLahan)}
                                className="p-1.5 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors"
                                title="Jadwalkan Survey"
                              >
                                <Camera size={16} />
                              </button>
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
      )}

      {view === 'map' && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {/* Map Placeholder */}
          <div className="h-96 bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center relative">
            <div className="text-center">
              <Map size={48} className="mx-auto text-emerald-300 mb-3" />
              <p className="text-gray-500 font-medium">Peta Lahan Petani</p>
              <p className="text-xs text-gray-400">Integrasi peta akan ditampilkan di sini</p>
            </div>
            {/* Markers */}
            {filtered.map((l, i) => (
              <div
                key={l.id}
                className="absolute w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg cursor-pointer hover:scale-110 transition-transform"
                style={{ top: `${20 + (i * 40) % 300}px`, left: `${30 + (i * 80) % 600}px` }}
                title={`${l.namaLahan} - ${l.luasHektar} Ha`}
              >
                <MapPin size={14} />
              </div>
            ))}
          </div>
          {/* Legend */}
          <div className="p-4 border-t border-gray-100 flex flex-wrap gap-4 text-xs">
            {filtered.map(l => {
              const petani = dummyPetani.find(p => p.id === l.petaniId);
              return (
                <div key={l.id} className="flex items-center gap-2">
                  <MapPin size={12} className="text-primary-600" />
                  <span className="font-medium">{l.namaLahan}</span>
                  <span className="text-gray-400">({petani?.nama})</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedLahan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in" onClick={() => setSelectedLahanId(null)}>
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl transition-all" onClick={e => e.stopPropagation()}>
            <div className="bg-primary-600 p-6 text-white flex justify-between items-start">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl shadow-inner border border-white/10 overflow-hidden">
                  {selectedLahan.fotoLahan && (selectedLahan.fotoLahan.startsWith('data:image/') || selectedLahan.fotoLahan.startsWith('http') || selectedLahan.fotoLahan.includes('.')) ? (
                    <img src={selectedLahan.fotoLahan} alt="Foto Lahan" className="w-full h-full object-cover" />
                  ) : (
                    selectedLahan.fotoLahan
                  )}
                </div>
                <div>
                  <h2 className="font-display font-bold text-2xl">{selectedLahan.namaLahan}</h2>
                  <p className="text-primary-100 text-sm flex items-center gap-1 opacity-80 mt-1">
                    <MapPin size={14} /> {selectedLahan.kecamatan}, {selectedLahan.kabupaten}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedLahanId(null)} className="p-2 hover:bg-white/10 rounded-xl"><X size={24} /></button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Info size={14} className="text-primary-500" /> Informasi Lahan
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Luas</p>
                      <p className="font-bold text-gray-800">{selectedLahan.luasHektar} Ha</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Jenis</p>
                      <p className="font-bold text-gray-800 capitalize">{selectedLahan.jenisLahan}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <User size={14} className="text-primary-500" /> Informasi Pemilik
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                        {selectedPetani?.nama.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{selectedPetani?.nama}</p>
                        <p className="text-xs text-gray-500">{selectedPetani?.noHp}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <FileText size={14} className="text-primary-500" /> Dokumen Legalitas
                  </h3>
                  <div className="border-2 border-dashed border-gray-100 rounded-2xl p-4 text-center bg-gray-50/50">
                    <FileText className="mx-auto text-gray-300 mb-2" size={24} />
                    <p className="text-[11px] text-gray-500 font-medium">SPPT_Sertifikat_01.pdf</p>
                    <button className="text-[10px] text-primary-600 font-bold mt-2 hover:underline">Lihat Dokumen</button>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Map size={14} className="text-primary-500" /> Posisi Geografis
                  </h3>
                  <div className="aspect-square bg-gray-100 rounded-2xl border border-gray-100 relative overflow-hidden flex items-center justify-center">
                    <Map size={32} className="text-gray-300" />
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10" />
                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-[10px] font-mono shadow-sm">
                      {selectedLahan.lokasi.lat.toFixed(6)}, {selectedLahan.lokasi.lng.toFixed(6)}
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-2 leading-relaxed">
                    <MapPin size={10} className="inline mr-1" /> {selectedLahan.lokasi.alamat}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50/80 border-t border-gray-100 flex gap-3">
              {selectedLahan.statusVerifikasi === 'pending' || selectedLahan.statusVerifikasi === 'survey' ? (
                <>
                  <button 
                    onClick={() => handleVerifyLahan(selectedLahan.id, 'survey', selectedLahan.namaLahan)}
                    className="flex-1 py-3 bg-white border border-amber-200 text-amber-700 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-amber-50 transition-all shadow-sm"
                  >
                    <Camera size={18} /> Survei Lahan
                  </button>
                  <button 
                    onClick={() => handleVerifyLahan(selectedLahan.id, 'rejected', selectedLahan.namaLahan)}
                    className="px-6 py-3 bg-white border border-red-200 text-red-600 rounded-xl font-bold text-sm hover:bg-red-50 transition-all shadow-sm"
                  >
                    Tolak
                  </button>
                  <button 
                    onClick={() => handleVerifyLahan(selectedLahan.id, 'approved', selectedLahan.namaLahan)}
                    className="flex-1 py-3 bg-primary-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary-700 transition-all shadow-lg shadow-primary-200"
                  >
                    <Check size={18} /> Setujui Lahan
                  </button>
                </>
              ) : (
                <div className="w-full text-center py-2">
                  <StatusBadge status={selectedLahan.statusVerifikasi} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataLahanAdminPage;
