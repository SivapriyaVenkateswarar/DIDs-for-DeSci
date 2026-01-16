import { NextResponse } from "next/server";
import crypto from "crypto";

import { encryptData } from "@/lib/privacy/encrypt";
import { decryptData } from "@/lib/privacy/decrypt";

export async function POST() {
  // Demo-only symmetric key
  const key = crypto.randomBytes(32);

  const plaintext = Buffer.from(
    "Sensitive research metadata for Phase 3"
  );

  const encrypted = encryptData(plaintext, key);

  const decrypted = decryptData(
    encrypted.ciphertext,
    key,
    encrypted.iv,
    encrypted.tag
  );

  return NextResponse.json({
    original: plaintext.toString(),
    decrypted: decrypted.toString(),
    match: plaintext.equals(decrypted),
    metadata: {
      ciphertext_bytes: encrypted.ciphertext.length,
      iv_bytes: encrypted.iv.length,
      tag_bytes: encrypted.tag.length,
    },
  });
}
