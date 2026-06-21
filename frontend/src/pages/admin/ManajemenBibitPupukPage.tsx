// =====================================================
// ADMIN: MANAJEMEN BIBIT & PUPUK
// =====================================================

import React, { useState } from 'react';
import { Package, Plus, Edit3, Save, Tag } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatRupiah } from '../../data/adminDummy';;

const ManajemenBibitPupukPage: React.FC = () => {
  const { produkBibitPupuk: dummyProdukBibitPupuk } = useData();
  const [showAdd, setShowAdd] = useState(false);
  const [tab, setTab] = useState<'semua' | 'bibit' | 'pupuk'>('semua');

  const filtered = tab === 'semua' ? dummyProdukBibitPupuk : dummyProdukBibitPupuk.filter(p => p.tipe === tab);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title flex items-center gap-2"><Package size={24} /> Manajemen Bibit & Pupuk</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola katalog bibit dan pupuk termasuk harga, stok, dan subsidi</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="btn-primary text-sm flex items-center gap-2">
          <Plus size={16} /> Tambah Produk
        </button>
      </div>

      {showAdd && (
        <div className="card mb-4 border-2 border-primary-200 animate-slide-up">
          <h3 className="section-title mb-4">Tambah Produk Baru</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label-field">Nama Produk</label>
              <input type="text" placeholder="Nama bibit/pupuk" className="input-field" />
            </div>
            <div>
              <label className="label-field">Tipe</label>
              <select className="input-field"><option value="bibit">Bibit</option><option value="pupuk">Pupuk</option></select>
            </div>
            <div>
              <label className="label-field">Harga (Rp)</label>
              <input type="number" placeholder="Harga" className="input-field" />
            </div>
            <div>
              <label className="label-field">Stok</label>
              <input type="number" placeholder="Jumlah stok" className="input-field" />
            </div>
            <div>
              <label className="label-field">Satuan</label>
              <input type="text" placeholder="Mis: pak, karung" className="input-field" />
            </div>
            <div>
              <label className="label-field">Diskon Subsidi (%)</label>
              <input type="number" placeholder="0" className="input-field" />
            </div>
            <div className="md:col-span-3">
              <label className="label-field">Deskripsi</label>
              <textarea placeholder="Deskripsi produk" className="input-field" rows={2} />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => setShowAdd(false)} className="btn-secondary text-sm">Batal</button>
            <button onClick={() => { alert('Produk disimpan!'); setShowAdd(false); }} className="btn-primary text-sm flex items-center gap-1"><Save size={14} /> Simpan</button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {(['semua', 'bibit', 'pupuk'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${tab === t ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
            {t === 'semua' ? 'Semua' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Produk</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Tipe</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Harga</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Stok</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Satuan</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Subsidi</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{p.gambar}</span>
                      <div>
                        <span className="font-medium">{p.nama}</span>
                        <p className="text-xs text-gray-400 max-w-xs truncate">{p.deskripsi}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.tipe === 'bibit' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>{p.tipe}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold">{formatRupiah(p.harga)}</td>
                  <td className="px-4 py-3">{p.stok}</td>
                  <td className="px-4 py-3 text-gray-600">{p.satuan}</td>
                  <td className="px-4 py-3">
                    {p.subsidi ? (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold flex items-center gap-0.5 w-fit">
                        <Tag size={10} /> {p.diskonPersen}%
                      </span>
                    ) : <span className="text-xs text-gray-400">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <button className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Edit3 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManajemenBibitPupukPage;


