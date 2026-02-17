const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const crypto = require("crypto");
const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const path = require("path");

const app = express();
app.use(helmet());
app.disable("x-powered-by");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Bot con token dalle variabili Railway
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Serve la mini-app dalla cartella "public"
app.use((req, res, next) => {
  const ua = req.headers["user-agent"] || "";

  if (!ua.includes("Telegram")) {
    console.log("Accesso bloccato:", req.ip);
    return res.status(403).send("Accesso negato");
  }

  next();
});

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

app.post("/auth", (req, res) => {
  const { initData } = req.body;

  if (!initData) {
    return res.status(400).send("No initData");
  }

  const botToken = process.env.BOT_TOKEN;

  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(botToken)
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
    console.log("Firma Telegram non valida:", req.ip);
    return res.status(403).send("Invalid signature");
  }

  res.status(200).send("Authorized");
});

app.listen(PORT, () => {
  console.log("Server avviato sulla porta " + PORT);
});
