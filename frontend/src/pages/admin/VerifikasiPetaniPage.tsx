// =====================================================
// ADMIN: VERIFIKASI PENDAFTARAN PETANI
// =====================================================

import React, { useState } from 'react';
import { Users, Search, Eye, Check, X, MapPin, Phone, Mail, Calendar, Camera } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import { useData } from '../../context/DataContext';
import { formatTanggal } from '../../data/adminDummy';

const VerifikasiPetaniPage: React.FC = () => {
  const { petani: dummyPetani, verifyPetani } = useData();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('semua');
  const [selected, setSelected] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Action modal state
  const [actionModal, setActionModal] = useState<{ id: string; name: string; type: 'approve' | 'reject' | 'survey' } | null>(null);
  const [actionForm, setActionForm] = useState({ catatan: '', gudang: '' });

  const handleAction = async () => {
    if (!actionModal) return;
    setLoadingId(actionModal.id);
    let status = actionModal.type === 'approve' ? 'approved' : actionModal.type === 'reject' ? 'rejected' : 'survey';
    const gudangId = actionModal.type === 'approve' && actionForm.gudang ? `GDG_${Date.now().toString().slice(-4)}` : undefined;
    const gudangNama = actionModal.type === 'approve' && actionForm.gudang ? actionForm.gudang : undefined;
    await verifyPetani(actionModal.id, status, actionForm.catatan || undefined, gudangId, gudangNama);
    setLoadingId(null);
    setActionModal(null);
    setActionForm({ catatan: '', gudang: '' });
    setSelected(null);
  };

  const filtered = dummyPetani.filter(p => {
    const matchSearch = p.nama.toLowerCase().includes(search.toLowerCase()) || p.nik.includes(search);
    const matchStatus = filterStatus === 'semua' || p.statusVerifikasi === filterStatus;
    return matchSearch && matchStatus;
  });

  const petaniDetail = dummyPetani.find(p => p.id === selected);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title flex items-center gap-2"><Users size={24} /> Verifikasi Petani</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola pendaftaran dan verifikasi petani mitra</p>
        </div>
        <div className="bg-primary-50 rounded-xl px-4 py-2 text-center">
          <p className="text-2xl font-bold text-primary-700">{dummyPetani.filter(p => p.statusVerifikasi === 'pending').length}</p>
          <p className="text-xs text-primary-600">Menunggu</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Cari nama atau NIK..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" />
        </div>
        <div className="flex gap-2">
          {['semua', 'pending', 'approved', 'rejected', 'survey'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${filterStatus === s ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
              {s === 'semua' ? 'Semua' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Nama / NIK</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Lokasi</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Tgl Daftar</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.fotoProfil && (p.fotoProfil.startsWith('data:image/') || p.fotoProfil.startsWith('http') || p.fotoProfil.includes('.')) ? (
                        <img src={p.fotoProfil} alt="Foto Profil" className="w-8 h-8 rounded-full object-cover shrink-0 border border-gray-100" />
                      ) : (
                        <span className="text-2xl">{p.fotoProfil}</span>
                      )}
                      <div>
                        <p className="font-medium">{p.nama}</p>
                        <p className="text-xs text-gray-400">{p.nik}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">{p.kecamatan}, {p.kabupaten}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{formatTanggal(p.tanggalDaftar)}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.statusVerifikasi} size="sm" /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => setSelected(p.id)} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100" title="Detail">
                        <Eye size={16} />
                      </button>
                      {p.statusVerifikasi === 'pending' && (
                        <>
                          <button
                            disabled={loadingId === p.id}
                            className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 disabled:opacity-50"
                            title="Approve"
                            onClick={() => { setActionModal({ id: p.id, name: p.nama, type: 'approve' }); setActionForm({ catatan: '', gudang: '' }); }}
                          ><Check size={16} /></button>
                          <button
                            disabled={loadingId === p.id}
                            className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 disabled:opacity-50"
                            title="Reject"
                            onClick={() => { setActionModal({ id: p.id, name: p.nama, type: 'reject' }); setActionForm({ catatan: '', gudang: '' }); }}
                          ><X size={16} /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {petaniDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-xl">Detail Petani</h2>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={20} /></button>
            </div>
            <div className="flex items-center gap-4 mb-4 pb-4 border-b">
              {petaniDetail.fotoProfil && (petaniDetail.fotoProfil.startsWith('data:image/') || petaniDetail.fotoProfil.startsWith('http') || petaniDetail.fotoProfil.includes('.')) ? (
                <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-200 shrink-0">
                  <img src={petaniDetail.fotoProfil} alt="Foto Profil" className="w-full h-full object-cover" />
                </div>
              ) : (
                <span className="text-5xl">{petaniDetail.fotoProfil}</span>
              )}
              <div>
                <h3 className="font-bold text-lg">{petaniDetail.nama}</h3>
                <StatusBadge status={petaniDetail.statusVerifikasi} />
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2"><Mail size={16} className="text-gray-400" /> {petaniDetail.email}</div>
              <div className="flex items-center gap-2"><Phone size={16} className="text-gray-400" /> {petaniDetail.noHp}</div>
              <div className="flex items-center gap-2"><MapPin size={16} className="text-gray-400" /> {petaniDetail.alamat}</div>
              <div className="flex items-center gap-2"><Calendar size={16} className="text-gray-400" /> Daftar: {formatTanggal(petaniDetail.tanggalDaftar)}</div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">NIK: <span className="font-mono font-medium text-gray-800">{petaniDetail.nik}</span></p>
              </div>
              <div className="mt-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Dokumen KTP Mitra</p>
                {petaniDetail.fotoKtp && (petaniDetail.fotoKtp.startsWith('data:image/') || petaniDetail.fotoKtp.startsWith('http') || petaniDetail.fotoKtp.includes('.')) ? (
                  <div className="rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 p-1">
                    <img 
                      src={petaniDetail.fotoKtp} 
                      alt="Foto KTP" 
                      className="w-full h-48 object-cover rounded-xl cursor-pointer hover:opacity-90 transition-opacity" 
                      onClick={() => window.open(petaniDetail.fotoKtp, '_blank')}
                    />
                    <p className="text-[10px] text-gray-400 text-center mt-1 font-medium">Klik gambar untuk melihat ukuran penuh</p>
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-center text-xs text-gray-400">
                    Foto KTP tidak tersedia atau merupakan berkas default (`{petaniDetail.fotoKtp || '-'}`)
                  </div>
                )}
              </div>
              {petaniDetail.catatanVerifikasi && (
                <div className="bg-amber-50 rounded-xl p-3">
                  <p className="text-xs text-amber-700">📝 Catatan: {petaniDetail.catatanVerifikasi}</p>
                </div>
              )}
            </div>
            {petaniDetail.statusVerifikasi === 'pending' && (
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => { setActionModal({ id: petaniDetail.id, name: petaniDetail.nama, type: 'survey' }); setActionForm({ catatan: '', gudang: '' }); }}
                  className="btn-warning flex-1 text-sm flex items-center justify-center gap-1"
                ><Camera size={14} /> Survey</button>
                <button
                  onClick={() => { setActionModal({ id: petaniDetail.id, name: petaniDetail.nama, type: 'approve' }); setActionForm({ catatan: '', gudang: '' }); }}
                  className="btn-primary flex-1 text-sm"
                >Approve</button>
                <button
                  onClick={() => { setActionModal({ id: petaniDetail.id, name: petaniDetail.nama, type: 'reject' }); setActionForm({ catatan: '', gudang: '' }); }}
                  className="btn-danger flex-1 text-sm"
                >Reject</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Confirmation Modal */}
      {actionModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60" onClick={() => setActionModal(null)}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-1">
              {actionModal.type === 'approve' ? '✅ Approve' : actionModal.type === 'reject' ? '❌ Tolak' : '📍 Survey Lapangan'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {actionModal.name}
            </p>
            {actionModal.type === 'approve' && (
              <div className="mb-3">
                <label className="label-field">Gudang Tujuan (opsional)</label>
                <input
                  type="text"
                  placeholder="Mis: Gudang Cianjur"
                  className="input-field"
                  value={actionForm.gudang}
                  onChange={e => setActionForm({...actionForm, gudang: e.target.value})}
                />
              </div>
            )}
            <div className="mb-4">
              <label className="label-field">
                {actionModal.type === 'reject' ? 'Alasan Penolakan' : 'Catatan (opsional)'}
              </label>
              <textarea
                placeholder={actionModal.type === 'reject' ? 'Masukkan alasan penolakan...' : 'Catatan tambahan...'}
                className="input-field"
                rows={3}
                value={actionForm.catatan}
                onChange={e => setActionForm({...actionForm, catatan: e.target.value})}
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setActionModal(null)} className="btn-secondary flex-1 text-sm">Batal</button>
              <button
                onClick={handleAction}
                disabled={loadingId === actionModal.id}
                className={`flex-1 text-sm disabled:opacity-50 ${actionModal.type === 'reject' ? 'btn-danger' : 'btn-primary'}`}
              >
                {loadingId === actionModal.id ? 'Memproses...' : 'Konfirmasi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifikasiPetaniPage;
