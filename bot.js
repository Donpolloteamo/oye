const TelegramBot = require('node-telegram-bot-api');
const admin = require('firebase-admin');
const http = require('http'); // Necesario para el plan gratis

// --- 1. ENGAÑO PARA RENDER (SERVIDOR WEB MINIMO) ---
const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Bot vivo\n');
});
server.listen(process.env.PORT || 10000); // Render usa el puerto 10000 por defecto

// --- 2. CONFIGURACIÓN DE FIREBASE ---
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
        databaseURL: process.env.FIREBASE_URL
    });
}
const db = admin.database();

// --- 3. CONFIGURACIÓN DEL BOT ---
const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, {polling: true});

console.log("Bot listo en modo Web Service Gratis.");

bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    if (msg.text === "🔊 ACTIVAR SONIDO") {
        db.ref('comando').set({
            accion: 'reproducir',
            timestamp: Date.now()
        }).then(() => {
            bot.sendMessage(chatId, "✅ Señal enviada.");
        });
    } else {
        bot.sendMessage(chatId, "Panel de control:", {
            reply_markup: {
                keyboard: [[{ text: "🔊 ACTIVAR SONIDO" }]],
                resize_keyboard: true
            }
        });
    }
});
