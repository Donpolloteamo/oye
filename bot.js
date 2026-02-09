const TelegramBot = require('node-telegram-bot-api');
const admin = require('firebase-admin');

// --- CONFIGURACIÓN DE FIREBASE ---
// En JustRunMy.App, deberás pegar el contenido de tu JSON de Firebase en una variable llamada FIREBASE_SERVICE_ACCOUNT
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_URL 
});

const db = admin.database();

// --- CONFIGURACIÓN DEL BOT ---
const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, {polling: true});

console.log("Bot encendido y esperando mensajes...");

// Responder al comando /start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "¡Hola! Usa /play para que el teléfono suene.");
});

// Al recibir /play, actualizamos Firebase
bot.onText(/\/play/, (msg) => {
  const chatId = msg.chat.id;
  
  db.ref('comando').set({
    accion: 'reproducir',
    timestamp: Date.now() // Usamos el tiempo para que la web detecte un cambio real siempre
  })
  .then(() => {
    bot.sendMessage(chatId, "✅ Señal enviada. ¡El teléfono debería estar sonando!");
  })
  .catch((error) => {
    bot.sendMessage(chatId, "❌ Error al conectar con Firebase.");
    console.error(error);
  });
});