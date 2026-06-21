// =====================================================
// PEMBELIAN BIBIT & PUPUK - PETANI (with Cart)
// =====================================================

import React, { useState } from 'react';
import { ArrowLeft, ShoppingCart, Tag, Percent, Plus, Minus, Trash2, X, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { formatRupiah } from '../../data/dummy';;
import type { ProdukBibitPupuk } from '../../types';

interface CartItem {
  produk: ProdukBibitPupuk;
  qty: number;
  hargaFinal: number;
}

const BibitPupukPage: React.FC = () => {
  const { produkBibitPupuk: dummyProdukBibitPupuk } = useData();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'semua' | 'bibit' | 'pupuk'>('semua');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  const filtered = tab === 'semua'
    ? dummyProdukBibitPupuk
    : dummyProdukBibitPupuk.filter(p => p.tipe === tab);

  const getHargaFinal = (p: ProdukBibitPupuk) =>
    p.subsidi && p.diskonPersen ? p.harga * (1 - p.diskonPersen / 100) : p.harga;

  const addToCart = (produk: ProdukBibitPupuk) => {
    setCart(prev => {
      const existing = prev.find(c => c.produk.id === produk.id);
      if (existing) {
        return prev.map(c => c.produk.id === produk.id ? { ...c, qty: c.qty + 1 } : c);
      }
      return [...prev, { produk, qty: 1, hargaFinal: getHargaFinal(produk) }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev =>
      prev.map(c => c.produk.id === id ? { ...c, qty: Math.max(0, c.qty + delta) } : c)
          .filter(c => c.qty > 0)
    );
  };

  const removeItem = (id: string) => setCart(prev => prev.filter(c => c.produk.id !== id));

  const getQty = (id: string) => cart.find(c => c.produk.id === id)?.qty ?? 0;

  const totalItems = cart.reduce((s, c) => s + c.qty, 0);
  const totalHarga = cart.reduce((s, c) => s + c.qty * c.hargaFinal, 0);

  return (
    <div className="bg-gray-50 min-h-screen pb-10">

      {/* ── HEADER ── */}
      <div className="bg-gradient-to-b from-primary-700 to-primary-600 text-white px-4 pt-12 pb-5">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-xl active:scale-95 transition-all">
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="font-display font-bold text-lg">Bibit & Pupuk</h1>
            <p className="text-primary-100 text-xs">Produk bersubsidi dari Agro Jabar</p>
          </div>
          <button
            onClick={() => setShowCart(true)}
            className="relative p-2.5 bg-white/15 rounded-xl border border-white/20 active:scale-95 transition-all"
          >
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full text-[9px] font-bold flex items-center justify-center shadow">
                {totalItems}
              </span>
            )}
          </button>
        </div>

        {/* Tab Filter */}
        <div className="flex gap-2">
          {(['semua', 'bibit', 'pupuk'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                tab === t ? 'bg-white text-primary-700 shadow' : 'bg-white/15 text-white'
              }`}
            >
              {t === 'semua' ? 'Semua' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ── PRODUK LIST ── */}
      <div className="px-4 pt-4 pb-32 space-y-3">
        {filtered.map(produk => {
          const hargaFinal = getHargaFinal(produk);
          const qty = getQty(produk.id);

          return (
            <div key={produk.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex gap-3 p-4">
                {/* Gambar/Emoji */}
                <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 border border-gray-100">
                  {produk.gambar}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Badges */}
                  <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      produk.tipe === 'bibit' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                    }`}>{produk.tipe}</span>
                    {produk.subsidi && (
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <Tag size={8} /> Subsidi
                      </span>
                    )}
                  </div>

                  <h3 className="font-semibold text-sm text-gray-800 leading-tight">{produk.nama}</h3>
                  <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{produk.deskripsi}</p>

                  {/* Harga */}
                  <div className="flex items-end justify-between mt-2">
                    <div>
                      {produk.subsidi && produk.diskonPersen ? (
                        <>
                          <p className="text-[10px] text-gray-400 line-through">{formatRupiah(produk.harga)}</p>
                          <p className="font-bold text-primary-700 text-sm">{formatRupiah(hargaFinal)}</p>
                          <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-semibold flex items-center gap-0.5 w-fit mt-0.5">
                            <Percent size={8} /> Hemat {produk.diskonPersen}%
                          </span>
                        </>
                      ) : (
                        <p className="font-bold text-primary-700 text-sm">{formatRupiah(produk.harga)}</p>
                      )}
                      <p className="text-[10px] text-gray-400">per {produk.satuan}</p>
                    </div>

                    {/* Qty Control */}
                    {qty === 0 ? (
                      <button
                        onClick={() => addToCart(produk)}
                        className="flex items-center gap-1.5 bg-primary-600 text-white text-xs font-bold py-2 px-3 rounded-xl active:scale-95 transition-all shadow-sm"
                      >
                        <Plus size={13} /> Beli
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQty(produk.id, -1)}
                          className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center active:scale-95 transition-all text-gray-700"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="font-bold text-sm text-gray-800 w-4 text-center">{qty}</span>
                        <button
                          onClick={() => updateQty(produk.id, 1)}
                          className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center active:scale-95 transition-all text-white"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Stok info */}
              <div className="px-4 pb-3">
                <p className="text-[10px] text-gray-400">Stok tersedia: <span className="font-semibold text-gray-600">{produk.stok} {produk.satuan}</span></p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── FLOATING CART BAR ── */}
      {totalItems > 0 && (
        <div className="fixed bottom-[72px] left-0 right-0 max-w-lg mx-auto px-4 z-40">
          <button
            onClick={() => setShowCart(true)}
            className="w-full bg-primary-600 text-white rounded-2xl py-3.5 px-4 flex items-center justify-between shadow-xl active:scale-95 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <ShoppingCart size={20} />
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-full text-[9px] font-bold flex items-center justify-center text-primary-700">
                  {totalItems}
                </span>
              </div>
              <span className="font-semibold text-sm">{totalItems} item dipilih</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">{formatRupiah(totalHarga)}</span>
              <ChevronRight size={16} />
            </div>
          </button>
        </div>
      )}

      {/* ── CART DRAWER ── */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" style={{ maxWidth: '512px', margin: '0 auto' }}>
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCart(false)} />

          {/* Sheet */}
          <div className="relative bg-white rounded-t-3xl shadow-2xl max-h-[80vh] flex flex-col">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-200 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <h2 className="font-bold text-gray-800 text-base flex items-center gap-2">
                <ShoppingCart size={18} className="text-primary-600" />
                Keranjang ({totalItems})
              </h2>
              <button onClick={() => setShowCart(false)} className="p-1.5 rounded-xl bg-gray-100 active:scale-95 transition-all">
                <X size={16} className="text-gray-600" />
              </button>
            </div>

            {/* Items */}
            <div className="overflow-y-auto flex-1 px-5 py-3 space-y-3">
              {cart.map(item => (
                <div key={item.produk.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    {item.produk.gambar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-800 leading-tight line-clamp-1">{item.produk.nama}</p>
                    <p className="text-[11px] text-primary-700 font-bold mt-0.5">{formatRupiah(item.hargaFinal)}<span className="text-gray-400 font-normal">/{item.produk.satuan}</span></p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => updateQty(item.produk.id, -1)} className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center active:scale-95">
                      <Minus size={12} />
                    </button>
                    <span className="font-bold text-sm w-4 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.produk.id, 1)} className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center active:scale-95 text-white">
                      <Plus size={12} />
                    </button>
                    <button onClick={() => removeItem(item.produk.id)} className="w-7 h-7 bg-red-50 rounded-lg flex items-center justify-center active:scale-95 text-red-500 ml-1">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary + Checkout */}
            <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">Total Pembayaran</span>
                <span className="font-bold text-lg text-primary-700">{formatRupiah(totalHarga)}</span>
              </div>
              <button
                onClick={() => {
                  setShowCart(false);
                  navigate('/petani/checkout-bibit-pupuk', { state: { cart, totalHarga } });
                }}
                className="w-full py-4 bg-primary-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"
              >
                <ShoppingCart size={18} />
                Checkout Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BibitPupukPage;
