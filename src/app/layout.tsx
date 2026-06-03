import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NextAuthProvider from "@/components/NextAuthProvider";
import { Navigation } from "@/components/Navigation";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AasaMedChem Inventory & Orders",
  description: "Manage your medical inventory efficiently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-slate-50`}>
        <NextAuthProvider>
          <Navigation />
          <main className="container mx-auto p-4 md:p-8">
            {children}
          </main>
          <Toaster />
        </NextAuthProvider>
      </body>
    </html>
  );
}
