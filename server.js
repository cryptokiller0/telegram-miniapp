const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Bot con token dalle variabili Railway
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Serve la mini-app dalla cartella "public"
app.use(express.static(path.join(__dirname, "public")));

// Comando /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(
    chatId,
`Benvenuto dai Ragazzi Di Quartiere In Montagna 🏔️

📱 Come usare la nostra mini-app

All’interno della mini-app potrai trovare:

• 🎥 Video dimostrativi dei prodotti, utili per vederli da vicino e capirne le caratteristiche.
• 💰 Prezzi sempre aggiornati e facilmente consultabili.
• 📄 Schede tecniche dettagliate per aiutarti a scegliere in modo informato.

Per iniziare è sufficiente aprire la mini-app dal bottone qui sotto 👇

Scelto il prodotto scrivici in pvt:
@Nelquartiere
@fromthestreetstothestars`,
    {
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

app.listen(PORT, () => {
  console.log("Server avviato sulla porta " + PORT);
});
