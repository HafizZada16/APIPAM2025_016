# CineTrack API - Backend Service

Service backend untuk mendukung autentikasi user pada aplikasi CineTrack, dibangun menggunakan Node.js dan MySQL.

## 🚀 Fitur API
* **POST /api/register**: Mendaftarkan akun user baru ke database.
* **POST /api/login**: Validasi akun user untuk masuk ke aplikasi.

## 🛠️ Tech Stack
* **Runtime**: Node.js
* **Framework**: Express.js
* **Database**: MySQL
* **ORM**: Sequelize

## ⚙️ Persiapan & Instalasi
1. Buat database di MySQL dengan nama `cinetrack_pam_db`.
2. Jalankan perintah `npm install`.
3. Buat file `.env` di root folder dengan isi:
   ```env
   DB_HOST=127.0.0.1
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=cinetrack_pam_db
   DB_PORT=3308
