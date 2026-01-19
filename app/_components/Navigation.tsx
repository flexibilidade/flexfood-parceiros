"use client";

import { auth } from "@/lib/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap } from "lucide-react";

type Session = typeof auth.$Infer.Session;

export default function Navigation({ session }: { session: Session | null }) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="px-4  bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto ">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center group-hover:bg-primary/90 transition-colors">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              flexfood
            </span>
          </Link>

          <nav className="flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${isActive("/")
                ? "text-primary"
                : "text-gray-600 hover:text-gray-900"
                }`}
            >
              Início
            </Link>

            {session && (
              <Link
                href="/dashboard"
                className="bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-all"
              >
                Dashboard
              </Link>
            )}

            {!session && (
              <Link
                href="/auth/signin"
                className="text-primary border-2 border-primary px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary hover:text-white transition-all"
              >
                Entrar
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
