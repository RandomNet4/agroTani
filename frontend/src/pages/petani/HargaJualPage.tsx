// =====================================================
// HARGA JUAL KOMODITAS - PETANI (REDESIGN CLEAN)
// =====================================================

import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { ArrowLeft, ArrowUp, ArrowDown, Search, Minus, ChevronRight, Calendar, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatRupiah } from '../../data/dummy';

const PriceTrendChart: React.FC<{
  histori: any[];
  commodity: any;
}> = ({ histori, commodity }) => {
  const points = [...histori]
    .map(h => ({
      harga: h.harga,
      tanggal: h.tanggal,
    }))
    .sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());

  if (points.length === 0) {
    points.push({
      harga: commodity.hargaSebelumnya || commodity.hargaSaatIni * 0.95,
      tanggal: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    points.push({
      harga: commodity.hargaSaatIni,
      tanggal: commodity.lastUpdate || new Date().toISOString().split('T')[0]
    });
  } else if (points.length === 1) {
    const singlePoint = points[0];
    const prevDate = new Date(new Date(singlePoint.tanggal).getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    points.unshift({
      harga: commodity.hargaSebelumnya || singlePoint.harga * 0.95,
      tanggal: prevDate
    });
  }

  const prices = points.map(p => p.harga);
  let minPrice = Math.min(...prices);
  let maxPrice = Math.max(...prices);

  if (minPrice === maxPrice) {
    minPrice = minPrice * 0.9;
    maxPrice = maxPrice * 1.1;
  } else {
    const diff = maxPrice - minPrice;
    minPrice = Math.max(0, minPrice - diff * 0.15);
    maxPrice = maxPrice + diff * 0.15;
  }

  const width = 500;
  const height = 180;
  const paddingLeft = 50;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const coords = points.map((p, idx) => {
    const x = paddingLeft + (idx / (points.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((p.harga - minPrice) / (maxPrice - minPrice)) * chartHeight;
    return { x, y, harga: p.harga, tanggal: p.tanggal };
  });

  let linePath = '';
  let areaPath = '';

  if (coords.length > 0) {
    linePath = `M ${coords[0].x} ${coords[0].y} ` + coords.slice(1).map(c => `L ${c.x} ${c.y}`).join(' ');
    areaPath = `${linePath} L ${coords[coords.length - 1].x} ${paddingTop + chartHeight} L ${coords[0].x} ${paddingTop + chartHeight} Z`;
  }

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const yTicks = [
    maxPrice,
    minPrice + (maxPrice - minPrice) / 2,
    minPrice
  ];

  return (
    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 relative overflow-hidden">
      <div className="flex justify-between items-center mb-3">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Trend Perubahan Harga</p>
        <div className="text-right">
          {hoveredIdx !== null ? (
            <div>
              <p className="text-xs font-bold text-primary-600">{formatRupiah(coords[hoveredIdx].harga)}</p>
              <p className="text-[9px] text-gray-400">
                {new Date(coords[hoveredIdx].tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
              </p>
            </div>
          ) : (
            <p className="text-[10px] text-gray-400 italic">Sentuh titik untuk detail</p>
          )}
        </div>
      </div>

      <svg className="w-full h-auto overflow-visible" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id={`gradient-${commodity.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#059669" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.00" />
          </linearGradient>
        </defs>

        {yTicks.map((tick, idx) => {
          const y = paddingTop + chartHeight - ((tick - minPrice) / (maxPrice - minPrice)) * chartHeight;
          return (
            <g key={idx} className="opacity-40">
              <line 
                x1={paddingLeft} 
                y1={y} 
                x2={width - paddingRight} 
                y2={y} 
                stroke="#e5e7eb" 
                strokeWidth="1" 
                strokeDasharray="4 4"
              />
              <text 
                x={paddingLeft - 8} 
                y={y + 4} 
                fill="#9ca3af" 
                fontSize="9" 
                fontWeight="bold" 
                textAnchor="end"
              >
                {formatRupiah(Math.round(tick))}
              </text>
            </g>
          );
        })}

        {coords.length > 0 && (
          <>
            <path 
              d={areaPath} 
              fill={`url(#gradient-${commodity.id})`} 
            />
            <path 
              d={linePath} 
              fill="none" 
              stroke="#059669" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </>
        )}

        {coords.map((c, idx) => {
          const isHovered = hoveredIdx === idx;
          return (
            <g key={idx}>
              <circle 
                cx={c.x} 
                cy={c.y} 
                r={isHovered ? 6 : 4} 
                fill={isHovered ? '#059669' : '#ffffff'} 
                stroke="#059669" 
                strokeWidth={isHovered ? 3 : 2}
                className="transition-all duration-150 cursor-pointer"
              />
              
              <circle 
                cx={c.x} 
                cy={c.y} 
                r={15} 
                fill="transparent" 
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                onTouchStart={() => setHoveredIdx(idx)}
              />
            </g>
          );
        })}

        {coords.map((c, idx) => {
          const isEdge = idx === 0 || idx === coords.length - 1;
          const isMiddle = coords.length > 2 && idx === Math.floor(coords.length / 2);
          
          if (!isEdge && !isMiddle) return null;

          return (
            <text 
              key={idx}
              x={c.x} 
              y={height - 8} 
              fill="#9ca3af" 
              fontSize="9" 
              fontWeight="bold" 
              textAnchor="middle"
            >
              {new Date(c.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

const HargaJualPage: React.FC = () => {
  const { komoditas: dummyKomoditas, historiHarga: dummyHistoriHarga } = useData();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [kategori, setKategori] = useState<string>('semua');
  const [selected, setSelected] = useState<string | null>(null);

  const kategoris = ['semua', ...new Set(dummyKomoditas.map(k => k.kategori))];

  const filtered = dummyKomoditas.filter(k => {
    const matchSearch = k.nama.toLowerCase().includes(search.toLowerCase());
    const matchKategori = kategori === 'semua' || k.kategori === kategori;
    return matchSearch && matchKategori;
  });

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* ── HEADER ── */}
      <div className="bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600 text-white px-5 pt-8 pb-6 rounded-b-3xl border-x-2 border-b-2 border-primary-500/30 shadow-lg shadow-primary-900/10 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/[0.04] rounded-full -mr-24 -mt-24 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/[0.04] rounded-full -ml-16 mb-4 blur-xl" />

        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/20 transition-all active:scale-95"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-display font-bold text-xl leading-tight">Harga Komoditas</h1>
            <p className="text-primary-100 text-xs">Update harga beli Agro Jabar</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Cari nama komoditas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-white/40 text-sm focus:outline-none focus:bg-white/20 focus:ring-2 focus:ring-white/20 transition-all"
          />
        </div>
      </div>

      <div className="px-5 mt-8 space-y-6">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {kategoris.map(k => (
            <button
              key={k}
              onClick={() => setKategori(k)}
              className={`px-4 py-2.5 rounded-2xl text-[12px] font-bold whitespace-nowrap transition-all border ${
                kategori === k
                  ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                  : 'bg-white text-gray-500 border-gray-100 hover:border-primary-200'
              }`}
            >
              {k === 'semua' ? 'Semua' : k.charAt(0).toUpperCase() + k.slice(1)}
            </button>
          ))}
        </div>

        {/* Info Tip */}
        <div className="bg-primary-50 border border-primary-100 rounded-2xl p-3.5 flex items-center gap-2.5 shadow-sm text-primary-800 animate-fade-in">
          <BarChart3 size={16} className="text-primary-600 shrink-0" />
          <p className="text-xs font-semibold leading-relaxed">
            Ketuk komoditas untuk keterangan lebih terkait statistik data.
          </p>
        </div>

        {/* ── HARGA LIST ── */}
        <div className="space-y-3">
          {filtered.length > 0 ? (
            filtered.map(k => {
              const selisih = k.hargaSaatIni - k.hargaSebelumnya;
              const persen = Math.abs(((selisih / k.hargaSebelumnya) * 100)).toFixed(0);
              const naik = selisih > 0;
              const tetap = selisih === 0;
              const histori = dummyHistoriHarga.filter(h => h.komoditasId === k.id);
              const isSelected = selected === k.id;

              return (
                <div
                  key={k.id}
                  className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isSelected ? 'border-primary-300 shadow-lg ring-1 ring-primary-200' : 'border-gray-100 shadow-sm hover:shadow-md active:scale-[0.99]'
                  }`}
                  onClick={() => setSelected(isSelected ? null : k.id)}
                >
                  {/* Main Row */}
                  <div className="p-4 flex items-center gap-3">
                    {/* Emoji */}
                    <div className="w-11 h-11 bg-gray-50 rounded-xl flex items-center justify-center text-2xl shrink-0 border border-gray-100">
                      {k.gambar}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-sm text-gray-800 truncate">{k.nama}</h3>
                        <p className="font-bold text-sm text-gray-900 ml-2 shrink-0">{formatRupiah(k.hargaSaatIni)}</p>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[9px] font-bold rounded-md uppercase tracking-wider">
                            {k.kategori}
                          </span>
                          <span className="text-[10px] text-gray-400">/{k.satuan}</span>
                        </div>
                        <div className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                          tetap ? 'text-gray-400 bg-gray-50' : naik ? 'text-emerald-600 bg-emerald-50' : 'text-red-500 bg-red-50'
                        }`}>
                          {tetap ? <Minus size={10} /> : naik ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                          {tetap ? 'Stabil' : `${persen}%`}
                        </div>
                      </div>
                      {!isSelected && (
                        <div className="flex justify-end mt-2 pt-1.5 border-t border-gray-50/50">
                          <span className="text-[9px] text-primary-600 font-bold flex items-center gap-0.5 animate-pulse">
                            Ketuk untuk detail statistik data →
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expandable Detail */}
                  <div className={`transition-all duration-400 ease-in-out ${isSelected ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                    <div className="px-4 pb-4 space-y-3">
                      <div className="h-px bg-gray-100" />

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gray-50 p-3 rounded-xl">
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Update Terakhir</p>
                          <div className="flex items-center gap-1.5 text-gray-700">
                            <Calendar size={13} className="text-primary-500" />
                            <span className="text-xs font-bold">{new Date(k.lastUpdate).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'})}</span>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl">
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Harga Kemarin</p>
                          <p className="text-xs font-bold text-gray-500">{formatRupiah(k.hargaSebelumnya)}</p>
                        </div>
                      </div>

                      {/* Price Trend Graph */}
                      <PriceTrendChart histori={histori} commodity={k} />

                      {/* Histori */}
                      <div>
                        <p className="text-xs font-bold text-gray-700 flex items-center gap-1.5 mb-2">
                          <BarChart3 size={13} className="text-primary-600" />
                          Histori Harga
                        </p>
                        {histori.length > 0 ? (
                          <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden divide-y divide-gray-100">
                            {[...histori]
                              .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
                              .map(h => (
                                <div key={h.id} className="flex justify-between items-center py-2.5 px-3 text-xs">
                                  <span className="text-gray-500 font-medium">
                                    {new Date(h.tanggal).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'})}
                                  </span>
                                  <span className="font-bold text-gray-800">{formatRupiah(h.harga)}</span>
                                </div>
                              ))}
                          </div>
                        ) : (
                          <div className="py-5 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <p className="text-[11px] text-gray-400">Belum ada histori harga</p>
                          </div>
                        )}
                      </div>

                      {/* CTA */}
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate('/petani/jual-panen/form'); }}
                        className="w-full py-3 bg-primary-600 text-white rounded-xl font-bold text-sm shadow-md shadow-primary-600/20 active:scale-[0.97] transition-all flex items-center justify-center gap-2"
                      >
                        Jual Panen Ini <ChevronRight size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-gray-200 mt-2">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search size={28} className="text-gray-200" />
              </div>
              <h3 className="font-bold text-gray-800 text-sm">Tidak ada hasil</h3>
              <p className="text-xs text-gray-400 mt-1">Coba gunakan kata kunci lain</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HargaJualPage;
