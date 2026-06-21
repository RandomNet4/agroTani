// =====================================================
// ADMIN: MANAJEMEN PENGAJUAN JUAL PANEN
// =====================================================

import React, { useState } from 'react';
import { ShoppingCart, Check, X, Eye, Camera } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import { useData } from '../../context/DataContext';
import { formatTanggal } from '../../data/adminDummy';

const ManajemenJualPanenPage: React.FC = () => {
  const { pengajuanJual: dummyPengajuanJual, verifyPengajuanJual, komoditas: listKomoditas } = useData();
  const [filterStatus, setFilterStatus] = useState('semua');
  const [selected, setSelected] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filtered = filterStatus === 'semua'
    ? dummyPengajuanJual
    : dummyPengajuanJual.filter(p => p.status === filterStatus);

  const detail = dummyPengajuanJual.find(p => p.id === selected);

  const handleVerify = async (id: string, status: string, catatan?: string) => {
    setLoadingId(id);
    await verifyPengajuanJual(id, status, catatan);
    setLoadingId(null);
    setSelected(null);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title flex items-center gap-2"><ShoppingCart size={24} /> Pengajuan Jual Panen</h1>
          <p className="text-sm text-gray-500 mt-1">Verifikasi dan kelola pengajuan jual hasil panen</p>
        </div>
        <div className="bg-amber-50 rounded-xl px-4 py-2 text-center">
          <p className="text-2xl font-bold text-amber-700">{dummyPengajuanJual.filter(p => p.status === 'pending').length}</p>
          <p className="text-xs text-amber-600">Menunggu</p>
        </div>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto">
        {['semua', 'pending', 'approved', 'pickup_dijadwalkan', 'selesai', 'rejected'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${filterStatus === s ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
            {s === 'semua' ? 'Semua' : s === 'pickup_dijadwalkan' ? 'Pickup' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Petani</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Komoditas</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Berat Est.</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Tgl Pengajuan</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Siap Pickup</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(pj => (
                <tr key={pj.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium">{pj.petaniNama}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {listKomoditas.find(k => k.id === pj.komoditasId || k.nama === pj.komoditasNama)?.gambar || '🌾'}
                      </span>
                      <span>{pj.komoditasNama}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold">{pj.beratEstimasiKg.toLocaleString()} kg</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{formatTanggal(pj.tanggalPengajuan)}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{formatTanggal(pj.tanggalSiapPickup)}</td>
                  <td className="px-4 py-3"><StatusBadge status={pj.status} size="sm" /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => setSelected(pj.id)} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Eye size={16} /></button>
                      {pj.status === 'pending' && (
                        <>
                          <button
                            disabled={loadingId === pj.id}
                            className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 disabled:opacity-50"
                            onClick={() => handleVerify(pj.id, 'approved')}
                            title="Setujui"
                          ><Check size={16} /></button>
                          <button
                            disabled={loadingId === pj.id}
                            className="p-1.5 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 disabled:opacity-50"
                            onClick={() => setSelected(pj.id)}
                            title="Lihat Detail"
                          ><Camera size={16} /></button>
                          <button
                            disabled={loadingId === pj.id}
                            className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 disabled:opacity-50"
                            onClick={() => handleVerify(pj.id, 'rejected')}
                            title="Tolak"
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
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-xl">Detail Pengajuan</h2>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={20} /></button>
            </div>
            {detail.fotoPanen && (detail.fotoPanen.startsWith('data:image/') || detail.fotoPanen.startsWith('http') || detail.fotoPanen.includes('.') || detail.fotoPanen.length > 50) ? (
              <div className="flex justify-center mb-4">
                <img 
                  src={detail.fotoPanen.startsWith('data:image/') || detail.fotoPanen.startsWith('http') || detail.fotoPanen.includes('.') ? detail.fotoPanen : `data:image/jpeg;base64,${detail.fotoPanen}`} 
                  alt="Foto Panen" 
                  className="w-full max-h-52 object-cover rounded-2xl border border-gray-100 shadow-sm" 
                />
              </div>
            ) : (
              <div className="text-center text-5xl mb-3">
                {listKomoditas.find(k => k.id === detail.komoditasId || k.nama === detail.komoditasNama)?.gambar || '🌾'}
              </div>
            )}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-50"><span className="text-gray-500">Petani</span><span className="font-medium">{detail.petaniNama}</span></div>
              <div className="flex justify-between py-2 border-b border-gray-50"><span className="text-gray-500">Komoditas</span><span className="font-medium">{detail.komoditasNama}</span></div>
              <div className="flex justify-between py-2 border-b border-gray-50"><span className="text-gray-500">Berat Estimasi</span><span className="font-medium">{detail.beratEstimasiKg.toLocaleString()} kg</span></div>
              <div className="flex justify-between py-2 border-b border-gray-50"><span className="text-gray-500">Siap Pickup</span><span className="font-medium">{formatTanggal(detail.tanggalSiapPickup)}</span></div>
              {detail.catatanPetani && <div className="flex justify-between py-2 border-b border-gray-50"><span className="text-gray-500">Catatan</span><span className="font-medium text-right max-w-[60%]">{detail.catatanPetani}</span></div>}
              <div className="flex justify-between py-2"><span className="text-gray-500">Status</span><StatusBadge status={detail.status} size="sm" /></div>
            </div>
            {detail.status === 'pending' && (
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => handleVerify(detail.id, 'rejected', 'Pengajuan ditolak oleh admin')}
                  disabled={loadingId === detail.id}
                  className="btn-danger flex-1 text-sm disabled:opacity-50"
                >Tolak</button>
                <button
                  onClick={() => handleVerify(detail.id, 'approved')}
                  disabled={loadingId === detail.id}
                  className="btn-primary flex-1 text-sm disabled:opacity-50"
                >{loadingId === detail.id ? 'Memproses...' : 'Approve'}</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManajemenJualPanenPage;
