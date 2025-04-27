// src/app/ref/[refferCode]/page.tsx

'use client';

import AirDropAmount from '@/components/AirDropAmount';
import RefSocial from '@/components/RefSocial';

export const dynamic = 'force-dynamic';

export default async function RefPage({
  params,
}: {
  params: Promise<{ refferCode: string }>;
}) {
  const { refferCode } = await params;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* Total de Airdrop */}
      <div className="w-full max-w-md">
        <AirDropAmount />
      </div>

      {/* Seção de compartilhamento/referral */}
      <div className="mt-8 w-full max-w-md">
        <RefSocial refferCode={refferCode} />
      </div>
    </main>
  );
}
