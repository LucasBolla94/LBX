'use client';

import { useEffect, useState } from 'react';

const API_PATH = '/api/server-time';

export default function WithdrawTime() {
  const [countdown, setCountdown] = useState<string>('Loading...');
  const [targetHour, setTargetHour] = useState<number | null>(null);

  const getNextPayout = (now: Date): Date => {
    const next = new Date(now);
    next.setMinutes(0, 0, 0);
    next.setHours(now.getHours() + 1);
    setTargetHour(next.getHours());
    return next;
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const initCountdown = async () => {
      try {
        const res = await fetch(API_PATH);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const { now } = await res.json();
        let serverNow = new Date(now);

        let next = getNextPayout(serverNow);
        let diffMs = next.getTime() - serverNow.getTime();

        const tick = () => {
          if (diffMs <= 0) {
            serverNow = new Date(serverNow.getTime() + 1000);
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
    <div className="w-full mb-4 p-6 bg-[var(--background)] border border-[var(--border)] rounded-xl text-center shadow-lg">
      <h3 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] mb-2">
        💸 Withdraws are processed hourly
      </h3>
      <p className="text-sm sm:text-base text-[var(--foreground)]/80 mb-4 max-w-xl mx-auto">
        All withdrawal requests are automatically processed at the **start of each hour** (e.g., 13:00, 14:00, 15:00...). 
        If you request a withdrawal now, it will be paid out at the next full hour. 
        See below how much time is left until the next payout:
      </p>

      <p className="text-sm text-[var(--foreground)]/70">Next Payout At</p>
      <p className="text-lg sm:text-xl font-semibold text-[var(--foreground)] mb-1">
        {targetHour !== null ? `${targetHour}:00h` : '—'}
      </p>
      <p className="text-3xl font-mono text-[var(--foreground)]">
        {countdown}
      </p>
    </div>
  );
}
