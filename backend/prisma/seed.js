// ============================================
// Seed Script - Study Center Edumina
// Jalankan: npm run db:seed
// ============================================

const { PrismaClient } = require('../generated/prisma');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Mulai seeding database...\n');

  const salt = await bcrypt.genSalt(10);
  const adminPass = await bcrypt.hash('Admin1234!', salt);
  const operatorPass = await bcrypt.hash('Operator1234!', salt);

  // ----------------------------
  // Seed: Users
  // ----------------------------
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@studycenteredumina.com',
      password: adminPass,
      nama_lengkap: 'Administrator',
      role: 'admin',
      status: 'active',
    },
  });

  const operator = await prisma.user.upsert({
    where: { username: 'operator' },
    update: {},
    create: {
      username: 'operator',
      email: 'operator@studycenteredumina.com',
      password: operatorPass,
      nama_lengkap: 'Operator KKN',
      role: 'operator',
      status: 'active',
    },
  });

  console.log(`✅ Users seeded: ${admin.nama_lengkap} (admin), ${operator.nama_lengkap} (operator)`);

  // ----------------------------
  // Seed: Aktivitas
  // ----------------------------
  const aktivitasList = [
    {
      judul: 'Pelatihan Budidaya Lele Intensif',
      tanggal: new Date('2026-07-01'),
      gambar: 'aktivitas/default.jpg',
    },
    {
      judul: 'Kunjungan Kolam Ikan Percontohan',
      tanggal: new Date('2026-07-05'),
      gambar: 'aktivitas/default.jpg',
    },
    {
      judul: 'Workshop Pengolahan Produk Lele',
      tanggal: new Date('2026-07-10'),
      gambar: 'aktivitas/default.jpg',
    },
  ];

  for (const act of aktivitasList) {
    await prisma.aktivitas.create({ data: act });
  }
  console.log(`✅ Aktivitas seeded: ${aktivitasList.length} data`);

  // ----------------------------
  // Seed: Produk
  // ----------------------------
  const produkList = [
    {
      nama_produk: 'Lele Segar',
      gambar: 'produk/default.jpg',
      deskripsi: 'Lele segar hasil budidaya kolam Siroto. Ukuran konsumsi 3-5 ekor/kg.',
      link_wa: 'https://wa.me/628156392250',
    },
    {
      nama_produk: 'Lele Asap',
      gambar: 'produk/default.jpg',
      deskripsi: 'Lele asap khas Edumina dengan cita rasa gurih. Ketahanan hingga 7 hari.',
      link_wa: 'https://wa.me/628156392250',
    },
    {
      nama_produk: 'Pupuk Organik Bioflok',
      gambar: 'produk/default.jpg',
      deskripsi: 'Pupuk organik dari limbah budidaya lele sistem bioflok.',
      link_wa: 'https://wa.me/628156392250',
    },
  ];

  for (const prod of produkList) {
    await prisma.produk.create({ data: prod });
  }
  console.log(`✅ Produk seeded: ${produkList.length} data`);

  // ----------------------------
  // Seed: Paket Edukasi
  // ----------------------------
  const paketList = [
    {
      judul: 'Paket Dasar Budidaya Lele',
      deskripsi_singkat: 'Paket pemula untuk belajar budidaya lele dari nol.',
      deskripsi_lengkap:
        'Program pembelajaran komprehensif selama 2 hari yang mencakup pengenalan kolam, pemilihan bibit, pemberian pakan, dan pengelolaan kualitas air. Cocok untuk pemula yang ingin memulai usaha budidaya lele.',
      harga: 350000,
      durasi: '2 Hari',
      fasilitas: 'Modul cetak, Makan siang, Sertifikat, Praktek langsung di kolam',
      gambar: 'paket/default.jpg',
      link_wa: 'https://wa.me/628156392250',
    },
    {
      judul: 'Paket Intensif Bioflok',
      deskripsi_singkat: 'Pelajari sistem bioflok modern untuk hasil panen maksimal.',
      deskripsi_lengkap:
        'Program intensif 3 hari khusus teknik bioflok. Peserta akan mempelajari cara membuat media bioflok, manajemen probiotik, dan optimasi kepadatan tebar. Termasuk praktek pengolahan air dan monitoring kualitas.',
      harga: 750000,
      durasi: '3 Hari',
      fasilitas:
        'Modul cetak + digital, Makan siang & snack, Sertifikat, Kit starter bioflok, Praktek lapangan',
      gambar: 'paket/default.jpg',
      link_wa: 'https://wa.me/628156392250',
    },
    {
      judul: 'Paket Pengolahan Produk Lele',
      deskripsi_singkat: 'Tingkatkan nilai jual dengan pengolahan produk turunan lele.',
      deskripsi_lengkap:
        'Program 1 hari berfokus pada pengolahan pasca panen: lele asap, abon lele, kerupuk lele, dan pengemasan higienis. Peserta mendapatkan resep eksklusif dan praktek langsung produksi.',
      harga: 250000,
      durasi: '1 Hari',
      fasilitas: 'Resep eksklusif, Makan siang, Sertifikat, Produk hasil praktek (take home)',
      gambar: 'paket/default.jpg',
      link_wa: 'https://wa.me/628156392250',
    },
  ];

  for (const paket of paketList) {
    await prisma.paketEdukasi.create({ data: paket });
  }
  console.log(`✅ Paket Edukasi seeded: ${paketList.length} data`);

  // ----------------------------
  // Seed: Berita
  // ----------------------------
  const beritaList = [
    {
      judul: 'Study Center Edumina Raih Penghargaan UMKM Unggulan Kota Semarang',
      slug: 'study-center-edumina-raih-penghargaan-umkm-unggulan-kota-semarang',
      isi_konten:
        'Study Center Edumina Kampung Siroto berhasil meraih penghargaan sebagai UMKM Unggulan Kota Semarang 2026 dalam bidang agribisnis. Penghargaan ini diberikan atas inovasi sistem bioflok yang terbukti meningkatkan produktivitas budidaya lele hingga 300%.',
      tanggal_publish: new Date('2026-07-01'),
      gambar: 'berita/default.jpg',
    },
    {
      judul: 'Kolaborasi dengan Universitas Negeri Semarang untuk Riset Bioflok',
      slug: 'kolaborasi-dengan-universitas-negeri-semarang-untuk-riset-bioflok',
      isi_konten:
        'Edumina menjalin kemitraan strategis dengan Fakultas Perikanan UNNES untuk pengembangan teknologi bioflok generasi berikutnya. Program riset bersama ini akan berlangsung selama 2 tahun dengan pendanaan dari Kemenristekdikti.',
      tanggal_publish: new Date('2026-07-05'),
      gambar: 'berita/default.jpg',
    },
    {
      judul: 'Pembukaan Pendaftaran Paket Edukasi Batch 3 Tahun 2026',
      slug: 'pembukaan-pendaftaran-paket-edukasi-batch-3-tahun-2026',
      isi_konten:
        'Edumina membuka pendaftaran batch ketiga program edukasi budidaya lele untuk tahun 2026. Tersedia tiga pilihan paket: Paket Dasar, Paket Intensif Bioflok, dan Paket Pengolahan Produk. Pendaftaran dibuka mulai 15 Juli 2026.',
      tanggal_publish: new Date('2026-07-10'),
      gambar: 'berita/default.jpg',
    },
  ];

  for (const berita of beritaList) {
    await prisma.berita.create({ data: berita });
  }
  console.log(`✅ Berita seeded: ${beritaList.length} data`);

  console.log('\n🎉 Seeding selesai!');
  console.log('📋 Akun default:');
  console.log('   👤 admin / Admin1234!       → role: admin');
  console.log('   👤 operator / Operator1234! → role: operator');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error saat seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
