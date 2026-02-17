const express = require("express");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
const PORT = process.env.PORT || 3000;

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

app.get("/", (req, res) => {
  res.send("Server attivo");
});

// Quando l'utente scrive /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "Benvenuto nel Catalogo 🔥", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Apri Catalogo",
            web_app: {
              url: "https://telegram-miniapp-production-4431.up.railway.app"
            }
          }
        ]
      ]
    }
  });
});

app.listen(PORT, () => {
  console.log("Server avviato");
});
