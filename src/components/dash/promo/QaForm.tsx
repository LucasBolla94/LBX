'use client'

import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { db } from '@/app/lib/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { FaCheckCircle, FaTimesCircle, FaShieldAlt } from 'react-icons/fa'
import { formatDistanceToNow } from 'date-fns'
import CountdownTimer from './CountdownTimer'
import questions from './Questions.json'
import Image from 'next/image'

const TIMER_DURATION = 180
const MIN_CORRECT = 5
const MAX_ATTEMPTS_INTERVAL = 30 * 60 * 1000 // 30 min
const REWARD_5 = 500
const REWARD_6 = 750
const REWARD_7 = 1000
const LEVEL_REWARD = 0.5

interface Question {
  question: string
  options: string[]
  answer: string
  explanation: string
}

export default function QaForm() {
  const { publicKey } = useWallet()
  const [status, setStatus] = useState<'loading' | 'not-connected' | 'completed' | 'ready' | 'blocked'>('loading')
  const [questionsSet, setQuestionsSet] = useState<Question[]>([])
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION)
  const [cooldown, setCooldown] = useState<string | null>(null)
  const [result, setResult] = useState<number | null>(null)
  const [rewardEarned, setRewardEarned] = useState<number>(0)
  const [started, setStarted] = useState(false)

  const userId = publicKey?.toBase58()

  useEffect(() => {
    if (!publicKey || !userId) return setStatus('not-connected')

    const checkEligibility = async () => {
      const ref = doc(db, 'users', userId)
      const snap = await getDoc(ref)
      if (!snap.exists()) return setStatus('not-connected')

      const data = snap.data()
      if (data['qa-test'] === true) return setStatus('completed')

      const lastTryKey = Object.keys(data)
        .filter(k => k.startsWith('qa-promo:'))
        .sort()
        .reverse()[0]

      if (lastTryKey) {
        const lastTimestamp = new Date(lastTryKey.split('qa-promo:')[1])
        const now = Date.now()
        if (now - lastTimestamp.getTime() < MAX_ATTEMPTS_INTERVAL) {
          const diff = formatDistanceToNow(lastTimestamp.getTime() + MAX_ATTEMPTS_INTERVAL, { addSuffix: true })
          setCooldown(diff)
          return setStatus('blocked')
        }
      }

      const shuffled = [...questions].sort(() => 0.5 - Math.random()).slice(0, 7)
      setQuestionsSet(shuffled)
      setStatus('ready')
    }

    checkEligibility()
  }, [publicKey, userId])

  useEffect(() => {
    if (status !== 'ready' || result !== null || !started) return
    if (timeLeft <= 0) window.location.reload()
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearTimeout(timer)
  }, [timeLeft, status, result, started])

  const handleCheck = () => {
    if (!selected) return
    const currentQuestion = questionsSet[current]
    const isCorrectAnswer = selected === currentQuestion.answer
    setIsCorrect(isCorrectAnswer)
    setShowResult(true)
    setAnswers([...answers, selected])
  }

  const handleNext = () => {
    setSelected(null)
    setShowResult(false)
    setIsCorrect(null)
    if (current + 1 < questionsSet.length) {
      setCurrent(current + 1)
    } else {
      evaluateFinal()
    }
  }

  const evaluateFinal = async () => {
    const correctCount = answers.filter((ans, idx) => ans === questionsSet[idx].answer).length
    const scorePercentage = Math.round((correctCount / questionsSet.length) * 100)
    setResult(scorePercentage)

    if (!userId) return

    const ref = doc(db, 'users', userId)
    const snap = await getDoc(ref)
    const data = snap.data() || {}
    const timestampKey = `qa-promo:${new Date().toISOString()}`

    await updateDoc(ref, {
      [timestampKey]: true,
    })

    if (correctCount >= MIN_CORRECT) {
      const reward =
        correctCount === 5 ? REWARD_5 :
        correctCount === 6 ? REWARD_6 : REWARD_7
      setRewardEarned(reward)

      await updateDoc(ref, {
        promobalance: (data.promobalance || 0) + reward,
        level: (data.level || 0) + LEVEL_REWARD,
        'qa-test': true,
      })
    }
  }

  if (status === 'loading') return <div>Loading...</div>
  if (status === 'not-connected') return <div className="text-red-500">🔌 Please connect your wallet.</div>

  if (status === 'completed') {
    return (
      <div className="p-6 max-w-xl mx-auto text-center rounded border shadow"
        style={{ background: 'var(--background)', color: 'var(--foreground)', borderColor: 'var(--border)' }}>
        <FaShieldAlt className="text-4xl text-green-600 mx-auto mb-4 animate-bounce" />
        <h2 className="text-2xl font-bold">✅ Quiz Already Completed</h2>
        <p className="mt-2 text-green-700 font-medium">You already passed the test!</p>
        <p className="text-sm mt-1 text-gray-600">You&apos;re now prepared for the next missions. 🧠🚀</p>
      </div>
    )
  }

  if (status === 'blocked') {
    return (
      <div className="text-yellow-600 text-center font-medium">
        ⏳ You can try again {cooldown}
        <CountdownTimer />
      </div>
    )
  }

  // 🟢 INTRO BEFORE QUIZ START
  if (!started) {
    return (
      <div className="p-6 max-w-xl mx-auto text-center rounded border shadow space-y-4"
        style={{ background: 'var(--background)', color: 'var(--foreground)', borderColor: 'var(--border)' }}>
        <FaShieldAlt className="text-4xl text-blue-500 mx-auto" />
        <h1 className="text-2xl font-bold">Blockchain Security Quiz 🔐</h1>
        <p className="text-sm text-gray-500">
          This short quiz is designed to help beginners understand the basics of blockchain safety.
          Answer the questions correctly and earn <strong>$LBXO</strong> as a reward!<br />
          You must get at least 5 out of 7 questions right to pass. You have 3 minutes ⏱️.
        </p>
        <button
          onClick={() => setStarted(true)}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          ▶️ Start
        </button>
      </div>
    )
  }

  const currentQ = questionsSet[current]

  if (result !== null) {
    return (
      <div className="relative p-6 max-w-xl mx-auto text-center rounded border shadow overflow-hidden"
        style={{
          backgroundImage: result >= 71 ? 'url(/shield.png)' : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: 'var(--background)',
          color: 'var(--foreground)',
          borderColor: 'var(--border)'
        }}
      >
        {result >= 71 ? (
          <>
            <Image
              src="/logo-lbxo.png"
              alt="LBXO"
              width={64}
              height={64}
              className="mx-auto mb-4 animate-pulse"
            />
            <h2 className="text-2xl font-bold mb-2 text-green-600">🎉 Test Passed!</h2>
            <p className="text-lg font-medium">You earned:</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{rewardEarned} $LBXO</p>
            <p className="text-sm mt-2 text-white/80">+0.50 Level gained!</p>
            <p className="text-sm mt-1 text-white/60">Keep going to unlock more rewards!</p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-2">📊 Final Result</h2>
            <div className="text-4xl font-extrabold text-blue-600">{result} / 100</div>
            <div className="text-red-600 flex flex-col items-center gap-2 mt-3">
              <p className="flex items-center gap-2 text-lg">
                <FaTimesCircle /> You got less than 5 correct. Minimum score: 71/100
              </p>
              <p className="text-sm">
                Study more at: <a href="https://lbxgroup.online/learn/" className="underline text-blue-500">lbxgroup.online/learn</a>
              </p>
              <p className="text-sm mt-2">⏳ You can try again in:</p>
              <CountdownTimer />
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="p-4 max-w-xl mx-auto rounded shadow space-y-4"
      style={{ background: 'var(--background)', color: 'var(--foreground)', borderColor: 'var(--border)' }}>

      <div className="text-sm text-right text-gray-600">
        ⏱️ Time left: <strong>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</strong>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">📘 Question {current + 1}:</h2>
        <p className="text-base font-medium mb-3">{currentQ.question}</p>

        <div className="grid gap-3">
          {currentQ.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => setSelected(opt)}
              className={`px-4 py-2 rounded border transition-all duration-150 text-left w-full ${
                selected === opt
                  ? 'ring-2 ring-blue-500 font-semibold shadow-md'
                  : 'hover:bg-[rgba(0,0,0,0.05)]'
              }`}
              style={{
                backgroundColor: selected === opt ? 'var(--background)' : 'transparent',
                color: 'var(--foreground)',
                borderColor: 'var(--border)',
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {!showResult && (
        <button
          onClick={handleCheck}
          disabled={!selected}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          ✅ Check Answer
        </button>
      )}

      {showResult && (
        <div className="space-y-4 mt-4">
          <div className={`p-4 rounded ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            <div className="flex items-center gap-2 font-semibold">
              {isCorrect ? <FaCheckCircle /> : <FaTimesCircle />}
              {isCorrect ? 'Correct!' : 'Wrong! The correct answer is:'}
            </div>
            {!isCorrect && <p className="mt-1"><strong>{currentQ.answer}</strong></p>}
            <p className="mt-2 text-sm">{currentQ.explanation}</p>
          </div>
          <button
            onClick={handleNext}
            className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-900 transition"
          >
            👉 Next Question
          </button>
        </div>
      )}
    </div>
  )
}
