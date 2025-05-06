'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { FaPaperPlane } from 'react-icons/fa';

export default function ContactForm() {
  const { publicKey, connected } = useWallet();

  const [form, setForm] = useState({
    name: '',
    title: '',
    email: '',
    telegram: '',
    message: '',
  });
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (connected && publicKey) {
      setWalletAddress(publicKey.toBase58());
    } else {
      setWalletAddress('');
    }
  }, [connected, publicKey]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, walletAddress }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('✅ Message sent successfully! Please allow up to 5 business days for a reply.');
        setForm({ name: '', title: '', email: '', telegram: '', message: '' });
      } else {
        setError(data.error || '❌ Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('❌ Unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full max-w-2xl mx-auto bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-3xl shadow-md px-6 py-10">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">📬 Contact LBX Group</h2>
      <p className="text-center text-sm sm:text-base text-[var(--foreground)]/70 mb-8">
        Fill out the form below to get in touch. Whether it&apos;s about partnerships, community, support or feedback — we&apos;re here to help.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-[var(--border)] rounded-xl bg-[var(--background)] text-[var(--foreground)] focus:outline-none"
        />

        <select
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-[var(--border)] rounded-xl bg-[var(--background)] text-[var(--foreground)] focus:outline-none"
        >
          <option value="" disabled>Select subject...</option>
          <option value="General Inquiry">📌 General Inquiry</option>
          <option value="Partnerships & Business">🤝 Partnerships & Business</option>
          <option value="Community & Holders">👥 Community & Holders</option>
          <option value="Technical Support">🛠️ Technical Support</option>
          <option value="Payments & Finance">💰 Payments & Finance</option>
          <option value="Legal & Compliance">⚖️ Legal & Compliance</option>
        </select>

        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-[var(--border)] rounded-xl bg-[var(--background)] text-[var(--foreground)] focus:outline-none"
        />
        <input
          type="text"
          name="telegram"
          placeholder="Telegram @username (optional)"
          value={form.telegram}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-[var(--border)] rounded-xl bg-[var(--background)] text-[var(--foreground)] focus:outline-none"
        />

        <div className="text-sm sm:text-base text-[var(--foreground)]/70 mb-2">
          Wallet Address:
          <span className="ml-1 font-mono text-[var(--foreground)]">
            {walletAddress || <span className="text-red-500">Not connected</span>}
          </span>
        </div>

        <textarea
          name="message"
          placeholder="Write your message here..."
          value={form.message}
          onChange={handleChange}
          required
          rows={5}
          className="w-full px-4 py-3 border border-[var(--border)] rounded-xl bg-[var(--background)] text-[var(--foreground)] resize-none focus:outline-none"
        />

        <button
          type="submit"
          disabled={loading || !walletAddress}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 rounded-full hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaPaperPlane className="text-lg" />
          {loading ? 'Sending...' : 'Send Message'}
        </button>

        {success && (
          <div className="bg-green-500/10 border border-green-500 text-green-600 px-4 py-3 rounded-xl text-sm sm:text-base text-center">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-600 px-4 py-3 rounded-xl text-sm sm:text-base text-center">
            {error}
          </div>
        )}
      </form>
    </section>
  );
}
