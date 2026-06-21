// =====================================================
// ADMIN: MANAJEMEN HARGA JUAL
// =====================================================

import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { DollarSign, Plus, Edit3, Clock, Save } from 'lucide-react';
import { formatRupiah, formatTanggal } from '../../data/adminDummy';

const ManajemenHargaPage: React.FC = () => {
  const { komoditas: dummyKomoditas, historiHarga: dummyHistoriHarga, updateHargaKomoditas } = useData();
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    komoditasId: '',
    harga: '',
    wilayah: 'Jawa Barat',
  });

  const handleSimpan = async () => {
    if (!form.komoditasId || !form.harga) return alert('Lengkapi form terlebih dahulu!');
    const komoditas = dummyKomoditas.find(k => k.id === form.komoditasId);
    if (!komoditas) return;
    setLoading(true);
    const id = `HRG_${Date.now()}`;
    const success = await updateHargaKomoditas({
      id,
      komoditasId: form.komoditasId,
      komoditasNama: komoditas.nama,
      harga: form.harga,
      wilayah: form.wilayah,
      dibuatOleh: 'Admin',
    });
    setLoading(false);
    if (success) {
      setShowAdd(false);
      setEditingId(null);
      setForm({ komoditasId: '', harga: '', wilayah: 'Jawa Barat' });
    } else {
      alert('Gagal menyimpan harga.');
    }
  };

  const openEdit = (komoditas: any) => {
    setForm({
      komoditasId: komoditas.id,
      harga: String(komoditas.hargaSaatIni),
      wilayah: 'Jawa Barat',
    });
    setEditingId(komoditas.id);
    setShowAdd(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title flex items-center gap-2"><DollarSign size={24} /> Manajemen Harga</h1>
          <p className="text-sm text-gray-500 mt-1">Tetapkan dan update harga beli resmi komoditas</p>
        </div>
        <button onClick={() => { setShowAdd(!showAdd); setEditingId(null); setForm({ komoditasId: '', harga: '', wilayah: 'Jawa Barat' }); }} className="btn-primary text-sm flex items-center gap-2">
          <Plus size={16} /> Tambah Harga
        </button>
      </div>

      {/* Form Tambah / Edit */}
      {showAdd && (
        <div className="card mb-4 border-2 border-primary-200 animate-slide-up">
          <h3 className="section-title mb-4">{editingId ? 'Edit Harga' : 'Tambah / Update Harga Baru'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label-field">Komoditas</label>
              <select className="input-field" value={form.komoditasId} onChange={e => setForm({...form, komoditasId: e.target.value})}>
                <option value="">Pilih komoditas</option>
                {dummyKomoditas.map(k => <option key={k.id} value={k.id}>{k.gambar} {k.nama}</option>)}
              </select>
            </div>
            <div>
              <label className="label-field">Harga Baru (Rp/kg)</label>
              <input type="number" placeholder="Masukkan harga" className="input-field" value={form.harga} onChange={e => setForm({...form, harga: e.target.value})} />
            </div>
            <div>
              <label className="label-field">Wilayah</label>
              <input type="text" placeholder="Mis: Jawa Barat" className="input-field" value={form.wilayah} onChange={e => setForm({...form, wilayah: e.target.value})} />
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

      {/* Harga Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Komoditas</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Harga Saat Ini</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Harga Sebelumnya</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Perubahan</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Last Update</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dummyKomoditas.map(k => {
                const selisih = k.hargaSaatIni - k.hargaSebelumnya;
                const persen = ((selisih / k.hargaSebelumnya) * 100).toFixed(1);
                return (
                  <tr key={k.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{k.gambar}</span>
                        <div>
                          <span className="font-medium">{k.nama}</span>
                          <p className="text-xs text-gray-400 capitalize">{k.kategori}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold text-primary-700">{formatRupiah(k.hargaSaatIni)}</td>
                    <td className="px-4 py-3 text-gray-500">{formatRupiah(k.hargaSebelumnya)}</td>
                    <td className={`px-4 py-3 font-semibold ${selisih > 0 ? 'text-emerald-600' : selisih < 0 ? 'text-red-600' : 'text-gray-400'}`}>
                      {selisih > 0 ? '+' : ''}{persen}%
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{formatTanggal(k.lastUpdate)}</td>
                    <td className="px-4 py-3">
                      <button className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100" onClick={() => openEdit(k)} title="Edit harga">
                        <Edit3 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Histori Harga */}
      <div className="mt-6">
        <h2 className="section-title flex items-center gap-2 mb-4"><Clock size={18} /> Histori Perubahan Harga</h2>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Komoditas</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Harga</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {[...dummyHistoriHarga]
                  .sort((a, b) => {
                    const diff = new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime();
                    if (diff !== 0) return diff;
                    return b.id.localeCompare(a.id);
                  })
                  .map(h => {
                    const komoditas = dummyKomoditas.find(k => k.id === h.komoditasId);
                    return (
                      <tr key={h.id} className="border-b border-gray-50">
                        <td className="px-4 py-2 text-gray-600">{komoditas?.gambar} {komoditas?.nama}</td>
                        <td className="px-4 py-2 font-medium">{formatRupiah(h.harga)}</td>
                        <td className="px-4 py-2 text-gray-500 text-xs">{formatTanggal(h.tanggal)}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManajemenHargaPage;
