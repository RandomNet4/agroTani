import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'agro_tani_secret_key_123';


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Helper functions for mapping nested DB structures
function mapLahan(l: any) {
  return {
    id: l.id,
    petaniId: l.petaniId,
    namaLahan: l.namaLahan,
    lokasi: {
      lat: l.latitude,
      lng: l.longitude,
      alamat: l.alamat,
    },
    luasHektar: l.luasHektar,
    jenisLahan: l.jenisLahan,
    kecamatan: l.kecamatan,
    kabupaten: l.kabupaten,
    statusVerifikasi: l.statusVerifikasi,
    fotoLahan: l.fotoLahan,
  };
}

function mapTanamanAktif(t: any) {
  return {
    id: t.id,
    petaniId: t.petaniId,
    lahanId: t.lahanId,
    komoditasId: t.komoditasId,
    komoditasNama: t.komoditasNama,
    tanggalTanam: t.tanggalTanam,
    estimasiPanen: t.estimasiPanen,
    estimasiHasilKg: t.estimasiHasilKg,
    fotoTanaman: t.fotoTanaman,
    statusVerifikasi: t.statusVerifikasi,
    catatanInspeksi: t.catatanInspeksi,
    fotoInspeksi: t.fotoInspeksi,
    catatan: t.catatan ?? undefined,
    luasLahanDigunakan: t.luasLahanDigunakan ?? undefined,
    jarakTanam: t.jarakTanam ?? undefined,
    kebutuhanBibit: t.kebutuhanBibit ?? undefined,
    ...(t.latitudeInspeksi !== null && t.longitudeInspeksi !== null ? {
      gpsInspeksi: {
        lat: t.latitudeInspeksi,
        lng: t.longitudeInspeksi,
      }
    } : {})
  };
}

function mapPickup(p: any) {
  return {
    id: p.id,
    pengajuanJualId: p.pengajuanJualId,
    petaniId: p.petaniId,
    petaniNama: p.petaniNama,
    komoditasNama: p.komoditasNama,
    alamatPickup: p.alamatPickup,
    tanggalPickup: p.tanggalPickup,
    driverNama: p.driverNama,
    driverNoHp: p.driverNoHp,
    armada: p.armada,
    platNomor: p.platNomor,
    status: p.status,
    beratTimbangKg: p.beratTimbangKg ?? undefined,
    fotoTimbang: p.fotoTimbang ?? undefined,
    fotoPanen: p.fotoPanen ?? undefined,
    waktuBerangkat: p.waktuBerangkat ?? undefined,
    waktuTiba: p.waktuTiba ?? undefined,
    waktuSelesai: p.waktuSelesai ?? undefined,
    ...(p.latitude !== null && p.longitude !== null ? {
      gpsLokasi: {
        lat: p.latitude,
        lng: p.longitude,
      }
    } : {})
  };
}

