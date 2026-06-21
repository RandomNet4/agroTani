// =====================================================
// REKOMENDASI TANAM - PETANI (DENGAN TABS)
// =====================================================

import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { ArrowLeft, Sprout, TrendingUp, AlertTriangle, Search, BarChart3, List, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../../components/StatusBadge';
import { formatRupiah } from '../../data/dummy';;;

type TabType = 'rekomendasi' | 'daftar-produk' | 'supply-tracking';

const RekomendasiTanamPage: React.FC = () => {
  const { komoditas: dummyKomoditas } = useData();
  const { rekomendasiTanam: dummyRekomendasiTanam } = useData();
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabType>('rekomendasi');
  const [search, setSearch] = useState('');
  const [kategoriFilter, setKategoriFilter] = useState('semua');

  const kategoris = ['semua', ...new Set(dummyKomoditas.map(k => k.kategori))];

  const filteredKomoditas = dummyKomoditas.filter(k => {
    const matchSearch = k.nama.toLowerCase().includes(search.toLowerCase());
    const matchKategori = kategoriFilter === 'semua' || k.kategori === kategoriFilter;
    return matchSearch && matchKategori;
  });

  const supplyKurang = dummyKomoditas.filter(k => k.supplyStatus === 'kurang');
  const supplyCukup = dummyKomoditas.filter(k => k.supplyStatus === 'cukup');
  const supplyBerlebih = dummyKomoditas.filter(k => k.supplyStatus === 'berlebih');

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-700 to-teal-600 text-white px-4 py-4 pb-6 rounded-b-3xl">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-xl">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-display font-bold text-lg">Rekomendasi Tanam</h1>
            <p className="text-green-100 text-xs">Komoditas yang disarankan berdasarkan kebutuhan pasar</p>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex gap-1 bg-white/10 rounded-xl p-1">
          <button
            onClick={() => setTab('rekomendasi')}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
              tab === 'rekomendasi' ? 'bg-white text-emerald-700' : 'text-white/80 hover:text-white'
            }`}
          >
            <Lightbulb size={14} /> Rekomendasi
          </button>
          <button
            onClick={() => setTab('daftar-produk')}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
              tab === 'daftar-produk' ? 'bg-white text-emerald-700' : 'text-white/80 hover:text-white'
            }`}
          >
            <List size={14} /> Semua Produk
          </button>
          <button
            onClick={() => setTab('supply-tracking')}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
              tab === 'supply-tracking' ? 'bg-white text-emerald-700' : 'text-white/80 hover:text-white'
            }`}
          >
            <BarChart3 size={14} /> Supply
          </button>
        </div>
      </div>

      <div className="px-4 pt-4 pb-4 space-y-3">
        {/* ===== TAB REKOMENDASI ===== */}
        {tab === 'rekomendasi' && (
          <>
            {/* Peringatan Oversupply */}
            {supplyBerlebih.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-3">
                <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-800">Peringatan Kelebihan Produksi</p>
                  <p className="text-xs text-amber-600 mt-1">
                    {supplyBerlebih.map(k => k.nama).join(', ')} sedang kelebihan supply. Hindari menanam komoditas ini untuk sementara.
                  </p>
                </div>
              </div>
            )}

            {/* Rekomendasi Cards */}
            {dummyRekomendasiTanam.map(rek => (
              <div key={rek.id} className={`card border-l-4 ${
                rek.prioritas === 'tinggi' ? 'border-l-red-400' : rek.prioritas === 'sedang' ? 'border-l-amber-400' : 'border-l-blue-400'
              }`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{dummyKomoditas.find(k => k.id === rek.komoditasId)?.gambar}</span>
                      <h3 className="font-semibold">{rek.komoditasNama}</h3>
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      rek.prioritas === 'tinggi' ? 'bg-red-100 text-red-700' : rek.prioritas === 'sedang' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      Prioritas {rek.prioritas}
                    </span>
                  </div>
                  <p className="font-bold text-primary-700 text-sm">{formatRupiah(rek.estimasiHargaJual)}/kg</p>
                </div>
                <p className="text-xs text-gray-600 mb-3">{rek.alasan}</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-[10px] text-gray-500">Kebutuhan</p>
                    <p className="font-bold text-xs">{(rek.kebutuhanKg / 1000).toFixed(0)} ton</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-[10px] text-gray-500">Supply</p>
                    <p className="font-bold text-xs">{(rek.supplySekarangKg / 1000).toFixed(1)} ton</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-2">
                    <p className="text-[10px] text-gray-500">Kekurangan</p>
                    <p className="font-bold text-xs text-red-600">{(rek.selisihKg / 1000).toFixed(1)} ton</p>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* ===== TAB DAFTAR PRODUK / SAYURAN ===== */}
        {tab === 'daftar-produk' && (
          <>
            {/* Search */}
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari produk/sayuran..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            {/* Kategori */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {kategoris.map(k => (
                <button
                  key={k}
                  onClick={() => setKategoriFilter(k)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    kategoriFilter === k ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200'
                  }`}
                >
                  {k === 'semua' ? 'Semua' : k.charAt(0).toUpperCase() + k.slice(1)}
                </button>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-primary-50 rounded-xl p-3 text-center">
              <p className="text-xs text-primary-700 font-medium">Total {filteredKomoditas.length} produk ditemukan</p>
            </div>

            {/* Produk Table */}
            {filteredKomoditas.map(k => (
              <div key={k.id} className="card">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{k.gambar}</span>
                    <div>
                      <h3 className="font-semibold text-sm">{k.nama}</h3>
                      <p className="text-xs text-gray-400 capitalize">{k.kategori}</p>
                    </div>
                  </div>
                  <StatusBadge status={k.supplyStatus} size="sm" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-gray-500">Petani Aktif</p>
                    <p className="font-bold text-lg text-primary-700">{k.jumlahPetaniAktif}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-gray-500">Total Estimasi</p>
                    <p className="font-bold text-lg">{(k.totalEstimasiProduksiKg / 1000).toFixed(1)} <span className="text-xs font-normal">ton</span></p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-gray-500">Estimasi Panen</p>
                    <p className="font-semibold">{k.estimasiBulanPanen}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-gray-500">Harga Saat Ini</p>
                    <p className="font-semibold">{formatRupiah(k.hargaSaatIni)}</p>
                  </div>
                </div>
                {/* Supply Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                    <span>Supply vs Kebutuhan</span>
                    <span>{((k.totalEstimasiProduksiKg / k.kebutuhanBulananKg) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        k.supplyStatus === 'kurang' ? 'bg-red-500' : k.supplyStatus === 'cukup' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min((k.totalEstimasiProduksiKg / k.kebutuhanBulananKg) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>Supply: {(k.totalEstimasiProduksiKg / 1000).toFixed(1)} ton</span>
                    <span>Kebutuhan: {(k.kebutuhanBulananKg / 1000).toFixed(1)} ton</span>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* ===== TAB SUPPLY TRACKING ===== */}
        {tab === 'supply-tracking' && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-red-600">{supplyKurang.length}</p>
                <p className="text-[10px] text-red-500 font-medium">Kurang</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-emerald-600">{supplyCukup.length}</p>
                <p className="text-[10px] text-emerald-500 font-medium">Cukup</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-amber-600">{supplyBerlebih.length}</p>
                <p className="text-[10px] text-amber-500 font-medium">Berlebih</p>
              </div>
            </div>

            {/* Kurang Supply */}
            <div>
              <h3 className="font-semibold text-sm text-red-700 mb-2 flex items-center gap-1">
                <AlertTriangle size={14} /> Komoditas Kurang Supply — Perlu Lebih Banyak Petani
              </h3>
              {supplyKurang.map(k => (
                <div key={k.id} className="card mb-2 border-l-4 border-l-red-400">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{k.gambar}</span>
                      <div>
                        <p className="font-semibold text-sm">{k.nama}</p>
                        <p className="text-xs text-gray-500">{k.jumlahPetaniAktif} petani aktif</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-red-600 font-semibold">
                        Kurang {((k.kebutuhanBulananKg - k.totalEstimasiProduksiKg) / 1000).toFixed(1)} ton
                      </p>
                      <p className="text-[10px] text-gray-400">Panen: {k.estimasiBulanPanen}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cukup */}
            <div>
              <h3 className="font-semibold text-sm text-emerald-700 mb-2 flex items-center gap-1">
                <Sprout size={14} /> Supply Cukup
              </h3>
              {supplyCukup.map(k => (
                <div key={k.id} className="card mb-2 border-l-4 border-l-emerald-400">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{k.gambar}</span>
                      <p className="font-semibold text-sm">{k.nama}</p>
                    </div>
                    <p className="text-xs text-emerald-600 font-medium">{k.jumlahPetaniAktif} petani</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Berlebih */}
            <div>
              <h3 className="font-semibold text-sm text-amber-700 mb-2 flex items-center gap-1">
                <TrendingUp size={14} /> Supply Berlebih — Hindari Menanam
              </h3>
              {supplyBerlebih.map(k => (
                <div key={k.id} className="card mb-2 border-l-4 border-l-amber-400">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{k.gambar}</span>
                      <div>
                        <p className="font-semibold text-sm">{k.nama}</p>
                        <p className="text-xs text-gray-500">{k.jumlahPetaniAktif} petani aktif</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-amber-600 font-semibold">
                        Lebih {((k.totalEstimasiProduksiKg - k.kebutuhanBulananKg) / 1000).toFixed(1)} ton
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RekomendasiTanamPage;
