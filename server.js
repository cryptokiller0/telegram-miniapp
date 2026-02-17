const express = require("express");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
const PORT = process.env.PORT || 3000;

// Usa il token dalle variabili Railway
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Route base per Railway
app.get("/", (req, res) => {
  res.send("Bot attivo 🚀");
});

// Comando /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(
    chatId,
    `Benvenuto dai Ragazzi Di Quartiere In Montagna 🏔️

📱 *Come usare la nostra mini-app*

All’interno della mini-app potrai trovare:

• 🎥 Video dimostrativi dei prodotti, utili per vederli da vicino e capirne le caratteristiche.
• 💰 Prezzi sempre aggiornati e facilmente consultabili.
• 📄 Schede tecniche dettagliate per aiutarti a scegliere in modo informato.

Per iniziare è sufficiente aprire la mini-app dal bottone qui sotto 👇

Scelto il prodotto scrivici in pvt:
@Nelquartiere
@fromthestreetstothestars`,
    {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🛒 Apri Mini-App",
              web_app: {
                url: "https://telegram-miniapp-production-4431.up.railway.app"
              }
            }
          ]
        ]
      }
    }
  );
});

// Avvio server
app.listen(PORT, () => {
  console.log("Server avviato sulla porta " + PORT);
});
