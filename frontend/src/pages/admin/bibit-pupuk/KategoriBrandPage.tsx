import React from 'react';
import { Tags, Plus, FolderTree, Bookmark, MoreVertical } from 'lucide-react';

const KategoriBrandPage: React.FC = () => {
  return (
    <div className="animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-800 flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
              <Tags size={24} />
            </div>
            Kategori & Brand Sarana Tani
          </h1>
          <p className="text-sm text-gray-500 mt-1">Atur pengelompokan produk untuk mempermudah pencarian petani</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2">
            <Bookmark size={18} /> Kelola Brand
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2">
            <Plus size={18} /> Tambah Kategori
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FolderTree size={20} className="text-blue-500" /> Daftar Kategori Utama
          </h3>
          <div className="space-y-4">
            {[
              { nama: 'Bibit Sayuran', count: 12, color: 'emerald' },
              { nama: 'Bibit Buah', count: 8, color: 'orange' },
              { nama: 'Pupuk Cair Organik', count: 15, color: 'blue' },
              { nama: 'Pupuk Padat NPK', count: 6, color: 'indigo' },
              { nama: 'Pestisida & Nutrisi', count: 10, color: 'red' },
            ].map((cat, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full bg-${cat.color}-500 group-hover:scale-150 transition-transform`} />
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{cat.nama}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{cat.count} Produk Terdaftar</p>
                  </div>
                </div>
                <button className="p-2 text-gray-300 hover:text-gray-600"><MoreVertical size={16} /></button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-600 rounded-[32px] p-8 text-white relative overflow-hidden flex flex-col justify-end min-h-[300px] shadow-2xl shadow-blue-200">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Tags size={180} />
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl font-display font-bold mb-2">Struktur Hirarki</h3>
            <p className="text-blue-100 text-sm mb-8 max-w-xs">Pastikan setiap produk memiliki kategori yang akurat untuk efisiensi distribusi subsidi di lapangan.</p>
            <div className="flex gap-4">
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 flex-1">
                <p className="text-2xl font-bold">42</p>
                <p className="text-[10px] font-bold uppercase opacity-60">Brand Aktif</p>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 flex-1">
                <p className="text-2xl font-bold">18</p>
                <p className="text-[10px] font-bold uppercase opacity-60">Sub-Kategori</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KategoriBrandPage;
