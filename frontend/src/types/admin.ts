// =====================================================
// TIPE DATA ADMIN - AGRO TANI (ADMIN PETANI)
// =====================================================

export type StatusVerifikasi = 'pending' | 'approved' | 'rejected' | 'survey';
export type StatusPickup = 'dijadwalkan' | 'berangkat' | 'hampir_tiba' | 'sudah_sampai' | 'proses_timbang' | 'selesai';
export type StatusPembayaran = 'menunggu' | 'diproses' | 'dibayar' | 'gagal';
export type StatusTender = 'aktif' | 'terpenuhi' | 'kadaluarsa';
export type StatusPengajuanJual = 'pending' | 'approved' | 'rejected' | 'survey' | 'pickup_dijadwalkan' | 'selesai';
export type JenisLahan = 'sawah' | 'kebun';
export type GradeKualitas = 'A' | 'B' | 'C' | 'reject';
export type KategoriProduk = 'sayuran' | 'buah' | 'umbi' | 'biji-bijian' | 'rempah';

export interface Petani {
  id: string; nama: string; nik: string; noHp: string; email: string;
  alamat: string; kecamatan: string; kabupaten: string; provinsi: string;
  fotoProfil: string; fotoKtp: string; statusVerifikasi: StatusVerifikasi;
  tanggalDaftar: string; tanggalVerifikasi?: string; catatanVerifikasi?: string;
}

export interface Lahan {
  id: string; petaniId: string; namaLahan: string;
  lokasi: { lat: number; lng: number; alamat: string };
  luasHektar: number; jenisLahan: JenisLahan; kecamatan: string;
  kabupaten: string; statusVerifikasi: StatusVerifikasi; fotoLahan: string;
}

export interface TanamanAktif {
  id: string; petaniId: string; lahanId: string; komoditasId: string;
  komoditasNama: string; tanggalTanam: string; estimasiPanen: string;
  estimasiHasilKg: number; fotoTanaman: string; statusVerifikasi: StatusVerifikasi;
  catatanInspeksi?: string; fotoInspeksi?: string;
}

export interface Komoditas {
  id: string; nama: string; kategori: KategoriProduk; satuan: string;
  deskripsi: string; gambar: string; hargaSaatIni: number; hargaSebelumnya: number;
  lastUpdate: string; jumlahPetaniAktif: number; totalEstimasiProduksiKg: number;
  estimasiBulanPanen: string; kebutuhanBulananKg: number;
  supplyStatus: 'kurang' | 'cukup' | 'berlebih';
}

export interface HargaKomoditas {
  id: string; komoditasId: string; komoditasNama: string;
  harga: number; wilayah: string; tanggalBerlaku: string; dibuatOleh: string;
}

export interface HistoriHarga {
  id: string; komoditasId: string; harga: number; tanggal: string;
}

export interface PengajuanJual {
  id: string; petaniId: string; petaniNama: string; komoditasId: string;
  komoditasNama: string; beratEstimasiKg: number; tanggalSiapPickup: string;
  fotoPanen: string; status: StatusPengajuanJual; tanggalPengajuan: string;
  metodePembayaran?: 'TDF' | 'Cash';
}

export interface Pickup {
  id: string; pengajuanJualId: string; petaniId: string; petaniNama: string;
  komoditasNama: string; alamatPickup: string; tanggalPickup: string;
  driverNama: string; driverNoHp: string; armada: string; platNomor: string;
  status: StatusPickup; beratTimbangKg?: number;
  waktuBerangkat?: string; waktuTiba?: string; waktuSelesai?: string;
}

export interface Pembayaran {
  id: string; pickupId: string; petaniId: string; petaniNama: string;
  komoditasNama: string; beratKg: number; hargaPerKg: number; totalBayar: number;
  tanggalPickup: string; tanggalBayar?: string; status: StatusPembayaran;
  metodeBayar: 'TDF' | 'Cash'; nomorInvoice: string; buktiTransfer?: string;
  dibuatOleh?: string;
}

export interface Tender {
  id: string; komoditasId: string; komoditasNama: string;
  kebutuhanKg: number; terpenuhinKg: number; periodePanen: string;
  tanggalBerakhir: string; status: StatusTender; deskripsi: string; hargaPerKg: number;
}

export interface TenderPetani {
  id: string; tenderId: string; petaniId: string; petaniNama: string;
  kesanggupanKg: number; statusApproval: StatusVerifikasi; tanggalDaftar: string;
}

export interface ArtikelEdukasi {
  id: string; judul: string; isi: string; gambar: string;
  kategori: string; tanggalPublish: string; penulis: string;
  tipe: 'artikel' | 'video'; urlVideo?: string;
}

export interface ProdukBibitPupuk {
  id: string; nama: string; tipe: 'bibit' | 'pupuk'; harga: number;
  stok: number; satuan: string; deskripsi: string; gambar: string;
  subsidi: boolean; diskonPersen?: number;
}

export interface QualityControl {
  id: string; pickupId: string; petaniNama: string; komoditasNama: string;
  beratDiterimaKg: number; grade: GradeKualitas; catatanKerusakan: string;
  tanggalQC: string; petugasQC: string;
}

export interface BukuKas {
  id: string;
  tanggal: string;
  tipeTransaksi: 'Uang Masuk' | 'Uang Keluar';
  kategori: 'Pencairan Dana BUMD' | 'Pembayaran Petani' | 'Operasional' | 'Lainnya';
  nominal: number;
  saldoSebelumnya: number;
  saldoAkhir: number;
  keterangan: string;
  referensiId?: string;
}

export interface PurchaseOrder {
  id: string;
  nomorReq: string;
  penerimaKontrak: string;
  operatorLogistik: string;
  tanggalPengajuan: string;
  estimasiPengantaran: string;
  status: 'PENDING' | 'PROSES' | 'SELESAI' | 'BATAL';
  itemsJson: string; // JSON string containing array of items [{ komoditasNama, volumeKg, hargaPerKg, totalHarga }]
}

