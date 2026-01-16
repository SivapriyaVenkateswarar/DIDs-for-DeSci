"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";

interface WalletAuthProps {
  onAddress: (addr: string) => void;
}

export default function WalletAuth({ onAddress }: WalletAuthProps) {
  const [wallet, setWallet] = useState<string | null>(null);
  const [hasMetaMask, setHasMetaMask] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasMetaMask(!!(window as any).ethereum?.isMetaMask);
    }
  }, []);

  async function connectWallet() {
    const provider = new ethers.BrowserProvider(
      (window as any).ethereum
    );

    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    setWallet(address);
    onAddress(address);
  }

  function redirectToMetaMask() {
    window.location.href = "https://metamask.io/download/";
  }

  return (
    <button
      onClick={hasMetaMask ? connectWallet : redirectToMetaMask}
    >
      {wallet
        ? `Connected: ${wallet.slice(0, 6)}...${wallet.slice(-4)}`
        : hasMetaMask
          ? "Connect Wallet"
          : "Get MetaMask"}
    </button>
  );
}
