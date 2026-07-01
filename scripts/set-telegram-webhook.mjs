#!/usr/bin/env node
// Регистрирует вебхук Telegram-бота на указанный публичный URL сайта.
// Запуск: node scripts/set-telegram-webhook.mjs https://your-domain.vercel.app
//
// Использует TELEGRAM_BOT_TOKEN и TELEGRAM_WEBHOOK_SECRET из .env / .env.local

import { config } from "dotenv";
config({ path: ".env.local" });
config();

const siteUrl = process.argv[2] || process.env.NEXT_PUBLIC_SITE_URL;
const token = process.env.TELEGRAM_BOT_TOKEN;
const secret = process.env.TELEGRAM_WEBHOOK_SECRET;

if (!siteUrl || !token) {
  console.error(
    "Usage: node scripts/set-telegram-webhook.mjs <site-url>\n" +
      "Requires TELEGRAM_BOT_TOKEN in .env / .env.local"
  );
  process.exit(1);
}

const webhookUrl = `${siteUrl.replace(/\/$/, "")}/api/telegram/webhook`;

const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    url: webhookUrl,
    secret_token: secret || undefined,
  }),
});

const data = await res.json();
console.log(JSON.stringify(data, null, 2));

if (!data.ok) {
  process.exit(1);
}

console.log(`\nWebhook set to: ${webhookUrl}`);
