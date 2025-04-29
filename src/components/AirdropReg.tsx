"use client";

import { useState } from "react";
import { db } from "@/app/lib/firebase";
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
    <div className="flex flex-col items-center justify-center w-full p-6 bg-[var(--background)] border border-green-500 rounded-3xl shadow-lg">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 via-purple-400 to-green-400 text-transparent bg-clip-text text-center mb-6 leading-snug">
        🎁 AirDrop Reward
      </h2>

      <p className="text-gray-400 text-base text-center mb-6 leading-relaxed">
        Share your referral link and invite people to our official channels. Earn more&nbsp;
        <span className="font-semibold">$LBXO</span> as your network grows!
      </p>

      <div className="flex flex-col items-center gap-2 text-center mb-6">
        <a
          href="https://t.me/lbxone"
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-400 hover:text-purple-400 font-semibold underline text-base"
        >
          📢 Join our Telegram Channel for the rewards table
        </a>
        <p className="text-gray-500 text-sm leading-relaxed">
          You can track your earnings anytime through your Dashboard after registration!
        </p>
      </div>

      {!registered ? (
        <button
          onClick={handleRegister}
          className="w-full px-6 py-3 bg-green-500 hover:bg-green-400 text-black rounded-full font-semibold text-lg transition"
        >
          Register & Get Your Referral Link
        </button>
      ) : (
        <div className="flex flex-col items-center gap-4 w-full">
          <p className="text-green-400 font-semibold text-lg">You are registered!</p>
          <div className="w-full p-4 rounded-xl bg-gray-900 flex items-center justify-between shadow-md border border-green-500">
            <a
              href={referralLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-300 text-base truncate font-semibold"
            >
              {referralLink}
            </a>
            <button
              onClick={() => navigator.clipboard.writeText(referralLink)}
              className="ml-4 bg-green-500 hover:bg-green-400 text-black font-bold py-2 px-4 rounded-xl text-sm transition"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
