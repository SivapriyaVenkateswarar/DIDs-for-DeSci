import { Resolver } from "did-resolver";
import { getDidKeyResolver } from "@veramo/did-provider-key";
import { verifyCredential } from "did-jwt-vc";
import { getIssuerTrust } from "./trustPolicy";
import type { VerificationResult } from "@/types";

const resolver = new Resolver({
  ...getDidKeyResolver(),
});

export async function verifyVC(vc: any): Promise<VerificationResult> {
  try {
    await verifyCredential(vc, resolver);

    return {
      vc_id: vc.id,
      valid: true,
      issuer_did: vc.issuer,
      issuer_trust: getIssuerTrust(vc.issuer),
    };
  } catch {
    return {
      vc_id: vc.id,
      valid: false,
      issuer_did: vc.issuer,
      issuer_trust: 0,
    };
  }
}
