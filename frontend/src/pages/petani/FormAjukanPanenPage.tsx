// =====================================================
// FORM AJUKAN JUAL PANEN - PETANI (HYBRID)
// Bisa dari Tanaman Aktif atau Input Manual
// =====================================================

import React, { useState, useMemo, useRef } from 'react';
import { ArrowLeft, Upload, Calendar, Scale, CreditCard, Sprout, MapPin, TrendingUp, Wallet, Edit3, X, ChevronRight, CheckCircle2, Warehouse, AlertCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { formatRupiah, hitungHariMenuju } from '../../data/dummy';

const FormAjukanPanenPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { komoditas: dummyKomoditas, tanamanAktif: dummyTanamanAktif, lahan: dummyLahan, currentUser, addPengajuanJual } = useData();

  const petaniId = currentUser?.id || '';
  const petaniNama = currentUser?.nama || '';

  // Check if navigated from alert with a specific tanaman
  const preFillTanamanId = (location.state as any)?.tanamanId || null;

  // Tanaman aktif milik petani (approved only)
  const tanamanSaya = dummyTanamanAktif.filter(t => t.petaniId === petaniId && t.statusVerifikasi === 'approved');

  // Selected Source Type
  const [sourceType, setSourceType] = useState<'tanaman' | 'manual' | null>(preFillTanamanId ? 'tanaman' : null);
  const [selectedTanamanId, setSelectedTanamanId] = useState<string | null>(preFillTanamanId);
  const [manualData, setManualData] = useState({
    komoditasId: '',
    beratKg: '',
    lahanId: '',
  });

  // Main Form Data
  const [formData, setFormData] = useState({
    deliveryMethod: 'pickup' as 'pickup' | 'delivery',
    tanggalPickup: '',
    metodePembayaran: 'TDF' as 'TDF' | 'Cash',
    catatan: '',
  });

  // Modal / Page Selection State
  const [isModalOpen, setIsModalOpen] = useState(preFillTanamanId ? false : true);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'tanaman' | 'manual'>('tanaman');
  const [tempManual, setTempManual] = useState(manualData);

  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);

  // Address Selection State
  const [alamatPickup, setAlamatPickup] = useState<string>('');

  // Status States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [modalError, setModalError] = useState('');

  // Derived data
  const selectedTanaman = useMemo(() => {
    if (!selectedTanamanId) return null;
    return tanamanSaya.find(t => t.id === selectedTanamanId) || null;
  }, [selectedTanamanId, tanamanSaya]);

  const currentKomoditasId = sourceType === 'tanaman' ? selectedTanaman?.komoditasId : manualData.komoditasId;
  const currentKomoditas = dummyKomoditas.find(k => k.id === currentKomoditasId);
  const currentBerat = sourceType === 'tanaman' ? (selectedTanaman?.estimasiHasilKg || 0) : Number(manualData.beratKg) || 0;
  const currentLahanId = sourceType === 'tanaman' ? selectedTanaman?.lahanId : manualData.lahanId;
  const currentLahan = dummyLahan.find(l => l.id === currentLahanId);
  const lahanSaya = useMemo(() => dummyLahan.filter(l => l.petaniId === petaniId), [dummyLahan, petaniId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file terlalu besar! Maksimal 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const estimasiPendapatan = currentBerat * (currentKomoditas?.hargaSaatIni || 0);

  const homeAddr = useMemo(() => {
    if (!currentUser) return '';
    return [
      currentUser.alamat,
      currentUser.kecamatan,
      currentUser.kabupaten,
      currentUser.provinsi
    ].filter(Boolean).join(', ');
  }, [currentUser]);

  // Set default address when land or user profile changes
  React.useEffect(() => {
    if (currentLahan) {
      setAlamatPickup(currentLahan.lokasi.alamat || `${currentLahan.kecamatan}, ${currentLahan.kabupaten}`);
    } else if (homeAddr) {
      setAlamatPickup(homeAddr);
    }
  }, [currentLahan, homeAddr]);

  React.useEffect(() => {
    if (currentBerat > 0 && currentBerat < 300) {
      setFormData(prev => ({ ...prev, deliveryMethod: 'delivery' }));
    }
  }, [currentBerat]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceType || (!selectedTanamanId && !manualData.komoditasId)) {
      setErrorMessage('Silakan pilih data komoditas/panen yang akan dijual terlebih dahulu!');
      setIsModalOpen(true);
      return;
    }
    if (!formData.tanggalPickup) {
      setErrorMessage('Silakan tentukan tanggal siap pengiriman/penjemputan!');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const randomId = 'PJB' + Date.now();
      const success = await addPengajuanJual({
        id: randomId,
        petaniId,
        petaniNama,
        komoditasId: currentKomoditasId,
        komoditasNama: currentKomoditas?.nama || '',
        beratEstimasiKg: currentBerat,
        tanggalSiapPickup: formData.tanggalPickup,
        fotoPanen: uploadedPhoto || selectedTanaman?.fotoTanaman || currentKomoditas?.gambar || '🌾',
        tanamanAktifId: sourceType === 'tanaman' ? selectedTanamanId : null,
        lahanId: currentLahanId || null,
        lahanNama: alamatPickup || currentLahan?.namaLahan || 'Lahan Manual',
        hargaAcuanKg: currentKomoditas?.hargaSaatIni || null,
        estimasiPendapatan: estimasiPendapatan,
        catatanPetani: formData.catatan || '',
        metodePembayaran: formData.metodePembayaran,
      });

      if (success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          navigate('/petani/jual-panen');
        }, 1500);
      } else {
        setErrorMessage('Gagal mengirimkan pengajuan penjualan. Silakan coba lagi.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Terjadi kesalahan saat menghubungi server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveManual = () => {
    if (!tempManual.komoditasId || !tempManual.beratKg) {
      setModalError('Harap lengkapi komoditas dan berat panen!');
      return;
    }
    setModalError('');
    setManualData(tempManual);
    setSourceType('manual');
    setIsModalOpen(false);
  };

  return (
    <div className="pb-10 bg-gray-50 min-h-screen relative">
      {/* Header Form */}
      <div className="bg-gradient-to-br from-primary-700 to-primary-600 text-white px-5 pt-12 pb-8 rounded-b-3xl shadow-lg sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/20 transition-all active:scale-95">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-display font-bold text-xl">Ajukan Jual Panen</h1>
            <p className="text-primary-100 text-xs mt-0.5">Isi data komoditas dan lokasi</p>
          </div>
        </div>
      </div>

      <div className="px-5 mt-4 space-y-4">
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-xl flex items-center justify-between gap-2 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
              <p className="font-medium">{errorMessage}</p>
            </div>
            <button type="button" onClick={() => setErrorMessage('')} className="font-bold text-red-900 hover:text-red-700">✕</button>
          </div>
        )}

        {/* === SECTION METODE LOGISTIK (Atas) === */}
        <div className="card space-y-3">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Metode Pengiriman</label>
          <div className="flex bg-gray-100/70 p-1.5 rounded-xl gap-1">
            <button 
              disabled={currentBerat > 0 && currentBerat < 300}
              type="button"
              onClick={() => setFormData({ ...formData, deliveryMethod: 'pickup' })}
              className={`flex-1 py-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed ${
                formData.deliveryMethod === 'pickup' 
                  ? 'bg-white text-primary-600 shadow-sm border border-gray-100' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <MapPin size={14} />
              Di Jemput
            </button>
            <button 
              type="button"
              onClick={() => setFormData({ ...formData, deliveryMethod: 'delivery' })}
              className={`flex-1 py-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                formData.deliveryMethod === 'delivery' 
                  ? 'bg-white text-emerald-600 shadow-sm border border-gray-100' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Warehouse size={14} />
              Diantar ke Gudang
            </button>
          </div>

          {/* Warning info penjemputan */}
          {currentBerat > 0 && currentBerat < 300 && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-[11px] p-3 rounded-xl flex items-start gap-2 shadow-sm font-medium">
              <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
              <p>
                <b>Info Logistik:</b> Karena berat estimasi di bawah 300 kg ({currentBerat} kg), hasil panen wajib diantar sendiri ke gudang tujuan (penjemputan tidak tersedia).
              </p>
            </div>
          )}
          {currentBerat >= 300 && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-[11px] p-3 rounded-xl flex items-start gap-2 shadow-sm font-medium">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <p>
                <b>Fasilitas Penjemputan Aktif:</b> Berat estimasi mencapai/melebihi 300 kg ({currentBerat} kg). Anda dapat meminta bantuan penjemputan armada oleh BUMD.
              </p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Card: Pemilihan Komoditas/Tanaman */}
          <div className="card space-y-3">
            <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2">
              <Sprout size={16} className="text-emerald-600" />
              Data Komoditas
            </h3>

            {sourceType ? (
              // Tampilan setelah dipilih
              <div className="bg-white border-2 border-emerald-100 rounded-2xl p-4 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 bg-emerald-500 text-white rounded-bl-2xl px-3 py-1 text-[10px] font-bold">
                  {sourceType === 'tanaman' ? 'Dari Tanaman Aktif' : 'Input Manual'}
                </div>
                
                <div className="flex items-center gap-4 mt-3">
                  <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center text-3xl border border-gray-100 shadow-inner shrink-0">
                    {sourceType === 'tanaman' ? selectedTanaman?.fotoTanaman : currentKomoditas?.gambar}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-base mb-1">{currentKomoditas?.nama || 'Komoditas'}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Scale size={13} className="text-secondary-500" />
                      <span className="font-semibold">{currentBerat.toLocaleString()} kg</span>
                    </div>
                    {currentLahan && (
                      <p className="text-[10px] text-gray-400 mt-1.5 flex items-center gap-1">
                        <MapPin size={10} /> Lahan: {currentLahan.namaLahan}
                      </p>
                    )}
                  </div>
                </div>

                <button 
                  type="button" 
                  onClick={() => {
                    setTempManual(manualData);
                    setModalTab(sourceType || 'tanaman');
                    setIsModalOpen(true);
                  }} 
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 py-2.5 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors"
                >
                  <Edit3 size={14} />
                  Ubah Data Komoditas
                </button>
              </div>
            ) : (
              // Tombol untuk membuka pemilihan
              <button 
                type="button" 
                onClick={() => setIsModalOpen(true)} 
                className="w-full bg-white border-2 border-dashed border-primary-200 hover:bg-primary-50 hover:border-primary-400 text-primary-600 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <Sprout size={24} className="text-primary-600" />
                </div>
                <div className="text-center">
                  <span className="font-bold text-sm block mb-1">Pilih Data Panen</span>
                  <span className="text-[11px] text-gray-500 font-normal leading-relaxed">
                    Pilih komoditas dari daftar tanaman aktif atau input manual.
                  </span>
                </div>
              </button>
            )}

            {/* Harga Preview */}
            {currentKomoditas && sourceType && (
              <div className="bg-primary-50 rounded-xl p-3.5 border border-primary-100 flex items-center justify-between">
                 <div>
                   <p className="text-[10px] text-primary-600 font-bold uppercase tracking-wider flex items-center gap-1">
                     <TrendingUp size={12} /> Harga Beli Satuan
                   </p>
                   <p className="text-sm font-bold text-primary-700 mt-1">{formatRupiah(currentKomoditas.hargaSaatIni)}<span className="text-xs font-normal text-primary-500"> /kg</span></p>
                 </div>
                 {estimasiPendapatan > 0 && (
                   <div className="text-right pl-4 border-l border-primary-200">
                     <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider flex items-center justify-end gap-1">
                       <Wallet size={12} /> Total Estimasi
                     </p>
                     <p className="text-sm font-bold text-emerald-700 mt-1">{formatRupiah(estimasiPendapatan)}</p>
                   </div>
                 )}
              </div>
            )}
          </div>

          {/* === SECTION DETAIL LOKASI & WAKTU === */}
          <div className="card space-y-4">
            <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2">
              <MapPin size={16} className="text-primary-600" />
              Informasi Lokasi
            </h3>

            {formData.deliveryMethod === 'pickup' ? (
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 flex items-start gap-3">
                <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-600 shrink-0">
                  <MapPin size={18} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded font-bold uppercase tracking-wide">Alamat Pickup</span>
                    <p className="text-xs font-bold text-gray-800">Penjemputan</p>
                  </div>
                  <p className="text-[11px] text-gray-600 leading-relaxed mb-2">
                    {alamatPickup || 'Belum menentukan alamat penjemputan'}
                  </p>
                  <button 
                    type="button" 
                    onClick={() => setIsAddressModalOpen(true)}
                    className="text-[11px] font-semibold text-primary-600 hover:text-primary-700 underline underline-offset-2 flex items-center gap-1"
                  >
                    Ganti Alamat Penjemputan <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-500/10 p-2 rounded-lg text-blue-600 shrink-0">
                    <Warehouse size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-800 mb-1">Gudang Tujuan Pengiriman</p>
                    <p className="text-[11px] text-gray-600 leading-relaxed mb-3">
                      {currentUser?.gudangTujuanNama || 'Belum terkoneksi ke gudang logistik BUMD'}
                    </p>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => window.open('https://maps.google.com', '_blank')}
                  className="w-full bg-white text-blue-600 text-[11px] font-bold py-2.5 rounded-lg border border-blue-200 hover:bg-blue-50 flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <MapPin size={14} />
                  Lihat Alamat Gudang (Maps)
                </button>
              </div>
            )}

            <div className="w-full h-px bg-gray-100 my-2"></div>

            <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2">
              <Calendar size={16} className="text-primary-600" />
              Jadwal & Pembayaran
            </h3>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Tanggal Siap {formData.deliveryMethod === 'pickup' ? 'Pickup' : 'Kirim'}</label>
              <input
                type="date"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all shadow-sm"
                required
                value={formData.tanggalPickup}
                onChange={e => setFormData({ ...formData, tanggalPickup: e.target.value })}
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block flex items-center gap-1">
                <CreditCard size={12} /> Metode Pembayaran
              </label>
              <select
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all shadow-sm"
                required
                value={formData.metodePembayaran}
                onChange={e => setFormData({ ...formData, metodePembayaran: e.target.value as 'TDF' | 'Cash' })}
              >
                <option value="TDF">Transfer Bank (TDF)</option>
                <option value="Cash">Tunai (Cash)</option>
              </select>
            </div>
          </div>

          {/* === FOTO & CATATAN === */}
          <div className="card space-y-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block flex items-center gap-1">
                <Upload size={12} /> Foto Kondisi Panen
              </label>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />

              {uploadedPhoto ? (
                <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white p-2">
                  <img src={uploadedPhoto} alt="Preview Panen" className="w-full h-44 object-cover rounded-xl" />
                  <button 
                    type="button"
                    onClick={() => setUploadedPhoto(null)}
                    className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors shadow-md"
                  >
                    <X size={16} />
                  </button>
                  <div className="p-2 text-center">
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs text-primary-600 font-bold hover:text-primary-700 transition-colors"
                    >
                      Ubah Foto
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="group border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/50 bg-white transition-all shadow-sm"
                >
                  <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-primary-100 transition-colors">
                    <Upload className="text-gray-400 group-hover:text-primary-500" size={28} />
                  </div>
                  <p className="text-sm font-semibold text-gray-700">Ambil Foto atau Upload</p>
                  <p className="text-[10px] text-gray-400 mt-1">Sertakan foto detail komoditas (Format: JPG, PNG, Maks 5MB)</p>
                </div>
              )}
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Catatan (Opsional)</label>
              <textarea
                placeholder="Deskripsikan kondisi panen..."
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 shadow-sm"
                rows={3}
                value={formData.catatan}
                onChange={e => setFormData({ ...formData, catatan: e.target.value })}
              />
            </div>
          </div>

          {/* === ACTIONS === */}
          <div className="flex gap-3 pt-4 pb-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-4 bg-white border border-gray-200 text-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-4 bg-primary-600 disabled:bg-gray-400 text-white rounded-2xl font-bold text-sm shadow-xl shadow-primary-500/30 transition-all active:scale-95 hover:bg-primary-700 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Mengirimkan...
                </>
              ) : (
                'Ajukan Penjualan'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ==================================================== */}
      {/* FULL SCREEN MODAL: PEMILIHAN KOMODITAS PANEN */}
      {/* ==================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-gray-50 flex flex-col">
          {/* Header Modal */}
          <div className="bg-white px-5 pt-12 pb-4 border-b border-gray-100 shrink-0 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="font-display font-bold text-xl text-gray-900">Pilih Data Panen</h2>
                <p className="text-xs text-gray-500 mt-1">Pilih sumber panen Anda</p>
              </div>
              {sourceType && (
                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-100 rounded-full">
                  <X size={20} className="text-gray-500" />
                </button>
              )}
            </div>
            
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button 
                onClick={() => setModalTab('tanaman')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                  modalTab === 'tanaman' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500'
                }`}
              >
                Tanaman Aktif
              </button>
              <button 
                onClick={() => setModalTab('manual')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                  modalTab === 'manual' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500'
                }`}
              >
                Input Manual
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="flex-1 p-5 overflow-y-auto bg-gray-50">
            {modalTab === 'tanaman' ? (
              <div className="space-y-3">
                {tanamanSaya.map(t => {
                  const komoditas = dummyKomoditas.find(k => k.id === t.komoditasId);
                  const hari = hitungHariMenuju(t.estimasiPanen);
                  const isSelected = selectedTanamanId === t.id && sourceType === 'tanaman';

                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        setSelectedTanamanId(t.id);
                        setSourceType('tanaman');
                        setIsModalOpen(false);
                      }}
                      className={`w-full text-left rounded-2xl p-4 transition-all flex items-start gap-4 ${
                        isSelected ? 'bg-emerald-50 border-2 border-emerald-400' : 'bg-white border border-gray-200 hover:border-emerald-200'
                      }`}
                    >
                      <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center text-3xl shrink-0">
                        {t.fotoTanaman}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-gray-800 text-sm mb-1">{t.komoditasNama}</h4>
                          {isSelected && <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />}
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                           <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                             hari <= 0 ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                           }`}>
                             {hari <= 0 ? 'Siap Panen!' : `${hari} Hari Lagi`}
                           </span>
                           <span className="text-[11px] text-gray-500 font-medium">Est. {t.estimasiHasilKg.toLocaleString()} kg</span>
                        </div>
                        {komoditas && <p className="text-xs font-bold text-emerald-600">{formatRupiah(komoditas.hargaSaatIni)}/kg</p>}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-4">
                {modalError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-xl">
                    {modalError}
                  </div>
                )}
                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">Pilih Komoditas</label>
                  <select
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    value={tempManual.komoditasId}
                    onChange={e => setTempManual({ ...tempManual, komoditasId: e.target.value })}
                  >
                    <option value="">— Pilih Komoditas —</option>
                    {dummyKomoditas.map(k => (
                      <option key={k.id} value={k.id}>{k.gambar} {k.nama}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 block text-sm">Berat Panen (kg)</label>
                  <input
                    type="number"
                    placeholder="Masukkan berat panen"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    value={tempManual.beratKg}
                    onChange={e => setTempManual({ ...tempManual, beratKg: e.target.value })}
                  />
                </div>

                <div className="pt-2">
                  <button 
                    type="button"
                    onClick={handleSaveManual}
                    className="w-full py-4 bg-primary-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-primary-500/30"
                    disabled={!tempManual.komoditasId || !tempManual.beratKg}
                  >
                    Pilih Komoditas Ini
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* SUCCESS MODAL */}
      {/* ==================================================== */}
      {submitSuccess && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-5">
          <div className="bg-white rounded-3xl p-6 text-center max-w-sm w-full shadow-2xl">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-1">Pengajuan Berhasil!</h3>
            <p className="text-sm text-gray-500">Pengajuan penjualan panen berhasil dikirim dan sedang menunggu verifikasi admin.</p>
          </div>
        </div>
      )}
      {/* ==================================================== */}
      {/* MODAL: PILIH ALAMAT PENJEMPUTAN */}
      {/* ==================================================== */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl animate-slide-up">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-800 text-lg">Pilih Alamat Penjemputan</h3>
                <p className="text-[11px] text-gray-500">Pilih alamat terdaftar untuk penjemputan hasil panen</p>
              </div>
              <button 
                type="button"
                onClick={() => setIsAddressModalOpen(false)} 
                className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 max-h-[60vh] overflow-y-auto space-y-3">
              {/* Option 1: Alamat Rumah */}
              {homeAddr && (
                <button
                  type="button"
                  onClick={() => {
                    setAlamatPickup(homeAddr);
                    setIsAddressModalOpen(false);
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex gap-3 items-start ${
                    alamatPickup === homeAddr 
                      ? 'bg-blue-50 border-blue-400' 
                      : 'bg-white border-gray-100 hover:border-blue-200'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={16} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm text-gray-800">Alamat Rumah (Profil)</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{homeAddr}</p>
                  </div>
                </button>
              )}

              {/* Option 2: Daftar Lahan */}
              {lahanSaya.map((lahanItem) => {
                const landAddr = lahanItem.lokasi.alamat || `${lahanItem.kecamatan}, ${lahanItem.kabupaten}`;
                const isSelected = alamatPickup === landAddr;

                return (
                  <button
                    key={lahanItem.id}
                    type="button"
                    onClick={() => {
                      setAlamatPickup(landAddr);
                      setIsAddressModalOpen(false);
                    }}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex gap-3 items-start ${
                      isSelected 
                        ? 'bg-emerald-50 border-emerald-400' 
                        : 'bg-white border-gray-100 hover:border-emerald-200'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin size={16} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-gray-800">{lahanItem.namaLahan}</h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{landAddr}</p>
                      <span className="inline-block mt-2 text-[9px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium capitalize">
                        Lahan ({lahanItem.jenisLahan})
                      </span>
                    </div>
                  </button>
                );
              })}

              {lahanSaya.length === 0 && !homeAddr && (
                <p className="text-xs text-gray-400 text-center py-4">Belum ada alamat terdaftar.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormAjukanPanenPage;
