export interface VerificationResult {
  vc_id: string;
  valid: boolean;
  issuer_did: string;
  issuer_trust: number;
}
