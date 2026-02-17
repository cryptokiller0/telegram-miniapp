const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

/* =========================
   SICUREZZA BASE
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
   FILE STATICI MINI-APP
========================= */

app.use(express.static(path.join(__dirname, "public")));

/* =========================
   BOT TELEGRAM (WEBHOOK MODE STABILE)
========================= */

if (!process.env.BOT_TOKEN) {
  console.error("BOT_TOKEN non definito nelle variabili Railway!");
  process.exit(1);
}

const bot = new TelegramBot(process.env.BOT_TOKEN);

const BASE_URL = "https://telegram-miniapp-production-4431.up.railway.app";
const WEBHOOK_PATH = `/bot${process.env.BOT_TOKEN}`;
const WEBHOOK_URL = `${BASE_URL}${WEBHOOK_PATH}`;

// Endpoint webhook
app.post(WEBHOOK_PATH, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

/* =========================
   COMANDO /start (ORIGINALE)
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
   VERIFICA FIRMA TELEGRAM WEBAPP
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

app.listen(PORT, async () => {
  console.log("Server avviato sulla porta " + PORT);

  try {
    await bot.setWebHook(WEBHOOK_URL);
    console.log("Webhook impostato correttamente:", WEBHOOK_URL);
  } catch (err) {
    console.error("Errore impostazione webhook:", err.message);
  }
});
