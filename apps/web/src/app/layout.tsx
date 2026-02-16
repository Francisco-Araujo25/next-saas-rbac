import "./globals.css";

import type { Metadata } from "next";

import { Providers } from "./providers";



export const metadata: Metadata = {
  title: "Brick Labs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body>
       <Providers>
          {children}
      </Providers>
      </body>
    </html>
  );
}
