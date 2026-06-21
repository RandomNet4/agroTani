import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Save } from 'lucide-react';
import { useData } from '../../context/DataContext';

const EditProfilePage: React.FC = () => {
  const { currentUser, updatePetani } = useData();
  const navigate = useNavigate();

  const profileFileInputRef = useRef<HTMLInputElement>(null);
  const [nama, setNama] = useState('');
  const [noHp, setNoHp] = useState('');
  const [email, setEmail] = useState('');
  const [alamat, setAlamat] = useState('');
  const [kecamatan, setKecamatan] = useState('');
  const [kabupaten, setKabupaten] = useState('');
  const [provinsi, setProvinsi] = useState('');
  const [fotoProfilState, setFotoProfilState] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (currentUser) {
      setNama(currentUser.nama || '');
      setNoHp(currentUser.noHp || '');
      setEmail(currentUser.email || '');
      setAlamat(currentUser.alamat || '');
      setKecamatan(currentUser.kecamatan || '');
      setKabupaten(currentUser.kabupaten || '');
      setProvinsi(currentUser.provinsi || 'Jawa Barat');
      setFotoProfilState(currentUser.fotoProfil || '👨‍🌾');
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 font-semibold">Memuat data profil...</p>
      </div>
    );
  }

  const handleProfileFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file terlalu besar! Maksimal 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoProfilState(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!nama || !noHp) {
      setMessage({ type: 'error', text: 'Nama dan Nomor Telepon wajib diisi!' });
      return;
    }
    setLoading(true);
    setMessage(null);

    const updateData: any = { 
      nama, 
      noHp, 
      email,
      alamat,
      kecamatan,
      kabupaten,
      provinsi,
      fotoProfil: fotoProfilState
    };
    if (password) {
      updateData.password = password;
    }

    try {
      const success = await updatePetani(currentUser.id, updateData);
      if (success) {
        setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });
        setTimeout(() => {
          navigate('/petani/profil');
        }, 1500);
      } else {
        setMessage({ type: 'error', text: 'Gagal memperbarui profil. Silakan coba lagi.' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Terjadi kesalahan sistem.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-50 rounded-full transition-colors"
            >
              <ChevronLeft size={24} className="text-gray-700" />
            </button>
            <h1 className="font-display font-bold text-lg text-gray-900">Edit Profile</h1>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {message && (
          <div className={`p-4 rounded-xl text-xs font-semibold ${
            message.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* Foto Profil */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center">
          <input 
            type="file" 
            ref={profileFileInputRef} 
            onChange={handleProfileFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center text-5xl mb-4 border-4 border-white shadow-sm overflow-hidden">
            {fotoProfilState && (fotoProfilState.startsWith('data:image/') || fotoProfilState.startsWith('http') || fotoProfilState.includes('.')) ? (
              <img src={fotoProfilState} alt="Foto Profil" className="w-full h-full object-cover" />
            ) : (
              fotoProfilState || '👨‍🌾'
            )}
          </div>
          <button 
            type="button"
            onClick={() => profileFileInputRef.current?.click()}
            className="text-primary-600 text-sm font-semibold hover:text-primary-700"
          >
            Ubah Foto Profil
          </button>
          <p className="text-[10px] text-gray-400 mt-1">Ukuran foto maks. 5MB (Format: JPG, PNG)</p>
        </div>

        {/* Form Info Pribadi */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-sm font-bold text-gray-800 mb-2">Informasi Pribadi</h2>
          
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Nama Lengkap</label>
            <input 
              type="text" 
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Nomor Telepon (WhatsApp)</label>
            <input 
              type="tel" 
              value={noHp}
              onChange={(e) => setNoHp(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Email (Opsional)</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email Anda"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Alamat Tempat Tinggal</label>
            <textarea 
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              placeholder="Masukkan alamat lengkap rumah"
              rows={2}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Kecamatan</label>
              <input 
                type="text" 
                value={kecamatan}
                onChange={(e) => setKecamatan(e.target.value)}
                placeholder="Kecamatan"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Kabupaten / Kota</label>
              <input 
                type="text" 
                value={kabupaten}
                onChange={(e) => setKabupaten(e.target.value)}
                placeholder="Kabupaten"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Provinsi</label>
            <input 
              type="text" 
              value={provinsi}
              onChange={(e) => setProvinsi(e.target.value)}
              placeholder="Provinsi"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
            />
          </div>
        </div>

        {/* Form Keamanan */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-sm font-bold text-gray-800 mb-2">Keamanan Akun</h2>
          
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Kata Sandi Baru</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan kata sandi baru"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
            />
          </div>
        </div>

        {/* Save Button */}
        <button 
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-primary-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Save size={18} />
          {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>
    </div>
  );
};

export default EditProfilePage;
