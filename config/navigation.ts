import { UserRole, MenuGroup } from '@/types';

export const ROLE_NAVIGATION: Record<UserRole, MenuGroup[]> = {
  lurah: [
    {
      groupName: 'MENU UTAMA LURAH',
      items: [
        {
          title: 'Beranda',
          href: '/lurah/beranda',
          iconName: 'LayoutDashboard',
          description: 'Ringkasan data, pengajuan butuh persetujuan, dan grafik kinerja',
        },
        {
          title: 'Persetujuan',
          href: '/lurah/persetujuan',
          iconName: 'CheckSquare',
          description: 'Persetujuan Rencana Program Kerja dan Rencana Giat seluruh seksi',
        },
        {
          title: 'Disposisi Surat',
          href: '/lurah/disposisi',
          iconName: 'Send',
          description: 'Penerusan dan instruksi disposisi surat masuk ke seksi terkait',
        },
        {
          title: 'Laporan Ringkas',
          href: '/lurah/laporan',
          iconName: 'BarChart3',
          description: 'Laporan komprehensif 4 bidang dalam satu tampilan ringkas',
        },
        {
          title: 'Data Penduduk',
          href: '/lurah/data-penduduk',
          iconName: 'Users',
          description: 'Data warga per jiwa dari Google Sheets (NIK, KK, RT/RW, agama, pendidikan)',
        },
        {
          title: 'Laporan Bulanan Penduduk',
          href: '/lurah/laporan-penduduk',
          iconName: 'BarChart3',
          description: 'Rekap umur, agama, pendidikan & mata pencaharian format Kota Bandung',
        },
        {
          title: 'Profil Ekbang Kelurahan',
          href: '/lurah/profil-ekbang',
          iconName: 'FileSpreadsheet',
          description: 'Rekapitulasi otomatis profil SDA, Ekonomi & Sarpras 16 RW serta Unduh Excel resmi',
        },
      ],
    },
  ],

  sekel: [
    {
      groupName: 'UTAMA',
      items: [
        {
          title: 'Beranda',
          href: '/sekel/beranda',
          iconName: 'LayoutDashboard',
          description: 'Ringkasan kerja, jalan pintas menu, dan aktivitas sekretariat',
        },
      ],
    },
    {
      groupName: 'PERENCANAAN',
      items: [
        {
          title: 'Rencana Program Kerja Kelurahan',
          href: '/sekel/rencana-program-kerja',
          iconName: 'Target',
          description: 'Penyusunan dan monitoring program kerja tingkat kelurahan',
        },
        {
          title: 'Rencana Giat',
          href: '/sekel/rencana-giat',
          iconName: 'Calendar',
          description: 'Jadwal dan agenda kegiatan operasional sekretariat',
        },
      ],
    },
    {
      groupName: 'ADMINISTRASI SURAT',
      items: [
        {
          title: 'Administrasi Surat Masuk',
          href: '/sekel/surat-masuk',
          iconName: 'Inbox',
          description: 'Pencatatan dan pengarsipan surat masuk ke kelurahan',
        },
        {
          title: 'Administrasi Surat Keluar',
          href: '/sekel/surat-keluar',
          iconName: 'Send',
          description: 'Pencatatan dan nomor agenda surat keluar resmi',
        },
      ],
    },
    {
      groupName: 'UMUM & ASET',
      items: [
        {
          title: 'Pengelolaan Kerumahtanggaan',
          href: '/sekel/kerumahtanggaan',
          iconName: 'Home',
          description: 'Inventaris perlengkapan dan operasional kantor kelurahan',
        },
        {
          title: 'Dokumentasi Kepegawaian',
          href: '/sekel/kepegawaian',
          iconName: 'Users',
          description: 'Data ASN, Non-ASN, jabatan, dan riwayat kepegawaian',
        },
        {
          title: 'Barang Milik Daerah (BMD)',
          href: '/sekel/bmd',
          iconName: 'Package',
          description: 'Penatausahaan aset dan barang inventaris daerah',
        },
      ],
    },
  ],

  pemerintahan: [
    {
      groupName: 'UTAMA',
      items: [
        {
          title: 'Beranda',
          href: '/pemerintahan/beranda',
          iconName: 'LayoutDashboard',
          description: 'Ringkasan administrasi kependudukan dan jalan pintas seksi',
        },
      ],
    },
    {
      groupName: 'PERENCANAAN',
      items: [
        {
          title: 'Rencana Program Kerja Sie Pemerintahan',
          href: '/pemerintahan/rencana-program-kerja',
          iconName: 'Target',
          description: 'Rencana kerja operasional Seksi Pemerintahan',
        },
        {
          title: 'Rencana Giat',
          href: '/pemerintahan/rencana-giat',
          iconName: 'Calendar',
          description: 'Agenda kegiatan lapangan dan pelayanan seksi pemerintahan',
        },
      ],
    },
    {
      groupName: 'ADMINISTRASI',
      items: [
        {
          title: 'Data Penduduk',
          href: '/pemerintahan/data-penduduk',
          iconName: 'Users',
          description: 'Data warga per jiwa dari Google Sheets (NIK, KK, RT/RW, agama, pendidikan)',
        },
        {
          title: 'Penduduk Sementara / Musiman',
          href: '/pemerintahan/penduduk-sementara',
          iconName: 'UserPlus',
          description: 'Buku penduduk sementara & musiman (MODEL A.2) dari Google Sheets',
        },
        {
          title: 'Buku Perubahan Penduduk (LAMPID)',
          href: '/pemerintahan/perubahan-penduduk',
          iconName: 'History',
          description: 'Catatan lahir, mati, pindah, dan datang (MODEL A.3)',
        },
        {
          title: 'Laporan Bulanan Penduduk',
          href: '/pemerintahan/laporan-penduduk',
          iconName: 'BarChart3',
          description: 'Rekap umur, agama, pendidikan & mata pencaharian format Kota Bandung',
        },
        {
          title: 'Administrasi Kependudukan',
          href: '/pemerintahan/kependudukan',
          iconName: 'ClipboardList',
          description: 'Layanan administrasi KTP, KK, dan mutasi penduduk',
        },
        {
          title: 'Administrasi Pencatatan Sipil',
          href: '/pemerintahan/catatan-sipil',
          iconName: 'FileText',
          description: 'Pencatatan kelahiran, kematian, dan status perkawinan',
        },
        {
          title: 'Administrasi Pertanahan',
          href: '/pemerintahan/pertanahan',
          iconName: 'MapPin',
          description: 'Pencatatan surat keterangan tanah dan batas wilayah',
        },
        {
          title: 'Ketentraman & Perlindungan Masyarakat',
          href: '/pemerintahan/trantibum',
          iconName: 'ShieldCheck',
          description: 'Laporan linmas, ketertiban umum, dan kamtibmas lingkungan',
        },
      ],
    },
    {
      groupName: 'DATA PENGURUS',
      items: [
        {
          title: 'Data Pengurus RW & RT',
          href: '/pemerintahan/pengurus',
          iconName: 'Building',
          description: 'Satu tabel pengurus per RW — Ketua/Sekretaris/Bendahara RW dan RT',
        },
      ],
    },
  ],

  ekbang: [
    {
      groupName: 'UTAMA',
      items: [
        {
          title: 'Beranda',
          href: '/ekbang/beranda',
          iconName: 'LayoutDashboard',
          description: 'Ringkasan progres pembangunan, kebersihan, dan UMKM',
        },
      ],
    },
    {
      groupName: 'PERENCANAAN',
      items: [
        {
          title: 'Rencana Program Kerja Sie Ekbang',
          href: '/ekbang/rencana-program-kerja',
          iconName: 'Target',
          description: 'Program kerja ekonomi dan pembangunan kewilayahan',
        },
        {
          title: 'Rencana Giat',
          href: '/ekbang/rencana-giat',
          iconName: 'Calendar',
          description: 'Jadwal monitoring pembangunan dan kegiatan lapangan',
        },
      ],
    },
    {
      groupName: 'PEMBANGUNAN',
      items: [
        {
          title: 'Musrenbang Kelurahan',
          href: '/ekbang/musrenbang',
          iconName: 'FileSpreadsheet',
          description: 'Daftar usulan prioritas musyawarah pembangunan',
        },
        {
          title: 'Fasilitasi Sarana & Prasarana Fisik',
          href: '/ekbang/fasilitas-sarpras',
          iconName: 'Building2',
          description: 'Pembangunan fasum, fasos, dan sarpras lingkungan',
        },
        {
          title: 'Pekerjaan Infrastruktur',
          href: '/ekbang/infrastruktur',
          iconName: 'Hammer',
          description: 'Monitoring proyek drainase, jalan setapak, dan rutilahu',
        },
      ],
    },
    {
      groupName: 'EKONOMI & PEMBERDAYAAN',
      items: [
        {
          title: 'Data Koperasi & UMKM',
          href: '/ekbang/umkm',
          iconName: 'Store',
          description: 'Pendataan pelaku usaha mikro, kecil, dan koperasi warga',
        },
        {
          title: 'Pemberdayaan Masyarakat',
          href: '/ekbang/pemberdayaan',
          iconName: 'HeartHandshake',
          description: 'Program pelatihan kerja, ketahanan pangan, dan kelompok swadaya',
        },
      ],
    },
    {
      groupName: 'PETUGAS LAPANGAN',
      items: [
        {
          title: 'Data Petugas Kebersihan',
          href: '/ekbang/petugas-kebersihan',
          iconName: 'Trash2',
          description: 'Daftar tim gorong-gorong dan pengangkut sampah wilayah',
        },
        {
          title: 'Data Petugas Magot',
          href: '/ekbang/petugas-magot',
          iconName: 'Sparkles',
          description: 'Petugas budidaya magot pengolah sampah organik kelurahan',
        },
      ],
    },
    {
      groupName: 'PROFIL KEWILAYAHAN',
      items: [
        {
          title: 'Profil Wilayah Ekbang',
          href: '/ekbang/profil-ekbang',
          iconName: 'Trees',
          description: 'Input dan pemutakhiran data SDA & Orbitas, Usaha Ekonomi, dan Sarpras per RW',
        },
      ],
    },
  ],

  kesos: [
    {
      groupName: 'UTAMA',
      items: [
        {
          title: 'Beranda',
          href: '/kesos/beranda',
          iconName: 'LayoutDashboard',
          description: 'Ringkasan kesehatan warga, data balita, dan bantuan sosial',
        },
      ],
    },
    {
      groupName: 'PERENCANAAN',
      items: [
        {
          title: 'Rencana Program Kerja Sie Kesos',
          href: '/kesos/rencana-program-kerja',
          iconName: 'Target',
          description: 'Rencana program kesejahteraan dan sosial masyarakat',
        },
        {
          title: 'Rencana Giat',
          href: '/kesos/rencana-giat',
          iconName: 'Calendar',
          description: 'Jadwal posyandu, pembinaan lansia, dan giat sosial',
        },
      ],
    },
    {
      groupName: 'DATA UMUM',
      items: [
        {
          title: 'Inventarisasi Potensi Kesos',
          href: '/kesos/potensi-kesos',
          iconName: 'Compass',
          description: 'Pemetaan potensi dan sumber kesejahteraan sosial (PSKS)',
        },
        {
          title: 'Pembinaan Lembaga Kemasyarakatan',
          href: '/kesos/pembinaan-lembaga',
          iconName: 'GraduationCap',
          description: 'Pelatihan dan pembinaan kapasitas lembaga mitra kelurahan',
        },
      ],
    },
    {
      groupName: 'DATA PENGURUS',
      items: [
        {
          title: 'Data Pengurus Posyandu',
          href: '/kesos/pengurus-posyandu',
          iconName: 'Stethoscope',
          description: 'Kader posyandu dari Posyandu Melati hingga Mawar',
        },
        {
          title: 'Data Pengurus Karang Taruna',
          href: '/kesos/pengurus-karta',
          iconName: 'Users',
          description: 'Kepengurusan Karang Taruna Kelurahan Lebakgede',
        },
        {
          title: 'Data Pengurus PKK RW',
          href: '/kesos/pengurus-pkk',
          iconName: 'Award',
          description: 'Pengurus Tim Penggerak PKK tiap RW',
        },
        {
          title: 'Data Pengurus LPM',
          href: '/kesos/pengurus-lpm',
          iconName: 'Landmark',
          description: 'Lembaga Pemberdayaan Masyarakat Kelurahan Lebakgede',
        },
      ],
    },
    {
      groupName: 'DATA WARGA & KESEHATAN',
      items: [
        {
          title: 'Data Balita (0-59 Bulan)',
          href: '/kesos/balita',
          iconName: 'Baby',
          description: 'Penimbangan, status gizi balita, dan pencegahan stunting',
        },
        {
          title: 'Data Baduta (0-23 Bulan)',
          href: '/kesos/baduta',
          iconName: 'Heart',
          description: 'Pemantauan khusus 1000 hari pertama kehidupan (HPK)',
        },
        {
          title: 'Data Ibu Hamil',
          href: '/kesos/ibu-hamil',
          iconName: 'UserPlus',
          description: 'Pemeriksaan kehamilan, tanggal taksiran persalinan (HPL)',
        },
        {
          title: 'Data Lansia',
          href: '/kesos/lansia',
          iconName: 'Shield',
          description: 'Warga lanjut usia, posbindu, dan bantuan jaminan sosial',
        },
      ],
    },
  ],
};
