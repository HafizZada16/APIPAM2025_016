require("dotenv").config();
const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 1. Koneksi Database menggunakan data dari .env
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3308,
    dialect: "mysql",
  }
);

// 2. Model User (Sesuai minatmu di MySQL & Sequelize)
const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Sinkronisasi Tabel
sequelize
  .sync()
  .then(() => console.log("Database synced successfully"))
  .catch((err) => console.error("Database sync failed:", err));

// 3. Endpoint Register (REQ: User baru bisa daftar)
app.post("/api/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      password: hashedPassword,
    });
    res.status(201).json({
      success: true,
      message: "Registrasi berhasil",
      userId: user.id,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Username sudah terdaftar",
    });
  }
});

// 4. Endpoint Login (REQ: User bisa masuk aplikasi)
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        success: true,
        message: "Login berhasil",
        userId: user.id,
        username: user.username,
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Username atau password salah",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Backend berjalan di http://localhost:${PORT}`);
});
