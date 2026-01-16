const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 1. Koneksi Database MySQL
const sequelize = new Sequelize("cinetrack_db", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

// 2. Definisi Model User
const User = sequelize.define("User", {
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
});

// Sinkronisasi Database
sequelize.sync().then(() => console.log("Database & Tables Created!"));

// 3. Endpoint Register
app.post("/api/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });
    res.status(201).json({ message: "User Registered", userId: user.id });
  } catch (error) {
    res.status(400).json({ error: "Username sudah digunakan" });
  }
});

// 4. Endpoint Login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      success: true,
      message: "Login Berhasil",
      userId: user.id,
      username: user.username,
    });
  } else {
    res
      .status(401)
      .json({ success: false, message: "Username atau Password salah" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
