// =====================================================
// MODALS: Detail, Edit, Hapus — Lahan & Tanaman
// =====================================================

import React, { useState } from 'react';
import { X, MapPin, Scale, Leaf, Calendar, Clock, Save, AlertTriangle } from 'lucide-react';
import StatusBadge from './StatusBadge';
import type { Lahan, TanamanAktif, Komoditas } from '../types';
import { useData } from '../context/DataContext';;

// ── KONFIRMASI HAPUS ──
export const DeleteConfirmModal: React.FC<{
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ title, message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
    <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl">
      <div className="p-6 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={32} className="text-red-500" />
        </div>
        <h3 className="font-bold text-gray-800 text-lg mb-2">{title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{message}</p>
      </div>
      <div className="flex border-t border-gray-100">
        <button onClick={onCancel} className="flex-1 py-4 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors">Batal</button>
        <button onClick={onConfirm} className="flex-1 py-4 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors border-l border-gray-100">Hapus</button>
      </div>
    </div>
  </div>
);

// ── DETAIL LAHAN MODAL ──
export const DetailLahanModal: React.FC<{
  lahan: Lahan;
  tanamanCount: number;
  onClose: () => void;
}> = ({ lahan, tanamanCount, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-0">
    <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl max-h-[85vh] overflow-y-auto">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
        <h3 className="font-bold text-gray-800 text-lg">Detail Lahan</h3>
        <button onClick={onClose} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"><X size={20} /></button>
      </div>
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-3xl border border-emerald-100">{lahan.fotoLahan}</div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-800">{lahan.namaLahan}</h4>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><MapPin size={11} className="text-emerald-500" />{lahan.lokasi.alamat}</p>
          </div>
          <StatusBadge status={lahan.statusVerifikasi} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Luas Lahan</p>
            <p className="text-lg font-bold text-gray-800 flex items-center gap-1 mt-1"><Scale size={14} className="text-emerald-500" />{lahan.luasHektar} Ha</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Jenis Lahan</p>
            <p className="text-lg font-bold text-gray-800 capitalize flex items-center gap-1 mt-1"><Leaf size={14} className="text-emerald-500" />{lahan.jenisLahan}</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Lokasi</p>
          <div className="space-y-1.5 text-sm text-gray-700">
            <p><span className="text-gray-400 text-xs">Kecamatan:</span> {lahan.kecamatan}</p>
            <p><span className="text-gray-400 text-xs">Kabupaten:</span> {lahan.kabupaten}</p>
            <p><span className="text-gray-400 text-xs">Koordinat:</span> {lahan.lokasi.lat}, {lahan.lokasi.lng}</p>
          </div>
        </div>

        <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Tanaman Aktif</p>
          <p className="text-2xl font-bold text-emerald-800 mt-1">{tanamanCount} <span className="text-sm font-medium">siklus tanam</span></p>
        </div>
      </div>
    </div>
  </div>
);

// ── EDIT LAHAN MODAL ──
export const EditLahanModal: React.FC<{
  lahan: Lahan;
  onClose: () => void;
  onSave: (data: any) => void;
}> = ({ lahan, onClose, onSave }) => {
  const { editLahan } = useData();
  const [form, setForm] = useState({
    namaLahan: lahan.namaLahan,
    luasHektar: String(lahan.luasHektar),
    jenisLahan: lahan.jenisLahan,
    kecamatan: lahan.kecamatan,
    kabupaten: lahan.kabupaten,
    alamat: lahan.lokasi.alamat,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await editLahan(lahan.id, {
      namaLahan: form.namaLahan,
      luasHektar: parseFloat(form.luasHektar),
      jenisLahan: form.jenisLahan,
      kecamatan: form.kecamatan,
      kabupaten: form.kabupaten,
      alamat: form.alamat,
    });
    setLoading(false);
    if (success) onSave(form);
    else alert('Gagal menyimpan perubahan lahan.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-0">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl max-h-[85vh] overflow-y-auto">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Edit Lahan</h3>
            <p className="text-[11px] text-gray-500">Perbarui data {lahan.namaLahan}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Nama Lahan</label>
            <input required type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all" value={form.namaLahan} onChange={e => setForm({...form, namaLahan: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Luas (Ha)</label>
              <input required type="number" step="0.01" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all" value={form.luasHektar} onChange={e => setForm({...form, luasHektar: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Jenis</label>
              <select className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all" value={form.jenisLahan} onChange={e => setForm({...form, jenisLahan: e.target.value as any})}>
                <option value="sawah">Sawah</option>
                <option value="kebun">Kebun</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Kecamatan</label>
            <input required type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all" value={form.kecamatan} onChange={e => setForm({...form, kecamatan: e.target.value})} />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Alamat</label>
            <textarea rows={2} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all resize-none" value={form.alamat} onChange={e => setForm({...form, alamat: e.target.value})} />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3.5 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
            <Save size={16} /> {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      </div>
    </div>
  );
};

// ── DETAIL TANAMAN MODAL ──
export const DetailTanamanModal: React.FC<{
  tanaman: TanamanAktif;
  lahanNama: string;
  onClose: () => void;
}> = ({ tanaman, lahanNama, onClose }) => {
  const { komoditas: dummyKomoditas } = useData();
  const komoditas = dummyKomoditas.find((k: Komoditas) => k.id === tanaman.komoditasId);
  const start = new Date(tanaman.tanggalTanam).getTime();
  const end = new Date(tanaman.estimasiPanen).getTime();
  const now = Date.now();
  const totalDays = Math.ceil((end - start) / (1000*60*60*24));
  const elapsedDays = Math.ceil((now - start) / (1000*60*60*24));
  const progress = Math.max(0, Math.min(100, Math.floor(((now - start) / (end - start)) * 100)));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-0">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl max-h-[85vh] overflow-y-auto">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h3 className="font-bold text-gray-800 text-lg">Detail Tanaman</h3>
          <button onClick={onClose} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"><X size={20} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl bg-gray-50 w-14 h-14 rounded-2xl flex items-center justify-center border border-gray-100">{tanaman.fotoTanaman}</span>
            <div>
              <h4 className="font-bold text-gray-800">{tanaman.komoditasNama}</h4>
              <p className="text-xs text-gray-500">di {lahanNama}</p>
            </div>
            <StatusBadge status={tanaman.statusVerifikasi} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider flex items-center gap-1"><Calendar size={10} />Tanggal Tanam</p>
              <p className="text-sm font-bold text-blue-800 mt-1">{new Date(tanaman.tanggalTanam).toLocaleDateString('id-ID', {day:'numeric',month:'short',year:'numeric'})}</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
              <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1"><Clock size={10} />Estimasi Panen</p>
              <p className="text-sm font-bold text-amber-800 mt-1">{new Date(tanaman.estimasiPanen).toLocaleDateString('id-ID', {day:'numeric',month:'short',year:'numeric'})}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
            <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase mb-2">
              <span>Progress ({elapsedDays}/{totalDays} hari)</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className={`h-2.5 rounded-full transition-all ${progress >= 100 ? 'bg-amber-500' : progress >= 20 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{width:`${progress}%`}} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Estimasi Hasil</p>
              <p className="text-lg font-bold text-gray-800 mt-1">{tanaman.estimasiHasilKg.toLocaleString()} <span className="text-xs font-medium">Kg</span></p>
            </div>
            {komoditas && (
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Harga Acuan</p>
                <p className="text-lg font-bold text-gray-800 mt-1">Rp {komoditas.hargaSaatIni.toLocaleString()}<span className="text-xs font-medium">/kg</span></p>
              </div>
            )}
          </div>

          {komoditas && (
            <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Estimasi Pendapatan</p>
              <p className="text-xl font-bold text-emerald-800 mt-1">Rp {(tanaman.estimasiHasilKg * komoditas.hargaSaatIni).toLocaleString()}</p>
            </div>
          )}

          {tanaman.luasLahanDigunakan !== undefined && tanaman.luasLahanDigunakan !== null && tanaman.luasLahanDigunakan > 0 && (
            <div className="bg-emerald-50/50 rounded-xl p-3.5 border border-emerald-100/80">
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-2">Detail Kebutuhan Bibit</p>
              <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                <div>
                  <p className="text-[9px] text-gray-400 font-medium">Luas Terpakai</p>
                  <p className="font-bold text-emerald-800 mt-0.5">{tanaman.luasLahanDigunakan.toLocaleString()} m²</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 font-medium">Jarak Tanam</p>
                  <p className="font-bold text-emerald-800 mt-0.5">{tanaman.jarakTanam} cm</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 font-medium">Butuh Bibit</p>
                  <p className="font-bold text-emerald-800 mt-0.5">{tanaman.kebutuhanBibit?.toLocaleString()} Pcs</p>
                </div>
              </div>
            </div>
          )}

          {tanaman.catatan && (
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Catatan Petani</p>
              <p className="text-xs text-gray-700 mt-1.5 leading-relaxed italic">"{tanaman.catatan}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── EDIT TANAMAN MODAL ──
export const EditTanamanModal: React.FC<{
  tanaman: TanamanAktif;
  onClose: () => void;
  onSave: (data: any) => void;
}> = ({ tanaman, onClose, onSave }) => {
  const { komoditas: dummyKomoditas, editTanaman } = useData();
  const [form, setForm] = useState({
    tanggalTanam: tanaman.tanggalTanam,
    estimasiHasilKg: String(tanaman.estimasiHasilKg),
    komoditasId: tanaman.komoditasId,
    catatan: tanaman.catatan || '',
  });
  const [loading, setLoading] = useState(false);

  const komoditas = dummyKomoditas.find((k: Komoditas) => k.id === form.komoditasId);
  let estimasiPanen = tanaman.estimasiPanen;
  if (komoditas?.umurPanenHari && form.tanggalTanam) {
    const d = new Date(form.tanggalTanam);
    d.setDate(d.getDate() + komoditas.umurPanenHari);
    estimasiPanen = d.toISOString().split('T')[0];
  }

  const selectedKomoditas = dummyKomoditas.find((k: Komoditas) => k.id === form.komoditasId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await editTanaman(tanaman.id, {
      tanggalTanam: form.tanggalTanam,
      estimasiPanen,
      estimasiHasilKg: parseFloat(form.estimasiHasilKg),
      catatan: form.catatan,
    });
    setLoading(false);
    if (success) onSave({ ...form, estimasiPanen, komoditasNama: selectedKomoditas?.nama || tanaman.komoditasNama });
    else alert('Gagal menyimpan perubahan tanaman.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-0">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl max-h-[85vh] overflow-y-auto">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Edit Tanaman</h3>
            <p className="text-[11px] text-gray-500">Perbarui data {tanaman.komoditasNama}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Komoditas</label>
            <select className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all" value={form.komoditasId} onChange={e => setForm({...form, komoditasId: e.target.value})}>
              {dummyKomoditas.map((k: Komoditas) => <option key={k.id} value={k.id}>{k.nama}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Tanggal Tanam</label>
            <input required type="date" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all" value={form.tanggalTanam} onChange={e => setForm({...form, tanggalTanam: e.target.value})} />
          </div>
          {estimasiPanen && (
            <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 flex items-center gap-2">
              <Clock size={16} className="text-amber-600" />
              <div>
                <p className="text-[10px] text-amber-600 font-bold uppercase">Estimasi Panen</p>
                <p className="text-xs font-bold text-amber-800">{new Date(estimasiPanen).toLocaleDateString('id-ID', {day:'numeric',month:'long',year:'numeric'})}</p>
              </div>
            </div>
          )}
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Estimasi Hasil (Kg)</label>
            <input required type="number" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all" value={form.estimasiHasilKg} onChange={e => setForm({...form, estimasiHasilKg: e.target.value})} />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Catatan Proses Tanaman</label>
            <textarea 
              rows={3} 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all resize-none shadow-sm" 
              placeholder="Catatan proses budidaya..."
              value={form.catatan} 
              onChange={e => setForm({...form, catatan: e.target.value})} 
            />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3.5 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
            <Save size={16} /> {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      </div>
    </div>
  );
};
