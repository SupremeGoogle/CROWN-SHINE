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
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
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
