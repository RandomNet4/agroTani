import React from 'react';
import { Warehouse, AlertTriangle, ArrowUpRight, ArrowDownLeft, Box } from 'lucide-react';

const StokGudangPage: React.FC = () => {
  return (
    <div className="animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-800 flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
              <Warehouse size={24} />
            </div>
            Stok & Manajemen Gudang
          </h1>
          <p className="text-sm text-gray-500 mt-1">Pantau ketersediaan sarana tani di gudang pusat dan cabang</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2">
            <ArrowDownLeft size={18} className="text-emerald-500" /> Barang Masuk
          </button>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2">
            <ArrowUpRight size={18} /> Penyesuaian Stok
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12">
            <Box size={80} />
          </div>
          <p className="text-3xl font-display font-bold text-gray-800">1,240</p>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Total SKU Aktif</p>
        </div>
        <div className="bg-red-50 p-8 rounded-[32px] border border-red-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <AlertTriangle size={80} className="text-red-500" />
          </div>
          <p className="text-3xl font-display font-bold text-red-600">8</p>
          <p className="text-xs font-bold text-red-400 uppercase tracking-widest mt-1">Produk Stok Menipis</p>
        </div>
        <div className="bg-indigo-600 p-8 rounded-[32px] shadow-xl shadow-indigo-100 text-white">
          <p className="text-3xl font-display font-bold">14</p>
          <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest mt-1">Lokasi Gudang</p>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl overflow-hidden">
          <div className="p-16 text-center">
          <div className="w-24 h-24 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3">
            <Warehouse size={40} className="text-indigo-300" />
          </div>
          <h4 className="text-xl font-display font-bold text-gray-800 mb-3">Monitoring Gudang Real-time</h4>
          <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
            Halaman ini akan menampilkan dashboard inventaris lengkap termasuk mutasi stok, kartu stok per item, dan integrasi dengan sistem logistik armada.
          </p>
          <div className="mt-8 flex justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-100 animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-indigo-200 animate-pulse delay-75" />
            <div className="w-2 h-2 rounded-full bg-indigo-300 animate-pulse delay-150" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StokGudangPage;
