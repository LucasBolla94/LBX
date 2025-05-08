'use client'
import { useEffect, useState } from 'react'

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(1800) // 30 min

  useEffect(() => {
    if (timeLeft <= 0) return
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  if (timeLeft <= 0) {
    return (
      <button
        onClick={() => window.location.reload()}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        🔁 Try Again
      </button>
    )
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = (timeLeft % 60).toString().padStart(2, '0')

  return <div className="text-xl font-mono">{minutes}:{seconds}</div>
}
