'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { FaBullhorn, FaBell } from 'react-icons/fa';

type NewsItem = {
  id: string;
  content: string;
  dateStamp: string;
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function NewsHome() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'NewsUpdate'));
        const allNews = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as NewsItem[];

        const now = new Date();
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(now.getDate() - 30);

        const recentNews = allNews
          .filter((item) => new Date(item.dateStamp) >= thirtyDaysAgo)
          .sort((a, b) => new Date(b.dateStamp).getTime() - new Date(a.dateStamp).getTime())
          .slice(0, 5);

        setNews(recentNews);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const hasNews = news.length > 0;

  return (
    <section className={`w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 transition-all duration-500
      ${hasNews && !isOpen ? 'animate-pulse bg-purple-700/10' : 'bg-[var(--background)]'}
      border border-[var(--border)] rounded-3xl shadow-md`}>
      
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-3 text-[var(--foreground)]">
          <FaBullhorn className="text-xl sm:text-2xl text-yellow-500" />
          <h2 className="text-xl sm:text-2xl font-bold">Latest Updates</h2>
        </div>
        {hasNews && (
          <span className="text-sm sm:text-base font-medium text-purple-500 animate-bounce">
            {isOpen ? 'Hide' : 'Show'} Notifications
          </span>
        )}
      </div>

      {isOpen && (
        <div className="mt-6">
          {loading ? (
            <p className="text-[var(--foreground)]/70">Loading news...</p>
          ) : news.length === 0 ? (
            <p className="text-[var(--foreground)]/70">No recent updates in the last 30 days.</p>
          ) : (
            <ul className="space-y-6">
              {news.map((item) => (
                <li
                  key={item.id}
                  className="bg-[var(--background)] border border-[var(--border)] rounded-xl p-4 sm:p-5 hover:shadow transition-all"
                >
                  <div className="flex items-start gap-3 text-[var(--foreground)]">
                    <FaBell className="mt-1 text-yellow-400" />
                    <p className="text-base sm:text-lg">{item.content}</p>
                  </div>
                  <p className="mt-2 text-xs sm:text-sm text-[var(--foreground)]/50 text-right">
                    {formatDate(item.dateStamp)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
