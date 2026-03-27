import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import SessionProvider from "./providers/SessionProvider";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Digitadist App",
  description: "Minimalist Management Portal",
};

import NextTopLoader from 'nextjs-toploader';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased align-baseline bg-background text-foreground`}>
        <NextTopLoader color="#dc2626" showSpinner={false} />
        <SessionProvider>
          <main className="h-full flex flex-1">
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
