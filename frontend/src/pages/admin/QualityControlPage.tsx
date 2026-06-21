// =====================================================
// ADMIN: PENIMBANGAN GUDANG
// =====================================================

import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Scale, Plus, Save, FileText, AlertCircle } from 'lucide-react';
import { formatTanggal } from '../../data/adminDummy';

const QualityControlPage: React.FC = () => {
  const { 
    qualityControl: dummyQualityControl, 
    pickup: dummyPickup, 
    addQualityControl 
  } = useData();

  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form States
  const [selectedPickupId, setSelectedPickupId] = useState('');
  const [beratDiterima, setBeratDiterima] = useState('');
  const [catatan, setCatatan] = useState('');
  const [petugas, setPetugas] = useState('Petugas Timbang Gudang');

  // Auto-prefill weight when pickup is selected
  useEffect(() => {
    if (selectedPickupId) {
      const pickup = dummyPickup.find(p => p.id === selectedPickupId);
      if (pickup && pickup.beratTimbangKg) {
        setBeratDiterima(String(pickup.beratTimbangKg));
      } else {
        setBeratDiterima('');
      }
    } else {
      setBeratDiterima('');
    }
  }, [selectedPickupId, dummyPickup]);

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPickupId || !beratDiterima || isNaN(Number(beratDiterima)) || Number(beratDiterima) <= 0) {
      alert('Lengkapi form dengan data berat timbang yang valid!');
      return;
    }

    const selectedPickup = dummyPickup.find(p => p.id === selectedPickupId);
    if (!selectedPickup) {
      alert('Data pickup tidak ditemukan!');
      return;
    }

    setLoading(true);
    const qcId = `TB_${Date.now()}`;
    const success = await addQualityControl({
      id: qcId,
      pickupId: selectedPickupId,
      petaniNama: selectedPickup.petaniNama,
      komoditasNama: selectedPickup.komoditasNama,
      beratDiterimaKg: Number(beratDiterima),
      grade: 'A', // Hardcode default to meet prisma schema validation
      catatanKerusakan: catatan || 'Hasil panen telah ditimbang dan diterima di gudang',
      petugasQC: petugas,
      fotoQC: '',
    });
    setLoading(false);

    if (success) {
      alert('Data penimbangan berhasil disimpan!');
      setShowAdd(false);
      setSelectedPickupId('');
      setBeratDiterima('');
      setCatatan('');
      setPetugas('Petugas Timbang Gudang');
    } else {
      alert('Gagal menyimpan data penimbangan.');
    }
  };

  // Pickups ready for Weighing (pickup is 'selesai' and doesn't have weighing/QC record yet)
  const pickupsReadyForWeighing = dummyPickup.filter(
    p => p.status === 'selesai' && !dummyQualityControl.some(qc => qc.pickupId === p.id)
  );

  // All completed pickups representing the weighing history
  const weighingHistory = dummyPickup.filter(p => p.status === 'selesai');

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="page-title flex items-center gap-2"><Scale size={24} className="text-primary-600" /> Penimbangan Hasil Panen</h1>
          <p className="text-sm text-gray-500 mt-1">Pencatatan dan monitoring berat hasil panen komoditas di gudang utama</p>
        </div>
        <button 
          onClick={() => {
            setShowAdd(!showAdd);
            setSelectedPickupId('');
            setBeratDiterima('');
            setCatatan('');
          }} 
          className="btn-primary text-sm flex items-center gap-2"
        >
          <Plus size={16} /> Input Penimbangan Baru
        </button>
      </div>

      {/* Weighing Input Form Modal */}
      {showAdd && (
        <div className="card border-2 border-primary-200 animate-slide-up">
          <div className="flex items-center justify-between pb-3 border-b mb-4">
            <h3 className="section-title">Form Input Penimbangan</h3>
            <button 
              onClick={() => setShowAdd(false)} 
              className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="label-field">Pilih Pengiriman / Pickup (Selesai)</label>
                <select 
                  className="input-field" 
                  value={selectedPickupId} 
                  onChange={e => setSelectedPickupId(e.target.value)}
                  required
                >
                  <option value="">-- Pilih Data Masuk --</option>
                  {pickupsReadyForWeighing.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.id} — {p.petaniNama} ({p.komoditasNama} | {p.beratTimbangKg?.toLocaleString()} kg)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-field">Berat Diterima Gudang (kg)</label>
                <input 
                  type="number" 
                  step="any"
                  placeholder="Masukkan berat aktual di gudang" 
                  className="input-field font-semibold text-primary-700" 
                  value={beratDiterima}
                  onChange={e => setBeratDiterima(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="label-field">Petugas Penerima Timbang</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={petugas}
                  onChange={e => setPetugas(e.target.value)}
                  required
                />
              </div>
              <div className="md:col-span-3">
                <label className="label-field">Catatan Kondisi & Keterangan</label>
                <textarea 
                  placeholder="Deskripsi kondisi fisik komoditas, kebersihan, atau catatan khusus saat diterima." 
                  className="input-field" 
                  rows={3} 
                  value={catatan}
                  onChange={e => setCatatan(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-3 border-t">
              <button type="button" onClick={() => setShowAdd(false)} className="btn-secondary text-sm">Batal</button>
              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary text-sm flex items-center gap-1.5 disabled:opacity-50"
              >
                <Save size={14} /> {loading ? 'Menyimpan...' : 'Simpan Penimbangan'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* HISTORI PENIMBANGAN AWAL */}
      <div className="space-y-3">
        <h2 className="section-title flex items-center gap-2 text-slate-800">
          <Scale size={18} className="text-primary-600" /> Histori Penimbangan Penerimaan Gudang
        </h2>
        <p className="text-xs text-gray-500">
          Daftar penerimaan komoditas yang telah dikonfirmasi berat timbangnya dan status input data penimbangan akhir.
        </p>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-gray-600 font-semibold">
                  <th className="text-left px-5 py-3.5">ID Timbang</th>
                  <th className="text-left px-5 py-3.5">Nama Petani</th>
                  <th className="text-left px-5 py-3.5">Komoditas</th>
                  <th className="text-left px-5 py-3.5">Tanggal Masuk</th>
                  <th className="text-right px-5 py-3.5">Berat Timbang</th>
                  <th className="text-left px-5 py-3.5">Pengiriman</th>
                  <th className="text-center px-5 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody>
                {weighingHistory.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-400">
                      <AlertCircle className="mx-auto mb-2 text-gray-300" size={24} />
                      Belum ada data penimbangan panen yang dilakukan.
                    </td>
                  </tr>
                ) : (
                  weighingHistory.map(p => {
                    const qcRecord = dummyQualityControl.find(q => q.pickupId === p.id);
                    return (
                      <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                        <td className="px-5 py-3.5 font-mono text-xs font-bold text-gray-600">{p.id}</td>
                        <td className="px-5 py-3.5 font-medium text-gray-900">{p.petaniNama}</td>
                        <td className="px-5 py-3.5 font-semibold text-gray-800">{p.komoditasNama}</td>
                        <td className="px-5 py-3.5 text-xs text-gray-500">{formatTanggal(p.tanggalPickup)}</td>
                        <td className="px-5 py-3.5 text-right font-bold text-slate-800">
                          {p.beratTimbangKg?.toLocaleString('id-ID')} KG
                        </td>
                        <td className="px-5 py-3.5 text-xs">
                          {p.armada === 'Pengantaran Mandiri' ? (
                            <span className="text-teal-600 font-bold">Mandiri (Petani)</span>
                          ) : (
                            <span className="text-gray-600">{p.driverNama} ({p.armada})</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          {qcRecord ? (
                            <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                              Telah Ditimbang
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
                              Belum Ditimbang
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* WEIGHING HISTORY TABLE */}
      <div className="space-y-3">
        <h2 className="section-title flex items-center gap-2 text-slate-800">
          <FileText size={18} className="text-primary-600" /> Daftar Rekap Penimbangan Gudang
        </h2>
        <p className="text-xs text-gray-500">
          Rekap data penimbangan bersih, tanggal masuk, dan petugas penerima di gudang utama.
        </p>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-gray-600 font-semibold">
                  <th className="text-left px-5 py-3.5">ID Penimbangan</th>
                  <th className="text-left px-5 py-3.5">Nama Petani</th>
                  <th className="text-left px-5 py-3.5">Komoditas</th>
                  <th className="text-right px-5 py-3.5">Berat Bersih (KG)</th>
                  <th className="text-left px-5 py-3.5">Catatan Timbang/Kondisi</th>
                  <th className="text-left px-5 py-3.5">Tanggal Timbang</th>
                  <th className="text-left px-5 py-3.5">Petugas</th>
                </tr>
              </thead>
              <tbody>
                {dummyQualityControl.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-400">
                      <AlertCircle className="mx-auto mb-2 text-gray-300" size={24} />
                      Belum ada laporan penimbangan yang tercatat.
                    </td>
                  </tr>
                ) : (
                  dummyQualityControl.map(qc => (
                    <tr key={qc.id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-xs font-bold text-gray-500">{qc.id}</td>
                      <td className="px-5 py-3.5 font-medium text-gray-900">{qc.petaniNama}</td>
                      <td className="px-5 py-3.5 font-semibold text-gray-800">{qc.komoditasNama}</td>
                      <td className="px-5 py-3.5 text-right font-bold text-slate-800">
                        {qc.beratDiterimaKg.toLocaleString('id-ID')} KG
                      </td>
                      <td className="px-5 py-3.5 text-xs text-gray-600 max-w-xs truncate" title={qc.catatanKerusakan}>
                        {qc.catatanKerusakan}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-gray-500">{formatTanggal(qc.tanggalQC)}</td>
                      <td className="px-5 py-3.5 text-xs text-gray-700 font-medium">{qc.petugasQC}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualityControlPage;
