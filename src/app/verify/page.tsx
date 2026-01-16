
"use client";

import { useState } from "react";

export default function VerifyPage() {
  const [vc, setVC] = useState("");
  const [result, setResult] = useState<any>(null); // This is where setResult comes from

  async function verify() {
    try {
      // 1. Parse the text from the textarea into a JSON object
      const vcObject = JSON.parse(vc);

      // 2. Send it to your API
      const res = await fetch("/api/verify/vc", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // We wrap it in 'vc' to match your Backend: const { vc: credential } = await req.json();
        body: JSON.stringify({ vc: vcObject }) 
      });

      const data = await res.json();
      
      // 3. Update the 'result' state so it shows up on the screen
      setResult(data); 
    } catch (err) {
      console.error(err);
      setResult({ error: "Invalid JSON format or Network Error" });
    }
  }

  return (
    <div style={{ padding: 32 }}>
      <h1>Verify Verifiable Credential</h1>

      <textarea
        rows={14}
        style={{ width: "100%", fontFamily: 'monospace' }}
        placeholder="Paste VC JSON here"
        value={vc}
        onChange={e => setVC(e.target.value)}
      />

      <div style={{ marginTop: 16 }}>
        <button onClick={verify} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Verify Now
        </button>
      </div>

      {result && (
        <div style={{ marginTop: 24, padding: 16, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
          <h3>Verification Result:</h3>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}