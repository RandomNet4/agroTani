import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Upload, AlertTriangle, CheckCircle2, X, Shield, RefreshCw } from 'lucide-react';
import { useData } from '../../context/DataContext';
import StatusBadge from '../../components/StatusBadge';

const FormInspeksiPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tanamanAktif: allTanaman, petani: allPetani, lahan: allLahan, inspectTanaman } = useData();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  // Geolocation states
  const [loadingGps, setLoadingGps] = useState(false);
  const [gpsError, setGpsError] = useState('');

  // Form states
  const [catatan, setCatatan] = useState('');
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [gpsData, setGpsData] = useState<{ lat: string; lng: string }>({ lat: '', lng: '' });

  // Temukan detail tanaman
  const crop = allTanaman.find((t) => t.id === id);
  const owner = crop ? allPetani.find((p) => p.id === crop.petaniId) : null;
  const land = crop ? allLahan.find((l) => l.id === crop.lahanId) : null;

  // Isi data jika tanaman sudah diinspeksi (read-only mode)
  useEffect(() => {
    if (crop) {
      if (crop.statusVerifikasi === 'approved' || crop.statusVerifikasi === 'rejected') {
        setCatatan(crop.catatanInspeksi || '');
        setUploadedPhoto(crop.fotoInspeksi || null);
        if (crop.gpsInspeksi) {
          setGpsData({
            lat: crop.gpsInspeksi.lat.toString(),
            lng: crop.gpsInspeksi.lng.toString(),
          });
        }
      }
    }
  }, [crop]);

  if (!crop) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
        <div>
          <AlertTriangle size={48} className="mx-auto text-amber-500 mb-3" />
          <h2 className="text-xl font-bold text-gray-800">Siklus Tanam Tidak Ditemukan</h2>
          <button onClick={() => navigate(-1)} className="mt-4 text-emerald-600 font-bold hover:underline">
            Kembali ke Daftar Inspeksi
          </button>
        </div>
      </div>
    );
  }

  const isReadOnly = crop.statusVerifikasi === 'approved' || crop.statusVerifikasi === 'rejected';

  // Handle get device GPS location
  const handleGetLocation = () => {
    setLoadingGps(true);
    setGpsError('');

    if (!navigator.geolocation) {
      setGpsError('Browser Anda tidak mendukung Geolocation.');
      setLoadingGps(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsData({
          lat: position.coords.latitude.toFixed(6),
          lng: position.coords.longitude.toFixed(6),
        });
        setLoadingGps(false);
      },
      (error) => {
        console.warn('Geolocation error, using simulated GPS coordinates instead:', error.message);
        // Fallback: Generate simulated coordinates near Lembang, Bandung Barat
        const simulatedLat = (-6.821 + (Math.random() * 0.01 - 0.005)).toFixed(6);
        const simulatedLng = (107.618 + (Math.random() * 0.01 - 0.005)).toFixed(6);
        setGpsData({ lat: simulatedLat, lng: simulatedLng });
        setGpsError('GPS Perangkat diblokir. Sistem mensimulasikan GPS lokasi lahan.');
        setLoadingGps(false);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  // Handle file change (inspeksi photo)
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

  // Handle submit verification
  const handleVerify = async (status: 'approved' | 'rejected') => {
    if (!catatan.trim()) {
      alert('Silakan tulis catatan inspeksi lapangan terlebih dahulu.');
      return;
    }
    if (!uploadedPhoto) {
      alert('Silakan unggah foto bukti fisik kondisi tanaman terlebih dahulu.');
      return;
    }
    if (!gpsData.lat || !gpsData.lng) {
      alert('Silakan ambil koordinat GPS lokasi lahan terlebih dahulu.');
      return;
    }

    const payload = {
      catatanInspeksi: catatan,
      fotoInspeksi: uploadedPhoto,
      statusVerifikasi: status,
      gpsInspeksi: {
        lat: parseFloat(gpsData.lat),
        lng: parseFloat(gpsData.lng),
      },
    };

    const success = await inspectTanaman(crop.id, payload);
    if (success) {
      setSuccessMsg(
        status === 'approved' 
          ? 'Inspeksi Berhasil Disetujui! Siklus tanaman kini berstatus terverifikasi dan siap untuk proses budidaya/penjualan.' 
          : 'Inspeksi Ditolak! Status siklus tanaman telah diperbarui menjadi rejected.'
      );
      setShowSuccess(true);
    } else {
      alert('Gagal mengirimkan hasil verifikasi lapangan.');
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 text-emerald-600 animate-bounce">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Inspeksi Terkirim!</h2>
        <p className="text-gray-500 mb-8 text-sm leading-relaxed max-w-sm mx-auto">
          {successMsg}
        </p>
        <button
          onClick={() => navigate('/petani/inspeksi')}
          className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 transition-all active:scale-95"
        >
          Kembali ke Daftar Inspeksi
        </button>
      </div>
    );
  }

  return (
    <div className="pb-10 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-emerald-800 to-emerald-700 text-white px-4 pt-12 pb-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-display font-bold text-lg">
            {isReadOnly ? 'Detail Hasil Inspeksi' : 'Form Inspeksi Lapangan'}
          </h1>
        </div>
        <p className="text-emerald-100 text-xs ml-11">Pemeriksaan fisik tanaman & verifikasi GPS</p>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {/* Info Siklus Card */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <span className="text-3xl leading-none">{crop.fotoTanaman || '🥕'}</span>
              <div>
                <h4 className="font-bold text-sm text-gray-800">{crop.komoditasNama}</h4>
                <p className="text-[10px] text-gray-400">Pemilik: <b>{owner?.nama}</b></p>
              </div>
            </div>
            <StatusBadge status={crop.statusVerifikasi} size="sm" />
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs pt-3 border-t border-gray-50">
            <div>
              <p className="text-[9px] text-gray-400 font-bold uppercase">Nama Lahan</p>
              <p className="font-semibold text-gray-700 mt-0.5">{land?.namaLahan}</p>
            </div>
            <div>
              <p className="text-[9px] text-gray-400 font-bold uppercase">Jenis Lahan</p>
              <p className="font-semibold text-gray-700 mt-0.5 capitalize">{land?.jenisLahan}</p>
            </div>
            <div>
              <p className="text-[9px] text-gray-400 font-bold uppercase">Luas Digunakan</p>
              <p className="font-semibold text-gray-700 mt-0.5">
                {crop.luasLahanDigunakan ? `${crop.luasLahanDigunakan} m²` : '-'}
              </p>
            </div>
            <div>
              <p className="text-[9px] text-gray-400 font-bold uppercase">Jarak Tanam</p>
              <p className="font-semibold text-gray-700 mt-0.5">
                {crop.jarakTanam ? `${crop.jarakTanam} cm` : '-'}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-[9px] text-gray-400 font-bold uppercase">Kebutuhan Bibit</p>
              <p className="font-bold text-emerald-700 mt-0.5 text-sm">
                {crop.kebutuhanBibit ? `${crop.kebutuhanBibit.toLocaleString()} pcs` : '-'}
              </p>
            </div>
          </div>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-5">
          {/* GPS Coordinates Section */}
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-gray-700 flex items-center gap-1.5">
              <MapPin size={15} className="text-emerald-600" />
              Titik Koordinat Lahan (GPS) *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-[10px] text-gray-400 font-semibold uppercase">Latitude</span>
                <input
                  type="text"
                  value={gpsData.lat}
                  readOnly
                  placeholder="-6.xxxxx"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono text-gray-700 outline-none"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-gray-400 font-semibold uppercase">Longitude</span>
                <input
                  type="text"
                  value={gpsData.lng}
                  readOnly
                  placeholder="107.xxxxx"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono text-gray-700 outline-none"
                />
              </div>
            </div>
            
            {gpsError && (
              <p className="text-[10px] text-amber-600 bg-amber-50 p-2.5 rounded-lg font-medium leading-relaxed">
                ⚠️ {gpsError}
              </p>
            )}

            {!isReadOnly && (
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={loadingGps}
                className="w-full flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 text-emerald-700 font-bold py-2.5 rounded-xl text-xs transition-all"
              >
                {loadingGps ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" /> Mengunci Sinyal Satelit...
                  </>
                ) : (
                  <>
                    <MapPin size={14} /> Kunci Lokasi Saya Sekarang
                  </>
                )}
              </button>
            )}
          </div>

          {/* Upload Foto Inspeksi */}
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-gray-700">Foto Kondisi Fisik Tanaman *</label>
            {uploadedPhoto ? (
              <div className="relative w-full h-48 bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex items-center justify-center">
                <img src={uploadedPhoto} alt="Foto Inspeksi" className="w-full h-full object-cover" />
                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={() => setUploadedPhoto(null)}
                    className="absolute top-3 right-3 p-1.5 bg-black/60 hover:bg-black text-white rounded-full transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-40 border-2 border-dashed border-gray-200 hover:border-emerald-400 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-400 bg-gray-50 hover:bg-emerald-50/20 transition-all outline-none"
              >
                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-400">
                  <Upload size={20} />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-gray-700">Unggah Foto Lapangan</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Format JPG/PNG, Maksimal 5MB</p>
                </div>
              </button>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Catatan Survey */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-gray-700">Catatan Survey Lapangan *</label>
            <textarea
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              readOnly={isReadOnly}
              placeholder="Tuliskan analisis kelayakan lahan, pola tanam, kesuburan tanah, dan ketersediaan air..."
              rows={4}
              className={`w-full p-4 border rounded-2xl text-xs focus:ring-4 outline-none transition-all ${
                isReadOnly 
                  ? 'bg-gray-50 border-gray-200 text-gray-600 focus:ring-0' 
                  : 'bg-white border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/5 text-gray-800'
              }`}
              required
            />
          </div>

          {/* Action Buttons */}
          {!isReadOnly && (
            <div className="pt-2 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleVerify('rejected')}
                className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3.5 rounded-2xl text-xs active:scale-[0.98] transition-all border border-red-100"
              >
                Tolak Verifikasi Awal
              </button>
              <button
                type="button"
                onClick={() => handleVerify('approved')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl text-xs active:scale-[0.98] transition-all shadow-md shadow-emerald-100 flex items-center justify-center gap-1.5"
              >
                <Shield size={14} /> Setujui Verifikasi
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormInspeksiPage;
