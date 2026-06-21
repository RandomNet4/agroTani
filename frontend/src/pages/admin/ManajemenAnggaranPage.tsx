import React, { useState } from 'react';
import { Wallet, ArrowDownRight, ArrowUpRight, FileText, Search, Box } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatRupiah, formatTanggal } from '../../data/adminDummy';;

const ManajemenAnggaranPage: React.FC = () => {
  const { bukuKas: dummyBukuKas } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  
  const totalAnggaran = dummyBukuKas
    .filter(b => b.tipeTransaksi === 'Uang Masuk')
    .reduce((s, b) => s + b.nominal, 0);
    
  const totalPencairan = dummyBukuKas
    .filter(b => b.tipeTransaksi === 'Uang Keluar' && b.kategori === 'Pembayaran Petani')
    .reduce((s, b) => s + b.nominal, 0);
    
  // Saldo akhir adalah saldo pada baris transaksi terakhir
  const saldoAkhir = dummyBukuKas.length > 0 ? dummyBukuKas[dummyBukuKas.length - 1].saldoAkhir : 0;

  const filteredKas = dummyBukuKas.filter(k => 
    k.keterangan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.kategori.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title flex items-center gap-2"><Wallet size={24} /> Transparansi Anggaran</h1>
          <p className="text-sm text-gray-500 mt-1">Dashboard Buku Kas pengeluaran dan pemasukan dana operasional (Read-Only)</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card from-emerald-600 to-emerald-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-emerald-100 text-xs">Total Anggaran (Masuk)</p>
              <p className="text-2xl font-bold mt-1">{formatRupiah(totalAnggaran)}</p>
            </div>
            <div className="p-2 bg-white/20 rounded-xl"><ArrowDownRight className="text-white" size={20} /></div>
          </div>
        </div>
        <div className="stat-card from-rose-500 to-rose-600">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-rose-100 text-xs">Total Pencairan (Keluar)</p>
              <p className="text-2xl font-bold mt-1">{formatRupiah(totalPencairan)}</p>
            </div>
            <div className="p-2 bg-white/20 rounded-xl"><ArrowUpRight className="text-white" size={20} /></div>
          </div>
        </div>
        <div className="stat-card from-primary-600 to-primary-700 shadow-md ring-2 ring-primary-400 ring-offset-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-primary-100 text-xs font-semibold">Saldo Akhir Aktual</p>
              <p className="text-2xl font-bold mt-1">{formatRupiah(saldoAkhir)}</p>
            </div>
            <div className="p-2 bg-white/20 rounded-xl"><Box className="text-white" size={20} /></div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl">
        <p className="text-sm font-semibold text-amber-800">🔒 Terkunci & Tercatat Otomatis</p>
        <p className="text-xs text-amber-700 mt-1">Sistem buku kas ini memiliki fitur <strong>Zero-Trust</strong>. Semua uang keluar untuk pembayaran panen akan langsung tersedot dan tercatat ke kas ketika admin memvalidasi pembayaran secara Cash/TDF, memastikan tidak ada <i>mark-up</i> atau manipulasi pengeluaran dana.</p>
      </div>

      {/* Tabel Kas */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50/50">
          <h2 className="font-semibold text-gray-700 flex items-center gap-2"><FileText size={18}/> Riwayat Buku Kas</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Cari transaksi..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none w-64"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600">
                <th className="text-left px-4 py-3 font-semibold">ID</th>
                <th className="text-left px-4 py-3 font-semibold">Tanggal</th>
                <th className="text-left px-4 py-3 font-semibold">Kategori</th>
                <th className="text-left px-4 py-3 font-semibold">Keterangan</th>
                <th className="text-right px-4 py-3 font-semibold">Masuk</th>
                <th className="text-right px-4 py-3 font-semibold">Keluar</th>
                <th className="text-right px-4 py-3 font-semibold">Saldo Akhir</th>
              </tr>
            </thead>
            <tbody>
              {filteredKas.map((bk) => (
                <tr key={bk.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{bk.id}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{formatTanggal(bk.tanggal)}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-gray-100 text-gray-700">
                      {bk.kategori}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700 max-w-md">
                    <p className="line-clamp-2">{bk.keterangan}</p>
                    {bk.referensiId && <p className="text-[10px] text-gray-400 mt-1 font-mono">Ref: {bk.referensiId}</p>}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-emerald-600">
                    {bk.tipeTransaksi === 'Uang Masuk' ? `+${formatRupiah(bk.nominal)}` : '-'}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-rose-600">
                    {bk.tipeTransaksi === 'Uang Keluar' ? `-${formatRupiah(bk.nominal)}` : '-'}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-gray-800 bg-gray-50/50">
                    {formatRupiah(bk.saldoAkhir)}
                  </td>
                </tr>
              ))}
              {filteredKas.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500 bg-gray-50/50">
                    Tidak ada riwayat transaksi yang sesuai.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManajemenAnggaranPage;
