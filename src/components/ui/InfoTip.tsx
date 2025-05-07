'use client'

import { FaInfoCircle } from 'react-icons/fa'
import { useState } from 'react'

type Props = {
  text: string
}

export default function InfoTip({ text }: Props) {
  const [show, setShow] = useState(false)

  return (
    <div className="relative inline-block ml-2">
      <FaInfoCircle
        className="text-blue-400 cursor-pointer"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      />
      {show && (
        <div className="absolute z-10 w-60 text-xs bg-black text-white p-2 rounded shadow-md top-full mt-1 left-1/2 -translate-x-1/2">
          {text}
        </div>
      )}
    </div>
  )
}
