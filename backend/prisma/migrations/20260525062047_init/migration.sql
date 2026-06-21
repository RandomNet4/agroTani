-- CreateTable
CREATE TABLE "Petani" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "noHp" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "kecamatan" TEXT NOT NULL,
    "kabupaten" TEXT NOT NULL,
    "provinsi" TEXT NOT NULL,
    "fotoProfil" TEXT NOT NULL,
    "fotoKtp" TEXT NOT NULL,
    "statusVerifikasi" TEXT NOT NULL,
    "tanggalDaftar" TEXT NOT NULL,
    "tanggalVerifikasi" TEXT,
    "catatanVerifikasi" TEXT,
    "gudangTujuanId" TEXT,
    "gudangTujuanNama" TEXT,

    CONSTRAINT "Petani_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lahan" (
    "id" TEXT NOT NULL,
    "petaniId" TEXT NOT NULL,
    "namaLahan" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "alamat" TEXT NOT NULL,
    "luasHektar" DOUBLE PRECISION NOT NULL,
    "jenisLahan" TEXT NOT NULL,
    "kecamatan" TEXT NOT NULL,
    "kabupaten" TEXT NOT NULL,
    "statusVerifikasi" TEXT NOT NULL,
    "fotoLahan" TEXT NOT NULL,

    CONSTRAINT "Lahan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TanamanAktif" (
    "id" TEXT NOT NULL,
    "petaniId" TEXT NOT NULL,
    "lahanId" TEXT NOT NULL,
    "komoditasId" TEXT NOT NULL,
    "komoditasNama" TEXT NOT NULL,
    "tanggalTanam" TEXT NOT NULL,
    "estimasiPanen" TEXT NOT NULL,
    "estimasiHasilKg" DOUBLE PRECISION NOT NULL,
    "fotoTanaman" TEXT NOT NULL,
    "statusVerifikasi" TEXT NOT NULL,
    "catatanInspeksi" TEXT,
    "fotoInspeksi" TEXT,
    "latitudeInspeksi" DOUBLE PRECISION,
    "longitudeInspeksi" DOUBLE PRECISION,

    CONSTRAINT "TanamanAktif_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Komoditas" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "satuan" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "gambar" TEXT NOT NULL,
    "hargaSaatIni" DOUBLE PRECISION NOT NULL,
    "hargaSebelumnya" DOUBLE PRECISION NOT NULL,
    "lastUpdate" TEXT NOT NULL,
    "jumlahPetaniAktif" INTEGER NOT NULL,
    "totalEstimasiProduksiKg" DOUBLE PRECISION NOT NULL,
    "estimasiBulanPanen" TEXT NOT NULL,
    "kebutuhanBulananKg" DOUBLE PRECISION NOT NULL,
    "supplyStatus" TEXT NOT NULL,
    "umurPanenHari" INTEGER,

    CONSTRAINT "Komoditas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HargaKomoditas" (
    "id" TEXT NOT NULL,
    "komoditasId" TEXT NOT NULL,
    "komoditasNama" TEXT NOT NULL,
    "harga" DOUBLE PRECISION NOT NULL,
    "wilayah" TEXT NOT NULL,
    "tanggalBerlaku" TEXT NOT NULL,
    "tanggalBerakhir" TEXT,
    "dibuatOleh" TEXT NOT NULL,

    CONSTRAINT "HargaKomoditas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoriHarga" (
    "id" TEXT NOT NULL,
    "komoditasId" TEXT NOT NULL,
    "harga" DOUBLE PRECISION NOT NULL,
    "tanggal" TEXT NOT NULL,

    CONSTRAINT "HistoriHarga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PengajuanJual" (
    "id" TEXT NOT NULL,
    "petaniId" TEXT NOT NULL,
    "petaniNama" TEXT NOT NULL,
    "komoditasId" TEXT NOT NULL,
    "komoditasNama" TEXT NOT NULL,
    "beratEstimasiKg" DOUBLE PRECISION NOT NULL,
    "tanggalSiapPickup" TEXT NOT NULL,
    "fotoPanen" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "tanggalPengajuan" TEXT NOT NULL,
    "catatanAdmin" TEXT,
    "metodePembayaran" TEXT,
    "tanamanAktifId" TEXT,
    "lahanId" TEXT,
    "lahanNama" TEXT,
    "hargaAcuanKg" DOUBLE PRECISION,
    "estimasiPendapatan" DOUBLE PRECISION,
    "catatanPetani" TEXT,
    "gudangTujuanId" TEXT,
    "gudangTujuanNama" TEXT,

    CONSTRAINT "PengajuanJual_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pickup" (
    "id" TEXT NOT NULL,
    "pengajuanJualId" TEXT NOT NULL,
    "petaniId" TEXT NOT NULL,
    "petaniNama" TEXT NOT NULL,
    "komoditasNama" TEXT NOT NULL,
    "alamatPickup" TEXT NOT NULL,
    "tanggalPickup" TEXT NOT NULL,
    "driverNama" TEXT NOT NULL,
    "driverNoHp" TEXT NOT NULL,
    "armada" TEXT NOT NULL,
    "platNomor" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "beratTimbangKg" DOUBLE PRECISION,
    "fotoTimbang" TEXT,
    "fotoPanen" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "waktuBerangkat" TEXT,
    "waktuTiba" TEXT,
    "waktuSelesai" TEXT,

    CONSTRAINT "Pickup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pembayaran" (
    "id" TEXT NOT NULL,
    "pickupId" TEXT NOT NULL,
    "petaniId" TEXT NOT NULL,
    "petaniNama" TEXT NOT NULL,
    "komoditasNama" TEXT NOT NULL,
    "beratKg" DOUBLE PRECISION NOT NULL,
    "hargaPerKg" DOUBLE PRECISION NOT NULL,
    "totalBayar" DOUBLE PRECISION NOT NULL,
    "tanggalPickup" TEXT NOT NULL,
    "tanggalBayar" TEXT,
    "status" TEXT NOT NULL,
    "metodeBayar" TEXT NOT NULL,
    "nomorInvoice" TEXT NOT NULL,
    "buktiTransfer" TEXT,
    "dibuatOleh" TEXT,

    CONSTRAINT "Pembayaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tender" (
    "id" TEXT NOT NULL,
    "komoditasId" TEXT NOT NULL,
    "komoditasNama" TEXT NOT NULL,
    "kebutuhanKg" DOUBLE PRECISION NOT NULL,
    "terpenuhinKg" DOUBLE PRECISION NOT NULL,
    "periodePanen" TEXT NOT NULL,
    "tanggalBerakhir" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "hargaPerKg" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Tender_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenderPetani" (
    "id" TEXT NOT NULL,
    "tenderId" TEXT NOT NULL,
    "petaniId" TEXT NOT NULL,
    "petaniNama" TEXT NOT NULL,
    "kesanggupanKg" DOUBLE PRECISION NOT NULL,
    "statusApproval" TEXT NOT NULL,
    "tanggalDaftar" TEXT NOT NULL,
    "catatanAdmin" TEXT,

    CONSTRAINT "TenderPetani_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtikelEdukasi" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "isi" TEXT NOT NULL,
    "gambar" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "tanggalPublish" TEXT NOT NULL,
    "penulis" TEXT NOT NULL,
    "tipe" TEXT NOT NULL,
    "urlVideo" TEXT,

    CONSTRAINT "ArtikelEdukasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProdukBibitPupuk" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "tipe" TEXT NOT NULL,
    "harga" DOUBLE PRECISION NOT NULL,
    "stok" INTEGER NOT NULL,
    "satuan" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "gambar" TEXT NOT NULL,
    "subsidi" BOOLEAN NOT NULL,
    "diskonPersen" INTEGER,

    CONSTRAINT "ProdukBibitPupuk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QualityControl" (
    "id" TEXT NOT NULL,
    "pickupId" TEXT NOT NULL,
    "petaniNama" TEXT NOT NULL,
    "komoditasNama" TEXT NOT NULL,
    "beratDiterimaKg" DOUBLE PRECISION NOT NULL,
    "grade" TEXT NOT NULL,
    "catatanKerusakan" TEXT NOT NULL,
    "tanggalQC" TEXT NOT NULL,
    "petugasQC" TEXT NOT NULL,
    "fotoQC" TEXT,

    CONSTRAINT "QualityControl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notifikasi" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "pesan" TEXT NOT NULL,
    "tanggal" TEXT NOT NULL,
    "dibaca" BOOLEAN NOT NULL,
    "tipe" TEXT NOT NULL,

    CONSTRAINT "Notifikasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RekomendasiTanam" (
    "id" TEXT NOT NULL,
    "komoditasId" TEXT NOT NULL,
    "komoditasNama" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "alasan" TEXT NOT NULL,
    "prioritas" TEXT NOT NULL,
    "kebutuhanKg" DOUBLE PRECISION NOT NULL,
    "supplySekarangKg" DOUBLE PRECISION NOT NULL,
    "selisihKg" DOUBLE PRECISION NOT NULL,
    "estimasiHargaJual" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "RekomendasiTanam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JejakPanen" (
    "id" TEXT NOT NULL,
    "petaniId" TEXT NOT NULL,
    "pickupId" TEXT NOT NULL,
    "komoditasNama" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "beratAwalKg" DOUBLE PRECISION NOT NULL,
    "gradeAwal" TEXT NOT NULL,
    "statusSaatIni" TEXT NOT NULL,

    CONSTRAINT "JejakPanen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JejakPanenTimeline" (
    "id" TEXT NOT NULL,
    "jejakPanenId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "tanggal" TEXT NOT NULL,
    "lokasi" TEXT NOT NULL,
    "keterangan" TEXT,

    CONSTRAINT "JejakPanenTimeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BukuKas" (
    "id" TEXT NOT NULL,
    "tanggal" TEXT NOT NULL,
    "tipeTransaksi" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "nominal" DOUBLE PRECISION NOT NULL,
    "saldoSebelumnya" DOUBLE PRECISION NOT NULL,
    "saldoAkhir" DOUBLE PRECISION NOT NULL,
    "keterangan" TEXT NOT NULL,
    "referensiId" TEXT,

    CONSTRAINT "BukuKas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "JejakPanenTimeline" ADD CONSTRAINT "JejakPanenTimeline_jejakPanenId_fkey" FOREIGN KEY ("jejakPanenId") REFERENCES "JejakPanen"("id") ON DELETE CASCADE ON UPDATE CASCADE;
