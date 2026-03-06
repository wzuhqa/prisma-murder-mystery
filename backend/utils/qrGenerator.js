const QRCode = require('qrcode');

/**
 * Generates a QR code as a Base64-encoded PNG data URL.
 * The QR content is a JSON string with ticketId and eventId
 * for scanning at the event entrance.
 *
 * @param {string} ticketId  - Unique ticket identifier (UUID)
 * @param {string} eventId   - MongoDB Event _id (for cross-referencing)
 * @returns {Promise<string>} - Base64 PNG data URL e.g. "data:image/png;base64,..."
 */
const generateQRCode = async (ticketId, eventId) => {
    const payload = JSON.stringify({
        ticketId,
        eventId,
        issuer: 'Prisma Murder Mystery',
        issuedAt: new Date().toISOString()
    });

    const options = {
        errorCorrectionLevel: 'H', // Highest redundancy — readable even if partially damaged
        type: 'image/png',
        quality: 0.92,
        margin: 2,
        color: {
            dark: '#1a0a0a',  // Near-black for the dark squares
            light: '#f5f0eb'  // Off-white background
        },
        width: 300
    };

    const dataUrl = await QRCode.toDataURL(payload, options);
    return dataUrl;
};

module.exports = { generateQRCode };
