# 🐟 Study Center Edumina – Backend API

REST API untuk platform CMS **Study Center Edumina Kampung Siroto** — pusat edukasi budidaya lele di Siroto, Gunungpati, Semarang.

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| Runtime | Node.js |
| Framework | Express.js v5 |
| ORM | Prisma v6 |
| Database | MySQL 8.0+ |
| Auth | JWT (jsonwebtoken) |
| Upload | Multer |
| Validation | Joi |
| Security | Helmet, bcryptjs |
| Logging | Morgan |

---

## 📁 Struktur Folder

```
backend/
├── index.js                    # Entry point
├── prisma/
│   ├── schema.prisma           # Database schema
│   ├── seed.js                 # Seeder (admin, sample data)
│   └── migrations/             # Migration files
├── generated/prisma/           # Prisma client (auto-generated)
├── lib/
│   └── prisma.js               # Prisma client singleton
├── src/
│   ├── config/
│   │   └── multer.js           # File upload config
│   ├── middleware/
│   │   ├── auth.js             # JWT verify middleware
│   │   ├── adminOnly.js        # Admin-only guard
│   │   └── errorHandler.js     # Global error handler
│   ├── utils/
│   │   ├── response.js         # Standard response helpers
│   │   ├── fileHelper.js       # File delete utility
│   │   └── slugify.js          # Slug generator
│   ├── validators/             # Joi input validators
│   ├── controllers/            # Business logic
│   └── routes/                 # Express router definitions
└── uploads/                    # Uploaded files
    ├── aktivitas/
    ├── produk/
    ├── paket/
    └── berita/
```

---

## ⚙️ Installation

### Prerequisites
- Node.js 18+
- MySQL 8.0+ (atau Docker: lihat docker-compose)
- npm

### 1. Clone & Install

```bash
# Dari root monorepo
npm install

# Atau khusus backend
cd backend && npm install
```

### 2. Setup Environment

```bash
cp backend/.env.example backend/.env
# Edit .env sesuai konfigurasi database Anda
```

Isi variabel berikut di `.env`:

```env
DATABASE_URL="mysql://root:password@localhost:3306/study_center_edumina"
JWT_SECRET=your_super_secret_key_minimum_32_characters
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Buat tabel (jalankan migrasi)
npm run db:migrate

# Isi data awal (admin + sample data)
npm run db:seed
```

### 4. Jalankan Server

```bash
# Development (dengan auto-reload)
npm run dev:backend

# Production
npm run start:backend
```

Server berjalan di: `http://localhost:5000`

---

## 🔐 Akun Default

Setelah menjalankan `db:seed`:

| Username | Password | Role |
|---|---|---|
| `admin` | `Admin1234!` | admin |
| `operator` | `Operator1234!` | operator |

---

## 📡 API Endpoints

Base URL: `http://localhost:5000/api`

### Authentication

| Method | Endpoint | Auth | Keterangan |
|--------|----------|------|------------|
| POST | `/auth/login` | ❌ | Login, returns JWT token |
| POST | `/auth/logout` | ✅ | Logout |
| GET | `/auth/me` | ✅ | Get current user |

**Login Request:**
```json
{
  "username": "admin",   // bisa juga email
  "password": "Admin1234!"
}
```

**Login Response:**
```json
{
  "success": true,
  "message": "Login berhasil.",
  "data": {
    "token": "eyJhbGci...",
    "user": { "id": 1, "username": "admin", "role": "admin", ... }
  }
}
```

---

### Aktivitas

| Method | Endpoint | Auth | Keterangan |
|--------|----------|------|------------|
| GET | `/aktivitas?page=1&limit=10` | ❌ | List (pagination) |
| GET | `/aktivitas/:id` | ❌ | Detail |
| POST | `/aktivitas` | ✅ | Create (multipart/form-data) |
| PUT | `/aktivitas/:id` | ✅ | Update |
| DELETE | `/aktivitas/:id` | ✅ | Delete |

**Form fields POST/PUT:** `judul`, `tanggal` (YYYY-MM-DD), `gambar` (file)

---

### Produk

