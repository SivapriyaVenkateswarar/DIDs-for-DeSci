import { NextResponse } from "next/server";
import { resolveDID } from "@/lib/DID";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const did = url.searchParams.get("did");

  if (!did) {
    return NextResponse.json({ error: "Missing DID" }, { status: 400 });
  }

  try {
    const didDoc = await resolveDID(did);
    return NextResponse.json({ didDoc });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to resolve DID", details: String(err) },
      { status: 500 }
    );
  }
}
