// src/app/ref/[refferCode]/page.tsx

import RefSocial from "@/components/RefSocial";

export const dynamic = "force-dynamic";

export default async function RefPage({
  params,
}: {
  params: Promise<{ refferCode: string }>;
}) {
  const { refferCode } = await params;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <RefSocial refferCode={refferCode} />
    </main>
  );
}
