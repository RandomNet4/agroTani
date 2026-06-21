// =====================================================
// ADMIN: MANAJEMEN EDUKASI & INFORMASI
// =====================================================

import React, { useState } from 'react';
import { BookOpen, Plus, Edit3, Trash2, Save, Eye } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatTanggal } from '../../data/adminDummy';

const ManajemenEdukasiPage: React.FC = () => {
  const { artikelEdukasi: dummyArtikelEdukasi, addEdukasi } = useData();
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    judul: '',
    tipe: 'artikel',
    kategori: '',
    isi: '',
    urlVideo: '',
    penulis: 'Tim Agro Jabar',
    gambar: '📚',
  });

  const handlePublish = async () => {
    if (!form.judul) return alert('Judul tidak boleh kosong!');
    setLoading(true);
    const id = `EDU_${Date.now()}`;
    const success = await addEdukasi({
      id,
      judul: form.judul,
      isi: form.isi || '-',
      gambar: form.tipe === 'video' ? '🎥' : '📰',
      kategori: form.kategori || 'Umum',
      penulis: form.penulis,
      tipe: form.tipe,
      urlVideo: form.urlVideo || null,
    });
    setLoading(false);
    if (success) {
      setShowAdd(false);
      setForm({ judul: '', tipe: 'artikel', kategori: '', isi: '', urlVideo: '', penulis: 'Tim Agro Jabar', gambar: '📚' });
    } else {
      alert('Gagal mempublish artikel.');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title flex items-center gap-2"><BookOpen size={24} /> Manajemen Edukasi</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola artikel, video edukasi, dan berita untuk petani</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="btn-primary text-sm flex items-center gap-2">
          <Plus size={16} /> Tambah Artikel
        </button>
      </div>

      {showAdd && (
        <div className="card mb-4 border-2 border-primary-200 animate-slide-up">
          <h3 className="section-title mb-4">Tambah Artikel / Video</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="label-field">Judul</label>
              <input type="text" placeholder="Judul artikel/video" className="input-field" value={form.judul} onChange={e => setForm({...form, judul: e.target.value})} />
            </div>
            <div>
              <label className="label-field">Tipe</label>
              <select className="input-field" value={form.tipe} onChange={e => setForm({...form, tipe: e.target.value})}>
                <option value="artikel">Artikel</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div>
              <label className="label-field">Kategori</label>
              <input type="text" placeholder="Mis: Budidaya, Tutorial" className="input-field" value={form.kategori} onChange={e => setForm({...form, kategori: e.target.value})} />
            </div>
            <div className="md:col-span-2">
              <label className="label-field">Isi Artikel</label>
              <textarea placeholder="Tulis isi artikel..." className="input-field" rows={5} value={form.isi} onChange={e => setForm({...form, isi: e.target.value})} />
            </div>
            <div>
              <label className="label-field">URL Video (jika video)</label>
              <input type="url" placeholder="https://youtube.com/..." className="input-field" value={form.urlVideo} onChange={e => setForm({...form, urlVideo: e.target.value})} />
            </div>
            <div>
              <label className="label-field">Penulis</label>
              <input type="text" placeholder="Nama penulis" className="input-field" value={form.penulis} onChange={e => setForm({...form, penulis: e.target.value})} />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => setShowAdd(false)} className="btn-secondary text-sm">Batal</button>
            <button onClick={handlePublish} disabled={loading} className="btn-primary text-sm flex items-center gap-1 disabled:opacity-50">
              <Save size={14} /> {loading ? 'Memproses...' : 'Publish'}
            </button>
          </div>
        </div>
      )}

      {/* Artikel Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Judul</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Tipe</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Kategori</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Penulis</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Tanggal</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dummyArtikelEdukasi.map(a => (
                <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{a.gambar}</span>
                      <span className="font-medium max-w-xs truncate">{a.judul}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${a.tipe === 'video' ? 'bg-red-100 text-red-700' : 'bg-purple-100 text-purple-700'}`}>{a.tipe}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">{a.kategori}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{a.penulis}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{formatTanggal(a.tanggalPublish)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100" title="Lihat"><Eye size={16} /></button>
                      <button className="p-1.5 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100" title="Edit"><Edit3 size={16} /></button>
                      <button className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100" title="Hapus (coming soon)"><Trash2 size={16} /></button>
                    </div>
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

export default ManajemenEdukasiPage;
