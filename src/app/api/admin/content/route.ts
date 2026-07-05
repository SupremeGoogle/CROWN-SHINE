import { NextRequest, NextResponse } from "next/server";
import { getSiteContent, saveSiteContent } from "@/lib/content";
import { siteContentSchema } from "@/lib/content-schema";

export async function GET() {
  const content = await getSiteContent();
  return NextResponse.json({ content });
}

export async function PUT(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = siteContentSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    const where = first?.path.length ? first.path.join(" → ") : "";
    return NextResponse.json(
      {
        error: where
          ? `Please check "${where}" — ${first.message}`
          : "Validation failed. Please check your fields.",
        issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
      },
      { status: 400 }
    );
  }

  try {
    await saveSiteContent(parsed.data, "content: update via admin panel");
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to save content" },
      { status: 500 }
    );
  }
}
