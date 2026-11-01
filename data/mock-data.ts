// Realistic mock data for Kelurahan Lebakgede, Kecamatan Coblong, Kota Bandung

export const MOCK_RENCANA_PROGRAM = [
  {
    id: 'prog-01',
    namaProgram: 'Peningkatan Kualitas Sanitasi dan Saluran Drainase Lingkungan RW 03',
    bidang: 'Ekonomi dan Pembangunan',
    tanggalMulai: '2026-03-01',
    tanggalSelesai: '2026-05-30',
    lokasi: 'RW 03 Lebakgede',
    penanggungJawab: 'Bapak Kasi Ekbang',
    anggaran: 45000000,
    status: 'Diajukan',
    catatanLurah: '',
    role: 'ekbang',
  },
  {
    id: 'prog-02',
    namaProgram: 'Pelatihan Kewirausahaan dan Digitalisasi Produk UMKM Warga',
    bidang: 'Ekonomi dan Pembangunan',
    tanggalMulai: '2026-04-10',
    tanggalSelesai: '2026-04-25',
    lokasi: 'Aula Kelurahan Lebakgede',
    penanggungJawab: 'Bapak Kasi Ekbang',
    anggaran: 18500000,
    status: 'Disetujui',
    catatanLurah: 'Disetujui. Gandeng Disdagin Kota Bandung.',
    role: 'ekbang',
  },
  {
    id: 'prog-03',
    namaProgram: 'Pemberian Makanan Tambahan (PMT) Pemulihan Gizi Balita & Baduta',
    bidang: 'Kesejahteraan Sosial',
    tanggalMulai: '2026-02-01',
    tanggalSelesai: '2026-11-30',
    lokasi: 'Posyandu Melati RW 01 - RW 05',
    penanggungJawab: 'Ibu Kasi Kesos',
    anggaran: 32000000,
    status: 'Disetujui',
    catatanLurah: 'Disetujui. Prioritaskan baduta berisiko stunting.',
    role: 'kesos',
  },
  {
    id: 'prog-04',
    namaProgram: 'Pembinaan Administrasi dan Revitalisasi Dasawisma PKK',
    bidang: 'Kesejahteraan Sosial',
    tanggalMulai: '2026-05-05',
    tanggalSelesai: '2026-05-20',
    lokasi: 'Ruang Rapat Kelurahan',
    penanggungJawab: 'Ibu Kasi Kesos',
    anggaran: 12000000,
    status: 'Diajukan',
    catatanLurah: '',
    role: 'kesos',
  },
  {
    id: 'prog-05',
    namaProgram: 'Gerakan Jemput Bola Perekaman KTP-el dan Aktivasi IKD Pemula',
    bidang: 'Pemerintahan',
    tanggalMulai: '2026-03-15',
    tanggalSelesai: '2026-04-30',
    lokasi: 'Kantor Kelurahan & Balai RW 02',
    penanggungJawab: 'Bapak Kasi Pemerintahan',
    anggaran: 8500000,
    status: 'Disetujui',
    catatanLurah: 'Bagus. Koordinasikan dengan Disdukcapil Kota Bandung.',
    role: 'pemerintahan',
  },
  {
    id: 'prog-06',
    namaProgram: 'Sosialisasi Tata Tertib Lingkungan dan Pembinaan Anggota Linmas',
    bidang: 'Pemerintahan',
    tanggalMulai: '2026-06-01',
    tanggalSelesai: '2026-06-15',
    lokasi: 'Aula Kelurahan Lebakgede',
    penanggungJawab: 'Bapak Kasi Pemerintahan',
    anggaran: 9000000,
    status: 'Ditolak',
    catatanLurah: 'Anggaran konsumsi terlalu besar, mohon sesuaikan kembali.',
    role: 'pemerintahan',
  },
  {
    id: 'prog-07',
    namaProgram: 'Digitalisasi Arsip Persuratan dan Penataan Gudang Aset BMD',
    bidang: 'Sekretariat Kelurahan',
    tanggalMulai: '2026-02-15',
    tanggalSelesai: '2026-06-30',
    lokasi: 'Kantor Kelurahan Lebakgede',
    penanggungJawab: 'Ibu Sekretaris',
    anggaran: 22000000,
    status: 'Diajukan',
    catatanLurah: '',
    role: 'sekel',
  },
  {
    id: 'prog-08',
    namaProgram: 'Pemeliharaan Rutin Sarana Gedung Kantor dan Jaringan Internet',
    bidang: 'Sekretariat Kelurahan',
    tanggalMulai: '2026-01-10',
    tanggalSelesai: '2026-12-15',
    lokasi: 'Kantor Kelurahan Lebakgede',
    penanggungJawab: 'Ibu Sekretaris',
    anggaran: 28000000,
    status: 'Disetujui',
    catatanLurah: 'Disetujui sesuai pagu DPA kecamatan.',
    role: 'sekel',
  },
];

