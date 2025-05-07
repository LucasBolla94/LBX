'use client'

import { useState, useEffect, useRef } from 'react'
import { db, storage } from '@/app/lib/firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import {
  FaDiscord,
  FaTelegramPlane,
  FaTwitter,
  FaUserAlt,
  FaCoins,
  FaUserCircle,
} from 'react-icons/fa'
import UserDetails from '../dash/UserDetails'

const LBX_MINT = new PublicKey('CQEPkT5RGWhEYdUFQpeshyxc4z3XXPVq74sehnPFAGu1')
const RPC = 'https://mainnet.helius-rpc.com/?api-key=44a7b170-0809-4848-b621-0f854499407a'

type UserDoc = {
  ['perfil-img']: string
  nick: string
  level: number
  balance: number
  dateStamp: string
  social: {
    discord?: string
    telegram?: string
    x?: string
  }
}

export default function Register() {
  const wallet = useWallet()
  const inputFileRef = useRef<HTMLInputElement>(null)
  const [balance, setBalance] = useState(0)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState({
    nick: '',
    discord: '',
    telegram: '',
    x: '',
    avatarFile: null as File | null,
  })
  const [registered, setRegistered] = useState(false)
  const [userDoc, setUserDoc] = useState<UserDoc | null>(null)

  useEffect(() => {
    if (!wallet.connected || !wallet.publicKey) return
    const pubkey = wallet.publicKey

    ;(async () => {
      try {
        // Fetch on-chain balance
        const res = await fetch(RPC, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'getTokenAccountsByOwner',
            params: [pubkey.toBase58(), { mint: LBX_MINT.toBase58() }, { encoding: 'jsonParsed' }],
          }),
        })
        const json = await res.json()
        const amt = json.result?.value?.[0]?.account?.data?.parsed?.info?.tokenAmount?.uiAmount || 0
        setBalance(amt)
      } catch {
        setBalance(0)
      }

      // Fetch existing user
      const userRef = doc(db, 'users', pubkey.toBase58())
      const snap = await getDoc(userRef)
      if (snap.exists()) {
        setRegistered(true)
        setUserDoc(snap.data() as UserDoc)
      }
    })()
  }, [wallet.connected, wallet.publicKey])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target
    if (name === 'avatarFile' && files?.[0]) {
      const file = files[0]
      if (file.size > 5 * 1024 * 1024) {
        alert('Imagem muito grande. Use até 5MB (PNG ou JPG).')
        return
      }
      setForm((f) => ({ ...f, avatarFile: file }))
    } else {
      setForm((f) => ({ ...f, [name]: value }))
    }
  }

  const handleSubmit = async () => {
    if (!wallet.connected || !wallet.publicKey) return
    const walletAddress = wallet.publicKey.toBase58()
    let avatarUrl = ''

    if (form.avatarFile) {
      try {
        const storageRef = ref(storage, `${walletAddress}/img`)
        await uploadBytes(storageRef, form.avatarFile)
        avatarUrl = await getDownloadURL(storageRef)
      } catch {
        alert('Erro ao subir imagem. Verifique o formato e tamanho (até 5MB).')
        return
      }
    }

    const userPayload: UserDoc = {
      ['perfil-img']: avatarUrl,
      nick: form.nick.trim(),
      level: 0,
      balance,
      dateStamp: new Date().toISOString(),
      social: {
        discord: form.discord.trim(),
        telegram: form.telegram.trim(),
        x: form.x.trim(),
      },
    }

    await setDoc(doc(db, 'users', walletAddress), userPayload)
    setRegistered(true)
    setUserDoc(userPayload)
  }

  // Renderiza detalhes se registrado (userDoc sempre definido quando registered === true)
  if (registered) {
    return <UserDetails user={userDoc!} />
  }

  // Enquanto o formulário não está aberto
  if (!formOpen) {
    return (
      <div
        onClick={() => setFormOpen(true)}
        className="cursor-pointer text-center p-4 border border-purple-400 rounded-lg bg-purple-50 dark:bg-[var(--background)] text-purple-500 font-semibold text-sm hover:scale-105 transition-all duration-200 animate-pulse shadow-md"
      >
        ✨ Click here to create your LBXO profile
      </div>
    )
  }

  // Formulário de registro
  return (
    <div className="w-full max-w-2xl mx-auto bg-[var(--background)] border border-[var(--border)] rounded-xl shadow-lg p-6 space-y-6">
      {/* Avatar upload */}
      <div className="flex flex-col items-center gap-2">
        <div
          onClick={() => inputFileRef.current?.click()}
          className="cursor-pointer relative group"
        >
          {form.avatarFile ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={URL.createObjectURL(form.avatarFile)}
              alt="Preview"
              className="w-24 h-24 rounded-full object-cover border border-[var(--border)]"
            />
          ) : (
            <FaUserCircle className="w-24 h-24 text-[var(--foreground)]/40" />
          )}
          <div className="absolute bottom-0 right-0 bg-purple-500 text-white text-xs rounded-full px-2 py-0.5 hidden group-hover:block">
            Upload
          </div>
        </div>
        <input
          ref={inputFileRef}
          type="file"
          name="avatarFile"
          accept=".png,.jpg,.jpeg"
          onChange={handleChange}
          className="hidden"
        />
        <p className="text-xs text-[var(--foreground)]/60">
          Max: 5MB | PNG ou JPG | 500x500px recomendado
        </p>
      </div>

      {/* Nickname */}
      <div>
        <label className="text-sm font-medium text-[var(--foreground)] flex items-center gap-2">
          <FaUserAlt /> Your Nickname
        </label>
        <input
          name="nick"
          placeholder="Example: crypto_maria"
          value={form.nick}
          onChange={handleChange}
          className="w-full mt-1 p-2 rounded-md border bg-transparent text-[var(--foreground)]"
        />
        <p className="text-xs text-[var(--foreground)]/60 mt-1">
          This is your public name inside the LBXO community.
        </p>
      </div>

      {/* Social links */}
      {[
        { label: 'Discord', icon: <FaDiscord />, name: 'discord', placeholder: 'https://discord.com/...' },
        { label: 'Telegram', icon: <FaTelegramPlane />, name: 'telegram', placeholder: 'https://t.me/...' },
        { label: 'X (Twitter)', icon: <FaTwitter />, name: 'x', placeholder: 'https://x.com/...' },
      ].map(({ label, icon, name, placeholder }) => (
        <div key={name}>
          <label className="text-sm font-medium text-[var(--foreground)] flex items-center gap-2">
            {icon} {label} (optional)
          </label>
          <input
            name={name}
            placeholder={placeholder}
            value={form[name as keyof typeof form] as string}
            onChange={handleChange}
            className="w-full mt-1 p-2 rounded-md border bg-transparent text-[var(--foreground)]"
          />
        </div>
      ))}

      {/* Balance */}
      <div className="flex items-center gap-2 text-sm text-[var(--foreground)]/80 bg-[var(--border)]/10 rounded-md p-3">
        <FaCoins className="text-yellow-400" /> You have: <strong>{balance.toLocaleString()} $LBXO</strong>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="w-full bg-purple-600 text-white py-2 rounded-md font-bold hover:bg-purple-700 transition"
      >
        🚀 Finish and Register My Profile
      </button>
    </div>
  )
}
