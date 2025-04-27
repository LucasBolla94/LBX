import RefSocial from "@/components/RefSocial";

export default function RefPage({ params }: { params: { refferCode: string } }) {
  const { refferCode } = params;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <RefSocial refferCode={refferCode} />
    </main>
  );
}
