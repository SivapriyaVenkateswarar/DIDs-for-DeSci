import { pool } from "@/lib/db";

export async function indexVC(data: {
  vc_id: string;
  subject_did: string;
  issuer_did: string;
  vc_type: string;
  ipfs_cid: string;
}) {
  const client = await pool.connect();

  try {
    await client.query(
      `
        INSERT INTO verifiable_credentials
        (vc_id, subject_did, issuer_did, vc_type, ipfs_cid)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (vc_id) DO NOTHING
      `,
      [
        data.vc_id,
        data.subject_did,
        data.issuer_did,
        data.vc_type,
        data.ipfs_cid,
      ]
    );
  } finally {
    client.release();
  }
}