export const MOCK_RENCANA_GIAT = [
  {
    id: 'giat-01',
    namaKegiatan: 'Rapat Koordinasi Mingguan Staf dan Evaluasi Pelayanan Warga',
    bidang: 'Sekretariat Kelurahan',
    tanggal: '2026-10-19',
    lokasi: 'Ruang Kerja Lurah Lebakgede',
    penanggungJawab: 'Ibu Sekretaris',
    anggaran: 1500000,
    status: 'Disetujui',
    catatanLurah: 'Pastikan seluruh Kasi membawa bahan evaluasi mingguan.',
    role: 'sekel',
  },
  {
    id: 'giat-02',
    namaKegiatan: 'Inventarisasi Fisik Kendaraan Dinas dan Alat Elektronik Kantor',
    bidang: 'Sekretariat Kelurahan',
    tanggal: '2026-10-22',
    lokasi: 'Kantor Kelurahan',
    penanggungJawab: 'Ibu Sekretaris',
    anggaran: 800000,
    status: 'Diajukan',
    catatanLurah: '',
    role: 'sekel',
  },
  {
    id: 'giat-03',
    namaKegiatan: 'Verifikasi Berkas Permohonan Surat Keterangan Tanah RW 04',
    bidang: 'Pemerintahan',
    tanggal: '2026-10-20',
    lokasi: 'Wilayah RW 04 Lebakgede',
    penanggungJawab: 'Bapak Kasi Pemerintahan',
    anggaran: 600000,
    status: 'Disetujui',
    catatanLurah: 'Lakukan pengukuran dengan disaksikan batas tetangga.',
    role: 'pemerintahan',
  },
  {
    id: 'giat-04',
    namaKegiatan: 'Patroli Trantibum Bersama Anggota Linmas Wilayah Dipatiukur',
    bidang: 'Pemerintahan',
    tanggal: '2026-10-24',
    lokasi: 'Sepanjang Jl. Dipatiukur & Jl. Teuku Umar',
    penanggungJawab: 'Bapak Kasi Pemerintahan',
    anggaran: 1200000,
    status: 'Diajukan',
    catatanLurah: '',
    role: 'pemerintahan',
  },
  {
    id: 'giat-05',
    namaKegiatan: 'Pemeriksaan Rutin Pos Gizi dan Penimbangan Balita Posyandu Anggrek',
    bidang: 'Kesejahteraan Sosial',
    tanggal: '2026-10-21',
    lokasi: 'Posyandu Anggrek RW 03',
    penanggungJawab: 'Ibu Kasi Kesos',
    anggaran: 950000,
    status: 'Diajukan',
    catatanLurah: '',
    role: 'kesos',
  },
  {
    id: 'giat-06',
    namaKegiatan: 'Penyaluran Paket Nutrisi Ibu Hamil dan Pemeriksaan USG Bidan',
    bidang: 'Kesejahteraan Sosial',
    tanggal: '2026-10-27',
    lokasi: 'Puskesmas Pembantu Lebakgede',
    penanggungJawab: 'Ibu Kasi Kesos',
    anggaran: 2500000,
    status: 'Disetujui',
    catatanLurah: 'Sertakan edukasi tablet tambah darah.',
    role: 'kesos',
  },
  {
    id: 'giat-07',
    namaKegiatan: 'Monitoring Lapangan Pekerjaan Paving Block Gang Hegarmanah',
    bidang: 'Ekonomi dan Pembangunan',
    tanggal: '2026-10-23',
    lokasi: 'Gg. Hegarmanah RW 01',
    penanggungJawab: 'Bapak Kasi Ekbang',
    anggaran: 750000,
    status: 'Diajukan',
    catatanLurah: '',
    role: 'ekbang',
  },
  {
    id: 'giat-08',
    namaKegiatan: 'Pembinaan Petugas Pengolah Rumah Magot Sampah Organik',
    bidang: 'Ekonomi dan Pembangunan',
    tanggal: '2026-10-28',
    lokasi: 'Rumah Magot RW 05',
    penanggungJawab: 'Bapak Kasi Ekbang',
    anggaran: 1000000,
    status: 'Disetujui',
    catatanLurah: 'Fasilitasi ember pemilah sampah untuk rumah tangga.',
    role: 'ekbang',
  },
];

export const MOCK_SURAT_MASUK = [
  {
    id: 'sm-01',
    nomorAgenda: 'AG/2026/001',
    nomorSurat: '005/142-Kec.Cob/X/2026',
    tanggalSurat: '2026-10-14',
    asalSurat: 'Kecamatan Coblong Kota Bandung',
    perihal: 'Undangan Rapat Koordinasi Kewilayahan Triwulan IV',
    sifat: 'Penting',
    lampiran: '1 Berkas',
    statusDisposisi: 'Didisposisikan ke Sie Pemerintahan',
    disposisiKe: 'pemerintahan',
    instruksiLurah: 'Hadiri rapat mewakili kelurahan dan siapkan laporan kamtibmas.',
  },
  {
    id: 'sm-02',
    nomorAgenda: 'AG/2026/002',
    nomorSurat: '440/098/Dinkes-Pusk/2026',
    tanggalSurat: '2026-10-15',
    asalSurat: 'UPTD Puskesmas Coblong',
    perihal: 'Jadwal Imunisasi Sub PIN Polio dan Penimbangan Serentak',
    sifat: 'Segera',
    lampiran: '2 Lembar',
    statusDisposisi: 'Didisposisikan ke Sie Kesos',
    disposisiKe: 'kesos',
    instruksiLurah: 'Koordinasikan kader posyandu RW 01 s/d RW 05 untuk percepatan cakupan.',
  },
  {
    id: 'sm-03',
    nomorAgenda: 'AG/2026/003',
    nomorSurat: '600/312/Disperkim/2026',
    tanggalSurat: '2026-10-15',
    asalSurat: 'Dinas Perumahan dan Kawasan Permukiman Kota Bandung',
    perihal: 'Verifikasi Usulan Calon Penerima Bantuan Rutilahu 2026',
    sifat: 'Penting',
    lampiran: 'Daftar Nominatif',
    statusDisposisi: 'Didisposisikan ke Sie Ekbang',
    disposisiKe: 'ekbang',
    instruksiLurah: 'Lakukan verifikasi faktual lapangan bersama pengurus RW 04.',
  },
  {
    id: 'sm-04',
    nomorAgenda: 'AG/2026/004',
    nomorSurat: '470/201/Disdukcapil/2026',
    tanggalSurat: '2026-10-16',
    asalSurat: 'Disdukcapil Kota Bandung',
    perihal: 'Laporan Rekapitulasi Data Penduduk Non-Permanen',
    sifat: 'Biasa',
    lampiran: '-',
    statusDisposisi: 'Didisposisikan ke Sekretariat Kelurahan',
    disposisiKe: 'sekel',
    instruksiLurah: 'Rekapitulasi data penduduk non-permanen untuk bahan laporan bulanan.',
  },
  {
    id: 'sm-05',
    nomorAgenda: 'AG/2026/005',
    nomorSurat: '500/188/Disdagin/2026',
    tanggalSurat: '2026-10-16',
    asalSurat: 'Dinas Perdagangan dan Perindustrian Kota Bandung',
    perihal: 'Sosialisasi Bantuan Alat Produksi bagi Pelaku Usaha Mikro',
    sifat: 'Biasa',
    lampiran: 'Petunjuk Teknis',
    statusDisposisi: 'Menunggu Disposisi',
    disposisiKe: '',
    instruksiLurah: '',
  },
];

