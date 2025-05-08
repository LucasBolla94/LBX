'use client'

import React, { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useRouter } from 'next/navigation'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/app/lib/firebase'
import { PublicKey } from '@solana/web3.js'
import Perfil from '@/components/dash/UserDetails'
import BadgeTable from '@/components/dash/BadgeTable'
import Menu, { SectionItem } from '@/components/dash/Menu'

const TOKEN_MINT = new PublicKey('CQEPkT5RGWhEYdUFQpeshyxc4z3XXPVq74sehnPFAGu1')
const RPC_URL = 'https://mainnet.helius-rpc.com/?api-key=5bf3b96d-29b1-4443-a8ab-3739b20c2bea'

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

  const [userBalance, setUserBalance] = useState(0)
  const [minRequired, setMinRequired] = useState(100)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  const hasAccess = wallet.connected && userBalance >= minRequired

  useEffect(() => {
    const fetchData = async () => {
      if (!wallet.connected || !wallet.publicKey) {
        router.push('/')
        return
      }

      try {
        const configSnap = await getDoc(doc(db, 'config', 'min-dash'))
        const value = configSnap.exists() ? Number(configSnap.data().value) : 100
        setMinRequired(value)

        const rpcRes = await fetch(RPC_URL, {
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

        const rpcData = await rpcRes.json()
        const tokenAccounts = rpcData?.result?.value
        const amount = tokenAccounts?.[0]?.account?.data?.parsed?.info?.tokenAmount?.uiAmount || 0

        setUserBalance(Number(amount))

        if (amount < value) {
          router.push('/')
          return
        }

        const userSnap = await getDoc(doc(db, 'users', wallet.publicKey.toBase58()))
        setUserData(userSnap.exists() ? (userSnap.data() as UserData) : null)
      } catch {
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [wallet.connected, wallet.publicKey, router])

  if (loading) {
    return (
      <main className="p-6 text-center text-sm text-[var(--foreground)]/70">
        Checking wallet access...
      </main>
    )
  }

  const sections: SectionItem[] = [
    {
      id: 'rewards',
      title: '🎉 My Rewards',
      locked: false,
      configDoc: 'my-rewards',
      content: <p className="text-sm">Your rewards details go here.</p>,
    },
    {
      id: 'votes',
      title: '🗳️ Voting Pools',
      locked: false,
      configDoc: 'voting-pools',
      content: <p className="text-sm">Voting pools content will be shown here.</p>,
    },
    {
      id: 'activity',
      title: '📜 Activity Log',
      locked: false,
      configDoc: 'activity-log',
      content: <p className="text-sm">History and activity log content.</p>,
    },
    {
      id: 'campaigns',
      title: '📣 Campaigns',
      locked: false,
      configDoc: 'campaigns',
      content: <p className="text-sm">Upcoming campaigns and limited offers will appear here.</p>,
    },
    {
      id: 'badges',
      title: '🏅 My Badges',
      locked: false,
      content: <BadgeTable />,
    },
  ]

  return (
    <main className="p-4 sm:p-6 max-w-screen-md mx-auto text-[var(--foreground)]">
      <section className="mb-8">
        {hasAccess && userData && <Perfil user={userData} />}
        {!hasAccess && (
          <div className="text-center text-sm text-[var(--foreground)]/60">
            Connect your wallet and hold at least <strong>{minRequired} LBXO</strong> to access the dashboard.
          </div>
        )}
      </section>

      {hasAccess && <Menu sections={sections} />}
    </main>
  )
}
