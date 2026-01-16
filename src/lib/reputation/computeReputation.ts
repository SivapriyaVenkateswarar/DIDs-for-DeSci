import { ReputationInputVC, ReputationResult } from './types';
import { credentialWeight } from './weights';

export function computeReputation(
  subjectDID: string,
  vcs: ReputationInputVC[]
): ReputationResult {
  let score = 0;
  const breakdown = [];

  for (const vc of vcs) {
    const contribution =
      vc.issuer_trust * credentialWeight(vc.vc_type);

    score += contribution;

    breakdown.push({
      vc_id: vc.vc_id,
      contribution,
    });
  }

  return {
    subject_did: subjectDID,
    score: Number(score.toFixed(3)),
    breakdown,
  };
}