export const MOCK_SURAT_KELUAR = [
  {
    id: 'sk-01',
    nomorSurat: '140/045-Kel.LG/X/2026',
    tanggalSurat: '2026-10-15',
    tujuanSurat: 'Camat Coblong Kota Bandung',
    perihal: 'Laporan Situasi Ketentraman dan Ketertiban Wilayah Bulan Oktober',
    sifat: 'Biasa',
    lampiran: '1 Bundel',
    status: 'Terkirim',
  },
  {
    id: 'sk-02',
    nomorSurat: '005/046-Kel.LG/X/2026',
    tanggalSurat: '2026-10-16',
    tujuanSurat: 'Ketua RW 01 - RW 05 Kelurahan Lebakgede',
    perihal: 'Undangan Pertemuan Rutin dan Sosialisasi Pengelolaan Sampah',
    sifat: 'Penting',
    lampiran: '-',
    status: 'Terkirim',
  },
  {
    id: 'sk-03',
    nomorSurat: '460/047-Kel.LG/X/2026',
    tanggalSurat: '2026-10-16',
    tujuanSurat: 'Kepala Dinas Sosial Kota Bandung',
    perihal: 'Rekomendasi Bantuan Alat Bantu Kesejahteraan Lansia RW 04',
    sifat: 'Penting',
    lampiran: 'Surat Keterangan',
    status: 'Draft',
  },
];

export const MOCK_KERUMAHTANGGAAN = [
  { id: 'krt-01', kodeBarang: 'KRT-001', namaBarang: 'Pendingin Ruangan (AC) Ruang Pelayanan', tahunPerolehan: '2023', kondisi: 'Baik', lokasi: 'Loket Pelayanan Terpadu', nilai: 4500000 },
  { id: 'krt-02', kodeBarang: 'KRT-002', namaBarang: 'Genset Cadangan Listrik 5000 Watt', tahunPerolehan: '2021', kondisi: 'Baik', lokasi: 'Ruang Mesin Belakang', nilai: 12500000 },
  { id: 'krt-03', kodeBarang: 'KRT-003', namaBarang: 'Dispenser Air Minum Otomatis', tahunPerolehan: '2024', kondisi: 'Baik', lokasi: 'Ruang Sekretariat', nilai: 1800000 },
  { id: 'krt-04', kodeBarang: 'KRT-004', namaBarang: 'Proyektor Ruang Rapat Kelurahan', tahunPerolehan: '2022', kondisi: 'Rusak Ringan', lokasi: 'Aula Kelurahan', nilai: 6500000 },
];

export const MOCK_KEPEGAWAIAN = [
  { id: 'peg-01', nip: '19740512 199803 1 004', nama: 'Bapak Lurah', pangkatGolongan: 'Pembina (IV/a)', jabatan: 'Lurah Lebakgede', statusKepegawaian: 'PNS', tanggalMasuk: '2019-04-01' },
  { id: 'peg-02', nip: '19790820 200501 2 008', nama: 'Ibu Sekretaris', pangkatGolongan: 'Penata Tk. I (III/d)', jabatan: 'Sekretaris Kelurahan', statusKepegawaian: 'PNS', tanggalMasuk: '2020-07-15' },
  { id: 'peg-03', nip: '19810315 200701 1 012', nama: 'Bapak Kasi Pemerintahan', pangkatGolongan: 'Penata (III/c)', jabatan: 'Kasi Pemerintahan', statusKepegawaian: 'PNS', tanggalMasuk: '2021-02-01' },
  { id: 'peg-04', nip: '19831110 200902 1 007', nama: 'Bapak Kasi Ekbang', pangkatGolongan: 'Penata (III/c)', jabatan: 'Kasi Ekonomi & Pembangunan', statusKepegawaian: 'PNS', tanggalMasuk: '2021-09-01' },
  { id: 'peg-05', nip: '19850614 201001 2 015', nama: 'Ibu Kasi Kesos', pangkatGolongan: 'Penata (III/c)', jabatan: 'Kasi Kesejahteraan Sosial', statusKepegawaian: 'PNS', tanggalMasuk: '2022-01-10' },
  { id: 'peg-06', nip: '19920405 202203 1 002', nama: 'Ahmad Maulana, S.AP', pangkatGolongan: 'Penata Muda (III/a)', jabatan: 'Pengelola Data Pelayanan', statusKepegawaian: 'PNS', tanggalMasuk: '2022-03-01' },
  { id: 'peg-07', nip: '19951210 202321 2 009', nama: 'Dewi Lestari, A.Md', pangkatGolongan: 'Pengatur (II/c)', jabatan: 'Pranata Kearsipan', statusKepegawaian: 'PPPK', tanggalMasuk: '2023-06-01' },
  { id: 'peg-08', nip: '-', nama: 'Rudi Suhendar', pangkatGolongan: '-', jabatan: 'Petugas Kebersihan Kantor', statusKepegawaian: 'Non-ASN / PHL', tanggalMasuk: '2020-01-02' },
];

