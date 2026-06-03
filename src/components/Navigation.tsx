"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";

export function Navigation() {
  const { data: session } = useSession();

  return (
    <nav className="border-b bg-white/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl text-red-500">
            AasaMedChem
          </Link>
          {session?.user && (
            <div className="hidden md:flex gap-4">
              {session.user.role === "ADMIN" && (
                <Link href="/admin" className="text-sm font-medium hover:text-blue-600 transition-colors">
                  Admin Dashboard
                </Link>
              )}
              {(session.user.role === "SELLER" || session.user.role === "BUYER") && (
                <Link href="/buyer" className="text-sm font-medium hover:text-blue-600 transition-colors">
                  Buyer Dashboard
                </Link>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          {session?.user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 hidden sm:inline-block">
                {session.user.email} ({session.user.role})
              </span>
              <Button variant="outline" onClick={() => signOut({ callbackUrl: "/login" })}>
                Log out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="outline">Log in</Button>
              </Link>
              <Link href="/register">
                <Button>Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
