// =====================================================
// EDUKASI & BERITA - PETANI
// =====================================================

import React, { useState } from 'react';
import { ArrowLeft, Play, Clock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { formatTanggal } from '../../data/dummy';;

const EdukasiPage: React.FC = () => {
  const { artikelEdukasi: dummyArtikelEdukasi } = useData();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'semua' | 'artikel' | 'video'>('semua');
  const filtered = tab === 'semua' ? dummyArtikelEdukasi : dummyArtikelEdukasi.filter(a => a.tipe === tab);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-700 to-primary-600 text-white px-4 py-4 pb-6 rounded-b-3xl">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-xl">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-display font-bold text-lg">Edukasi & Berita</h1>
            <p className="text-primary-100 text-xs">Artikel, video, dan informasi pertanian</p>
          </div>        </div>
        {/* Tabs */}
        <div className="flex gap-2">
          {(['semua', 'artikel', 'video'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                tab === t ? 'bg-white text-primary-700 shadow-lg shadow-black/5' : 'bg-white/10 text-white hover:bg-white/20 border border-white/5'
              }`}
            >
              {t === 'semua' ? 'Semua' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 pb-20 space-y-4">
        {filtered.map(artikel => (
          <div
            key={artikel.id}
            className="group bg-white rounded-3xl p-4 border border-gray-100 hover:border-primary-100 hover:shadow-xl hover:shadow-primary-100/20 active:scale-[0.98] transition-all cursor-pointer overflow-hidden relative"
            onClick={() => navigate(`/petani/edukasi/${artikel.id}`)}
          >
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-105 transition-transform duration-300 relative overflow-hidden">
                {artikel.tipe === 'video' ? (
                  <div className="w-full h-full bg-black/5 flex items-center justify-center">
                    <Play size={28} className="text-emerald-500" fill="currentColor" />
                  </div>
                ) : (
                  artikel.gambar
                )}
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full tracking-tighter shadow-sm ${
                    artikel.tipe === 'video' ? 'bg-red-500 text-white' : 'bg-primary-600 text-white'
                  }`}>
                    {artikel.tipe}
                  </span>
                  <span className="text-[10px] bg-gray-50 text-gray-400 font-bold px-2 py-1 rounded-md uppercase tracking-widest">{artikel.kategori}</span>
                </div>
                <h3 className="font-bold text-gray-800 mt-2 line-clamp-2 leading-tight group-hover:text-primary-700 transition-colors">{artikel.judul}</h3>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  <span className="flex items-center gap-1"><User size={10} className="text-primary-500" /> {artikel.penulis}</span>                  <span className="flex items-center gap-1"><Clock size={10} /> {formatTanggal(artikel.tanggalPublish)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EdukasiPage;
