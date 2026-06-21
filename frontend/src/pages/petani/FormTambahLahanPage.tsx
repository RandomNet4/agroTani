// =====================================================
// FORM TAMBAH LAHAN - PETANI
// =====================================================

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Upload, Info, CheckCircle2, X } from 'lucide-react';
import { useData } from '../../context/DataContext';

const FormTambahLahanPage: React.FC = () => {
  const navigate = useNavigate();
  const { addLahan, currentUser } = useData();
  const [showSuccess, setShowSuccess] = useState(false);

  // File Upload State
  const lahanFileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedLahanPhoto, setUploadedLahanPhoto] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    namaLahan: '',
    luas: '',
    jenis: 'sawah',
    alamat: '',
    kabupaten: 'Cianjur',
    kecamatan: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file terlalu besar! Maksimal 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedLahanPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = `LHN${Date.now()}`;
    const success = await addLahan({
      id,
      petaniId: currentUser?.id || '',
      namaLahan: formData.namaLahan,
      latitude: -6.8 + (Math.random() * 0.1 - 0.05),
      longitude: 107.6 + (Math.random() * 0.1 - 0.05),
      alamat: formData.alamat,
      luasHektar: parseFloat(formData.luas),
      jenisLahan: formData.jenis,
      kecamatan: formData.kecamatan,
      kabupaten: formData.kabupaten,
      fotoLahan: uploadedLahanPhoto || (formData.jenis === 'sawah' ? '🌾' : '🥬')
    });
    if (success) {
      setShowSuccess(true);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mb-6 text-primary-600 animate-bounce">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Pengajuan Terkirim!</h2>
        <p className="text-gray-500 mb-8 text-sm leading-relaxed">
          Lahan Anda berhasil didaftarkan. Tim Agro Jabar akan melakukan <b>verifikasi data & survey lapangan</b> sebelum status lahan menjadi <b>Terverifikasi</b>.
        </p>
        <button
          onClick={() => navigate('/petani/data-lahan')}
          className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold shadow-lg shadow-primary-200 transition-all active:scale-95"
        >
          Kembali ke Data Lahan
        </button>
      </div>
    );
  }

  return (
    <div className="pb-10 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-primary-700 to-primary-600 text-white px-4 pt-12 pb-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-display font-bold text-lg">Tambah Lahan Baru</h1>
        </div>
        <p className="text-primary-100 text-xs ml-11">Daftarkan aset lahan Anda</p>
      </div>

      <div className="px-4 -mt-4">
        {/* Verification Alert */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3 mb-4 shadow-sm">
          <Info className="text-amber-500 shrink-0" size={20} />
          <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
            <b>Penting:</b> Lahan yang didaftarkan tidak akan langsung aktif. Tim Agro Jabar akan melakukan pengecekan dokumen kepemilikan dan survey lokasi untuk memastikan keaslian data.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="card space-y-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Nama Lahan</label>
              <input
                required
                type="text"
                placeholder="Misal: Sawah Blok Selatan"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all"
                value={formData.namaLahan}
                onChange={(e) => setFormData({...formData, namaLahan: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Luas (Hektar)</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all"
                  value={formData.luas}
                  onChange={(e) => setFormData({...formData, luas: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Jenis Lahan</label>
                <select
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all"
                  value={formData.jenis}
                  onChange={(e) => setFormData({...formData, jenis: e.target.value})}
                >
                  <option value="sawah">Sawah</option>
                  <option value="kebun">Kebun</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card space-y-4">
            <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2">
              <MapPin size={16} className="text-primary-600" />
              Lokasi Lahan
            </h3>
            
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Alamat Lengkap</label>
              <textarea
                required
                rows={3}
                placeholder="Jl. Raya, Desa, RT/RW..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all"
                value={formData.alamat}
                onChange={(e) => setFormData({...formData, alamat: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Kabupaten</label>
                <input
                  disabled
                  type="text"
                  className="w-full px-4 py-3 bg-gray-200 border border-gray-100 rounded-xl text-sm text-gray-500"
                  value={formData.kabupaten}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Kecamatan</label>
                <input
                  required
                  type="text"
                  placeholder="Kecamatan"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all"
                  value={formData.kecamatan}
                  onChange={(e) => setFormData({...formData, kecamatan: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="card space-y-4">
            <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2">
              <Upload size={16} className="text-primary-600" />
              Bukti Kepemilikan (Opsional)
            </h3>
            
            <input 
              type="file" 
              ref={lahanFileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />

            {uploadedLahanPhoto ? (
              <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white p-2">
                <img src={uploadedLahanPhoto} alt="Bukti Kepemilikan" className="w-full h-40 object-cover rounded-xl" />
                <button 
                  type="button"
                  onClick={() => setUploadedLahanPhoto(null)}
                  className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors shadow-md"
                >
                  <X size={16} />
                </button>
                <div className="p-2 text-center">
                  <button 
                    type="button"
                    onClick={() => lahanFileInputRef.current?.click()}
                    className="text-xs text-primary-600 font-bold hover:text-primary-700 transition-colors"
                  >
                    Ubah Bukti / Foto
                  </button>
                </div>
              </div>
            ) : (
              <div 
                onClick={() => lahanFileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-primary-300 transition-colors cursor-pointer bg-gray-50"
              >
                <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                <p className="text-xs text-gray-500 font-medium">Unggah SPPT / Sertifikat / Bukti Sewa</p>
                <p className="text-[10px] text-gray-400 mt-1">Format: JPG, PNG, PDF (Maks 5MB)</p>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold shadow-lg shadow-primary-200 transition-all active:scale-95"
          >
            Ajukan Pendaftaran Lahan
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormTambahLahanPage;
