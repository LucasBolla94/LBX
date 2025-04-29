"use client";

import { useEffect, useState } from "react";
import { db } from "@/app/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface RefSocialProps {
  refferCode: string;
}

export default function RefSocial({ refferCode }: RefSocialProps) {
  const [loading, setLoading] = useState(true);
  const [refDocId, setRefDocId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchReffer = async () => {
      try {
        const q = query(
          collection(db, "reffer"),
          where("refferCode", "==", refferCode)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setRefDocId(querySnapshot.docs[0].id);
        } else {
          console.warn("Referral code not found, redirecting...");
          router.replace("/airdrop");
        }
      } catch (error) {
        console.error("Error fetching referral:", error);
        router.replace("/airdrop");
      } finally {
        setLoading(false);
      }
    };

    fetchReffer();
  }, [refferCode, router]);

  const handleClick = async (url: string) => {
    const cookieName = `reffered_${refferCode}`;

    if (!Cookies.get(cookieName) && refDocId) {
      try {
        const refDoc = doc(db, "reffer", refDocId);
        await updateDoc(refDoc, {
          newusers: increment(1),
        });
        Cookies.set(cookieName, "true", { expires: 7 });
      } catch (error) {
        console.error("Error updating newusers:", error);
      }
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return <p className="text-gray-400 animate-pulse">Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 w-full max-w-md bg-[var(--background)] border border-green-500 rounded-3xl shadow-lg">
      <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-green-400 via-purple-400 to-green-400 text-transparent bg-clip-text">
        Join Our Community!
      </h1>

      <button
        onClick={() => handleClick("https://t.me/lbxone")}
        className="w-full px-6 py-3 bg-green-500 hover:bg-green-400 text-black rounded-full font-semibold text-lg transition"
      >
        Join Telegram Channel
      </button>

      <button
        onClick={() => handleClick("https://x.com/lbxone")}
        className="w-full px-6 py-3 bg-purple-500 hover:bg-purple-400 text-black rounded-full font-semibold text-lg transition"
      >
        Visit X Profile
      </button>

      <button
        onClick={() => handleClick("https://t.me/lbxonegroup")}
        className="w-full px-6 py-3 bg-green-500 hover:bg-green-400 text-black rounded-full font-semibold text-lg transition"
      >
        Join Telegram Community
      </button>
    </div>
  );
}
