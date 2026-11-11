const express = require('express');
const { Pool } = require('pg');
const { crearQR } = require('./generar_qr');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'reciclaje_db',
  password: process.env.DB_PASSWORD, // Node leerá el secreto desde el .env
  port: 5432,
});

pool.connect()
  .then((client) => {
    console.log('¡Conectado a PostgreSQL con éxito!');
    client.release();
  })
  .catch((err) => console.error('Error al conectar a la base de datos:', err.stack));


  app.use(express.static('public'));

// Middleware para parsear JSON en el cuerpo de las peticiones
app.use(express.json());

// Endpoint POST /api/reciclaje/validar
app.post('/api/reciclaje/validar', (req, res) => {
  // Respuesta estática inmediata sin consultar base de datos
  res.json({
    success: true,
    puntos_ganados: 50,
    mensaje: "¡Botellas recicladas con éxito!"
  });
});

// Ruta raíz opcional para verificación rápida en el navegador
app.get('/', (req, res) => {
  res.send('Servidor de reciclaje activo. Envía una petición POST a /api/reciclaje/validar');
});

app.post('/api/registrar-reciclaje', async (req, res) => {
  const { id_ciudadano, id_acopio, tipo_material, peso_kg, puntos_ganados, codigo_qr } = req.body;

  try {
    // 1. Guardar el historial de la entrega
    await pool.query(
      'INSERT INTO entregas_reciclaje (id_ciudadano, id_acopio, tipo_material, peso_kg, puntos_ganados, codigo_qr_seguro) VALUES ($1, $2, $3, $4, $5, $6)',
      [id_ciudadano, id_acopio, tipo_material, peso_kg, puntos_ganados, codigo_qr]
    );

    // 2. Sumar los Eco-Puntos al total del ciudadano
    await pool.query(
      'UPDATE ciudadanos SET eco_puntos_acumulados = eco_puntos_acumulados + $1 WHERE id_ciudadano = $2',
      [puntos_ganados, id_ciudadano]
    );

const textoParaQR = `http://192.168.1.2:3000/recibo.html?codigo=${codigo_qr}&puntos=${puntos_ganados}&material=${encodeURIComponent(tipo_material)}`;
const imagenGenerada = await crearQR(textoParaQR);

    res.status(200).json({
      mensaje: '¡Entrega registrada y Eco-Puntos sumados con éxito!',
      qr_imagen: imagenGenerada,
    });
  } catch (error) {
    console.error('Error en la base de datos:', error);
    res.status(500).json({ error: 'Hubo un problema al registrar la transacción' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor de reciclaje corriendo en http://localhost:${PORT}`);
});
