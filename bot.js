const TelegramBot = require('node-telegram-bot-api');
const admin = require('firebase-admin');

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_URL 
});
const db = admin.database();

const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, {polling: true});

// Envia un botón grande que reemplaza el teclado
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Sistema de control activo.", {
    reply_markup: {
      keyboard: [[{ text: "🔊 ¡REPRODUCIR SONIDO!" }]],
      resize_keyboard: true,
      one_time_keyboard: false
    }
  });
});

// Detectar cuando presionas el botón del teclado
bot.on('message', (msg) => {
  if (msg.text === "🔊 ¡REPRODUCIR SONIDO!") {
    db.ref('comando').set({
      accion: 'reproducir',
      timestamp: Date.now() 
    }).then(() => {
      bot.sendMessage(msg.chat.id, "✅ Señal enviada.");
    });
  }
});
