📋 PRD (PRODUCT REQUIREMENTS DOCUMENT)
Study Center Edumina - Backend System

1. EXECUTIVE SUMMARY
1.1 Product Overview
Nama Produk: Study Center Edumina Kampung Siroto - Backend API
Jenis: Company Profile & Katalog CMS
Lokasi: Siroto, Gunungpati, Semarang
Tujuan: Promosi study center budidaya lele dan produk-produk terkait
1.2 Business Goals

    Menyediakan platform digital untuk promosi Study Center Edumina
    Memudahkan admin/operator update konten (aktivitas, produk, paket, berita)
    Memberikan informasi lengkap tentang layanan dan produk budidaya lele
    Memudahkan pengunjung menghubungi via WhatsApp untuk pemesanan

2. SCOPE & FEATURES
2.1 In Scope ✅
A. Frontend Landing Page

    Hero Section - Headline, tagline, statistik (hardcoded)
    Tentang Kami - Info study center (hardcoded)
    Aktivitas - Carousel kegiatan (dinamis dari database)
    Produk - Katalog produk dengan popup detail (dinamis)
    Paket Edukasi - Grid paket dengan popup detail (dinamis)
    Berita - Grid artikel dengan halaman detail (dinamis)
    Footer - Kontak, sosmed, mitra (hardcoded)

B. Admin Panel

    Dashboard - Quick stats & actions
    Manajemen Aktivitas - CRUD kegiatan
    Manajemen Produk - CRUD produk dengan detail popup
    Manajemen Paket Edukasi - CRUD paket dengan detail popup
    Manajemen Berita - CRUD artikel dengan slug
    Manajemen User - CRUD user (Admin/Operator)

C. Authentication & Authorization

    Login/Logout
    Role-based access (Admin & Operator)
    Session management

2.2 Out of Scope

    E-commerce/checkout system
    Payment gateway
    Booking/reservation system
    Analytics/statistik pengunjung
    Email notifications
    Multi-language support
    Mobile app

3. USER PERSONAS & ROLES
3.1 Visitor/Pengunjung (Public)

    Melihat landing page
    Melihat detail produk (popup)
    Melihat detail paket (popup)
    Membaca berita lengkap
    Menghubungi via WhatsApp

3.2 Admin

    Akses: Full access ke semua fitur
    Fitur:
        Kelola semua konten (CRUD)
        Kelola user (tambah, edit, hapus, assign role)
        Upload gambar/file
        Ubah pengaturan dasar

3.3 Operator

    Akses: Terbatas pada konten management
    Fitur:
        Kelola konten (aktivitas, produk, paket, berita)
        Upload gambar/file
        TIDAK BISA: Kelola user, ubah pengaturan

4. FUNCTIONAL REQUIREMENTS
4.1 Authentication Module
FR-001: Login

    Input: username/email + password
    Output: JWT token + user data
    Validation: Password hashing (bcrypt)
    Session: JWT expiry 24 hours

FR-002: Logout

    Invalidate token
    Clear session

FR-003: Password Management

    Password minimum 8 characters
    Password hashing menggunakan bcrypt
    Password reset via admin (manual)

4.2 Aktivitas Module
FR-004: List Aktivitas

    GET /api/aktivitas
    Pagination: 10 items per page
    Sort: tanggal DESC
    Response: id, judul, tanggal, gambar

FR-005: Create Aktivitas

    POST /api/aktivitas
    Input: judul, tanggal, gambar (upload)
    Auth: Admin/Operator
    Validation: Required fields

FR-006: Update Aktivitas

    PUT /api/aktivitas/:id
    Input: judul, tanggal, gambar (optional)
    Auth: Admin/Operator

FR-007: Delete Aktivitas

    DELETE /api/aktivitas/:id
    Auth: Admin/Operator
    Action: Delete record + file gambar

4.3 Produk Module
FR-008: List Produk

    GET /api/produk
    Response: id, nama_produk, gambar

