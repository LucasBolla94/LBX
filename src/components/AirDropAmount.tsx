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
    const intervalId = window.setInterval(fetchAmount, 10_000);
    return () => window.clearInterval(intervalId);
  }, []);

  const formatAmount = (value: number) => value.toLocaleString("pt-BR");

  const getFontSize = (value: number) => {
    if (value >= 1_000_000_000) return "text-3xl sm:text-4xl";
    if (value >= 10_000_000) return "text-4xl sm:text-5xl";
    return "text-5xl sm:text-6xl";
  };

  return (
    <div className="w-full max-w-md sm:max-w-lg mx-auto p-6 bg-gradient-to-br from-green-500 to-purple-600 rounded-3xl shadow-2xl flex flex-col items-center text-center">
      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4">
        Total Airdrop Accumulated
      </h3>

      {loading ? (
        <p className="text-white text-base sm:text-lg animate-pulse">Loading...</p>
      ) : error ? (
        <p className="text-red-300 text-base sm:text-lg">{error}</p>
      ) : (
        <div className="relative h-16 sm:h-20 md:h-24 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={amount}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex items-end space-x-2"
            >
              <span
                className={`font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200 ${
                  amount !== null ? getFontSize(amount) : "text-4xl sm:text-5xl"
                }`}
              >
                {amount !== null ? formatAmount(amount) : "0"}
              </span>
              <span className="text-base sm:text-lg md:text-xl font-semibold text-white">
                $LBXO
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
