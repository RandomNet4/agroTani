// =====================================================
// ADMIN: MONITORING SUPPLY & FORECAST
// =====================================================

import React from 'react';
import { useData } from '../../context/DataContext';
import { BarChart3, Sprout, Calendar } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';

// Helper: Hitung progress tanam (0-100%)
const hitungProgressTanam = (tanggalTanam: string, estimasiPanen: string): number => {
  const mulai = new Date(tanggalTanam).getTime();
  const selesai = new Date(estimasiPanen).getTime();
  const sekarang = Date.now();
  if (sekarang >= selesai) return 100;
  if (sekarang <= mulai) return 0;
  return Math.round(((sekarang - mulai) / (selesai - mulai)) * 100);
};

// Helper: Hitung hari menuju tanggal
const hitungHariMenuju = (tanggal: string): number => {
  const target = new Date(tanggal);
  const sekarang = new Date();
  return Math.ceil((target.getTime() - sekarang.getTime()) / (1000 * 60 * 60 * 24));
};

const MonitoringSupplyPage: React.FC = () => {
  const { komoditas: dummyKomoditas } = useData();
  const { tanamanAktif: dummyTanamanAktif, petani: dummyPetani } = useData();
  const totalProduksi = dummyKomoditas.reduce((s, k) => s + k.totalEstimasiProduksiKg, 0);
  const totalKebutuhan = dummyKomoditas.reduce((s, k) => s + k.kebutuhanBulananKg, 0);
  const kurang = dummyKomoditas.filter(k => k.supplyStatus === 'kurang');
  const cukup = dummyKomoditas.filter(k => k.supplyStatus === 'cukup');
  const berlebih = dummyKomoditas.filter(k => k.supplyStatus === 'berlebih');

  // Get petani name by id
  const getPetaniNama = (petaniId: string) => dummyPetani.find(p => p.id === petaniId)?.nama || petaniId;

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="page-title flex items-center gap-2"><BarChart3 size={24} /> Monitoring Supply & Forecast</h1>
        <p className="text-sm text-gray-500 mt-1">Estimasi supply berdasarkan tanaman aktif vs kebutuhan</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="stat-card from-blue-500 to-blue-600">
          <p className="text-blue-100 text-xs mb-1">Total Estimasi Produksi</p>
          <p className="text-3xl font-bold">{(totalProduksi / 1000).toFixed(0)} ton</p>
          <p className="text-blue-200 text-xs mt-1">{dummyTanamanAktif.length} tanaman aktif</p>
        </div>
        <div className="stat-card from-purple-500 to-purple-600">
          <p className="text-purple-100 text-xs mb-1">Total Kebutuhan</p>
          <p className="text-3xl font-bold">{(totalKebutuhan / 1000).toFixed(0)} ton</p>
          <p className="text-purple-200 text-xs mt-1">{dummyKomoditas.length} komoditas</p>
        </div>
        <div className="stat-card from-red-500 to-red-600">
          <p className="text-red-100 text-xs mb-1">Kurang Supply</p>
          <p className="text-3xl font-bold">{kurang.length}</p>
          <p className="text-red-200 text-xs mt-1">Butuh lebih banyak petani</p>
        </div>
        <div className="stat-card from-emerald-500 to-emerald-600">
          <p className="text-emerald-100 text-xs mb-1">Supply Tercukupi</p>
          <p className="text-3xl font-bold">{cukup.length + berlebih.length}</p>
          <p className="text-emerald-200 text-xs mt-1">{berlebih.length} berlebih</p>
        </div>
      </div>

      {/* Supply Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="section-title">Detail Supply per Komoditas</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Komoditas</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Petani</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Estimasi Supply</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Kebutuhan</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Selisih</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">%</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Panen</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {dummyKomoditas.sort((a, b) => {
                const order = { kurang: 0, cukup: 1, berlebih: 2 };
                return order[a.supplyStatus] - order[b.supplyStatus];
              }).map(k => {
                const selisih = k.totalEstimasiProduksiKg - k.kebutuhanBulananKg;
                const persen = (k.totalEstimasiProduksiKg / k.kebutuhanBulananKg * 100);
                return (
                  <tr key={k.id} className={`border-b border-gray-50 hover:bg-gray-50/50 ${k.supplyStatus === 'kurang' ? 'bg-red-50/30' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{k.gambar}</span>
                        <span className="font-medium">{k.nama}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold">{k.jumlahPetaniAktif}</td>
                    <td className="px-4 py-3 text-gray-600">{(k.totalEstimasiProduksiKg / 1000).toFixed(1)} ton</td>
                    <td className="px-4 py-3 text-gray-600">{(k.kebutuhanBulananKg / 1000).toFixed(1)} ton</td>
                    <td className={`px-4 py-3 font-semibold ${selisih < 0 ? 'text-red-600' : selisih > 0 ? 'text-emerald-600' : 'text-gray-600'}`}>
                      {selisih >= 0 ? '+' : ''}{(selisih / 1000).toFixed(1)} ton
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${persen < 80 ? 'bg-red-500' : persen <= 120 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                            style={{ width: `${Math.min(persen, 100)}%` }} />
                        </div>
                        <span className="text-xs text-gray-500">{persen.toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{k.estimasiBulanPanen}</td>
                    <td className="px-4 py-3"><StatusBadge status={k.supplyStatus} size="sm" /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== TANAMAN AKTIF PETANI (Admin Monitoring) ===== */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mt-6">
        <div className="p-4 border-b border-gray-100">
          <h2 className="section-title flex items-center gap-2">
            <Sprout size={20} className="text-primary-600" />
            Tanaman Aktif Petani
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">Pantau progress tanaman semua petani mitra</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Petani</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Komoditas</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Progress</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Est. Hasil</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Sisa Hari</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Verifikasi</th>
              </tr>
            </thead>
            <tbody>
              {dummyTanamanAktif.map(tanaman => {
                const progress = hitungProgressTanam(tanaman.tanggalTanam, tanaman.estimasiPanen);
                const hariSisa = hitungHariMenuju(tanaman.estimasiPanen);
                const progressColor =
                  progress >= 75 ? 'bg-emerald-500' :
                  progress >= 40 ? 'bg-amber-500' :
                  'bg-orange-500';

                return (
                  <tr key={tanaman.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {(() => {
                          const profilePhoto = dummyPetani.find(p => p.id === tanaman.petaniId)?.fotoProfil;
                          return profilePhoto && (profilePhoto.startsWith('data:image/') || profilePhoto.startsWith('http') || profilePhoto.includes('.')) ? (
                            <img src={profilePhoto} alt="Foto Profil" className="w-6 h-6 rounded-full object-cover shrink-0 border border-gray-100" />
                          ) : (
                            <span className="text-lg">{profilePhoto || '👤'}</span>
                          );
                        })()}
                        <span className="font-medium text-gray-800">{getPetaniNama(tanaman.petaniId)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{tanaman.fotoTanaman}</span>
                        <span>{tanaman.komoditasNama}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${progressColor}`}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                        <span className={`text-xs font-bold ${
                          progress >= 75 ? 'text-emerald-600' :
                          progress >= 40 ? 'text-amber-600' :
                          'text-orange-600'
                        }`}>
                          {progress}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{tanaman.estimasiHasilKg.toLocaleString()} kg</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} className="text-gray-400" />
                        <span className={`text-xs font-medium ${hariSisa <= 7 ? 'text-emerald-600' : hariSisa <= 30 ? 'text-amber-600' : 'text-gray-500'}`}>
                          {hariSisa > 0 ? `${hariSisa} hari` : 'Siap panen'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={tanaman.statusVerifikasi} size="sm" /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MonitoringSupplyPage;
