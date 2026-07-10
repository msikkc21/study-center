// ============================================
// Prisma Seed Script - Study Center KKN
// Jalankan dengan: npm run db:seed
// ============================================

const { PrismaClient } = require('../generated/prisma');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Mulai seeding database...\n');

  // ----------------------------
  // Seed: Users
  // ----------------------------
  const passwordHash = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@studycenter.com' },
    update: {},
    create: {
      name: 'Admin Study Center',
      email: 'admin@studycenter.com',
      password: passwordHash,
      role: 'ADMIN',
    },
  });

  const pengajar = await prisma.user.upsert({
    where: { email: 'pengajar@studycenter.com' },
    update: {},
    create: {
      name: 'Budi Santoso',
      email: 'pengajar@studycenter.com',
      password: passwordHash,
      role: 'PENGAJAR',
    },
  });

  const peserta = await prisma.user.upsert({
    where: { email: 'peserta@studycenter.com' },
    update: {},
    create: {
      name: 'Siti Rahayu',
      email: 'peserta@studycenter.com',
      password: passwordHash,
      role: 'PESERTA',
      student: {
        create: {
          phone: '081234567890',
          gender: 'PEREMPUAN',
          address: 'Jl. Contoh No. 1, Desa KKN',
        },
      },
    },
  });

  console.log(`✅ Users seeded: ${admin.name}, ${pengajar.name}, ${peserta.name}`);

  // ----------------------------
  // Seed: Subjects
  // ----------------------------
  const mathSubject = await prisma.subject.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Matematika Dasar',
      description: 'Pelajaran matematika dasar untuk siswa SD-SMP',
    },
  });

  const readSubject = await prisma.subject.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Bahasa Indonesia',
      description: 'Membaca, menulis, dan tata bahasa Indonesia',
    },
  });

  console.log(`✅ Subjects seeded: ${mathSubject.name}, ${readSubject.name}`);

  // ----------------------------
  // Seed: Study Sessions
  // ----------------------------
  const session1 = await prisma.studySession.upsert({
    where: { id: 1 },
    update: {},
    create: {
      subjectId: mathSubject.id,
      pengajarId: pengajar.id,
      title: 'Perkenalan Bilangan Bulat',
      description: 'Mengenal bilangan bulat positif dan negatif',
      sessionDate: new Date('2026-07-15'),
      startTime: '08:00',
      endTime: '10:00',
      location: 'Balai Desa',
    },
  });

  console.log(`✅ Sessions seeded: ${session1.title}`);

  console.log('\n🎉 Seeding selesai!');
  console.log('📋 Akun default (password: password123):');
  console.log('   - admin@studycenter.com (ADMIN)');
  console.log('   - pengajar@studycenter.com (PENGAJAR)');
  console.log('   - peserta@studycenter.com (PESERTA)');
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