export const MOCK_BMD = [
  { id: 'bmd-01', kodeBarang: 'BMD-01.01.001', namaBarang: 'Sepeda Motor Dinas Honda Beat (D 2145 BDG)', tahunPerolehan: '2022', kondisi: 'Baik', lokasi: 'Garasi Kelurahan', nilai: 17500000 },
  { id: 'bmd-02', kodeBarang: 'BMD-01.01.002', namaBarang: 'Mobil Operasional Kelurahan Avanza (D 1102 BDG)', tahunPerolehan: '2020', kondisi: 'Baik', lokasi: 'Garasi Kelurahan', nilai: 195000000 },
  { id: 'bmd-03', kodeBarang: 'BMD-02.05.008', namaBarang: 'Komputer All-in-One Server Database Loket', tahunPerolehan: '2023', kondisi: 'Baik', lokasi: 'Ruang Server', nilai: 16500000 },
  { id: 'bmd-04', kodeBarang: 'BMD-02.05.014', namaBarang: 'Printer Mesin Cetak KTP & KK Laser', tahunPerolehan: '2021', kondisi: 'Rusak Ringan', lokasi: 'Loket Pelayanan', nilai: 8500000 },
  { id: 'bmd-05', kodeBarang: 'BMD-03.01.004', namaBarang: 'Meja Rapat Kayu Jati Formasi U', tahunPerolehan: '2019', kondisi: 'Baik', lokasi: 'Aula Kelurahan', nilai: 14000000 },
];

export const MOCK_KEPENDUDUKAN = [
  { id: 'duk-01', nik: '3273011405820003', nama: 'Cecep Mulyana', rt: 'RT 02', rw: 'RW 01', jenisLayanan: 'Perekaman KTP-el', tanggalPengajuan: '2026-10-12', status: 'Selesai' },
  { id: 'duk-02', nik: '3273015509900001', nama: 'Siti Rahmawati', rt: 'RT 04', rw: 'RW 02', jenisLayanan: 'Pembaruan Kartu Keluarga', tanggalPengajuan: '2026-10-14', status: 'Selesai' },
  { id: 'duk-03', nik: '3273012203020004', nama: 'Rian Hidayat', rt: 'RT 01', rw: 'RW 03', jenisLayanan: 'Perekaman KTP-el Pemula', tanggalPengajuan: '2026-10-15', status: 'Menunggu' },
  { id: 'duk-04', nik: '3273016812850002', nama: 'Enok Maryani', rt: 'RT 03', rw: 'RW 04', jenisLayanan: 'Surat Pindah Keluar', tanggalPengajuan: '2026-10-16', status: 'Menunggu' },
  { id: 'duk-05', nik: '3273011008770005', nama: 'Dedi Kusnadi', rt: 'RT 05', rw: 'RW 05', jenisLayanan: 'Surat Keterangan Domisili', tanggalPengajuan: '2026-10-16', status: 'Selesai' },
];

export const MOCK_CATATAN_SIPIL = [
  { id: 'cs-01', nik: '3273014101250002', nama: 'Arkan Alfatih (Bayi)', namaPelapor: 'Budi Santoso', rt: 'RT 03', rw: 'RW 01', jenisLayanan: 'Akta Kelahiran', tanggalLapor: '2026-10-10', status: 'Selesai' },
  { id: 'cs-02', nik: '3273010503450001', nama: 'Alm. Bapak Suhana', namaPelapor: 'Yani Suhartini', rt: 'RT 02', rw: 'RW 02', jenisLayanan: 'Akta Kematian', tanggalLapor: '2026-10-11', status: 'Selesai' },
  { id: 'cs-03', nik: '3273016208250003', nama: 'Khanza Az-Zahra (Bayi)', namaPelapor: 'Rizki Pratama', rt: 'RT 01', rw: 'RW 04', jenisLayanan: 'Akta Kelahiran', tanggalLapor: '2026-10-15', status: 'Menunggu' },
];

export const MOCK_PERTANAHAN = [
  { id: 'tan-01', nomorRegistrasi: 'REG-TN/2026/012', namaPemohon: 'H. Tatang Rustandi', luasTanah: '240 m²', rt: 'RT 02', rw: 'RW 03', peruntukan: 'Surat Keterangan Riwayat Tanah', tanggal: '2026-10-08', status: 'Selesai' },
  { id: 'tan-02', nomorRegistrasi: 'REG-TN/2026/013', namaPemohon: 'Iis Aisyah', luasTanah: '115 m²', rt: 'RT 04', rw: 'RW 01', peruntukan: 'Keterangan Tidak Sengketa', tanggal: '2026-10-14', status: 'Menunggu' },
  { id: 'tan-03', nomorRegistrasi: 'REG-TN/2026/014', namaPemohon: 'Wawan Gunawan', luasTanah: '180 m²', rt: 'RT 01', rw: 'RW 05', peruntukan: 'Pengantar Permohonan Sertifikat PTSL', tanggal: '2026-10-16', status: 'Menunggu' },
];