FR-009: Get Produk Detail

    GET /api/produk/:id
    Response: id, nama_produk, gambar, deskripsi, link_wa
    Use case: Popup detail di frontend

FR-010: Create Produk

    POST /api/produk
    Input: nama_produk, gambar, deskripsi, link_wa
    Auth: Admin/Operator

FR-011: Update Produk

    PUT /api/produk/:id
    Auth: Admin/Operator

FR-012: Delete Produk

    DELETE /api/produk/:id
    Auth: Admin/Operator

4.4 Paket Edukasi Module
FR-013: List Paket

    GET /api/paket-edukasi
    Response: id, judul, deskripsi_singkat, harga, gambar

FR-014: Get Paket Detail

    GET /api/paket-edukasi/:id
    Response: Complete data including fasilitas, durasi, deskripsi_lengkap
    Use case: Popup detail di frontend

FR-015: Create Paket

    POST /api/paket-edukasi
    Input: All fields
    Auth: Admin/Operator

FR-016: Update Paket

    PUT /api/paket-edukasi/:id
    Auth: Admin/Operator

FR-017: Delete Paket

    DELETE /api/paket-edukasi/:id
    Auth: Admin/Operator

4.5 Berita Module
FR-018: List Berita

    GET /api/berita
    Pagination: 9 items per page (3x3 grid)
    Sort: tanggal_publish DESC
    Response: id, judul, slug, tanggal_publish, gambar

FR-019: Get Berita Detail

    GET /api/berita/:slug
    Response: Complete content
    Use case: Halaman detail berita

FR-020: Create Berita

    POST /api/berita
    Input: judul, slug (auto-generate), isi_konten, tanggal_publish, gambar
    Auth: Admin/Operator
    Auto-generate slug dari judul

FR-021: Update Berita

    PUT /api/berita/:id
    Auth: Admin/Operator
    Update slug jika judul berubah

FR-022: Delete Berita

    DELETE /api/berita/:id
    Auth: Admin/Operator

4.6 User Management Module
FR-023: List Users

    GET /api/users
    Auth: Admin only
    Response: id, username, email, nama_lengkap, role, status

FR-024: Create User

    POST /api/users
    Input: username, email, password, nama_lengkap, role
    Auth: Admin only
    Validation: Unique username & email

FR-025: Update User

    PUT /api/users/:id
    Auth: Admin only
    Can update: nama_lengkap, email, role, status
    Password update optional

FR-026: Delete User

    DELETE /api/users/:id
    Auth: Admin only
    Validation: Cannot delete self

FR-027: Get Current User

    GET /api/users/me
    Response: Current logged-in user data

5. NON-FUNCTIONAL REQUIREMENTS
5.1 Performance

    API response time < 500ms
    Image upload max 5MB
    Support 100+ concurrent users

5.2 Security

    JWT authentication
    Password hashing (bcrypt, salt rounds: 10)
    Input validation & sanitization
    CORS configuration
    SQL injection prevention
    XSS protection

5.3 Reliability

    Uptime 99%
    Database backup harian
    Error logging

5.4 Scalability

    Support horizontal scaling
    Database indexing untuk query optimization

5.5 Maintainability

    Clean code architecture
    RESTful API design
    Documentation (Swagger/OpenAPI)
    Version control (Git)

6. DATABASE SCHEMA
6.1 Tables

-- Users
users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nama_lengkap VARCHAR(150) NOT NULL,
    role ENUM('admin', 'operator') NOT NULL DEFAULT 'operator',
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)

-- Aktivitas
aktivitas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    judul VARCHAR(200) NOT NULL,
    tanggal DATE NOT NULL,
    gambar VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)

-- Produk
produk (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nama_produk VARCHAR(150) NOT NULL,
    gambar VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    link_wa VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)

