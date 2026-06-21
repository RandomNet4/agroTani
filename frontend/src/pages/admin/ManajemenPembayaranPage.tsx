// =====================================================
// ADMIN: MANAJEMEN PEMBAYARAN & RIWAYAT
// =====================================================

import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { CreditCard, Check, Upload, Eye, X, Download } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import { formatRupiah, formatTanggal } from '../../data/adminDummy';

const ManajemenPembayaranPage: React.FC = () => {
  const { pembayaran: dummyPembayaran, pickup: dummyPickup, payInvoice } = useData();
  const [filterStatus, setFilterStatus] = useState('semua');
  const [selected, setSelected] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [uploadedBukti, setUploadedBukti] = useState<string | null>(null);

  const filtered = filterStatus === 'semua'
    ? dummyPembayaran
    : dummyPembayaran.filter(p => p.status === filterStatus);

  const totalDibayar = dummyPembayaran.filter(p => p.status === 'dibayar').reduce((s, p) => s + p.totalBayar, 0);
  const totalMenunggu = dummyPembayaran.filter(p => p.status === 'menunggu').length;
  const detail = dummyPembayaran.find(p => p.id === selected);
  const detailPickup = detail ? dummyPickup.find(pk => pk.id === detail.pickupId) : null;

  const beratAktual = detailPickup?.beratTimbangKg || detail?.beratKg || 0;
  const totalTagihanAktual = detail?.status === 'menunggu' ? (beratAktual * (detail?.hargaPerKg || 0)) : (detail?.totalBayar || 0);

  const handleKonfirmasi = async (id: string, metodeBayar: string, totalBayar: number, beratKg: number) => {
    setLoadingId(id);
    await payInvoice(id, { status: 'dibayar', metodeBayar, totalBayar, beratKg, buktiTransfer: uploadedBukti || undefined });
    setLoadingId(null);
    setSelected(null);
    setUploadedBukti(null);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title flex items-center gap-2"><CreditCard size={24} /> Manajemen Pembayaran</h1>
          <p className="text-sm text-gray-500 mt-1">Review, konfirmasi, dan kelola pembayaran petani</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="stat-card from-emerald-500 to-emerald-600">
          <p className="text-emerald-100 text-xs">Total Dibayar</p>
          <p className="text-2xl font-bold">{formatRupiah(totalDibayar)}</p>
        </div>
        <div className="stat-card from-amber-500 to-amber-600">
          <p className="text-amber-100 text-xs">Menunggu Pembayaran</p>
          <p className="text-2xl font-bold">{totalMenunggu}</p>
        </div>
        <div className="stat-card from-blue-500 to-blue-600">
          <p className="text-blue-100 text-xs">Total Transaksi</p>
          <p className="text-2xl font-bold">{dummyPembayaran.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {['semua', 'menunggu', 'diproses', 'dibayar', 'gagal'].map(s => (
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
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Invoice</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Petani</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Komoditas</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Berat</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Total</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Tgl Pickup</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.nomorInvoice}</td>
                  <td className="px-4 py-3 font-medium">{p.petaniNama}</td>
                  <td className="px-4 py-3">{p.komoditasNama}</td>
                  <td className="px-4 py-3">{p.beratKg > 0 ? `${p.beratKg.toLocaleString()} kg` : '-'}</td>
                  <td className="px-4 py-3 font-bold text-primary-700">{p.totalBayar > 0 ? formatRupiah(p.totalBayar) : '-'}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{formatTanggal(p.tanggalPickup)}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} size="sm" /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => setSelected(p.id)} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Eye size={16} /></button>

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
              <h2 className="font-display font-bold text-xl">Detail Pembayaran</h2>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={20} /></button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b"><span className="text-gray-500">Invoice</span><span className="font-mono font-medium">{detail.nomorInvoice}</span></div>
              <div className="flex justify-between py-2 border-b"><span className="text-gray-500">Petani</span><span className="font-medium">{detail.petaniNama}</span></div>
              <div className="flex justify-between py-2 border-b"><span className="text-gray-500">Komoditas</span><span>{detail.komoditasNama}</span></div>
              <div className="flex justify-between py-2 border-b"><span className="text-gray-500">Berat Timbang</span><span className="font-medium">{beratAktual} kg</span></div>
              <div className="flex justify-between py-2 border-b"><span className="text-gray-500">Harga/kg</span><span>{formatRupiah(detail.hargaPerKg)}</span></div>
              <div className="flex justify-between py-2 border-b"><span className="text-gray-500">Total Tagihan</span><span className="font-bold text-lg text-primary-700">{formatRupiah(totalTagihanAktual)}</span></div>
              <div className="flex justify-between py-2 border-b"><span className="text-gray-500">Metode</span><span className="font-semibold">{detail.metodeBayar === 'TDF' ? 'Transfer Bank (TDF)' : 'Tunai (Cash)'}</span></div>
              <div className="flex justify-between py-2"><span className="text-gray-500">Status</span><StatusBadge status={detail.status} size="sm" /></div>
            </div>
            {(detail.status === 'menunggu' || detail.status === 'diproses') && (
              <div className="mt-6 space-y-3">
                {detail.metodeBayar === 'TDF' ? (
                  <div>
                    <label className="label-field flex items-center gap-1 mb-1.5"><Upload size={14} /> Upload Bukti Transfer</label>
                    {uploadedBukti ? (
                      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg">PREVIEW</div>
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
                          <span className="text-xl">📄</span>
                          <div className="text-left">
                            <p className="text-xs font-bold text-gray-700">Bukti_Transfer_{detail.nomorInvoice}.png</p>
                            <p className="text-[10px] text-gray-400">PNG Image · 152 KB</p>
                          </div>
                        </div>
                        {/* Premium Receipt Layout */}
                        <div className="bg-white border border-gray-100 rounded-xl p-3 text-center space-y-1.5 shadow-sm">
                          <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Transfer Berhasil</p>
                          <p className="text-xl font-bold text-gray-800">{formatRupiah(totalTagihanAktual)}</p>
                          <div className="text-[10px] text-gray-500 space-y-0.5 text-left border-t pt-2 mt-2">
                            <p><span className="text-gray-400">Pengirim:</span> BUMD AGRO JABAR</p>
                            <p><span className="text-gray-400">Penerima:</span> {detail.petaniNama}</p>
                            <p><span className="text-gray-400">Bank:</span> Bank BJB</p>
                            <p><span className="text-gray-400">No. Ref:</span> {uploadedBukti}</p>
                          </div>
                        </div>
                        <button onClick={() => setUploadedBukti(null)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1 bg-white rounded-full shadow border border-gray-100">
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => setUploadedBukti(`BJB-${Date.now().toString().slice(-8)}`)} 
                        className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-primary-400 bg-gray-50 hover:bg-primary-50/10 transition-all"
                      >
                        <Upload className="mx-auto text-gray-400 mb-1" size={24} />
                        <p className="text-xs text-gray-700 font-bold">Upload Bukti Transfer</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Klik untuk simulasi upload bukti transfer</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-orange-50 border border-orange-100 p-3 rounded-xl text-left">
                    <p className="text-sm font-semibold text-orange-800 flex items-center gap-2"><Check size={16}/> Konfirmasi Uang Tunai</p>
                    <p className="text-xs text-orange-700 mt-1">Pastikan uang tunai senilai <strong>{formatRupiah(totalTagihanAktual)}</strong> telah diserahkan dan dihitung bersama oleh petani di lokasi.</p>
                  </div>
                )}
                <button
                  onClick={() => handleKonfirmasi(detail.id, detail.metodeBayar, totalTagihanAktual, beratAktual)}
                  disabled={loadingId === detail.id || (detail.metodeBayar === 'TDF' && !uploadedBukti)}
                  className="btn-primary w-full text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Check size={16} />
                  {loadingId === detail.id ? 'Memproses...' : 'Verifikasi & Konfirmasi Pembayaran'}
                </button>
              </div>
            )}
            {detail.status === 'dibayar' && (
              <div className="mt-4 text-left">
                {detail.buktiTransfer ? (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Bukti Transfer Terverifikasi</p>
                    <div className="bg-white border border-gray-100 rounded-lg p-3 text-center space-y-1 shadow-sm">
                      <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider">Transfer Berhasil</p>
                      <p className="text-lg font-bold text-gray-800">{formatRupiah(detail.totalBayar)}</p>
                      <div className="text-[9px] text-gray-500 text-left border-t pt-2 mt-2">
                        <p><span className="text-gray-400">Pengirim:</span> BUMD AGRO JABAR</p>
                        <p><span className="text-gray-400">Penerima:</span> {detail.petaniNama}</p>
                        <p><span className="text-gray-400">Ref:</span> {detail.buktiTransfer}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
                    <p className="text-xs text-emerald-800">Pembayaran tunai telah diverifikasi dan lunas.</p>
                  </div>
                )}
                <div className="flex gap-2 mt-4">
                  <button className="btn-secondary flex-1 text-xs flex items-center justify-center gap-1"><Download size={14} /> Invoice PDF</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManajemenPembayaranPage;
