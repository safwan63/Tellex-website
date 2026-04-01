import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tellex – Your Next Book, Curated for You",
  description: "Tellex curates books based on your vibe using intelligent systems and human care. Discover Vibe Pick, Mystery Pick, and Direct Pick.",
};

import { AuthProvider } from '../context/AuthContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Poppins:wght@300;400;600;700&family=Inter:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

