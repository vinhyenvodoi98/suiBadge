import type { Metadata } from "next";

import "./globals.css";
import "@mysten/dapp-kit/dist/index.css";
import Providers from "@/components/Provider";

export const metadata: Metadata = {
  title: "SuiBadge",
  description: "SuiBadge is a badge for Sui",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
