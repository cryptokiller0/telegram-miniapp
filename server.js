const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

