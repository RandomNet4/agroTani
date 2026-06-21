// =====================================================
// CHECKOUT BIBIT & PUPUK - PETANI
// =====================================================

import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, CreditCard, CheckCircle, ChevronRight, ShoppingBag, Phone, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { formatRupiah } from '../../data/dummy';
import type { ProdukBibitPupuk } from '../../types';
import { useData } from '../../context/DataContext';

interface CartItem {
  produk: ProdukBibitPupuk;
  qty: number;
  hargaFinal: number;
}

type Step = 'review' | 'pengiriman' | 'pembayaran' | 'sukses';

const METODE_BAYAR = [
  { id: 'transfer', label: 'Transfer Bank', icon: '🏦', desc: 'BNI / BRI / Mandiri' },
  { id: 'tunai',    label: 'Tunai saat Terima', icon: '💵', desc: 'Bayar saat barang tiba' },
  { id: 'subsidi',  label: 'Potong Subsidi', icon: '🎟️', desc: 'Dikurangi dari kuota subsidi' },
];

const CheckoutBibitPupukPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart = [], totalHarga = 0 } = (location.state as { cart: CartItem[]; totalHarga: number }) || {};
  const { currentUser } = useData();

  const [step, setStep] = useState<Step>('review');
  const [metode, setMetode] = useState('transfer');
  const [alamat, setAlamat] = useState(currentUser?.alamat || 'Jl. Sawah Indah No. 12, Sarongge, Cianjur');
  const [noHp, setNoHp] = useState(currentUser?.noHp || '081234567890');
  const [nama, setNama] = useState(currentUser?.nama || 'Ahmad Sudirman');

  useEffect(() => {
    if (currentUser) {
      setAlamat(currentUser.alamat);
      setNoHp(currentUser.noHp);
      setNama(currentUser.nama);
    }
  }, [currentUser]);

  const ongkir = 15000;
  const totalAkhir = totalHarga + ongkir;

  if (step === 'sukses') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={48} className="text-emerald-500" />
        </div>
        <h1 className="font-display font-bold text-2xl text-gray-800 mb-2">Pesanan Berhasil!</h1>
        <p className="text-gray-500 text-sm mb-2">Pesanan kamu sedang diproses oleh tim Agro Jabar.</p>
        <p className="text-gray-400 text-xs mb-8">No. Pesanan: <span className="font-bold text-gray-600">#BP-{Date.now().toString().slice(-6)}</span></p>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm w-full p-4 mb-6 text-left space-y-2">
          <p className="text-xs text-gray-500 font-medium">Ringkasan Pesanan</p>
          {cart.map(item => (
            <div key={item.produk.id} className="flex justify-between text-sm">
              <span className="text-gray-700">{item.produk.nama} ×{item.qty}</span>
              <span className="font-semibold">{formatRupiah(item.hargaFinal * item.qty)}</span>
            </div>
          ))}
          <div className="border-t border-gray-100 pt-2 flex justify-between text-sm font-bold text-primary-700">
            <span>Total Bayar</span>
            <span>{formatRupiah(totalAkhir)}</span>
          </div>
        </div>

        <button
          onClick={() => navigate('/petani/dashboard')}
          className="w-full py-4 bg-primary-600 text-white font-bold rounded-2xl active:scale-95 transition-all"
        >
          Kembali ke Beranda
        </button>
        <button
          onClick={() => navigate('/petani/bibit-pupuk')}
          className="w-full py-3 mt-2 text-primary-600 font-semibold text-sm"
        >
          Belanja Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* ── HEADER ── */}
      <div className="bg-gradient-to-b from-primary-700 to-primary-600 text-white px-4 pt-12 pb-5">
        <div className="flex items-center gap-3 mb-1">
          <button onClick={() => step === 'review' ? navigate(-1) : setStep('review')} className="p-2 hover:bg-white/10 rounded-xl active:scale-95 transition-all">
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-display font-bold text-lg">Checkout</h1>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-1 mt-3">
          {(['review', 'pengiriman', 'pembayaran'] as Step[]).map((s, i) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-1.5 ${step === s ? 'opacity-100' : 'opacity-50'}`}>
                <div className={`w-5 h-5 rounded-full text-[9px] font-bold flex items-center justify-center ${
                  step === s ? 'bg-white text-primary-700' : 'bg-white/20 text-white'
                }`}>{i + 1}</div>
                <span className="text-[10px] font-medium capitalize">{s}</span>
              </div>
              {i < 2 && <div className="flex-1 h-px bg-white/30 mx-1" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 pb-32 space-y-4">

        {/* ── STEP 1: REVIEW ORDER ── */}
        {step === 'review' && (
          <>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-2">
                <ShoppingBag size={16} className="text-primary-600" />
                <h2 className="font-bold text-sm text-gray-800">Ringkasan Pesanan</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {cart.map(item => (
                  <div key={item.produk.id} className="flex items-center gap-3 px-4 py-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                      {item.produk.gambar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-800 line-clamp-1">{item.produk.nama}</p>
                      <p className="text-[11px] text-gray-400">×{item.qty} {item.produk.satuan}</p>
                    </div>
                    <p className="font-bold text-sm text-primary-700 flex-shrink-0">{formatRupiah(item.hargaFinal * item.qty)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Rincian harga */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4 space-y-2.5">
              <h2 className="font-bold text-sm text-gray-800 mb-1">Rincian Biaya</h2>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal produk</span>
                <span className="font-medium">{formatRupiah(totalHarga)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Ongkos kirim</span>
                <span className="font-medium">{formatRupiah(ongkir)}</span>
              </div>
              <div className="border-t border-gray-100 pt-2 flex justify-between">
                <span className="font-bold text-gray-800">Total</span>
                <span className="font-bold text-primary-700">{formatRupiah(totalAkhir)}</span>
              </div>
            </div>
          </>
        )}

        {/* ── STEP 2: PENGIRIMAN ── */}
        {step === 'pengiriman' && (
          <>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden px-4 py-4 space-y-4">
              <h2 className="font-bold text-sm text-gray-800 flex items-center gap-2">
                <MapPin size={16} className="text-primary-600" /> Alamat Pengiriman
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1 block">Nama Penerima</label>
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5">
                    <User size={14} className="text-gray-400 flex-shrink-0" />
                    <input
                      value={nama}
                      onChange={e => setNama(e.target.value)}
                      className="flex-1 bg-transparent text-sm text-gray-800 outline-none"
                      placeholder="Nama penerima"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1 block">No. HP</label>
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5">
                    <Phone size={14} className="text-gray-400 flex-shrink-0" />
                    <input
                      value={noHp}
                      onChange={e => setNoHp(e.target.value)}
                      className="flex-1 bg-transparent text-sm text-gray-800 outline-none"
                      placeholder="No. HP"
                      type="tel"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1 block">Alamat Lengkap</label>
                  <div className="flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5">
                    <MapPin size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
                    <textarea
                      value={alamat}
                      onChange={e => setAlamat(e.target.value)}
                      rows={3}
                      className="flex-1 bg-transparent text-sm text-gray-800 outline-none resize-none leading-relaxed"
                      placeholder="Jalan, RT/RW, Kelurahan, Kecamatan..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary-50 rounded-2xl border border-primary-100 px-4 py-3 text-xs text-primary-700">
              <p className="font-semibold mb-0.5">Estimasi Pengiriman</p>
              <p className="text-primary-600">2–3 hari kerja setelah pesanan dikonfirmasi tim Agro Jabar.</p>
            </div>
          </>
        )}

        {/* ── STEP 3: PEMBAYARAN ── */}
        {step === 'pembayaran' && (
          <>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-2">
                <CreditCard size={16} className="text-primary-600" />
                <h2 className="font-bold text-sm text-gray-800">Metode Pembayaran</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {METODE_BAYAR.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setMetode(m.id)}
                    className={`w-full flex items-center gap-3 px-4 py-4 text-left transition-all ${metode === m.id ? 'bg-primary-50' : ''}`}
                  >
                    <span className="text-2xl">{m.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-gray-800">{m.label}</p>
                      <p className="text-[11px] text-gray-400">{m.desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${metode === m.id ? 'border-primary-600 bg-primary-600' : 'border-gray-300'}`}>
                      {metode === m.id && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Ringkasan final */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4 space-y-2">
              <h2 className="font-bold text-sm text-gray-800 mb-1">Total Akhir</h2>
              {cart.map(item => (
                <div key={item.produk.id} className="flex justify-between text-sm">
                  <span className="text-gray-500 truncate mr-2">{item.produk.nama} ×{item.qty}</span>
                  <span className="font-medium flex-shrink-0">{formatRupiah(item.hargaFinal * item.qty)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Ongkos kirim</span>
                <span className="font-medium">{formatRupiah(ongkir)}</span>
              </div>
              <div className="border-t border-gray-100 pt-2 flex justify-between">
                <span className="font-bold text-gray-800 text-base">Total Bayar</span>
                <span className="font-bold text-primary-700 text-base">{formatRupiah(totalAkhir)}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── BOTTOM ACTION ── */}
      <div className="fixed bottom-[72px] left-0 right-0 max-w-lg mx-auto px-4 z-40">
        <div className="bg-white border-t border-gray-100 rounded-2xl shadow-xl px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-500">Total Pembayaran</span>
            <span className="font-bold text-primary-700">{formatRupiah(totalAkhir)}</span>
          </div>
          <button
            onClick={() => {
              if (step === 'review') setStep('pengiriman');
              else if (step === 'pengiriman') setStep('pembayaran');
              else setStep('sukses');
            }}
            className="w-full py-4 bg-primary-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            {step === 'review' && <><span>Lanjut ke Pengiriman</span><ChevronRight size={16} /></>}
            {step === 'pengiriman' && <><span>Lanjut ke Pembayaran</span><ChevronRight size={16} /></>}
            {step === 'pembayaran' && <><span>Konfirmasi Pesanan</span><CheckCircle size={16} /></>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutBibitPupukPage;
