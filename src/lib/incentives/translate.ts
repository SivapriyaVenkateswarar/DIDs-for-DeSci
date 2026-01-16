import { IncentiveResult } from './types';

export function translateIncentives(
  score: number,
  policy: any
): IncentiveResult {
  let effects = {};

  for (const rule of policy.rules) {
    if (score >= rule.if.score_gte) {
      effects = { ...effects, ...rule.effects };
    }
  }

  return {
    platform: policy.platform,
    score,
    effects
  };
}
