'use client'

import React from 'react'
import Image from 'next/image'
import { FaStar } from 'react-icons/fa'
import HistoryBadge from './HistoryBadge' // Componente com lore/história

const badges = [
  {
    id: 1,
    name: 'Stardust',
    levelRange: 'Lv. 0 → 9.999',
    stars: 5,
    image: '/badges/badge01.png',
  },
  {
    id: 2,
    name: 'Explorer',
    levelRange: 'Lv. 10 → 29.999',
    stars: 5,
    image: '/badges/badge02.png',
  },
  {
    id: 3,
    name: 'Starborn',
    levelRange: 'Lv. 30 → 79.999',
    stars: 5,
    image: '/badges/badge03.png',
  },
  {
    id: 4,
    name: 'Nova Core',
    levelRange: 'Lv. 80 → 179.999',
    stars: 5,
    image: '/badges/badge04.png',
  },
  {
    id: 5,
    name: 'Cosmos Overlord',
    levelRange: 'Lv. 180 → 499.999',
    stars: 5,
    image: '/badges/badge05.png',
  },
  {
    id: 6,
    name: 'Celestial Apex',
    levelRange: 'Lv. 500 → 999.999',
    stars: 5,
    image: '/badges/badge06.png',
  },
  {
    id: 7,
    name: 'Quantum Ascendant',
    levelRange: 'Lv. 1.000.000 → ∞',
    stars: 5,
    image: '/badges/badge07.png',
  },
  {
    id: 99,
    name: 'Infinity Warden',
    levelRange: 'Exclusive – Moderators',
    stars: 1,
    image: '/badges/badgemod.png',
    starColor: 'purple',
  },
  {
    id: 100,
    name: 'Aether',
    levelRange: 'Founders Only',
    stars: 3,
    image: '/badges/badgefounder.png',
    starColor: 'purple',
  },
]

const BadgeTable = () => {
  return (
    <div
      style={{
        background: 'var(--background)',
        color: 'var(--foreground)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '1.5rem',
        overflowX: 'auto',
      }}
    >
      {/* História da badge */}
      <HistoryBadge />

      {/* Explicação para iniciantes */}
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '1rem' }}>
          🎖️ <strong>Badges</strong> representam sua evolução no universo LBXO.
          Cada badge possui <strong>5 níveis internos</strong>, representados por ⭐ estrelas.
          <br />
          <br />
          Por exemplo: se você tiver <code>lvl 2.581</code>, isso significa que você está na badge <strong>Stardust</strong>, com <strong>2 estrelas</strong> completas.
        </p>
      </div>

      {/* Tabela de badges */}
      <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>🪐 Badge Levels</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Badge</th>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Level Name</th>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Lv. Range</th>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>⭐ Stars</th>
          </tr>
        </thead>
        <tbody>
          {badges.map((badge) => (
            <tr
              key={badge.id}
              style={{
                borderBottom: '1px solid var(--border)',
              }}
            >
              <td style={{ padding: '0.5rem' }}>
                <div style={{ width: '40px', height: '40px', position: 'relative' }}>
                  <Image
                    src={badge.image}
                    alt={badge.name}
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </td>
              <td style={{ padding: '0.5rem' }}>{badge.name}</td>
              <td style={{ padding: '0.5rem' }}>{badge.levelRange}</td>
              <td style={{ padding: '0.5rem', display: 'flex', gap: '4px' }}>
                {Array.from({ length: badge.stars }).map((_, i) => (
                  <FaStar
                    key={i}
                    size={16}
                    color={badge.starColor === 'purple' ? 'purple' : 'gold'}
                  />
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default BadgeTable
