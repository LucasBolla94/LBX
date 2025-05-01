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

// Chave no localStorage para armazenar o timestamp da última visita
const VISIT_KEY = 'lbx-visit-timestamp';

// Intervalo de 3 horas em milissegundos
const THREE_HOURS_MS = 3 * 60 * 60 * 1000;

export default function VisitCounter() {
  useEffect(() => {
    const checkVisit = async () => {
      try {
        const now = Date.now();
        const lastVisit = localStorage.getItem(VISIT_KEY);

        // Se já visitou nas últimas 3 horas, não conta de novo
        if (lastVisit && now - parseInt(lastVisit, 10) < THREE_HOURS_MS) {
          return;
        }

        const totalRef = doc(db, 'visit-count', 'total');
        const snapshot = await getDoc(totalRef);

        if (!snapshot.exists()) {
          // Primeiro registro: cria o documento com valor inicial = 1
          await setDoc(totalRef, {
            value: 1,
            updatedAt: serverTimestamp(),
          });
        } else {
          const currentValue = snapshot.data().value;
          if (typeof currentValue === 'number') {
            // Incrementa o contador
            await updateDoc(totalRef, {
              value: increment(1),
              updatedAt: serverTimestamp(),
            });
          } else {
            // Corrige valor caso esteja corrompido
            await setDoc(
              totalRef,
              { value: 1, updatedAt: serverTimestamp() },
              { merge: true }
            );
          }
        }

        // Adiciona um log para auditoria
        await addDoc(collection(db, 'visit-count-logs'), {
          timestamp: serverTimestamp(),
        });

        // Atualiza timestamp da última visita no storage
        localStorage.setItem(VISIT_KEY, now.toString());
      } catch (error) {
        console.error('Falha ao registrar visita:', error);
      }
    };

    checkVisit();
  }, []);

  return null;
}
