'use client'

import React, { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useRouter } from 'next/navigation'
import { FaChevronDown, FaChevronUp, FaLock } from 'react-icons/fa'
import Perfil from '@/components/dash/UserDetails'
import Register from '@/components/dash/Register'
import BadgeTable from '@/components/dash/BadgeTable'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/app/lib/firebase'
import { PublicKey } from '@solana/web3.js'

const TOKEN_MINT = new PublicKey('CQEPkT5RGWhEYdUFQpeshyxc4z3XXPVq74sehnPFAGu1')
const RPC_URL = 'https://mainnet.helius-rpc.com/?api-key=5bf3b96d-29b1-4443-a8ab-3739b20c2bea'

// ✅ Tipagem correta do perfil de usuário
interface UserData {
  nick: string
  level: number
  dateStamp: string
  balance?: number
  mod?: boolean
  admin?: boolean
  'perfil-img'?: string
  social: {
    discord?: string
    telegram?: string
    x?: string
  }
}

export default function DashV2Page() {
  const wallet = useWallet()
  const router = useRouter()

  const [userBalance, setUserBalance] = useState<number>(0)
  const [minRequired, setMinRequired] = useState<number>(100)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [openSection, setOpenSection] = useState<string | null>(null)

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id)
  }

  useEffect(() => {
    const checkAccess = async () => {
      if (!wallet.connected || !wallet.publicKey) {
        router.push('/')
        return
      }

      try {
        const snap = await getDoc(doc(db, 'config', 'min-dash'))
        const value = snap.exists() ? Number(snap.data().value) : 100
        setMinRequired(value)

        const response = await fetch(RPC_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'getTokenAccountsByOwner',
            params: [
              wallet.publicKey.toBase58(),
              { mint: TOKEN_MINT.toBase58() },
              { encoding: 'jsonParsed' },
            ],
          }),
        })

        const data = await response.json()
        let balance = 0

        if (data.result && data.result.value.length > 0) {
          const tokenAccount = data.result.value[0]
          const uiAmount = tokenAccount.account.data.parsed.info.tokenAmount.uiAmount
          balance = Number(uiAmount)
        }

        setUserBalance(balance)

        if (balance < value) {
          router.push('/')
          return
        }

        const userSnap = await getDoc(doc(db, 'users', wallet.publicKey.toBase58()))
        if (userSnap.exists()) {
          setUserData(userSnap.data() as UserData)
        } else {
          setUserData(null)
        }

      } catch (error) {
        console.error('Erro ao checar acesso ao dashboard:', error)
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    checkAccess()
  }, [wallet.connected, wallet.publicKey, router])

  const hasAccess = wallet.connected && userBalance >= minRequired

  if (loading) {
    return (
      <main className="p-6 text-center text-sm text-[var(--foreground)]/70">
        Checking wallet access...
      </main>
    )
  }

  const sections = [
    {
      id: 'rewards',
      title: 'My Rewards',
      locked: true,
      content: <p className="text-sm">Your rewards details go here.</p>,
    },
    {
      id: 'votes',
      title: 'Voting Pools',
      locked: true,
      content: <p className="text-sm">Voting pools content will be shown here.</p>,
    },
    {
      id: 'activity',
      title: 'Activity Log',
      locked: true,
      content: <p className="text-sm">History and activity log content.</p>,
    },
    {
      id: 'campaigns',
      title: (
        <span className="flex items-center gap-2">
          Campaigns
          <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-400 text-black font-semibold animate-pulse">
            New soon!
          </span>
        </span>
      ),
      locked: true,
      content: <p className="text-sm">Upcoming campaigns and limited offers will appear here.</p>,
    },
    {
      id: 'badges',
      title: 'My Badges',
      locked: false,
      content: <BadgeTable />,
    },
  ]

  return (
    <main className="p-4 sm:p-6 max-w-screen-md mx-auto text-[var(--foreground)]">
      <section className="mb-8">
        {hasAccess ? (
          userData ? <Perfil user={userData} /> : <p>Loading profile...</p>
        ) : (
          <Register />
        )}
      </section>

      {!hasAccess && (
        <div className="mb-4 text-sm text-center text-[var(--foreground)]/60">
          Connect your wallet and hold at least <strong>{minRequired} LBXO</strong> to access the dashboard.
        </div>
      )}

      <div className="space-y-4">
        {sections.map(({ id, title, locked, content }) => {
          const isOpen = openSection === id
          return (
            <div
              key={id}
              className={`border border-[var(--border)] bg-[var(--background)] rounded-xl shadow-sm transition-all ${
                locked ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <button
                onClick={() => !locked && toggleSection(id)}
                disabled={locked}
                aria-expanded={!locked && isOpen}
                className="w-full flex justify-between items-center px-4 py-3 text-base sm:text-lg font-medium text-left hover:bg-[var(--border)]/10 transition"
              >
                <span className="flex items-center gap-2">
                  {locked && <FaLock className="text-[var(--foreground)]/50" />}
                  {title}
                </span>
                {!locked && (isOpen ? <FaChevronUp /> : <FaChevronDown />)}
              </button>

              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isOpen && !locked ? 'max-h-[600px] p-4' : 'max-h-0 p-0'
                }`}
              >
                {!locked && isOpen && (
                  <div className="text-sm max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[var(--border)] scrollbar-track-transparent">
                    {content}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}
