const TelegramBot = require('node-telegram-bot-api');
const admin = require('firebase-admin');

// --- CONFIGURACIÓN DE FIREBASE ---
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_URL 
});
const db = admin.database();

// --- CONFIGURACIÓN DEL BOT ---
const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, {polling: true});

console.log("Bot listo. Control por teclado activado.");

// Escuchar cualquier mensaje para mostrar el botón
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  if (msg.text === "🔊 ACTIVAR SONIDO") {
    db.ref('comando').set({
      accion: 'reproducir',
      timestamp: Date.now() 
    })
    .then(() => {
      // Respondemos con un mensaje corto para no llenar el chat
      bot.sendMessage(chatId, "✅ ¡Sonando!");
    })
    .catch(() => {
      bot.sendMessage(chatId, "❌ Error de conexión.");
    });
  } 
  else {
    // Esto crea el botón "piola" en el teclado
    bot.sendMessage(chatId, "Panel de Control:", {
      reply_markup: {
        keyboard: [
          [{ text: "🔊 ACTIVAR SONIDO" }]
        ],
        resize_keyboard: true, // Hace que el botón tenga un tamaño elegante
        one_time_keyboard: false // Mantiene el botón siempre visible
      }
    });
  }
});
