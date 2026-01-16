import { NextResponse } from "next/server";
import { generateDID } from "@/lib/DID";

export const runtime = "nodejs"; 

export async function GET() {
  try {
    // 1. Destructure keyPair (which now includes the private key from your lib/DID.ts)
    const { did, didDoc, keyPair } = await generateDID();
    
    // 2. Return did, didDoc AND keyPair to the frontend
    return NextResponse.json({ did, didDoc, keyPair });
  } catch (err) {
    console.error("DID generation failed:", err);
    return NextResponse.json(
      { error: "Failed to generate DID" },
      { status: 500 }
    );
  }
}