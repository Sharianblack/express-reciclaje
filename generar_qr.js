const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const payload = JSON.stringify({
  id_estacion: "PUNTO-QUITO-01",
  material: "plastico"
});

async function generate() {
  const pngPath = path.join(__dirname, 'qr_reciclaje.png');
  const htmlPath = path.join(__dirname, 'qr_reciclaje.html');

  await QRCode.toFile(pngPath, payload, {
    width: 400,
    margin: 2
  });

  const svg = await QRCode.toString(payload, { type: 'svg' });
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Código QR Estático - Reciclaje</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: #f0fdf4;
    }
    .card {
      background: white;
      padding: 40px;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      text-align: center;
      max-width: 450px;
    }
    h1 { color: #15803d; font-size: 24px; margin-top: 0; }
    p { color: #4b5563; font-size: 16px; margin-bottom: 20px; }
    .qr-box {
      display: inline-block;
      padding: 15px;
      background: white;
      border: 3px solid #22c55e;
      border-radius: 16px;
    }
    svg { width: 300px; height: 300px; display: block; }
    pre {
      background: #f1f5f9;
      padding: 12px;
      border-radius: 8px;
      font-size: 13px;
      color: #0f172a;
      overflow-x: auto;
      text-align: left;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>♻️ Punto de Reciclaje</h1>
    <p>Escanea este código QR desde tu app Flutter o la cámara de tu celular:</p>
    <div class="qr-box">
      ${svg}
    </div>
    <p style="margin-top: 20px; margin-bottom: 5px; font-weight: bold;">Contenido embebido:</p>
    <pre>${payload}</pre>
  </div>
</body>
</html>`;

  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log('Archivos generados exitosamente en:', __dirname);
}

generate().catch(console.error);
