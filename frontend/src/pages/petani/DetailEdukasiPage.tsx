import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Clock, Share2, Bookmark } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatTanggal } from '../../data/dummy';;

const DetailEdukasiPage: React.FC = () => {
  const { artikelEdukasi: dummyArtikelEdukasi } = useData();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const artikel = dummyArtikelEdukasi.find(a => a.id === id);

  if (!artikel) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-6 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-xl font-bold text-gray-800">Artikel Tidak Ditemukan</h2>
        <p className="text-gray-500 text-sm mt-2">Maaf, artikel yang Anda cari tidak tersedia atau telah dihapus.</p>
        <button onClick={() => navigate('/petani/edukasi')} className="btn-primary mt-6">Kembali ke Edukasi</button>
      </div>
    );
  }

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Header Image/Gradient */}
      <div className="relative h-64 bg-gradient-to-br from-primary-700 to-primary-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-6 left-4 p-2.5 bg-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-white/30 transition-all z-10"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="absolute top-6 right-4 flex gap-2 z-10">
          <button className="p-2.5 bg-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-white/30 transition-all">
            <Share2 size={20} />
          </button>
          <button className="p-2.5 bg-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-white/30 transition-all">
            <Bookmark size={20} />
          </button>
        </div>

        {artikel.tipe === 'video' ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
              <Play className="text-primary-600 ml-1" size={32} />
            </div>
          </div>
        ) : (
          <div className="absolute inset-x-0 bottom-0 p-8 pt-20 bg-gradient-to-t from-black/60 to-transparent">
             <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] bg-primary-600 text-white font-black px-2.5 py-1 rounded-full uppercase tracking-tighter">
                  {artikel.kategori}
                </span>
             </div>
             <h1 className="text-2xl font-display font-bold text-white leading-tight">{artikel.judul}</h1>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-screen-md mx-auto px-6 -mt-6 relative z-10">
        <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-gray-200/50">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                {artikel.penulis.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">{artikel.penulis}</p>
                <p className="text-[10px] text-gray-400 font-medium">{formatTanggal(artikel.tanggalPublish)}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              <Clock size={12} /> 5 mnt baca
            </div>
          </div>

          <div className="prose prose-sm prose-primary max-w-none">
            {artikel.isi.split('\n\n').map((para, i) => (
              <p key={i} className="text-gray-600 leading-relaxed mb-4 text-base">
                {para}
              </p>
            ))}
          </div>

          {artikel.tipe === 'video' && artikel.urlVideo && (
            <div className="mt-8">
              <div className="aspect-video bg-gray-900 rounded-[24px] flex items-center justify-center border border-gray-100 overflow-hidden shadow-lg">
                <div className="text-center">
                  <Play className="mx-auto text-white mb-2 opacity-50" size={48} />
                  <p className="text-white/50 text-xs font-medium">Klik untuk memutar video</p>
                </div>
              </div>
              <button className="w-full mt-4 bg-primary-600 hover:bg-primary-700 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary-100 transition-all">
                <Play size={20} /> Putar Video Full
              </button>
            </div>
          )}

          {/* Related Tags */}
          <div className="mt-10 pt-6 border-t border-gray-100">
             <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Topik Terkait</h4>
             <div className="flex flex-wrap gap-2">
               {['Pertanian', 'Agro Jabar', 'Budidaya', 'Modern Tani'].map(tag => (
                 <span key={tag} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg text-xs text-gray-600 cursor-pointer">#{tag}</span>
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailEdukasiPage;
