'use client';

import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Stake from '@/components/help/Stake';
import type { ReactNode } from 'react';

type HelpSection = {
  title: string;
  content: ReactNode;
};

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const sections: HelpSection[] = [
    {
      title: '📈 What is Staking?',
      content: <Stake />
    },
    // Add more components here:
    // { title: '💸 How to Farm', content: <Farm /> }
  ];

  const toggleSection = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold">🧠 Help & Tutorials</h1>
          <p className="mt-2 text-base sm:text-lg text-[var(--foreground)]/70">
            Learn how to use the LBX platform step by step. Simple guides for all experience levels.
          </p>
        </header>

        <div className="space-y-4">
          {sections.map((section, index) => (
            <div key={index} className="border border-[var(--border)] rounded-xl overflow-hidden">
              <button
                onClick={() => toggleSection(index)}
                className="w-full flex justify-between items-center px-4 sm:px-6 py-4 sm:py-5 bg-[var(--background)] hover:bg-[var(--border)]/10 text-left transition-colors"
              >
                <span className="text-lg sm:text-xl font-semibold">{section.title}</span>
                {openIndex === index ? (
                  <FaChevronUp className="text-sm sm:text-base" />
                ) : (
                  <FaChevronDown className="text-sm sm:text-base" />
                )}
              </button>

              {openIndex === index && (
                <div className="border-t border-[var(--border)] bg-[var(--background)]">
                  <div className="px-4 sm:px-6 py-6">{section.content}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
