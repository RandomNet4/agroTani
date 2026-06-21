// =====================================================
// TENDER / PERMINTAAN KHUSUS - PETANI (SECURE)
// =====================================================

import React from 'react';
import {
  ArrowLeft, Clock, CheckCircle, Users, ShieldCheck, FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../../components/StatusBadge';
import { formatRupiah } from '../../data/dummy';
import { useData } from '../../context/DataContext';

const TenderPage: React.FC = () => {
  const { tender: dummyTender, tenderPetani: dummyTenderPetani, currentUser, refreshData } = useData();
  const navigate = useNavigate();
  const petaniId = currentUser?.id || '';

  React.useEffect(() => {
    refreshData();
  }, []);

  const tenderSaya = dummyTenderPetani.filter(tp => tp.petaniId === petaniId);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* ── HEADER ── */}
      <div className="bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600 text-white px-5 pt-10 pb-6 rounded-b-2xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/[0.04] rounded-full -mr-24 -mt-24 blur-2xl" />
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/15 transition-all active:scale-95">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-display font-bold text-xl leading-tight">Tender & Permintaan</h1>
            <p className="text-white/50 text-xs">Kebutuhan komoditas dari Agro Jabar</p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/15 flex items-start gap-3">
          <div className="w-8 h-8 bg-emerald-400/20 rounded-lg flex items-center justify-center shrink-0">
            <ShieldCheck size={18} className="text-emerald-300" />
          </div>
          <div>
            <p className="text-[12px] font-bold text-white">Tender & Supply Terjamin</p>
            <p className="text-[10px] text-white/60 mt-0.5 leading-relaxed">Pendaftaran akan diikuti peninjauan lahan & monitoring berkala oleh petugas Agro untuk validasi kualitas.</p>
          </div>
        </div>
      </div>

      <div className="px-5 pt-4 space-y-4">
        {/* ── PARTISIPASI SAYA ── */}
        {tenderSaya.length > 0 && (
          <div className="bg-primary-50 border border-primary-100 rounded-2xl p-4">
            <h2 className="text-sm font-bold text-primary-800 mb-3 flex items-center gap-2">
              <Users size={15} /> Partisipasi Saya
            </h2>
            <div className="space-y-2">
              {tenderSaya.map(tp => {
                const tender = dummyTender.find(t => t.id === tp.tenderId);
                return (
                  <div key={tp.id} className="bg-white rounded-xl p-3 flex items-center justify-between border border-primary-50">
                    <div>
                      <p className="font-semibold text-sm text-gray-800">{tender?.komoditasNama}</p>
                      <p className="text-[11px] text-gray-500">Kesanggupan: {tp.kesanggupanKg.toLocaleString()} kg</p>
                    </div>
                    <StatusBadge status={tp.statusApproval} size="sm" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TENDER TERSEDIA ── */}
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tender Tersedia</p>

        {dummyTender.map(tender => {
          const persen = (tender.terpenuhinKg / tender.kebutuhanKg) * 100;
          const sisaKg = tender.kebutuhanKg - tender.terpenuhinKg;
          const sudahDaftar = tenderSaya.some(tp => tp.tenderId === tender.id);
          const isFull = persen >= 100;

          return (
            <div key={tender.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-4 pb-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                       <h3 className="font-bold text-[15px] text-gray-800">{tender.komoditasNama}</h3>
                       <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-bold rounded-md border border-blue-100">
                         <ShieldCheck size={10} /> Terverifikasi
                       </span>
                    </div>
                    <p className="text-[11px] text-gray-500 line-clamp-2">{tender.deskripsi}</p>
                  </div>
                  <StatusBadge status={tender.status} size="sm" />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Kebutuhan</p>
                    <p className="font-bold text-sm text-gray-800 mt-0.5">{(tender.kebutuhanKg / 1000).toFixed(0)} ton</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Terpenuhi</p>
                    <p className="font-bold text-sm text-gray-800 mt-0.5">{(tender.terpenuhinKg / 1000).toFixed(1)} ton</p>
                  </div>
                  <div className="bg-primary-50 rounded-xl p-2.5 text-center">
                    <p className="text-[9px] text-primary-500 font-bold uppercase tracking-wider">Harga/kg</p>
                    <p className="font-bold text-sm text-primary-700 mt-0.5">{formatRupiah(tender.hargaPerKg)}</p>
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                    <span>Progress Pemenuhan</span>
                    <span className="font-bold">{persen.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${isFull ? 'bg-emerald-500' : 'bg-primary-500'}`}
                      style={{ width: `${Math.min(persen, 100)}%` }}
                    />
                  </div>
                  {!isFull && (
                    <p className="text-[10px] text-gray-400 mt-1">Sisa: <span className="font-bold text-gray-600">{sisaKg.toLocaleString()} kg</span></p>
                  )}
                </div>

                {/* Periode & Visit Info */}
                <div className="flex items-center justify-between mt-4 py-3 border-t border-gray-50">
                  <span className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium"><Clock size={12} className="text-primary-500" /> {tender.periodePanen}</span>
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 text-amber-700 rounded-lg border border-amber-100/50">
                    <Users size={12} />
                    <span className="text-[9px] font-bold uppercase tracking-tight">Butuh Survei Lahan</span>
                  </div>
                </div>
              </div>

              {/* CTA: Navigate to form page */}
              {tender.status === 'aktif' && !sudahDaftar && !isFull && (
                <div className="px-4 pb-4">
                  <button
                    onClick={() => navigate(`/petani/tender/form?id=${tender.id}`)}
                    className="w-full py-3 bg-primary-600 text-white rounded-xl font-bold text-sm shadow-md shadow-primary-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <FileText size={14} /> Ambil Tender
                  </button>
                </div>
              )}

              {/* Full */}
              {isFull && !sudahDaftar && (
                <div className="px-4 pb-4">
                  <div className="bg-gray-50 rounded-xl py-2.5 text-center">
                    <p className="text-xs text-gray-400 font-medium">Tender sudah terpenuhi</p>
                  </div>
                </div>
              )}

              {/* Sudah Terdaftar */}
              {sudahDaftar && (
                <div className="px-4 pb-4">
                  <div className="bg-primary-50 border border-primary-100 rounded-xl p-3 flex items-center gap-2">
                    <CheckCircle size={14} className="text-primary-600 shrink-0" />
                    <p className="text-xs text-primary-700 font-medium">Anda sudah terdaftar — menunggu verifikasi admin</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TenderPage;
