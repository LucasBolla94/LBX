// src/app/contact/page.tsx

'use client';

import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] px-4 py-10 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">📬 Contact Us</h1>
          <p className="text-base sm:text-lg text-[var(--foreground)]/70">
            Need help or want to reach out to LBX Group? Fill in the form below and we’ll get back to you as soon as possible.
          </p>
        </header>

        <ContactForm />
      </div>
    </main>
  );
}