-- Paket Edukasi
paket_edukasi (
    id INT PRIMARY KEY AUTO_INCREMENT,
    judul VARCHAR(200) NOT NULL,
    deskripsi_singkat TEXT,
    deskripsi_lengkap LONGTEXT,
    harga DECIMAL(10,2) NOT NULL,
    durasi VARCHAR(100),
    fasilitas TEXT,
    gambar VARCHAR(255) NOT NULL,
    link_wa VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)

-- Berita
berita (
    id INT PRIMARY KEY AUTO_INCREMENT,
    judul VARCHAR(250) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    isi_konten LONGTEXT,
    tanggal_publish DATE NOT NULL,
    gambar VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)

6.2 Indexes

-- Index untuk optimasi query
CREATE INDEX idx_aktivitas_tanggal ON aktivitas(tanggal DESC);
CREATE INDEX idx_berita_slug ON berita(slug);
CREATE INDEX idx_berita_tanggal ON berita(tanggal_publish DESC);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

7. API ENDPOINTS
7.1 Authentication

POST   /api/auth/login          - Login
POST   /api/auth/logout         - Logout
GET    /api/auth/me             - Get current user

7.2 Aktivitas

GET    /api/aktivitas           - List aktivitas
GET    /api/aktivitas/:id       - Get detail
POST   /api/aktivitas           - Create
PUT    /api/aktivitas/:id       - Update
DELETE /api/aktivitas/:id       - Delete

7.3 Produk

GET    /api/produk              - List produk
GET    /api/produk/:id          - Get detail
POST   /api/produk              - Create
PUT    /api/produk/:id          - Update
DELETE /api/produk/:id          - Delete

7.4 Paket Edukasi

GET    /api/paket-edukasi       - List paket
GET    /api/paket-edukasi/:id   - Get detail
POST   /api/paket-edukasi       - Create
PUT    /api/paket-edukasi/:id   - Update
DELETE /api/paket-edukasi/:id   - Delete

7.5 Berita

GET    /api/berita              - List berita
GET    /api/berita/:slug        - Get detail by slug
POST   /api/berita              - Create
PUT    /api/berita/:id          - Update
DELETE /api/berita/:id          - Delete

7.6 Users (Admin Only)

GET    /api/users               - List users
GET    /api/users/:id           - Get detail
POST   /api/users               - Create
PUT    /api/users/:id           - Update
DELETE /api/users/:id           - Delete

7.7 File Upload

POST   /api/upload              - Upload image/file

8. TECHNICAL SPECIFICATIONS
8.1 Tech Stack
Backend:

    Runtime: Node.js
    Framework: Express.js
    Database: MySQL 8.0+
    ORM: Sequelize
    Authentication: JWT (JSON Web Token)
    File Upload: Multer
    Validation: Joi/express-validator

Storage:

    Images: Local storage
    Max file size: 5MB
    Allowed formats: JPG, PNG, WebP

Server:

    Web Server: Nginx
    Environment: Production/Staging/Development

8.2 API Response Format
Success Response:

{
    "success": true,
    "message": "Operation successful",
    "data": {
        // Data object/array
    },
    "meta": {
        "page": 1,
        "limit": 10,
        "total": 50
    }
}

Error Response:

{
    "success": true,
    "message": "Operation successful",
    "data": {
        // Data object/array
    },
    "meta": {
        "page": 1,
        "limit": 10,
        "total": 50
    }
}

8.3 HTTP Status Codes

    200: OK (success)
    201: Created (success create)
    400: Bad Request (validation error)
    401: Unauthorized (not logged in)
    403: Forbidden (insufficient permissions)
    404: Not Found
    500: Internal Server Error

9. SECURITY REQUIREMENTS
9.1 Authentication

    JWT token dengan expiry 24 jam
    Refresh token mechanism (optional)
    Password hashing bcrypt (10 rounds)
    Minimum password length: 8 characters

9.2 Authorization

    Role-based access control (RBAC)
    Middleware untuk proteksi route
    Admin-only routes untuk user management

