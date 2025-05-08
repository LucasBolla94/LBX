'use client'

import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '@/app/lib/firebase'
import { FaGift, FaRegCopy } from 'react-icons/fa'

export default function RegisterRefer() {
  const wallet = useWallet()
  const [registered, setRegistered] = useState(false)
  const [loading, setLoading] = useState(false)
  const [referCode, setReferCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!wallet.connected || !wallet.publicKey) return

    const checkRefer = async () => {
      const pubkey = wallet.publicKey?.toBase58()
      if (!pubkey) return

      const snap = await getDoc(doc(db, 'users', pubkey))
      if (snap.exists() && snap.data()?.refer) {
        setRegistered(true)
        setReferCode(snap.data().refer)
      }
    }

    checkRefer()
  }, [wallet.connected, wallet.publicKey])

  const handleRegisterRefer = async () => {
    if (!wallet.connected || !wallet.publicKey) {
      alert('Connect your wallet first.')
      return
    }

    const pubkey = wallet.publicKey.toBase58()
    setLoading(true)

    const snap = await getDoc(doc(db, 'users', pubkey))

    if (!snap.exists()) {
      setMessage('❌ You must register your LBXO profile first.')
      setLoading(false)
      return
    }

    const alreadyHasRefer = snap.data()?.refer
    if (alreadyHasRefer) {
      setReferCode(alreadyHasRefer)
      setRegistered(true)
      setMessage(`⚠️ Refer code already set: ${alreadyHasRefer}`)
      setLoading(false)
      return
    }

    const today = new Date()
    const ddmmyy = today.toLocaleDateString('en-GB').replace(/\//g, '').slice(0, 6)
    const walletPrefix = pubkey.slice(0, 5)
    const code = `LBX${ddmmyy}${walletPrefix}`
    const referDate = today.toISOString()

    await updateDoc(doc(db, 'users', pubkey), {
      refer: code,
      'refer-date': referDate,
    })

    setReferCode(code)
    setRegistered(true)
    setMessage(`✅ Refer code created: ${code}`)
    setLoading(false)
  }

  const handleCopy = async () => {
    const fullUrl = `https://lbxgroup.online/ref/${referCode}`
    await navigator.clipboard.writeText(fullUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl p-6 space-y-4 shadow-lg max-w-xl mx-auto mt-8">
      <div className="text-lg font-semibold text-[var(--foreground)] flex items-center gap-2">
        <FaGift /> Register Your Refer Code
      </div>
      <p className="text-sm text-[var(--foreground)]/80">
        By registering your refer code, you can invite friends to join the LBXO community and earn exclusive rewards. Each friend who signs up using your code helps you level up and unlock benefits.
      </p>

      {!registered && (
        <button
          onClick={handleRegisterRefer}
          disabled={loading}
          className="w-full py-2 rounded-md font-bold text-white bg-green-600 hover:bg-green-700 transition"
        >
          {loading ? '⏳ Registering...' : '🎉 Generate My Refer Code'}
        </button>
      )}

      {registered && referCode && (
        <div className="bg-green-100 text-green-800 text-sm p-4 rounded-md border border-green-300 space-y-2">
          <p><strong>Your Refer Link:</strong></p>
          <div className="flex items-center justify-between gap-2">
            <code className="truncate text-sm">{`https://lbxgroup.online/ref/${referCode}`}</code>
            <button
              onClick={handleCopy}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-xs flex items-center gap-1"
            >
              <FaRegCopy /> Copy
            </button>
          </div>
          {copied && (
            <p className="text-xs text-center text-green-700 animate-pulse">✅ Code is been copied</p>
          )}
        </div>
      )}

      {message && (
        <p className="text-sm text-[var(--foreground)]/70 mt-2 text-center">
          {message}
        </p>
      )}
    </div>
  )
}
