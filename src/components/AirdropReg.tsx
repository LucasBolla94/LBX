"use client";

import { useState, useEffect } from "react";
import { db } from "@/app/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { useWallet } from "@solana/wallet-adapter-react";
import RefLink from "@/components/dash/RefLink";

export default function AirdropReg() {
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(true);
  const [refferCode, setRefferCode] = useState<string | null>(null);

  useEffect(() => {
    const checkRegistration = async () => {
      if (!publicKey) {
        setLoading(false);
        return;
      }

      try {
        const walletAddress = publicKey.toBase58();
        const userDocRef = doc(db, "reffer", walletAddress);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const existingCode = userDocSnap.data().refferCode;
          setRefferCode(existingCode);
        }
      } catch (error) {
        console.error("Error checking referral code:", error);
      } finally {
        setLoading(false);
      }
    };

    checkRegistration();
  }, [publicKey]);

  const handleRegister = async () => {
    if (!publicKey) {
      alert("Connect your wallet first.");
      return;
    }

    try {
      const walletAddress = publicKey.toBase58();
      const userDocRef = doc(db, "reffer", walletAddress);
      const newRefferCode = "LBXO" + uuidv4().slice(0, 8);

      await setDoc(userDocRef, {
        walletAddress,
        refferCode: newRefferCode,
        newusers: 0,
        balance: 100,
      });

      setRefferCode(newRefferCode);
    } catch (error) {
      console.error("Error registering wallet:", error);
      alert("There was an error registering. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full p-6 bg-[var(--background)] border border-[var(--border)] rounded-3xl shadow-lg">
      <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[var(--foreground)] via-[var(--foreground)] to-[var(--foreground)] text-transparent bg-clip-text text-center mb-6 leading-snug">
        🎁 Refer Reward
      </h2>

      <p className="text-[var(--foreground)] text-base sm:text-lg text-center mb-6 leading-relaxed max-w-3xl">
        Convide um amigo para a comunidade e ganhe <strong>$LBXO</strong> como recompensa por ajudar o projeto a crescer. 
        <br className="hidden sm:block" />
        Ao combinar seus resultados com o <strong>Stake</strong>, você poderá multiplicar seus ganhos em <strong>LBXO</strong>, <strong>SOL</strong> e <strong>USDC</strong>!
      </p>

      <div className="flex flex-col items-center gap-3 text-center mb-6">
        <a
          href="https://t.me/lbxone"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--foreground)] hover:opacity-80 font-semibold underline text-base sm:text-lg"
        >
          📢 Entre no nosso canal do Telegram para ver a tabela de recompensas
        </a>
        <p className="text-[var(--foreground)]/70 text-sm sm:text-base leading-relaxed max-w-lg">
          Você poderá acompanhar seus ganhos a qualquer momento pelo Dashboard após o registro.
        </p>
      </div>

      {!loading && refferCode ? (
        <RefLink refferCode={refferCode} />
      ) : (
        !loading && (
          <button
            onClick={handleRegister}
            className="w-full max-w-sm px-6 py-3 bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 rounded-full font-semibold text-lg transition"
          >
            Sign Up and Get My Reward Link
          </button>
        )
      )}
    </div>
  );
}
