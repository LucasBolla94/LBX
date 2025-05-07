'use client'

import React, { useState } from 'react'
import { FaChevronDown, FaChevronUp, FaLock } from 'react-icons/fa'
import Perfil from '@/components/dash/UserDetails'
import Register from '@/components/dash/Register'
import BadgeTable from '@/components/dash/BadgeTable'

// Simulação de perfil (substitua por dados reais do Firestore ou Auth)
const mockUser = undefined // ou substitua com objeto real do Firestore

export default function DashV2Page() {
  const [openSection, setOpenSection] = useState<string | null>(null)
  const user = mockUser

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id)
  }

  const sections = [
    {
      id: 'rewards',
      title: 'My Rewards',
      locked: !user,
      content: <p className="text-sm">Your rewards details go here.</p>,
    },
    {
      id: 'votes',
      title: 'Voting Pools',
      locked: !user,
      content: <p className="text-sm">Voting pools content will be shown here.</p>,
    },
    {
      id: 'activity',
      title: 'Activity Log',
      locked: !user,
      content: <p className="text-sm">History and activity log content.</p>,
    },
    {
      id: 'badges',
      title: 'My Badges',
      locked: false, // badges sempre disponível
      content: <BadgeTable />,
    },
  ]

  return (
    <main className="p-4 sm:p-6 max-w-screen-md mx-auto text-[var(--foreground)]">
      {/* Perfil ou Registro */}
      <section className="mb-8">
        {user ? <Perfil user={user} /> : <Register />}
      </section>

      {/* Mensagem de incentivo acima das seções */}
      {!user && (
        <div className="mb-4 text-sm text-center text-[var(--foreground)]/60">
          Please register your profile to unlock all dashboard features. You can still view badges 👇
        </div>
      )}

      {/* Containers expansíveis */}
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

              {/* Conteúdo expansível com scroll e altura máxima */}
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
