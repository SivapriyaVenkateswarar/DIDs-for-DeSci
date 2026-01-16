export interface ReputationInputVC {
  vc_id: string;
  issuer_did: string;
  vc_type: string;
  issuer_trust: number;
}

export interface ReputationResult {
  subject_did: string;
  score: number;
  breakdown: Array<{
    vc_id: string;
    contribution: number;
  }>;
}
