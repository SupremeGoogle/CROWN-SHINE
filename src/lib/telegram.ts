import "server-only";
import { prisma } from "@/lib/prisma";
import type { Booking } from "@prisma/client";

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function formatBookingMessage(booking: Booking): string {
  const car = `${booking.carYear ? booking.carYear + " " : ""}${booking.carMake} ${booking.carModel}`;
  const lines = [
    "👑 <b>New Crown Shine Booking</b>",
    "",
    `<b>Service:</b> ${escapeHtml(booking.serviceName)}`,
    `<b>Vehicle:</b> ${escapeHtml(car)}`,
    `<b>Date/Time:</b> ${new Date(booking.preferredDate).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })} at ${escapeHtml(booking.preferredTime)}`,
    "",
    `<b>Customer:</b> ${escapeHtml(booking.customerName)}`,
    `<b>Phone:</b> ${escapeHtml(booking.phone)}`,
    `<b>Email:</b> ${escapeHtml(booking.email || "—")}`,
    `<b>Address:</b> ${escapeHtml(booking.address)}, ${escapeHtml(booking.city)}`,
  ];
  if (booking.notes) {
    lines.push("", `<b>Notes:</b> ${escapeHtml(booking.notes)}`);
  }
  return lines.join("\n");
}

export async function notifyTelegramAdmins(booking: Booking): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;

  const admins = await prisma.telegramAdmin.findMany({ where: { active: true } });
  if (admins.length === 0) return;

  const text = formatBookingMessage(booking);

  await Promise.all(
    admins.map((admin) =>
      fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: admin.chatId,
          text,
          parse_mode: "HTML",
        }),
      }).catch(() => {
        // не роняем запрос бронирования из-за сбоя одного уведомления
      })
    )
  );
}
