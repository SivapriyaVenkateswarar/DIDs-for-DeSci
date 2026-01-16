import { NextResponse } from "next/server";
import { verifyVC } from "@/lib/vc";
import { pool } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { vc: credential } = await req.json();

    if (!credential) {
      return NextResponse.json({ error: "Missing VC" }, { status: 400 });
    }

    const result = await verifyVC(credential);

    // Update DB with verification result
    await pool.query(
      `UPDATE verifiable_credentials
       SET verified = $1
       WHERE vc_id = $2`,
      [result.verified, credential.id]
    );

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("VC verification failed:", err);
    return NextResponse.json(
      { error: "Verification failed", details: err.message },
      { status: 500 }
    );
  }
}