export const MOCK_TRANTIBUM = [
  { id: 'tra-01', nomorLaporan: 'LAP-TR/2026/021', namaPelapor: 'Ketua RW 02', lokasiKejadian: 'Jalan Teuku Umar No. 12', jenisKejadian: 'Penertiban Pedagang Kaki Lima Menutupi Trotoar', tanggal: '2026-10-13', status: 'Selesai' },
  { id: 'tra-02', nomorLaporan: 'LAP-TR/2026/022', namaPelapor: 'Warga RW 04', lokasiKejadian: 'Gang Hegarmanah RT 03', jenisKejadian: 'Pohon Rindang Rawan Tumbang Menimpa Kabel PLN', tanggal: '2026-10-15', status: 'Selesai' },
  { id: 'tra-03', nomorLaporan: 'LAP-TR/2026/023', namaPelapor: 'Linmas RW 01', lokasiKejadian: 'Depan Balai Warga RW 01', jenisKejadian: 'Mediasi Perselisihan Parkir Antar Warga', tanggal: '2026-10-16', status: 'Selesai' },
];

export const MOCK_PENGURUS_RW = [
  { id: 'rw-01', nama: 'Drs. H. Maman Suratman', jabatan: 'Ketua RW', rw: 'RW 01', kontak: '081223344551', periode: '2024 - 2029', status: 'Aktif' },
  { id: 'rw-02', nama: 'Ir. Agus Priyanto', jabatan: 'Ketua RW', rw: 'RW 02', kontak: '081223344552', periode: '2024 - 2029', status: 'Aktif' },
  { id: 'rw-03', nama: 'Bapak H. Dadan Ramdani', jabatan: 'Ketua RW', rw: 'RW 03', kontak: '081223344553', periode: '2023 - 2028', status: 'Aktif' },
  { id: 'rw-04', nama: 'Drs. Bambang Sudrajat', jabatan: 'Ketua RW', rw: 'RW 04', kontak: '081223344554', periode: '2023 - 2028', status: 'Aktif' },
  { id: 'rw-05', nama: 'Hj. Nenden Hendrawati', jabatan: 'Ketua RW', rw: 'RW 05', kontak: '081223344555', periode: '2024 - 2029', status: 'Aktif' },
];

export const MOCK_PENGURUS_RT = [
  { id: 'rt-01', nama: 'Yusuf Mansur', jabatan: 'Ketua RT 01', rw: 'RW 01', kontak: '081399887711', periode: '2024 - 2029', status: 'Aktif' },
  { id: 'rt-02', nama: 'Suryana', jabatan: 'Ketua RT 02', rw: 'RW 01', kontak: '081399887712', periode: '2024 - 2029', status: 'Aktif' },
  { id: 'rt-03', nama: 'Ahmad Fauzi', jabatan: 'Ketua RT 01', rw: 'RW 02', kontak: '081399887713', periode: '2024 - 2029', status: 'Aktif' },
  { id: 'rt-04', nama: 'Hendar Supriadi', jabatan: 'Ketua RT 02', rw: 'RW 02', kontak: '081399887714', periode: '2024 - 2029', status: 'Aktif' },
  { id: 'rt-05', nama: 'Tedi Setiadi', jabatan: 'Ketua RT 01', rw: 'RW 03', kontak: '081399887715', periode: '2023 - 2028', status: 'Aktif' },
  { id: 'rt-06', nama: 'Kuswandi', jabatan: 'Ketua RT 02', rw: 'RW 03', kontak: '081399887716', periode: '2023 - 2028', status: 'Aktif' },
  { id: 'rt-07', nama: 'Iman Suherman', jabatan: 'Ketua RT 01', rw: 'RW 04', kontak: '081399887717', periode: '2023 - 2028', status: 'Aktif' },
  { id: 'rt-08', nama: 'Oki Sanjaya', jabatan: 'Ketua RT 01', rw: 'RW 05', kontak: '081399887718', periode: '2024 - 2029', status: 'Aktif' },
];

export const MOCK_MUSRENBANG = [
  { id: 'mus-01', kodeUsulan: 'USL-2026-001', usulan: 'Pembangunan Saluran Drainase Beton dan Gorong-gorong RW 03', rw: 'RW 03', anggaranUsulan: 65000000, prioritas: 'Prioritas 1', status: 'Disetujui' },
  { id: 'mus-02', kodeUsulan: 'USL-2026-002', usulan: 'Pengadaan Lampu Penerangan Jalan Lingkungan (PJL) 15 Titik RW 01 & 02', rw: 'RW 01', anggaranUsulan: 30000000, prioritas: 'Prioritas 1', status: 'Disetujui' },
  { id: 'mus-03', kodeUsulan: 'USL-2026-003', usulan: 'Pembangunan Posyandu Terpadu dan Ruang Baca Anak RW 04', rw: 'RW 04', anggaranUsulan: 85000000, prioritas: 'Prioritas 2', status: 'Diajukan' },
  { id: 'mus-04', kodeUsulan: 'USL-2026-004', usulan: 'Pelatihan Olahan Pangan dan Bantuan Sertifikasi Halal UMKM', rw: 'RW 05', anggaranUsulan: 25000000, prioritas: 'Prioritas 2', status: 'Diajukan' },
];

