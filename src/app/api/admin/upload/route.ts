import { NextRequest, NextResponse } from "next/server";
import { saveUploadedImage } from "@/lib/uploads";

const MAX_BYTES = 4 * 1024 * 1024; // 4 MB (Vercel request body limit is ~4.5 MB)

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.dataUrl !== "string" || typeof body.fileName !== "string") {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(body.dataUrl);
  if (!match) {
    return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
  }

  const base64 = match[2];
  const approxBytes = Math.floor(base64.length * 0.75);
  if (approxBytes > MAX_BYTES) {
    return NextResponse.json({ error: "Image is too large (max 4 MB)." }, { status: 400 });
  }

  try {
    const url = await saveUploadedImage(body.fileName, base64);
    return NextResponse.json({ url });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Upload failed." },
      { status: 500 }
    );
  }
}
