// =====================================================
// REGISTRASI PETANI DENGAN LEAFLET & JWT AUTH
// =====================================================

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Save, User, Phone, Mail, Home, FileText, Lock, Upload, X } from 'lucide-react';
import { useData } from '../../context/DataContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icon asset paths with unpkg CDN
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const RegistrasiPage: React.FC = () => {
  const navigate = useNavigate();
  const { registerPetani } = useData();
  
  // Navigation Steps
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Identitas State
  const [nama, setNama] = useState('');
  const [nik, setNik] = useState('');
  const [noHp, setNoHp] = useState('');
  const [email, setEmail] = useState('');
  const [alamat, setAlamat] = useState('');
  const [kecamatan, setKecamatan] = useState('');
  const [kabupaten, setKabupaten] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fotoKtp, setFotoKtp] = useState<string | null>(null);

  const ktpFileRef = useRef<HTMLInputElement>(null);

  // Step 2: Data Lahan State
  const [namaLahan, setNamaLahan] = useState('');
  const [jenisLahan, setJenisLahan] = useState('');
  const [luasHektar, setLuasHektar] = useState('');
  const [latitude, setLatitude] = useState('-6.8219');
  const [longitude, setLongitude] = useState('107.1396'); // Default Cianjur coordinates
  const [alamatLahan, setAlamatLahan] = useState('');

  // Map Refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Initialize Map in Step 2
  useEffect(() => {
    if (step !== 2 || !mapContainerRef.current) return;

    const initialLat = parseFloat(latitude) || -6.8219;
    const initialLng = parseFloat(longitude) || 107.1396;

    // Initialize Map
    const map = L.map(mapContainerRef.current).setView([initialLat, initialLng], 12);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Create marker
    const marker = L.marker([initialLat, initialLng], { draggable: true }).addTo(map);
    markerRef.current = marker;

    // Listen to dragend
    marker.on('dragend', () => {
      const position = marker.getLatLng();
      setLatitude(position.lat.toFixed(6));
      setLongitude(position.lng.toFixed(6));
    });

    // Listen to map click
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      setLatitude(lat.toFixed(6));
      setLongitude(lng.toFixed(6));
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [step]);

  // Sync manual coordinate changes with marker
  const handleCoordChange = (latVal: string, lngVal: string) => {
    setLatitude(latVal);
    setLongitude(lngVal);

    const latNum = parseFloat(latVal);
    const lngNum = parseFloat(lngVal);

    if (!isNaN(latNum) && !isNaN(lngNum) && markerRef.current && mapInstanceRef.current) {
      markerRef.current.setLatLng([latNum, lngNum]);
      mapInstanceRef.current.panTo([latNum, lngNum]);
    }
  };

  const handleKtpFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file terlalu besar! Maksimal 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoKtp(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNextStep1 = () => {
    if (!nama || !nik || !noHp || !password || !confirmPassword || !alamat || !kecamatan || !kabupaten) {
      alert('Silakan isi seluruh kolom yang wajib diisi (Nama, NIK, No HP, Password, Konfirmasi Password, Alamat Lengkap, Kecamatan, Kabupaten).');
      return;
    }
    if (nik.length !== 16) {
      alert('NIK harus terdiri dari 16 digit.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Konfirmasi password tidak cocok dengan password.');
      return;
    }
    if (!fotoKtp) {
      alert('Silakan unggah foto KTP Anda terlebih dahulu.');
      return;
    }
    setStep(2);
  };

  const handleNextStep2 = () => {
    if (!namaLahan || !jenisLahan || !luasHektar || !latitude || !longitude || !alamatLahan) {
      alert('Silakan isi seluruh kolom data lahan dan pilih lokasi pada peta.');
      return;
    }
    setStep(3);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const payload = {
      nama,
      nik,
      noHp,
      email,
      alamat,
      kecamatan,
      kabupaten,
      provinsi: 'Jawa Barat',
      password,
      fotoProfil: '👨‍🌾',
      fotoKtp: fotoKtp || 'ktp_placeholder.jpg',
      // Lahan fields
      namaLahan,
      jenisLahan,
      luasHektar: parseFloat(luasHektar),
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      alamatLahan,
      fotoLahan: '🌾'
    };

    const success = await registerPetani(payload);
    setLoading(false);
    if (success) {
      alert('Pendaftaran berhasil! Data Anda sedang menunggu verifikasi oleh Admin.');
      navigate('/');
    } else {
      alert('Pendaftaran gagal. Nomor telepon mungkin sudah terdaftar, silakan coba nomor lain.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <div className="w-full max-w-lg bg-white min-h-screen shadow-xl shadow-gray-200/50 relative flex flex-col justify-between">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-xl">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="font-display font-bold text-lg">Pendaftaran Petani</h1>
              <p className="text-xs text-gray-500">Langkah {step} dari 3</p>
            </div>
          </div>
          {/* Progress Indicator */}
          <div className="flex gap-2 mt-3">
            {[1, 2, 3].map(s => (
              <div key={s} className={`flex-1 h-1.5 rounded-full transition-all ${s <= step ? 'bg-primary-500' : 'bg-gray-200'}`} />
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 space-y-5 flex-grow">
          {/* Step 1: Data Identitas */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="section-title">Data Identitas</h2>
              <div>
                <label className="label-field"><User size={14} className="inline mr-1" />Nama Lengkap <span className="text-red-500 font-bold">*</span></label>
                <input
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  className="input-field"
                  value={nama}
                  onChange={e => setNama(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="label-field"><FileText size={14} className="inline mr-1" />NIK <span className="text-red-500 font-bold">*</span></label>
                <input
                  type="text"
                  placeholder="Masukkan 16 digit NIK"
                  className="input-field"
                  maxLength={16}
                  value={nik}
                  onChange={e => setNik(e.target.value.replace(/\D/g, ''))}
                  required
                />
              </div>
              <div>
                <label className="label-field"><Upload size={14} className="inline mr-1" />Foto KTP (Data Diri) <span className="text-red-500 font-bold">*</span></label>
                <input 
                  type="file" 
                  ref={ktpFileRef} 
                  onChange={handleKtpFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
                {fotoKtp ? (
                  <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white p-2">
                    <img src={fotoKtp} alt="Foto KTP" className="w-full h-40 object-cover rounded-xl" />
                    <button 
                      type="button"
                      onClick={() => setFotoKtp(null)}
                      className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors shadow-md animate-fade-in"
                    >
                      <X size={16} />
                    </button>
                    <div className="p-2 text-center">
                      <button 
                        type="button"
                        onClick={() => ktpFileRef.current?.click()}
                        className="text-xs text-primary-600 font-bold hover:text-primary-700 transition-colors"
                      >
                        Ubah Foto KTP
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => ktpFileRef.current?.click()}
                    className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-primary-300 transition-colors cursor-pointer bg-gray-50 hover:bg-gray-100/50"
                  >
                    <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-xs text-gray-500 font-medium">Unggah Foto KTP Asli</p>
                    <p className="text-[10px] text-gray-400 mt-1">Format: JPG, PNG (Maks 5MB)</p>
                  </div>
                )}
              </div>
              <div>
                <label className="label-field"><Phone size={14} className="inline mr-1" />Nomor HP <span className="text-red-500 font-bold">*</span></label>
                <input
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  className="input-field"
                  value={noHp}
                  onChange={e => setNoHp(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="label-field"><Mail size={14} className="inline mr-1" />Email</label>
                <input
                  type="email"
                  placeholder="email@contoh.com"
                  className="input-field"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="label-field"><Lock size={14} className="inline mr-1" />Password <span className="text-red-500 font-bold">*</span></label>
                <input
                  type="password"
                  placeholder="Masukkan password untuk login"
                  className="input-field"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="label-field"><Lock size={14} className="inline mr-1" />Konfirmasi Password <span className="text-red-500 font-bold">*</span></label>
                <input
                  type="password"
                  placeholder="Ulangi password untuk login"
                  className="input-field"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="label-field"><Home size={14} className="inline mr-1" />Alamat Lengkap <span className="text-red-500 font-bold">*</span></label>
                <textarea
                  placeholder="Masukkan alamat lengkap tempat tinggal"
                  className="input-field"
                  rows={3}
                  value={alamat}
                  onChange={e => setAlamat(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label-field">Kecamatan <span className="text-red-500 font-bold">*</span></label>
                  <input
                    type="text"
                    placeholder="Kecamatan"
                    className="input-field"
                    value={kecamatan}
                    onChange={e => setKecamatan(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="label-field">Kabupaten <span className="text-red-500 font-bold">*</span></label>
                  <input
                    type="text"
                    placeholder="Kabupaten"
                    className="input-field"
                    value={kabupaten}
                    onChange={e => setKabupaten(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <button onClick={handleNextStep1} className="btn-primary w-full mt-4">
                Lanjut ke Data Lahan →
              </button>
            </div>
          )}

          {/* Step 2: Data Lahan */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="section-title">Data Lahan</h2>
              <div>
                <label className="label-field">Nama Lahan <span className="text-red-500 font-bold">*</span></label>
                <input
                  type="text"
                  placeholder="Mis: Sawah Sarongge Utara"
                  className="input-field"
                  value={namaLahan}
                  onChange={e => setNamaLahan(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="label-field">Jenis Lahan <span className="text-red-500 font-bold">*</span></label>
                <select
                  className="input-field"
                  value={jenisLahan}
                  onChange={e => setJenisLahan(e.target.value)}
                  required
                >
                  <option value="">Pilih jenis lahan</option>
                  <option value="sawah">Sawah</option>
                  <option value="kebun">Kebun</option>
                </select>
              </div>
              <div>
                <label className="label-field">Luas Lahan (Hektar) <span className="text-red-500 font-bold">*</span></label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Contoh: 2.5"
                  className="input-field"
                  value={luasHektar}
                  onChange={e => setLuasHektar(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="label-field"><MapPin size={14} className="inline mr-1" />Lokasi GPS (Peta OpenStreetMap)</label>
                
                {/* Map Container */}
                <div 
                  ref={mapContainerRef} 
                  className="bg-gray-100 rounded-xl h-52 mb-2 relative border border-gray-200 overflow-hidden z-0" 
                />
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-gray-500 font-semibold ml-0.5">Latitude</label>
                    <input
                      type="text"
                      placeholder="Latitude"
                      className="input-field"
                      value={latitude}
                      onChange={e => handleCoordChange(e.target.value, longitude)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-500 font-semibold ml-0.5">Longitude</label>
                    <input
                      type="text"
                      placeholder="Longitude"
                      className="input-field"
                      value={longitude}
                      onChange={e => handleCoordChange(latitude, e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="label-field">Alamat Lokasi Lahan</label>
                <input
                  type="text"
                  placeholder="Alamat lokasi lahan"
                  className="input-field"
                  value={alamatLahan}
                  onChange={e => setAlamatLahan(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(1)} className="btn-secondary flex-1">← Kembali</button>
                <button onClick={handleNextStep2} className="btn-primary flex-1">Lanjut →</button>
              </div>
            </div>
          )}

          {/* Step 3: Konfirmasi */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="section-title">Konfirmasi Pendaftaran</h2>
              <div className="card bg-primary-50 border-primary-200">
                <p className="text-sm text-primary-800 leading-relaxed font-semibold">
                  Dengan mendaftar, Anda menyetujui bahwa data yang diberikan adalah benar dan bersedia untuk diverifikasi oleh tim Agro Jabar.
                </p>
                
                <div className="mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center shrink-0 text-emerald-600">
                    <Save size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-800">Buka Fitur Booking</p>
                    <p className="text-[11px] text-emerald-600 leading-relaxed mt-1">
                      Setelah akun Anda diverifikasi oleh tim Agro Jabar, Anda akan mendapatkan akses ke <span className="font-bold whitespace-nowrap">Fitur Booking & Alokasi</span> untuk mempermudah distribusi hasil panen.
                    </p>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-white/50 rounded-xl border border-primary-100 flex items-start gap-2">
                  <MapPin size={16} className="text-primary-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-primary-700">
                    <span className="font-bold">Informasi:</span> Hasil panen Anda nantinya akan dialokasikan dan dipantau oleh Unit Pengolahan (Gudang) terdekat berdasarkan lokasi yang Anda daftarkan, setelah disetujui oleh tim verifikasi Daerah.
                  </p>
                </div>
              </div>

              <div className="card space-y-3">
                <h3 className="font-semibold text-sm">Ringkasan Data Pendaftaran</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-500">Nama</span>
                    <span className="font-medium text-gray-800">{nama}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-500">NIK</span>
                    <span className="font-medium text-gray-800">{nik}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-500">No. HP</span>
                    <span className="font-medium text-gray-800">{noHp}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-500">Alamat Lahan</span>
                    <span className="font-medium text-gray-800">{namaLahan} ({jenisLahan})</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-500">Luas Lahan</span>
                    <span className="font-medium text-gray-800">{luasHektar} Hektar</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-500">Koordinat GPS</span>
                    <span className="font-medium text-gray-800">{latitude}, {longitude}</span>
                  </div>
                   <div className="flex justify-between py-1">
                    <span className="text-gray-500">Status Akun</span>
                    <span className="text-amber-600 font-medium">Menunggu Verifikasi</span>
                  </div>
                  {fotoKtp && (
                    <div className="pt-3 border-t border-gray-100">
                      <span className="text-xs font-semibold text-gray-500 block mb-1">Foto KTP Dokumen</span>
                      <div className="rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                        <img src={fotoKtp} alt="Preview KTP" className="w-full h-32 object-cover" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="btn-secondary flex-1" disabled={loading}>← Kembali</button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span>Memproses...</span>
                  ) : (
                    <>
                      <Save size={18} />
                      Kirim Pendaftaran
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info branding */}
        <div className="p-4 border-t border-gray-50 bg-white text-center">
          <p className="text-[10px] text-gray-300 font-medium uppercase tracking-widest">
            BUMD Agro Jabar · 2026
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrasiPage;