export const MOCK_FASILITAS_SARPRAS = [
  { id: 'srp-01', namaFasilitas: 'Balai Warga Serbaguna RW 02', jenis: 'Fasilitas Umum (Fasum)', lokasi: 'Jl. Lebakgede Tengah No. 15', kondisi: 'Baik', kapasitas: '100 Orang', status: 'Aktif' },
  { id: 'srp-02', namaFasilitas: 'Taman Bermain Ramah Anak RW 03', jenis: 'Ruang Terbuka Hijau / Fasum', lokasi: 'Komplek Dipatiukur Asri', kondisi: 'Baik', kapasitas: '50 Orang', status: 'Aktif' },
  { id: 'srp-03', namaFasilitas: 'Posyandu Teratai RW 05', jenis: 'Fasilitas Sosial (Fasos)', lokasi: 'Samping Masjid Al-Muhajirin', kondisi: 'Perlu Renovasi', kapasitas: '40 Orang', status: 'Aktif' },
];

export const MOCK_INFRASTRUKTUR = [
  { id: 'inf-01', namaPekerjaan: 'Pengaspalan & Paving Block Jalan Gang Hegarmanah RW 01', volume: '320 Meter', anggaran: 42000000, pelaksana: 'Swakelola Pokmas Hegar', progres: '100%', status: 'Selesai' },
  { id: 'inf-02', namaPekerjaan: 'Normalisasi dan Pengerukan Sedimen Saluran RW 03', volume: '180 Meter', anggaran: 28000000, pelaksana: 'Dinas DSDABM / Petugas Kebersihan', progres: '75%', status: 'Proses' },
  { id: 'inf-03', namaPekerjaan: 'Rehabilitasi Rumah Tidak Layak Huni (Rutilahu) 3 Unit RW 04', volume: '3 Rumah', anggaran: 60000000, pelaksana: 'BKM Lebakgede Mandiri', progres: '40%', status: 'Proses' },
];

export const MOCK_UMKM = [
  { id: 'umk-01', namaUsaha: 'Kue Basah & Pastry Ibu Nining', pemilik: 'Dra. Nining Nurhayati', jenisUsaha: 'Kuliner Tradisional', alamat: 'Jl. Dipatiukur No. 44 RT 02/02', omzetBulanan: 18000000, statusNIB: 'Ada (NIB Terdaftar)', status: 'Aktif' },
  { id: 'umk-02', namaUsaha: 'Kerajinan Kulit & Souvenir Bandung Craft', pemilik: 'Asep Ridwan', jenisUsaha: 'Kerajinan Tangan', alamat: 'Gg. Lebak Asri RT 03/01', omzetBulanan: 25000000, statusNIB: 'Ada (NIB Terdaftar)', status: 'Aktif' },
  { id: 'umk-03', namaUsaha: 'Kopi Seduh Pojok Lebak', pemilik: 'Reza Pratama', jenisUsaha: 'Kafe / Minuman', alamat: 'Jl. Teuku Umar No. 8 RT 01/03', omzetBulanan: 22000000, statusNIB: 'Ada (NIB Terdaftar)', status: 'Aktif' },
  { id: 'umk-04', namaUsaha: 'Warung Sembako Berkah Mandiri', pemilik: 'H. Dedi', jenisUsaha: 'Perdagangan Eceran', alamat: 'RT 04/05', omzetBulanan: 35000000, statusNIB: 'Ada (NIB Terdaftar)', status: 'Aktif' },
];

export const MOCK_PEMBERDAYAAN = [
  { id: 'pemb-01', namaProgram: 'Kelompok Tani Perkotaan (Buruan SAE) RW 04', sasaran: 'Kader PKK & Pemuda RW 04', lokasi: 'Lahan Tidur RW 04', komoditas: 'Sayuran Hidroponik & Lele', status: 'Aktif' },
  { id: 'pemb-02', namaProgram: 'Bank Sampah Mandiri Bersih Lebakgede', sasaran: 'Ibu-ibu Rumah Tangga se-Kelurahan', lokasi: 'Balai RW 01', komoditas: 'Kertas, Plastik, & Minyak Jelantah', status: 'Aktif' },
  { id: 'pemb-03', namaProgram: 'Pelatihan Sablon Digital Karang Taruna', sasaran: 'Remaja Usia Produktif', lokasi: 'Aula Kelurahan', komoditas: 'Kaos & Tote Bag Merchandise', status: 'Aktif' },
];

export const MOCK_PETUGAS_KEBERSIHAN = [
  { id: 'keb-01', namaPetugas: 'Dasep Suhendar', wilayahTugas: 'RW 01 & RW 02', tugasUtama: 'Penyapuan Jalan Utama & Angkut Sampah Roda', kontak: '085721110011', status: 'Aktif' },
  { id: 'keb-02', namaPetugas: 'Ujang Koswara', wilayahTugas: 'RW 03', tugasUtama: 'Pembersihan Gorong-gorong & Saluran Air', kontak: '085721110012', status: 'Aktif' },
  { id: 'keb-03', namaPetugas: 'Rahmat Hidayat', wilayahTugas: 'RW 04 & RW 05', tugasUtama: 'Operasional Motor Sampah Roda Tiga', kontak: '085721110013', status: 'Aktif' },
];

export const MOCK_PETUGAS_MAGOT = [
  { id: 'mag-01', namaPetugas: 'Ahmad Suparman', lokasiRumahMagot: 'Rumah Magot Terpadu RW 05', kapasitasOlahan: '150 kg Sampah Organik/Hari', kontak: '081900223344', status: 'Aktif' },
  { id: 'mag-02', namaPetugas: 'Endang Kurnia', lokasiRumahMagot: 'Rumah Magot Mini RW 02', kapasitasOlahan: '80 kg Sampah Organik/Hari', kontak: '081900223345', status: 'Aktif' },
];

