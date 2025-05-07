'use client'

import React from 'react'
import { FiInfo } from 'react-icons/fi'

export default function RegisterWarning() {
  return (
    <div className="w-full border border-[var(--border)] bg-[var(--background)] rounded-lg p-4 sm:p-5 shadow-md mb-4 flex items-start gap-3 text-sm sm:text-base text-[var(--foreground)]/90">
      <FiInfo className="text-xl sm:text-2xl mt-0.5 text-blue-500" />
      <div>
        <p className="font-medium mb-1">About the Registration</p>
        <p>
          This registration does not store any sensitive or private information. We only link your public wallet
          address to a public profile.
        </p>
        <p className="mt-2">
          All data you provide (such as nickname and social links) is public and visible on your profile.
        </p>
      </div>
    </div>
  )
}