// 1. GET ALL DATA (Aggregated endpoint for simple context syncing)
app.get('/api/all-data', async (req, res) => {
  try {
    const petani = await prisma.petani.findMany({
      orderBy: { id: 'desc' }
    });
    const lahanRaw = await prisma.lahan.findMany({
      orderBy: { id: 'desc' }
    });
    const tanamanRaw = await prisma.tanamanAktif.findMany({
      orderBy: { id: 'desc' }
    });
    const komoditas = await prisma.komoditas.findMany({
      orderBy: { id: 'desc' }
    });
    const hargaKomoditas = await prisma.hargaKomoditas.findMany({
      orderBy: { id: 'desc' }
    });
    const historiHarga = await prisma.historiHarga.findMany({
      orderBy: [{ tanggal: 'desc' }, { id: 'desc' }]
    });
    const pengajuanJual = await prisma.pengajuanJual.findMany({
      orderBy: { id: 'desc' }
    });
    const pickupRaw = await prisma.pickup.findMany({
      orderBy: [{ tanggalPickup: 'desc' }, { id: 'desc' }]
    });
    const pembayaran = await prisma.pembayaran.findMany({
      orderBy: [{ tanggalPickup: 'desc' }, { id: 'desc' }]
    });
    const tender = await prisma.tender.findMany({
      orderBy: { id: 'desc' }
    });
    const tenderPetani = await prisma.tenderPetani.findMany({
      orderBy: [{ tanggalDaftar: 'desc' }, { id: 'desc' }]
    });
    const artikelEdukasi = await prisma.artikelEdukasi.findMany({
      orderBy: [{ tanggalPublish: 'desc' }, { id: 'desc' }]
    });
    const produkBibitPupuk = await prisma.produkBibitPupuk.findMany({
      orderBy: { id: 'desc' }
    });
    const qualityControl = await prisma.qualityControl.findMany({
      orderBy: [{ tanggalQC: 'desc' }, { id: 'desc' }]
    });
    const notifikasi = await prisma.notifikasi.findMany({
      orderBy: [{ tanggal: 'desc' }, { id: 'desc' }]
    });
    const rekomendasiTanam = await prisma.rekomendasiTanam.findMany({
      orderBy: { id: 'desc' }
    });
    const jejakPanenRaw = await prisma.jejakPanen.findMany({
      include: { timeline: true },
      orderBy: { id: 'desc' }
    });
    const bukuKas = await prisma.bukuKas.findMany({
      orderBy: [{ tanggal: 'desc' }, { id: 'desc' }]
    });
    const purchaseOrders = await prisma.purchaseOrder.findMany({
      orderBy: [{ tanggalPengajuan: 'desc' }, { id: 'desc' }]
    });

    // Map to nested formats
    const lahan = lahanRaw.map(mapLahan);
    const tanamanAktif = tanamanRaw.map(mapTanamanAktif);
    const pickup = pickupRaw.map(mapPickup);
    const jejakPanen = jejakPanenRaw.map((jp: any) => ({
      id: jp.id,
      petaniId: jp.petaniId,
      pickupId: jp.pickupId,
      komoditasNama: jp.komoditasNama,
      emoji: jp.emoji,
      beratAwalKg: jp.beratAwalKg,
      gradeAwal: jp.gradeAwal,
      statusSaatIni: jp.statusSaatIni,
      timeline: jp.timeline.map((t: any) => ({
        status: t.status,
        tanggal: t.tanggal,
        lokasi: t.lokasi,
        keterangan: t.keterangan ?? undefined,
      }))
    }));

    res.json({
      petani,
      lahan,
      tanamanAktif,
      komoditas,
      hargaKomoditas,
      historiHarga,
      pengajuanJual,
      pickup,
      pembayaran,
      tender,
      tenderPetani,
      artikelEdukasi,
      produkBibitPupuk,
      qualityControl,
      notifikasi,
      rekomendasiTanam,
      jejakPanen,
      bukuKas,
      purchaseOrders,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 2. PETANI (Auth & Profile)
app.post('/api/petani/login', async (req, res) => {
  const { phone, password } = req.body;
  try {
    const p = await prisma.petani.findFirst({ where: { noHp: phone } });
    if (!p) {
      return res.status(404).json({ error: 'Petani tidak ditemukan dengan nomor hp tersebut.' });
    }
    
    // Compare password
    const isMatch = await bcrypt.compare(password, p.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Nomor telepon tidak terdaftar atau kata sandi salah.' });
    }

    // Enforce admin verification approval
    if (p.statusVerifikasi !== 'approved') {
      let errorMsg = 'Akun Anda belum aktif.';
      if (p.statusVerifikasi === 'pending') {
        errorMsg = 'Akun Anda belum disetujui oleh Admin. Silakan tunggu proses verifikasi selesai.';
      } else if (p.statusVerifikasi === 'rejected') {
        errorMsg = `Pendaftaran Anda ditolak oleh Admin. Catatan: ${p.catatanVerifikasi || '-'}`;
      } else if (p.statusVerifikasi === 'survey') {
        errorMsg = 'Akun Anda sedang dalam proses survey lapangan oleh tim verifikasi.';
      }
      return res.status(403).json({ error: errorMsg });
    }

    // Generate JWT
    const token = jwt.sign({ id: p.id, role: 'petani' }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ token, petani: p });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/petani/register', async (req, res) => {
  const { 
    nama, nik, noHp, email, alamat, kecamatan, kabupaten, provinsi, fotoProfil, fotoKtp, password,
    namaLahan, jenisLahan, luasHektar, latitude, longitude, alamatLahan, fotoLahan
  } = req.body;

  try {
    const existing = await prisma.petani.findFirst({ where: { noHp } });
    if (existing) {
      return res.status(400).json({ error: 'Nomor telepon sudah terdaftar.' });
    }

    const petaniId = `PTN${Date.now()}`;
    const hashedPassword = await bcrypt.hash(password || 'password123', 10);

    const newPetani = await prisma.petani.create({
      data: {
        id: petaniId,
        nama,
        nik,
        noHp,
        email,
        alamat,
        kecamatan,
        kabupaten,
        provinsi: provinsi || 'Jawa Barat',
        fotoProfil: fotoProfil || '👨‍🌾',
        fotoKtp: fotoKtp || 'ktp_placeholder.jpg',
        password: hashedPassword,
        statusVerifikasi: 'pending',
        tanggalDaftar: new Date().toISOString().split('T')[0],
      }
    });

    // Create Lahan if details provided
    if (namaLahan) {
      const lahanId = `LHN${Date.now()}`;
      await prisma.lahan.create({
        data: {
          id: lahanId,
          petaniId: petaniId,
          namaLahan,
          latitude: parseFloat(latitude || '0'),
          longitude: parseFloat(longitude || '0'),
          alamat: alamatLahan || alamat,
          luasHektar: parseFloat(luasHektar || '0'),
          jenisLahan: jenisLahan || 'sawah',
          kecamatan,
          kabupaten,
          statusVerifikasi: 'pending',
          fotoLahan: fotoLahan || '🌾'
        }
      });
    }

    // Create welcome notification
    await prisma.notifikasi.create({
      data: {
        id: `NTF_${Date.now()}`,
        judul: 'Pendaftaran Berhasil',
        pesan: `Selamat datang ${nama}! Pendaftaran Anda sedang dalam proses verifikasi oleh Admin.`,
        tanggal: new Date().toISOString().split('T')[0],
        dibaca: false,
        tipe: 'info'
      }
    });

    const token = jwt.sign({ id: newPetani.id, role: 'petani' }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, petani: newPetani });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/petani/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };
  try {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    const updated = await prisma.petani.update({
      where: { id },
      data: updateData,
    });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/petani/:id/verify', async (req, res) => {
  const { id } = req.params;
  const { status, catatanVerifikasi, gudangTujuanId, gudangTujuanNama } = req.body;
  try {
    const updated = await prisma.petani.update({
      where: { id },
      data: {
        statusVerifikasi: status,
        tanggalVerifikasi: new Date().toISOString().split('T')[0],
        catatanVerifikasi,
        gudangTujuanId,
        gudangTujuanNama
      }
    });

    // Create notification
    await prisma.notifikasi.create({
      data: {
        id: `NTF_${Date.now()}`,
        judul: status === 'approved' ? 'Verifikasi Petani Disetujui' : 'Verifikasi Petani Ditolak',
        pesan: status === 'approved' 
          ? `Akun Anda telah disetujui. Hub ke gudang: ${gudangTujuanNama || '-'}`
          : `Pendaftaran ditolak: ${catatanVerifikasi || '-'}`,
        tanggal: new Date().toISOString().split('T')[0],
        dibaca: false,
        tipe: status === 'approved' ? 'success' : 'danger'
      }
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 3. LAHAN (Land)
app.post('/api/lahan', async (req, res) => {
  const { id, petaniId, namaLahan, latitude, longitude, alamat, luasHektar, jenisLahan, kecamatan, kabupaten, fotoLahan } = req.body;
  try {
    const newLahan = await prisma.lahan.create({
      data: {
        id,
        petaniId,
        namaLahan,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        alamat,
        luasHektar: parseFloat(luasHektar),
        jenisLahan,
        kecamatan,
        kabupaten,
        statusVerifikasi: 'pending',
        fotoLahan: fotoLahan || '🌾'
      }
    });
    res.json(mapLahan(newLahan));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/lahan/:id', async (req, res) => {
  const { id } = req.params;
  const { namaLahan, luasHektar, jenisLahan, alamat, kecamatan, kabupaten, statusVerifikasi } = req.body;
  try {
    const updated = await prisma.lahan.update({
      where: { id },
      data: {
        namaLahan,
        luasHektar: luasHektar ? parseFloat(luasHektar) : undefined,
        jenisLahan,
        alamat,
        kecamatan,
        kabupaten,
        statusVerifikasi
      }
    });
    res.json(mapLahan(updated));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/lahan/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.lahan.delete({ where: { id } });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/lahan/:id/verify', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updated = await prisma.lahan.update({
      where: { id },
      data: { statusVerifikasi: status }
    });

    const lahan = await prisma.lahan.findUnique({ where: { id } });
    if (lahan) {
      await prisma.notifikasi.create({
        data: {
          id: `NTF_${Date.now()}`,
          judul: status === 'approved' ? 'Lahan Terverifikasi' : 'Verifikasi Lahan Gagal',
          pesan: `Pengajuan lahan ${lahan.namaLahan} Anda statusnya kini: ${status}`,
          tanggal: new Date().toISOString().split('T')[0],
          dibaca: false,
          tipe: status === 'approved' ? 'success' : 'warning'
        }
      });
    }

    res.json(mapLahan(updated));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 4. TANAMAN AKTIF (Active Crop)
app.post('/api/tanaman-aktif', async (req, res) => {
  const { id, petaniId, lahanId, komoditasId, komoditasNama, tanggalTanam, estimasiPanen, estimasiHasilKg, fotoTanaman, catatan, luasLahanDigunakan, jarakTanam, kebutuhanBibit } = req.body;
  try {
    const newTanaman = await prisma.tanamanAktif.create({
      data: {
        id,
        petaniId,
        lahanId,
        komoditasId,
        komoditasNama,
        tanggalTanam,
        estimasiPanen,
        estimasiHasilKg: parseFloat(estimasiHasilKg),
        fotoTanaman: fotoTanaman || '🌱',
        statusVerifikasi: 'pending', // Set status to pending to require admin verification
        catatan,
        luasLahanDigunakan: luasLahanDigunakan ? parseFloat(luasLahanDigunakan) : null,
        jarakTanam: jarakTanam ? parseFloat(jarakTanam) : null,
        kebutuhanBibit: kebutuhanBibit ? parseInt(kebutuhanBibit) : null,
      }
    });
    res.json(mapTanamanAktif(newTanaman));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/tanaman-aktif/:id', async (req, res) => {
  const { id } = req.params;
  const { tanggalTanam, estimasiPanen, estimasiHasilKg, statusVerifikasi, catatan, luasLahanDigunakan, jarakTanam, kebutuhanBibit } = req.body;
  try {
    const updated = await prisma.tanamanAktif.update({
      where: { id },
      data: {
        tanggalTanam,
        estimasiPanen,
        estimasiHasilKg: estimasiHasilKg ? parseFloat(estimasiHasilKg) : undefined,
        statusVerifikasi,
        catatan,
        luasLahanDigunakan: luasLahanDigunakan !== undefined ? (luasLahanDigunakan ? parseFloat(luasLahanDigunakan) : null) : undefined,
        jarakTanam: jarakTanam !== undefined ? (jarakTanam ? parseFloat(jarakTanam) : null) : undefined,
        kebutuhanBibit: kebutuhanBibit !== undefined ? (kebutuhanBibit ? parseInt(kebutuhanBibit) : null) : undefined,
      }
    });
    res.json(mapTanamanAktif(updated));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/tanaman-aktif/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.tanamanAktif.delete({ where: { id } });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tanaman-aktif/:id/inspect', async (req, res) => {
  const { id } = req.params;
  const { catatanInspeksi, fotoInspeksi, gpsInspeksi, statusVerifikasi } = req.body;
  try {
    const updated = await prisma.tanamanAktif.update({
      where: { id },
      data: {
        catatanInspeksi,
        fotoInspeksi,
        latitudeInspeksi: gpsInspeksi?.lat ? parseFloat(gpsInspeksi.lat) : null,
        longitudeInspeksi: gpsInspeksi?.lng ? parseFloat(gpsInspeksi.lng) : null,
        statusVerifikasi: statusVerifikasi || 'approved',
      }
    });
    res.json(mapTanamanAktif(updated));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 5. KOMODITAS & HARGA (Commodities and Pricing)

// GET /api/harga — daftar harga komoditas aktif (dipanggil oleh GUDANG)
app.get('/api/harga', async (req, res) => {
  try {
    const hargaList = await prisma.hargaKomoditas.findMany({
      orderBy: { tanggalBerlaku: 'desc' },
    });
    const komoditasList = await prisma.komoditas.findMany();

    // Map komoditas nama to a kodeKomoditasGlobal that gudang understands
    const namaToKode: Record<string, string> = {
      'Wortel': 'WORTEL',
      'Buncis': 'BUNCIS',
      'Jagung Manis': 'JAGUNG_MANIS',
    };

    const enriched = hargaList.map((h: any) => {
      const kmd = komoditasList.find((k: any) => k.id === h.komoditasId);
      return {
        ...h,
        kodeKomoditasGlobal: kmd ? (namaToKode[kmd.nama] || kmd.nama.toUpperCase().replace(/\s+/g, '_')) : null,
      };
    });

    res.json({ harga: enriched, komoditas: komoditasList });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/harga/histori — histori perubahan harga (dipanggil oleh GUDANG)
app.get('/api/harga/histori', async (req, res) => {
  try {
    const histori = await prisma.historiHarga.findMany({
      orderBy: [{ tanggal: 'desc' }, { id: 'desc' }],
    });
    res.json({ histori });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/harga', async (req, res) => {
  const { id, komoditasId, komoditasNama, harga, wilayah, dibuatOleh } = req.body;
  const tgl = new Date().toISOString().split('T')[0];
  try {
    // 1. Get commodity to calculate previous price
    const k = await prisma.komoditas.findUnique({ where: { id: komoditasId } });
    const hargaSebelumnya = k ? k.hargaSaatIni : harga;

    // 2. Update Commodity Current Price
    await prisma.komoditas.update({
      where: { id: komoditasId },
      data: {
        hargaSaatIni: parseFloat(harga),
        hargaSebelumnya: parseFloat(hargaSebelumnya),
        lastUpdate: tgl,
      }
    });

    // 3. Create active price record
    const newHarga = await prisma.hargaKomoditas.create({
      data: {
        id,
        komoditasId,
        komoditasNama,
        harga: parseFloat(harga),
        wilayah,
        tanggalBerlaku: tgl,
        dibuatOleh,
      }
    });

    // 4. Record to Price History
    await prisma.historiHarga.create({
      data: {
        id: `HH_${Date.now()}`,
        komoditasId,
        harga: parseFloat(harga),
        tanggal: tgl,
      }
    });

    // 5. Generate update notification
    await prisma.notifikasi.create({
      data: {
        id: `NTF_${Date.now()}`,
        judul: 'Update Harga Komoditas',
        pesan: `Harga ${komoditasNama} disesuaikan menjadi Rp ${parseFloat(harga).toLocaleString()}/kg per ${tgl}.`,
        tanggal: tgl,
        dibaca: false,
        tipe: 'info'
      }
    });

    res.json(newHarga);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 6. PENGAJUAN JUAL (Sale Requests)
app.post('/api/pengajuan-jual', async (req, res) => {
  const {
    id, petaniId, petaniNama, komoditasId, komoditasNama, beratEstimasiKg,
    tanggalSiapPickup, fotoPanen, tanamanAktifId, lahanId, lahanNama,
    hargaAcuanKg, estimasiPendapatan, catatanPetani, metodePembayaran
  } = req.body;

  try {
    const petani = await prisma.petani.findUnique({ where: { id: petaniId } });
    const newPengajuan = await prisma.pengajuanJual.create({
      data: {
        id,
        petaniId,
        petaniNama,
        komoditasId,
        komoditasNama,
        beratEstimasiKg: parseFloat(beratEstimasiKg),
        tanggalSiapPickup,
        fotoPanen: fotoPanen || '🌾',
        status: 'pending',
        tanggalPengajuan: new Date().toISOString().split('T')[0],
        tanamanAktifId,
        lahanId,
        lahanNama,
        hargaAcuanKg: hargaAcuanKg ? parseFloat(hargaAcuanKg) : null,
        estimasiPendapatan: estimasiPendapatan ? parseFloat(estimasiPendapatan) : null,
        catatanPetani,
        metodePembayaran,
        gudangTujuanId: petani?.gudangTujuanId,
        gudangTujuanNama: petani?.gudangTujuanNama,
      }
    });
    res.json(newPengajuan);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/pengajuan-jual/:id/verify', async (req, res) => {
  const { id } = req.params;
  const { status, catatanAdmin } = req.body;
  try {
    const currentPengajuan = await prisma.pengajuanJual.findUnique({ where: { id } });
    if (!currentPengajuan) {
      return res.status(404).json({ error: 'Pengajuan tidak ditemukan' });
    }

    let targetStatus = status;
    let isAutoPickup = false;
    let customPesan = `Pengajuan jual ${currentPengajuan.komoditasNama} Anda statusnya kini: ${status}. ${catatanAdmin ? `Catatan: ${catatanAdmin}` : ''}`;

    if (status === 'approved' && currentPengajuan.beratEstimasiKg < 300) {
      targetStatus = 'pickup_dijadwalkan';
      isAutoPickup = true;
      customPesan = `Pengajuan jual ${currentPengajuan.komoditasNama} Anda disetujui! Karena berat di bawah 300kg, silakan antar hasil panen Anda langsung ke Gudang Agro Jabar pada tanggal ${currentPengajuan.tanggalSiapPickup}.`;
    }

    const updated = await prisma.pengajuanJual.update({
      where: { id },
      data: {
        status: targetStatus,
        catatanAdmin
      }
    });

    if (isAutoPickup) {
      const pickupId = `PKP_AUTO_${Date.now().toString().slice(-6)}`;
      await prisma.pickup.create({
        data: {
          id: pickupId,
          pengajuanJualId: updated.id,
          petaniId: updated.petaniId,
          petaniNama: updated.petaniNama,
          komoditasNama: updated.komoditasNama,
          alamatPickup: updated.lahanNama || 'Diantar Mandiri',
          tanggalPickup: updated.tanggalSiapPickup,
          driverNama: 'Petani (Mandiri)',
          driverNoHp: '-',
          armada: 'Pengantaran Mandiri',
          platNomor: '-',
          status: 'dijadwalkan',
        }
      });

      await prisma.pembayaran.create({
        data: {
          id: `PAY_${Date.now().toString().slice(-6)}`,
          pickupId: pickupId,
          petaniId: updated.petaniId,
          petaniNama: updated.petaniNama,
          komoditasNama: updated.komoditasNama,
          beratKg: 0,
          hargaPerKg: updated.hargaAcuanKg || 0,
          totalBayar: 0,
          tanggalPickup: updated.tanggalSiapPickup,
          status: 'menunggu',
          metodeBayar: updated.metodePembayaran || 'TDF',
          nomorInvoice: `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`
        }
      });
    }

    await prisma.notifikasi.create({
      data: {
        id: `NTF_${Date.now()}`,
        judul: status === 'rejected' ? 'Pengajuan Jual Ditolak' : 'Pengajuan Jual Diupdate',
        pesan: customPesan,
        tanggal: new Date().toISOString().split('T')[0],
        dibaca: false,
        tipe: status === 'rejected' ? 'danger' : 'success'
      }
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 7. PICKUP (Tracking & Scheduling)
app.post('/api/pickup', async (req, res) => {
  const {
    id, pengajuanJualId, petaniId, petaniNama, komoditasNama,
    alamatPickup, tanggalPickup, driverNama, driverNoHp, armada, platNomor
  } = req.body;

  try {
    const newPickup = await prisma.pickup.create({
      data: {
        id,
        pengajuanJualId,
        petaniId,
        petaniNama,
        komoditasNama,
        alamatPickup,
        tanggalPickup,
        driverNama,
        driverNoHp,
        armada,
        platNomor,
        status: 'dijadwalkan',
      }
    });

    // Update the parent request status
    await prisma.pengajuanJual.update({
      where: { id: pengajuanJualId },
      data: { status: 'pickup_dijadwalkan' }
    });

    // Create payment entry as 'menunggu' (Awaiting pickup/weight verification)
    const pj = await prisma.pengajuanJual.findUnique({ where: { id: pengajuanJualId } });
    const hargaAcuan = pj?.hargaAcuanKg || 0;
    await prisma.pembayaran.create({
      data: {
        id: `PAY_${Date.now().toString().slice(-6)}`,
        pickupId: id,
        petaniId,
        petaniNama,
        komoditasNama,
        beratKg: 0,
        hargaPerKg: hargaAcuan,
        totalBayar: 0,
        tanggalPickup,
        status: 'menunggu',
        metodeBayar: pj?.metodePembayaran || 'TDF',
        nomorInvoice: `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`
      }
    });

    await prisma.notifikasi.create({
      data: {
        id: `NTF_${Date.now()}`,
        judul: 'Pickup Dijadwalkan',
        pesan: `Pickup panen ${komoditasNama} dijadwalkan pada ${tanggalPickup} bersama driver ${driverNama} (${platNomor}).`,
        tanggal: new Date().toISOString().split('T')[0],
        dibaca: false,
        tipe: 'success'
      }
    });

    res.json(mapPickup(newPickup));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/pickup/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status, beratTimbangKg, fotoTimbang, gpsLokasi, waktuBerangkat, waktuTiba, waktuSelesai } = req.body;
  try {
    const updated = await prisma.pickup.update({
      where: { id },
      data: {
        status,
        beratTimbangKg: beratTimbangKg ? parseFloat(beratTimbangKg) : undefined,
        fotoTimbang,
        latitude: gpsLokasi?.lat ? parseFloat(gpsLokasi.lat) : undefined,
        longitude: gpsLokasi?.lng ? parseFloat(gpsLokasi.lng) : undefined,
        waktuBerangkat,
        waktuTiba,
        waktuSelesai
      }
    });

    // If status is 'selesai', sync parent PengajuanJual and update Pembayaran
    if (status === 'selesai') {
      await prisma.pengajuanJual.update({
        where: { id: updated.pengajuanJualId },
        data: { status: 'proses_timbang' }
      });

      // Update Pembayaran weights & total amount
      const pay = await prisma.pembayaran.findFirst({ where: { pickupId: id } });
      if (pay && beratTimbangKg) {
        const berat = parseFloat(beratTimbangKg);
        const total = berat * pay.hargaPerKg;
        await prisma.pembayaran.update({
          where: { id: pay.id },
          data: {
            beratKg: berat,
            totalBayar: total,
            status: 'diproses' // Processing payment since weighing completed
          }
        });
      }

      // Create JejakPanen record
      await prisma.jejakPanen.create({
        data: {
          id: `JP_${Date.now().toString().slice(-6)}`,
          petaniId: updated.petaniId,
          pickupId: id,
          komoditasNama: updated.komoditasNama,
          emoji: '🌾',
          beratAwalKg: parseFloat(beratTimbangKg),
          gradeAwal: 'A',
          statusSaatIni: 'qc_selesai',
        }
      });

      // Notify GUDANG backend — penerimaan bahan baku dari petani
      const GUDANG_URL = process.env.GUDANG_URL || 'http://localhost:5005';
      const GUDANG_API_KEY = process.env.GUDANG_API_KEY || 'gudang_secret_key_v1';
      const petaniData = await prisma.petani.findUnique({ where: { id: updated.petaniId } });
      try {
        await fetch(`${GUDANG_URL}/api/webhook/penerimaan`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': GUDANG_API_KEY,
          },
          body: JSON.stringify({
            pickupId: id,
            pengajuanJualId: updated.pengajuanJualId,
            petaniId: updated.petaniId,
            petaniNama: updated.petaniNama,
            komoditasNama: updated.komoditasNama,
            beratTimbangKg: parseFloat(beratTimbangKg),
            gudangTujuanId: petaniData?.gudangTujuanId || null,
            timestamp: new Date().toISOString(),
          }),
        });
        console.log(`[Pickup→Gudang] Notified gudang: ${updated.komoditasNama} ${beratTimbangKg}kg from ${updated.petaniNama}`);
      } catch (webhookErr: any) {
        console.error(`[Pickup→Gudang] Failed to notify gudang:`, webhookErr.message);
        // Non-blocking: pickup is still completed even if gudang notification fails
      }
    }

    res.json(mapPickup(updated));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 8. QUALITY CONTROL
app.post('/api/qc', async (req, res) => {
  const { id, pickupId, petaniNama, komoditasNama, beratDiterimaKg, grade, catatanKerusakan, petugasQC, fotoQC } = req.body;
  try {
    const newQC = await prisma.qualityControl.create({
      data: {
        id,
        pickupId,
        petaniNama,
        komoditasNama,
        beratDiterimaKg: parseFloat(beratDiterimaKg),
        grade,
        catatanKerusakan,
        tanggalQC: new Date().toISOString().split('T')[0],
        petugasQC,
        fotoQC
      }
    });

    // Update JejakPanen and push to timeline
    const jp = await prisma.jejakPanen.findFirst({ where: { pickupId } });
    if (jp) {
      await prisma.jejakPanen.update({
        where: { id: jp.id },
        data: {
          statusSaatIni: 'qc_selesai',
          gradeAwal: grade,
          beratAwalKg: parseFloat(beratDiterimaKg)
        }
      });

      await prisma.jejakPanenTimeline.create({
        data: {
          jejakPanenId: jp.id,
          status: 'qc_selesai',
          tanggal: new Date().toISOString(),
          lokasi: 'Agro Jabar QC Center',
          keterangan: `Lolos QC Grade ${grade}. Catatan: ${catatanKerusakan || 'Kualitas baik'}`
        }
      });
    }

    res.json(newQC);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 9. PEMBAYARAN (Invoice and ledger bookkeeping)
app.post('/api/pembayaran', async (req, res) => {
  const { id, pickupId, petaniId, petaniNama, komoditasNama, beratKg, hargaPerKg, totalBayar, metodeBayar, buktiTransfer, dibuatOleh } = req.body;
  try {
    const updatedPay = await prisma.pembayaran.update({
      where: { id },
      data: {
        status: 'dibayar',
        tanggalBayar: new Date().toISOString().split('T')[0],
        buktiTransfer,
        dibuatOleh,
        metodeBayar,
      }
    });

    // Update parent PengajuanJual status to 'selesai' when payment is complete
    const pick = await prisma.pickup.findUnique({
      where: { id: updatedPay.pickupId }
    });
    if (pick) {
      await prisma.pengajuanJual.update({
        where: { id: pick.pengajuanJualId },
        data: { status: 'selesai' }
      });
    }

    // Add cashflow outgoing transaction to BukuKas
    const lastKas = await prisma.bukuKas.findFirst({ orderBy: { tanggal: 'desc' } });
    const saldoSebelumnya = lastKas ? lastKas.saldoAkhir : 500000000; // default initial budget seed
    const nominal = parseFloat(totalBayar);
    const saldoAkhir = saldoSebelumnya - nominal;

    await prisma.bukuKas.create({
      data: {
        id: `BK_${Date.now().toString().slice(-6)}`,
        tanggal: new Date().toISOString().split('T')[0],
        tipeTransaksi: 'Uang Keluar',
        kategori: 'Pembayaran Petani',
        nominal,
        saldoSebelumnya,
        saldoAkhir,
        keterangan: `Pembayaran panen ${komoditasNama} a.n ${petaniNama} (Inv: ${updatedPay.nomorInvoice})`,
        referensiId: id
      }
    });

    // Send notifications to farmer
    await prisma.notifikasi.create({
      data: {
        id: `NTF_${Date.now()}`,
        judul: 'Pembayaran Berhasil',
        pesan: `Pembayaran panen ${komoditasNama} sebesar Rp ${nominal.toLocaleString()} telah ditransfer. Invoice: ${updatedPay.nomorInvoice}.`,
        tanggal: new Date().toISOString().split('T')[0],
        dibaca: false,
        tipe: 'success'
      }
    });

    res.json(updatedPay);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 9.5. PURCHASE ORDERS (Surat Order Bahan Baku Tani)
app.post('/api/purchase-orders', async (req, res) => {
  const { id, nomorReq, penerimaKontrak, operatorLogistik, tanggalPengajuan, estimasiPengantaran, status, itemsJson } = req.body;
  try {
    const newPO = await prisma.purchaseOrder.create({
      data: {
        id,
        nomorReq,
        penerimaKontrak,
        operatorLogistik: operatorLogistik || 'admin (Admin Gudang)',
        tanggalPengajuan,
        estimasiPengantaran,
        status: status || 'PENDING',
        itemsJson,
      }
    });
    res.json(newPO);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/purchase-orders/:id', async (req, res) => {
  const { id } = req.params;
  const { status, estimasiPengantaran, penerimaKontrak, itemsJson } = req.body;
  try {
    const updated = await prisma.purchaseOrder.update({
      where: { id },
      data: {
        status,
        estimasiPengantaran,
        penerimaKontrak,
        itemsJson,
      }
    });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/purchase-orders/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.purchaseOrder.delete({ where: { id } });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 10. TENDERS
app.post('/api/tender', async (req, res) => {
  const { id, komoditasId, komoditasNama, kebutuhanKg, periodePanen, tanggalBerakhir, deskripsi, hargaPerKg } = req.body;
  try {
    const newTender = await prisma.tender.create({
      data: {
        id,
        komoditasId,
        komoditasNama,
        kebutuhanKg: parseFloat(kebutuhanKg),
        terpenuhinKg: 0,
        periodePanen,
        tanggalBerakhir,
        status: 'aktif',
        deskripsi,
        hargaPerKg: parseFloat(hargaPerKg)
      }
    });

    await prisma.notifikasi.create({
      data: {
        id: `NTF_${Date.now()}`,
        judul: 'Tender Baru Dibuka',
        pesan: `Tersedia tender ${komoditasNama} ${parseFloat(kebutuhanKg).toLocaleString()}kg untuk panen periode ${periodePanen}.`,
        tanggal: new Date().toISOString().split('T')[0],
        dibaca: false,
        tipe: 'warning'
      }
    });

    res.json(newTender);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/webhook/permintaan-pengadaan', async (req, res) => {
  const {
    permintaanPengadaanId,
    komoditasNama,
    kodeKomoditasGlobal,
    targetKg,
    hargaAcuanPerKg,
    deadlinePanen,
    catatan,
    periode
  } = req.body;

  try {
    let tender = await prisma.tender.findUnique({
      where: { id: permintaanPengadaanId }
    });

    if (tender) {
      tender = await prisma.tender.update({
        where: { id: permintaanPengadaanId },
        data: {
          kebutuhanKg: parseFloat(targetKg) || 0,
          hargaPerKg: parseFloat(hargaAcuanPerKg) || 0,
          tanggalBerakhir: deadlinePanen || '',
          deskripsi: catatan || '',
          periodePanen: periode || '',
        }
      });
    } else {
      tender = await prisma.tender.create({
        data: {
          id: permintaanPengadaanId,
          komoditasId: kodeKomoditasGlobal || 'UNKNOWN',
          komoditasNama: komoditasNama || '',
          kebutuhanKg: parseFloat(targetKg) || 0,
          terpenuhinKg: 0,
          hargaPerKg: parseFloat(hargaAcuanPerKg) || 0,
          tanggalBerakhir: deadlinePanen || '',
          deskripsi: catatan || '',
          periodePanen: periode || '',
          status: 'aktif'
        }
      });
    }

    res.json({ success: true, tender });
  } catch (error: any) {
    console.error('Error handling permintaan-pengadaan webhook:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tender-petani', async (req, res) => {
  const { id, tenderId, petaniId, petaniNama, kesanggupanKg } = req.body;
  try {
    const tp = await prisma.tenderPetani.create({
      data: {
        id,
        tenderId,
        petaniId,
        petaniNama,
        kesanggupanKg: parseFloat(kesanggupanKg),
        statusApproval: 'pending',
        tanggalDaftar: new Date().toISOString().split('T')[0]
      }
    });
    res.json(tp);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tender-petani/:id/verify', async (req, res) => {
  const { id } = req.params;
  const { status, catatanAdmin } = req.body;
  try {
    const updated = await prisma.tenderPetani.update({
      where: { id },
      data: {
        statusApproval: status,
        catatanAdmin
      }
    });

    const tenderPetani = await prisma.tenderPetani.findUnique({ where: { id } });
    if (tenderPetani && status === 'approved') {
      const tender = await prisma.tender.findUnique({ where: { id: tenderPetani.tenderId } });
      if (tender) {
        // Increment fulfilled weight
        const newFulfilled = tender.terpenuhinKg + tenderPetani.kesanggupanKg;
        const reachedTarget = newFulfilled >= tender.kebutuhanKg;
        await prisma.tender.update({
          where: { id: tender.id },
          data: {
            terpenuhinKg: newFulfilled,
            status: reachedTarget ? 'terpenuhi' : 'aktif'
          }
        });

        // Count approved responses for this tender
        const approvedResponsesCount = await prisma.tenderPetani.count({
          where: {
            tenderId: tender.id,
            statusApproval: 'approved'
          }
        });

        // Notify Gudang back (1-to-1 connection)
        const GUDANG_URL = process.env.GUDANG_URL || 'http://localhost:5005';
        const GUDANG_API_KEY = process.env.GUDANG_API_KEY || 'gudang_secret_key_v1';
        try {
          await fetch(`${GUDANG_URL}/api/permintaan-pengadaan/${tender.id}/komitmen`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': GUDANG_API_KEY
            },
            body: JSON.stringify({
              totalKomitmenKg: newFulfilled,
              jumlahKepalaPetaniRespon: approvedResponsesCount
            })
          });
          console.log(`[Webhook] Sent commitment update to Gudang for tender ${tender.id}: ${newFulfilled} kg`);
        } catch (webhookErr: any) {
          console.error(`[Webhook] Failed to notify Gudang:`, webhookErr.message);
        }
      }
    }

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 11. BUKU KAS (Budget entries)
app.post('/api/buku-kas', async (req, res) => {
  const { id, tipeTransaksi, kategori, nominal, keterangan } = req.body;
  try {
    const lastKas = await prisma.bukuKas.findFirst({ orderBy: { tanggal: 'desc' } });
    const saldoSebelumnya = lastKas ? lastKas.saldoAkhir : 500000000;
    const amount = parseFloat(nominal);
    const saldoAkhir = tipeTransaksi === 'Uang Masuk' ? (saldoSebelumnya + amount) : (saldoSebelumnya - amount);

    const newKas = await prisma.bukuKas.create({
      data: {
        id,
        tanggal: new Date().toISOString().split('T')[0],
        tipeTransaksi,
        kategori,
        nominal: amount,
        saldoSebelumnya,
        saldoAkhir,
        keterangan
      }
    });
    res.json(newKas);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 12. EDUKASI
app.post('/api/edukasi', async (req, res) => {
  const { id, judul, isi, gambar, kategori, penulis, tipe, urlVideo } = req.body;
  try {
    const newEdu = await prisma.artikelEdukasi.create({
      data: {
        id,
        judul,
        isi,
        gambar,
        kategori,
        tanggalPublish: new Date().toISOString().split('T')[0],
        penulis,
        tipe,
        urlVideo
      }
    });
    res.json(newEdu);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 13. BIBIT & PUPUK (Checkout purchase)
app.post('/api/bibit-pupuk/buy', async (req, res) => {
  const { items, totalHarga, petaniId } = req.body; // items: array of { id, quantity }
  try {
    for (const item of items) {
      const dbProduct = await prisma.produkBibitPupuk.findUnique({ where: { id: item.id } });
      if (dbProduct) {
        const newStock = Math.max(0, dbProduct.stok - item.quantity);
        await prisma.produkBibitPupuk.update({
          where: { id: item.id },
          data: { stok: newStock }
        });
      }
    }

    // Send buying success notification
    await prisma.notifikasi.create({
      data: {
        id: `NTF_${Date.now()}`,
        judul: 'Pembelian Berhasil',
        pesan: `Pembelian bibit/pupuk senilai Rp ${parseFloat(totalHarga).toLocaleString()} sukses. Silakan ambil barang di gudang tujuan.`,
        tanggal: new Date().toISOString().split('T')[0],
        dibaca: false,
        tipe: 'success'
      }
    });

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 14. NOTIFIKASI
app.post('/api/notifikasi/:id/read', async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await prisma.notifikasi.update({
      where: { id },
      data: { dibaca: true }
    });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 15. TRACKING PICKUP STATUS & JEJAK PANEN TIMELINE
app.post('/api/jejak-panen/:id/timeline', async (req, res) => {
  const { id } = req.params;
  const { status, lokasi, keterangan } = req.body;
  try {
    const jp = await prisma.jejakPanen.findUnique({ where: { id } });
    if (!jp) {
      return res.status(404).json({ error: 'Jejak panen tidak ditemukan' });
    }

    await prisma.jejakPanen.update({
      where: { id },
      data: { statusSaatIni: status }
    });

    const entry = await prisma.jejakPanenTimeline.create({
      data: {
        jejakPanenId: id,
        status,
        tanggal: new Date().toISOString(),
        lokasi,
        keterangan
      }
    });

    res.json(entry);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Start listening
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
