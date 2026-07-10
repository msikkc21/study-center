# 📚 Study Center KKN

> Platform manajemen kegiatan belajar untuk program Kuliah Kerja Nyata (KKN). Dibangun dengan arsitektur **monorepo** yang memisahkan antara Backend (Express.js) dan Frontend (Next.js).

---

## 📁 Struktur Project

```
study-center/                     ← Root monorepo
├── backend/                      ← REST API (Express.js + Prisma ORM)
│   ├── generated/prisma/         ← Prisma Client (auto-generated, tidak di-commit)
│   ├── lib/
│   │   └── prisma.js             ← Singleton Prisma client
│   ├── prisma/
│   │   ├── schema.prisma         ← Database schema & model definitions
│   │   ├── seed.js               ← Script seed data awal
│   │   └── migrations/          ← Riwayat migrasi database
│   ├── index.js                  ← Entry point server
│   ├── prisma.config.ts          ← Konfigurasi Prisma CLI
│   ├── package.json
│   ├── .env                      ← Environment variables backend (lokal, tidak di-commit)
│   └── .env.example              ← Template .env backend
│
├── frontend/                     ← Web App (Next.js 16 + TypeScript + Tailwind)
│   ├── app/                      ← Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── package.json
│   ├── .env.local                ← Environment variables frontend (lokal, tidak di-commit)
│   └── .env.local.example        ← Template .env frontend
│
├── package.json                  ← Root monorepo package.json (scripts & workspaces)
├── .gitignore
└── README.md                     ← Dokumentasi ini
```

---

## 🛠️ Tech Stack

| Layer      | Teknologi                                          |
|------------|----------------------------------------------------|
| Frontend   | Next.js 16, React 19, TypeScript, Tailwind CSS 4  |
| Backend    | Node.js, Express.js 5                              |
| Database   | MySQL (local)                                      |
| ORM        | **Prisma ORM v6** (schema, migrate, seed, studio)  |
| Auth       | JWT (JSON Web Token)                               |
| Dev Tools  | Nodemon, concurrently, ESLint                      |

---

## ⚙️ Prasyarat

Sebelum menjalankan project, pastikan sudah terinstall:

