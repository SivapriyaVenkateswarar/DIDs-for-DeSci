import { NextRequest, NextResponse } from "next/server";
import { issueVC } from "@/lib/vc";

export async function POST(req: NextRequest) {
  try {
    const { subjectDID } = await req.json();

    if (!subjectDID) {
      return NextResponse.json({ error: "Missing subject DID" }, { status: 400 });
    }

    const vc = await issueVC(subjectDID);

    return NextResponse.json({ vc });
  } catch (err: any) {
    console.error("VC issuance failed:", err);
    return NextResponse.json({ error: "Failed to issue VC", details: err.message }, { status: 500 });
  }
}
