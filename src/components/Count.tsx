'use client';

import { useEffect } from 'react';
import { db } from '@/app/lib/firebase';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  increment,
  collection,
  addDoc
} from 'firebase/firestore';

const VISIT_KEY = 'lbx-visit-timestamp';
const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

export default function VisitCounter() {
  useEffect(() => {
    const checkVisit = async () => {
      try {
        const now = Date.now();
        const lastVisit = localStorage.getItem(VISIT_KEY);

        // Se já visitou nas últimas 6h, não conta de novo
        if (lastVisit && now - parseInt(lastVisit, 10) < SIX_HOURS_MS) {
          return;
        }

        const totalRef = doc(db, 'visit-count', 'total');
        const snapshot = await getDoc(totalRef);

        if (!snapshot.exists()) {
          // Cria com valor inicial e timestamp
          await setDoc(totalRef, {
            value: 1,
            updatedAt: serverTimestamp(),
          });
        } else {
          const currentValue = snapshot.data().value;
          if (typeof currentValue === 'number') {
            await updateDoc(totalRef, {
              value: increment(1),
              updatedAt: serverTimestamp(),
            });
          } else {
            // Corrige valor corrompido
            await setDoc(
              totalRef,
              { value: 1, updatedAt: serverTimestamp() },
              { merge: true }
            );
          }
        }

        // Adiciona um documento de log em 'visit-count-logs' para facilitar visualização
        await addDoc(collection(db, 'visit-count-logs'), {
          timestamp: serverTimestamp(),
        });

        // Salva timestamp local para limitar visitas
        localStorage.setItem(VISIT_KEY, now.toString());
      } catch (error) {
        console.error('Failed to count visit:', error);
      }
    };

    checkVisit();
  }, []);

  return null;
}