export const MOCK_POTENSI_KESOS = [
  { id: 'pot-01', namaPotensi: 'Yayasan Peduli Anak Yatim & Dhuafa Al-Hikmah', jenisPSKS: 'Lembaga Kesejahteraan Sosial (LKS)', alamat: 'Jl. Lebakgede No. 19 RT 03/02', kontak: '022-2508899', status: 'Aktif' },
  { id: 'pot-02', namaPotensi: 'Kelompok Swadaya Masyarakat Peduli Lansia Kasih Ibu', jenisPSKS: 'Kelompok Masyarakat', alamat: 'RW 04 Lebakgede', kontak: '081233445566', status: 'Aktif' },
  { id: 'pot-03', namaPotensi: 'Tenaga Kesejahteraan Sosial Kecamatan (TKSK) Coblong', jenisPSKS: 'Relawan Sosial', alamat: 'Kecamatan Coblong', kontak: '085811223344', status: 'Aktif' },
];

export const MOCK_PEMBINAAN_LEMBAGA = [
  { id: 'pem-lem-01', namaLembaga: 'Pengurus Posyandu se-Kelurahan Lebakgede', jenisPembinaan: 'Pelatihan Pengukuran Antropometri Terstandar', tanggalPelaksanaan: '2026-09-15', narasumber: 'Nutrisionis Puskesmas Coblong', peserta: '35 Orang', status: 'Selesai' },
  { id: 'pem-lem-02', namaLembaga: 'Karang Taruna Tunas Harapan Lebakgede', jenisPembinaan: 'Workshop Manajemen Organisasi Kepemudaan', tanggalPelaksanaan: '2026-09-28', narasumber: 'Dispora Kota Bandung', peserta: '25 Orang', status: 'Selesai' },
];

export const MOCK_PENGURUS_POSYANDU = [
  { id: 'pos-01', namaKader: 'Hj. Siti Rohayah', namaPosyandu: 'Posyandu Melati', rw: 'RW 01', jabatan: 'Ketua Posyandu', kontak: '081322114401', status: 'Aktif' },
  { id: 'pos-02', namaKader: 'Ibu Ratna Juwita', namaPosyandu: 'Posyandu Mawar', rw: 'RW 02', jabatan: 'Ketua Posyandu', kontak: '081322114402', status: 'Aktif' },
  { id: 'pos-03', namaKader: 'Ibu Eni Rohaeni', namaPosyandu: 'Posyandu Anggrek', rw: 'RW 03', jabatan: 'Ketua Posyandu', kontak: '081322114403', status: 'Aktif' },
  { id: 'pos-04', namaKader: 'Ibu Ai Sumarni', namaPosyandu: 'Posyandu Teratai', rw: 'RW 04', jabatan: 'Ketua Posyandu', kontak: '081322114404', status: 'Aktif' },
  { id: 'pos-05', namaKader: 'Ibu Kokom Komariah', namaPosyandu: 'Posyandu Dahlia', rw: 'RW 05', jabatan: 'Ketua Posyandu', kontak: '081322114405', status: 'Aktif' },
];

export const MOCK_PENGURUS_KARTA = [
  { id: 'kta-01', nama: 'Fajar Nugraha, S.Kom', jabatan: 'Ketua Karang Taruna', kontak: '081299881122', periode: '2024 - 2029', rw: 'RW 02', status: 'Aktif' },
  { id: 'kta-02', nama: 'Rian Kurniawan', jabatan: 'Wakil Ketua', kontak: '081299881123', periode: '2024 - 2029', rw: 'RW 03', status: 'Aktif' },
  { id: 'kta-03', nama: 'Annisa Fitriani', jabatan: 'Sekretaris', kontak: '081299881124', periode: '2024 - 2029', rw: 'RW 01', status: 'Aktif' },
  { id: 'kta-04', nama: 'Bima Sakti', jabatan: 'Bendahara', kontak: '081299881125', periode: '2024 - 2029', rw: 'RW 04', status: 'Aktif' },
];

export const MOCK_PENGURUS_PKK = [
  { id: 'pkk-01', nama: 'Hj. Neneng Hasanah', jabatan: 'Ketua TP PKK RW 01', kontak: '081344556601', periode: '2024 - 2029', rw: 'RW 01', status: 'Aktif' },
  { id: 'pkk-02', nama: 'Ibu Hj. Elis Maryani', jabatan: 'Ketua TP PKK RW 02', kontak: '081344556602', periode: '2024 - 2029', rw: 'RW 02', status: 'Aktif' },
  { id: 'pkk-03', nama: 'Ibu Titin Fatimah', jabatan: 'Ketua TP PKK RW 03', kontak: '081344556603', periode: '2023 - 2028', rw: 'RW 03', status: 'Aktif' },
  { id: 'pkk-04', nama: 'Ibu Yayah Rokayah', jabatan: 'Ketua TP PKK RW 04', kontak: '081344556604', periode: '2023 - 2028', rw: 'RW 04', status: 'Aktif' },
  { id: 'pkk-05', nama: 'Ibu Cucu Hayati', jabatan: 'Ketua TP PKK RW 05', kontak: '081344556605', periode: '2024 - 2029', rw: 'RW 05', status: 'Aktif' },
];

export const MOCK_PENGURUS_LPM = [
  { id: 'lpm-01', nama: 'Drs. H. Dadang Sudrajat, M.Si', jabatan: 'Ketua LPM', kontak: '08112233001', periode: '2023 - 2028', status: 'Aktif' },
  { id: 'lpm-02', nama: 'H. Ujang Suryana', jabatan: 'Sekretaris LPM', kontak: '08112233002', periode: '2023 - 2028', status: 'Aktif' },
  { id: 'lpm-03', nama: 'Hj. Rina Marlina', jabatan: 'Bendahara LPM', kontak: '08112233003', periode: '2023 - 2028', status: 'Aktif' },
];

