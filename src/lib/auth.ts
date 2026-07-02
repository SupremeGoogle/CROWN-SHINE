import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { timingSafeEqual } from "crypto";

export const SESSION_COOKIE_NAME = "cs_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 дней

async function getSessionSecretKey(): Promise<Uint8Array> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error("ADMIN_PASSWORD не задан в переменных окружения");
  }
  // Ключ подписи JWT выводим из пароля админки, чтобы не заводить
  // отдельную переменную окружения. SHA-256 даёт стабильные 32 байта.
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`cs_session:${password}`)
  );
  return new Uint8Array(digest);
}

export function verifyAdminPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;

  const candidateBuf = Buffer.from(candidate);
  const expectedBuf = Buffer.from(expected);
  if (candidateBuf.length !== expectedBuf.length) return false;

  return timingSafeEqual(candidateBuf, expectedBuf);
}

export async function createSessionToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(await getSessionSecretKey());
}

export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, await getSessionSecretKey());
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export const SESSION_COOKIE_MAX_AGE = SESSION_DURATION_SECONDS;
