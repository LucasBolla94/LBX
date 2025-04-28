// src/app/api/request-withdraw/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Verificar se já existe app Firebase Admin inicializado
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const dbAdmin = getFirestore();

export async function POST(req: NextRequest) {
  try {
    const { walletAddress } = await req.json();

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet Address is required' }, { status: 400 });
    }

    const userRef = dbAdmin.collection('reffer').doc(walletAddress);
    await userRef.update({
      payrequest: true,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing withdrawal request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
