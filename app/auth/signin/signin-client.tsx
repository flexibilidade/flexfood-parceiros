"use client";

import { useState } from "react";
import { signIn } from "@/lib/actions/auth-actions";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Mail, Lock, User } from "lucide-react";
import Link from "next/link";

export default function SignInClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { logIn } = useAuth();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn(formData.email, formData.password);

      if (result && result.user) {
        toast.success("Login realizado com sucesso!");
        await logIn(result.user);
        router.push("/dashboard");
      } else {
        const errorMsg = "Email ou senha incorretos";
        setError(errorMsg);
        toast.error("Erro ao fazer login", {
          description: errorMsg,
        });
      }
    } catch (err) {
      console.error("Auth error:", err);
      let errorMessage = "Ocorreu um erro. Tente novamente.";

      if (err instanceof Error) {
        if (err.message.includes("credentials")) {
          errorMessage = "Email ou senha incorretos";
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
      toast.error("Erro", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50/30 to-white">
      <div className="flex items-center justify-center p-4 py-16">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">flexfood</span>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
              Bem-vindo de volta
            </h1>
            <p className="text-gray-600">Entre para gerenciar seu negócio</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6">
            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3.5 flex gap-3">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Email Authentication Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="seu@email.com"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white py-3 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
              >
                {isLoading ? "Processando..." : "Entrar"}
              </button>
            </form>

            {/* Toggle to Sign Up */}
            <div className="text-center pt-2">
              <Link
                href="/auth/signup"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Não tem uma conta?{" "}
                <span className="text-primary font-semibold">Cadastre-se</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
