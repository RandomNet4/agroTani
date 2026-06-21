import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning database...');
  await prisma.bukuKas.deleteMany();
  await prisma.jejakPanenTimeline.deleteMany();
  await prisma.jejakPanen.deleteMany();
  await prisma.qualityControl.deleteMany();
  await prisma.notifikasi.deleteMany();
  await prisma.pembayaran.deleteMany();
  await prisma.pickup.deleteMany();
  await prisma.tenderPetani.deleteMany();
  await prisma.tender.deleteMany();
  await prisma.pengajuanJual.deleteMany();
  await prisma.tanamanAktif.deleteMany();
  await prisma.hargaKomoditas.deleteMany();
  await prisma.historiHarga.deleteMany();
  await prisma.komoditas.deleteMany();
  await prisma.lahan.deleteMany();
  await prisma.petani.deleteMany();
  await prisma.artikelEdukasi.deleteMany();
  await prisma.produkBibitPupuk.deleteMany();
  await prisma.rekomendasiTanam.deleteMany();
  await prisma.purchaseOrder.deleteMany();

  console.log('Seeding accounts...');

  const hashedPassword = await bcrypt.hash('petani123', 10);

  // ─── Komoditas Master (3 komoditas utama) ─────────────────────────────────
  await prisma.komoditas.createMany({
    data: [
      {
        id: 'KMD001',
        nama: 'Wortel',
        kategori: 'sayuran',
        satuan: 'kg',
        deskripsi: 'Wortel segar organik',
        gambar: '🥕',
        hargaSaatIni: 10000,
        hargaSebelumnya: 9500,
        lastUpdate: '2026-06-01',
        jumlahPetaniAktif: 0,
        totalEstimasiProduksiKg: 0,
        estimasiBulanPanen: 'Juli 2026',
        kebutuhanBulananKg: 16000,
        supplyStatus: 'cukup',
        umurPanenHari: 90,
      },
      {
        id: 'KMD002',
        nama: 'Buncis',
        kategori: 'sayuran',
        satuan: 'kg',
        deskripsi: 'Buncis hijau segar',
        gambar: '🫘',
        hargaSaatIni: 14000,
        hargaSebelumnya: 13000,
        lastUpdate: '2026-06-01',
        jumlahPetaniAktif: 0,
        totalEstimasiProduksiKg: 0,
        estimasiBulanPanen: 'Juli 2026',
        kebutuhanBulananKg: 8000,
        supplyStatus: 'kurang',
        umurPanenHari: 40,
      },
      {
        id: 'KMD003',
        nama: 'Jagung Manis',
        kategori: 'sayuran',
        satuan: 'kg',
        deskripsi: 'Jagung manis super',
        gambar: '🌽',
        hargaSaatIni: 7000,
        hargaSebelumnya: 6500,
        lastUpdate: '2026-06-01',
        jumlahPetaniAktif: 0,
        totalEstimasiProduksiKg: 0,
        estimasiBulanPanen: 'Agustus 2026',
        kebutuhanBulananKg: 14000,
        supplyStatus: 'berlebih',
        umurPanenHari: 90,
      },
    ],
  });

  // ─── Harga Komoditas ──────────────────────────────────────────────────────
  await prisma.hargaKomoditas.createMany({
    data: [
      { id: 'HRG001', komoditasId: 'KMD001', komoditasNama: 'Wortel', harga: 10000, wilayah: 'Jawa Barat', tanggalBerlaku: '2026-06-01', dibuatOleh: 'Admin' },
      { id: 'HRG002', komoditasId: 'KMD002', komoditasNama: 'Buncis', harga: 14000, wilayah: 'Jawa Barat', tanggalBerlaku: '2026-06-01', dibuatOleh: 'Admin' },
      { id: 'HRG003', komoditasId: 'KMD003', komoditasNama: 'Jagung Manis', harga: 7000, wilayah: 'Jawa Barat', tanggalBerlaku: '2026-06-01', dibuatOleh: 'Admin' },
    ],
  });

  // ─── Histori Harga ────────────────────────────────────────────────────────
  await prisma.historiHarga.createMany({
    data: [
      { id: 'HH001', komoditasId: 'KMD001', harga: 9000, tanggal: '2026-04-01' },
      { id: 'HH002', komoditasId: 'KMD001', harga: 9500, tanggal: '2026-05-01' },
      { id: 'HH003', komoditasId: 'KMD001', harga: 10000, tanggal: '2026-06-01' },
      { id: 'HH004', komoditasId: 'KMD002', harga: 12000, tanggal: '2026-04-01' },
      { id: 'HH005', komoditasId: 'KMD002', harga: 13000, tanggal: '2026-05-01' },
      { id: 'HH006', komoditasId: 'KMD002', harga: 14000, tanggal: '2026-06-01' },
      { id: 'HH007', komoditasId: 'KMD003', harga: 6000, tanggal: '2026-04-01' },
      { id: 'HH008', komoditasId: 'KMD003', harga: 6500, tanggal: '2026-05-01' },
      { id: 'HH009', komoditasId: 'KMD003', harga: 7000, tanggal: '2026-06-01' },
    ],
  });

  // ─── Akun Users ───────────────────────────────────────────────────────────

  // 1. Admin — mengelola harga, verifikasi, dll
  await prisma.petani.create({
    data: {
      id: 'ADM001',
      nama: 'Admin Agro Jabar',
      nik: '3204010000000001',
      noHp: '081200000001',
      email: 'admin@agrojabar.id',
      alamat: 'Kantor Pusat Agro Jabar',
      kecamatan: 'Bandung Wetan',
      kabupaten: 'Bandung',
      provinsi: 'Jawa Barat',
      fotoProfil: '',
      fotoKtp: '',
      statusVerifikasi: 'approved',
      tanggalDaftar: '2026-01-01',
      tanggalVerifikasi: '2026-01-01',
      gudangTujuanId: null,
      gudangTujuanNama: null,
      password: hashedPassword,
      role: 'admin',
      kepalaPetaniId: null,
    },
  });

  // 2. Kepala Petani — menerima pesanan dari gudang, distribusi ke petani
  await prisma.petani.create({
    data: {
      id: 'KPT001',
      nama: 'Haji Udin (Kepala Tani Lembang)',
      nik: '3204010101850001',
      noHp: '081234500001',
      email: 'kepalatani.lembang@petani.id',
      alamat: 'Desa Lembang, Kec. Lembang',
      kecamatan: 'Lembang',
      kabupaten: 'Bandung Barat',
      provinsi: 'Jawa Barat',
      fotoProfil: '',
      fotoKtp: '',
      statusVerifikasi: 'approved',
      tanggalDaftar: '2026-01-05',
      tanggalVerifikasi: '2026-01-06',
      gudangTujuanId: null,
      gudangTujuanNama: 'Gudang Agro Bandung',
      password: hashedPassword,
      role: 'kepala_petani',
      kepalaPetaniId: null,
    },
  });

  // 3. Petani biasa — bawahan kepala petani
  await prisma.petani.create({
    data: {
      id: 'PTN001',
      nama: 'Ahmad Suryadi',
      nik: '3204010101900001',
      noHp: '081234567001',
      email: 'ahmad.suryadi@petani.id',
      alamat: 'Desa Cimenyan, Kec. Lembang',
      kecamatan: 'Lembang',
      kabupaten: 'Bandung Barat',
      provinsi: 'Jawa Barat',
      fotoProfil: '',
      fotoKtp: '',
      statusVerifikasi: 'approved',
      tanggalDaftar: '2026-01-10',
      tanggalVerifikasi: '2026-01-12',
      gudangTujuanId: null,
      gudangTujuanNama: null,
      password: hashedPassword,
      role: 'petani',
      kepalaPetaniId: 'KPT001', // bawahan Haji Udin
    },
  });

  await prisma.petani.create({
    data: {
      id: 'PTN002',
      nama: 'Iwan Setiawan',
      nik: '3204010101900002',
      noHp: '081234567002',
      email: 'iwan.setiawan@petani.id',
      alamat: 'Desa Cibodas, Kec. Lembang',
      kecamatan: 'Lembang',
      kabupaten: 'Bandung Barat',
      provinsi: 'Jawa Barat',
      fotoProfil: '',
      fotoKtp: '',
      statusVerifikasi: 'approved',
      tanggalDaftar: '2026-01-15',
      tanggalVerifikasi: '2026-01-17',
      gudangTujuanId: null,
      gudangTujuanNama: null,
      password: hashedPassword,
      role: 'petani',
      kepalaPetaniId: 'KPT001', // bawahan Haji Udin
    },
  });

  await prisma.petani.create({
    data: {
      id: 'PTN003',
      nama: 'Siti Nurhaliza',
      nik: '3204010101900003',
      noHp: '081234567003',
      email: 'siti.nurhaliza@petani.id',
      alamat: 'Desa Ciwidey, Kec. Ciwidey',
      kecamatan: 'Ciwidey',
      kabupaten: 'Bandung',
      provinsi: 'Jawa Barat',
      fotoProfil: '',
      fotoKtp: '',
      statusVerifikasi: 'approved',
      tanggalDaftar: '2026-02-01',
      tanggalVerifikasi: '2026-02-03',
      gudangTujuanId: null,
      gudangTujuanNama: null,
      password: hashedPassword,
      role: 'petani',
      kepalaPetaniId: 'KPT001', // bawahan Haji Udin
    },
  });

  console.log('');
  console.log('=== Seeding completed! ===');
  console.log('');
  console.log('Akun yang dibuat:');
  console.log('─────────────────────────────────────────────');
  console.log('ADMIN:');
  console.log('  Email: admin@agrojabar.id / HP: 081200000001 / Pass: petani123');
  console.log('');
  console.log('KEPALA PETANI (1 orang):');
  console.log('  Email: kepalatani.lembang@petani.id / HP: 081234500001 / Pass: petani123');
  console.log('');
  console.log('PETANI (3 orang, bawahan kepala petani):');
  console.log('  Email: ahmad.suryadi@petani.id / HP: 081234567001 / Pass: petani123');
  console.log('  Email: iwan.setiawan@petani.id / HP: 081234567002 / Pass: petani123');
  console.log('  Email: siti.nurhaliza@petani.id / HP: 081234567003 / Pass: petani123');
  console.log('─────────────────────────────────────────────');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
