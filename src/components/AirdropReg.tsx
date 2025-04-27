"use client";

import { useState } from "react";
import { db } from "@/app/lib/firebase"; // ajuste o caminho se necessário
import { doc, setDoc, getDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { useWallet } from "@solana/wallet-adapter-react";

export default function AirdropReg() {
  const { publicKey } = useWallet();
  const [registered, setRegistered] = useState(false);
  const [referralLink, setReferralLink] = useState("");

  const handleRegister = async () => {
    if (!publicKey) {
      alert("Connect your wallet first.");
      return;
    }

    try {
      const walletAddress = publicKey.toBase58();
      const userDocRef = doc(db, "reffer", walletAddress);

      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const existingRefferCode = userDocSnap.data().refferCode;
        setReferralLink(`https://lbxgroup.online/ref/${existingRefferCode}`);
        setRegistered(true);
      } else {
        const newRefferCode = "LBXO" + uuidv4().slice(0, 8);

        await setDoc(userDocRef, {
          walletAddress,
          refferCode: newRefferCode,
          newusers: 0,
        });

        setReferralLink(`https://lbxgroup.online/ref/${newRefferCode}`);
        setRegistered(true);
      }
    } catch (error) {
      console.error("Error registering wallet:", error);
      alert("There was an error registering. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 bg-white rounded-2xl shadow-lg max-w-md w-full">
      <h2 className="text-xl font-bold text-gray-900 text-center">
        Earn Extra $LBXO Rewards!
      </h2>

      <p className="text-center text-gray-600 text-sm">
        Share your referral link and invite people to our official channels.
        Earn more $LBXO as your network grows!
      </p>

      <div className="flex flex-col items-center gap-2 text-center">
        <a
          href="https://t.me/lbxone"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 font-semibold underline text-sm"
        >
          📢 Join our Telegram Channel for the rewards table
        </a>

        <p className="text-gray-600 text-xs">
          You can track your earnings anytime through your Dashboard after registration!
        </p>
      </div>

      {!registered ? (
        <button
          onClick={handleRegister}
          className="w-full px-6 py-3 bg-blue-700 hover:bg-blue-600 text-white rounded-full font-semibold transition"
        >
          Register & Get Your Referral Link
        </button>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <p className="text-green-600 font-semibold">
            You are registered!
          </p>
          <div className="p-3 bg-gray-100 rounded-xl break-all text-center text-blue-700 font-semibold">
            <a href={referralLink} target="_blank" rel="noopener noreferrer">
              {referralLink}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
