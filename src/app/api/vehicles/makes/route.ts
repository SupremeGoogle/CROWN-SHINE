import { NextResponse } from "next/server";
import { toTitleCase } from "@/lib/vehicles";

export const revalidate = 86400; // марки машин меняются редко — кэш на сутки

const VEHICLE_TYPES = ["car", "multipurpose passenger vehicle (mpv)", "truck"];

interface NhtsaMakeResult {
  MakeName: string;
}

export async function GET() {
  try {
    const responses = await Promise.all(
      VEHICLE_TYPES.map((type) =>
        fetch(
          `https://vpic.nhtsa.dot.gov/api/vehicles/getmakesforvehicletype/${encodeURIComponent(
            type
          )}?format=json`,
          { next: { revalidate: 86400 } }
        ).then((r) => r.json())
      )
    );

    const namesSet = new Set<string>();
    for (const res of responses) {
      for (const item of (res.Results ?? []) as NhtsaMakeResult[]) {
        namesSet.add(item.MakeName.trim());
      }
    }

    const makes = Array.from(namesSet)
      .map((name) => toTitleCase(name))
      .sort((a, b) => a.localeCompare(b));

    return NextResponse.json({ makes });
  } catch {
    return NextResponse.json(
      { makes: [], error: "Failed to load vehicle makes" },
      { status: 502 }
    );
  }
}
