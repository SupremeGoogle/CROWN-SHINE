import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface TelegramUpdate {
  message?: {
    text?: string;
    chat: { id: number };
    from?: { username?: string; first_name?: string };
  };
}

async function sendMessage(token: string, chatId: number, text: string) {
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  }).catch(() => {});
}

export async function POST(request: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const adminCommand = (process.env.TELEGRAM_ADMIN_COMMAND || "/crownshine").toLowerCase();

  if (!token) {
    return NextResponse.json({ ok: true });
  }

  let update: TelegramUpdate;
  try {
    update = await request.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  const message = update.message;
  const text = message?.text?.trim().toLowerCase();
  const chatId = message?.chat.id;

  if (!chatId || !text) {
    return NextResponse.json({ ok: true });
  }

  if (text === adminCommand) {
    await prisma.telegramAdmin.upsert({
      where: { chatId: String(chatId) },
      update: { active: true, username: message?.from?.username, firstName: message?.from?.first_name },
      create: {
        chatId: String(chatId),
        username: message?.from?.username,
        firstName: message?.from?.first_name,
        active: true,
      },
    });
    await sendMessage(
      token,
      chatId,
      "👑 You're now subscribed to Crown Shine booking notifications. Send /stop to unsubscribe."
    );
  } else if (text === "/stop") {
    await prisma.telegramAdmin
      .update({ where: { chatId: String(chatId) }, data: { active: false } })
      .catch(() => {});
    await sendMessage(token, chatId, "You've been unsubscribed from booking notifications.");
  }

  return NextResponse.json({ ok: true });
}
