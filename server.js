const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

/* =========================
   CONFIG
========================= */

const BOT_TOKEN = process.env.BOT_TOKEN;
const BASE_URL = process.env.BASE_URL;

if (!BOT_TOKEN) {
  console.error("BOT_TOKEN mancante");
}

if (!BASE_URL) {
  console.error("BASE_URL mancante");
}

/* =========================
   SICUREZZA
========================= */

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.disable("x-powered-by");
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

/* =========================
   FILE STATICI
========================= */

app.use(express.static(path.join(__dirname, "public")));

/* =========================
   BOT
========================= */

/* 🔥 MODIFICA QUI: aggiunto webHook: true */
const bot = new TelegramBot(BOT_TOKEN, {
  webHook: true
});

const WEBHOOK_PATH = `/bot${BOT_TOKEN}`;
const WEBHOOK_URL = `${BASE_URL}${WEBHOOK_PATH}`;

/* =========================
   WEBHOOK ENDPOINT
========================= */

app.post(WEBHOOK_PATH, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

/* =========================
   /start
========================= */

bot.on("message", (msg) => {
  if (!msg.text) return;

  if (msg.text.startsWith("/start")) {
    const chatId = msg.chat.id;

    bot.sendMessage(
      chatId,
`Benvenuto dai Ragazzi Di Quartiere In Montagna 🏔️

📱 Come usare la nostra mini-app

All’interno della mini-app potrai trovare:

• 🎥 Video dimostrativi dei prodotti.
• 💰 Prezzi sempre aggiornati.
• 📄 Schede tecniche dettagliate.

Per iniziare è sufficiente aprire la mini-app dal menu del bot.

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
                  url: BASE_URL
                }
              }
            ]
          ]
        }
      }
    );
  }
});

/* =========================
   AUTH MINIAPP
========================= */

app.post("/auth", limiter, (req, res) => {
  const { initData } = req.body;
  if (!initData) return res.status(400).send("No initData");

  try {
    const secretKey = crypto
      .createHmac("sha256", "WebAppData")
      .update(BOT_TOKEN)
      .digest();

    const parsed = new URLSearchParams(initData);
    const hash = parsed.get("hash");
    parsed.delete("hash");

    const dataCheckString = [...parsed.entries()]
      .sort()
      .map(([key, value]) => `${key}=${value}`)
      .join("\n");

    const calculatedHash = crypto
      .createHmac("sha256", secretKey)
      .update(dataCheckString)
      .digest("hex");

    if (calculatedHash !== hash) {
      return res.status(403).send("Invalid signature");
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Errore auth:", err.message);
    res.status(500).send("Auth error");
  }
});

/* =========================
   START SERVER + AUTO WEBHOOK
========================= */

app.listen(PORT, async () => {
  console.log("Server avviato sulla porta " + PORT);

  try {
    await bot.setWebHook(WEBHOOK_URL);
    console.log("Webhook impostato automaticamente:");
    console.log(WEBHOOK_URL);
  } catch (err) {
    console.error("Errore impostazione webhook:", err.message);
  }
});
