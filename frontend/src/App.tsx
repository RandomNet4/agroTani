// =====================================================
// APP.TSX - ROUTING AGRO TANI (PETANI + ADMIN)
// =====================================================

import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { PetaniLayout } from './components/Layout';
import { AdminLayout } from './components/AdminLayout';
import { useData } from './context/DataContext';

// Halaman Login
import LoginPage from './pages/LoginPage';

// Halaman Petani
import DashboardPage from './pages/petani/DashboardPage';
import RegistrasiPage from './pages/petani/RegistrasiPage';
import DataLahanPage from './pages/petani/DataLahanPage';
import FormTambahLahanPage from './pages/petani/FormTambahLahanPage';
import FormTambahTanamanPage from './pages/petani/FormTambahTanamanPage';
import NotifikasiPage from './pages/petani/NotifikasiPage';
import HargaJualPage from './pages/petani/HargaJualPage';
import RekomendasiTanamPage from './pages/petani/RekomendasiTanamPage';

import JualPanenPage from './pages/petani/JualPanenPage';
import FormAjukanPanenPage from './pages/petani/FormAjukanPanenPage';
import JualPanenDetailPage from './pages/petani/JualPanenDetailPage';
import TrackingPickupPage from './pages/petani/TrackingPickupPage';
import JejakPanenPage from './pages/petani/JejakPanenPage';
import EdukasiPage from './pages/petani/EdukasiPage';
import DetailEdukasiPage from './pages/petani/DetailEdukasiPage';

import ProfilPage from './pages/petani/ProfilPage';
import EditProfilePage from './pages/petani/EditProfilePage';
import AlamatPage from './pages/petani/AlamatPage';
import MengenaiProfilePage from './pages/petani/MengenaiProfilePage';

// Halaman Kepala Petani (Koordinator)
import KelompokPage from './pages/petani/KelompokPage';
import InspeksiPage from './pages/petani/InspeksiPage';
import FormInspeksiPage from './pages/petani/FormInspeksiPage';

// Halaman Admin
import LoginAdminPage from './pages/admin/LoginAdminPage';
import VerifikasiPetaniPage from './pages/admin/VerifikasiPetaniPage';
import DataLahanAdminPage from './pages/admin/DataLahanAdminPage';
import VerifikasiTanamanPage from './pages/admin/VerifikasiTanamanPage';
import MonitoringSupplyPage from './pages/admin/MonitoringSupplyPage';
import ManajemenHargaPage from './pages/admin/ManajemenHargaPage';

import ManajemenJualPanenPage from './pages/admin/ManajemenJualPanenPage';
import ManajemenPickupPage from './pages/admin/ManajemenPickupPage';
import QualityControlPage from './pages/admin/QualityControlPage';
import ManajemenPembayaranPage from './pages/admin/ManajemenPembayaranPage';
import ManajemenEdukasiPage from './pages/admin/ManajemenEdukasiPage';
import ManajemenAnggaranPage from './pages/admin/ManajemenAnggaranPage';
import ManajemenPOPage from './pages/admin/ManajemenPOPage';

// Route Guard for Petani (Farmer)
const PetaniGuard: React.FC = () => {
  const { currentUser, loading } = useData();
  const token = localStorage.getItem('token');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Redirect to login if user is not authenticated
  if (!currentUser && !token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

// Route Guard for Admin
const AdminGuard: React.FC = () => {
  const isAdmin = localStorage.getItem('adminLoggedIn') === 'true';

  // Redirect to admin login if not logged in
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

const App: React.FC = () => {
  return (
    <Routes>
      {/* Login Petani */}
      <Route path="/" element={<LoginPage />} />

      {/* Registrasi */}
      <Route path="/petani/registrasi" element={<RegistrasiPage />} />

      {/* App Petani — Protected with Guard */}
      <Route element={<PetaniGuard />}>
        <Route path="/petani" element={<PetaniLayout />}>
          <Route index element={<Navigate to="/petani/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="notifikasi" element={<NotifikasiPage />} />
          <Route path="data-lahan" element={<DataLahanPage />} />
          <Route path="data-lahan/tambah-lahan" element={<FormTambahLahanPage />} />
          <Route path="data-lahan/tambah-tanaman" element={<FormTambahTanamanPage />} />
          <Route path="harga" element={<HargaJualPage />} />
          <Route path="rekomendasi" element={<RekomendasiTanamPage />} />

          <Route path="jual-panen" element={<JualPanenPage />} />
          <Route path="jual-panen/form" element={<FormAjukanPanenPage />} />
          <Route path="jual-panen/:id" element={<JualPanenDetailPage />} />
          <Route path="tracking" element={<TrackingPickupPage />} />
          <Route path="jejak-panen" element={<JejakPanenPage />} />
          <Route path="edukasi" element={<EdukasiPage />} />
          <Route path="edukasi/:id" element={<DetailEdukasiPage />} />

          <Route path="profil" element={<ProfilPage />} />
          <Route path="edit-profile" element={<EditProfilePage />} />
          <Route path="alamat" element={<AlamatPage />} />
          <Route path="mengenai" element={<MengenaiProfilePage />} />

          {/* Akses Koordinator/Kepala Petani */}
          <Route path="kelompok" element={<KelompokPage />} />
          <Route path="inspeksi" element={<InspeksiPage />} />
          <Route path="inspeksi/:id" element={<FormInspeksiPage />} />
        </Route>
      </Route>

      {/* ==================== ADMIN PETANI — Protected with Guard ==================== */}
      <Route path="/admin/login" element={<LoginAdminPage />} />
      <Route element={<AdminGuard />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/verifikasi-petani" element={<VerifikasiPetaniPage />} />
          <Route path="/admin/data-lahan" element={<DataLahanAdminPage />} />
          <Route path="/admin/verifikasi-tanaman" element={<VerifikasiTanamanPage />} />
          <Route path="/admin/monitoring" element={<MonitoringSupplyPage />} />
          <Route path="/admin/harga" element={<ManajemenHargaPage />} />

          <Route path="/admin/jual-panen" element={<ManajemenJualPanenPage />} />
          <Route path="/admin/pickup" element={<ManajemenPickupPage />} />
          <Route path="/admin/qc" element={<QualityControlPage />} />
          <Route path="/admin/pembayaran" element={<ManajemenPembayaranPage />} />
          <Route path="/admin/anggaran" element={<ManajemenAnggaranPage />} />
          <Route path="/admin/edukasi" element={<ManajemenEdukasiPage />} />
          <Route path="/admin/po" element={<ManajemenPOPage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
