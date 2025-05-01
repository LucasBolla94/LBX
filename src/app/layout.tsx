import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import WalletContextProvider from "../context/WalletContext";

// Componentes do layout
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

// Configura a fonte Inter como variável CSS (--font-sans)
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LBX Group",
  description: "A powerful community built on Solana blockchain.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <WalletContextProvider>
          <div className="flex flex-col min-h-screen">
            <NavBar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </WalletContextProvider>
      </body>
    </html>
  );
}
