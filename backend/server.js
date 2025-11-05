// server.js
const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// Configuración de CORS más específica
app.use(cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500'], // Agrega aquí tu origen del frontend
    methods: ['GET', 'POST', 'DELETE'],
    credentials: true
}));

app.use(express.json());

// Productos simulados (igual que en tu codigo.js)
let productos = [
  { id: 1, nombre: "Mochila guajira Valle", precio: 450000, imagen: "imagenes/2.webp", categoria: "Bisutería y accesorios" },
  { id: 2, nombre: "Mochila guajira Agua", precio: 145000, imagen: "imagenes/3.jpg", categoria: "Bisutería y accesorios" },
  { id: 3, nombre: "Mochila guajira Dule", precio: 700000, imagen: "imagenes/4.jpg", categoria: "Bisutería y accesorios" },
  // Agrega el resto de tus productos...
];

// Carrito simulado
let carrito = [];

// Endpoints
// 1️⃣ Obtener productos
app.get("/api/productos", (req, res) => {
  res.json(productos);
});

// 2️⃣ Obtener carrito
app.get("/api/carrito", (req, res) => {
  res.json(carrito);
});

// 3️⃣ Agregar al carrito
app.post("/api/carrito", (req, res) => {
  const { id } = req.body;
  const producto = productos.find(p => p.id === id);
  if (!producto) return res.status(404).json({ error: "Producto no encontrado" });

  carrito.push(producto);
  res.json({ mensaje: "Producto agregado al carrito", carrito });
});

// 4️⃣ Vaciar carrito
app.delete("/api/carrito", (req, res) => {
  carrito = [];
  res.json({ mensaje: "Carrito vaciado" });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal!' });
});

// Iniciar servidor
app.listen(port, '0.0.0.0', () => {
    console.log(`Backend simulado corriendo en http://localhost:${port}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`El puerto ${port} está en uso. Intenta con otro puerto.`);
    } else {
        console.error('Error al iniciar el servidor:', err);
    }
});
