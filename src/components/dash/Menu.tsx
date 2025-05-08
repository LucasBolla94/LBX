'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { FaChevronDown, FaChevronUp, FaLock, FaClock } from 'react-icons/fa'
import { db } from '@/app/lib/firebase'
import { getDoc, doc as firestoreDoc, Timestamp } from 'firebase/firestore'
import RegisterWarning from '@/components/dash/RegisterWarning'
import Register from '@/components/dash/Register'
import RegisterRefer from '@/components/dash/promo/RegisterRefer'
import QaForm from '@/components/dash/promo/QaForm' // ✅ IMPORTAÇÃO ADICIONADA
import { useWallet } from '@solana/wallet-adapter-react'

export interface SectionItem {
  id: string
  title: React.ReactNode
  locked: boolean
  content: React.ReactNode
  configDoc?: string
  requireNoProfile?: boolean
}

interface MenuProps {
  sections: SectionItem[]
}

function formatCountdown(ms: number) {
  const totalSeconds = Math.floor(ms / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const parts = []
  if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`)
  if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`)
  if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`)
  parts.push(`${seconds} second${seconds > 1 ? 's' : ''}`)

  return parts.join(', ')
}

export default function Menu({ sections }: MenuProps) {
  const wallet = useWallet()
  const [openSection, setOpenSection] = useState<string | null>(null)
  const [timers, setTimers] = useState<Record<string, string>>({})
  const [dynamicLocks, setDynamicLocks] = useState<Record<string, boolean>>({})
  const [hasProfile, setHasProfile] = useState<boolean | null>(null)

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id)
  }

  useEffect(() => {
    if (!wallet.connected || !wallet.publicKey) return
    getDoc(firestoreDoc(db, 'users', wallet.publicKey.toBase58())).then(snap => {
      setHasProfile(snap.exists())
    })
  }, [wallet.connected, wallet.publicKey])

  const extraSections = useMemo(() => {
    const extras: SectionItem[] = []

    if (hasProfile === false) {
      extras.push({
        id: 'register',
        title: '🎯 Create Your LBXO Profile',
        locked: false,
        configDoc: 'register-promo',
        requireNoProfile: true,
        content: (
          <div className="space-y-4">
            <RegisterWarning />
            <Register />
          </div>
        ),
      })
    }

    extras.push(
      {
        id: 'register-ref',
        title: '🎁 Invite & Earn (Refer Code)',
        locked: false,
        configDoc: 'register-ref',
        content: <RegisterRefer />,
      },
      {
        id: 'qa-form',
        title: '🧠 Learn & Earn: Questions & Answers',
        locked: false,
        configDoc: 'qa-form',
        content: <QaForm />,
      }
    )

    return extras
  }, [hasProfile])

  const combinedSections = useMemo(() => {
    return [...extraSections, ...sections]
  }, [extraSections, sections])

  useEffect(() => {
    const intervals: NodeJS.Timeout[] = []

    combinedSections.forEach(section => {
      if (!section.configDoc) return

      getDoc(firestoreDoc(db, 'config', section.configDoc))
        .then(snap => {
          if (!snap.exists()) {
            setDynamicLocks(prev => ({ ...prev, [section.id]: true }))
            setTimers(prev => ({ ...prev, [section.id]: 'new-soon' }))
            return
          }

          const config = snap.data()
          const enabled = config.status === true
          const start = (config['start-date'] as Timestamp).toMillis()
          const end = (config['end-date'] as Timestamp).toMillis()
          const now = Date.now()

          if (!enabled) {
            setDynamicLocks(prev => ({ ...prev, [section.id]: true }))
            setTimers(prev => ({ ...prev, [section.id]: 'new-soon' }))
            return
          }

          if (now < start) {
            setDynamicLocks(prev => ({ ...prev, [section.id]: true }))
            const interval = setInterval(() => {
              const diff = start - Date.now()
              if (diff <= 0) {
                clearInterval(interval)
                setDynamicLocks(prev => ({ ...prev, [section.id]: false }))
              } else {
                setTimers(prev => ({ ...prev, [section.id]: `Starts in: ${formatCountdown(diff)}` }))
              }
            }, 1000)
            intervals.push(interval)
          } else if (now >= start && now < end) {
            setDynamicLocks(prev => ({ ...prev, [section.id]: false }))
            const interval = setInterval(() => {
              const diff = end - Date.now()
              if (diff <= 0) {
                clearInterval(interval)
                setDynamicLocks(prev => ({ ...prev, [section.id]: true }))
                setTimers(prev => ({ ...prev, [section.id]: 'ended' }))
              } else {
                setTimers(prev => ({ ...prev, [section.id]: `Ends in: ${formatCountdown(diff)}` }))
              }
            }, 1000)
            intervals.push(interval)
          } else {
            setDynamicLocks(prev => ({ ...prev, [section.id]: true }))
            setTimers(prev => ({ ...prev, [section.id]: 'ended' }))
          }
        })
        .catch(() => {
          setDynamicLocks(prev => ({ ...prev, [section.id]: true }))
          setTimers(prev => ({ ...prev, [section.id]: 'new-soon' }))
        })
    })

    return () => intervals.forEach(clearInterval)
  }, [combinedSections])

  return (
    <div className="space-y-4">
      {combinedSections.map(({ id, title, locked, content, configDoc }) => {
        const isOpen = openSection === id
        const isLocked = configDoc ? dynamicLocks[id] ?? true : locked
        const status = timers[id]

        return (
          <div
            key={id}
            className={`border border-[var(--border)] bg-[var(--background)] rounded-xl shadow-sm transition-all ${
              isLocked ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <button
              onClick={() => !isLocked && toggleSection(id)}
              disabled={isLocked}
              aria-expanded={!isLocked && isOpen}
              className="w-full flex justify-between items-center px-4 py-3 text-base sm:text-lg font-medium text-left hover:bg-[var(--border)]/10 transition"
            >
              <span className="flex items-center gap-2">
                {isLocked && <FaLock className="text-[var(--foreground)]/50" />}
                {title}
                {status?.startsWith('Starts in') && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-300 text-black font-semibold animate-pulse flex items-center gap-1">
                    <FaClock /> {status}
                  </span>
                )}
                {status?.startsWith('Ends in') && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-600 text-white font-semibold animate-pulse flex items-center gap-1">
                    <FaClock /> {status}
                  </span>
                )}
                {status === 'new-soon' && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-400 text-black font-semibold animate-pulse">
                    New Soon
                  </span>
                )}
                {status === 'ended' && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-500 text-white font-semibold">
                    Promo Ended
                  </span>
                )}
              </span>
              {!isLocked && (isOpen ? <FaChevronUp /> : <FaChevronDown />)}
            </button>

            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isOpen && !isLocked ? 'max-h-[700px] p-4' : 'max-h-0 p-0'
              }`}
            >
              {!isLocked && isOpen && (
                <div className="text-sm max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[var(--border)] scrollbar-track-transparent">
                  {content}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
