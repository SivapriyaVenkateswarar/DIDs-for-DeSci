"use client";

import { useState } from "react";
import WalletAuth from "@/components/WalletAuth";

export default function Home() {
  const [address, setAddress] = useState<string | null>(null);

  // Phase 1 — Identity
  const [did, setDID] = useState<string | null>(null);
  const [resolvedDID, setResolvedDID] = useState<any>(null);
  const [vc, setVC] = useState<any>(null);

  // Phase 2 — Verification
  const [verification, setVerification] = useState<any>(null);

  // Phase 3 — Reputation & Incentives
  const [reputation, setReputation] = useState<any>(null);
  const [incentives, setIncentives] = useState<any>(null);

  // Phase 4 — Privacy ✅ (ADDED)
  const [privacyTest, setPrivacyTest] = useState<any>(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* =========================
     Phase 1 — Identity
     ========================= */

  async function generateDID() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/identity/generate-DID");
      if (!res.ok) throw new Error("Failed to generate DID");
      const data = await res.json();
      setDID(data.did);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function resolveDID() {
    if (!did) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/identity/resolve-DID?did=${did}`);
      if (!res.ok) throw new Error("Failed to resolve DID");
      const data = await res.json();
      setResolvedDID(data.didDoc);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function requestLabDAOVC() {
    if (!did) {
      setError("Missing DID");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/issuer/labDAO/issue-vc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectDID: did }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.details || "VC issuance failed");
      }

      const data = await res.json();
      setVC(data.vc);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  /* =========================
     Phase 2 — Verification
     ========================= */

  async function verify() {
    if (!vc) return;
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/verify/vc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vc }),
      });

      const data = await res.json();
      setVerification(data);
    } catch (err: any) {
      setError("Verification failed: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  /* =========================
     Phase 3 — Reputation
     ========================= */

  async function computeReputation() {
    if (!verification?.verified || !did) return;

    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/reputation/compute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject_did: did }),
      });

      if (!res.ok) throw new Error("Reputation computation failed");
      setReputation(await res.json());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function translateIncentives() {
    if (!reputation || !did) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/incentives/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject_did: did,
          platform: "LabDAO",
        }),
      });

      if (!res.ok) throw new Error("Incentive translation failed");
      setIncentives(await res.json());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  /* =========================
     Phase 4 — Privacy ✅ (ADDED)
     ========================= */

  async function testPrivacy() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/privacy/encrypt-test", {
        method: "POST",
      });

      if (!res.ok) throw new Error("Privacy encryption test failed");

      setPrivacyTest(await res.json());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1>DeSci Reputation Prototype</h1>

      <section style={sectionStyle}>
        <h2>Step 1: Connect Wallet</h2>
        <WalletAuth onAddress={setAddress} />
        {address && <p>✅ <strong>Wallet:</strong> {address}</p>}
      </section>

      <section style={sectionStyle}>
        <h2>Step 2: Generate DID</h2>
        <button onClick={generateDID} disabled={!address || loading}>Generate DID</button>
        {did && <p>🆔 <strong>DID:</strong> {did}</p>}
      </section>

      <section style={sectionStyle}>
        <h2>Step 3: Resolve DID</h2>
        <button onClick={resolveDID} disabled={!did || loading}>Resolve DID</button>
        {resolvedDID && <pre style={preStyle}>{JSON.stringify(resolvedDID, null, 2)}</pre>}
      </section>

      <section style={sectionStyle}>
        <h2>Step 4: Request LabDAO VC</h2>
        <button onClick={requestLabDAOVC} disabled={!did || loading}>Request VC</button>
        {vc && (
          <div>
            <p>📄 <strong>VC Issued:</strong> {vc.id}</p>
            <pre style={preStyle}>{JSON.stringify(vc, null, 2)}</pre>
          </div>
        )}
      </section>

      <section style={sectionStyle}>
        <h2>Step 5: Verify VC</h2>
        <button onClick={verify} disabled={!vc || loading}>Verify VC</button>
        {verification && (
          <div style={{ marginTop: "10px", color: verification.verified ? "green" : "red" }}>
            <strong>Status: {verification.verified ? "✅ Verified" : "❌ Invalid Signature"}</strong>
            <pre style={preStyle}>{JSON.stringify(verification, null, 2)}</pre>
          </div>
        )}
      </section>

      <section style={sectionStyle}>
        <h2>Step 6: Compute Reputation</h2>
        <button onClick={computeReputation} disabled={!verification?.verified || loading}>
          Compute Reputation
        </button>
        {reputation && <pre style={preStyle}>{JSON.stringify(reputation, null, 2)}</pre>}
      </section>

      <section style={sectionStyle}>
        <h2>Step 7: Translate Incentives</h2>
        <button onClick={translateIncentives} disabled={!reputation || loading}>
          Translate Incentives
        </button>
        {incentives && <pre style={preStyle}>{JSON.stringify(incentives, null, 2)}</pre>}
      </section>

      {/* Phase 4 UI ✅ */}
      <section style={sectionStyle}>
        <h2>Step 8: Test Privacy Encryption</h2>
        <button onClick={testPrivacy} disabled={loading}>
          Run Encryption Test
        </button>
        {privacyTest && <pre style={preStyle}>{JSON.stringify(privacyTest, null, 2)}</pre>}
      </section>

      {loading && <div style={overlayStyle}>Processing...</div>}
      {error && (
        <p style={{ color: "red", padding: "1rem", border: "1px solid red" }}>
          <strong>Error:</strong> {error}
        </p>
      )}
    </div>
  );
}

const sectionStyle = { marginBottom: "2rem", padding: "1rem", borderBottom: "1px solid #eee" };
const preStyle = { backgroundColor: "#f4f4f4", padding: "1rem", borderRadius: "5px", overflowX: "auto" as const, fontSize: "12px" };
const overlayStyle = {
  position: "fixed" as const,
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(255,255,255,0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontWeight: "bold",
};
