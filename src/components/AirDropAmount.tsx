"use client";

import { useEffect, useState } from "react";
import { db } from "@/app/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

export default function AirDropAmount() {
  const [amount, setAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let intervalId: number;

    const fetchAmount = async () => {
      try {
        const docRef = doc(db, "AirDropAmount", "count");
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          setAmount(data.value ?? 0);
          setError(null);
        } else {
          setError("No data available");
        }
      } catch (err) {
        console.error("Error fetching AirDrop amount:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchAmount();
    intervalId = window.setInterval(fetchAmount, 10000);
    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const formatAmount = (value: number) => {
    return value.toLocaleString('pt-BR');
  };

  const getFontSize = (value: number) => {
    if (value >= 1_000_000_000) return "text-4xl sm:text-5xl"; // acima de 1 bilhão
    if (value >= 10_000_000) return "text-5xl sm:text-6xl";    // acima de 10 milhões
    return "text-6xl sm:text-7xl";                             // normal até 10 milhões
  };

  return (
    <div className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto p-6 sm:p-8 bg-gradient-to-br from-green-500 to-purple-600 rounded-3xl shadow-2xl flex flex-col items-center justify-center text-center">
      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-6 drop-shadow-lg">
        Total Airdrop Accumulated
      </h3>

      {loading ? (
        <p className="text-white text-lg sm:text-xl animate-pulse">Loading...</p>
      ) : error ? (
        <p className="text-red-300 text-lg sm:text-xl">{error}</p>
      ) : (
        <div className="relative h-20 sm:h-24 md:h-28 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={amount}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex items-center justify-center space-x-2"
            >
              <span className={`font-extrabold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent drop-shadow-md ${amount !== null ? getFontSize(amount) : "text-5xl"}`}>
                {amount !== null ? formatAmount(amount) : "0"}
              </span>
              <span className="text-lg sm:text-xl md:text-2xl font-semibold text-white">
                $LBXO
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
