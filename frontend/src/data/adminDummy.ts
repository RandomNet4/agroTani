// =====================================================
// DATA DUMMY ADMIN PETANI - AGRO TANI
// (Dipindahkan dari agro_core)
// =====================================================

import type {
  Petani, Lahan, TanamanAktif, Komoditas, HargaKomoditas, HistoriHarga,
  PengajuanJual, Pickup, Pembayaran, Tender, TenderPetani,
  ArtikelEdukasi, ProdukBibitPupuk, QualityControl, BukuKas
} from '../types/admin';

export const dummyPetani: Petani[] = [
  { id: 'PTN001', nama: 'Ahmad Sudirman', nik: '3201234567890001', noHp: '081234567890', email: 'ahmad@email.com', alamat: 'Jl. Sawah Indah No. 12', kecamatan: 'Sarongge', kabupaten: 'Cianjur', provinsi: 'Jawa Barat', fotoProfil: '👨‍🌾', fotoKtp: 'ktp_ahmad.jpg', statusVerifikasi: 'approved', tanggalDaftar: '2025-01-15', tanggalVerifikasi: '2025-01-20' },
  { id: 'PTN002', nama: 'Siti Aminah', nik: '3201234567890002', noHp: '081234567891', email: 'siti@email.com', alamat: 'Jl. Kebun Raya No. 5', kecamatan: 'Cisarua', kabupaten: 'Cianjur', provinsi: 'Jawa Barat', fotoProfil: '👩‍🌾', fotoKtp: 'ktp_siti.jpg', statusVerifikasi: 'approved', tanggalDaftar: '2025-02-01', tanggalVerifikasi: '2025-02-05' },
  { id: 'PTN003', nama: 'Budi Hartono', nik: '3201234567890003', noHp: '081234567892', email: 'budi@email.com', alamat: 'Jl. Tani Makmur No. 8', kecamatan: 'Parongpong', kabupaten: 'Cianjur', provinsi: 'Jawa Barat', fotoProfil: '👨‍🌾', fotoKtp: 'ktp_budi.jpg', statusVerifikasi: 'pending', tanggalDaftar: '2025-11-10' },
  { id: 'PTN004', nama: 'Dewi Lestari', nik: '3201234567890004', noHp: '081234567893', email: 'dewi@email.com', alamat: 'Jl. Pertanian No. 3', kecamatan: 'Cihideung', kabupaten: 'Tasikmalaya', provinsi: 'Jawa Barat', fotoProfil: '👩‍🌾', fotoKtp: 'ktp_dewi.jpg', statusVerifikasi: 'approved', tanggalDaftar: '2025-03-20', tanggalVerifikasi: '2025-03-25' },
  { id: 'PTN005', nama: 'Rudi Setiawan', nik: '3201234567890005', noHp: '081234567894', email: 'rudi@email.com', alamat: 'Jl. Ladang Hijau No. 15', kecamatan: 'Cicalengka', kabupaten: 'Bandung', provinsi: 'Jawa Barat', fotoProfil: '👨‍🌾', fotoKtp: 'ktp_rudi.jpg', statusVerifikasi: 'rejected', tanggalDaftar: '2025-04-01', catatanVerifikasi: 'Dokumen KTP tidak jelas' },
  { id: 'PTN006', nama: 'Rina Wulandari', nik: '3201234567890006', noHp: '081234567895', email: 'rina@email.com', alamat: 'Jl. Subur No. 7', kecamatan: 'Sarongge', kabupaten: 'Cianjur', provinsi: 'Jawa Barat', fotoProfil: '👩‍🌾', fotoKtp: 'ktp_rina.jpg', statusVerifikasi: 'survey', tanggalDaftar: '2025-05-12' },
];

export const dummyLahan: Lahan[] = [
  { id: 'LHN001', petaniId: 'PTN001', namaLahan: 'Sawah Sarongge Utara', lokasi: { lat: -6.8115, lng: 107.6186, alamat: 'Desa Sarongge, Kec. Sarongge' }, luasHektar: 2.5, jenisLahan: 'sawah', kecamatan: 'Sarongge', kabupaten: 'Cianjur', statusVerifikasi: 'approved', fotoLahan: '🌾' },
  { id: 'LHN002', petaniId: 'PTN001', namaLahan: 'Kebun Sayur Sarongge', lokasi: { lat: -6.8120, lng: 107.6200, alamat: 'Kampung Sayur, Kec. Sarongge' }, luasHektar: 1.2, jenisLahan: 'kebun', kecamatan: 'Sarongge', kabupaten: 'Cianjur', statusVerifikasi: 'approved', fotoLahan: '🥬' },
  { id: 'LHN005', petaniId: 'PTN004', namaLahan: 'Sawah Tasik', lokasi: { lat: -7.3270, lng: 108.2170, alamat: 'Desa Cihideung, Tasikmalaya' }, luasHektar: 4.0, jenisLahan: 'sawah', kecamatan: 'Cihideung', kabupaten: 'Tasikmalaya', statusVerifikasi: 'approved', fotoLahan: '🌾' },
];