export const MOCK_BALITA = [
  { id: 'bal-01', nama: 'Muhammad Rayyan', nik: '3273010403230001', tanggalLahir: '2023-03-04', rt: 'RT 02', rw: 'RW 01', posyandu: 'Posyandu Melati', berat: 12.8, tinggi: 92, statusGizi: 'Sesuai (Normal)' },
  { id: 'bal-02', nama: 'Aisyah Putri Azzahra', nik: '3273015507230002', tanggalLahir: '2023-07-15', rt: 'RT 04', rw: 'RW 02', posyandu: 'Posyandu Mawar', berat: 11.2, tinggi: 88, statusGizi: 'Sesuai (Normal)' },
  { id: 'bal-03', nama: 'Kenzo Alfarizi', nik: '3273011210220003', tanggalLahir: '2022-10-12', rt: 'RT 01', rw: 'RW 03', posyandu: 'Posyandu Anggrek', berat: 10.1, tinggi: 83, statusGizi: 'Gizi Kurang (Pantau)' },
  { id: 'bal-04', nama: 'Mikayla Zivana', nik: '3273014902240004', tanggalLahir: '2024-02-09', rt: 'RT 03', rw: 'RW 04', posyandu: 'Posyandu Teratai', berat: 10.5, tinggi: 82, statusGizi: 'Sesuai (Normal)' },
  { id: 'bal-05', nama: 'Aditya Pratama', nik: '3273012808230005', tanggalLahir: '2023-08-28', rt: 'RT 05', rw: 'RW 05', posyandu: 'Posyandu Dahlia', berat: 12.0, tinggi: 90, statusGizi: 'Sesuai (Normal)' },
];

export const MOCK_BADUTA = [
  { id: 'bad-01', nama: 'Althaf Narendra (11 Bln)', nik: '3273011411250001', tanggalLahir: '2025-11-14', rt: 'RT 02', rw: 'RW 01', posyandu: 'Posyandu Melati', berat: 9.2, tinggi: 74, statusGizi: 'Sesuai (Normal)' },
  { id: 'bad-02', nama: 'Nayra Syakila (8 Bln)', nik: '3273016202260002', tanggalLahir: '2026-02-22', rt: 'RT 03', rw: 'RW 02', posyandu: 'Posyandu Mawar', berat: 7.8, tinggi: 69, statusGizi: 'Sesuai (Normal)' },
  { id: 'bad-03', nama: 'Gibran Arsalan (15 Bln)', nik: '3273010507250003', tanggalLahir: '2025-07-05', rt: 'RT 02', rw: 'RW 04', posyandu: 'Posyandu Teratai', berat: 9.8, tinggi: 78, statusGizi: 'Sesuai (Normal)' },
  { id: 'bad-04', nama: 'Raffa Al-Faruq (18 Bln)', nik: '3273012104250004', tanggalLahir: '2025-04-21', rt: 'RT 01', rw: 'RW 03', posyandu: 'Posyandu Anggrek', berat: 8.5, tinggi: 73, statusGizi: 'Gizi Kurang (Pantau PMT)' },
];

export const MOCK_IBU_HAMIL = [
  { id: 'bum-01', nama: 'Rina Marlina', nik: '3273014502980001', rt: 'RT 02', rw: 'RW 01', hpl: '2026-11-20', usiaKehamilan: '35 Minggu', posyandu: 'Posyandu Melati', risikoTinggi: 'Tidak' },
  { id: 'bum-02', nama: 'Dewi Anggraeni', nik: '3273015609950002', rt: 'RT 01', rw: 'RW 02', hpl: '2026-12-10', usiaKehamilan: '32 Minggu', posyandu: 'Posyandu Mawar', risikoTinggi: 'Tidak' },
  { id: 'bum-03', nama: 'Siti Sarah', nik: '3273016801930003', rt: 'RT 04', rw: 'RW 03', hpl: '2026-11-05', usiaKehamilan: '37 Minggu', posyandu: 'Posyandu Anggrek', risikoTinggi: 'Ya (Anemia Ringan)' },
  { id: 'bum-04', nama: 'Wulan Novita', nik: '3273014112990004', rt: 'RT 02', rw: 'RW 04', hpl: '2027-01-18', usiaKehamilan: '26 Minggu', posyandu: 'Posyandu Teratai', risikoTinggi: 'Tidak' },
];

export const MOCK_LANSIA = [
  { id: 'lan-01', nama: 'Abah Engkos Sarkosih', nik: '3273011204480001', umur: 78, rt: 'RT 01', rw: 'RW 01', kondisiKesehatan: 'Hipertensi Terkontrol (Rutin Posbindu)', penerimaBansos: 'Ya (PKH Lansia)' },
  { id: 'lan-02', nama: 'Emak Siti Maryam', nik: '3273014506520002', umur: 74, rt: 'RT 03', rw: 'RW 02', kondisiKesehatan: 'Sehat & Aktif Senam Lansia', penerimaBansos: 'Tidak' },
  { id: 'lan-03', nama: 'Bapak H. Sukarna', nik: '3273010101450003', umur: 81, rt: 'RT 02', rw: 'RW 03', kondisiKesehatan: 'Gangguan Pendengaran Ringan', penerimaBansos: 'Tidak' },
  { id: 'lan-04', nama: 'Ibu Ratmi', nik: '3273016010500004', umur: 76, rt: 'RT 04', rw: 'RW 04', kondisiKesehatan: 'Rematik (Butuh Bantuan Kursi Roda)', penerimaBansos: 'Ya (BPNT & Bansos Pemkot)' },
];
