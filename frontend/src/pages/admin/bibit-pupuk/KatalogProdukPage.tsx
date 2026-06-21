import React, { useState } from 'react';
import { Package, Plus, Edit3, Save, Tag, Search } from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { formatRupiah } from '../../../data/adminDummy';;

const KatalogProdukPage: React.FC = () => {
  const { produkBibitPupuk: dummyProdukBibitPupuk } = useData();
  const [showAdd, setShowAdd] = useState(false);
  const [tab, setTab] = useState<'semua' | 'bibit' | 'pupuk'>('semua');

  const filtered = tab === 'semua' ? dummyProdukBibitPupuk : dummyProdukBibitPupuk.filter(p => p.tipe === tab);

  return (
    <div className="animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-800 flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
              <Package size={24} />
            </div>
            Katalog Produk Sarana Tani
          </h1>
          <p className="text-sm text-gray-500 mt-1">Kelola listing produk bibit dan pupuk untuk para petani</p>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)} 
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-2"
        >
          <Plus size={18} /> Tambah Produk Baru
        </button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-3xl p-6 border-2 border-emerald-100 shadow-xl shadow-emerald-50 mb-8 animate-slide-up overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Package size={120} />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Plus size={20} className="text-emerald-500" /> Informasi Produk Baru
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Nama Produk</label>
              <input type="text" placeholder="Mis: Bibit Tomat Servo F1" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Tipe Produk</label>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all appearance-none cursor-pointer">
                <option value="bibit">🌱 Bibit Tanaman</option>
                <option value="pupuk">🧪 Pupuk & Nutrisi</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Harga Satuan (Rp)</label>
              <input type="number" placeholder="0" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Stok Awal</label>
              <input type="number" placeholder="0" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Satuan Jual</label>
              <input type="text" placeholder="Mis: pak, sak, karung" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Subsidi Pemerintah (%)</label>
              <input type="number" placeholder="0" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all" />
            </div>
            <div className="md:col-span-3 space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Deskripsi & Spesifikasi</label>
              <textarea placeholder="Jelaskan detail keunggulan produk..." className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all min-h-[100px]" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-8 border-t border-gray-100 pt-6">
            <button onClick={() => setShowAdd(false)} className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-all">Batal</button>
            <button onClick={() => { alert('Produk berhasil ditambahkan!'); setShowAdd(false); }} className="bg-emerald-600 text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-emerald-100 flex items-center gap-2">
              <Save size={18} /> Simpan Katalog
            </button>
          </div>
        </div>
      )}

      {/* Filter & Search */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl w-fit">
          {(['semua', 'bibit', 'pupuk'] as const).map(t => (
            <button 
              key={t} 
              onClick={() => setTab(t)}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${tab === t ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {t === 'semua' ? 'Semua Produk' : t === 'bibit' ? '🌱 Bibit' : '🧪 Pupuk'}
            </button>
          ))}
        </div>
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Cari nama produk..." className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all" />
        </div>
      </div>

      {/* Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map(p => (
          <div key={p.id} className="group bg-white rounded-[32px] p-6 border border-gray-100 hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-100/50 transition-all overflow-hidden relative">
            <div className="flex justify-between items-start mb-4">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-4xl shadow-inner group-hover:bg-emerald-50 transition-colors">
                {p.gambar}
              </div>
              <div className="flex flex-col items-end">
                {p.subsidi && (
                  <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter mb-2 flex items-center gap-1">
                    <Tag size={10} /> Bersubsidi {p.diskonPersen}%
                  </span>
                )}
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tighter ${p.tipe === 'bibit' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                  {p.tipe}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-gray-800 text-lg leading-tight group-hover:text-emerald-700 transition-colors">{p.nama}</h3>
              <p className="text-gray-400 text-xs mt-1 line-clamp-2">{p.deskripsi}</p>
            </div>

            <div className="flex items-end justify-between border-t border-gray-50 pt-4 mt-auto">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Harga / {p.satuan}</p>
                <p className="text-xl font-display font-bold text-emerald-600">{formatRupiah(p.harga)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Stok Ready</p>
                <p className={`font-bold text-sm ${p.stok < 50 ? 'text-red-500' : 'text-gray-700'}`}>{p.stok.toLocaleString()} <span className="text-[10px] opacity-60 font-medium">Unit</span></p>
              </div>
            </div>

            <button className="absolute bottom-6 right-6 p-3 bg-gray-50 text-gray-400 rounded-2xl opacity-0 group-hover:opacity-100 group-hover:bg-emerald-600 group-hover:text-white transition-all transform translate-y-2 group-hover:translate-y-0">
              <Edit3 size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KatalogProdukPage;