export const dummyKomoditas: Komoditas[] = [
  { id: 'KMD005', nama: 'Wortel', kategori: 'sayuran', satuan: 'kg', deskripsi: 'Wortel segar', gambar: '🥕', hargaSaatIni: 10000, hargaSebelumnya: 9500, lastUpdate: '2026-02-25', jumlahPetaniAktif: 7, totalEstimasiProduksiKg: 18000, estimasiBulanPanen: 'Maret 2026', kebutuhanBulananKg: 16000, supplyStatus: 'cukup' },
  { id: 'KMD007', nama: 'Buncis', kategori: 'sayuran', satuan: 'kg', deskripsi: 'Buncis hijau segar', gambar: '🫘', hargaSaatIni: 14000, hargaSebelumnya: 13000, lastUpdate: '2026-02-25', jumlahPetaniAktif: 4, totalEstimasiProduksiKg: 5000, estimasiBulanPanen: 'April 2026', kebutuhanBulananKg: 8000, supplyStatus: 'kurang' },
  { id: 'KMD010', nama: 'Jagung Manis', kategori: 'sayuran', satuan: 'kg', deskripsi: 'Jagung manis super', gambar: '🌽', hargaSaatIni: 7000, hargaSebelumnya: 6500, lastUpdate: '2026-02-24', jumlahPetaniAktif: 9, totalEstimasiProduksiKg: 20000, estimasiBulanPanen: 'Mei 2026', kebutuhanBulananKg: 14000, supplyStatus: 'berlebih' },
];

export const dummyTanamanAktif: TanamanAktif[] = [
  { id: 'TAN001', petaniId: 'PTN001', lahanId: 'LHN001', komoditasId: 'KMD005', komoditasNama: 'Wortel', tanggalTanam: '2026-01-10', estimasiPanen: '2026-04-10', estimasiHasilKg: 3000, fotoTanaman: '🥕', statusVerifikasi: 'approved' },
  { id: 'TAN003', petaniId: 'PTN002', lahanId: 'LHN002', komoditasId: 'KMD010', komoditasNama: 'Jagung Manis', tanggalTanam: '2026-01-05', estimasiPanen: '2026-03-20', estimasiHasilKg: 5000, fotoTanaman: '🌽', statusVerifikasi: 'approved' },
];

export const dummyHargaKomoditas: HargaKomoditas[] = dummyKomoditas.map(k => ({
  id: `HRG_${k.id}`, komoditasId: k.id, komoditasNama: k.nama,
  harga: k.hargaSaatIni, wilayah: 'Jawa Barat', tanggalBerlaku: k.lastUpdate, dibuatOleh: 'Admin Agro',
}));

export const dummyHistoriHarga: HistoriHarga[] = [
  { id: 'HH005', komoditasId: 'KMD005', harga: 9000, tanggal: '2025-12-01' },
  { id: 'HH006', komoditasId: 'KMD005', harga: 9500, tanggal: '2026-01-01' },
  { id: 'HH007', komoditasId: 'KMD005', harga: 10000, tanggal: '2026-02-25' },
];

export const dummyPengajuanJual: PengajuanJual[] = [
  { id: 'PJ002', petaniId: 'PTN002', petaniNama: 'Siti Aminah', komoditasId: 'KMD005', komoditasNama: 'Wortel', beratEstimasiKg: 1000, tanggalSiapPickup: '2026-03-21', fotoPanen: '🥕', status: 'pickup_dijadwalkan', tanggalPengajuan: '2026-02-18', metodePembayaran: 'TDF' },
  { id: 'PJ004', petaniId: 'PTN001', petaniNama: 'Ahmad Sudirman', komoditasId: 'KMD005', komoditasNama: 'Wortel', beratEstimasiKg: 800, tanggalSiapPickup: '2026-04-11', fotoPanen: '🥕', status: 'pending', tanggalPengajuan: '2026-02-25', metodePembayaran: 'TDF' },
];

export const dummyPickup: Pickup[] = [
  { id: 'PKP002', pengajuanJualId: 'PJ002', petaniId: 'PTN002', petaniNama: 'Siti Aminah', komoditasNama: 'Wortel', alamatPickup: 'Kampung Sayur, Kec. Sarongge', tanggalPickup: '2026-03-21', driverNama: 'Pak Dedi', driverNoHp: '081888777666', armada: 'Truk Engkel', platNomor: 'D 5678 CD', status: 'berangkat', waktuBerangkat: '06:30' },
];

