import { Ed25519VerificationKey2020 } from "@digitalbazaar/ed25519-verification-key-2020";
import { webcrypto } from "crypto";

// Ensure WebCrypto exists (Node runtime)
if (!globalThis.crypto) {
  // @ts-ignore
  globalThis.crypto = webcrypto;
}

export async function generateDID() {
  const key = await Ed25519VerificationKey2020.generate();

  const did = `did:key:${key.fingerprint()}`;

  // 1. Export the public document for Step 3 (Resolve)
  const didDoc = await key.export({
    publicKey: true,
    includeContext: true
  });
  didDoc.id = did;

  // 2. NEW: Export the FULL key pair (including privateKeyMultibase) for Step 4 (Signing)
  const keyPair = await key.export({
    publicKey: true,
    privateKey: true, // THIS IS THE MISSING PIECE
    includeContext: true
  });

  return { did, didDoc, keyPair };
}

export async function resolveDID(did: string) {
  if (!did.startsWith("did:key:")) {
    throw new Error("Only did:key DIDs are supported");
  }

  const fingerprint = did.replace("did:key:", "");
  const key = await Ed25519VerificationKey2020.fromFingerprint({ fingerprint });

  const didDoc = await key.export({
    publicKey: true,
    includeContext: true
  });

  didDoc.id = did;

  return didDoc;
}