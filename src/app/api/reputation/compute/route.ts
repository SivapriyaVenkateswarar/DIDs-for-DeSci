import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { computeReputation } from '@/lib/reputation/computeReputation';

export async function POST(req: Request) {
  const { subject_did } = await req.json();

  if (!subject_did) {
    return NextResponse.json(
      { error: 'Missing subject_did' },
      { status: 400 }
    );
  }

 const { rows } = await pool.query(
  `
  SELECT
    vc_id,
    issuer_did,
    vc_type,
    0.9 AS issuer_trust
  FROM verifiable_credentials
  WHERE subject_did = $1
    AND verified = true
  `,
  [subject_did]
);


  const reputation = computeReputation(subject_did, rows);

  return NextResponse.json(reputation);
}
