'use client';

import { FaCheckCircle, FaSyncAlt, FaEdit } from 'react-icons/fa';

type Props = {
  pool: {
    id: string;
    question: string;
    options: string[];
    endDate: string;
  };
  vote?: {
    id?: string;
    balanceLBXO: number;
    selectedOption: number;
  };
  results: number[];
  balance: number;
  totalSupply: number;
  onVote: (idx: number) => void;
  onRevote: () => void;
  onChangeVote: (idx: number) => void;
  walletConnected: boolean;
  minToVote: number;
};

export default function ModelPool({
  pool,
  vote,
  results,
  balance,
  totalSupply,
  onVote,
  onRevote,
  onChangeVote,
  walletConnected,
  minToVote
}: Props) {
  const oldPct = vote ? ((vote.balanceLBXO / totalSupply) * 100).toFixed(4) : '0.0000';
  const newPct = ((balance / totalSupply) * 100).toFixed(4);
  const end = new Date(pool.endDate).getTime();
  const now = Date.now();
  const allowEdit = end - now > 24 * 60 * 60 * 1000;
  const canRevote = vote && balance >= vote.balanceLBXO * 1.5 && allowEdit;
  const canChange = vote && balance >= vote.balanceLBXO * 4 && allowEdit;

  return (
    <div className="bg-[var(--background)] border border-[var(--border)] rounded-2xl p-6 shadow-md">
      <div className="text-sm text-[var(--foreground)]/60 mb-1">📌 Pool ID: <strong>{pool.id}</strong></div>
      <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">🗳️ Voting Topic:</h3>
      <p className="text-[var(--foreground)]/90 mb-4">{pool.question}</p>

      {!walletConnected ? (
        <p className="text-center text-sm bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-lg p-3">
          ⚠️ Please connect your wallet to vote.
        </p>
      ) : !vote ? (
        balance >= minToVote ? (
          <div className="space-y-2">
            {pool.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => onVote(i)}
                className="w-full py-2 px-4 rounded-lg text-sm font-semibold text-[var(--background)] bg-[var(--foreground)] hover:opacity-90"
              >
                ✅ {opt}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-red-500 bg-red-100 border border-red-300 rounded-lg p-3">
            ❌ Minimum {minToVote.toLocaleString()} $LBXO required. You have {balance.toLocaleString()}.
          </p>
        )
      ) : (
        <>
          <div className="space-y-2 mb-4">
            {pool.options.map((opt, i) => {
              const percent = ((results[i] / totalSupply) * 100).toFixed(2);
              return (
                <div key={i}>
                  <div className="flex justify-between text-sm">
                    <span>{opt}</span>
                    <span>{percent}%</span>
                  </div>
                  <div className="w-full h-2 bg-[var(--border)] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-600" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-xs text-center text-[var(--foreground)]/70 mb-2">
            <FaCheckCircle className="inline mr-1 text-green-500" />
            Your Actual Vote Weight is <strong>{newPct}%</strong>
          </div>
          <div className="text-xs text-center text-[var(--foreground)]/50">
            Supply Total: {totalSupply.toLocaleString()}
          </div>

          {canRevote && (
            <button
              onClick={onRevote}
              className="w-full mt-2 bg-purple-600 text-white py-2 rounded-lg text-sm hover:brightness-110"
            >
              <FaSyncAlt className="inline mr-2" />
              Update Vote Weight ({oldPct}% ➜ {newPct}%)
            </button>
          )}

          {canChange &&
            pool.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => onChangeVote(i)}
                className="w-full flex items-center justify-center gap-2 text-sm text-blue-600 border border-blue-400 bg-blue-100 py-2 mt-1 rounded-lg hover:brightness-105"
              >
                <FaEdit /> Change vote to: {opt}
              </button>
            ))}
        </>
      )}
    </div>
  );
}
