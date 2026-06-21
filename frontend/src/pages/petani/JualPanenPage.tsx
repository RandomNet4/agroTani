// =====================================================
// JUAL PANEN - PETANI (REDESIGN — Supply Intelligence)
// =====================================================

import React, { useState } from 'react';
import {
  ArrowLeft, Plus, CheckCircle2, CircleDashed, Calendar,
  Wallet, ChevronRight, Phone, 
  // Sprout,
  MapPin, Truck, MessageCircle, FileText, Download, Clock,
  AlertCircle, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import StatusBadge from '../../components/StatusBadge';
import {
  formatTanggal, formatRupiah, 
} from '../../data/dummy';

type FilterType = 'semua' | 'aktif' | 'selesai' | 'ditolak';

const JualPanenPage: React.FC = () => {
  const { 
    pengajuanJual, 
    pembayaran, 
    pickup, 
    komoditas: listKomoditas, 
    qualityControl,
    currentUser,
    refreshData
  } = useData();
  const navigate = useNavigate();
  const petaniId = currentUser?.id || '';
  const [filter, setFilter] = useState<FilterType>('semua');
  const [showBukti, setShowBukti] = useState<string | null>(null);
  const [pembayaranForBukti, setPembayaranForBukti] = useState<any>(null);

  React.useEffect(() => {
    refreshData();
    const interval = setInterval(() => {
      refreshData();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // === DATA ===
  const pengajuanSaya = pengajuanJual.filter(jp => jp.petaniId === petaniId);
  // const tanamanSaya = dummyTanamanAktif.filter(t => t.petaniId === petaniId && t.statusVerifikasi === 'approved');

  // Tanaman siap/mendekati panen (< 14 hari atau sudah lewat)
  // const tanamanSiapPanen = tanamanSaya.filter(t => {
  //   const hari = hitungHariMenuju(t.estimasiPanen);
  //   return hari <= 14;
  // });

  // Filter pengajuan
  const filteredPengajuan = pengajuanSaya.filter(p => {
    if (filter === 'aktif') return !['selesai', 'rejected'].includes(p.status);
    if (filter === 'selesai') return p.status === 'selesai';
    if (filter === 'ditolak') return p.status === 'rejected';
    return true;
  });

  // Ringkasan keuangan
  // const totalDibayar = pembayaranSaya
  //   .filter(p => p.status === 'dibayar')
  //   .reduce((sum, p) => sum + p.totalBayar, 0);
  // const totalPending = pembayaranSaya
  //   .filter(p => p.status === 'menunggu' || p.status === 'diproses')
  //   .length;
  // const totalSelesai = pembayaranSaya.filter(p => p.status === 'dibayar').length;

  // Helper: status label bahasa manusia
  const getStatusLabel = (status: string, beratEstimasiKg: number, hasQC: boolean): string => {
    if (status === 'proses_timbang' && hasQC) {
      return '💸 Menunggu Pembayaran';
    }
    const labels: Record<string, string> = {
      'pending': '⏳ Menunggu Review',
      'approved': '✅ Disetujui — Menunggu Jadwal',
      'survey': '🔎 Survei Lapangan',
      'pickup_dijadwalkan': beratEstimasiKg < 300 ? '📦 Silakan Antar ke Gudang' : '🚗 Pickup Terjadwal',
      'proses_timbang': '⚖️ Sedang Ditimbang',
      'selesai': '✅ Selesai',
      'rejected': '❌ Ditolak',
    };
    return labels[status] || status;
  };

  // Helper: tracker step status
  const getStepStatus = (status: string, stepIndex: number, hasQC: boolean) => {
    if (status === 'rejected') return 'upcoming';

    if (stepIndex === 0) {
      return status === 'pending' ? 'current' : 'completed';
    }
    if (stepIndex === 1) {
      if (status === 'pending') return 'upcoming';
      return status === 'approved' || status === 'survey' ? 'current' : 'completed';
    }
    if (stepIndex === 2) {
      if (['pending', 'approved', 'survey'].includes(status)) return 'upcoming';
      if (status === 'proses_timbang' && hasQC) return 'completed';
      return status === 'pickup_dijadwalkan' || status === 'proses_timbang' ? 'current' : 'completed';
    }
    if (stepIndex === 3) {
      if (status === 'selesai') return 'completed';
      if (status === 'proses_timbang' && hasQC) return 'current';
      return 'upcoming';
    }
    return 'upcoming';
  };

  // Helper: get pickup data for a pengajuan
  const getPickupData = (pengajuanId: string) => {
    return pickup.find(p => p.pengajuanJualId === pengajuanId);
  };

  // Helper: get pembayaran for a pickup
  const getPembayaranData = (pickupId: string) => {
    return pembayaran.find(p => p.pickupId === pickupId);
  };

  // === COMPONENTS ===
  const TrackerStep = ({ label, status, isLast }: { label: string; status: 'completed' | 'current' | 'upcoming'; isLast?: boolean }) => (
    <div className={`flex flex-col items-center flex-1 ${!isLast ? 'relative' : ''}`}>
      {!isLast && (
        <div className={`absolute top-3 left-1/2 w-full h-0.5 ${status === 'completed' ? 'bg-primary-600' : 'bg-gray-200'}`} />
      )}
      <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center bg-white border-2 
        ${status === 'completed' ? 'border-primary-600 text-primary-600' :
          status === 'current' ? 'border-primary-600 bg-primary-600 text-white' :
          'border-gray-300 text-gray-300'}`}>
        {status === 'completed' ? <CheckCircle2 size={14} /> : <CircleDashed size={14} />}
      </div>
      <p className={`text-[9px] font-medium mt-1.5 text-center leading-tight ${status !== 'upcoming' ? 'text-primary-700' : 'text-gray-400'}`}>
        {label}
      </p>
    </div>
  );

  const filters: { key: FilterType; label: string; count: number }[] = [
    { key: 'semua', label: 'Semua', count: pengajuanSaya.length },
    { key: 'aktif', label: 'Aktif', count: pengajuanSaya.filter(p => !['selesai', 'rejected'].includes(p.status)).length },
    { key: 'selesai', label: 'Selesai', count: pengajuanSaya.filter(p => p.status === 'selesai').length },
    { key: 'ditolak', label: 'Ditolak', count: pengajuanSaya.filter(p => p.status === 'rejected').length },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* ── HEADER ── */}
      <div className="bg-gradient-to-b from-primary-700 to-primary-600 text-white px-5 pt-12 pb-8 rounded-b-[2rem] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20 blur-2xl" />

        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => navigate('/petani/dashboard')} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/20 transition-all active:scale-95">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-display font-bold text-xl leading-tight">Jual Panen</h1>
            <p className="text-primary-100 text-xs">Kelola penjualan hasil panen Anda</p>
          </div>
        </div>

        {/* Ringkasan Keuangan */}
        {/* <div className="bg-white/15 backdrop-blur rounded-2xl p-4 border border-white/20">
          <div className="flex items-center justify-between mb-2">
            <p className="text-primary-100 text-xs font-medium flex items-center gap-1.5"><Wallet size={14} /> Total Pendapatan</p>
            <div className="flex items-center gap-2 text-[10px]">
              {totalSelesai > 0 && <span className="bg-emerald-400/20 text-emerald-100 px-2 py-0.5 rounded-full font-bold">✅ {totalSelesai} lunas</span>}
              {totalPending > 0 && <span className="bg-amber-400/20 text-amber-100 px-2 py-0.5 rounded-full font-bold">⏳ {totalPending} proses</span>}
            </div>
          </div>
          <p className="text-2xl font-bold">{formatRupiah(totalDibayar)}</p>
        </div> */}

        {/* CTA Selalu Visible */}
        <button
          onClick={() => navigate('/petani/jual-panen/form')}
          className="w-full mt-4 py-3.5 bg-white text-primary-700 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
        >
          <Plus size={18} /> Ajukan Jual Panen Baru
        </button>
      </div>

      <div className="px-5 mt-3 space-y-4">
        {/* {tanamanSiapPanen.length > 0 && (
          <button
            onClick={() => navigate('/petani/data-lahan')}
            className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-4 shadow-sm text-left active:scale-[0.98] transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Sprout size={20} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-amber-800">🌾 {tanamanSiapPanen.length} Tanaman Siap Panen!</p>
                  <p className="text-[10px] text-amber-600 mt-0.5">Lihat di halaman Data Lahan & Tanaman →</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-amber-400" />
            </div>
          </button>
        )} */}

        {/* ── FILTER CHIPS ── */}
        <div className="flex gap-2 overflow-x-auto pt-1 pb-1 no-scrollbar">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                filter === f.key
                  ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                  : 'bg-white text-gray-500 border-gray-100 hover:border-primary-200'
              }`}
            >
              {f.label} {f.count > 0 && <span className="ml-1 opacity-70">({f.count})</span>}
            </button>
          ))}
        </div>

        {/* ── PENGAJUAN LIST ── */}
        {filteredPengajuan.length > 0 ? (
          <div className="space-y-4">
            {filteredPengajuan.map(pj => {
              const pickup = getPickupData(pj.id);
              const pembayaran = pickup ? getPembayaranData(pickup.id) : null;
              const hasQC = pickup ? qualityControl.some(qc => qc.pickupId === pickup.id) : false;
              const komoditas = listKomoditas.find(k => k.id === pj.komoditasId);
              const estimasi = pj.estimasiPendapatan || (pj.beratEstimasiKg * (komoditas?.hargaSaatIni || 0));

              return (
                <div
                  key={pj.id}
                  className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all"
                >
                  {/* Card Header */}
                  <div className="p-4 pb-3">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-gray-50">
                          {komoditas?.gambar || '🌾'}
                        </div>
                        <div>
                          <h3 className="font-bold text-[15px] text-gray-800">{pj.komoditasNama}</h3>
                          <p className="text-[11px] text-gray-500">{pj.beratEstimasiKg.toLocaleString()} kg</p>
                          {pj.lahanNama && (
                            <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                              <MapPin size={9} /> {pj.lahanNama}
                            </p>
                          )}
                        </div>
                      </div>
                      <StatusBadge status={pj.status} size="sm" />
                    </div>

                    {/* Status Label Bahasa Manusia */}
                    <div className="bg-gray-50 rounded-xl px-3 py-2 mb-3">
                      <p className="text-xs text-gray-600 font-medium">{getStatusLabel(pj.status, pj.beratEstimasiKg, hasQC)}</p>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-gray-50 rounded-xl p-2.5">
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Diajukan</p>
                        <p className="font-semibold text-[11px] text-gray-700 mt-0.5">{formatTanggal(pj.tanggalPengajuan).split(' ').slice(0, 2).join(' ')}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-2.5">
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Pickup</p>
                        <p className="font-semibold text-[11px] text-gray-700 mt-0.5">{formatTanggal(pj.tanggalSiapPickup).split(' ').slice(0, 2).join(' ')}</p>
                      </div>
                      <div className="bg-primary-50 rounded-xl p-2.5">
                        <p className="text-[9px] text-primary-500 font-bold uppercase tracking-wider">Est. Harga</p>
                        <p className="font-bold text-[11px] text-primary-700 mt-0.5">{formatRupiah(komoditas?.hargaSaatIni || 0)}/kg</p>
                      </div>
                    </div>

                    {/* Estimasi Pendapatan */}
                    {estimasi > 0 && pj.status !== 'rejected' && (
                      <div className="mt-3 bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider flex items-center gap-1">
                            <Wallet size={12} /> Estimasi Pendapatan
                          </p>
                          <p className="font-bold text-emerald-700">{formatRupiah(estimasi)}</p>
                        </div>
                        <p className="text-[9px] text-emerald-500 mt-1 italic">*Harga final ditentukan setelah timbang fisik</p>
                      </div>
                    )}
                  </div>

                  {/* Tracker Timeline — Active only */}
                  {!['selesai', 'rejected'].includes(pj.status) && (
                    <div className="px-4 pb-3">
                      <div className="pt-3 border-t border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">Tracking Penjualan</p>
                        <div className="flex justify-between w-full px-1">
                          <TrackerStep label="Pengajuan" status={getStepStatus(pj.status, 0, hasQC)} />
                          <TrackerStep label="Disetujui" status={getStepStatus(pj.status, 1, hasQC)} />
                          <TrackerStep label={pj.beratEstimasiKg < 300 ? "Antar Mandiri" : "Pickup"} status={getStepStatus(pj.status, 2, hasQC)} />
                          <TrackerStep label={pj.status === 'proses_timbang' && hasQC ? "Pembayaran" : "Selesai"} status={getStepStatus(pj.status, 3, hasQC)} isLast />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Info Driver — when pickup scheduled */}
                  {pickup && pj.status === 'pickup_dijadwalkan' && (
                    <div className="px-4 pb-3">
                      <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                          <Truck size={12} /> Info Pickup
                        </p>
                        <div className="space-y-1.5 text-xs text-gray-700">
                          <p className="flex items-center gap-2">
                            <Calendar size={12} className="text-blue-500" />
                            <span className="font-medium">{formatTanggal(pickup.tanggalPickup)}, {pickup.waktuBerangkat}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <Truck size={12} className="text-blue-500" />
                            <span>{pickup.armada} — {pickup.platNomor}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="text-lg">👤</span>
                            <span className="font-semibold">{pickup.driverNama}</span>
                          </p>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <a
                            href={`tel:${pickup.driverNoHp}`}
                            className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                          >
                            <Phone size={12} /> Telepon
                          </a>
                          <a
                            href={`https://wa.me/62${pickup.driverNoHp.slice(1)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2 bg-emerald-600 text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                          >
                            <MessageCircle size={12} /> WhatsApp
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pembayaran Info — when selesai */}
                  {pj.status === 'selesai' && pembayaran && (
                    <div className="px-4 pb-3">
                      <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">💰 Pembayaran</p>
                          <StatusBadge status={pembayaran.status} size="sm" />
                        </div>
                        {pembayaran.totalBayar > 0 && (
                          <p className="text-xl font-bold text-emerald-700 mb-1">{formatRupiah(pembayaran.totalBayar)}</p>
                        )}
                        <div className="flex items-center justify-between text-[10px] text-gray-500">
                          <span>{pembayaran.nomorInvoice}</span>
                          <span>{pembayaran.metodeBayar === 'TDF' ? 'Transfer Bank' : 'Tunai'}</span>
                        </div>
                        {pembayaran.status === 'dibayar' && (
                          <div className="flex gap-2 mt-3">
                            <button className="flex-1 py-2 bg-white border border-emerald-200 text-emerald-700 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5">
                              <FileText size={12} /> Invoice
                            </button>
                             <button 
                               onClick={() => {
                                 setPembayaranForBukti(pembayaran);
                                 setShowBukti(pembayaran.buktiTransfer || `BJB-${Date.now().toString().slice(-8)}`);
                               }}
                               className="flex-1 py-2 bg-white border border-emerald-200 text-emerald-700 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                             >
                               <Download size={12} /> Bukti Transfer
                             </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Catatan Admin */}
                  {pj.catatanAdmin && (
                    <div className="px-4 pb-3">
                      <div className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-xl p-3 flex gap-2">
                        <AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-[10px] text-amber-600 uppercase tracking-wider mb-0.5">Catatan Admin</p>
                          <p>{pj.catatanAdmin}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Footer Action */}
                  <div className="px-4 pb-4">
                    <button
                      onClick={() => navigate(`/petani/jual-panen/${pj.id}`)}
                      className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
                    >
                      Lihat Detail Lengkap <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-gray-200 mt-2">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock size={32} className="text-gray-200" />
            </div>
            <h3 className="font-bold text-gray-800">Belum ada pengajuan</h3>
            <p className="text-xs text-gray-400 mt-1">
              {filter === 'ditolak'
                ? 'Tidak ada pengajuan yang ditolak'
                : filter === 'selesai'
                ? 'Belum ada transaksi selesai'
                : 'Yuk ajukan penjualan panen pertama Anda! 🌱'}
            </p>
            {filter !== 'semua' && (
              <button onClick={() => setFilter('semua')} className="mt-3 text-xs text-primary-600 font-bold">
                Lihat Semua Pengajuan
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bukti Transfer Modal for Farmer */}
      {showBukti && pembayaranForBukti && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => { setShowBukti(null); setPembayaranForBukti(null); }}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4 border-b pb-2">
              <h3 className="font-bold text-gray-800 text-lg">Bukti Transfer</h3>
              <button onClick={() => { setShowBukti(null); setPembayaranForBukti(null); }} className="p-1.5 hover:bg-gray-100 rounded-xl"><X size={16} /></button>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-4 text-center space-y-1.5 shadow-sm">
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Transfer Berhasil</p>
              <p className="text-2xl font-bold text-gray-800">{formatRupiah(pembayaranForBukti.totalBayar || 0)}</p>
              <div className="text-xs text-gray-500 text-left space-y-1 border-t pt-3 mt-3">
                <p><span className="text-gray-400">Pengirim:</span> BUMD AGRO JABAR</p>
                <p><span className="text-gray-400">Penerima:</span> {currentUser?.nama || 'Petani'}</p>
                <p><span className="text-gray-400">Bank:</span> Bank BJB</p>
                <p><span className="text-gray-400">Nomor Referensi:</span> {showBukti}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JualPanenPage;
