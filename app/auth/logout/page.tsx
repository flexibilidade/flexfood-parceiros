"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

/**
 * Logout page that automatically triggers the sign-out process
 * Shows loading state and redirects to sign-in page
 */
export default function Logout() {
  const { logOut, isAuthenticated } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Trigger logout
    const performLogout = async () => {
      try {
        await logOut();
      } catch (error) {
        console.error("Logout error:", error);
        setError("Falha ao encerrar a sessão. Tente novamente.");
      }
    };

    performLogout();
  }, [logOut, router, isAuthenticated]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 px-6 bg-gradient-to-b from-background to-background/95">
      <div className="flex flex-col items-center justify-center w-full max-w-md">
        <div className="mt-12 text-center">
          <h1 className="text-xl font-bold text-foreground mb-4">
            {error ? "Erro ao encerrar a sessão" : "Encerrando sua sessão..."}
          </h1>

          {error ? (
            <div className="mb-6">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => router.push("/auth/sign-in")}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Voltar para o Login
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-4"></div>
              <p className="text-xs lg:text-sm text-muted-foreground">
                Aguarde enquanto encerramos sua sessão...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
