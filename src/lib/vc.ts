import * as vc from '@digitalbazaar/vc';
import { Ed25519VerificationKey2020 } from '@digitalbazaar/ed25519-verification-key-2020';
import { driver as didKeyDriver } from '@digitalbazaar/did-method-key';
import { v4 as uuidv4 } from 'uuid';
import { Ed25519Signature2020 } from '@digitalbazaar/ed25519-signature-2020';
import { purposes } from 'jsonld-signatures';
import { pool } from '@/lib/db';


// ----------------------
// DID Key Driver
// ----------------------
const didKey = didKeyDriver();

// ----------------------
// LabDAO Environment Variables
// ----------------------
const LABDAO_DID = process.env.LABDAO_DID!;
const LABDAO_PUBLIC_KEY_MULTIBASE = process.env.LABDAO_PUBLIC_KEY!;
const LABDAO_PRIVATE_KEY_MULTIBASE = process.env.LABDAO_PRIVATE_KEY!;

// ----------------------
// Document Loader
// ----------------------
export const documentLoader = async (url: string) => {
  console.log('📌 documentLoader called with:', url);

  // Standard VC context
  if (url === 'https://www.w3.org/2018/credentials/v1') {
    const doc = (await import('credentials-context')).default.contexts.get(url);
    return { contextUrl: null, document: doc, documentUrl: url };
  }

  // Ed25519 2020 context
  if (url === 'https://w3id.org/security/suites/ed25519-2020/v1') {
    const doc = (await import('ed25519-signature-2020-context')).default.contexts.get(url);
    return { contextUrl: null, document: doc, documentUrl: url };
  }

  // DID resolution
  if (url.startsWith('did:key:')) {
    const [didOnly, fragment] = url.split('#');
    let didDocument: any;

    if (didOnly === LABDAO_DID) {
      // LabDAO DID document
      didDocument = {
        '@context': [
          'https://www.w3.org/ns/did/v1',
          'https://w3id.org/security/suites/ed25519-2020/v1',
        ],
        id: LABDAO_DID,
        verificationMethod: [
          {
            id: `${LABDAO_DID}#${LABDAO_PUBLIC_KEY_MULTIBASE}`,
            type: 'Ed25519VerificationKey2020',
            controller: LABDAO_DID,
            publicKeyMultibase: LABDAO_PUBLIC_KEY_MULTIBASE,
          },
        ],
        assertionMethod: [`${LABDAO_DID}#${LABDAO_PUBLIC_KEY_MULTIBASE}`],
      };
    } else {
      const result = await didKey.get({ did: didOnly });
      didDocument = result.didDocument;
    }

    if (fragment) {
      const vm = didDocument.verificationMethod?.find(
        (m: any) => m.id === `${didOnly}#${fragment}`
      );
      if (!vm) throw new Error(`Verification method not found: ${url}`);

      // Add @context so Ed25519Signature2020 can parse the key
      return {
        contextUrl: null,
        document: {
          '@context': 'https://w3id.org/security/suites/ed25519-2020/v1',
          ...vm,
        },
        documentUrl: url,
      };
    }

    return { contextUrl: null, document: didDocument, documentUrl: url };
  }

  return { contextUrl: null, document: { '@context': {} }, documentUrl: url };
};

// ----------------------
// LabDAO Key
// ----------------------
export const getLabDAOKey = async () => {
  if (!LABDAO_DID || !LABDAO_PUBLIC_KEY_MULTIBASE || !LABDAO_PRIVATE_KEY_MULTIBASE) {
    throw new Error('LabDAO DID or keys are not defined. Check your environment variables.');
  }

  return await Ed25519VerificationKey2020.from({
    id: `${LABDAO_DID}#${LABDAO_PUBLIC_KEY_MULTIBASE}`,
    controller: LABDAO_DID,
    publicKeyMultibase: LABDAO_PUBLIC_KEY_MULTIBASE,
    privateKeyMultibase: LABDAO_PRIVATE_KEY_MULTIBASE,
  });
};

// ----------------------
// Issue VC
// ----------------------
export async function issueVC(subjectDID: string) {
  const key = await getLabDAOKey();
  const suite = new Ed25519Signature2020({ key, verificationMethod: key.id });

  const credential = {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      'https://w3id.org/security/suites/ed25519-2020/v1',
      {
        role: 'https://schema.org/roleName',
        platform: 'https://schema.org/Project',
        ResearchContribution: 'https://w3id.org/desci#ResearchContribution',
      },
    ],
    id: `urn:uuid:${uuidv4()}`,
    type: ['VerifiableCredential', 'ResearchContribution'],
    issuer: LABDAO_DID,
    issuanceDate: new Date().toISOString(),
    credentialSubject: {
      id: subjectDID,
      role: 'dataset_contributor',
      platform: 'LabDAO',
    },
  };

  // Issue the VC
  const issuedVC = await vc.issue({
    credential,
    suite,
    documentLoader,
    purpose: new purposes.AssertionProofPurpose(),
    safe: false,
  });

  // ✅ Insert into database
  await pool.query(
    `INSERT INTO verifiable_credentials
      (vc_id, subject_did, issuer_did, vc_type, ipfs_cid, verified, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
    [
      issuedVC.id,          // vc_id
      subjectDID,           // subject_did
      LABDAO_DID,           // issuer_did
      'ResearchContribution', // vc_type
      '',                   // ipfs_cid placeholder
      true                  // mark as verified immediately
    ]
  );

  return issuedVC;
}

// ----------------------
// Verify VC
// ----------------------
export async function verifyVC(credential: any) {
  try {
    // Use DID fragment to resolve public key automatically
    const suite = new Ed25519Signature2020();

    const result = await vc.verifyCredential({
      credential,
      suite,
      documentLoader,
      purpose: new purposes.AssertionProofPurpose(),
      safe: false,
    });

    console.log('✅ Verification result:', result);
    return result;
  } catch (err: any) {
    console.error('❌ Verification failed!');
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);
    console.error('Full error:', err);
    if (err.cause) console.error('Cause:', err.cause);
    throw err;
  }
}

