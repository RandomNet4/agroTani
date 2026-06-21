// =====================================================
// DETAIL PENGAJUAN JUAL PANEN - PETANI
// =====================================================

import React, { useState } from 'react';
import {
  ArrowLeft, CheckCircle2, Circle, MapPin, Calendar, Wallet,
  Truck, Phone, MessageCircle, AlertCircle, FileText, Download,
  Scale, TrendingUp, Leaf, Clock, X
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import StatusBadge from '../../components/StatusBadge';
import {
  formatTanggal, formatRupiah
} from '../../data/dummy';
import { useData } from '../../context/DataContext';

const JualPanenDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { 
    pengajuanJual, 
    pickup: allPickup, 
    pembayaran: allPembayaran, 
    komoditas: allKomoditas, 
    tanamanAktif: allTanaman, 
    lahan: allLahan,
    qualityControl: allQualityControl,
    currentUser,
    updatePickupStatus,
    refreshData
  } = useData();

  React.useEffect(() => {
    refreshData();
    const interval = setInterval(() => {
      refreshData();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const [isConfirming, setIsConfirming] = useState(false);
  const [beratTimbang, setBeratTimbang] = useState('');
  const [submittingPickup, setSubmittingPickup] = useState(false);
  const [showBukti, setShowBukti] = useState<string | null>(null);

  const handleConfirmSelesai = async () => {
    if (!beratTimbang || isNaN(Number(beratTimbang)) || Number(beratTimbang) <= 0) {
      alert('Masukkan berat timbang yang valid (lebih dari 0)!');
      return;
    }
    if (!pickup) return;

    setSubmittingPickup(true);
    try {
      const success = await updatePickupStatus(pickup.id, {
        status: 'selesai',
        beratTimbangKg: Number(beratTimbang),
        waktuSelesai: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      });
      if (success) {
        setIsConfirming(false);
      } else {
        alert('Gagal menyelesaikan penjemputan.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan.');
    } finally {
      setSubmittingPickup(false);
    }
  };

  const pengajuan = pengajuanJual.find(p => p.id === id);
  if (!pengajuan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="text-center">
          <p className="text-6xl mb-4">🔍</p>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Tidak Ditemukan</h2>
          <p className="text-sm text-gray-500 mb-6">Pengajuan dengan ID ini tidak ada.</p>
          <button onClick={() => navigate('/petani/jual-panen')} className="btn-primary px-8 py-3">
            Kembali
          </button>
        </div>
      </div>
    );
  }

  const pickup = allPickup.find(p => p.pengajuanJualId === pengajuan.id);
  const pembayaran = pickup ? allPembayaran.find(p => p.pickupId === pickup.id) : null;
  const komoditas = allKomoditas.find(k => k.id === pengajuan.komoditasId);
  const tanaman = pengajuan.tanamanAktifId ? allTanaman.find(t => t.id === pengajuan.tanamanAktifId) : null;
  const lahan = pengajuan.lahanId ? allLahan.find(l => l.id === pengajuan.lahanId) : null;
  const estimasi = pengajuan.estimasiPendapatan || (pengajuan.beratEstimasiKg * (komoditas?.hargaSaatIni || 0));

  // Check if qualityControl has record for this pickup
  const hasQC = allQualityControl.some(qc => qc.pickupId === pickup?.id);

  // Status label bahasa manusia
  const getStatusInfo = (status: string, beratEstimasiKg: number, hasQC: boolean) => {
    if (status === 'proses_timbang' && hasQC) {
      return { 
        label: '💸 Menunggu Pembayaran', 
        desc: 'Penimbangan fisik selesai diverifikasi oleh petugas gudang. Pembayaran sedang diproses oleh admin.', 
        color: 'bg-emerald-50 border-emerald-200 text-emerald-800' 
      };
    }
    const info: Record<string, { label: string; desc: string; color: string }> = {
      'pending': { label: '⏳ Menunggu Review', desc: 'Admin Agro Jabar sedang memeriksa pengajuan Anda. Biasanya memakan waktu 1-2 hari kerja.', color: 'bg-amber-50 border-amber-200 text-amber-800' },
      'approved': { label: '✅ Disetujui', desc: 'Pengajuan disetujui! Admin sedang mengatur jadwal pickup ke lahan Anda.', color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
      'survey': { label: '🔎 Survei Lapangan', desc: 'Tim Agro Jabar akan melakukan survei ke lahan Anda untuk verifikasi data.', color: 'bg-blue-50 border-blue-200 text-blue-800' },
      'pickup_dijadwalkan': { 
        label: beratEstimasiKg < 300 ? '📦 Silakan Antar ke Gudang' : '🚗 Pickup Terjadwal', 
        desc: beratEstimasiKg < 300 
          ? 'Pengajuan disetujui! Karena berat di bawah 300kg, silakan antar hasil panen Anda langsung ke Gudang Agro Jabar.' 
          : 'Driver sudah dijadwalkan. Pastikan hasil panen siap saat hari pickup tiba.', 
        color: 'bg-blue-50 border-blue-200 text-blue-800' 
      },
      'proses_timbang': { label: '⚖️ Sedang Ditimbang', desc: 'Hasil panen sedang ditimbang oleh petugas gudang.', color: 'bg-indigo-50 border-indigo-200 text-indigo-800' },
      'selesai': { label: '✅ Selesai', desc: 'Transaksi selesai. Pembayaran akan/sudah diproses.', color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
      'rejected': { label: '❌ Ditolak', desc: 'Pengajuan tidak disetujui oleh admin.', color: 'bg-red-50 border-red-200 text-red-800' },
    };
    return info[status] || { label: status, desc: '', color: 'bg-gray-50 border-gray-200 text-gray-800' };
  };

  const statusInfo = getStatusInfo(pengajuan.status, pengajuan.beratEstimasiKg, hasQC);

  // Timeline steps
  const timelineSteps = [
    { key: 'pending', label: 'Pengajuan Dikirim', date: pengajuan.tanggalPengajuan, icon: '📋' },
    { key: 'approved', label: 'Disetujui Admin', date: pengajuan.status === 'pending' ? null : pengajuan.tanggalPengajuan, icon: '✅' },
    { 
      key: 'pickup_dijadwalkan', 
      label: pengajuan.beratEstimasiKg < 300 ? 'Pengiriman Mandiri' : 'Pickup Dijadwalkan', 
      date: pickup?.tanggalPickup || null, 
      icon: pengajuan.beratEstimasiKg < 300 ? '📦' : '🚗' 
    },
    { key: 'proses_timbang', label: 'Penimbangan', date: pickup?.waktuSelesai ? pengajuan.tanggalSiapPickup : null, icon: '⚖️' },
    { 
      key: 'proses_bayar', 
      label: 'Proses Pembayaran', 
      date: hasQC ? (pickup?.waktuSelesai || pengajuan.tanggalSiapPickup) : null, 
      icon: '💸' 
    },
    { key: 'selesai', label: 'Selesai & Dibayar', date: pembayaran?.tanggalBayar || null, icon: '💰' },
  ];

  const getTimelineStepStatus = (key: string) => {
    if (pengajuan.status === 'rejected') return 'upcoming';

    if (key === 'pending') {
      return pengajuan.status === 'pending' ? 'current' : 'completed';
    }
    if (key === 'approved') {
      if (pengajuan.status === 'pending') return 'upcoming';
      return pengajuan.status === 'approved' || pengajuan.status === 'survey' ? 'current' : 'completed';
    }
    if (key === 'pickup_dijadwalkan') {
      if (['pending', 'approved', 'survey'].includes(pengajuan.status)) return 'upcoming';
      return pengajuan.status === 'pickup_dijadwalkan' ? 'current' : 'completed';
    }
    if (key === 'proses_timbang') {
      if (['pending', 'approved', 'survey', 'pickup_dijadwalkan'].includes(pengajuan.status)) return 'upcoming';
      if (pengajuan.status === 'proses_timbang') {
        return hasQC ? 'completed' : 'current';
      }
      return 'completed';
    }
    if (key === 'proses_bayar') {
      if (pengajuan.status === 'selesai') return 'completed';
      if (pengajuan.status === 'proses_timbang' && hasQC) return 'current';
      return 'upcoming';
    }
    if (key === 'selesai') {
      return pengajuan.status === 'selesai' ? 'completed' : 'upcoming';
    }
    return 'upcoming';
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      {/* Header */}
      <div className="bg-gradient-to-b from-primary-700 to-primary-600 text-white px-5 pt-12 pb-6 rounded-b-[2rem] shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/petani/jual-panen')} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/20 transition-all active:scale-95">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-display font-bold text-lg">Detail Pengajuan</h1>
            <p className="text-primary-100 text-xs">#{pengajuan.id}</p>
          </div>
        </div>

        {/* Komoditas Hero */}
        <div className="bg-white/15 backdrop-blur rounded-2xl p-4 border border-white/20 flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl">
            {komoditas?.gambar || '🌾'}
          </div>
          <div>
            <h2 className="font-bold text-xl">{pengajuan.komoditasNama}</h2>
            <p className="text-primary-100 text-sm">{pengajuan.beratEstimasiKg.toLocaleString()} kg estimasi</p>
            {lahan && (
              <p className="text-primary-200 text-xs flex items-center gap-1 mt-0.5">
                <MapPin size={10} /> {lahan.namaLahan}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 -mt-3 space-y-4">
        {/* Status Card */}
        <div className={`rounded-2xl p-4 border ${statusInfo.color}`}>
          <p className="font-bold text-sm">{statusInfo.label}</p>
          <p className="text-xs mt-1 opacity-80">{statusInfo.desc}</p>
        </div>

        {/* Estimasi Pendapatan */}
        {estimasi > 0 && pengajuan.status !== 'rejected' && (
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1 mb-2">
              <Wallet size={12} className="text-emerald-500" /> Estimasi Pendapatan
            </p>
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
              <p className="text-2xl font-bold text-emerald-700">{formatRupiah(estimasi)}</p>
              <p className="text-xs text-emerald-600 mt-1">
                {pengajuan.beratEstimasiKg.toLocaleString()} kg × {formatRupiah(komoditas?.hargaSaatIni || 0)}/kg
              </p>
              <p className="text-[10px] text-emerald-500 mt-1 italic">*Harga acuan. Nilai final setelah penimbangan fisik</p>
            </div>
          </div>
        )}

        {/* Info Detail */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-3">Detail Pengajuan</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">Tanggal Ajukan</p>
              <p className="text-xs font-semibold text-gray-700 flex items-center gap-1"><Calendar size={11} className="text-primary-500" /> {formatTanggal(pengajuan.tanggalPengajuan)}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">Siap Pickup</p>
              <p className="text-xs font-semibold text-gray-700 flex items-center gap-1"><Calendar size={11} className="text-primary-500" /> {formatTanggal(pengajuan.tanggalSiapPickup)}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">Berat Estimasi</p>
              <p className="text-xs font-semibold text-gray-700 flex items-center gap-1"><Scale size={11} className="text-primary-500" /> {pengajuan.beratEstimasiKg.toLocaleString()} kg</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">Harga Acuan</p>
              <p className="text-xs font-semibold text-gray-700 flex items-center gap-1"><TrendingUp size={11} className="text-emerald-500" /> {formatRupiah(komoditas?.hargaSaatIni || 0)}/kg</p>
            </div>
          </div>

          {/* Data Tanaman Link */}
          {tanaman && (
            <div className="mt-3 bg-emerald-50/50 rounded-xl p-3 border border-emerald-100/50">
              <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                <Leaf size={10} /> Terhubung ke Data Tanaman
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xl">{tanaman.fotoTanaman}</span>
                <div>
                  <p className="text-xs font-semibold text-gray-700">{tanaman.komoditasNama}</p>
                  <p className="text-[10px] text-gray-500">Tanam: {formatTanggal(tanaman.tanggalTanam)} · Est. Hasil: {tanaman.estimasiHasilKg.toLocaleString()} kg</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Foto Kondisi Panen Card */}
        {pengajuan.fotoPanen && (pengajuan.fotoPanen.startsWith('data:image/') || pengajuan.fotoPanen.startsWith('http') || pengajuan.fotoPanen.includes('.') || pengajuan.fotoPanen.length > 50) && (
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-3">Foto Kondisi Panen</p>
            <div className="relative rounded-xl overflow-hidden border border-gray-100 bg-gray-50 aspect-video flex items-center justify-center">
              <img 
                src={pengajuan.fotoPanen.startsWith('data:image/') || pengajuan.fotoPanen.startsWith('http') || pengajuan.fotoPanen.includes('.') ? pengajuan.fotoPanen : `data:image/jpeg;base64,${pengajuan.fotoPanen}`} 
                alt="Foto Kondisi Panen" 
                className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-all duration-300"
                onClick={() => window.open(pengajuan.fotoPanen.startsWith('data:image/') || pengajuan.fotoPanen.startsWith('http') || pengajuan.fotoPanen.includes('.') ? pengajuan.fotoPanen : `data:image/jpeg;base64,${pengajuan.fotoPanen}`, '_blank')}
              />
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-2">Klik foto untuk melihat ukuran penuh</p>
          </div>
        )}

        {/* Info Driver — when pickup scheduled */}
        {pickup && (
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            {pickup.armada === 'Pengantaran Mandiri' ? (
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-3 flex items-center gap-1">
                  <MapPin size={12} className="text-teal-500" /> Informasi Pengantaran Mandiri
                </p>

                <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 text-teal-800 space-y-3 mb-4">
                  <p className="text-xs font-bold flex items-center gap-1.5 text-teal-700">
                    <CheckCircle2 size={16} /> Anda Mengirim Mandiri ke Gudang
                  </p>
                  <p className="text-xs leading-relaxed opacity-90">
                    Karena berat pengajuan jual panen Anda di bawah **300 kg**, penjemputan oleh armada Agro ditiadakan. Silakan antar hasil panen Anda langsung ke **Unit Gudang Utama Bandung Raya**.
                  </p>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                    <Calendar size={16} className="text-teal-600" />
                    <div>
                      <p className="text-[9px] text-gray-400 font-bold uppercase">Tanggal Pengantaran</p>
                      <p className="text-sm font-semibold text-gray-700">{formatTanggal(pickup.tanggalPickup)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                    <MapPin size={16} className="text-teal-600" />
                    <div>
                      <p className="text-[9px] text-gray-400 font-bold uppercase">Tujuan Pengiriman</p>
                      <p className="text-xs font-semibold text-gray-700">{pickup.alamatPickup}</p>
                    </div>
                  </div>
                </div>

                {pickup.status !== 'selesai' && (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-center bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-600">
                      Petugas gudang akan menimbang hasil panen Anda saat Anda sampai untuk menyelesaikan transaksi ini.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-3 flex items-center gap-1">
                  <Truck size={12} className="text-blue-500" /> Info Pickup
                </p>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                    <Calendar size={16} className="text-blue-500" />
                    <div>
                      <p className="text-[9px] text-gray-400 font-bold uppercase">Tanggal & Waktu</p>
                      <p className="text-sm font-semibold text-gray-700">{formatTanggal(pickup.tanggalPickup)}, {pickup.waktuBerangkat}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                    <Truck size={16} className="text-blue-500" />
                    <div>
                      <p className="text-[9px] text-gray-400 font-bold uppercase">Kendaraan</p>
                      <p className="text-sm font-semibold text-gray-700">{pickup.armada} — {pickup.platNomor}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                    <span className="text-2xl">👤</span>
                    <div>
                      <p className="text-[9px] text-gray-400 font-bold uppercase">Driver</p>
                      <p className="text-sm font-semibold text-gray-700">{pickup.driverNama}</p>
                      <p className="text-xs text-gray-500">{pickup.driverNoHp}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <a
                    href={`tel:${pickup.driverNoHp}`}
                    className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <Phone size={16} /> Telepon
                  </a>
                  <a
                    href={`https://wa.me/62${pickup.driverNoHp.slice(1)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <MessageCircle size={16} /> WhatsApp
                  </a>
                </div>

                {pickup.status !== 'selesai' && (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                    <p className="text-xs text-amber-600 font-semibold flex items-center gap-1">
                      <AlertCircle size={14} /> Hubungi driver untuk penimbangan atau konfirmasi selesai di bawah.
                    </p>
                    {isConfirming ? (
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-2">
                        <label className="block text-xs font-bold text-gray-700">Berat Timbang Aktual (kg)</label>
                        <div className="flex gap-2">
                          <input 
                            type="number"
                            className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                            placeholder="Contoh: 350"
                            value={beratTimbang}
                            onChange={(e) => setBeratTimbang(e.target.value)}
                          />
                          <button 
                            onClick={handleConfirmSelesai}
                            disabled={submittingPickup}
                            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                          >
                            {submittingPickup ? 'Proses...' : 'Kirim'}
                          </button>
                          <button 
                            onClick={() => setIsConfirming(false)}
                            className="px-3 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-semibold"
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setBeratTimbang(String(pengajuan.beratEstimasiKg));
                          setIsConfirming(true);
                        }}
                        className="w-full py-3 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
                      >
                        <CheckCircle2 size={16} /> Konfirmasi Selesai Penjemputan
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Pembayaran */}
        {pembayaran && (
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Wallet size={12} className="text-emerald-500" /> Pembayaran
              </p>
              <StatusBadge status={pembayaran.status} size="sm" />
            </div>

            {pembayaran.totalBayar > 0 && (
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 mb-3">
                <p className="text-2xl font-bold text-emerald-700">{formatRupiah(pembayaran.totalBayar)}</p>
                <p className="text-xs text-emerald-600 mt-1">
                  {pembayaran.beratKg > 0 ? `${pembayaran.beratKg.toLocaleString()} kg × ${formatRupiah(pembayaran.hargaPerKg)}/kg` : 'Belum ditimbang'}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-50 rounded-xl p-2.5">
                <p className="text-[9px] text-gray-400 font-bold">Invoice</p>
                <p className="font-semibold text-gray-700">{pembayaran.nomorInvoice}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-2.5">
                <p className="text-[9px] text-gray-400 font-bold">Metode</p>
                <p className="font-semibold text-gray-700">{pembayaran.metodeBayar === 'TDF' ? 'Transfer Bank' : 'Tunai'}</p>
              </div>
            </div>

            {pembayaran.status === 'dibayar' && (
              <div className="flex gap-2 mt-3">
                <button className="flex-1 py-2.5 bg-white border border-emerald-200 text-emerald-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5">
                  <FileText size={14} /> Lihat Invoice
                </button>
                <button 
                  onClick={() => setShowBukti(pembayaran.buktiTransfer || `BJB-${Date.now().toString().slice(-8)}`)}
                  className="flex-1 py-2.5 bg-white border border-emerald-200 text-emerald-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                >
                  <Download size={14} /> Bukti Transfer
                </button>
              </div>
            )}
          </div>
        )}

        {/* Timeline Progres */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-4 flex items-center gap-1">
            <Clock size={12} className="text-primary-500" /> Timeline Progres
          </p>

          <div className="space-y-0">
            {timelineSteps.map((step, idx) => {
              const status = getTimelineStepStatus(step.key);
              const isCompleted = status === 'completed';
              const isCurrent = status === 'current';
              const isLast = idx === timelineSteps.length - 1;

              return (
                <div key={step.key} className="flex gap-3">
                  {/* Line & Dot */}
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${
                      isCompleted ? 'bg-primary-600 text-white' :
                      isCurrent ? 'bg-primary-100 text-primary-600 ring-4 ring-primary-50' :
                      'bg-gray-100 text-gray-400'
                    }`}>
                      {isCompleted ? <CheckCircle2 size={16} /> : isCurrent ? <span>{step.icon}</span> : <Circle size={14} />}
                    </div>
                    {!isLast && (
                      <div className={`w-0.5 h-10 my-1 ${isCompleted ? 'bg-primary-600' : 'bg-gray-200'}`} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pb-6 pt-1">
                    <p className={`text-sm font-semibold ${isCompleted || isCurrent ? 'text-gray-800' : 'text-gray-400'}`}>
                      {step.label}
                    </p>
                    {step.date && (isCompleted || isCurrent) && (
                      <p className="text-[11px] text-gray-500 mt-0.5">{formatTanggal(step.date)}</p>
                    )}
                    {isCurrent && (
                      <span className="inline-block mt-1 text-[9px] bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-bold animate-pulse">
                        Tahap Saat Ini
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Catatan Petani */}
        {pengajuan.catatanPetani && (
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">📝 Catatan Anda</p>
            <p className="text-sm text-gray-700 leading-relaxed">{pengajuan.catatanPetani}</p>
          </div>
        )}

        {/* Catatan Admin */}
        {pengajuan.catatanAdmin && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <div className="flex gap-2">
              <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider mb-1">Catatan Admin</p>
                <p className="text-sm text-amber-800 leading-relaxed">{pengajuan.catatanAdmin}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bukti Transfer Modal for Farmer */}
      {showBukti && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowBukti(null)}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4 border-b pb-2">
              <h3 className="font-bold text-gray-800 text-lg">Bukti Transfer</h3>
              <button onClick={() => setShowBukti(null)} className="p-1.5 hover:bg-gray-100 rounded-xl"><X size={16} /></button>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-4 text-center space-y-1.5 shadow-sm">
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Transfer Berhasil</p>
              <p className="text-2xl font-bold text-gray-800">{formatRupiah(pembayaran?.totalBayar || 0)}</p>
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

export default JualPanenDetailPage;
