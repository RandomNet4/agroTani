// =====================================================
// BOTTOM NAVIGATION - APP PETANI
// =====================================================

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, TrendingUp, ShoppingCart, History, BookOpen, Sprout, FileText, Truck, Package, Leaf, User, Users, ClipboardCheck } from 'lucide-react';
import { useData } from '../context/DataContext';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const mainNavItems: NavItem[] = [
  { path: '/petani/dashboard', label: 'Home',    icon: <Home size={20} /> },
  { path: '/petani/harga',     label: 'Harga',   icon: <TrendingUp size={20} /> },
  { path: '/petani/jual-panen',label: 'Jual',    icon: <ShoppingCart size={20} /> },
  { path: '/petani/data-lahan', label: 'Tanam',   icon: <Sprout size={20} /> },
  { path: '/petani/profil',    label: 'Profil',  icon: <User size={20} /> },
];

const kepalaNavItems: NavItem[] = [
  { path: '/petani/dashboard', label: 'Home',     icon: <Home size={20} /> },
  { path: '/petani/kelompok',  label: 'Kelompok', icon: <Users size={20} /> },
  { path: '/petani/inspeksi',  label: 'Inspeksi', icon: <ClipboardCheck size={20} /> },
  { path: '/petani/profil',    label: 'Profil',   icon: <User size={20} /> },
];

// Halaman yang tidak menampilkan bottom nav
const HIDE_NAV_PATHS = [
  '/petani/bibit-pupuk', 
  '/petani/checkout-bibit-pupuk',
  '/petani/data-lahan/tambah-lahan',
  '/petani/data-lahan/tambah-tanaman',
  '/petani/edukasi',
  '/petani/inspeksi/'
];

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useData();

  if (HIDE_NAV_PATHS.some(p => location.pathname.startsWith(p))) return null;

  const isKepala = currentUser?.role === 'kepala_petani';
  const navItems = isKepala ? kepalaNavItems : mainNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 z-50 max-w-lg mx-auto">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {item.icon}
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

// Menu lebih lengkap untuk halaman profil/lainnya
export const menuPetani = [
  { path: '/petani/dashboard',  label: 'Dashboard',            icon: <Home size={20} />,         desc: 'Ringkasan informasi' },
  { path: '/petani/data-lahan', label: 'Data Lahan',           icon: <Sprout size={20} />,       desc: 'Lahan & tanaman aktif' },
  { path: '/petani/harga',      label: 'Harga Jual',           icon: <TrendingUp size={20} />,   desc: 'Harga komoditas terbaru' },
  { path: '/petani/rekomendasi',label: 'Rekomendasi Tanam',    icon: <Sprout size={20} />,       desc: 'Saran komoditas' },
  { path: '/petani/tender',     label: 'Tender',               icon: <FileText size={20} />,     desc: 'Permintaan khusus Agro' },
  { path: '/petani/jual-panen', label: 'Jual Panen',           icon: <ShoppingCart size={20} />, desc: 'Ajukan jual hasil panen' },
  { path: '/petani/tracking',   label: 'Tracking Pickup',      icon: <Truck size={20} />,        desc: 'Pantau pengambilan panen' },
  { path: '/petani/jejak-panen',label: 'Jejak Panen',          icon: <Leaf size={20} />,         desc: 'Lacak perjalanan panen' },
  { path: '/petani/riwayat',    label: 'Riwayat Pembayaran',   icon: <History size={20} />,      desc: 'Histori transaksi' },
  { path: '/petani/edukasi',    label: 'Edukasi & Berita',     icon: <BookOpen size={20} />,     desc: 'Artikel & video' },
  { path: '/petani/bibit-pupuk',label: 'Bibit & Pupuk',        icon: <Package size={20} />,      desc: 'Beli bibit & pupuk' },
  { path: '/petani/profil',     label: 'Profil',               icon: <User size={20} />,         desc: 'Akun & pengaturan' },
];

export default BottomNav;
