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

  // 1) Recupera o docId correspondente ao refferCode
  useEffect(() => {
    async function fetchRef() {
      try {
        const q = query(
          collection(db, "reffer"),
          where("refferCode", "==", refferCode)
        );
        const snap = await getDocs(q);

        if (snap.empty) {
          console.warn("Código de referral inválido, redirecionando...");
          router.replace("/airdrop");
          return;
        }

        setRefDocId(snap.docs[0].id);
      } catch (err) {
        console.error("Erro ao buscar referral:", err);
        router.replace("/airdrop");
      } finally {
        setLoading(false);
      }
    }

    fetchRef();
  }, [refferCode, router]);

  // 2) Só faz o incremento + cookie se ainda não existir
  const handleClick = async (url: string) => {
    if (!refDocId) return;

    const cookieName = `reffered_${refferCode}`;
    const hasCookie = Cookies.get(cookieName);

    if (!hasCookie) {
      try {
        const refDoc = doc(db, "reffer", refDocId);
        await updateDoc(refDoc, { newusers: increment(1) });
        Cookies.set(cookieName, "true", { expires: 7 });
        console.log("🟢 Novo usuário contado!");
      } catch (err) {
        console.error("Erro ao incrementar newusers:", err);
      }
    } else {
      console.log("⚠️ Já registrado nos últimos 7 dias.");
    }

    // 3) Só abre o link depois de processar
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <p className="text-gray-400 animate-pulse">
        Carregando dados de referral...
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 w-full max-w-md bg-[var(--background)] border border-green-500 rounded-3xl shadow-lg">
      <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-green-400 via-purple-400 to-green-400 text-transparent bg-clip-text">
        Join Our Community!
      </h1>

      <button
        disabled={!refDocId}
        onClick={() => handleClick("https://t.me/lbxone")}
        className="w-full px-6 py-3 bg-green-500 hover:bg-green-400 disabled:opacity-50 text-black rounded-full font-semibold text-lg transition"
      >
        Join Telegram Channel
      </button>

      <button
        disabled={!refDocId}
        onClick={() => handleClick("https://x.com/lbxone")}
        className="w-full px-6 py-3 bg-purple-500 hover:bg-purple-400 disabled:opacity-50 text-black rounded-full font-semibold text-lg transition"
      >
        Visit X Profile
      </button>

      <button
        disabled={!refDocId}
        onClick={() => handleClick("https://t.me/lbxonegroup")}
        className="w-full px-6 py-3 bg-green-500 hover:bg-green-400 disabled:opacity-50 text-black rounded-full font-semibold text-lg transition"
      >
        Join Telegram Community
      </button>
    </div>
  );
}