- [Node.js](https://nodejs.org/) `>= 18.x`
- [npm](https://www.npmjs.com/) `>= 9.x`
- [MySQL](https://www.mysql.com/) (running di local, default port `3306`)

---

## 🚀 Instalasi & Setup

### 1. Clone Repository

```bash
git clone <url-repository-anda>
cd study-center
```

### 2. Install Semua Dependencies (Sekali Jalan)

```bash
npm run install:all
```

> Perintah ini akan menginstall dependencies untuk root, backend, dan frontend sekaligus.

### 3. Setup Database MySQL

Buat database baru di MySQL lokal kamu:

```sql
CREATE DATABASE study_center_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Setup Environment Variables

**Backend** — Salin file template dan isi nilainya:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
NODE_ENV=development
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=           # ← isi password MySQL kamu
DB_NAME=study_center_db

# Prisma DATABASE_URL — sesuaikan dengan DB_* di atas
DATABASE_URL="mysql://root:PASSWORD@localhost:3306/study_center_db"

JWT_SECRET=ganti_dengan_string_rahasia_yang_panjang
JWT_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:3000
API_BASE_URL=http://localhost:5000/api
```

**Frontend** — Salin file template dan isi nilainya:

```bash
cp frontend/.env.local.example frontend/.env.local
```

Edit `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=Study Center KKN
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 5. Setup Prisma & Database

**Generate Prisma Client** (wajib setelah clone):

```bash
npm run db:generate
```

**Buat tabel di database** (pilih salah satu):

```bash
# Opsi A — pakai Prisma Migrate (recommended, buat file migrasi)
npm run db:migrate

# Opsi B — push schema langsung tanpa file migrasi (cocok untuk prototyping)
npm run db:push
```

**Isi data awal (seed)**:

```bash
npm run db:seed
```

---

## 🏃 Menjalankan Project

### ▶️ Jalankan Keduanya Sekaligus (Rekomendasi)

```bash
npm run dev
```

Ini akan menjalankan **backend** dan **frontend** secara bersamaan menggunakan `concurrently`:

| Service  | URL                          |
|----------|------------------------------|
| Frontend | http://localhost:3000         |
| Backend  | http://localhost:5000         |
| API      | http://localhost:5000/api     |

---

### ▶️ Jalankan Secara Terpisah

**Backend saja:**

```bash
npm run dev:backend
```

**Frontend saja:**

```bash
npm run dev:frontend
```

---

## 📜 Daftar Scripts

Semua scripts dijalankan dari **root directory**:

| Script                  | Deskripsi                                             |
|-------------------------|-------------------------------------------------------|
| `npm run dev`           | Jalankan backend + frontend bersamaan (development)   |
| `npm run dev:backend`   | Jalankan hanya backend (dengan nodemon)               |
| `npm run dev:frontend`  | Jalankan hanya frontend (Next.js dev server)          |
| `npm run build`         | Build frontend untuk production                       |
| `npm run start:backend` | Jalankan backend tanpa nodemon (production)           |
| `npm run start:frontend`| Jalankan frontend build hasil production              |
| `npm run install:all`   | Install semua dependencies (root + backend + frontend)|
| `npm run lint`          | Jalankan ESLint pada frontend                         |
| **Prisma**              |                                                       |
| `npm run db:generate`   | Generate Prisma Client dari schema                    |
| `npm run db:migrate`    | Buat & jalankan migrasi database (development)        |
| `npm run db:push`       | Push schema ke database tanpa migrasi                 |
| `npm run db:studio`     | Buka Prisma Studio (GUI database browser)             |
| `npm run db:reset`      | Reset database & jalankan ulang semua migrasi         |
| `npm run db:seed`       | Isi database dengan data awal                         |

---

## 🔌 Koneksi Antar Layer

```
[MySQL Database :3306]
      │
      │  Prisma ORM (query builder, migrations, type-safe)
      ▼
[Backend - Express.js :5000]
      │  lib/prisma.js   → singleton PrismaClient
      │  prisma/schema   → model definitions & migrations
      │
      │  REST API (HTTP/JSON)
      │  CORS: http://localhost:3000
      ▼
[Frontend - Next.js :3000]
      │
      │  NEXT_PUBLIC_API_URL=http://localhost:5000/api
      ▼
[Browser / User]
```

---

## 🗃️ Environment Variables — Referensi Lengkap

### Backend (`backend/.env`)

| Variable         | Default                             | Deskripsi                                    |
|------------------|-------------------------------------|----------------------------------------------|
| `NODE_ENV`       | `development`                       | Mode environment                             |
| `PORT`           | `5000`                              | Port server Express.js                       |
| `DB_HOST`        | `localhost`                         | Host database MySQL                          |
| `DB_PORT`        | `3306`                              | Port database MySQL                          |
| `DB_USER`        | `root`                              | Username MySQL                               |
| `DB_PASSWORD`    | *(kosong)*                          | Password MySQL                               |
| `DB_NAME`        | `study_center_db`                   | Nama database                                |
| `DATABASE_URL`   | `mysql://root:@localhost:3306/...`  | **Prisma connection URL** (wajib diisi!)      |
| `JWT_SECRET`     | *(wajib diisi)*                     | Secret key untuk signing JWT token           |
| `JWT_EXPIRES_IN` | `7d`                                | Masa berlaku token JWT                       |
| `CORS_ORIGIN`    | `http://localhost:3000`             | Origin yang diizinkan oleh CORS              |
| `API_BASE_URL`   | `http://localhost:5000/api`         | Base URL API (referensi internal)            |

### Frontend (`frontend/.env.local`)

| Variable                  | Default                       | Deskripsi                          |
|---------------------------|-------------------------------|-------------------------------------|
| `NEXT_PUBLIC_API_URL`     | `http://localhost:5000/api`   | URL backend API (exposed ke browser)|
| `NEXT_PUBLIC_APP_NAME`    | `Study Center KKN`            | Nama aplikasi                       |
| `NEXT_PUBLIC_APP_VERSION` | `1.0.0`                       | Versi aplikasi                      |

> ⚠️ **Penting:** Variabel dengan prefix `NEXT_PUBLIC_` akan ter-expose ke browser. Jangan masukkan data sensitif (password, secret) ke variabel tersebut.

---

## 🔐 Keamanan

- File `.env` dan `.env.local` **tidak pernah di-commit** ke Git (sudah ada di `.gitignore`).
- Gunakan file `.env.example` dan `.env.local.example` sebagai template untuk anggota tim.
- Ganti `JWT_SECRET` dengan string acak yang panjang (minimal 32 karakter) di production.
- Jangan gunakan `DB_PASSWORD` kosong di production.

---

## 🗄️ Prisma ORM — Cheat Sheet

### Cara pakai Prisma di route/controller:

```js
const prisma = require('../lib/prisma');

// Ambil semua users
const users = await prisma.user.findMany();

// Buat user baru
const user = await prisma.user.create({
  data: { name: 'Siti', email: 'siti@example.com', password: hash }
});

// Cari user by ID dengan relasinya
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: { student: true, attendances: true }
});
```

### Model yang tersedia:

| Model          | Tabel DB          | Deskripsi                       |
|----------------|-------------------|---------------------------------|
| `User`         | `users`           | Akun login (admin/pengajar/peserta) |
| `Student`      | `students`        | Data detail peserta belajar     |
| `Subject`      | `subjects`        | Mata pelajaran / materi         |
| `StudySession` | `study_sessions`  | Jadwal sesi belajar             |
| `Attendance`   | `attendances`     | Presensi peserta per sesi       |

### Prisma Studio (GUI database browser):

```bash
npm run db:studio
# Buka http://localhost:5555
```

---

## 📡 API Endpoint

### Base URL: `http://localhost:5000`

| Method | Endpoint | Deskripsi                              |
|--------|----------|----------------------------------------|
| GET    | `/`      | Health check (termasuk status Prisma)  |

> Endpoint lainnya akan ditambahkan seiring perkembangan project.

---

## 👥 Kontribusi

1. Fork repository ini
2. Buat branch baru: `git checkout -b fitur/nama-fitur`
3. Commit perubahan: `git commit -m "feat: deskripsi perubahan"`
4. Push ke branch: `git push origin fitur/nama-fitur`
5. Buat Pull Request

---

## 📝 Lisensi

Project ini dibuat untuk keperluan **KKN (Kuliah Kerja Nyata)**. Semua hak cipta milik tim pengembang KKN.
