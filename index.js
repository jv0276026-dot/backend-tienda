const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

async function inicializarBD() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS categorias (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS productos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(150) NOT NULL,
      descripcion TEXT,
      precio DECIMAL(10,2) NOT NULL,
      stock INT DEFAULT 10,
      imagen VARCHAR(255),
      categoria_id INT
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS carritos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      usuario_id INT DEFAULT 1,
      producto_id INT,
      cantidad INT DEFAULT 1
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS compras (
      id INT AUTO_INCREMENT PRIMARY KEY,
      usuario_id INT DEFAULT 1,
      total DECIMAL(10,2) NOT NULL,
      fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const [rows] = await pool.query("SELECT COUNT(*) AS total FROM productos");
  if (rows[0].total === 0) {
    await pool.query("INSERT INTO categorias (nombre) VALUES ('Electrónica'), ('Accesorios'), ('Computación')");
    await pool.query(`
      INSERT INTO productos (nombre, descripcion, precio, stock, imagen, categoria_id) VALUES
      ('Laptop Gamer Pro', 'Laptop 16GB RAM 512GB SSD', 3500.00, 15, 'laptop.jpg', 3),
      ('Mouse Inalámbrico', 'Mouse ergonómico recargable', 85.00, 40, 'mouse.jpg', 2),
      ('Audífonos Bluetooth', 'Cancelación de ruido activa', 220.00, 25, 'audifonos.jpg', 1)
    `);
  }
}

app.get("/", (req, res) => {
  res.json({ mensaje: "API Tienda funcionando correctamente en la nube" });
});

app.get("/api/productos", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM productos");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/categorias", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM categorias");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/carritos", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM carritos");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/compras", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM compras");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;

inicializarBD()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error al conectar con MySQL:", err);
  });
