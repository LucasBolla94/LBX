'use client'

import Image from 'next/image'
import { FaStar } from 'react-icons/fa'

type Props = {
  level: number
}

type Badge = {
  name: string
  min: number
  max: number
  image: string
  starColor?: string
}

const badges: Badge[] = [
  { name: 'Stardust', min: 0, max: 9_999, image: '/badges/badge01.png' },
  { name: 'Explorer', min: 10_000, max: 29_999, image: '/badges/badge02.png' },
  { name: 'Starborn', min: 30_000, max: 79_999, image: '/badges/badge03.png' },
  { name: 'Nova Core', min: 80_000, max: 179_999, image: '/badges/badge04.png' },
  { name: 'Cosmos Overlord', min: 180_000, max: 499_999, image: '/badges/badge05.png' },
  { name: 'Celestial Apex', min: 500_000, max: 999_999, image: '/badges/badge06.png' },
  { name: 'Quantum Ascendant', min: 1_000_000, max: Infinity, image: '/badges/badge07.png' },
  { name: 'Infinity Warden', min: -1, max: -1, image: '/badges/badgemod.png', starColor: 'purple' },
  { name: 'Aether', min: -2, max: -2, image: '/badges/badgefounder.png', starColor: 'purple' },
]

export default function BadgeRead({ level }: Props) {
  let badge = badges.find(b => level >= b.min && level <= b.max)

  if (level === -1) badge = badges.find(b => b.name === 'Infinity Warden')
  if (level === -2) badge = badges.find(b => b.name === 'Aether')

  const totalRange = badge ? badge.max - badge.min : 1
  const progress = badge ? Math.max(0, Math.min(level - badge.min, totalRange)) : 0
  const stars = Math.min(5, Math.floor((progress / totalRange) * 5))

  return (
    <div className="flex flex-col items-center justify-center gap-1">
      {/* Badge image responsiva e menor */}
      {badge ? (
        <div className="relative w-12 h-12 sm:w-14 sm:h-14">
          <Image
            src={badge.image}
            alt={badge.name}
            fill
            className="object-contain"
            sizes="(max-width: 640px) 48px, 56px"
          />
        </div>
      ) : (
        <div className="text-sm text-[var(--foreground)]/60">Unranked</div>
      )}

      {/* Estrelas abaixo */}
      {badge && (
        <div className="flex gap-[2px] text-sm">
          {Array.from({ length: stars }).map((_, i) => (
            <FaStar
              key={i}
              className="text-yellow-400"
              style={{ color: badge.starColor === 'purple' ? 'purple' : 'gold' }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
