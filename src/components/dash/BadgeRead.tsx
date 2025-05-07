// components/BadgeRead.tsx
'use client'

import React, { useEffect } from 'react'
import Image from 'next/image'
import { FaStar } from 'react-icons/fa'

type User = {
  level: number
  mod?: boolean
  admin?: boolean
}

type Props = {
  user: User
}

type Badge = {
  name: string
  image: string
  min: number
  max: number
  starColor?: string
}

const badges: Badge[] = [
  { name: 'Stardust',           min: 0,         max: 9_999,     image: '/badges/badge01.png' },
  { name: 'Explorer',           min: 10_000,    max: 29_999,    image: '/badges/badge02.png' },
  { name: 'Starborn',           min: 30_000,    max: 79_999,    image: '/badges/badge03.png' },
  { name: 'Nova Core',          min: 80_000,    max: 179_999,   image: '/badges/badge04.png' },
  { name: 'Cosmos Overlord',    min: 180_000,   max: 499_999,   image: '/badges/badge05.png' },
  { name: 'Celestial Apex',     min: 500_000,   max: 999_999,   image: '/badges/badge06.png' },
  { name: 'Quantum Ascendant',  min: 1_000_000, max: Infinity,  image: '/badges/badge07.png' },
  // Especial
  { name: 'Infinity Warden',    min: -1,        max: -1,        image: '/badges/badgemod.png',     starColor: 'purple' },
  { name: 'Aether',             min: -2,        max: -2,        image: '/badges/badgefounder.png', starColor: 'purple' },
]

export default function BadgeRead({ user }: Props) {
  const { level, mod = false, admin = false } = user

  useEffect(() => {
    console.log('BadgeRead user →', user)
  }, [user])

  // 1) Admin → Founder + 5 estrelas roxas
  if (admin) {
    const founder = badges.find(b => b.name === 'Aether')!
    return (
      <div className="flex flex-col items-center gap-1">
        <div className="relative w-12 h-12 sm:w-14 sm:h-14">
          <Image src={founder.image} alt={founder.name} fill className="object-contain" />
        </div>
        <div className="flex gap-[2px] text-sm">
          {Array.from({ length: 5 }).map((_, i) => (
            <FaStar key={i} style={{ color: 'purple' }} />
          ))}
        </div>
      </div>
    )
  }

  // 2) Mod → Infinity Warden + 1 estrela roxa
  if (mod) {
    const modBadge = badges.find(b => b.name === 'Infinity Warden')!
    return (
      <div className="flex flex-col items-center gap-1">
        <div className="relative w-12 h-12 sm:w-14 sm:h-14">
          <Image src={modBadge.image} alt={modBadge.name} fill className="object-contain" />
        </div>
        <div className="flex gap-[2px] text-sm">
          <FaStar style={{ color: 'purple' }} />
        </div>
      </div>
    )
  }

  // 3) Usuário normal → badge por level + até 5 estrelas douradas
  const normalBadge = badges.find(b => level >= b.min && level <= b.max)
  if (!normalBadge) {
    return <div className="text-sm text-[var(--foreground)]/60">Unranked</div>
  }

  // Divide o intervalo [min, max] em 5 partes iguais
  const { min, max, starColor } = normalBadge
  const span = max - min
  const segment = span / 5
  const offset = level - min
  // Calcula número de estrelas de 1 a 5
  const stars = span > 0
    ? Math.min(5, Math.max(1, Math.floor(offset / segment) + 1))
    : 0

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-12 h-12 sm:w-14 sm:h-14">
        <Image src={normalBadge.image} alt={normalBadge.name} fill className="object-contain" />
      </div>
      {stars > 0 && (
        <div className="flex gap-[2px] text-sm">
          {Array.from({ length: stars }).map((_, i) => (
            <FaStar
              key={i}
              style={{ color: starColor === 'purple' ? 'purple' : 'gold' }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
