const QRCode = require('qrcode');

// Esta función toma un texto y devuelve la imagen del QR en formato base64 (texto legible por el HTML)
async function crearQR(texto) {
    try {
        const imagenQR = await QRCode.toDataURL(texto);
        return imagenQR;
    } catch (error) {
        console.error("Error al generar el QR:", error);
        return null;
    }
}

module.exports = { crearQR };