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

app.use(helmet());
app.disable("x-powered-by");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);
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

• 🎥 Video dimostrativi
• 💰 Prezzi aggiornati
• 📄 Schede tecniche dettagliate

Premi il bottone qui sotto 👇`,
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

app.post("/auth", (req, res) => {
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
