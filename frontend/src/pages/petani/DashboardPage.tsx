// =====================================================
// DASHBOARD PETANI (HOME) - REDESIGN PREMIUM & CLEAN
// =====================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell, TrendingUp, ShoppingCart,
  ChevronRight, Leaf, ArrowUp, ArrowDown, Minus,
  Lightbulb, BookOpen, MapPin, Users, ClipboardCheck, Calendar
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatRupiah } from '../../data/dummy';

const DashboardPage: React.FC = () => {
  const {
    komoditas: dummyKomoditas,
    notifikasi: dummyNotifikasi,
    currentUser,
    petani: dummyPetani,
    lahan: dummyLahan,
    tanamanAktif: dummyTanamanAktif
  } = useData();
  const navigate = useNavigate();

  const notifBelumDibaca = dummyNotifikasi.filter(n => !n.dibaca);
  const hargaTrending = dummyKomoditas.slice(0, 10);

  // Perhitungan Data Kelompok Tani (Kepala Petani)
  const anggotaKelompok = dummyPetani.filter(p => p.kepalaPetaniId === currentUser?.id);
  const anggotaIds = anggotaKelompok.map(a => a.id);
  const lahanKelompok = dummyLahan.filter(l => anggotaIds.includes(l.petaniId));
  const tanamanKelompok = dummyTanamanAktif.filter(t => anggotaIds.includes(t.petaniId));
  
  const totalAnggota = anggotaKelompok.length;
  const totalLuasLahan = lahanKelompok.reduce((sum, l) => sum + l.luasHektar, 0);
  const totalTanamanAktif = tanamanKelompok.length;
  const inspeksiPending = tanamanKelompok.filter(t => t.statusVerifikasi === 'pending' || t.statusVerifikasi === 'survey');

  // Urutkan jadwal panen anggota terdekat
  const jadwalPanenTerdekat = [...tanamanKelompok]
    .filter(t => t.statusVerifikasi === 'approved')
    .sort((a, b) => new Date(a.estimasiPanen).getTime() - new Date(b.estimasiPanen).getTime())
    .slice(0, 3);

  const services = [
    { title: 'Rekomendasi', icon: Lightbulb, path: '/petani/rekomendasi', desc: 'Tanam apa?' },
    { title: 'Edukasi', icon: BookOpen, path: '/petani/edukasi', desc: 'Artikel & tips' },
  ];

  // RENDER KHUSUS KEPALA PETANI
  if (currentUser?.role === 'kepala_petani') {
    return (
      <div className="bg-gray-50 min-h-screen pb-24">
        {/* ── HEADER ── */}
        <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-primary-700 text-white px-5 pt-8 pb-6 relative rounded-b-3xl border-x-2 border-b-2 border-emerald-500/30 shadow-lg shadow-emerald-900/10 overflow-hidden">
          <div className="absolute top-0 right-0 w-56 h-56 bg-white/[0.04] rounded-full -mr-28 -mt-28 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-white/[0.04] rounded-full -ml-18 mb-2 blur-2xl" />
          <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-amber-400/10 rounded-full blur-xl" />
          
          {/* Top bar */}
          <div className="flex items-center justify-between mb-5 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white/15 rounded-xl flex items-center justify-center border border-white/20 backdrop-blur-sm">
                <Leaf size={20} className="text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider">Koordinator Wilayah</p>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                </div>
                <h1 className="font-display font-bold text-lg leading-tight">{currentUser?.nama || ''}</h1>
                <p className="text-white/50 text-[10px] flex items-center gap-1 mt-0.5">
                  <MapPin size={9} />
                  Kec. {currentUser.kecamatan}, {currentUser.kabupaten}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/petani/notifikasi')}
              className="relative p-2.5 bg-white/10 rounded-xl border border-white/15 active:scale-95 transition-all"
            >
              <Bell size={18} />
              {notifBelumDibaca.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[8px] font-bold flex items-center justify-center shadow-sm">
                  {notifBelumDibaca.length}
                </span>
              )}
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-4 gap-2 relative z-10 mt-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 border border-white/10 text-center">
              <p className="text-xl font-bold leading-none">{totalAnggota}</p>
              <p className="text-white/60 text-[8px] uppercase font-bold tracking-wider mt-1.5">Anggota</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 border border-white/10 text-center">
              <p className="text-xl font-bold leading-none">{totalLuasLahan.toFixed(1)} <span className="text-[9px] font-normal">Ha</span></p>
              <p className="text-white/60 text-[8px] uppercase font-bold tracking-wider mt-1.5">Lahan</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 border border-white/10 text-center">
              <p className="text-xl font-bold leading-none">{totalTanamanAktif}</p>
              <p className="text-white/60 text-[8px] uppercase font-bold tracking-wider mt-1.5">Tanaman</p>
            </div>
            <div className={`backdrop-blur-sm rounded-xl p-2.5 border text-center transition-all ${
              inspeksiPending.length > 0
                ? 'bg-amber-500/35 border-amber-400/50 ring-1 ring-amber-400'
                : 'bg-white/10 border-white/10'
            }`}>
              <p className={`text-xl font-bold leading-none ${inspeksiPending.length > 0 ? 'text-amber-200' : 'text-white'}`}>
                {inspeksiPending.length}
              </p>
              <p className="text-white/60 text-[8px] uppercase font-bold tracking-wider mt-1.5">Inspeksi</p>
            </div>
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div className="px-5 pt-5 pb-6 space-y-5">
          {/* ── NOTIFIKASI INSPEKSI PENDING ── */}
          {inspeksiPending.length > 0 && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-4 shadow-sm flex items-start gap-3 relative overflow-hidden">
              <div className="w-1.5 h-full bg-amber-500 absolute left-0 top-0 bottom-0" />
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-700 shrink-0">
                <ClipboardCheck size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm text-amber-800">Verifikasi Lapangan Pending</h3>
                <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                  Ada <b>{inspeksiPending.length}</b> tanaman aktif anggota kelompok yang memerlukan inspeksi fisik & validasi GPS Anda.
                </p>
                <button
                  onClick={() => navigate('/petani/inspeksi')}
                  className="mt-2 text-xs font-bold text-amber-900 bg-amber-200/50 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-all"
                >
                  Mulai Inspeksi Sekarang →
                </button>
              </div>
            </div>
          )}

          {/* ── LAYANAN KELOMPOK ── */}
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3">Layanan Koordinator</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate('/petani/kelompok')}
                className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 transition-all active:scale-[0.98] shadow-sm hover:shadow-md hover:border-emerald-100 group"
              >
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                  <Users size={18} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-gray-800 leading-tight">Data Anggota</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Kelola kelompok tani</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/petani/inspeksi')}
                className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 transition-all active:scale-[0.98] shadow-sm hover:shadow-md hover:border-emerald-100 group"
              >
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                  <ClipboardCheck size={18} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-gray-800 leading-tight">Inspeksi Lahan</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Validasi fisik & GPS</p>
                </div>
              </button>
            </div>
          </div>

          {/* ── JADWAL PANEN ANGGOTA TERDEKAT ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-4">
            <h2 className="font-bold text-sm text-gray-800 flex items-center gap-2 mb-3">
              <Calendar size={16} className="text-emerald-600" />
              Panen Anggota Terdekat
            </h2>
            {jadwalPanenTerdekat.length === 0 ? (
              <p className="text-xs text-gray-400 py-3 text-center">Belum ada jadwal panen terverifikasi dalam kelompok ini.</p>
            ) : (
              <div className="space-y-3">
                {jadwalPanenTerdekat.map(crop => {
                  const owner = anggotaKelompok.find(a => a.id === crop.petaniId);
                  return (
                    <div key={crop.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div>
                        <p className="font-bold text-xs text-gray-800">{crop.komoditasNama}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">Petani: {owner?.nama || 'Anggota Tani'}</p>
                        <p className="text-[9px] text-primary-600 mt-0.5 bg-primary-50 px-1.5 py-0.5 rounded inline-block font-semibold">
                          Estimasi: {crop.estimasiPanen} ({crop.estimasiHasilKg} kg)
                        </p>
                      </div>
                      <span className="text-xs font-bold text-gray-400">
                        {formatRupiah(hargaTrending.find(h => h.id === crop.komoditasId)?.hargaSaatIni || 0)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── HARGA KOMODITAS ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <h2 className="font-bold text-sm text-gray-800 flex items-center gap-2">
                <TrendingUp size={15} className="text-emerald-600" />
                Harga Pasar Acuan
              </h2>
              <button
                onClick={() => navigate('/petani/harga')}
                className="text-emerald-600 text-[11px] font-bold flex items-center gap-0.5 active:scale-95 transition-all"
              >
                Lihat Semua <ChevronRight size={13} />
              </button>
            </div>
            <div className="divide-y divide-gray-50">
              {hargaTrending.map(k => {
                const selisih = k.hargaSaatIni - k.hargaSebelumnya;
                const naik = selisih > 0;
                const tetap = selisih === 0;
                const persen = Math.abs(((selisih) / k.hargaSebelumnya) * 100).toFixed(0);
                return (
                  <div key={k.id} className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center text-lg border border-gray-100">
                        {k.gambar}
                      </div>
                      <div>
                        <p className="font-semibold text-[13px] text-gray-800">{k.nama}</p>
                        <p className="text-[10px] text-gray-400">per {k.satuan}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[13px] text-gray-800">{formatRupiah(k.hargaSaatIni)}</p>
                      <div className={`text-[10px] flex items-center gap-0.5 justify-end font-bold ${
                        tetap ? 'text-gray-400' : naik ? 'text-emerald-600' : 'text-red-500'
                      }`}>
                        {tetap ? <Minus size={9} /> : naik ? <ArrowUp size={9} /> : <ArrowDown size={9} />}
                        {tetap ? 'Stabil' : `${persen}%`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // RENDER STANDAR PETANI BIASA
  return (
    <div className="bg-gray-50 min-h-screen">

      {/* ── HEADER ── */}
      <div className="bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600 text-white px-5 pt-8 pb-6 relative rounded-b-3xl border-x-2 border-b-2 border-primary-500/30 shadow-lg shadow-primary-900/10 overflow-hidden">
        <div className="absolute top-0 right-0 w-56 h-56 bg-white/[0.04] rounded-full -mr-28 -mt-28 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-white/[0.04] rounded-full -ml-18 mb-2 blur-2xl" />
        <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-emerald-400/10 rounded-full blur-xl" />
        {/* Top bar */}
        <div className="flex items-center justify-between mb-5 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/15 rounded-xl flex items-center justify-center border border-white/20 backdrop-blur-sm">
              <Leaf size={20} />
            </div>
            <div>
              <p className="text-white/60 text-[11px] font-medium">Selamat datang 👋</p>
              <h1 className="font-display font-bold text-lg leading-tight">{currentUser?.nama || ''}</h1>
              {currentUser && (
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin size={9} className="text-white/40" />
                  <p className="text-white/40 text-[10px]">{currentUser.kecamatan}, {currentUser.kabupaten}</p>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => navigate('/petani/notifikasi')}
            className="relative p-2.5 bg-white/10 rounded-xl border border-white/15 active:scale-95 transition-all"
          >
            <Bell size={18} />
            {notifBelumDibaca.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[8px] font-bold flex items-center justify-center shadow-sm">
                {notifBelumDibaca.length}
              </span>
            )}
          </button>
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate('/petani/jual-panen/form')}
          className="w-full py-3 bg-white text-primary-700 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-black/10 active:scale-[0.97] transition-all relative z-10"
        >
          <ShoppingCart size={16} /> Jual Hasil Panen
        </button>
      </div>

      {/* ── CONTENT ── */}
      <div className="px-5 pt-5 pb-6 space-y-5">

        {/* ── LAYANAN UNGGULAN ── */}
        <div>
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3">Layanan Unggulan</p>
          <div className="grid grid-cols-2 gap-3">
            {services.map((service, i) => (
              <button
                key={i}
                onClick={() => navigate(service.path)}
                className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 transition-all active:scale-[0.98] shadow-sm hover:shadow-md hover:border-primary-100 group"
              >
                <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary-100 transition-colors">
                  <service.icon size={18} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-gray-800 leading-tight">{service.title}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{service.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── HARGA KOMODITAS ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <h2 className="font-bold text-sm text-gray-800 flex items-center gap-2">
              <TrendingUp size={15} className="text-primary-600" />
              Harga Komoditas
            </h2>
            <button
              onClick={() => navigate('/petani/harga')}
              className="text-primary-600 text-[11px] font-bold flex items-center gap-0.5 active:scale-95 transition-all"
            >
              Lihat Semua <ChevronRight size={13} />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {hargaTrending.map(k => {
              const selisih = k.hargaSaatIni - k.hargaSebelumnya;
              const naik = selisih > 0;
              const tetap = selisih === 0;
              const persen = Math.abs(((selisih) / k.hargaSebelumnya) * 100).toFixed(0);
              return (
                <div key={k.id} className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center text-lg border border-gray-100">
                      {k.gambar}
                    </div>
                    <div>
                      <p className="font-semibold text-[13px] text-gray-800">{k.nama}</p>
                      <p className="text-[10px] text-gray-400">per {k.satuan}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[13px] text-gray-800">{formatRupiah(k.hargaSaatIni)}</p>
                    <div className={`text-[10px] flex items-center gap-0.5 justify-end font-bold ${
                      tetap ? 'text-gray-400' : naik ? 'text-emerald-600' : 'text-red-500'
                    }`}>
                      {tetap ? <Minus size={9} /> : naik ? <ArrowUp size={9} /> : <ArrowDown size={9} />}
                      {tetap ? 'Stabil' : `${persen}%`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