9.3 Data Protection

    Input sanitization
    SQL injection prevention (prepared statements)
    XSS protection
    CORS configuration
    Rate limiting (optional)

9.4 File Upload Security

    File type validation (whitelist)
    File size limit (5MB)
    Rename file dengan unique name
    Scan malware (optional)

10. DEPLOYMENT & INFRASTRUCTURE
10.1 Environment

1

10.2 Server Requirements

    CPU: 2 cores minimum
    RAM: 2GB minimum
    Storage: 10GB+
    OS: Linux (Ubuntu 20.04+)

10.3 Database

    MySQL 8.0+
    Charset: utf8mb4
    Collation: utf8mb4_unicode_ci

10.4 Backup Strategy

    Database backup: Daily (automated)
    File backup: Weekly
    Retention: 30 days

11. TESTING REQUIREMENTS
11.1 Testing Types

    Unit Testing (controllers, models, services)
    Integration Testing (API endpoints)
    Authentication & Authorization Testing
    File Upload Testing
    Validation Testing

11.2 Test Coverage

    Minimum 70% code coverage
    Critical paths: 100% coverage

12. DOCUMENTATION
12.1 API Documentation

    Swagger/OpenAPI specification
    Postman collection
    Endpoint examples

12.2 Code Documentation

    README.md (setup & installation)
    Environment variables documentation
    Database migration guide

13. TIMELINE & MILESTONES
Phase 1: Setup & Core (Week 1)

    Project setup
    Database design
    Authentication module
    User management

Phase 2: Content Modules (Week 2-3)

    Aktivitas CRUD
    Produk CRUD
    Paket Edukasi CRUD
    Berita CRUD

Phase 3: File Management (Week 3)

    Image upload
    File storage
    Image optimization

Phase 4: Testing & Deployment (Week 4)

    Testing
    Bug fixing
    Deployment
    Documentation

14. ACCEPTANCE CRITERIA
14.1 Functional

    ✅ Semua CRUD operations berfungsi
    ✅ Authentication & authorization berjalan
    ✅ File upload berfungsi
    ✅ API response sesuai spesifikasi
    ✅ Error handling yang baik

14.2 Performance

    ✅ API response < 500ms
    ✅ Handle 100+ concurrent users
    ✅ Image optimization

14.3 Security

    ✅ JWT authentication
    ✅ Password hashing
    ✅ Input validation
    ✅ SQL injection prevention

14.4 Quality

    ✅ Code coverage > 70%
    ✅ No critical bugs
    ✅ Documentation complete

15. ASSUMPTIONS & CONSTRAINTS
Assumptions

    Admin memiliki basic computer literacy
    Internet connection stabil
    Server hosting tersedia
    Domain & SSL tersedia

Constraints

    Budget terbatas (open source tools)
    Timeline 4 minggu
    Single developer (atau tim kecil)
    No mobile app (web only)

16. RISKS & MITIGATION
Risk
	
Impact
	
Mitigation
Server down
	
High
	
Backup server, monitoring
Data loss
	
High
	
Regular backup
Security breach
	
High
	
Security best practices
Scope creep
	
Medium
	
Clear requirements
Timeline delay
	
Medium
	
Agile development
17. APPENDICES
17.1 Color Palette

    Primary Dark: #1D2A62 (Delft Blue)
    Secondary Blue: #87AECE (Carolina Blue)
    Background: #F5F3D8 (Beige)
    Accent Light: #AFD06E (Pistachio)
    Accent Dark: #437118 (Fern Green)

17.2 Contact Information

    Location: Siroto, Gunungpati, Semarang
    WhatsApp: +62-8156-3922-5
    Email: admin@studycenteredumina.com
    Instagram: @studycenterEdumina

Document Version: 1.0
Last Updated: 2026-07-13
Prepared By: Development Team
Status: Approved ✅