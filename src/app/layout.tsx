import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import "@mysten/dapp-kit/dist/index.css";
import Providers from "@/components/Provider";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "SuiBadge - Digital Badges on Sui",
  description: "Create and manage digital badges on Sui blockchain",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200 relative overflow-hidden">
          {/* Water wave animation */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -bottom-1/2 left-0 w-full h-1/2 bg-blue-400 opacity-20 animate-wave"></div>
            <div className="absolute -bottom-1/3 left-0 w-full h-1/3 bg-blue-300 opacity-20 animate-wave-delayed"></div>
            <div className="absolute -bottom-1/4 left-0 w-full h-1/4 bg-blue-200 opacity-20 animate-wave-more-delayed"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10">
            <Providers>
              {children}
            </Providers>
          </div>
        </div>
      </body>
    </html>
  );
}
