const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Serve file statici (mini-app)
app.use(express.static(path.join(__dirname)));

// Quando si apre il dominio principale
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Comando /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(
    chatId,
    `Benvenuto dai Ragazzi Di Quartiere In Montagna 🏔️

📱 *Come usare la nostra mini-app*

All’interno della mini-app potrai trovare:

• 🎥 Video dimostrativi dei prodotti.
• 💰 Prezzi sempre aggiornati.
• 📄 Schede tecniche dettagliate.

Per iniziare apri la mini-app dal bottone qui sotto 👇

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

app.listen(PORT, () => {
  console.log("Server avviato");
});
