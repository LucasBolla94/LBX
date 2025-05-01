'use client';

import { useEffect, useState } from 'react';

const PAY_HOURS = [8, 14, 20]; // Horários de pagamento em 24h
const API_PATH = '/api/server-time'; // A rota criada no App Router

export default function WithdrawTime() {
  const [countdown, setCountdown] = useState<string>('Loading...');
  const [targetHour, setTargetHour] = useState<number | null>(null);

  // Calcula próximo horário de payout a partir de um Date
  const getNextPayout = (now: Date): Date => {
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();

    for (const hour of PAY_HOURS) {
      const dt = new Date(year, month, day, hour, 0, 0);
      if (dt.getTime() > now.getTime()) {
        setTargetHour(hour);
        return dt;
      }
    }

    // Se todos passaram, pega o primeiro do dia seguinte
    setTargetHour(PAY_HOURS[0]);
    return new Date(year, month, day + 1, PAY_HOURS[0], 0, 0);
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    // Busca horário do servidor e inicia contador
    const initCountdown = async () => {
      try {
        const res = await fetch(API_PATH);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const { now } = await res.json();
        let serverNow = new Date(now);

        // Define próximo payout
        let next = getNextPayout(serverNow);
        let diffMs = next.getTime() - serverNow.getTime();

        // Função de tick
        const tick = () => {
          if (diffMs <= 0) {
            // Avança para o próximo segundo
            serverNow = new Date(serverNow.getTime() + (1000 - (diffMs % 1000)));
            next = getNextPayout(serverNow);
            diffMs = next.getTime() - serverNow.getTime();
          }
          const totalSec = Math.max(0, Math.floor(diffMs / 1000));
          const hours = Math.floor(totalSec / 3600);
          const mins = Math.floor((totalSec % 3600) / 60);
          const secs = totalSec % 60;

          setCountdown(
            `${hours.toString().padStart(2, '0')}:` +
            `${mins.toString().padStart(2, '0')}:` +
            `${secs.toString().padStart(2, '0')}`
          );
          diffMs -= 1000;
        };

        // primeira chamada imediata
        tick();
        intervalId = setInterval(tick, 1000);
      } catch (err) {
        console.error('Error fetching server time:', err);
        setCountdown('Error');
      }
    };

    initCountdown();
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="w-full mb-4 p-4 bg-[var(--background)] border border-[var(--border)] rounded-xl text-center shadow-md">
      <p className="text-sm text-[var(--foreground)]/70">Next Payout At</p>
      <p className="text-lg sm:text-xl font-semibold text-[var(--foreground)] mb-1">
        {targetHour !== null ? `${targetHour}:00h` : '—'}
      </p>
      <p className="text-2xl font-mono text-[var(--foreground)]">
        {countdown}
      </p>
    </div>
  );
}