export const dummyPembayaran: Pembayaran[] = [
  { id: 'PAY003', pickupId: 'PKP002', petaniId: 'PTN002', petaniNama: 'Siti Aminah', komoditasNama: 'Wortel', beratKg: 1000, hargaPerKg: 10000, totalBayar: 10000000, tanggalPickup: '2026-03-21', status: 'menunggu', metodeBayar: 'TDF', nomorInvoice: 'INV-2026-0303' },
];

export const dummyTender: Tender[] = [
  { id: 'TND001', komoditasId: 'KMD005', komoditasNama: 'Wortel', kebutuhanKg: 10000, terpenuhinKg: 4500, periodePanen: 'April 2026', tanggalBerakhir: '2026-03-15', status: 'aktif', deskripsi: 'Kebutuhan wortel untuk program ketahanan pangan', hargaPerKg: 10000 },
  { id: 'TND002', komoditasId: 'KMD007', komoditasNama: 'Buncis', kebutuhanKg: 5000, terpenuhinKg: 2000, periodePanen: 'April 2026', tanggalBerakhir: '2026-03-20', status: 'aktif', deskripsi: 'Kebutuhan buncis untuk retail mitra', hargaPerKg: 14000 },
];

export const dummyTenderPetani: TenderPetani[] = [
  { id: 'TP001', tenderId: 'TND001', petaniId: 'PTN001', petaniNama: 'Ahmad Sudirman', kesanggupanKg: 2000, statusApproval: 'approved', tanggalDaftar: '2026-02-10' },
  { id: 'TP002', tenderId: 'TND001', petaniId: 'PTN004', petaniNama: 'Dewi Lestari', kesanggupanKg: 2500, statusApproval: 'approved', tanggalDaftar: '2026-02-12' },
];

export const dummyArtikelEdukasi: ArtikelEdukasi[] = [
  { id: 'EDU001', judul: 'Teknik Budidaya Wortel Organik', kategori: 'Budidaya', isi: 'Wortel organik merupakan salah satu komoditas yang memiliki nilai jual tinggi...', gambar: '🥕', tanggalPublish: '2026-02-20', penulis: 'Tim Agro Jabar', tipe: 'artikel' },
  { id: 'EDU002', judul: 'Standar Kualitas Hasil Panen Buncis', kategori: 'Standar Kualitas', isi: 'Agro Jabar menetapkan standar kualitas hasil panen buncis...', gambar: '🫘', tanggalPublish: '2026-02-18', penulis: 'QC Agro Jabar', tipe: 'artikel' },
];

export const dummyProdukBibitPupuk: ProdukBibitPupuk[] = [
  { id: 'PRD001', nama: 'Bibit Wortel Kuroda', tipe: 'bibit', harga: 50000, stok: 500, satuan: 'pak', deskripsi: 'Bibit wortel Kuroda', gambar: '🌱', subsidi: true, diskonPersen: 20 },
  { id: 'PRD002', nama: 'Bibit Buncis Lebat F1', tipe: 'bibit', harga: 40000, stok: 300, satuan: 'pak', deskripsi: 'Bibit buncis lurus', gambar: '🌱', subsidi: true, diskonPersen: 15 },
  { id: 'PRD003', nama: 'Pupuk NPK Phonska', tipe: 'pupuk', harga: 275000, stok: 1000, satuan: 'karung 50kg', deskripsi: 'Pupuk NPK 15-15-15', gambar: '🧪', subsidi: true, diskonPersen: 50 },
  { id: 'PRD004', nama: 'Pupuk Organik Kompos', tipe: 'pupuk', harga: 50000, stok: 2000, satuan: 'karung 25kg', deskripsi: 'Pupuk organik', gambar: '🧪', subsidi: false },
];

export const dummyQualityControl: QualityControl[] = [
  { id: 'QC001', pickupId: 'PKP002', petaniNama: 'Siti Aminah', komoditasNama: 'Wortel', beratDiterimaKg: 980, grade: 'A', catatanKerusakan: 'Wortel bersih, ukuran seragam', tanggalQC: '2026-03-21', petugasQC: 'Pak Hendra' },
];

export const dummyBukuKas: BukuKas[] = [
  { id: 'BK001', tanggal: '2026-03-01', tipeTransaksi: 'Uang Masuk', kategori: 'Pencairan Dana BUMD', nominal: 500000000, saldoSebelumnya: 0, saldoAkhir: 500000000, keterangan: 'Pencairan modal awal dari Pemprov Jabar bulan Maret' },
  { id: 'BK002', tanggal: '2026-03-21', tipeTransaksi: 'Uang Keluar', kategori: 'Pembayaran Petani', nominal: 10000000, saldoSebelumnya: 500000000, saldoAkhir: 490000000, keterangan: 'Pembayaran panen Wortel a.n Siti Aminah (INV-2026-0303)', referensiId: 'PAY003' },
];

export const formatRupiah = (angka: number): string => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
};

export const formatTanggal = (tanggal: string): string => {
  return new Date(tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};
