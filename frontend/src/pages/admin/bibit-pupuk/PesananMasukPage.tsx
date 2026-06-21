import React from 'react';
import { ListOrdered, Search, ShoppingBag, Clock, CheckCircle2, Truck } from 'lucide-react';

const PesananMasukPage: React.FC = () => {
  return (
    <div className="animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-800 flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-xl">
              <ListOrdered size={24} />
            </div>
            Pesanan Masuk (E-Commerce)
          </h1>
          <p className="text-sm text-gray-500 mt-1">Pantau dan proses pemesanan bibit/pupuk dari para petani</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Pesanan Baru', count: 5, color: 'blue', icon: <ShoppingBag size={18} /> },
          { label: 'Perlu Diproses', count: 3, color: 'amber', icon: <Clock size={18} /> },
          { label: 'Dalam Pengiriman', count: 8, color: 'indigo', icon: <Truck size={18} /> },
          { label: 'Selesai', count: 124, color: 'emerald', icon: <CheckCircle2 size={18} /> },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 bg-${stat.color}-50 text-${stat.color}-600 rounded-xl flex items-center justify-center mb-4`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-gray-800">{stat.count}</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-wrap items-center justify-between gap-4">
          <h3 className="font-bold text-gray-800">Riwayat Pesanan Terbaru</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="text" placeholder="Cai No. Pesanan..." className="bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-4 py-2 text-xs focus:ring-2 focus:ring-amber-500 outline-none" />
            </div>
          </div>
        </div>
        <div className="p-12 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <ListOrdered size={32} className="text-gray-300" />
          </div>
          <h4 className="font-bold text-gray-800 italic">Modul Pesanan Siap Dikembangkan</h4>
          <p className="text-sm text-gray-400 max-w-xs mx-auto mt-2">Data pesanan real akan muncul di sini setelah sistem integrasi marketplace petani diaktifkan.</p>
        </div>
      </div>
    </div>
  );
};

export default PesananMasukPage;