| Method | Endpoint | Auth | Keterangan |
|--------|----------|------|------------|
| GET | `/produk` | ❌ | List |
| GET | `/produk/:id` | ❌ | Detail |
| POST | `/produk` | ✅ | Create |
| PUT | `/produk/:id` | ✅ | Update |
| DELETE | `/produk/:id` | ✅ | Delete |

**Form fields:** `nama_produk`, `deskripsi`, `link_wa`, `gambar` (file)

---

### Paket Edukasi

| Method | Endpoint | Auth | Keterangan |
|--------|----------|------|------------|
| GET | `/paket-edukasi` | ❌ | List |
| GET | `/paket-edukasi/:id` | ❌ | Detail lengkap |
| POST | `/paket-edukasi` | ✅ | Create |
| PUT | `/paket-edukasi/:id` | ✅ | Update |
| DELETE | `/paket-edukasi/:id` | ✅ | Delete |

**Form fields:** `judul`, `harga`, `deskripsi_singkat`, `deskripsi_lengkap`, `durasi`, `fasilitas`, `link_wa`, `gambar` (file)

---

### Berita

| Method | Endpoint | Auth | Keterangan |
|--------|----------|------|------------|
| GET | `/berita?page=1&limit=9` | ❌ | List (9/page) |
| GET | `/berita/:slug` | ❌ | Detail by slug |
| POST | `/berita` | ✅ | Create (auto-generate slug) |
| PUT | `/berita/:id` | ✅ | Update (update slug jika judul berubah) |
| DELETE | `/berita/:id` | ✅ | Delete |

**Form fields:** `judul`, `tanggal_publish`, `isi_konten`, `gambar` (file)

---

### User Management *(Admin only)*

| Method | Endpoint | Auth | Keterangan |
|--------|----------|------|------------|
| GET | `/users` | ✅ Admin | List users |
| GET | `/users/:id` | ✅ Admin | Detail |
| POST | `/users` | ✅ Admin | Create user |
| PUT | `/users/:id` | ✅ Admin | Update (password opsional) |
| DELETE | `/users/:id` | ✅ Admin | Delete (tidak bisa hapus diri sendiri) |

---

## 📦 Response Format

### Success
```json
{
  "success": true,
  "message": "Berhasil.",
  "data": { ... },
  "meta": { "page": 1, "limit": 10, "total": 50, "total_pages": 5 }
}
```

### Error
```json
{
  "success": false,
  "message": "Pesan error.",
  "errors": ["Detail error 1", "Detail error 2"]
}
```

---

## 🔒 Authentication

Semua endpoint yang memerlukan auth menggunakan **Bearer Token**:

```
Authorization: Bearer <token>
```

### Roles
- **Admin**: Full access ke semua endpoint
- **Operator**: Akses ke aktivitas, produk, paket, berita CRUD. Tidak bisa akses `/users`

---

## 🖼️ File Upload

- **Format yang didukung**: JPG, PNG, WebP
- **Ukuran maksimal**: 5MB
- **Storage**: `uploads/<module>/<timestamp>-<random>.<ext>`
- **URL akses**: `http://localhost:5000/uploads/<module>/<filename>`

Contoh request upload (multipart/form-data):
```bash
curl -X POST http://localhost:5000/api/aktivitas \
  -H "Authorization: Bearer <token>" \
  -F "judul=Pelatihan Baru" \
  -F "tanggal=2026-07-15" \
  -F "gambar=@/path/to/image.jpg"
```

---

## 🗄️ Database Scripts

```bash
npm run db:generate    # Generate Prisma client
npm run db:migrate     # Run pending migrations
npm run db:push        # Push schema tanpa migration history
npm run db:studio      # Buka Prisma Studio (GUI)
npm run db:reset       # Reset database (HAPUS SEMUA DATA!)
npm run db:seed        # Isi data awal
```

---

## 🧪 HTTP Status Codes

| Code | Keterangan |
|------|------------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized (token tidak ada/invalid) |
| 403 | Forbidden (role tidak cukup) |
| 404 | Not Found |
| 409 | Conflict (duplicate unique field) |
| 500 | Internal Server Error |

---

## 📞 Kontak

- **WhatsApp**: +62-8156-3922-5
- **Email**: admin@studycenteredumina.com
- **Instagram**: @studycenterEdumina
- **Lokasi**: Siroto, Gunungpati, Semarang
