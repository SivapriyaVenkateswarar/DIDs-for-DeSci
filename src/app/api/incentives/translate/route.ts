import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { computeReputation } from '@/lib/reputation/computeReputation';
import { translateIncentives } from '@/lib/incentives/translate';

import labdaoPolicy from '@/lib/incentives/policies/labdao.json';
import vitadaoPolicy from '@/lib/incentives/policies/vitadao.json';

const POLICY_MAP: Record<string, any> = {
  LabDAO: labdaoPolicy,
  VitaDAO: vitadaoPolicy,
};

export async function POST(req: Request) {
  const { subject_did, platform } = await req.json();

  if (!subject_did || !platform) {
    return NextResponse.json(
      { error: 'Missing subject_did or platform' },
      { status: 400 }
    );
  }

  const { rows } = await pool.query(
    `
    SELECT vc_id, issuer_did, vc_type, 0.9 as issuer_trust
    FROM verifiable_credentials
    WHERE subject_did = $1
      AND verified = true
    `,
    [subject_did]
  );

  const reputation = computeReputation(subject_did, rows);
  const policy = POLICY_MAP[platform];

  if (!policy) {
    return NextResponse.json(
      { error: 'Unknown platform' },
      { status: 400 }
    );
  }

  const incentives = translateIncentives(
    reputation.score,
    policy
  );

  return NextResponse.json(incentives);
}
