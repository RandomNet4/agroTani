// =====================================================
// FORM JADWALKAN POLA TANAM - PETANI
// =====================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Info, CheckCircle2, Leaf, Clock } from 'lucide-react';
import { useData } from '../../context/DataContext';

const FormTambahTanamanPage: React.FC = () => {
  const { lahan: dummyLahan, komoditas: dummyKomoditas, addTanaman, currentUser } = useData();
  const navigate = useNavigate();
  const petaniId = currentUser?.id || '';
  const [showSuccess, setShowSuccess] = useState(false);

  // Filter approved land only
  const lahanTersedia = dummyLahan.filter(l => l.petaniId === petaniId && l.statusVerifikasi === 'approved');

  const [formData, setFormData] = useState({
    lahanId: '',
    komoditasId: '',
    tanggalTanam: new Date().toISOString().split('T')[0],
    estimasiHasil: '',
    catatan: '',
    luasLahanDigunakan: '',
    jarakTanam: '',
  });

  const [estimasiPanen, setEstimasiPanen] = useState('');

  const selectedLahan = dummyLahan.find(l => l.id === formData.lahanId);
  const luasMaxM2 = selectedLahan ? selectedLahan.luasHektar * 10000 : 0;

  // Calculate kebutuhanBibit:
  // kebutuhanBibit = (luasLahanDigunakan (m²) * 10000) / (jarakTanam (cm) * jarakTanam (cm))
  const luasNum = parseFloat(formData.luasLahanDigunakan) || 0;
  const jarakNum = parseFloat(formData.jarakTanam) || 0;
  const kebutuhanBibit = (luasNum > 0 && jarakNum > 0)
    ? Math.round((luasNum * 10000) / (jarakNum * jarakNum))
    : 0;

  const handleDataChange = (field: string, value: string) => {
    if (field === 'luasLahanDigunakan') {
      const valNum = parseFloat(value);
      if (selectedLahan && valNum > (selectedLahan.luasHektar * 10000)) {
        alert(`Luas lahan yang digunakan tidak boleh melebihi total luas lahan (${(selectedLahan.luasHektar * 10000).toLocaleString()} m²)`);
        return;
      }
    }
    const newData = { ...formData, [field]: value };
    setFormData(newData);

    if (field === 'komoditasId' || field === 'tanggalTanam') {
      const kId = field === 'komoditasId' ? value : formData.komoditasId;
      const tTanam = field === 'tanggalTanam' ? value : formData.tanggalTanam;
      
      if (kId && tTanam) {
        const komoditas = dummyKomoditas.find(k => k.id === kId);
        if (komoditas && komoditas.umurPanenHari) {
          const date = new Date(tTanam);
          date.setDate(date.getDate() + komoditas.umurPanenHari);
          
          setEstimasiPanen(date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }));
        } else {
          setEstimasiPanen('');
        }
      } else {
        setEstimasiPanen('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const komoditas = dummyKomoditas.find(k => k.id === formData.komoditasId);
    
    // Check used land size bounds (in m²)
    if (selectedLahan && luasNum > (selectedLahan.luasHektar * 10000)) {
      alert(`Luas lahan terpakai (${luasNum.toLocaleString()} m²) melebihi luas total lahan (${(selectedLahan.luasHektar * 10000).toLocaleString()} m²).`);
      return;
    }

    // Calculate estimasiPanen date (YYYY-MM-DD)
    const tTanam = new Date(formData.tanggalTanam);
    const days = komoditas?.umurPanenHari || 90;
    tTanam.setDate(tTanam.getDate() + days);
    const estPanenStr = tTanam.toISOString().split('T')[0];

    const id = `TAN${Date.now()}`;
    const success = await addTanaman({
      id,
      petaniId,
      lahanId: formData.lahanId,
      komoditasId: formData.komoditasId,
      komoditasNama: komoditas?.nama || 'Tanaman',
      tanggalTanam: formData.tanggalTanam,
      estimasiPanen: estPanenStr,
      estimasiHasilKg: parseFloat(formData.estimasiHasil),
      fotoTanaman: komoditas?.gambar || '🌱',
      catatan: formData.catatan,
      luasLahanDigunakan: luasNum,
      jarakTanam: jarakNum,
      kebutuhanBibit: kebutuhanBibit,
    });
    if (success) {
      setShowSuccess(true);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 text-emerald-600 animate-bounce">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Jadwal Tercatat!</h2>
        <p className="text-gray-500 mb-8 text-sm leading-relaxed">
          Pola tanam Anda telah masuk ke sistem. <br/> 
          <b>Status: Menunggu Verifikasi.</b> <br/>
          Jadwal ini akan membantu Anda mengontrol panen bulanan dan menghindari oversuplai.
        </p>
        <button
          onClick={() => navigate('/petani/data-lahan')}
          className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 transition-all active:scale-95"
        >
          Kembali ke Data Lahan
        </button>
      </div>
    );
  }

  return (
    <div className="pb-10 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-emerald-700 to-emerald-600 text-white px-4 pt-12 pb-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-display font-bold text-lg">Jadwalkan Pola Tanam</h1>
        </div>
        <p className="text-emerald-100 text-xs ml-11">Atur jadwal tanam untuk menjaga panen rutin</p>
      </div>

      <div className="px-4 -mt-4">
        {/* Info */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3 mb-4 shadow-sm">
          <Info className="text-blue-500 shrink-0" size={20} />
          <p className="text-[11px] text-blue-800 leading-relaxed font-medium">
            Sistem kami merekomendasikan penjadwalan pola tanam berkelanjutan (misal setiap bulan) agar Anda dapat panen teratur tanpa membanjiri pasar.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="card space-y-4">
            <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2">
              <Leaf size={16} className="text-emerald-600" />
              Pilih Lahan & Komoditas
            </h3>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Pilih Lahan</label>
              <select
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all"
                value={formData.lahanId}
                onChange={(e) => handleDataChange('lahanId', e.target.value)}
              >
                <option value="">-- Pilih Lahan Terverifikasi --</option>
                {lahanTersedia.map(l => (
                  <option key={l.id} value={l.id}>{l.namaLahan} ({l.luasHektar} Ha)</option>
                ))}
              </select>
              {lahanTersedia.length === 0 && (
                <p className="text-[10px] text-red-500 mt-1 font-medium">* Belum ada lahan yang terverifikasi</p>
              )}
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Komoditas</label>
              <select
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all"
                value={formData.komoditasId}
                onChange={(e) => handleDataChange('komoditasId', e.target.value)}
              >
                <option value="">-- Pilih Komoditas --</option>
                {dummyKomoditas.map(k => (
                  <option key={k.id} value={k.id}>{k.nama}</option>
                ))}
              </select>
            </div>
            
            {/* Tampilkan Info Komoditas jika terpilih */}
            {formData.komoditasId && (
              <div className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-100 flex gap-3">
                <span className="text-2xl">{dummyKomoditas.find(k => k.id === formData.komoditasId)?.gambar}</span>
                <div>
                  <p className="text-xs font-bold text-emerald-800">{dummyKomoditas.find(k => k.id === formData.komoditasId)?.nama}</p>
                  <p className="text-[10px] text-emerald-600 mt-0.5">{dummyKomoditas.find(k => k.id === formData.komoditasId)?.deskripsi}</p>
                  <p className="text-[10px] text-emerald-700 font-medium mt-1">Umur Panen: {dummyKomoditas.find(k => k.id === formData.komoditasId)?.umurPanenHari} Hari</p>
                </div>
              </div>
            )}
          </div>

          <div className="card space-y-4">
            <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2">
              <Calendar size={16} className="text-emerald-600" />
              Rencana Tanam
            </h3>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Tanggal Rencana Tanam</label>
              <input
                required
                type="date"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all"
                value={formData.tanggalTanam}
                onChange={(e) => handleDataChange('tanggalTanam', e.target.value)}
              />
            </div>
            
            {/* Auto-calculated Estimasi Panen */}
            {estimasiPanen && (
              <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <Clock size={16} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-[10px] text-amber-600 font-bold uppercase">Estimasi Panen Otomatis</p>
                  <p className="text-xs font-bold text-amber-800">{estimasiPanen}</p>
                </div>
              </div>
            )}

            {/* Luas Lahan yang Digunakan */}
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Luas Lahan yang Digunakan (Meter Persegi / m²) <span className="text-red-500">*</span></label>
              <input
                required
                type="number"
                step="1"
                min="1"
                max={luasMaxM2 || undefined}
                placeholder={selectedLahan ? `Maksimal ${(selectedLahan.luasHektar * 10000).toLocaleString()} m²` : "Masukkan luas lahan terpakai (m²)"}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all"
                value={formData.luasLahanDigunakan}
                onChange={(e) => handleDataChange('luasLahanDigunakan', e.target.value)}
              />
              {selectedLahan && (
                <p className="text-[10px] text-gray-400 mt-1">Total Luas Lahan Tersedia: <span className="font-semibold">{(selectedLahan.luasHektar * 10000).toLocaleString()} m²</span> ({selectedLahan.luasHektar} Ha)</p>
              )}
            </div>

            {/* Jarak Tanam */}
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Jarak Tanam (cm) <span className="text-red-500">*</span></label>
              <input
                required
                type="number"
                step="1"
                min="1"
                placeholder="Contoh: 20"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all"
                value={formData.jarakTanam}
                onChange={(e) => handleDataChange('jarakTanam', e.target.value)}
              />
              <p className="text-[10px] text-gray-400 mt-1">Petunjuk: Masukkan jarak tanam dalam centimeter (misal 20 cm untuk penanaman berjarak 20cm x 20cm).</p>
            </div>

            {/* Kebutuhan Bibit (Hasil Perhitungan) */}
            {kebutuhanBibit > 0 && (
              <div className="bg-emerald-50 rounded-xl p-3.5 border border-emerald-100 flex items-center justify-between animate-fade-in">
                <div>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase">Estimasi Kebutuhan Bibit</p>
                  <p className="text-lg font-bold text-emerald-800">{kebutuhanBibit.toLocaleString()} <span className="text-xs font-medium font-sans">Bibit (Pcs)</span></p>
                </div>
                <div className="text-[10px] text-emerald-600 font-medium text-right leading-tight max-w-[200px]">
                  Kalkulasi: (Luas Terpakai m² x 10.000) / (Jarak Tanam cm)²
                </div>
              </div>
            )}

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Jumlah Tanam / Estimasi Hasil (Kg)</label>
              <input
                required
                type="number"
                placeholder="Misal: 1500"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all"
                value={formData.estimasiHasil}
                onChange={(e) => handleDataChange('estimasiHasil', e.target.value)}
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Catatan Proses Tanaman (Opsional)</label>
              <textarea
                placeholder="Misal: Pemberian pupuk awal menggunakan kompos, pembersihan gulma terjadwal..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all resize-none shadow-sm"
                rows={3}
                value={formData.catatan}
                onChange={(e) => handleDataChange('catatan', e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={lahanTersedia.length === 0}
            className={`w-full py-4 ${lahanTersedia.length === 0 ? 'bg-gray-300' : 'bg-emerald-600 shadow-lg shadow-emerald-200'} text-white rounded-2xl font-bold transition-all active:scale-95`}
          >
            Simpan Jadwal Pola Tanam
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormTambahTanamanPage;
