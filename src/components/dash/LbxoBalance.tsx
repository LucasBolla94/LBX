'use client'

import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/app/lib/firebase'
import { FaCoins } from 'react-icons/fa'

const MINT_LBXO = new PublicKey('CQEPkT5RGWhEYdUFQpeshyxc4z3XXPVq74sehnPFAGu1')
const RPC = 'https://mainnet.helius-rpc.com/?api-key=44a7b170-0809-4848-b621-0f854499407a'

type Props = {
  user?: {
    balance: number
  }
}

export default function LbxoBalance({ user }: Props) {
  const wallet = useWallet()
  const [balance, setBalance] = useState<number>(user?.balance ?? 0)
  const [usdcValue, setUsdcValue] = useState<number | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchBalance = async () => {
      if (!wallet.connected || !wallet.publicKey) return

      try {
        const res = await fetch(RPC, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'getTokenAccountsByOwner',
            params: [
              wallet.publicKey.toBase58(),
              { mint: MINT_LBXO.toBase58() },
              { encoding: 'jsonParsed' },
            ],
          }),
        })

        const data = await res.json()
        const tokenAccount = data.result?.value?.[0]
        const newBalance = tokenAccount?.account?.data?.parsed?.info?.tokenAmount?.uiAmount ?? 0

        setBalance(newBalance)
        setError(false)

        // Atualiza Firestore se necessário
        if (user?.balance !== newBalance) {
          await updateDoc(doc(db, 'users', wallet.publicKey.toBase58()), {
            balance: newBalance,
          })
        }

        // Cotação em USDC
        const quoteUrl = `https://lite-api.jup.ag/swap/v1/quote?inputMint=${MINT_LBXO}&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=1000000000&slippageBps=50`
        const priceRes = await fetch(quoteUrl)
        const priceJson = await priceRes.json()
        const pricePerToken = Number(priceJson.outAmount) / 1_000_000
        setUsdcValue(pricePerToken * newBalance)
      } catch (err) {
        console.error('Erro ao buscar balance via RPC:', err)
        setError(true)
      }
    }

    fetchBalance()
  }, [wallet.connected, wallet.publicKey, user?.balance]) // ✅ dependência adicionada

  return (
    <div className="text-sm text-[var(--foreground)] bg-[var(--border)]/10 p-4 rounded-lg">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <FaCoins />
        <span>{balance.toLocaleString()} LBXO</span>
      </div>
      {usdcValue !== null && (
        <div className="text-xs text-[var(--foreground)]/60 mt-1">
          ≈ ${usdcValue.toFixed(2)} USD
        </div>
      )}
      {error && (
        <div className="text-xs text-red-400 mt-1">
          Failed to load balance from RPC. Showing last saved value.
        </div>
      )}
    </div>
  )
}
