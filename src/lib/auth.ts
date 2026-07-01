import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { timingSafeEqual } from "crypto";

export const SESSION_COOKIE_NAME = "cs_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 дней

function getSessionSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET не задан в переменных окружения");
  }
  return new TextEncoder().encode(secret);
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
    .sign(getSessionSecretKey());
}

export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, getSessionSecretKey());
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export const SESSION_COOKIE_MAX_AGE = SESSION_DURATION_SECONDS;
