'use client';

import { FaInfoCircle } from 'react-icons/fa';

export default function WarningsPools() {
  return (
    <div className="bg-[var(--background)] border border-[var(--border)] p-4 sm:p-6 mb-6 rounded-xl text-sm sm:text-base text-[var(--foreground)]/80">
      <div className="flex items-center gap-2 font-semibold text-[var(--foreground)]">
        <FaInfoCircle className="text-blue-500" /> How the Voting Pools Work
      </div>
      <ul className="mt-3 space-y-1 list-disc list-inside">
        <li>🧾 Each poll is a decision proposal created by LBX Group.</li>
        <li>💼 The more $LBXO you hold, the stronger your vote weight.</li>
        <li>📈 Your voting power is calculated at the time of voting.</li>
        <li>🔁 50% more tokens = option to update vote weight.</li>
        <li>🔄 300% more tokens = option to change your vote.</li>
        <li>⏰ All changes are allowed up to 24h before poll ends.</li>
      </ul>
    </div>
  );
}
