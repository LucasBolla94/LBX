"use client";

import { useState } from "react";
import { db } from "@/app/lib/firebase"; // ajuste o caminho conforme onde você configurou o Firebase
import { collection, addDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { useWallet } from "@solana/wallet-adapter-react";

export default function AirdropReg() {
  const { publicKey } = useWallet();
  const [registered, setRegistered] = useState(false);

  const handleRegister = async () => {
    if (!publicKey) return alert("Connect your wallet first.");

    try {
      const walletAddress = publicKey.toBase58();
      const refferCode = uuidv4().slice(0, 8); // Código aleatório de 8 caracteres

      await addDoc(collection(db, "reffer"), {
        walletAddress,
        refferCode,
        newusers: 0,
      });

      setRegistered(true);
    } catch (error) {
      console.error("Error registering for airdrop:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {!registered ? (
        <button
          onClick={handleRegister}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold transition"
        >
          Register for Airdrop
        </button>
      ) : (
        <p className="text-green-600 font-semibold">You are registered!</p>
      )}
    </div>
  );
}
