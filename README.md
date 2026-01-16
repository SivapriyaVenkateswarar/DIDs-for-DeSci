# DeSci Reputation Prototype

## Overview

This project implements a **decentralized, DID-based reputation and incentive system for science**. The goal is to provide a minimal but complete end-to-end infrastructure to:

- Track scientific contributions with verifiable credentials.
- Aggregate user reputation across platforms.
- Allow local platforms to interpret reputation scores as incentives.
- Maintain modularity and privacy without assuming a blockchain or shared governance.

The system demonstrates a full flow:

**User → DID → VC Issuance → Storage → Verification → Reputation → Incentive Translation**

---

## Key Features

### 1. DID-Based Identity

- Uses **`did:key` (Ed25519)** for user and issuer identities.
- Generates deterministic keypairs and DIDs for reproducibility.
- Supports DID resolution and challenge-based authentication.

### 2. Verifiable Credentials (VCs)

- Each platform can issue W3C-compliant VCs.
- VC issuance is signed using the issuer’s DID.
- Supports storage of full VC on IPFS with metadata in PostgreSQL.

### 3. Verification Layer

- Resolves issuer DIDs and verifies VC signatures.
- Policy-driven trust model for issuers (`issuer_trust`).
- Ensures schema compliance and optional revocation checks.

### 4. Reputation Engine

- Aggregates verified VCs into transparent reputation scores.
- Reputation calculation uses configurable weights and optional temporal decay.
- Supports global and per-platform reputation metrics.
- Fully deterministic and explainable.

### 5. Incentive Translation Module

- Converts reputation scores into platform-specific incentives.
- Policy-driven configuration for local interpretation.
- Example incentives: voting weight adjustments, badges, or other rewards.

### 6. Privacy and Encryption

- Sensitive data is encrypted using **AES-256-GCM**.
- Only hashes and encrypted IPFS pointers are stored in the system.
- Supports decryption for authorized users with the correct key.

---

## Usage Flow

1. **Connect Wallet** – Authenticate and obtain a user address.
2. **Generate DID** – Generate a deterministic `did:key` for the user.
3. **Resolve DID** – View DID Document for verification.
4. **Request LabDAO VC** – Issuer generates a verifiable credential for the user.
5. **Verify VC** – Check cryptographic validity of the credential.
6. **Compute Reputation** – Aggregate verified credentials into a score.
7. **Translate Incentives** – Apply platform-specific rules to generate incentives.

---

## Technologies

- **Next.js 13** – Frontend and API routes
- **TypeScript** – Type safety and modularity
- **PostgreSQL** – Local metadata storage
- **IPFS** – Storing full VCs securely
- **crypto (Node.js)** – AES-GCM encryption/decryption
- **DID & VC standards** – `did:key`, W3C Verifiable Credentials

---

## Future Work

- Support multiple issuers across DeSci platforms.
- DAO-based dynamic issuer trust registry.
- Integration with zero-knowledge proofs for privacy-preserving claims.
- Optional support for Ceramic or other decentralized indexing layers.

---

## License

This project is licensed under the MIT License.
