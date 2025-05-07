'use client'

import {
  FaDiscord,
  FaTelegramPlane,
  FaTwitter,
  FaCoins,
  FaUserCircle,
} from 'react-icons/fa'
import Image from 'next/image'
import { useState } from 'react'
import BadgeRead from '../dash/BadgeRead'
import LbxoBalance from '../dash/LbxoBalance'

function normalizeUrl(url: string): string {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`
  }
  return url
}

type Props = {
  user?: {
    ['perfil-img']?: string
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
}

export default function UserDetails({ user }: Props) {
  const [imgError, setImgError] = useState(false)

  if (!user) {
    return (
      <div className="text-center text-sm text-[var(--foreground)]/60 p-4 border rounded-md">
        User not registered yet.
      </div>
    )
  }

  const formattedDate = new Date(user.dateStamp).toLocaleDateString()
  const formattedFullDate = new Date(user.dateStamp).toLocaleString()

  const getStars = (level: number): number => {
    if (level >= 500_000) return 6
    if (level >= 180_000) return 5
    if (level >= 80_000) return 4
    if (level >= 30_000) return 3
    if (level >= 10_000) return 2
    return 1
  }

  const stars = getStars(user.level ?? 0)

  return (
    <div className="w-full max-w-3xl mx-auto bg-[var(--background)] border border-[var(--border)] rounded-xl shadow-md p-6 space-y-6 transition-all duration-300">
      {/* Avatar + Nick */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {user['perfil-img'] && !imgError ? (
          <div className="relative w-24 h-24">
            <Image
              src={user['perfil-img']}
              alt={`${user.nick} avatar`}
              width={96}
              height={96}
              className="rounded-full border border-[var(--border)] object-cover"
              onError={() => setImgError(true)}
              priority
            />
          </div>
        ) : (
          <FaUserCircle className="w-24 h-24 text-[var(--foreground)]/40" />
        )}

        <div className="text-center sm:text-left">
          <h2 className="text-xl font-bold text-[var(--foreground)]">{user.nick}</h2>
          <p className="text-sm text-[var(--foreground)]/60">
            Registered on: {formattedFullDate}
          </p>
        </div>
      </div>

      {/* Badge + Stars + Balance */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <InfoCard
          label={
            <div className="flex flex-col items-center justify-center gap-1">
              <BadgeRead level={user.level} />
              <div className="text-yellow-400 flex justify-center gap-0.5 text-sm mt-1">
                {Array.from({ length: stars }).map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
            </div>
          }
          value=""
        />

        <InfoCard label="Holder Since" value={formattedDate} />

        <InfoCard
          label={
            <span className="flex items-center justify-center gap-1">
              <FaCoins /> Balance
            </span>
          }
          value={<LbxoBalance user={user} />}
        />
      </div>

      {/* Social Links */}
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-[var(--foreground)]/70">Social</h3>
        <div className="flex flex-wrap gap-4">
          {user.social?.discord && (
            <SocialLink
              href={normalizeUrl(user.social.discord)}
              icon={<FaDiscord className="text-blue-400" />}
              label="Discord"
            />
          )}
          {user.social?.telegram && (
            <SocialLink
              href={normalizeUrl(user.social.telegram)}
              icon={<FaTelegramPlane className="text-sky-400" />}
              label="Telegram"
            />
          )}
          {user.social?.x && (
            <SocialLink
              href={normalizeUrl(user.social.x)}
              icon={<FaTwitter className="text-white" />}
              label="X (Twitter)"
            />
          )}
        </div>
      </div>
    </div>
  )
}

// InfoCard
function InfoCard({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="bg-[var(--border)]/10 rounded-md p-4 shadow-sm hover:shadow transition text-[var(--foreground)]">
      <div className="text-xs text-[var(--foreground)]/60 mb-1">{label}</div>
      <div className="text-lg font-bold text-center">{value}</div>
    </div>
  )
}

// SocialLink
function SocialLink({
  href,
  icon,
  label,
}: {
  href: string
  icon: React.ReactNode
  label: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex items-center gap-2 text-sm text-[var(--foreground)] hover:text-blue-400 transition"
    >
      {icon}
      {label}
    </a>
  )
}
