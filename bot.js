const TelegramBot = require('node-telegram-bot-api');
const admin = require('firebase-admin');
const http = require('http');

// Engaño para Render (Plan Gratis)
http.createServer((req, res) => { res.end('Bot Vivo'); }).listen(process.env.PORT || 10000);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
        databaseURL: process.env.FIREBASE_URL
    });
}
const db = admin.database();
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {polling: true});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const t = msg.text;

    // Lista de sonidos válidos
    const listaSonidos = {
        "🕺 MAMBO": "mambo",
        "🔊 Sonido 1": "sonido1",
        "🔊 Sonido 2": "sonido2",
        "🔊 Sonido 3": "sonido3",
        "🔊 Sonido 4": "sonido4",
        "🔊 Sonido 5": "sonido5"
    };

    if (listaSonidos[t]) {
        db.ref('comando').set({
            archivo: listaSonidos[t],
            timestamp: Date.now()
        }).then(() => {
            bot.sendMessage(chatId, `✅ Reproduciendo: ${t}`);
        });
    } else {
        bot.sendMessage(chatId, "Elige un sonido del panel:", {
            reply_markup: {
                keyboard: [
                    [{ text: "🕺 MAMBO" }],
                    [{ text: "🔊 Sonido 1" }, { text: "🔊 Sonido 2" }],
                    [{ text: "🔊 Sonido 3" }, { text: "🔊 Sonido 4" }],
                    [{ text: "🔊 Sonido 5" }]
                ],
                resize_keyboard: true
            }
        });
    }
});
