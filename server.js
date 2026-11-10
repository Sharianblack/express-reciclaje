const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

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

app.listen(PORT, () => {
  console.log(`Servidor de reciclaje corriendo en http://localhost:${PORT}`);
});
