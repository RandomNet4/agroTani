// =====================================================
// NOTIFIKASI PETANI - MINIMALIST & CLEAN
// =====================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Bell, CheckCircle, Info, AlertTriangle,
  Clock, Trash2, ChevronRight
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatTanggal } from '../../data/dummy';;

const NotifikasiPage: React.FC = () => {
  const { notifikasi: dummyNotifikasi } = useData();
  const navigate = useNavigate();

  const getIcon = (tipe: string) => {
    switch (tipe) {
      case 'success': return <CheckCircle size={18} className="text-emerald-500" />;
      case 'warning': return <AlertTriangle size={18} className="text-amber-500" />;
      case 'info': return <Info size={18} className="text-blue-500" />;
      default: return <Bell size={18} className="text-primary-500" />;
    }
  };

  const getBg = (tipe: string) => {
    switch (tipe) {
      case 'success': return 'bg-emerald-50';
      case 'warning': return 'bg-amber-50';
      case 'info': return 'bg-blue-50';
      default: return 'bg-primary-50';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      {/* ── HEADER ── */}
      <div className="bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600 text-white px-5 pt-8 pb-6 rounded-b-3xl border-x-2 border-b-2 border-primary-500/30 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/[0.04] rounded-full -mr-24 -mt-24 blur-2xl" />
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/15 transition-all active:scale-95"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="font-display font-bold text-xl leading-tight">Notifikasi</h1>
              <p className="text-white/50 text-xs">Informasi terbaru untuk Anda</p>
            </div>
          </div>
          <button className="p-2 text-white/60 hover:text-white transition-colors">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="px-5 pt-6 space-y-3">
        {dummyNotifikasi.length > 0 ? (
          dummyNotifikasi.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-2xl border transition-all active:scale-[0.98] flex gap-4 ${
                n.dibaca ? 'bg-white border-gray-100' : 'bg-white border-primary-100 shadow-sm ring-1 ring-primary-50'
              }`}
            >
              <div className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center ${getBg(n.tipe)}`}>
                {getIcon(n.tipe)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className={`text-[13px] font-bold leading-tight truncate ${n.dibaca ? 'text-gray-700' : 'text-gray-900'}`}>
                    {n.judul}
                  </h3>
                  <span className="text-[9px] text-gray-400 whitespace-nowrap mt-0.5 flex items-center gap-1">
                    <Clock size={10} /> {formatTanggal(n.tanggal)}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed">
                  {n.pesan}
                </p>
                {!n.dibaca && (
                  <div className="mt-3 flex items-center gap-1 text-[10px] font-bold text-primary-600">
                    Tandai dibaca <ChevronRight size={12} />
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center mt-10">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-50 shadow-inner">
              <Bell size={24} className="text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm font-medium">Belum ada notifikasi</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotifikasiPage;
