"use client";

import { useState, useEffect } from "react";
import AirdropReg from "./AirdropReg";

export default function Airdrop() {
  const [timeLeft, setTimeLeft] = useState<{
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  } | null>(null);

  const calculateTimeLeft = () => {
    const targetDate = new Date("2025-05-29T00:00:00Z");
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();

    if (difference > 0) {
      return {
        days: String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(2, "0"),
        hours: String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(2, "0"),
        minutes: String(Math.floor((difference / 1000 / 60) % 60)).padStart(2, "0"),
        seconds: String(Math.floor((difference / 1000) % 60)).padStart(2, "0"),
      };
    } else {
      return {
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
      };
    }
  };

  useEffect(() => {
    setTimeLeft(calculateTimeLeft()); // Inicializa no client

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) {
    // Enquanto ainda não carregou no client
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 bg-white rounded-2xl shadow-md max-w-md w-full">
      <h1 className="text-2xl font-bold">Airdrop Countdown</h1>
      <div className="flex gap-4 text-center">
        <div>
          <p className="text-4xl font-semibold">{timeLeft.days}</p>
          <span className="text-sm">Days</span>
        </div>
        <div>
          <p className="text-4xl font-semibold">{timeLeft.hours}</p>
          <span className="text-sm">Hours</span>
        </div>
        <div>
          <p className="text-4xl font-semibold">{timeLeft.minutes}</p>
          <span className="text-sm">Minutes</span>
        </div>
        <div>
          <p className="text-4xl font-semibold">{timeLeft.seconds}</p>
          <span className="text-sm">Seconds</span>
        </div>
      </div>

      <AirdropReg />
    </div>
  );
}
