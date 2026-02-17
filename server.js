const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log("Server attivo su http://localhost:3000");
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Apri il catalogo:", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Apri Catalogo",
            web_app: { url: "http://localhost:3000" }
          }
        ]
      ]
    }
  });
});

