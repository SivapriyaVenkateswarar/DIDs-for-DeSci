import { NextResponse } from "next/server";
import { storeVC } from "@/lib/storage/ipfs";
import { indexVC } from "@/lib/storage";

export async function POST(req: Request) {
  let vc: any;

  // Safe JSON parsing
  try {
    vc = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  // Minimal VC validation (do NOT skip this)
  if (
    !vc ||
    typeof vc !== "object" ||
    !vc.id ||
    !vc.issuer ||
    !vc.credentialSubject?.id ||
    !Array.isArray(vc.type)
  ) {
    return NextResponse.json(
      { error: "Invalid Verifiable Credential structure" },
      { status: 400 }
    );
  }

  try {
    // Store VC in IPFS
    const cid = await storeVC(vc);

    // Index only metadata (correct)
    await indexVC({
      vc_id: vc.id,
      subject_did: vc.credentialSubject.id,
      issuer_did: vc.issuer,
      vc_type: vc.type.find((t: string) => t !== "VerifiableCredential") ?? "Unknown",
      ipfs_cid: cid,
    });

    return NextResponse.json({ cid });
  } catch (err) {
    console.error("VC storage/indexing failed:", err);

    return NextResponse.json(
      { error: "Failed to store VC" },
      { status: 500 }
    );
  }
}
