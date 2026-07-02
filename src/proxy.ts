import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE_NAME = "cs_session";

async function getSessionSecretKey(): Promise<Uint8Array | null> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  // Тот же вывод ключа, что и в src/lib/auth.ts.
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`cs_session:${password}`)
  );
  return new Uint8Array(digest);
}

async function isValidSession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const key = await getSessionSecretKey();
  if (!key) return false;
  try {
    const { payload } = await jwtVerify(token, key);
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedPage =
    (pathname.startsWith("/admin") && pathname !== "/admin/login") ||
    pathname.startsWith("/crm");
  const isProtectedApi = pathname.startsWith("/api/admin");

  if (!isProtectedPage && !isProtectedApi) return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const valid = await isValidSession(token);

  if (!valid) {
    if (isProtectedApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/crm/:path*", "/api/admin/:path*"],
};
