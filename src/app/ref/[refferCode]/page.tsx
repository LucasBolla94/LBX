import RefSocial from "@/components/RefSocial";

interface RefPageProps {
  params: {
    refferCode: string;
  };
}

export default function RefPage({ params }: RefPageProps) {
  const { refferCode } = params;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <RefSocial refferCode={refferCode} />
    </main>
  );
}
