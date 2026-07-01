import { NextRequest, NextResponse } from "next/server";

export const revalidate = 86400;

interface NhtsaModelResult {
  Model_Name: string;
}

export async function GET(request: NextRequest) {
  const make = request.nextUrl.searchParams.get("make")?.trim();
  if (!make) {
    return NextResponse.json({ models: [], error: "Missing make" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${encodeURIComponent(
        make
      )}?format=json`,
      { next: { revalidate: 86400 } }
    );
    const data = await res.json();

    const modelsSet = new Set<string>();
    for (const item of (data.Results ?? []) as NhtsaModelResult[]) {
      if (item.Model_Name) modelsSet.add(item.Model_Name.trim());
    }

    const models = Array.from(modelsSet).sort((a, b) => a.localeCompare(b));
    return NextResponse.json({ models });
  } catch {
    return NextResponse.json(
      { models: [], error: "Failed to load vehicle models" },
      { status: 502 }
    );
  }
}
