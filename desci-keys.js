import { Ed25519VerificationKey2020 } from '@digitalbazaar/ed25519-verification-key-2020';
import { driver as didKeyDriver } from '@digitalbazaar/did-method-key';

const didKey = didKeyDriver();

async function generateKeys() {
  const key = await Ed25519VerificationKey2020.generate();
  console.log('DID:', `did:key:${key.publicKeyMultibase}`);
  console.log('Public Key:', key.publicKeyMultibase);
  console.log('Private Key:', key.privateKeyMultibase);
}
generateKeys();
