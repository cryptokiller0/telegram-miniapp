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

// Helmet meno aggressivo (evita blocchi script interni)
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.disable("x-powered-by");

// Rate limit SOLO su endpoint sensibili
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(express.json());

/* =========================
   FILE STATICI
========================= */

app.use(express.static(path.join(__dirname, "public")));

/* =========================
   BOT (NO AUTO WEBHOOK)
========================= */

if (!process.env.BOT_TOKEN) {
  console.error("BOT_TOKEN mancante");
  process.exit(1);
}

if (!process.env.BASE_URL) {
  console.error("BASE_URL mancante");
  process.exit(1);
}

const bot = new TelegramBot(process.env.BOT_TOKEN);

/* =========================
   WEBHOOK ENDPOINT
========================= */

const WEBHOOK_PATH = `/bot${process.env.BOT_TOKEN}`;

app.post(WEBHOOK_PATH, (req, res) => {
  try {
    bot.processUpdate(req.body);
  } catch (err) {
    console.error("Errore processUpdate:", err.message);
  }
  res.sendStatus(200);
});

/* =========================
   COMANDO /start
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
                url: process.env.BASE_URL
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

// Applico rate limit SOLO qui
app.post("/auth", limiter, (req, res) => {
  const { initData } = req.body;
  if (!initData) return res.status(400).send("No initData");

  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(process.env.BOT_TOKEN)
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
});

/* =========================
   START SERVER
========================= */

app.listen(PORT, () => {
  console.log("Server avviato sulla porta " + PORT);
});
