// =====================================================
// FORM PENDAFTARAN TENDER - PETANI (SECURE & DETAILED)
// =====================================================

import React, { useState } from 'react';
import {
  ArrowLeft, ShieldCheck, AlertTriangle, FileText, Info,
  MapPin, Calendar, Package, Scale, Leaf
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { formatRupiah } from '../../data/dummy';
import { useData } from '../../context/DataContext';

const FormTenderPage: React.FC = () => {
  const { tender: dummyTender, lahan: dummyLahan, currentUser } = useData();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tenderId = searchParams.get('id') || '';
  const petaniId = currentUser?.id || '';

  const tender = dummyTender.find(t => t.id === tenderId);
  const lahanSaya = dummyLahan.filter(l => l.petaniId === petaniId);
  const sisaKg = tender ? tender.kebutuhanKg - tender.terpenuhinKg : 0;

  const [formData, setFormData] = useState({
    kesanggupanKg: '',
    lahanId: '',
    estimasiPanen: '',
    kualitasGrade: '',
    noHpAktif: '',
    catatanPetani: '',
    setujuSyarat: false,
    setujuSurvei: false,
    setujuPenalti: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const kg = Number(formData.kesanggupanKg);

    if (!formData.kesanggupanKg || kg <= 0) newErrors.kesanggupanKg = 'Masukkan jumlah kesanggupan yang valid';
    if (kg > sisaKg) newErrors.kesanggupanKg = `Melebihi sisa kebutuhan (${sisaKg.toLocaleString()} kg)`;
    if (!formData.lahanId) newErrors.lahanId = 'Pilih lahan sumber produksi';
    if (!formData.estimasiPanen) newErrors.estimasiPanen = 'Masukkan estimasi tanggal panen';
    if (!formData.kualitasGrade) newErrors.kualitasGrade = 'Pilih grade kualitas komoditas';
    if (!formData.noHpAktif) newErrors.noHpAktif = 'Masukkan nomor HP aktif untuk koordinasi';
    if (!formData.setujuSyarat) newErrors.setujuSyarat = 'Anda harus menyetujui syarat & ketentuan';
    if (!formData.setujuSurvei) newErrors.setujuSurvei = 'Anda harus menyetujui proses survei';
    if (!formData.setujuPenalti) newErrors.setujuPenalti = 'Anda harus memahami ketentuan penalti';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    alert('✅ Pendaftaran tender berhasil!\n\nPengajuan Anda akan diverifikasi oleh admin melalui proses:\n1. Review data kesanggupan\n2. Survei lahan oleh petugas\n3. Konfirmasi persetujuan\n\nAnda akan mendapat notifikasi setelah proses review selesai.');
    navigate('/petani/tender');
  };

  if (!tender) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5">
        <div className="text-center">
          <p className="text-gray-400 text-sm">Tender tidak ditemukan</p>
          <button onClick={() => navigate('/petani/tender')} className="mt-3 text-primary-600 text-sm font-bold">
            ← Kembali
          </button>
        </div>
      </div>
    );
  }

  const persen = (tender.terpenuhinKg / tender.kebutuhanKg) * 100;

  return (
    <div className="bg-gray-50 min-h-screen pb-8">
      {/* ── HEADER ── */}
      <div className="bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600 text-white px-5 pt-10 pb-5 rounded-b-2xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/[0.04] rounded-full -mr-24 -mt-24 blur-2xl" />

        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/15 transition-all active:scale-95">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-display font-bold text-lg leading-tight">Pendaftaran Tender</h1>
            <p className="text-white/50 text-xs">Isi formulir dengan data yang akurat</p>
          </div>
        </div>

        {/* Tender Info */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/15">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-sm">{tender.komoditasNama}</h3>
            <span className="px-2 py-0.5 bg-emerald-400/20 text-emerald-200 text-[10px] font-bold rounded-full">Aktif</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-[9px] text-white/40 uppercase tracking-wider">Kebutuhan</p>
              <p className="font-bold text-xs mt-0.5">{(tender.kebutuhanKg / 1000).toFixed(0)} ton</p>
            </div>
            <div>
              <p className="text-[9px] text-white/40 uppercase tracking-wider">Sisa</p>
              <p className="font-bold text-xs mt-0.5">{sisaKg.toLocaleString()} kg</p>
            </div>
            <div>
              <p className="text-[9px] text-white/40 uppercase tracking-wider">Harga/kg</p>
              <p className="font-bold text-xs mt-0.5 text-emerald-200">{formatRupiah(tender.hargaPerKg)}</p>
            </div>
          </div>
          {/* Progress */}
          <div className="mt-2.5">
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${Math.min(persen, 100)}%` }} />
            </div>
            <p className="text-[9px] text-white/40 mt-1">{persen.toFixed(0)}% terpenuhi · Batas: {new Date(tender.tanggalBerakhir).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {/* ── FORM ── */}
      <div className="px-5 pt-5 space-y-4">

        {/* Security Notice */}
        <div className="bg-primary-50 border border-primary-100 rounded-xl p-3.5 flex items-start gap-2.5">
          <ShieldCheck size={16} className="text-primary-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-[12px] font-bold text-primary-800">Proses Verifikasi Ketat</p>
            <p className="text-[10px] text-primary-600 mt-0.5">Setiap pendaftaran akan melalui review admin → survei lahan → konfirmasi persetujuan sebelum disetujui.</p>
          </div>
        </div>

        {/* ── SECTION: Data Kesanggupan ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-4">
          <p className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
            <Package size={13} className="text-primary-600" /> Data Kesanggupan
          </p>

          {/* Kesanggupan Kg */}
          <div>
            <label className="block text-[11px] font-bold text-gray-600 mb-1.5">Kesanggupan Supply (kg) <span className="text-red-500">*</span></label>
            <input
              type="number"
              placeholder={`Maks. ${sisaKg.toLocaleString()} kg`}
              value={formData.kesanggupanKg}
              onChange={(e) => { setFormData(p => ({ ...p, kesanggupanKg: e.target.value })); setErrors(p => ({ ...p, kesanggupanKg: '' })); }}
              className={`w-full px-4 py-3 rounded-xl border ${errors.kesanggupanKg ? 'border-red-300 bg-red-50/50' : 'border-gray-200 bg-white'} focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm transition-all`}
            />
            {errors.kesanggupanKg && <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1"><AlertTriangle size={10} /> {errors.kesanggupanKg}</p>}
          </div>

          {/* Grade Kualitas */}
          <div>
            <label className="block text-[11px] font-bold text-gray-600 mb-1.5">Grade Kualitas <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'A', label: 'Grade A', desc: 'Premium' },
                { value: 'B', label: 'Grade B', desc: 'Standar' },
                { value: 'C', label: 'Grade C', desc: 'Ekonomi' },
              ].map(g => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => { setFormData(p => ({ ...p, kualitasGrade: g.value })); setErrors(p => ({ ...p, kualitasGrade: '' })); }}
                  className={`p-2.5 rounded-xl border text-center transition-all active:scale-95 ${
                    formData.kualitasGrade === g.value
                      ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-200'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <p className={`text-xs font-bold ${formData.kualitasGrade === g.value ? 'text-primary-700' : 'text-gray-700'}`}>{g.label}</p>
                  <p className="text-[9px] text-gray-400 mt-0.5">{g.desc}</p>
                </button>
              ))}
            </div>
            {errors.kualitasGrade && <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1"><AlertTriangle size={10} /> {errors.kualitasGrade}</p>}
          </div>

          {/* Estimasi Panen */}
          <div>
            <label className="block text-[11px] font-bold text-gray-600 mb-1.5">Estimasi Tanggal Panen <span className="text-red-500">*</span></label>
            <div className="relative">
              <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={formData.estimasiPanen}
                onChange={(e) => { setFormData(p => ({ ...p, estimasiPanen: e.target.value })); setErrors(p => ({ ...p, estimasiPanen: '' })); }}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.estimasiPanen ? 'border-red-300 bg-red-50/50' : 'border-gray-200 bg-white'} focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm transition-all`}
              />
            </div>
            {errors.estimasiPanen && <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1"><AlertTriangle size={10} /> {errors.estimasiPanen}</p>}
          </div>
        </div>

        {/* ── SECTION: Sumber Lahan ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-4">
          <p className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
            <MapPin size={13} className="text-primary-600" /> Sumber Lahan
          </p>

          {/* Pilih Lahan */}
          <div>
            <label className="block text-[11px] font-bold text-gray-600 mb-1.5">Lahan Produksi <span className="text-red-500">*</span></label>
            {lahanSaya.length > 0 ? (
              <div className="space-y-2">
                {lahanSaya.map(l => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => { setFormData(p => ({ ...p, lahanId: l.id })); setErrors(p => ({ ...p, lahanId: '' })); }}
                    className={`w-full p-3 rounded-xl border text-left transition-all active:scale-[0.98] flex items-center gap-3 ${
                      formData.lahanId === l.id
                        ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-200'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${formData.lahanId === l.id ? 'bg-primary-100' : 'bg-gray-50'}`}>
                      <Leaf size={16} className={formData.lahanId === l.id ? 'text-primary-600' : 'text-gray-400'} />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${formData.lahanId === l.id ? 'text-primary-800' : 'text-gray-700'}`}>{l.namaLahan}</p>
                      <p className="text-[10px] text-gray-400">{l.luasHektar} ha · {l.lokasi.alamat}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                <Info size={14} className="text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] text-amber-800 font-medium">Anda belum memiliki data lahan.</p>
                  <button onClick={() => navigate('/petani/data-lahan')} className="text-[11px] text-amber-700 font-bold underline mt-0.5">
                    Tambah lahan terlebih dahulu →
                  </button>
                </div>
              </div>
            )}
            {errors.lahanId && <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1"><AlertTriangle size={10} /> {errors.lahanId}</p>}
          </div>
        </div>

        {/* ── SECTION: Kontak & Catatan ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-4">
          <p className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
            <Scale size={13} className="text-primary-600" /> Kontak & Catatan
          </p>

          {/* No HP */}
          <div>
            <label className="block text-[11px] font-bold text-gray-600 mb-1.5">No. HP Aktif <span className="text-red-500">*</span></label>
            <input
              type="tel"
              placeholder="08xx-xxxx-xxxx"
              value={formData.noHpAktif}
              onChange={(e) => { setFormData(p => ({ ...p, noHpAktif: e.target.value })); setErrors(p => ({ ...p, noHpAktif: '' })); }}
              className={`w-full px-4 py-3 rounded-xl border ${errors.noHpAktif ? 'border-red-300 bg-red-50/50' : 'border-gray-200 bg-white'} focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm transition-all`}
            />
            {errors.noHpAktif && <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1"><AlertTriangle size={10} /> {errors.noHpAktif}</p>}
          </div>

          {/* Catatan */}
          <div>
            <label className="block text-[11px] font-bold text-gray-600 mb-1.5">Catatan Tambahan</label>
            <textarea
              placeholder="Contoh: Estimasi panen minggu ke-2 Maret, hasil organik..."
              rows={3}
              value={formData.catatanPetani}
              onChange={(e) => setFormData(p => ({ ...p, catatanPetani: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm transition-all resize-none"
            />
          </div>
        </div>

        {/* ── SECTION: Syarat & Ketentuan ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
          <p className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
            <FileText size={13} className="text-primary-600" /> Tahapan Verifikasi & Monitoring
          </p>

          <div className="bg-primary-50/50 rounded-xl p-3.5 border border-primary-100">
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">1</div>
                <div>
                  <p className="text-[11px] font-bold text-primary-800">Review Data & Administratif</p>
                  <p className="text-[10px] text-primary-600/80 mt-0.5">Admin akan memeriksa kesesuaian lahan dan kapasitas supply Anda.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">2</div>
                <div>
                  <p className="text-[11px] font-bold text-primary-800">Inspeksi Lahan Langsung</p>
                  <p className="text-[10px] text-primary-600/80 mt-0.5">Petugas lapangan akan datang ke lokasi untuk pengecekan fisik tanaman.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">3</div>
                <div>
                  <p className="text-[11px] font-bold text-primary-800">Monitoring & Pendampingan</p>
                  <p className="text-[10px] text-primary-600/80 mt-0.5">Pihak Agro akan memantau perkembangan tanaman hingga masa panen tiba.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-3">
            <ul className="text-[10px] text-gray-600 space-y-1.5 ml-3.5 list-disc">
              <li>Komoditas wajib memenuhi standar kualitas Agro Jabar sesuai grade yang dipilih</li>
              <li>Pembayaran dilakukan setelah proses timbang & quality control</li>
              <li>Sedia dipantau secara berkala oleh tim teknis Agro Jabar</li>
            </ul>
          </div>

          <label className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${formData.setujuSyarat ? 'bg-primary-50 border-primary-200' : errors.setujuSyarat ? 'bg-red-50/50 border-red-200' : 'bg-white border-gray-200'}`}>
            <input type="checkbox" checked={formData.setujuSyarat} onChange={e => { setFormData(p => ({ ...p, setujuSyarat: e.target.checked })); setErrors(p => ({ ...p, setujuSyarat: '' })); }} className="mt-0.5 w-4 h-4 accent-primary-600 rounded shrink-0" />
            <span className="text-[11px] text-gray-700">Saya menyetujui <span className="font-bold">syarat & ketentuan</span> tender Agro Jabar</span>
          </label>

          <label className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${formData.setujuSurvei ? 'bg-primary-50 border-primary-200' : errors.setujuSurvei ? 'bg-red-50/50 border-red-200' : 'bg-white border-gray-200'}`}>
            <input type="checkbox" checked={formData.setujuSurvei} onChange={e => { setFormData(p => ({ ...p, setujuSurvei: e.target.checked })); setErrors(p => ({ ...p, setujuSurvei: '' })); }} className="mt-0.5 w-4 h-4 accent-primary-600 rounded shrink-0" />
            <span className="text-[11px] text-gray-700">Saya bersedia <span className="font-bold">disurvei & dipantau</span> oleh petugas di lahan</span>
          </label>

          <label className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${formData.setujuPenalti ? 'bg-primary-50 border-primary-200' : errors.setujuPenalti ? 'bg-red-50/50 border-red-200' : 'bg-white border-gray-200'}`}>
            <input type="checkbox" checked={formData.setujuPenalti} onChange={e => { setFormData(p => ({ ...p, setujuPenalti: e.target.checked })); setErrors(p => ({ ...p, setujuPenalti: '' })); }} className="mt-0.5 w-4 h-4 accent-primary-600 rounded shrink-0" />
            <span className="text-[11px] text-gray-700">Saya memahami <span className="font-bold">ketentuan penalti</span> jika komitmen tidak terpenuhi</span>
          </label>
        </div>

        {/* ── SUBMIT ── */}
        <button
          onClick={handleSubmit}
          className="w-full py-3.5 bg-primary-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-primary-600/20 active:scale-[0.97] transition-all flex items-center justify-center gap-2"
        >
          <ShieldCheck size={16} /> Ajukan Pendaftaran Tender
        </button>

        <p className="text-[10px] text-gray-400 text-center pb-2">
          Dengan mengajukan, data Anda akan diverifikasi oleh tim Agro Jabar
        </p>
      </div>
    </div>
  );
};

export default FormTenderPage;
