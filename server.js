const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

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

// Rate limit solo su endpoint sensibili
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

/* =========================
   FILE STATICI
========================= */

app.use(express.static(path.join(__dirname, "public")));

/* =========================
   BOT CONFIG
========================= */

const BOT_TOKEN = process.env.BOT_TOKEN;
const BASE_URL = process.env.BASE_URL;

if (!BOT_TOKEN) {
  console.error("BOT_TOKEN mancante");
}

const bot = new TelegramBot(BOT_TOKEN);

const WEBHOOK_PATH = `/bot${BOT_TOKEN}`;

/* =========================
   WEBHOOK
========================= */

app.post(WEBHOOK_PATH, (req, res) => {
  try {
    bot.processUpdate(req.body);
  } catch (err) {
    console.error("Errore processUpdate:", err.message);
  }
  res.sendStatus(200);
});

/* =========================
   /start
========================= */

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
   START SERVER
========================= */

app.listen(PORT, () => {
  console.log("Server avviato sulla porta " + PORT);
});
