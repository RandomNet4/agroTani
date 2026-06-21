// =====================================================
// ADMIN: MANAJEMEN TENDER
// =====================================================

import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { FileText, Plus, Save } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import { formatRupiah, formatTanggal } from '../../data/adminDummy';

const ManajemenTenderPage: React.FC = () => {
  const { tender: dummyTender, komoditas: dummyKomoditas, addTender } = useData();
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    komoditasId: '',
    kebutuhanKg: '',
    hargaPerKg: '',
    periodePanen: '',
    tanggalBerakhir: '',
    deskripsi: '',
  });

  const handleSimpan = async () => {
    if (!form.komoditasId || !form.kebutuhanKg || !form.hargaPerKg) return alert('Lengkapi form!');
    const komoditas = dummyKomoditas.find(k => k.id === form.komoditasId);
    if (!komoditas) return;
    setLoading(true);
    const id = `TDR_${Date.now()}`;
    const success = await addTender({
      id,
      komoditasId: form.komoditasId,
      komoditasNama: komoditas.nama,
      kebutuhanKg: form.kebutuhanKg,
      hargaPerKg: form.hargaPerKg,
      terpenuhinKg: 0,
      status: 'aktif',
      periodePanen: form.periodePanen || '-',
      tanggalBerakhir: form.tanggalBerakhir || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      deskripsi: form.deskripsi,
    });
    setLoading(false);
    if (success) {
      setShowAdd(false);
      setForm({ komoditasId: '', kebutuhanKg: '', hargaPerKg: '', periodePanen: '', tanggalBerakhir: '', deskripsi: '' });
    } else {
      alert('Gagal membuat tender.');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title flex items-center gap-2"><FileText size={24} /> Manajemen Tender</h1>
          <p className="text-sm text-gray-500 mt-1">Buat dan kelola kebutuhan komoditas untuk panen mendatang</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="btn-primary text-sm flex items-center gap-2">
          <Plus size={16} /> Buat Tender Baru
        </button>
      </div>

      {showAdd && (
        <div className="card mb-4 border-2 border-primary-200 animate-slide-up">
          <h3 className="section-title mb-4">Buat Tender Baru</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-field">Komoditas</label>
              <select className="input-field" value={form.komoditasId} onChange={e => setForm({...form, komoditasId: e.target.value})}>
                <option value="">Pilih komoditas</option>
                {dummyKomoditas.map(k => <option key={k.id} value={k.id}>{k.gambar} {k.nama}</option>)}
              </select>
            </div>
            <div>
              <label className="label-field">Kebutuhan (kg)</label>
              <input type="number" placeholder="Jumlah kebutuhan" className="input-field" value={form.kebutuhanKg} onChange={e => setForm({...form, kebutuhanKg: e.target.value})} />
            </div>
            <div>
              <label className="label-field">Harga per kg (Rp)</label>
              <input type="number" placeholder="Harga beli" className="input-field" value={form.hargaPerKg} onChange={e => setForm({...form, hargaPerKg: e.target.value})} />
            </div>
            <div>
              <label className="label-field">Periode Panen</label>
              <input type="text" placeholder="Mis: April 2026" className="input-field" value={form.periodePanen} onChange={e => setForm({...form, periodePanen: e.target.value})} />
            </div>
            <div>
              <label className="label-field">Batas Pendaftaran</label>
              <input type="date" className="input-field" value={form.tanggalBerakhir} onChange={e => setForm({...form, tanggalBerakhir: e.target.value})} />
            </div>
            <div>
              <label className="label-field">Deskripsi</label>
              <input type="text" placeholder="Deskripsi tender" className="input-field" value={form.deskripsi} onChange={e => setForm({...form, deskripsi: e.target.value})} />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => setShowAdd(false)} className="btn-secondary text-sm">Batal</button>
            <button onClick={handleSimpan} disabled={loading} className="btn-primary text-sm flex items-center gap-1 disabled:opacity-50">
              <Save size={14} /> {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </div>
      )}

      {/* Tender Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dummyTender.map(t => {
          const persen = (t.terpenuhinKg / t.kebutuhanKg) * 100;
          return (
            <div key={t.id} className="card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-lg">{t.komoditasNama}</h3>
                  <p className="text-xs text-gray-500">{t.deskripsi}</p>
                </div>
                <StatusBadge status={t.status} />
              </div>
              <div className="grid grid-cols-3 gap-2 text-center mb-3">
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-[10px] text-gray-500">Kebutuhan</p>
                  <p className="font-bold">{(t.kebutuhanKg / 1000).toFixed(0)} ton</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-[10px] text-gray-500">Terpenuhi</p>
                  <p className="font-bold text-primary-700">{(t.terpenuhinKg / 1000).toFixed(1)} ton</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-[10px] text-gray-500">Harga</p>
                  <p className="font-bold">{formatRupiah(t.hargaPerKg)}</p>
                </div>
              </div>
              <div className="mb-2">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span><span>{persen.toFixed(0)}%</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${persen >= 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{ width: `${Math.min(persen, 100)}%` }} />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Periode: {t.periodePanen}</span>
                <span>Batas: {formatTanggal(t.tanggalBerakhir)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ManajemenTenderPage;
