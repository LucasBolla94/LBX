// /src/app/member/miner/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@/components/WalletButton';
import { useRouter } from 'next/navigation';
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import { getAnchorProgram } from '@/app/lib/anchorClient';
import { motion, AnimatePresence } from 'framer-motion';

const GRID_SIZE = 5;
const REWARD_PER_DIAMOND = 20_000;
const START_COST = 50_000;
const MIN_CLICKS_TO_CASHOUT = 3;

function formatNAP(amount: number) {
  return `$${amount.toLocaleString()} $NAP`;
}

export default function MinerGamePage() {
  const wallet = useWallet();
  const router = useRouter();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [grid, setGrid] = useState<number[]>([]);
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const [score, setScore] = useState(0);
  const [earned, setEarned] = useState(0);

  const startGame = async () => {
    if (!wallet.publicKey) return;

    const program = getAnchorProgram(wallet);

    const [gamePda] = await PublicKey.findProgramAddress(
      [Buffer.from("game"), wallet.publicKey.toBuffer()],
      program.programId
    );

    const [vaultPda] = await PublicKey.findProgramAddress(
      [Buffer.from("vault")],
      program.programId
    );

    try {
      await program.methods
        .startGame()
        .accounts({
          player: wallet.publicKey,
          gameState: gamePda,
          vault: vaultPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      const gameState = await program.account.gameState.fetch(gamePda);
      setGrid(gameState.grid);
      setRevealed(gameState.revealed);
      setEarned(gameState.earned.toNumber());
      setScore(gameState.revealed.filter(Boolean).length);
      setGameStarted(true);
      setGameOver(false);
    } catch (err) {
      console.error('StartGame error:', err);
    }
  };

  const handleClick = async (index: number) => {
    if (!wallet.publicKey || revealed[index] || gameOver) return;

    const program = getAnchorProgram(wallet);
    const [gamePda] = await PublicKey.findProgramAddress(
      [Buffer.from("game"), wallet.publicKey.toBuffer()],
      program.programId
    );

    try {
      await program.methods.reveal(index).accounts({
        gameState: gamePda,
        player: wallet.publicKey,
      }).rpc();

      const gameState = await program.account.gameState.fetch(gamePda);
      setGrid(gameState.grid);
      setRevealed(gameState.revealed);
      setEarned(gameState.earned.toNumber());
      setScore(gameState.revealed.filter(Boolean).length);
      if (gameState.isDead) {
        setGameOver(true);
        setGameStarted(false);
      }
    } catch (err) {
      console.error('Reveal error:', err);
    }
  };

  const cashOut = async () => {
    if (!wallet.publicKey) return;
    const program = getAnchorProgram(wallet);
    const [gamePda] = await PublicKey.findProgramAddress(
      [Buffer.from("game"), wallet.publicKey.toBuffer()],
      program.programId
    );

    const [vaultPda] = await PublicKey.findProgramAddress(
      [Buffer.from("vault")],
      program.programId
    );

    try {
      await program.methods.cashOut().accounts({
        player: wallet.publicKey,
        gameState: gamePda,
        vault: vaultPda,
      }).rpc();
      alert(`💰 You won ${formatNAP(earned)}!`);
      resetGame();
    } catch (err) {
      console.error('CashOut error:', err);
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setGrid([]);
    setRevealed([]);
    setScore(0);
    setEarned(0);
  };

  const clicksLeft = Math.max(MIN_CLICKS_TO_CASHOUT - score, 0);
  const totalLoss = START_COST + earned;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white p-4">
      <WalletMultiButton className="mb-6" />

      <motion.h1
        className="text-4xl md:text-5xl font-bold mb-2 text-center"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        💎 Find the Diamonds and Earn <span className="text-yellow-400">$NAP</span>
      </motion.h1>

      <p className="mb-4 text-lg text-center text-gray-300 max-w-md">
        Click to find 💎 and earn <span className="text-emerald-400 font-bold">{formatNAP(REWARD_PER_DIAMOND)}</span> each.
        Don’t hit the 💣 or you’ll lose everything!
      </p>

      {!gameStarted && !gameOver && wallet.connected && (
        <motion.button
          onClick={startGame}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mb-8 bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 rounded-xl text-xl shadow-lg"
        >
          🚀 Start Game (Cost: {formatNAP(START_COST)})
        </motion.button>
      )}

      <AnimatePresence>
        {gameStarted && grid.length > 0 && (
          <>
            <motion.div
              layout
              className="grid gap-2"
              style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 60px)` }}
            >
              {grid.map((cell, i) => (
                <motion.button
                  key={i}
                  onClick={() => handleClick(i)}
                  whileTap={{ scale: 0.9 }}
                  className={`w-[60px] h-[60px] rounded-xl text-xl font-bold transition-all
                    ${
                      revealed[i]
                        ? cell === 2
                          ? 'bg-red-600'
                          : 'bg-emerald-500'
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                >
                  {revealed[i] ? (cell === 2 ? '💣' : '💎') : '❓'}
                </motion.button>
              ))}
            </motion.div>

            <motion.div className="mt-6 text-center">
              <motion.p
                key={earned}
                className="text-xl font-semibold text-white mb-2"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                💰 Earned: <span className="text-green-400">{formatNAP(earned)}</span>
              </motion.p>

              {score < MIN_CLICKS_TO_CASHOUT && (
                <p className="text-yellow-400 text-sm">
                  🕒 {clicksLeft} more {clicksLeft === 1 ? 'click' : 'clicks'} to unlock Cash Out
                </p>
              )}

              {score >= MIN_CLICKS_TO_CASHOUT && (
                <motion.button
                  onClick={cashOut}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-xl shadow-md text-lg font-semibold mt-3"
                >
                  🏆 Cash Out {formatNAP(earned)}
                </motion.button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {gameOver && (
        <motion.div
          className="mt-10 text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <p className="text-red-400 text-xl font-bold mb-2 animate-pulse">
            💥 You hit a bomb and lost everything!
          </p>
          <p className="text-gray-300 text-lg mb-4">
            You lost a total of <span className="text-red-400 font-bold">{formatNAP(totalLoss)}</span> including the entry fee.
          </p>
          <button
            onClick={resetGame}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl font-semibold shadow-md"
          >
            🔁 Try Again
          </button>
        </motion.div>
      )}
    </div>
  );
}
