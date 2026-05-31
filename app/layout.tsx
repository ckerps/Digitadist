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
  description: "Portal de gestion de ventas",
  manifest: "/manifest.webmanifest",
  icons: {
    apple: "/apple-touch-icon.png",
    icon: "/favicon-96x96.png"
  }
};

import NextTopLoader from 'nextjs-toploader';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#dc2626" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Digitadist" />
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      </head>
      <body className={`${poppins.variable} font-sans antialiased align-baseline bg-background text-foreground`}>
        <NextTopLoader color="#dc2626" showSpinner={true} />
        <SessionProvider>
          <main className="h-full flex flex-1">
            {children}
          </main>
        </SessionProvider>
        {/* Registro del Service Worker */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then(reg => console.log('[SW] Registrado:', reg.scope))
                    .catch(err => console.log('[SW] Error:', err));
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
